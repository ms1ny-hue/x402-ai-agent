"use client";

/**
 * Cinematic protocol-timing oscilloscope. Three lanes (buyer, server,
 * facilitator) over a horizontal time axis. Each protocol event is a
 * labeled tick on the lane. A sweep line travels left-to-right on a
 * pure CSS transform animation, which is virtually free for the
 * compositor.
 *
 * Communicates more than the previous handshake schematic: actual
 * sequence in time, plus where the round trips happen.
 */

interface Event {
  t: number; // 0..100 percentage along the timeline
  lane: 0 | 1 | 2;
  label: string;
  detail?: string;
  accent?: boolean;
}

const events: Event[] = [
  { t: 4, lane: 0, label: "GET /research" },
  { t: 18, lane: 1, label: "402", accent: true, detail: "accepts[]" },
  { t: 28, lane: 0, label: "sign EIP-3009", detail: "ECDSA" },
  { t: 42, lane: 0, label: "POST X-PAYMENT" },
  { t: 55, lane: 1, label: "verify → fac.", detail: "RPC" },
  { t: 65, lane: 2, label: "transferWithAuth", accent: true, detail: "USDC" },
  { t: 80, lane: 2, label: "tx mined", accent: true, detail: "0xa4…" },
  { t: 92, lane: 1, label: "200 OK", accent: true, detail: "X-PAYMENT-RESPONSE" },
];

const lanes = [
  { name: "buyer", sub: "EOA / agent" },
  { name: "server", sub: "MCP / api" },
  { name: "facilitator", sub: "x402.org" },
];

export function TimingDiagram() {
  return (
    <div className="relative w-full bracket-panel bg-[var(--x-bg-elevated)] overflow-hidden">
      <span className="bracket-tr" />
      <span className="bracket-bl" />

      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(125,211,252,0.08),transparent_60%)]" />

      {/* header bar */}
      <div className="flex items-center justify-between border-b border-[var(--x-border)] px-4 py-2.5 bg-black text-[var(--x-chrome-2)] text-[9.5px] font-mono uppercase tracking-[0.28em] relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          handshake timing · t≈3s
        </div>
        <div className="text-[var(--x-text-subtle)] hidden sm:block">
          x402 / eip-3009 / base-sepolia
        </div>
      </div>

      <div className="relative px-4 pt-4 pb-3">
        {/* lane labels column + lanes */}
        <div className="grid grid-cols-[88px_1fr] gap-3">
          <div className="flex flex-col justify-between gap-2 pt-1">
            {lanes.map((l, i) => (
              <div key={i} className="leading-tight">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--x-text)]">
                  {l.name}
                </div>
                <div className="text-[9px] font-mono text-[var(--x-text-subtle)] uppercase tracking-[0.18em]">
                  {l.sub}
                </div>
              </div>
            ))}
          </div>

          {/* lane plot area */}
          <div className="relative h-[280px] md:h-[320px]">
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
            <div className="absolute top-0 bottom-0 w-px bg-[var(--x-accent-bright)] sweep-line shadow-[0_0_8px_rgba(56,189,248,0.7)]" />

            {/* events */}
            {events.map((e, i) => (
              <EventTick key={i} event={e} />
            ))}
          </div>
        </div>

        {/* time axis */}
        <div className="grid grid-cols-[88px_1fr] gap-3 mt-3">
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
                className="absolute -translate-x-1/2 top-0"
                style={{ left: `${m.t}%` }}
              >
                {m.l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="border-t border-[var(--x-border)] px-4 py-2.5 flex items-center justify-between text-[9.5px] font-mono uppercase tracking-[0.22em] text-[var(--x-text-subtle)]">
        <div className="flex items-center gap-3">
          <span>
            <span className="text-[var(--x-accent)]">◢</span> 7 events · 3 hops
          </span>
          <span className="hidden sm:inline">1 signature · 0 buyer gas (facilitator pays)</span>
        </div>
        <div className="hidden md:block">net buyer cost · 5,000 atomic</div>
      </div>
    </div>
  );
}

function EventTick({ event }: { event: Event }) {
  const top = `${event.lane * (100 / 3) + 50 / 3}%`;
  return (
    <div
      className="absolute -translate-x-1/2"
      style={{ left: `${event.t}%`, top }}
    >
      <div className="relative flex flex-col items-center">
        <div
          className={`w-2.5 h-2.5 ${event.accent ? "bg-[var(--x-accent)]" : "bg-[var(--x-chrome-1)]"} ${event.accent ? "shadow-[0_0_8px_rgba(125,211,252,0.7)]" : ""}`}
          style={{
            clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)",
          }}
        />
        <div className="absolute -top-[34px] whitespace-nowrap font-mono text-[10px] text-[var(--x-text)] leading-tight">
          <div className="text-center">
            <span
              className={
                event.accent ? "text-[var(--x-accent)]" : "text-[var(--x-text)]"
              }
            >
              {event.label}
            </span>
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
