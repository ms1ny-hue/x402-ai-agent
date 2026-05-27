import { SectionHeader } from "@/components/landing/how-it-works";

interface SpecRow {
  k: string;
  testnet: string;
  mainnet: string;
  note?: string;
}

const rows: SpecRow[] = [
  {
    k: "protocol",
    testnet: "x402 v1",
    mainnet: "x402 v1 / v2",
    note: "facilitator advertises both",
  },
  {
    k: "scheme",
    testnet: "exact",
    mainnet: "exact",
    note: "upto, batch-settlement also supported",
  },
  {
    k: "request headers",
    testnet: "X-PAYMENT, X-PAYMENT-RESPONSE",
    mainnet: "X-PAYMENT, X-PAYMENT-RESPONSE",
    note: "x402-mcp SDK convention; names vary by SDK and protocol version",
  },
  { k: "chain", testnet: "base-sepolia", mainnet: "base" },
  { k: "CAIP-2", testnet: "eip155:84532", mainnet: "eip155:8453" },
  {
    k: "USDC contract",
    testnet: "0x036C...DCF7e",
    mainnet: "0x8335...Bd913",
    note: "Circle-issued, EIP-3009 enabled",
  },
  { k: "asset decimals", testnet: "6", mainnet: "6" },
  {
    k: "settlement",
    testnet: "ERC-20 Transfer",
    mainnet: "ERC-20 Transfer",
  },
  {
    k: "buyer auth",
    testnet: "EIP-3009 transferWithAuthorization",
    mainnet: "EIP-3009 transferWithAuthorization",
  },
  {
    k: "signature",
    testnet: "ECDSA secp256k1 over EIP-712",
    mainnet: "ECDSA secp256k1 over EIP-712",
  },
  {
    k: "EIP-712 domain",
    testnet: "USDC v2 · chainId 84532",
    mainnet: "USDC v2 · chainId 8453",
  },
  {
    k: "validity window",
    testnet: "~300s",
    mainnet: "~300s",
    note: "validAfter ≤ block.timestamp < validBefore",
  },
  {
    k: "replay protection",
    testnet: "32-byte nonce",
    mainnet: "32-byte nonce",
  },
  {
    k: "facilitator",
    testnet: "x402.org/facilitator",
    mainnet: "api.cdp.coinbase.com/platform/v2/x402",
    note: "alternatives: facilitator.payai.network",
  },
  {
    k: "facilitator cost",
    testnet: "free",
    mainnet: "bps + per-call, vendor-specific",
    note: "pricing changes; check at integration time",
  },
  { k: "gas payer", testnet: "facilitator EOA", mainnet: "facilitator EOA" },
  {
    k: "per-call gas",
    testnet: "free (testnet ETH)",
    mainnet: "≈ 60-80k gas",
    note: "Base ~$0.001-$0.01 at typical gas",
  },
  {
    k: "buyer gas",
    testnet: "$0",
    mainnet: "$0",
    note: "EIP-3009 signed off-chain",
  },
  {
    k: "settlement finality",
    testnet: "sequencer-confirmed (~2s)",
    mainnet: "sequencer-confirmed (~2s); L1-final in batched window",
    note: "wait for L1 finality on high-value flows",
  },
  {
    k: "min viable charge",
    testnet: "100 atomic USDC ($0.0001)",
    mainnet: "100 atomic USDC ($0.0001)",
  },
  {
    k: "wallet provisioning",
    testnet: "Coinbase CDP server-managed",
    mainnet: "Coinbase CDP server-managed",
    note: "seed-phrase-free, custodial",
  },
  {
    k: "this deployment",
    testnet: "ACTIVE",
    mainnet: "not deployed",
    note: "set env NETWORK=base + CDP mainnet creds to switch",
  },
];

export function SpecSheet() {
  return (
    <section
      id="spec"
      data-reveal
      className="border-b border-[var(--x-border-bright)] relative"
    >
      <div className="absolute left-0 right-0 top-0 h-[6px] tick-ruler-tall opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 py-14 md:py-20">
        <SectionHeader
          eyebrow="Spec sheet · testnet vs mainnet"
          title="What this deployment"
          titleAccent="actually runs."
          rightCopy="Every value below is the literal configuration. Testnet column is what is live now. Mainnet column is what changes for production."
        />

        <div className="mt-10 border border-[var(--x-border-bright)] chrome-border overflow-x-auto bg-[var(--x-bg-deep)]">
          <table className="w-full text-sm min-w-[820px] font-mono">
            <thead>
              <tr className="bg-black text-[var(--x-chrome-2)] border-b border-[var(--x-border-bright)]">
                <th className="text-left text-[10px] uppercase tracking-[0.28em] px-4 py-3 font-normal w-[200px]">
                  ◇ parameter
                </th>
                <th className="text-left text-[10px] uppercase tracking-[0.28em] px-4 py-3 font-normal w-[280px]">
                  <span className="text-[var(--x-accent)]">● testnet (live)</span>
                </th>
                <th className="text-left text-[10px] uppercase tracking-[0.28em] px-4 py-3 font-normal w-[280px]">
                  <span className="text-[var(--x-signal)]">○ mainnet (target)</span>
                </th>
                <th className="text-left text-[10px] uppercase tracking-[0.28em] px-4 py-3 font-normal">
                  ◇ note
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.k}
                  className={
                    "border-b border-[var(--x-border)] last:border-0 hover:bg-[var(--x-bg-elevated-2)] transition-colors " +
                    (i % 2 === 0
                      ? "bg-[var(--x-bg)]"
                      : "bg-[var(--x-bg-elevated)]")
                  }
                >
                  <td className="px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] align-top">
                    {r.k}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-accent)] align-top tnum">
                    {r.testnet}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-text)] align-top tnum">
                    {r.mainnet}
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
