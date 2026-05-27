"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/lib/hooks/use-count-up";
import { SectionHeader } from "@/components/landing/how-it-works";

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
    <section
      id="payments"
      data-reveal
      className="border-b border-[var(--x-border-bright)] bg-[var(--x-bg-elevated)] relative"
    >
      <div className="absolute left-0 right-0 top-0 h-[6px] tick-ruler opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 py-14 md:py-20">
        <SectionHeader
          eyebrow="On-chain settlement log"
          title="Real blocks."
          titleAccent="Verifiable in one click."
          rightCopy="Every paid call below produced a USDC Transfer to the seller wallet. Each hash links to the block on Basescan."
        />

        {data && data.transactions.length > 0 && (
          <div className="mt-8 mb-6 signal-border bg-[var(--x-bg-deep)] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-[var(--x-text)] flex items-baseline gap-2 flex-wrap font-mono">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--x-signal)]">
                ▲ Latest
              </span>
              <span>
                <span className="tnum text-[var(--x-text)]">
                  {Number(data.transactions[0].amountUsdc).toFixed(3)}
                </span>{" "}
                <span className="text-[var(--x-text-subtle)] text-[11px]">
                  USDC
                </span>{" "}
                <span className="text-[var(--x-text-faint)]">·</span> block{" "}
                <span className="tnum">
                  {Number(
                    data.transactions[0].blockNumber,
                  ).toLocaleString()}
                </span>{" "}
                <span className="text-[var(--x-text-faint)]">·</span>{" "}
                {relativeTime(data.transactions[0].timestamp)}{" "}
                <span className="text-[var(--x-text-faint)]">·</span> buyer{" "}
                <span className="text-[var(--x-text-muted)]">
                  {shortAddr(data.transactions[0].from)}
                </span>
              </span>
            </div>
            <a
              href={`https://sepolia.basescan.org/tx/${data.transactions[0].txHash}`}
              target="_blank"
              rel="noreferrer"
              className="self-start md:self-auto rounded-none bg-gradient-to-b from-[var(--x-signal)] via-[var(--x-signal-bright)] to-[var(--x-signal-deep)] text-black text-[11px] font-mono uppercase tracking-[0.22em] px-4 py-2 hover:from-white hover:to-[var(--x-chrome-2)] transition-colors whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
            >
              Verify on Basescan ↗
            </a>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--x-border)] border border-[var(--x-border-bright)] chrome-border mt-6 mb-4">
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
                tone="amber"
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
                tone="cyan"
              />
              <BigStat
                label="Distinct buyers"
                value={
                  data.aggregate
                    ? data.aggregate.distinctBuyers.toString()
                    : "—"
                }
                sub="EOA addresses"
                tone="chrome"
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
                tone="positive"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--x-border)] border border-[var(--x-border-bright)] mb-8">
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

        <div className="border border-[var(--x-border-bright)] bg-[var(--x-bg-deep)]">
          <div className="flex items-center justify-between border-b border-[var(--x-border-bright)] px-4 py-2.5 bg-black text-[var(--x-chrome-2)]">
            <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.22em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
              Settlement log
              <span className="text-[var(--x-text-faint)]">·</span>
              <span className="text-[var(--x-text-subtle)]">15s refresh</span>
            </div>
            <div className="text-[10.5px] font-mono text-[var(--x-text-subtle)] uppercase tracking-[0.22em]">
              <span className="tnum text-[var(--x-text)]">
                {data?.transactions.length ?? 0}
              </span>{" "}
              · in window
            </div>
          </div>

          {loading && (
            <div className="px-4 py-12 text-center text-sm text-[var(--x-text-subtle)] font-mono uppercase tracking-[0.22em]">
              <span className="hud-blink">▮▮▮</span> reading base sepolia
              state…
            </div>
          )}

          {error && !loading && (
            <div className="px-4 py-12 text-center text-sm text-[var(--x-negative)] font-mono">
              ▼ could not load on-chain log: {error}
            </div>
          )}

          {!loading && !error && data && data.transactions.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-[var(--x-text-subtle)] font-mono">
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
              <table className="w-full text-sm min-w-[640px] font-mono">
                <thead>
                  <tr className="text-[9.5px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] border-b border-[var(--x-border-bright)] bg-[var(--x-bg-deep)]">
                    <th className="text-left px-4 py-2.5 font-normal w-[80px]">
                      ◇ when
                    </th>
                    <th className="text-left px-4 py-2.5 font-normal">
                      ◇ buyer
                    </th>
                    <th className="text-right px-4 py-2.5 font-normal">
                      ◇ amount
                    </th>
                    <th className="text-left px-4 py-2.5 font-normal">
                      ◇ tx hash
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((tx, i) => (
                    <tr
                      key={tx.txHash}
                      className={`border-b border-[var(--x-border)] last:border-0 hover:bg-[var(--x-bg-elevated)] transition-colors ${
                        i % 2 === 0 ? "" : "bg-black/20"
                      }`}
                    >
                      <td className="px-4 py-2.5 text-[11px] text-[var(--x-text-muted)] tnum">
                        {relativeTime(tx.timestamp)}
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-[var(--x-text-muted)]">
                        {shortAddr(tx.from)}
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-right tnum">
                        <span className="text-[var(--x-signal)]">
                          {tx.amountUsdc}
                        </span>
                        <span className="text-[var(--x-text-subtle)] ml-1">
                          USDC
                        </span>
                        <div className="text-[10px] text-[var(--x-text-faint)]">
                          {Number(tx.amountAtomic).toLocaleString()} atomic
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[11px]">
                        <a
                          href={`https://sepolia.basescan.org/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--x-accent)] hover:underline tnum"
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
    <div className="bg-[var(--x-bg-deep)] p-3">
      <div className="text-[9.5px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] font-mono mb-1">
        ◇ {label}
      </div>
      <div className="text-[var(--x-text)] font-mono text-xs tnum">
        {value}
      </div>
    </div>
  );
}

function BigStat({
  label,
  value,
  suffix,
  sub,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  sub: string;
  tone: "amber" | "cyan" | "chrome" | "positive";
}) {
  const numeric = Number(value);
  const hasNumber = Number.isFinite(numeric);
  const decimals = value.includes(".")
    ? value.split(".")[1]?.length ?? 0
    : 0;
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

  const toneClass =
    tone === "amber"
      ? "amber-text"
      : tone === "cyan"
        ? "cyan-text"
        : tone === "positive"
          ? "text-[var(--x-positive)]"
          : "chrome-text";

  return (
    <div className="bg-[var(--x-bg-deep)] p-5">
      <div className="text-[9.5px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] font-mono mb-3">
        {label}
      </div>
      <div
        className={`font-serif text-3xl md:text-4xl leading-none mb-1.5 tnum ${toneClass}`}
        style={{ fontVariationSettings: '"opsz" 144' }}
      >
        {display}
        {suffix && (
          <span className="text-[var(--x-text-subtle)] font-mono text-base ml-1">
            {suffix}
          </span>
        )}
      </div>
      <div className="text-[10px] font-mono text-[var(--x-text-subtle)] uppercase tracking-[0.22em]">
        {sub}
      </div>
    </div>
  );
}
