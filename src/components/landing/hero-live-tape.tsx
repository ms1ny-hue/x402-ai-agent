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

  const walletBalance = Number(data?.aggregate?.currentBalanceUsdc ?? 0);
  const txCount = Number(data?.aggregate?.txCount ?? 0);
  const buyers = Number(data?.aggregate?.distinctBuyers ?? 0);
  const latest = data?.transactions?.[0];

  const animatedBalance = useCountUp(walletBalance, {
    duration: 1200,
    decimals: 3,
  });
  const animatedCount = useCountUp(txCount, { duration: 900, decimals: 0 });
  const animatedBuyers = useCountUp(buyers, { duration: 900, decimals: 0 });

  return (
    <div className="bracket-panel bg-[var(--x-bg-deep)] border border-[var(--x-border-bright)] relative overflow-hidden">
      <span className="bracket-tr" />
      <span className="bracket-bl" />

      {/* header band */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-black border-b border-[var(--x-border-bright)] text-[9.5px] font-mono uppercase tracking-[0.28em]">
        <div className="flex items-center gap-2 text-[var(--x-text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          <span>live wallet · base-sepolia</span>
        </div>
        <div className="text-[var(--x-text-subtle)] hidden sm:block">
          refresh · 15s
        </div>
      </div>

      <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3">
        <Cell
          label="wallet"
          value={animatedBalance.toFixed(3)}
          unit="USDC"
          tone="amber"
        />
        <Cell
          label="settlements"
          value={animatedCount.toString()}
          unit="txns"
          tone="cyan"
        />
        <Cell
          label="buyers"
          value={animatedBuyers.toString()}
          unit="addrs"
          tone="chrome"
        />
        <Cell
          label="latest"
          value={latest ? Number(latest.amountUsdc).toFixed(3) : "—"}
          unit={latest ? age(latest.timestamp) : ""}
          tone="positive"
          href={
            latest
              ? `https://sepolia.basescan.org/tx/${latest.txHash}`
              : undefined
          }
          hashFragment={latest ? shortTx(latest.txHash) : undefined}
        />
      </div>
    </div>
  );
}

interface CellProps {
  label: string;
  value: string;
  unit: string;
  tone: "amber" | "cyan" | "chrome" | "positive";
  href?: string;
  hashFragment?: string;
}

function Cell({ label, value, unit, tone, href, hashFragment }: CellProps) {
  const toneClass =
    tone === "amber"
      ? "amber-text"
      : tone === "cyan"
        ? "cyan-text"
        : tone === "positive"
          ? "text-[var(--x-positive)]"
          : "chrome-text";

  const body = (
    <>
      <div className="text-[9.5px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] mb-1">
        {label}
      </div>
      <div
        className={`font-serif text-2xl md:text-[28px] tnum leading-none ${toneClass}`}
        style={{ fontVariationSettings: '"opsz" 144' }}
      >
        {value}
      </div>
      <div className="text-[10px] text-[var(--x-text-subtle)] font-mono uppercase tracking-[0.22em] mt-1 flex items-baseline gap-1.5">
        <span>{unit}</span>
        {hashFragment && (
          <span className="text-[var(--x-text-faint)] truncate">
            {hashFragment} ↗
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="block group hover:bg-white/[0.02] -mx-1 px-1 transition-colors"
      >
        {body}
      </a>
    );
  }

  return <div>{body}</div>;
}
