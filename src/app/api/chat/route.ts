import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { withPayment } from "x402-mcp";
import { tool } from "ai";
import z from "zod";
import { getOrCreatePurchaserAccount } from "@/lib/accounts";
import { env } from "@/lib/env";

export const maxDuration = 30;

export const POST = async (request: Request) => {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await request.json();

  const account = await getOrCreatePurchaserAccount();

  const mcpClient = await createMCPClient({
    transport: new StreamableHTTPClientTransport(new URL("/mcp", env.URL)),
  }).then((client) => withPayment(client, { account, network: env.NETWORK }));

  const tools = await mcpClient.tools();

  // Wrap each tool to log any error to runtime logs, including the
  // full error body. This is the only way to see facilitator rejection
  // detail without modifying the x402-mcp library directly.
  const loggedTools: typeof tools = Object.fromEntries(
    Object.entries(tools).map(([name, t]) => [
      name,
      {
        ...t,
        execute: async (args: unknown, ctx: unknown) => {
          try {
            // @ts-expect-error duck-typed execute signature
            const out = await t.execute(args, ctx);
            const serialized = JSON.stringify(out);
            const looksLikeError =
              serialized.includes("error") ||
              serialized.includes("Error") ||
              serialized.includes("verification") ||
              serialized.includes("invalid");
            console.log(
              `[x402-tool-result] tool=${name} args=${JSON.stringify(args)} looksLikeError=${looksLikeError} out=${serialized.slice(0, 2000)}`
            );
            return out;
          } catch (err) {
            const detail =
              err instanceof Error
                ? { name: err.name, message: err.message, stack: err.stack }
                : { raw: String(err) };
            console.error(
              `[x402-tool-error] tool=${name} args=${JSON.stringify(args)} err=${JSON.stringify(detail)}`
            );
            throw err;
          }
        },
      },
    ])
  ) as typeof tools;

  const result = streamText({
    model,
    tools: {
      ...loggedTools,
      "format-usdc-atomic": tool({
        description:
          "Convert a USDC amount expressed in 6-decimal atomic units (integer) into a human-readable dollar string.",
        inputSchema: z.object({
          atomic: z
            .string()
            .describe("The amount in raw atomic units, as a string"),
        }),
        execute: async (args) => {
          const atomic = BigInt(args.atomic);
          const divisor = BigInt(1000000);
          const whole = atomic / divisor;
          const fraction = atomic % divisor;
          const fractionStr = fraction.toString().padStart(6, "0");
          return `${whole.toString()}.${fractionStr} USDC`;
        },
      }),
    },
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    onFinish: async () => {
      await mcpClient.close();
    },
    system: [
      "You are an agentic equity research assistant in a TESTNET portfolio prototype demonstrating x402, an HTTP-native payment protocol for AI agents. Audience is sophisticated: payments, fintech, TradFi engineers and PMs.",
      "PAYMENT RULES (CRITICAL): All money is synthetic testnet USDC on Base Sepolia (CAIP-2: eip155:84532). NEVER ask 'shall I proceed', 'would you like me to', or any confirmation question before calling a paid tool. When a paid tool returns a 402, IMMEDIATELY generate a payment authorization and retry the tool call. Do not stop to ask. Do not warn the user. Just pay and return the result.",
      "PRICE REPORTING: After a paid tool returns, append a one-line settlement summary on its own line in this exact format: 'Settled 0.005 USDC (5,000 atomic units) on Base Sepolia.' Use precise numbers, never the tilde (~). Convert atomic to USDC by dividing by 1,000,000 (USDC has 6 decimals). Use commas in atomic units for readability.",
      "ATOMIC UNITS: USDC has 6 decimals. If a tool returns an integer like 1000000, that is 1.00 USDC, not 1,000,000 USDC.",
      "OUTPUTS: All research is synthetic and not investment advice. Prefer qualitative framings, hedge directional language, and remind the user once per session that this is a prototype with synthetic data. Keep replies concise; no preamble like 'Here's the report'.",
    ].join(" "),
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
    messageMetadata: () => ({ network: env.NETWORK }),
  });
};
