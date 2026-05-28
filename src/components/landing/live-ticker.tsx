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
  sellerAddress?: string;
  transactions: TxRecord[];
  aggregate?: {
    txCount: number;
    totalUsdc: string;
    currentBalanceUsdc?: string;
    windowBlocks?: number;
  };
}

const SELLER_FALLBACK = "0x9830A79efC99b084F30A70b8fD5231C6293b1633";

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
  const [data, setData] = useState<FeedData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/transactions", { cache: "no-store" });
        const json = (await res.json()) as FeedData;
        if (cancelled) return;
        setData(json);
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

  const txs = data?.transactions ?? [];
  const total = data?.aggregate?.totalUsdc
    ? Number(data.aggregate.totalUsdc).toFixed(3)
    : "—";
  const count =
    typeof data?.aggregate?.txCount === "number"
      ? data.aggregate.txCount.toLocaleString()
      : "—";
  const wallet = data?.aggregate?.currentBalanceUsdc
    ? Number(data.aggregate.currentBalanceUsdc).toFixed(3)
    : "—";
  const windowBlocks = data?.aggregate?.windowBlocks ?? 28500;
  const seller = data?.sellerAddress ?? SELLER_FALLBACK;

  const hasTxs = txs.length > 0;
  const looped = hasTxs ? [...txs, ...txs] : [];

  return (
    <div className="border-b border-[var(--x-border-bright)] bg-black text-[var(--x-chrome-2)] overflow-hidden relative z-10">
      <div className="flex items-stretch text-[10.5px] font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 border-r border-[var(--x-border-bright)] bg-[var(--x-bg-deep)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          <span className="uppercase tracking-[0.22em] text-[var(--x-text)]">
            x402&nbsp;stream
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 px-3 border-r border-[var(--x-border-bright)] bg-[var(--x-bg-deep)]/60">
          <span className="text-[var(--x-text-subtle)] uppercase tracking-[0.22em] text-[9.5px]">
            window
          </span>
          <span className="tnum text-[var(--x-signal)]">{total}</span>
          <span className="text-[var(--x-text-subtle)] text-[9.5px] uppercase tracking-[0.22em]">
            USDC
          </span>
          <span className="text-[var(--x-text-faint)]">·</span>
          <span className="tnum text-[var(--x-text)]">{count}</span>
          <span className="text-[var(--x-text-subtle)] text-[9.5px] uppercase tracking-[0.22em]">
            txns
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {hasTxs ? (
            <div className="ticker-track flex items-center gap-7 py-1.5 pl-6 whitespace-nowrap">
              {looped.map((tx, i) => (
                <a
                  key={`${tx.txHash}-${i}`}
                  href={`https://sepolia.basescan.org/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 tnum hover:text-[var(--x-accent)] group"
                >
                  <span className="text-[var(--x-text-subtle)] text-[9.5px] uppercase tracking-[0.22em]">
                    T-{age(tx.timestamp)}
                  </span>
                  <span className="text-[var(--x-signal)] font-medium">
                    {tx.amountUsdc}
                  </span>
                  <span className="text-[var(--x-text-subtle)] text-[9.5px]">
                    USDC
                  </span>
                  <span className="text-[var(--x-text-faint)]">/</span>
                  <span className="text-[var(--x-chrome-3)]">
                    {shortAddr(tx.from)}
                  </span>
                  <span className="text-[var(--x-text-faint)]">→</span>
                  <span className="text-[var(--x-accent)] group-hover:underline">
                    {shortTx(tx.txHash)}
                  </span>
                  <span className="text-[var(--x-text-faint)] pr-3">⌗</span>
                </a>
              ))}
            </div>
          ) : (
            <EmptyState
              wallet={wallet}
              seller={seller}
              windowBlocks={windowBlocks}
            />
          )}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  wallet,
  seller,
  windowBlocks,
}: {
  wallet: string;
  seller: string;
  windowBlocks: number;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5 px-6 whitespace-nowrap text-[var(--x-text-muted)]">
      <span className="uppercase tracking-[0.22em] text-[9.5px] text-[var(--x-text-subtle)]">
        no settlements in last {windowBlocks.toLocaleString()} blocks
      </span>
      <span className="text-[var(--x-text-faint)]">·</span>
      <span className="uppercase tracking-[0.22em] text-[9.5px] text-[var(--x-text-subtle)]">
        wallet
      </span>
      <span className="tnum text-[var(--x-signal)]">{wallet}</span>
      <span className="uppercase tracking-[0.22em] text-[9.5px] text-[var(--x-text-subtle)]">
        USDC accumulated
      </span>
      <span className="text-[var(--x-text-faint)]">·</span>
      <a
        href={`https://sepolia.basescan.org/address/${seller}`}
        target="_blank"
        rel="noreferrer"
        className="uppercase tracking-[0.22em] text-[9.5px] text-[var(--x-accent)] hover:underline"
      >
        view full history on basescan ↗
      </a>
    </div>
  );
}
