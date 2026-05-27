"use client";

/**
 * Cinematic protocol-timing oscilloscope. Three lanes (buyer, server,
 * facilitator) over a horizontal time axis. Each protocol event is a
 * labeled tick on the lane. A sweep line travels left-to-right on a
 * pure CSS transform animation.
 */

interface Event {
  t: number;
  lane: 0 | 1 | 2;
  label: string;
  detail?: string;
  accent?: "cyan" | "amber";
}

const events: Event[] = [
  { t: 4, lane: 0, label: "GET /research" },
  { t: 18, lane: 1, label: "402", accent: "amber", detail: "accepts[]" },
  { t: 28, lane: 0, label: "sign EIP-3009", detail: "ECDSA" },
  { t: 42, lane: 0, label: "POST X-PAYMENT" },
  { t: 55, lane: 1, label: "verify → fac.", detail: "RPC" },
  {
    t: 65,
    lane: 2,
    label: "transferWithAuth",
    accent: "amber",
    detail: "USDC",
  },
  { t: 80, lane: 2, label: "tx mined", accent: "cyan", detail: "0xa4…" },
  {
    t: 92,
    lane: 1,
    label: "200 OK",
    accent: "cyan",
    detail: "X-PAYMENT-RESPONSE",
  },
];

const lanes = [
  { name: "buyer", sub: "EOA / agent" },
  { name: "server", sub: "MCP / api" },
  { name: "facilitator", sub: "x402.org" },
];

export function TimingDiagram() {
  return (
    <div className="relative w-full bracket-panel bg-[var(--x-bg-deep)] overflow-hidden chrome-border">
      <span className="bracket-tr" />
      <span className="bracket-bl" />

      <div className="absolute inset-0 cross-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(125,211,252,0.10),transparent_60%),radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.06),transparent_60%)]" />

      {/* header bar */}
      <div className="flex items-center justify-between border-b border-[var(--x-border-bright)] px-4 py-2.5 bg-black/70 text-[var(--x-chrome-2)] text-[9.5px] font-mono uppercase tracking-[0.28em] relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          handshake timing
        </div>
        <div className="flex items-center gap-3 text-[var(--x-text-subtle)]">
          <span className="text-[var(--x-accent)] tnum">t≈3s</span>
          <span className="text-[var(--x-text-faint)]">·</span>
          <span className="hidden sm:inline">eip-3009</span>
          <span className="hidden sm:inline text-[var(--x-text-faint)]">·</span>
          <span>base-sepolia</span>
        </div>
      </div>

      <div className="relative px-4 pt-5 pb-3">
        {/* lane labels column + lanes */}
        <div className="grid grid-cols-[96px_1fr] gap-3">
          <div className="flex flex-col justify-between gap-2 pt-1">
            {lanes.map((l, i) => (
              <div key={i} className="leading-tight">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--x-text)] flex items-center gap-1.5">
                  <span className="text-[var(--x-text-faint)] tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.name}
                </div>
                <div className="text-[9px] font-mono text-[var(--x-text-subtle)] uppercase tracking-[0.18em] pl-5">
                  {l.sub}
                </div>
              </div>
            ))}
          </div>

          {/* lane plot area */}
          <div className="relative h-[300px] md:h-[340px]">
            {/* lane rules */}
            {lanes.map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-px bg-[var(--x-border-bright)]"
                style={{ top: `${(i + 0.5) * (100 / 3)}%` }}
              />
            ))}

            {/* tick column lines */}
            {[0, 25, 50, 75, 100].map((p) => (
              <div
                key={p}
                className="absolute top-0 bottom-0 w-px bg-[var(--x-border)]"
                style={{ left: `${p}%` }}
              />
            ))}

            {/* sweep line */}
            <div className="absolute top-0 bottom-0 w-px bg-[var(--x-accent-bright)] sweep-line shadow-[0_0_10px_rgba(56,189,248,0.85)]" />

            {/* events */}
            {events.map((e, i) => (
              <EventTick key={i} event={e} />
            ))}
          </div>
        </div>

        {/* time axis */}
        <div className="grid grid-cols-[96px_1fr] gap-3 mt-3">
          <div />
          <div className="relative h-4 font-mono text-[9px] text-[var(--x-text-subtle)] uppercase tracking-[0.22em]">
            {[
              { t: 0, l: "0ms" },
              { t: 25, l: "~750ms" },
              { t: 50, l: "~1.5s" },
              { t: 75, l: "~2.3s" },
              { t: 100, l: "~3.0s" },
            ].map((m) => (
              <div
                key={m.t}
                className="absolute -translate-x-1/2 top-0 tnum"
                style={{ left: `${m.t}%` }}
              >
                {m.l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="border-t border-[var(--x-border-bright)] px-4 py-2.5 flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.22em] text-[var(--x-text-subtle)]">
        <div className="flex items-center gap-3">
          <span>
            <span className="text-[var(--x-accent)]">◢</span> 7 events · 3 hops
          </span>
          <span className="hidden sm:inline">
            1 signature · 0 buyer gas
          </span>
        </div>
        <div className="hidden md:block text-[var(--x-signal)]">
          net buyer cost · 5,000 atomic
        </div>
      </div>
    </div>
  );
}

function EventTick({ event }: { event: Event }) {
  const top = `${event.lane * (100 / 3) + 50 / 3}%`;
  const fill =
    event.accent === "amber"
      ? "bg-[var(--x-signal)] shadow-[0_0_10px_rgba(251,191,36,0.85)]"
      : event.accent === "cyan"
        ? "bg-[var(--x-accent)] shadow-[0_0_10px_rgba(125,211,252,0.85)]"
        : "bg-[var(--x-chrome-1)]";

  const labelTone =
    event.accent === "amber"
      ? "text-[var(--x-signal)]"
      : event.accent === "cyan"
        ? "text-[var(--x-accent)]"
        : "text-[var(--x-text)]";

  return (
    <div
      className="absolute -translate-x-1/2"
      style={{ left: `${event.t}%`, top }}
    >
      <div className="relative flex flex-col items-center">
        <div
          className={`w-2.5 h-2.5 ${fill}`}
          style={{
            clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)",
          }}
        />
        <div className="absolute -top-[34px] whitespace-nowrap font-mono text-[10px] leading-tight">
          <div className="text-center">
            <span className={labelTone}>{event.label}</span>
          </div>
          {event.detail && (
            <div className="text-[9px] text-[var(--x-text-subtle)] uppercase tracking-[0.18em] text-center">
              {event.detail}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
