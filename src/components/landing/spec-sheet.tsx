interface SpecRow {
  k: string;
  v: string;
  note?: string;
}

const rows: SpecRow[] = [
  { k: "protocol", v: "x402 v1" },
  { k: "scheme", v: "exact", note: "upto, batch-settlement also supported by facilitator" },
  { k: "chain", v: "base-sepolia", note: "Optimism-stack L2, ~2s block time" },
  { k: "CAIP-2", v: "eip155:84532" },
  { k: "asset", v: "USDC", note: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" },
  { k: "asset decimals", v: "6" },
  { k: "settlement primitive", v: "ERC-20 Transfer" },
  { k: "buyer auth", v: "EIP-3009 transferWithAuthorization" },
  { k: "signature", v: "ECDSA secp256k1 over EIP-712 typed data" },
  { k: "EIP-712 domain", v: "USDC v2 · chainId 84532" },
  { k: "validity window", v: "validAfter ≤ block.timestamp < validBefore", note: "default ~300s" },
  { k: "replay protection", v: "32-byte nonce per authorization" },
  { k: "facilitator", v: "x402.org/facilitator", note: "Coinbase, free for testnet" },
  { k: "gas payer", v: "facilitator EOA", note: "buyer pays 0 gas" },
  { k: "per-call gas", v: "≈ 60-80k gas", note: "approve-free, single transferWithAuthorization call" },
  { k: "min viable charge", v: "100 atomic USDC = $0.0001" },
  { k: "end-to-end latency", v: "2-4 s typical", note: "402 + sign + retry + settlement confirmation" },
  { k: "wallet provisioning", v: "Coinbase CDP server-managed", note: "no seed phrase in app code" },
];

export function SpecSheet() {
  return (
    <section id="spec" className="border-b border-[var(--x-border)]">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
              Spec sheet
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text">
              What this deployment actually runs.
            </h2>
          </div>
          <p className="text-sm text-[var(--x-text-muted)] max-w-md font-mono">
            Every value below is the literal configuration the live demo uses.
            Click into Basescan for the contract source.
          </p>
        </div>

        <div className="border border-[var(--x-border-bright)] overflow-x-auto">
          <table className="w-full text-sm min-w-[640px] font-mono">
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.k}
                  className={
                    "border-b border-[var(--x-border)] last:border-0 " +
                    (i % 2 === 0
                      ? "bg-[var(--x-bg)]"
                      : "bg-[var(--x-bg-elevated)]")
                  }
                >
                  <td className="px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-[var(--x-text-subtle)] align-top w-[200px]">
                    {r.k}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-text)] align-top">
                    {r.v}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-text-subtle)] align-top text-[11px]">
                    {r.note ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
