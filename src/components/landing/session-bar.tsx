"use client";

import { useEffect, useState } from "react";

function formatUtc(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate(),
  )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds(),
  )} UTC`;
}

export function SessionBar() {
  const [now, setNow] = useState<string>("—");

  useEffect(() => {
    const tick = () => setNow(formatUtc(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[var(--x-bg-deep)] text-[var(--x-chrome-2)] border-b border-[var(--x-border-bright)] relative z-20">
      <div className="max-w-7xl mx-auto px-5 py-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[10.5px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          <span className="uppercase tracking-[0.22em] text-[var(--x-text)]">
            x402 · protocol surface
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[var(--x-text-subtle)] uppercase tracking-[0.22em]">
          <span>session</span>
          <span className="text-[var(--x-text)] tnum">{now}</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[var(--x-text-subtle)] uppercase tracking-[0.22em]">
          <span>chain</span>
          <span className="text-[var(--x-accent)]">base-sepolia</span>
          <span className="text-[var(--x-text-faint)]">·</span>
          <span>eip155:84532</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[var(--x-text-subtle)] uppercase tracking-[0.22em]">
          <span>asset</span>
          <span className="text-[var(--x-signal)]">USDC</span>
          <span className="text-[var(--x-text-faint)]">·</span>
          <span>6 dp</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 uppercase tracking-[0.22em] text-[var(--x-text-subtle)]">
            <span>signal</span>
            <span
              className="signal-bars"
              data-level="5"
              aria-label="signal strong"
            >
              <span /><span /><span /><span /><span />
            </span>
          </div>
          <div className="hud-chip is-amber">
            <span className="w-1 h-1 rounded-full bg-[var(--x-signal)] diode-amber" />
            testnet
          </div>
        </div>
      </div>
    </div>
  );
}
