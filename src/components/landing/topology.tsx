import { SectionHeader } from "@/components/landing/how-it-works";

/**
 * Network topology section. SCADA-style schematic showing the pipeline
 * from the AI agent through MCP, x402 facilitator, Base L2, and L1
 * finality. Pure SVG so it renders fast and stays sharp.
 */

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  tone: "cyan" | "amber" | "positive" | "chrome";
}

interface Edge {
  from: string;
  to: string;
  label: string;
  cost?: string;
  hop?: string;
  tone?: "cyan" | "amber" | "muted";
}

const NODES: Node[] = [
  { id: "agent",       x: 80,  y: 130, label: "AI agent",      sub: "EOA / CDP wallet",    tone: "chrome" },
  { id: "mcp",         x: 280, y: 130, label: "MCP server",    sub: "x402 middleware",     tone: "cyan" },
  { id: "facilitator", x: 480, y: 130, label: "Facilitator",   sub: "x402.org",            tone: "amber" },
  { id: "l2",          x: 680, y: 80,  label: "Base L2",       sub: "sequencer · ~2s",     tone: "cyan" },
  { id: "l1",          x: 680, y: 180, label: "Ethereum L1",   sub: "batched finality",    tone: "chrome" },
  { id: "usdc",        x: 880, y: 130, label: "USDC",          sub: "EIP-3009 · 6 dp",     tone: "amber" },
];

const EDGES: Edge[] = [
  { from: "agent",       to: "mcp",         label: "GET",            hop: "0 ms",   tone: "muted" },
  { from: "mcp",         to: "agent",       label: "402 · accepts[]",hop: "~120 ms",tone: "cyan" },
  { from: "agent",       to: "mcp",         label: "POST X-PAYMENT", hop: "~140 ms",tone: "muted" },
  { from: "mcp",         to: "facilitator", label: "verify",         hop: "~300 ms",tone: "cyan" },
  { from: "facilitator", to: "l2",          label: "broadcast tx",   hop: "~1.6 s", cost: "60-80k gas", tone: "amber" },
  { from: "l2",          to: "l1",          label: "batched",        hop: "~minutes",tone: "muted" },
  { from: "l2",          to: "usdc",        label: "Transfer",       hop: "atomic", tone: "amber" },
];

const TONE_HEX: Record<string, { stroke: string; fill: string }> = {
  chrome:   { stroke: "#a1a1aa", fill: "#1a1f28" },
  cyan:     { stroke: "#22d3ee", fill: "#0a2233" },
  amber:    { stroke: "#fcd34d", fill: "#2a1f0d" },
  positive: { stroke: "#34d399", fill: "#0d2a1c" },
};

const EDGE_COLOR: Record<string, string> = {
  cyan:  "rgba(125, 211, 252, 0.65)",
  amber: "rgba(252, 211, 77, 0.7)",
  muted: "rgba(161, 161, 170, 0.45)",
};

function nodeById(id: string): Node {
  const n = NODES.find((n) => n.id === id);
  if (!n) throw new Error(`unknown node ${id}`);
  return n;
}

export function Topology() {
  return (
    <section
      id="topology"
      data-reveal
      className="border-b border-[var(--x-border-bright)] bg-[var(--x-bg-deep)] relative overflow-hidden"
    >
      <div className="absolute left-0 right-0 top-0 h-[6px] tick-ruler opacity-50 pointer-events-none" />
      <div className="absolute inset-0 cross-grid opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 py-14 md:py-20 relative">
        <SectionHeader
          eyebrow="Network topology"
          title="What sits between"
          titleAccent="agent and chain."
          rightCopy="Every hop in the live deployment. Latency, gas, and trust boundary annotated. The agent never signs gas; the facilitator does."
        />

        <div className="mt-10 chrome-border bg-[var(--x-bg-deep)] relative">
          <div className="flex items-center justify-between border-b border-[var(--x-border-bright)] px-4 py-2 bg-black/70 text-[var(--x-chrome-2)] text-[10px] font-mono uppercase tracking-[0.28em]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
              <span>live pipeline · base-sepolia</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--x-text-subtle)]">
              <span>
                <span className="text-[var(--x-accent)]">●</span> protocol
              </span>
              <span>
                <span className="text-[var(--x-signal)]">●</span> settlement
              </span>
              <span>
                <span className="text-[var(--x-text-muted)]">●</span> transport
              </span>
            </div>
          </div>

          <div className="relative">
            <svg
              viewBox="0 0 960 280"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-auto"
              aria-hidden
            >
              <defs>
                <marker
                  id="arrow-cyan"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 0 0 L 10 5 L 0 10 z"
                    fill={EDGE_COLOR.cyan}
                  />
                </marker>
                <marker
                  id="arrow-amber"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 0 0 L 10 5 L 0 10 z"
                    fill={EDGE_COLOR.amber}
                  />
                </marker>
                <marker
                  id="arrow-muted"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 0 0 L 10 5 L 0 10 z"
                    fill={EDGE_COLOR.muted}
                  />
                </marker>

                {/* subtle pattern for trust-boundary annotation */}
                <pattern
                  id="trust-boundary"
                  patternUnits="userSpaceOnUse"
                  width="6"
                  height="6"
                  patternTransform="rotate(35)"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="6"
                    stroke="rgba(252, 211, 77, 0.2)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              {/* trust boundary shaded region (facilitator + chain) */}
              <rect
                x="420"
                y="20"
                width="510"
                height="240"
                fill="url(#trust-boundary)"
                stroke="rgba(252, 211, 77, 0.18)"
                strokeWidth="0.5"
                strokeDasharray="4 3"
              />
              <text
                x="430"
                y="36"
                fontFamily="var(--font-geist-mono), monospace"
                fontSize="9"
                fill="rgba(252, 211, 77, 0.55)"
                letterSpacing="2"
              >
                ◇ SETTLEMENT DOMAIN
              </text>

              {/* edges */}
              {EDGES.map((e, i) => (
                <Edge key={i} edge={e} index={i} />
              ))}

              {/* nodes */}
              {NODES.map((n) => (
                <NodeShape key={n.id} node={n} />
              ))}
            </svg>
          </div>

          {/* legend / numbered hop summary */}
          <div className="border-t border-[var(--x-border-bright)] bg-black/50 px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2 text-[10px] font-mono uppercase tracking-[0.22em]">
            <HopRow code="01" label="off-chain handshake" value="~0.3 s" tone="cyan" />
            <HopRow code="02" label="signature · ECDSA"   value="~5 ms"  tone="cyan" />
            <HopRow code="03" label="settlement · L2"     value="~1.6 s" tone="amber" />
            <HopRow code="04" label="L1 finality"         value="minutes" tone="muted" />
          </div>
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-[0.22em] font-mono text-[var(--x-text-subtle)]">
          ⌗ shaded region = settlement domain · agent stays off-chain at the
          protocol layer · facilitator is the only entity that pays gas.
        </p>
      </div>
    </section>
  );
}

function NodeShape({ node }: { node: Node }) {
  const tone = TONE_HEX[node.tone];
  return (
    <g>
      {/* halo */}
      <rect
        x={node.x - 64}
        y={node.y - 28}
        width="128"
        height="56"
        fill={tone.fill}
        stroke={tone.stroke}
        strokeWidth="1"
        rx="2"
      />
      {/* corner ticks */}
      {[
        [-64, -28],
        [60, -28],
        [-64, 24],
        [60, 24],
      ].map(([dx, dy], i) => (
        <g
          key={i}
          transform={`translate(${node.x + (dx as number)} ${node.y + (dy as number)})`}
        >
          <path
            d={
              i === 0
                ? "M0 6 L0 0 L6 0"
                : i === 1
                  ? "M-6 0 L4 0 L4 6"
                  : i === 2
                    ? "M0 -6 L0 0 L6 0"
                    : "M-6 0 L4 0 L4 -6"
            }
            stroke={tone.stroke}
            strokeWidth="1"
            fill="none"
          />
        </g>
      ))}
      <text
        x={node.x}
        y={node.y - 5}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="15"
        fill={tone.stroke}
        fontStyle="italic"
      >
        {node.label}
      </text>
      <text
        x={node.x}
        y={node.y + 13}
        textAnchor="middle"
        fontFamily="var(--font-geist-mono), monospace"
        fontSize="8"
        fill="rgba(220,220,228,0.55)"
        letterSpacing="1.5"
      >
        {node.sub}
      </text>
    </g>
  );
}

function Edge({ edge, index }: { edge: Edge; index: number }) {
  const from = nodeById(edge.from);
  const to = nodeById(edge.to);
  const color = EDGE_COLOR[edge.tone ?? "muted"];
  const marker =
    edge.tone === "amber"
      ? "url(#arrow-amber)"
      : edge.tone === "cyan"
        ? "url(#arrow-cyan)"
        : "url(#arrow-muted)";

  // Compute curve. If same y, slight bow. If different y, curve through midpoint.
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // shorten endpoints so arrow doesn't overlap node box
  const nx = dx / dist;
  const ny = dy / dist;
  const padFrom = 66;
  const padTo = 68;
  const sx = from.x + nx * padFrom;
  const sy = from.y + ny * padFrom * 0.6;
  const ex = to.x - nx * padTo;
  const ey = to.y - ny * padTo * 0.6;

  // bow control point — alternate sign per edge index so parallel lines don't overlap
  const bowDir = index % 2 === 0 ? -1 : 1;
  const bow = Math.min(28, dist * 0.12) * bowDir;
  const mx = (sx + ex) / 2 + -ny * bow;
  const my = (sy + ey) / 2 + nx * bow;

  const d = `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`;

  // label position — at the bow control point
  const labelX = mx;
  const labelY = my + (bowDir > 0 ? 12 : -6);

  return (
    <g>
      <path
        d={d}
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        markerEnd={marker}
        strokeDasharray={edge.tone === "muted" ? "3 3" : undefined}
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        fontFamily="var(--font-geist-mono), monospace"
        fontSize="8.5"
        fill={color}
        letterSpacing="1"
      >
        {edge.label}
      </text>
      {edge.hop && (
        <text
          x={labelX}
          y={labelY + 9}
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), monospace"
          fontSize="7.5"
          fill="rgba(220, 220, 228, 0.45)"
          letterSpacing="1"
        >
          {edge.hop}
          {edge.cost && ` · ${edge.cost}`}
        </text>
      )}
    </g>
  );
}

function HopRow({
  code,
  label,
  value,
  tone,
}: {
  code: string;
  label: string;
  value: string;
  tone: "cyan" | "amber" | "muted";
}) {
  const toneClass =
    tone === "cyan"
      ? "text-[var(--x-accent)]"
      : tone === "amber"
        ? "text-[var(--x-signal)]"
        : "text-[var(--x-text-muted)]";
  return (
    <div className="flex items-baseline gap-2">
      <span className="tnum text-[var(--x-text-faint)]">{code}</span>
      <span className="text-[var(--x-text-subtle)] flex-1 truncate">
        {label}
      </span>
      <span className={`tnum ${toneClass}`}>{value}</span>
    </div>
  );
}
