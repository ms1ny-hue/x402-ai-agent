"use client";

import { useEffect, useState } from "react";

interface TxRecord {
  txHash: string;
  amountUsdc: string;
  amountAtomic: string;
  from: string;
  timestamp: number | null;
  blockNumber: string;
}

interface FeedData {
  transactions: TxRecord[];
  aggregate?: { txCount: number; totalUsdc: string };
}

function shortTx(h: string): string {
  if (!h || h.length < 10) return h;
  return `${h.slice(0, 8)}…${h.slice(-6)}`;
}

function shortAddr(a: string): string {
  if (!a || a.length < 10) return a;
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function age(ts: number | null): string {
  if (!ts) return "—";
  const s = Math.floor(Date.now() / 1000 - ts);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function LiveTicker() {
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [total, setTotal] = useState<string>("—");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/transactions", { cache: "no-store" });
        const data = (await res.json()) as FeedData;
        if (cancelled) return;
        setTxs(data.transactions ?? []);
        if (data.aggregate?.totalUsdc) {
          setTotal(Number(data.aggregate.totalUsdc).toFixed(3));
        }
      } catch {
        // ignore, ticker just stays static
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const items =
    txs.length > 0
      ? txs
      : [
          {
            txHash: "0x000000000000000000",
            amountUsdc: "0.000",
            amountAtomic: "0",
            from: "0x0000000000000000000000000000000000000000",
            timestamp: null,
            blockNumber: "0",
          },
        ];

  // Duplicate the list so the marquee loop is seamless.
  const looped = [...items, ...items];

  return (
    <div className="border-b border-[var(--x-border)] bg-black text-[var(--x-chrome-2)] overflow-hidden">
      <div className="flex items-stretch text-[10.5px] font-mono">
        <div className="flex items-center gap-2 px-3 border-r border-[var(--x-border-bright)] bg-[var(--x-bg)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          <span className="uppercase tracking-[0.22em] text-[var(--x-text)]">
            x402 stream
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 border-r border-[var(--x-border-bright)]">
          <span className="text-[var(--x-text-subtle)] uppercase tracking-[0.22em] text-[9.5px]">
            settled · 5k blocks
          </span>
          <span className="tabular-nums text-[var(--x-chrome-1)]">
            {total} USDC
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="ticker-track flex items-center gap-6 py-1.5 pl-6 whitespace-nowrap">
            {looped.map((tx, i) => (
              <a
                key={`${tx.txHash}-${i}`}
                href={`https://sepolia.basescan.org/tx/${tx.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 tabular-nums hover:text-[var(--x-accent)]"
              >
                <span className="text-[var(--x-text-subtle)]">{age(tx.timestamp)}</span>
                <span className="text-[var(--x-text)]">{tx.amountUsdc}</span>
                <span className="text-[var(--x-text-subtle)]">USDC</span>
                <span className="text-[var(--x-text-subtle)]">·</span>
                <span className="text-[var(--x-chrome-3)]">{shortAddr(tx.from)}</span>
                <span className="text-[var(--x-text-subtle)]">→</span>
                <span className="text-[var(--x-accent)]">{shortTx(tx.txHash)}</span>
                <span className="text-[var(--x-text-subtle)] pr-3">⌗</span>
              </a>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent" />
        </div>
      </div>
    </div>
  );
}
