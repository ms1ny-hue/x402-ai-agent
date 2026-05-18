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
    <section id="integrate" className="border-b border-[var(--x-border)]">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
              Integrate
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text">
              Two files. That is the integration.
            </h2>
          </div>
          <p className="text-sm text-[var(--x-text-muted)] max-w-md font-mono">
            Next.js seller exposes paid MCP tools in one route. Buyer wraps{" "}
            <code className="text-[var(--x-accent)]">withPayment</code>{" "}
            around an MCP client. CDP provisions wallets; facilitator
            settles.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-px bg-[var(--x-border)] border border-[var(--x-border)]">
          <SnippetCard
            label="Seller"
            filename="app/mcp/route.ts"
            code={serverSnippet}
          />
          <SnippetCard
            label="Buyer"
            filename="app/api/chat/route.ts"
            code={clientSnippet}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <Link
            href="https://github.com/ms1ny-hue/x402-ai-agent"
            className="rounded-sm border border-[var(--x-border-bright)] text-[var(--x-text)] px-4 py-2 hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            Source ↗
          </Link>
          <Link
            href="https://docs.x402.org/getting-started/quickstart-for-sellers"
            className="rounded-sm border border-[var(--x-border-bright)] text-[var(--x-text)] px-4 py-2 hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            x402 docs ↗
          </Link>
          <Link
            href="https://www.npmjs.com/package/x402-mcp"
            className="rounded-sm border border-[var(--x-border-bright)] text-[var(--x-text)] px-4 py-2 hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors font-mono text-[11px] uppercase tracking-[0.18em]"
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
    <div className="bg-[var(--x-bg-elevated)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--x-border)] px-3 py-2 bg-black text-[var(--x-chrome-2)]">
        <div className="text-[10.5px] font-mono uppercase tracking-[0.22em]">
          {label}
        </div>
        <code className="text-[11px] font-mono text-[var(--x-text-subtle)]">
          {filename}
        </code>
      </div>
      <pre className="bg-black text-[var(--x-chrome-2)] font-mono text-[11px] leading-relaxed p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
