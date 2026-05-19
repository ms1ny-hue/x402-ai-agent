"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/lib/hooks/use-count-up";

interface FeedData {
  aggregate?: {
    txCount: number;
    totalUsdc: string;
    currentBalanceUsdc: string;
    distinctBuyers: number;
  };
  transactions: Array<{
    txHash: string;
    amountUsdc: string;
    blockNumber: string;
    timestamp: number | null;
  }>;
}

function shortTx(h: string): string {
  if (!h || h.length < 12) return h;
  return `${h.slice(0, 8)}…${h.slice(-6)}`;
}

function age(ts: number | null): string {
  if (!ts) return "—";
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function HeroLiveTape() {
  const [data, setData] = useState<FeedData | null>(null);

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
    const id = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const totalUsdc = Number(data?.aggregate?.totalUsdc ?? 0);
  const txCount = Number(data?.aggregate?.txCount ?? 0);
  const latest = data?.transactions?.[0];

  const animatedTotal = useCountUp(totalUsdc, { duration: 1200, decimals: 3 });
  const animatedCount = useCountUp(txCount, { duration: 900, decimals: 0 });

  return (
    <div className="bracket-panel bg-black border border-[var(--x-border-bright)] relative overflow-hidden">
      <span className="bracket-tr" />
      <span className="bracket-bl" />
      <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] mb-1.5 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
            settled · 5k blocks
          </div>
          <div
            className="font-serif text-2xl md:text-3xl tabular-nums chrome-text leading-none"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            {animatedTotal.toFixed(3)}{" "}
            <span className="text-[var(--x-text-subtle)] font-mono text-sm">
              USDC
            </span>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] mb-1.5">
            settlements
          </div>
          <div
            className="font-serif text-2xl md:text-3xl tabular-nums chrome-text leading-none"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            {animatedCount.toString()}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] mb-1.5">
            most recent
          </div>
          {latest ? (
            <a
              href={`https://sepolia.basescan.org/tx/${latest.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm text-[var(--x-accent)] hover:underline tabular-nums leading-tight block"
            >
              {Number(latest.amountUsdc).toFixed(3)} USDC
              <span className="text-[var(--x-text-subtle)]"> · </span>
              {age(latest.timestamp)}
              <div className="text-[10.5px] text-[var(--x-text-subtle)] mt-0.5">
                {shortTx(latest.txHash)} ↗
              </div>
            </a>
          ) : (
            <div className="font-mono text-sm text-[var(--x-text-subtle)]">
              awaiting first settlement…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
