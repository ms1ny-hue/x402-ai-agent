import { SectionHeader } from "@/components/landing/how-it-works";

interface Row {
  dimension: string;
  psp: string;
  x402: string;
}

const rows: Row[] = [
  {
    dimension: "Rails",
    psp: "Visa / Mastercard / ACH",
    x402: "USDC on Base or Solana",
  },
  {
    dimension: "Marginal fee",
    psp: "≈ 2.9% + $0.30",
    x402: "Base gas + facilitator bps; often < 1¢, depends on pricing",
  },
  {
    dimension: "Min viable charge",
    psp: "≈ $0.50",
    x402: "$0.0001 (100 atomic USDC)",
  },
  {
    dimension: "Settlement",
    psp: "T+1 to T+2",
    x402: "2-4s sequencer-confirmed; L1 final later",
  },
  {
    dimension: "Buyer",
    psp: "Human + stored card",
    x402: "Wallet (often agent)",
  },
  {
    dimension: "Onboarding",
    psp: "Merchant acct, KYC, underwriting",
    x402: "Wallet address + facilitator URL",
  },
  {
    dimension: "Chargebacks",
    psp: "Network-enforced",
    x402: "None at protocol layer",
  },
  {
    dimension: "Refunds",
    psp: "PSP API",
    x402: "Counter-payment",
  },
  {
    dimension: "Subscriptions",
    psp: "First-class",
    x402: "Batch-settlement or per-call re-auth",
  },
  {
    dimension: "Compliance",
    psp: "PCI / PSD2 on PSP",
    x402: "KYT / sanctions on operator",
  },
];

export function Comparison() {
  return (
    <section
      id="compare"
      data-reveal
      className="border-b border-[var(--x-border-bright)] relative"
    >
      <div className="absolute left-0 right-0 top-0 h-[6px] tick-ruler opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 py-14 md:py-20">
        <SectionHeader
          eyebrow="vs. card-network PSPs"
          title="Different buyer."
          titleAccent="Different math."
          rightCopy="PSPs still own consumer checkout, subscriptions, chargebacks. x402 opens unit economics card rails cannot reach."
        />

        <div className="mt-10 border border-[var(--x-border-bright)] chrome-border overflow-x-auto bg-[var(--x-bg-deep)]">
          <table className="w-full text-sm min-w-[680px] font-mono">
            <thead>
              <tr className="bg-black text-[var(--x-chrome-2)] border-b border-[var(--x-border-bright)]">
                <th className="text-left text-[10px] uppercase tracking-[0.28em] px-4 py-3 font-normal">
                  ◇ Dimension
                </th>
                <th className="text-left text-[10px] uppercase tracking-[0.28em] px-4 py-3 font-normal">
                  <span className="text-[var(--x-text-muted)]">
                    ○ Card-network PSP
                  </span>
                </th>
                <th className="text-left text-[10px] uppercase tracking-[0.28em] px-4 py-3 font-normal">
                  <span className="text-[var(--x-signal)]">● x402</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.dimension}
                  className={
                    "border-b border-[var(--x-border)] last:border-0 hover:bg-[var(--x-bg-elevated-2)] transition-colors " +
                    (idx % 2 === 0
                      ? "bg-[var(--x-bg)]"
                      : "bg-[var(--x-bg-elevated)]")
                  }
                >
                  <td className="px-4 py-2.5 text-[var(--x-text-subtle)] uppercase text-[11px] tracking-[0.22em] align-top">
                    {row.dimension}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-text-muted)] align-top">
                    {row.psp}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-text)] align-top">
                    {row.x402}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[10px] text-[var(--x-text-subtle)] mt-3 font-mono uppercase tracking-[0.22em]">
          ⌗ fees illustrative · real PSP rates vary by MCC, region, contract.
        </p>
      </div>
    </section>
  );
}
