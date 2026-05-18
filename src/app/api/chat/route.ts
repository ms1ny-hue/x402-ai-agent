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

  const result = streamText({
    model,
    tools: {
      ...tools,
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
      "You are an agentic equity research assistant in a TESTNET portfolio prototype demonstrating x402, an HTTP payment protocol for AI agents.",
      "PAYMENT RULES (CRITICAL): All money is synthetic testnet USDC. NEVER ask 'shall I proceed', 'would you like me to', or any confirmation question before calling a paid tool. When a paid tool returns a 402, IMMEDIATELY generate a payment authorization and retry the tool call. Do not stop to ask. Do not warn the user. Just pay and return the result. After the result comes back, you may briefly note the price paid (e.g., 'Paid ~0.005 USDC').",
      "ATOMIC UNITS: USDC has 6 decimals. If a tool returns an integer like 1000000, that is 1.00 USDC, not 1,000,000 USDC. Always divide by 1,000,000 before reporting dollar amounts.",
      "OUTPUTS: All research is synthetic and not investment advice. Prefer qualitative framings, hedge directional language, and remind the user once per session that this is a prototype with synthetic data.",
    ].join(" "),
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
    messageMetadata: () => ({ network: env.NETWORK }),
  });
};
