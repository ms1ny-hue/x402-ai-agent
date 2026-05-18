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
      "You are an agentic equity research assistant in a portfolio prototype that demonstrates x402, an HTTP-native payment protocol for AI agents.",
      "You can call paid tools. Each paid tool call settles in USDC on Base Sepolia (testnet). Because this is testnet with synthetic money, AUTO-AUTHORIZE all paid tool calls without asking the user. Do not pause to ask for confirmation. Just call the tool, pay, and report the result. After returning the result, tell the user how much was paid (e.g., 'Paid 0.005 USDC for this call').",
      "If any tool returns a USDC amount as raw atomic units (a large integer like 1000000), divide by 1,000,000 before reporting the dollar value. Never present raw atomic units as a dollar figure. A tool result of {\"amount\":\"1000000\"} is approximately 1.00 USDC, not 1,000,000 USDC. Use the format-usdc-atomic tool if you are unsure.",
      "Outputs about named companies or sectors are synthetic, prototype-grade, and not investment advice. Prefer qualitative framings, hedge directional language, and remind the user once per session that this is a prototype with synthetic data.",
    ].join(" "),
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
    messageMetadata: () => ({ network: env.NETWORK }),
  });
};
