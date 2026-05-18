"use client";

/**
 * Static SVG schematic of the x402 handshake with cheap CSS-only pulses
 * at node endpoints. No animateMotion (which was triggering heavy
 * per-frame paint/composite work). The schematic communicates the
 * protocol topology; the pulses signal liveness without melting GPUs.
 */
export function HandshakeDiagram() {
  return (
    <div className="relative aspect-[4/5] md:aspect-[5/6] w-full bracket-panel bg-[var(--x-bg-elevated)] overflow-hidden">
      <span className="bracket-tr" />
      <span className="bracket-bl" />

      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(125,211,252,0.10),transparent_60%)]" />

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
          handshake · schematic
        </div>
        <div className="hidden sm:block">x402 / eip-3009</div>
      </div>

      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id="chromeStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4f4f5" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#a1a1aa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#52525b" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* connection lines, labeled */}
        <g stroke="url(#chromeStroke)" strokeWidth="0.7" fill="none">
          {/* GET request */}
          <line x1="120" y1="160" x2="280" y2="160" strokeDasharray="2 4" />
          {/* 402 response */}
          <line x1="280" y1="180" x2="120" y2="180" strokeDasharray="2 4" />
          {/* X-PAYMENT retry */}
          <line x1="120" y1="220" x2="280" y2="220" strokeDasharray="2 4" />
          {/* server -> facilitator verify */}
          <line x1="320" y1="260" x2="240" y2="350" strokeDasharray="2 4" />
          {/* facilitator -> chain */}
          <line x1="200" y1="410" x2="200" y2="450" strokeDasharray="2 4" />
          {/* chain -> server tx hash */}
          <line x1="220" y1="445" x2="320" y2="290" strokeDasharray="2 4" />
          {/* 200 OK */}
          <line x1="280" y1="200" x2="120" y2="200" strokeDasharray="2 4" />
        </g>

        {/* link labels */}
        <g
          fontFamily="JetBrains Mono, monospace"
          fontSize="7"
          letterSpacing="1.5"
          fill="#71717a"
        >
          <text x="200" y="155" textAnchor="middle">
            GET
          </text>
          <text x="200" y="194" textAnchor="middle" fill="#7dd3fc">
            402 PAYMENT REQUIRED
          </text>
          <text x="200" y="216" textAnchor="middle">
            X-PAYMENT &lt;auth&gt;
          </text>
          <text x="270" y="316" textAnchor="middle">
            verify
          </text>
          <text x="210" y="438" textAnchor="middle">
            transferWithAuthorization
          </text>
          <text x="290" y="380" textAnchor="middle" fill="#7dd3fc">
            0xa4…
          </text>
          <text x="200" y="244" textAnchor="middle" fill="#7dd3fc">
            200 OK + X-PAYMENT-RESPONSE
          </text>
        </g>

        {/* node glows */}
        <circle cx="80" cy="180" r="46" fill="url(#nodeGlow)" />
        <circle cx="320" cy="180" r="46" fill="url(#nodeGlow)" />
        <circle cx="200" cy="380" r="46" fill="url(#nodeGlow)" />
        <circle cx="200" cy="460" r="34" fill="url(#nodeGlow)" />

        {/* nodes */}
        <NodeBox x={40} y={150} label="buyer" sub="EOA + agent" />
        <NodeBox x={280} y={150} label="server" sub="MCP / api" />
        <NodeBox x={160} y={350} label="facilitator" sub="verify · settle" />
        <ChainBox x={160} y={438} />

        {/* cheap CSS-only pulse at chain (settlement) — only one moving element */}
        <circle
          cx="200"
          cy="456"
          r="3"
          fill="#7dd3fc"
          className="settlement-pulse"
        />
      </svg>

      <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2 text-[9.5px] font-mono uppercase tracking-[0.22em] text-[var(--x-text-subtle)] z-10">
        <div>
          <span className="text-[var(--x-accent)]">◢</span> GET / 402
        </div>
        <div>EIP-3009 sign</div>
        <div>200 + tx hash</div>
      </div>
    </div>
  );
}

function NodeBox({
  x,
  y,
  label,
  sub,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
}) {
  const w = 80;
  const h = 60;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="#0a0d14"
        stroke="#a1a1aa"
        strokeWidth="0.6"
      />
      <text
        x={x + w / 2}
        y={y + 22}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="11"
        fill="#e4e4e7"
        letterSpacing="0.5"
      >
        {label}
      </text>
      <text
        x={x + w / 2}
        y={y + 38}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="7"
        fill="#71717a"
        letterSpacing="1.5"
      >
        {sub.toUpperCase()}
      </text>
      {[
        [x, y],
        [x + w - 4, y],
        [x, y + h - 4],
        [x + w - 4, y + h - 4],
      ].map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx}
          y={cy}
          width={4}
          height={4}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth="0.6"
        />
      ))}
    </g>
  );
}

function ChainBox({ x, y }: { x: number; y: number }) {
  const w = 80;
  const h = 36;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="#000"
        stroke="#7dd3fc"
        strokeWidth="0.8"
      />
      <text
        x={x + w / 2}
        y={y + 14}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        fill="#7dd3fc"
        letterSpacing="2"
      >
        BASE-SEPOLIA
      </text>
      <text
        x={x + w / 2}
        y={y + 27}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="7"
        fill="#71717a"
        letterSpacing="1.5"
      >
        USDC.TRANSFER
      </text>
    </g>
  );
}
