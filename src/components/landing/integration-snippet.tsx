import Link from "next/link";

const serverSnippet = `// app/mcp/route.ts
import { createPaidMcpHandler } from "x402-mcp";
import { facilitator } from "@coinbase/x402";
import z from "zod";

const handler = createPaidMcpHandler(
  (server) => {
    server.paidTool(
      "get_equity_research",
      "Return a short note for a ticker.",
      { price: 0.005 },             // USD; charged in USDC atomic units
      { ticker: z.string() },
      {},
      async ({ ticker }) => ({
        content: [{ type: "text", text: \`Note on \${ticker}...\` }],
      })
    );
  },
  { serverInfo: { name: "research", version: "0.1.0" } },
  {
    recipient: SELLER_WALLET_ADDRESS,
    facilitator,
    network: "base-sepolia",
  }
);

export const POST = handler;
export const GET  = handler;`;

const clientSnippet = `// app/api/chat/route.ts
import { withPayment } from "x402-mcp";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { StreamableHTTPClientTransport }
  from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const account = await getOrCreatePurchaserAccount();
const mcp = await createMCPClient({
  transport: new StreamableHTTPClientTransport(new URL("/mcp", APP_URL)),
}).then(c => withPayment(c, { account, network: "base-sepolia" }));

const tools = await mcp.tools();
// hand 'tools' to the AI SDK; paid calls now settle automatically.`;

export function IntegrationSnippet() {
  return (
    <section id="integrate" className="border-b border-[#0a0e1a]/10 bg-[#f5f1e8]/50">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono mb-3">
              Use it in your own app
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
              Two files. <em>That is the whole integration.</em>
            </h2>
          </div>
          <p className="text-sm text-[#0a0e1a]/65 max-w-md">
            A Next.js seller exposes paid MCP tools in one route. A buyer
            wires up <code className="font-mono">withPayment</code> around
            an MCP client. Coinbase CDP provisions both wallets, and the
            facilitator settles on-chain.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <SnippetCard
            label="Seller (exposes paid tools)"
            filename="app/mcp/route.ts"
            code={serverSnippet}
          />
          <SnippetCard
            label="Buyer (wraps the MCP client)"
            filename="app/api/chat/route.ts"
            code={clientSnippet}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link
            href="https://github.com/ms1ny-hue/x402-ai-agent"
            className="rounded-full border border-[#0a0e1a]/25 px-4 py-2 hover:bg-[#0a0e1a] hover:text-[#fbfaf7] transition-colors font-mono text-xs"
          >
            Full source on GitHub ↗
          </Link>
          <Link
            href="https://docs.x402.org/getting-started/quickstart-for-sellers"
            className="rounded-full border border-[#0a0e1a]/25 px-4 py-2 hover:bg-[#0a0e1a] hover:text-[#fbfaf7] transition-colors font-mono text-xs"
          >
            x402 docs ↗
          </Link>
          <Link
            href="https://www.npmjs.com/package/x402-mcp"
            className="rounded-full border border-[#0a0e1a]/25 px-4 py-2 hover:bg-[#0a0e1a] hover:text-[#fbfaf7] transition-colors font-mono text-xs"
          >
            x402-mcp on npm ↗
          </Link>
        </div>
      </div>
    </section>
  );
}

function SnippetCard({
  label,
  filename,
  code,
}: {
  label: string;
  filename: string;
  code: string;
}) {
  return (
    <div className="border border-[#0a0e1a]/15 rounded-lg overflow-hidden bg-[#fbfaf7]">
      <div className="flex items-center justify-between border-b border-[#0a0e1a]/10 px-3 py-2 bg-[#0a0e1a] text-[#fbfaf7]">
        <div className="text-[10.5px] font-mono uppercase tracking-[0.18em]">
          {label}
        </div>
        <code className="text-[11px] font-mono text-[#fbfaf7]/70">
          {filename}
        </code>
      </div>
      <pre className="bg-[#0a0e1a] text-[#fbfaf7]/90 font-mono text-[11px] leading-relaxed p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
