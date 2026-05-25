"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/lib/hooks/use-count-up";

interface TxRecord {
  txHash: string;
  blockNumber: string;
  from: string;
  to: string;
  amountAtomic: string;
  amountUsdc: string;
  timestamp: number | null;
}

interface AggregateStats {
  txCount: number;
  totalAtomic: string;
  totalUsdc: string;
  distinctBuyers: number;
  currentBalanceAtomic: string;
  currentBalanceUsdc: string;
  windowBlocks: number;
}

interface FeedData {
  sellerAddress: string;
  network: string;
  networkName: string;
  asset: string;
  assetSymbol: string;
  assetDecimals: number;
  aggregate?: AggregateStats;
  transactions: TxRecord[];
  error?: string;
}

function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function shortTx(hash: string): string {
  if (!hash || hash.length < 12) return hash;
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

function relativeTime(ts: number | null): string {
  if (!ts) return "—";
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function TransactionFeed() {
  const [data, setData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/transactions", { cache: "no-store" });
        const json = (await res.json()) as FeedData;
        if (cancelled) return;
        if (json.error) {
          setError(json.error);
        } else {
          setError(null);
          setData(json);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "fetch failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <section id="payments" data-reveal className="border-b border-[var(--x-border)] bg-[var(--x-bg-elevated)]">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
              On-chain settlement log
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text">
              Real blocks. Verifiable in one click.
            </h2>
          </div>
          <p className="text-sm text-[var(--x-text-muted)] max-w-md font-mono">
            Every paid call below produced a USDC Transfer to the seller
            wallet. Each hash links to the block on Basescan.
          </p>
        </div>

        {data && data.transactions.length > 0 && (
          <div className="mb-6 border border-[var(--x-accent)]/40 bg-[var(--x-accent)]/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-[var(--x-text)] flex items-baseline gap-2 flex-wrap font-mono">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-accent)]">
                Latest
              </span>
              <span>
                <span className="tabular-nums">
                  {Number(data.transactions[0].amountUsdc).toFixed(3)} USDC
                </span>{" "}
                · block{" "}
                {Number(data.transactions[0].blockNumber).toLocaleString()}{" "}
                · {relativeTime(data.transactions[0].timestamp)} · buyer{" "}
                {shortAddr(data.transactions[0].from)}
              </span>
            </div>
            <a
              href={`https://sepolia.basescan.org/tx/${data.transactions[0].txHash}`}
              target="_blank"
              rel="noreferrer"
              className="self-start md:self-auto rounded-sm bg-[var(--x-accent)] text-black text-[11px] font-mono uppercase tracking-[0.18em] px-3 py-1.5 hover:bg-[var(--x-chrome-1)] transition-colors whitespace-nowrap"
            >
              Verify on Basescan ↗
            </a>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--x-border)] border border-[var(--x-border)] mb-4">
              <BigStat
                label="Total received"
                value={
                  data.aggregate
                    ? `${Number(data.aggregate.totalUsdc).toFixed(3)}`
                    : "—"
                }
                suffix="USDC"
                sub={
                  data.aggregate
                    ? `${Number(data.aggregate.totalAtomic).toLocaleString()} atomic`
                    : ""
                }
              />
              <BigStat
                label="Settlements"
                value={
                  data.aggregate ? data.aggregate.txCount.toString() : "—"
                }
                sub={
                  data.aggregate
                    ? `last ${data.aggregate.windowBlocks.toLocaleString()} blocks`
                    : ""
                }
              />
              <BigStat
                label="Distinct buyers"
                value={
                  data.aggregate
                    ? data.aggregate.distinctBuyers.toString()
                    : "—"
                }
                sub="EOA addresses"
              />
              <BigStat
                label="Wallet balance"
                value={
                  data.aggregate
                    ? `${Number(data.aggregate.currentBalanceUsdc).toFixed(3)}`
                    : "—"
                }
                suffix="USDC"
                sub="auto-faucet < 0.5"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--x-border)] border border-[var(--x-border)] mb-6">
              <FieldStrip label="network" value="eip155:84532" />
              <FieldStrip
                label="asset"
                value={`USDC ${shortAddr(data.asset)}`}
              />
              <FieldStrip
                label="seller"
                value={shortAddr(data.sellerAddress)}
              />
              <FieldStrip label="decimals" value="6" />
            </div>
          </>
        )}

        <div className="border border-[var(--x-border-bright)] bg-[var(--x-bg)]">
          <div className="flex items-center justify-between border-b border-[var(--x-border)] px-4 py-2.5 bg-black text-[var(--x-chrome-2)]">
            <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.22em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
              Verifiable on-chain log · 15s refresh
            </div>
            <div className="text-[10.5px] font-mono text-[var(--x-text-subtle)]">
              {data?.transactions.length ?? 0} settlements in window
            </div>
          </div>

          {loading && (
            <div className="px-4 py-10 text-center text-sm text-[var(--x-text-subtle)] font-mono">
              Reading Base Sepolia state…
            </div>
          )}

          {error && !loading && (
            <div className="px-4 py-10 text-center text-sm text-[var(--x-text-subtle)] font-mono">
              Could not load on-chain log: {error}
            </div>
          )}

          {!loading && !error && data && data.transactions.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-[var(--x-text-subtle)] font-mono">
              No settlements in the last{" "}
              {data.aggregate
                ? `${data.aggregate.windowBlocks.toLocaleString()} blocks`
                : "scanned window"}
              . Trigger one above; the seller wallet history remains verifiable on{" "}
              <a
                href={`https://sepolia.basescan.org/address/${data.sellerAddress}`}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-[var(--x-border-bright)] hover:text-[var(--x-accent)]"
              >
                Basescan ↗
              </a>
              .
            </div>
          )}

          {!loading && !error && data && data.transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px] font-mono">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] border-b border-[var(--x-border)]">
                    <th className="text-left px-4 py-2 font-normal">when</th>
                    <th className="text-left px-4 py-2 font-normal">buyer</th>
                    <th className="text-right px-4 py-2 font-normal">amount</th>
                    <th className="text-left px-4 py-2 font-normal">tx hash</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((tx) => (
                    <tr
                      key={tx.txHash}
                      className="border-b border-[var(--x-border)] last:border-0 hover:bg-[var(--x-bg-elevated)]"
                    >
                      <td className="px-4 py-2.5 text-xs text-[var(--x-text-muted)]">
                        {relativeTime(tx.timestamp)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[var(--x-text-muted)]">
                        {shortAddr(tx.from)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-right tabular-nums">
                        <span className="text-[var(--x-text)]">
                          {tx.amountUsdc}
                        </span>
                        <span className="text-[var(--x-text-subtle)]"> USDC</span>
                        <div className="text-[10px] text-[var(--x-text-subtle)]">
                          {Number(tx.amountAtomic).toLocaleString()} atomic
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs">
                        <a
                          href={`https://sepolia.basescan.org/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--x-accent)] hover:underline"
                        >
                          {shortTx(tx.txHash)} ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FieldStrip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--x-bg)] p-2.5">
      <div className="text-[9.5px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-1">
        {label}
      </div>
      <div className="text-[var(--x-text)] font-mono text-xs">{value}</div>
    </div>
  );
}

function BigStat({
  label,
  value,
  suffix,
  sub,
}: {
  label: string;
  value: string;
  suffix?: string;
  sub: string;
}) {
  // Parse the number out of value if possible and animate it.
  const numeric = Number(value);
  const hasNumber = Number.isFinite(numeric);
  const decimals =
    value.includes(".") ? value.split(".")[1]?.length ?? 0 : 0;
  const animated = useCountUp(hasNumber ? numeric : 0, {
    duration: 1100,
    decimals,
  });
  const display = hasNumber
    ? animated.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value;
  return (
    <div className="bg-[var(--x-bg)] p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-2">
        {label}
      </div>
      <div className="font-serif text-2xl md:text-3xl leading-none mb-1.5 tabular-nums chrome-text">
        {display}
        {suffix && (
          <span className="text-[var(--x-text-subtle)] font-mono text-base ml-1">
            {suffix}
          </span>
        )}
      </div>
      <div className="text-[11px] font-mono text-[var(--x-text-subtle)]">
        {sub}
      </div>
    </div>
  );
}
