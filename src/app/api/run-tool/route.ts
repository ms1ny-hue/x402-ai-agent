import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { withPayment } from "x402-mcp";
import { getOrCreatePurchaserAccount } from "@/lib/accounts";
import { env } from "@/lib/env";
import { z } from "zod";

export const maxDuration = 30;

const RequestSchema = z.discriminatedUnion("tool", [
  z.object({
    tool: z.literal("get_equity_research"),
    args: z.object({ ticker: z.string().min(1).max(8) }),
  }),
  z.object({
    tool: z.literal("get_market_commentary"),
    args: z.object({ sector: z.string().min(1) }),
  }),
  z.object({
    tool: z.literal("run_mini_backtest"),
    args: z.object({
      ticker: z.string().min(1).max(8),
      strategy: z.string().min(1),
    }),
  }),
  z.object({
    tool: z.literal("ping_agent"),
    args: z.object({}).optional(),
  }),
]);

const PRICES: Record<string, { atomic: number; usdc: number }> = {
  get_equity_research: { atomic: 5000, usdc: 0.005 },
  get_market_commentary: { atomic: 3000, usdc: 0.003 },
  run_mini_backtest: { atomic: 10000, usdc: 0.01 },
  ping_agent: { atomic: 0, usdc: 0 },
};

interface ToolWithExecute {
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

function hasExecute(value: unknown): value is ToolWithExecute {
  return (
    typeof value === "object" &&
    value !== null &&
    "execute" in value &&
    typeof (value as { execute: unknown }).execute === "function"
  );
}

interface PaymentRequirements {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra?: unknown;
  outputSchema?: Record<string, unknown>;
}

interface PaymentResponseMeta {
  success?: boolean;
  transaction?: string;
  network?: string;
  payer?: string;
}

interface ToolCallResult {
  content?: Array<{ type: string; text: string }>;
  isError?: boolean;
  structuredContent?: {
    x402Version?: number;
    error?: string;
    accepts?: PaymentRequirements[];
  };
  _meta?: {
    "x402.payment-response"?: PaymentResponseMeta;
  };
}

function isPaymentRequiredResult(value: unknown): value is ToolCallResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as ToolCallResult;
  return (
    v.isError === true &&
    Array.isArray(v.structuredContent?.accepts) &&
    v.structuredContent.accepts.length > 0
  );
}

function asToolCallResult(value: unknown): ToolCallResult {
  if (typeof value === "object" && value !== null) {
    return value as ToolCallResult;
  }
  return { content: [{ type: "text", text: String(value) }] };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_json", message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { tool, args } = parsed.data;
  const toolArgs = (args ?? {}) as Record<string, unknown>;

  const account = await getOrCreatePurchaserAccount();

  const mcpClient = await createMCPClient({
    transport: new StreamableHTTPClientTransport(new URL("/mcp", env.URL)),
  }).then((client) => withPayment(client, { account, network: env.NETWORK }));

  try {
    const tools = await mcpClient.tools();
    const target = (tools as Record<string, unknown>)[tool];
    const generateAuthTool = (tools as Record<string, unknown>)[
      "generatePaymentAuthorization"
    ];

    if (!hasExecute(target)) {
      return Response.json(
        { error: "tool_not_found", tool },
        { status: 404 },
      );
    }

    const start = Date.now();

    // Step 1: initial call, may return 402 for paid tools.
    const firstResult = await target.execute(toolArgs);
    const firstParsed = asToolCallResult(firstResult);

    let finalResult: ToolCallResult = firstParsed;
    let paid = false;

    if (isPaymentRequiredResult(firstResult)) {
      if (!hasExecute(generateAuthTool)) {
        return Response.json(
          {
            error: "payment_required_no_auth_tool",
            message:
              "Tool requires payment but generatePaymentAuthorization is unavailable.",
          },
          { status: 500 },
        );
      }
      const requirements = firstParsed.structuredContent!.accepts![0];

      // Step 2: sign EIP-3009 authorization off-chain.
      const authResultRaw = await generateAuthTool.execute({
        paymentRequirements: requirements,
      });
      const authResult = authResultRaw as { paymentAuthorization?: string };
      if (!authResult?.paymentAuthorization) {
        return Response.json(
          {
            error: "payment_authorization_failed",
            message: "generatePaymentAuthorization returned no auth string.",
          },
          { status: 500 },
        );
      }

      // Step 3: retry with payment header; this triggers facilitator settlement.
      const settledRaw = await target.execute({
        ...toolArgs,
        paymentAuthorization: authResult.paymentAuthorization,
      });
      finalResult = asToolCallResult(settledRaw);
      paid = true;

      if (finalResult.isError) {
        return Response.json(
          {
            error: "settlement_failed",
            message: "Paid retry returned an error result.",
            tool,
            details: finalResult,
          },
          { status: 502 },
        );
      }
    }

    const elapsedMs = Date.now() - start;

    const paymentMeta = finalResult._meta?.["x402.payment-response"];
    const transactionHash = paymentMeta?.transaction;
    const textContent = finalResult.content?.[0]?.text;

    return Response.json({
      tool,
      args: toolArgs,
      price: PRICES[tool],
      network: env.NETWORK,
      buyerAddress: account.address,
      paid,
      transactionHash,
      content: textContent,
      result: finalResult,
      elapsedMs,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json(
      { error: "tool_execution_failed", message },
      { status: 500 },
    );
  } finally {
    try {
      await mcpClient.close();
    } catch {
      // closing best-effort
    }
  }
}
