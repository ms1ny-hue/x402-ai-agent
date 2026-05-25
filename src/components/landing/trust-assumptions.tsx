interface Assumption {
  party: string;
  role: string;
  whatTheyCanDo: string;
  historical: string;
}

const assumptions: Assumption[] = [
  {
    party: "Circle Internet Financial",
    role: "USDC issuer and reserve custodian",
    whatTheyCanDo:
      "Freeze any address via the USDC contract's blacklist functions. Pause transfers globally. Affect peg if reserves are stressed.",
    historical:
      "USDC briefly depegged to ~$0.87 in March 2023 during the SVB exposure window. Recovered within 72 hours.",
  },
  {
    party: "Coinbase (facilitator)",
    role: "Signature verification + on-chain submission",
    whatTheyCanDo:
      "Refuse to verify or settle a payment. Change facilitator pricing (free on testnet today). Censor by address or jurisdiction.",
    historical:
      "Coinbase x402 facilitator has been generally available since 2025. No known censorship of testnet flows.",
  },
  {
    party: "Coinbase (Base L2 sequencer)",
    role: "Transaction ordering on the L2",
    whatTheyCanDo:
      "Reorder, delay, or temporarily halt transactions. Censor specific addresses at the sequencer level. Sequencer is a single entity today.",
    historical:
      "Base mainnet has had multiple sequencer incidents since launch, with hours-long delays in batch posting to L1.",
  },
  {
    party: "Coinbase CDP (server-managed wallets)",
    role: "Key management for both seller and buyer wallets in this demo",
    whatTheyCanDo:
      "Hold the private keys that sign EIP-3009 authorizations. Refuse to sign. Be subpoenaed.",
    historical:
      "Standard custodial counterparty risk. Same model as exchange custody.",
  },
  {
    party: "x402-mcp / @coinbase/x402 SDK maintainers",
    role: "Client-side handshake logic",
    whatTheyCanDo:
      "Ship breaking changes. Introduce bugs in signature construction. The SDKs are unaudited and pre-1.0.",
    historical:
      "Active development, frequent releases. Treat as alpha-quality software for production money handling.",
  },
];

export function TrustAssumptions() {
  return (
    <section
      id="trust"
      data-reveal
      className="border-b border-[var(--x-border)] bg-[var(--x-bg-elevated)]"
    >
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
              Trust assumptions
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text">
              Who can take your money. And how.
            </h2>
          </div>
          <p className="text-sm text-[var(--x-text-muted)] max-w-md font-mono">
            Card networks have one central counterparty (the network).
            x402 has several. Each is named below, with what they can do
            and what they have already done.
          </p>
        </div>

        <div className="border border-[var(--x-border-bright)] overflow-x-auto">
          <table className="w-full text-sm min-w-[760px] font-mono">
            <thead>
              <tr className="bg-black text-[var(--x-chrome-2)]">
                <th className="text-left text-[10px] uppercase tracking-[0.22em] px-4 py-3 font-normal w-[220px]">
                  Counterparty
                </th>
                <th className="text-left text-[10px] uppercase tracking-[0.22em] px-4 py-3 font-normal w-[220px]">
                  Role
                </th>
                <th className="text-left text-[10px] uppercase tracking-[0.22em] px-4 py-3 font-normal">
                  What they can do
                </th>
                <th className="text-left text-[10px] uppercase tracking-[0.22em] px-4 py-3 font-normal w-[260px]">
                  Track record
                </th>
              </tr>
            </thead>
            <tbody>
              {assumptions.map((a, i) => (
                <tr
                  key={a.party}
                  className={
                    "border-b border-[var(--x-border)] last:border-0 " +
                    (i % 2 === 0
                      ? "bg-[var(--x-bg)]"
                      : "bg-[var(--x-bg-elevated)]")
                  }
                >
                  <td className="px-4 py-2.5 text-[var(--x-text)] align-top">
                    {a.party}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-text-muted)] align-top">
                    {a.role}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-text-muted)] align-top">
                    {a.whatTheyCanDo}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--x-text-subtle)] align-top text-[11px]">
                    {a.historical}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[var(--x-text-subtle)] mt-4 font-mono leading-relaxed max-w-3xl">
          A production deployment can reduce some of these (run your own
          facilitator, use self-custodied wallets, monitor sequencer
          health) but cannot eliminate USDC issuer risk without changing
          the settlement asset entirely.
        </p>

        <p className="text-[11px] text-[var(--x-text-subtle)] mt-3 font-mono leading-relaxed max-w-3xl">
          Production hardening would also require strict resource binding,
          nonce tracking, replay prevention, request-payload canonicalization,
          per-buyer spending limits, and failed-settlement reconciliation.
          Recent x402 research has documented attack paths around
          authorization scope, replay handling, and web-layer trust that any
          live deployment should design against explicitly.
        </p>
      </div>
    </section>
  );
}
