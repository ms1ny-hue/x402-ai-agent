interface Row {
  dimension: string;
  psp: string;
  x402: string;
}

const rows: Row[] = [
  {
    dimension: "Rails",
    psp: "Card networks (Visa, Mastercard), ACH",
    x402: "USDC on Base or Solana (EVM / SVM)",
  },
  {
    dimension: "Marginal fee",
    psp: "≈ 2.9% + $0.30 per transaction",
    x402: "Base gas (sub-cent) + facilitator fee",
  },
  {
    dimension: "Viable minimum charge",
    psp: "≈ $0.50 before fees dominate",
    x402: "$0.0001 (100 atomic USDC units)",
  },
  {
    dimension: "Settlement finality",
    psp: "T+1 to T+2 typical; instant payouts add fees",
    x402: "Seconds, on-chain, deterministic",
  },
  {
    dimension: "Buyer",
    psp: "Human with stored card credential",
    x402: "Wallet, frequently an autonomous agent",
  },
  {
    dimension: "Onboarding",
    psp: "Merchant account, KYC, underwriting",
    x402: "Wallet address + facilitator URL",
  },
  {
    dimension: "Chargebacks / disputes",
    psp: "First-class, network-enforced",
    x402: "None at protocol layer; build separately",
  },
  {
    dimension: "Refunds",
    psp: "Standard via PSP API",
    x402: "Counter-payment by seller",
  },
  {
    dimension: "Subscriptions",
    psp: "First-class (mandates, tokens-on-file)",
    x402: "Build separately or use batch-settlement",
  },
  {
    dimension: "Compliance burden",
    psp: "PCI-DSS, PSD2, etc. carried by PSP",
    x402: "Carried by operator (KYT, sanctions, etc.)",
  },
];

export function Comparison() {
  return (
    <section
      id="compare"
      className="border-b border-[#0a0e1a]/10"
    >
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono mb-3">
              x402 vs. card-network PSPs
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
              Not a Stripe replacement. <em>A different buyer.</em>
            </h2>
          </div>
          <p className="text-sm text-[#0a0e1a]/65 max-w-md">
            PSPs remain dominant for consumer checkout, subscriptions, and
            anything requiring chargebacks. x402 opens unit economics that
            card-network rails cannot reach.
          </p>
        </div>

        <div className="border border-[#0a0e1a]/15 rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="bg-[#0a0e1a] text-[#fbfaf7]">
                <th className="text-left font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-3 font-normal">
                  Dimension
                </th>
                <th className="text-left font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-3 font-normal">
                  Card-network PSP
                </th>
                <th className="text-left font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-3 font-normal">
                  x402
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.dimension}
                  className={
                    idx % 2 === 0 ? "bg-[#fbfaf7]" : "bg-[#f5f1e8]/40"
                  }
                >
                  <td className="px-4 py-3 font-medium align-top">
                    {row.dimension}
                  </td>
                  <td className="px-4 py-3 text-[#0a0e1a]/75 align-top">
                    {row.psp}
                  </td>
                  <td className="px-4 py-3 text-[#0a0e1a]/75 align-top">
                    {row.x402}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[#0a0e1a]/55 mt-4 italic">
          Fee figures are illustrative industry ranges, not a quote against any
          specific PSP contract. Settlement and chargeback behavior vary by
          card network, region, and merchant category.
        </p>
      </div>
    </section>
  );
}
