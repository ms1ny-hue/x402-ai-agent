"use client";

import { useEffect, useState } from "react";

interface TxRecord {
  txHash: string;
  blockNumber: string;
  from: string;
  to: string;
  amountAtomic: string;
  amountUsdc: string;
  timestamp: number | null;
}

interface FeedData {
  sellerAddress: string;
  network: string;
  networkName: string;
  asset: string;
  assetSymbol: string;
  assetDecimals: number;
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
    <section id="payments" className="border-b border-[#0a0e1a]/10">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono mb-3">
              On-chain settlement log
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
              Real USDC, real blocks. <em>Live from Base Sepolia.</em>
            </h2>
          </div>
          <p className="text-sm text-[#0a0e1a]/65 max-w-md">
            Every paid tool call below has a corresponding USDC Transfer to
            the seller wallet, mined on Base Sepolia. Click any hash to
            verify on Basescan.
          </p>
        </div>

        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs font-mono">
            <FieldStrip label="Network" value="eip155:84532" />
            <FieldStrip
              label="Asset"
              value={`USDC (${shortAddr(data.asset)})`}
            />
            <FieldStrip
              label="Seller wallet"
              value={shortAddr(data.sellerAddress)}
            />
            <FieldStrip label="Decimals" value="6" />
          </div>
        )}

        <div className="border border-[#0a0e1a]/15 rounded-lg overflow-hidden bg-[#fbfaf7]">
          <div className="flex items-center justify-between border-b border-[#0a0e1a]/10 px-4 py-2.5 bg-[#0a0e1a] text-[#fbfaf7]">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#56e0a0] animate-pulse" />
              Live · polling 15s
            </div>
            <div className="text-[11px] font-mono">
              {data?.transactions.length ?? 0} recent transfers
            </div>
          </div>

          {loading && (
            <div className="px-4 py-10 text-center text-sm text-[#0a0e1a]/55 font-mono">
              Reading Base Sepolia state…
            </div>
          )}

          {error && !loading && (
            <div className="px-4 py-10 text-center text-sm text-[#0a0e1a]/55">
              Could not load on-chain log: {error}
            </div>
          )}

          {!loading && !error && data && data.transactions.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-[#0a0e1a]/55">
              No transfers in the last 5,000 blocks. Trigger one with the demo
              below.
            </div>
          )}

          {!loading && !error && data && data.transactions.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-[#0a0e1a]/55 border-b border-[#0a0e1a]/10">
                  <th className="text-left px-4 py-2 font-normal">When</th>
                  <th className="text-left px-4 py-2 font-normal">Buyer</th>
                  <th className="text-right px-4 py-2 font-normal">Amount</th>
                  <th className="text-left px-4 py-2 font-normal">Tx hash</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((tx) => (
                  <tr
                    key={tx.txHash}
                    className="border-b border-[#0a0e1a]/5 last:border-0 hover:bg-[#f5f1e8]/40"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-[#0a0e1a]/65">
                      {relativeTime(tx.timestamp)}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {shortAddr(tx.from)}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-right tabular-nums">
                      <span className="text-[#0a0e1a]">{tx.amountUsdc}</span>
                      <span className="text-[#0a0e1a]/40"> USDC</span>
                      <div className="text-[10px] text-[#0a0e1a]/40">
                        {Number(tx.amountAtomic).toLocaleString()} atomic
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      <a
                        href={`https://sepolia.basescan.org/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#ff6b1a] hover:underline"
                      >
                        {shortTx(tx.txHash)} ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

function FieldStrip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#0a0e1a]/10 rounded p-2.5 bg-[#fbfaf7]">
      <div className="text-[9.5px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 mb-1">
        {label}
      </div>
      <div className="text-[#0a0e1a]">{value}</div>
    </div>
  );
}
