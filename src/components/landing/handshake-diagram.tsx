"use client";

import { useEffect, useRef, useState } from "react";

export function HandshakeDiagram() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);

  // Pause heavy SVG animations when offscreen so the page stays
  // responsive while the user is reading other sections.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window) || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "0px 0px 100px 0px", threshold: 0 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] md:aspect-[5/6] w-full bracket-panel bg-[var(--x-bg-elevated)] overflow-hidden"
    >
      <span className="bracket-tr" />
      <span className="bracket-bl" />

      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(125,211,252,0.10),transparent_60%)]" />

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
          handshake · loop
        </div>
        <div className="hidden sm:block">cycle ~6s</div>
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

        {/* connection lines */}
        <g stroke="url(#chromeStroke)" strokeWidth="0.7" fill="none">
          <line x1="80" y1="120" x2="320" y2="120" strokeDasharray="2 4" />
          <line x1="320" y1="160" x2="80" y2="160" strokeDasharray="2 4" />
          <line x1="80" y1="240" x2="320" y2="240" strokeDasharray="2 4" />
          <line x1="320" y1="280" x2="200" y2="380" strokeDasharray="2 4" />
          <line x1="200" y1="400" x2="200" y2="460" strokeDasharray="2 4" />
          <line x1="220" y1="460" x2="320" y2="320" strokeDasharray="2 4" />
          <line x1="320" y1="200" x2="80" y2="200" strokeDasharray="2 4" />
        </g>

        {/* node glows */}
        <circle cx="80" cy="160" r="46" fill="url(#nodeGlow)" />
        <circle cx="320" cy="160" r="46" fill="url(#nodeGlow)" />
        <circle cx="200" cy="380" r="46" fill="url(#nodeGlow)" />
        <circle cx="200" cy="470" r="34" fill="url(#nodeGlow)" />

        {/* nodes */}
        <NodeBox x={40} y={130} label="buyer" sub="EOA + agent" />
        <NodeBox x={280} y={130} label="server" sub="MCP / api" />
        <NodeBox x={160} y={350} label="facilitator" sub="verify · settle" />
        <ChainBox x={160} y={448} />

        {/* moving packets — only when visible, only 3 packets, 6s cycle */}
        {visible && (
          <>
            <Packet path="M80,120 L320,120" delay={0} color="#e4e4e7" />
            <Packet path="M200,400 L200,460" delay={2} color="#7dd3fc" />
            <Packet path="M320,200 L80,200" delay={4} color="#7dd3fc" />
          </>
        )}
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

function Packet({
  path,
  delay,
  color,
}: {
  path: string;
  delay: number;
  color: string;
}) {
  return (
    <g>
      <circle r="2.8" fill={color} opacity="0">
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.05;0.95;1"
          dur="6s"
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
        <animateMotion
          dur="6s"
          begin={`${delay}s`}
          repeatCount="indefinite"
          path={path}
          keyTimes="0;0.18;1"
          keyPoints="0;1;1"
          calcMode="linear"
        />
      </circle>
    </g>
  );
}
