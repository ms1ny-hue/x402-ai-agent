"use client";

import { useEffect, useState } from "react";
import { Sparkline } from "@/components/landing/waveform";

interface FeedData {
  aggregate?: {
    txCount: number;
    totalUsdc: string;
    currentBalanceUsdc: string;
  };
  transactions: Array<{
    txHash: string;
    amountUsdc: string;
    timestamp: number | null;
  }>;
}

function formatClock(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds(),
  )}`;
}

function age(ts: number | null): string {
  if (!ts) return "—";
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function TelemetryDock() {
  const [clock, setClock] = useState<string>("--:--:--");
  const [visible, setVisible] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [data, setData] = useState<FeedData | null>(null);

  // Clock
  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Reveal after first scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.4) {
        setVisible(true);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Feed polling
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/transactions", { cache: "no-store" });
        const json = (await res.json()) as FeedData;
        if (!cancelled) setData(json);
      } catch {
        /* swallow */
      }
    };
    load();
    const id = setInterval(load, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!visible || dismissed) return null;

  const wallet = Number(data?.aggregate?.currentBalanceUsdc ?? 0);
  const txCount = data?.aggregate?.txCount ?? 0;
  const latest = data?.transactions?.[0];
  const sparkValues =
    data?.transactions && data.transactions.length > 1
      ? data.transactions
          .slice(0, 16)
          .reverse()
          .map((t) => Number(t.amountUsdc) || 0)
      : [0, 0.001, 0.002, 0.003, 0.004, 0.005, 0.003, 0.004];

  return (
    <aside
      aria-label="Live telemetry dock"
      className="fixed bottom-3 right-3 z-40 hidden md:block w-[280px] backdrop-blur-md bg-[var(--x-bg-deep)]/85 border border-[var(--x-border-bright)] text-[10.5px] font-mono shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto"
    >
      {/* header */}
      <div className="flex items-center justify-between border-b border-[var(--x-border-bright)] px-3 py-1.5 bg-black/60 text-[var(--x-chrome-2)] uppercase tracking-[0.28em] text-[9.5px]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
          <span>live · agent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="tnum text-[var(--x-accent)]">{clock}</span>
          <span className="text-[var(--x-text-faint)]">UTC</span>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="ml-1 text-[var(--x-text-subtle)] hover:text-[var(--x-negative)] transition-colors text-[12px] leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* body */}
      <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
        <Metric
          label="wallet"
          value={wallet.toFixed(3)}
          unit="USDC"
          tone="amber"
        />
        <Metric
          label="settled"
          value={txCount.toString()}
          unit="txns"
          tone="cyan"
        />

        {/* sparkline spans full width */}
        <div className="col-span-2 mt-1">
          <div className="flex items-center justify-between mb-1 text-[9.5px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)]">
            <span>volume · last 16</span>
            <span className="text-[var(--x-signal)] tnum">
              {latest ? Number(latest.amountUsdc).toFixed(3) : "—"}
            </span>
          </div>
          <div className="h-[24px] text-[var(--x-accent)]">
            <Sparkline
              values={sparkValues}
              width={252}
              height={24}
              stroke="currentColor"
              className="w-full h-full"
            />
          </div>
        </div>

        {latest && (
          <a
            href={`https://sepolia.basescan.org/tx/${latest.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 flex items-center justify-between mt-1 px-2 py-1 border border-[var(--x-border-bright)] hover:border-[var(--x-accent)] transition-colors text-[var(--x-accent)] uppercase tracking-[0.22em]"
          >
            <span>latest tx</span>
            <span className="tnum text-[var(--x-text)]">
              {latest.txHash.slice(0, 8)}…{latest.txHash.slice(-4)}
            </span>
            <span className="text-[var(--x-text-subtle)]">
              {age(latest.timestamp)} ↗
            </span>
          </a>
        )}
      </div>
    </aside>
  );
}

function Metric({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  tone: "cyan" | "amber";
}) {
  const toneClass = tone === "cyan" ? "cyan-text" : "amber-text";
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] mb-0.5">
        ◇ {label}
      </div>
      <div
        className={`font-serif text-xl tnum leading-none ${toneClass}`}
        style={{ fontVariationSettings: '"opsz" 144' }}
      >
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-[0.28em] text-[var(--x-text-faint)] mt-0.5">
        {unit}
      </div>
    </div>
  );
}
