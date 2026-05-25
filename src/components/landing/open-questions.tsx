interface Question {
  q: string;
  a: string;
}

const questions: Question[] = [
  {
    q: "Circle can freeze a USDC address. How is that handled?",
    a: "It is not, at the protocol layer. If the seller's address is blacklisted by Circle, future incoming transfers revert; existing balance is locked. Mitigation: rotate seller addresses, off-ramp to fiat frequently, and treat USDC balances as hot wallets, not store-of-value.",
  },
  {
    q: "USDC depeg risk?",
    a: "USDC briefly traded at ~$0.87 in March 2023. If the unit of account on the rail breaks from USD, both buyers and sellers carry FX risk between authorization and settlement. For very-low-value calls (sub-cent) the risk is immaterial. For larger flows, hedge or off-ramp same-day.",
  },
  {
    q: "Base sequencer is centralized. What if it halts?",
    a: "Base's sequencer is operated by Coinbase and has experienced multi-hour delays. During a halt, no new x402 settlements complete on Base. Mitigation: support multiple chains (Base, Solana, Stellar, etc.) and route around incidents at the facilitator level.",
  },
  {
    q: "Sequencer-confirmed vs L1-final?",
    a: "What this demo reports as 'settled' is sequencer-confirmed. L1 finality on Base typically lands within minutes via posted batches. For high-value flows you should wait for L1 finality before treating the payment as irrevocable.",
  },
  {
    q: "Chargebacks?",
    a: "None at the protocol layer. Build an off-chain dispute process if your audience needs one. Agent-to-API contexts typically don't; consumer contexts almost certainly do.",
  },
  {
    q: "Where does fraud risk actually land?",
    a: "Card networks externalize fraud through chargebacks. x402 has no chargebacks at the protocol layer, so fraud loss lands on either the seller (who absorbs it) or on a buyer-side reputation primitive that does not yet exist as infrastructure. The interesting design question for productionizing x402 is not whether to bolt on chargebacks (which would break the rail's economics) but who builds the buyer-reputation layer: the facilitator, an indexer, a credit-score-for-agents service, or something none of those. The question matters most at higher tickets, where a single bad buyer can dwarf days of legitimate revenue.",
  },
  {
    q: "KYC / AML / sanctions?",
    a: "Not handled by the protocol. Operator must add KYT (Chainalysis, TRM), OFAC-list blocking by address, and adverse-media screening. Same posture as any USDC payments product.",
  },
  {
    q: "Can compliance keep up with 3-second settlement?",
    a: "The operational bottleneck for productionizing stablecoin-rail payments is not protocol settlement speed; it is the latency of the compliance stack around it. KYT and AML providers run batch screening cycles in the seconds-to-minutes range, sanctions list refreshes are not real-time, and the legal posture of approve-then-screen vs. screen-then-approve differs by jurisdiction. Most live deployments will either accept a brief holdback before treating settlement as final, or pre-clear buyers so the per-call check is a lookup rather than a fresh screen. Either approach adds cost the protocol economics must absorb.",
  },
  {
    q: "Am I a money transmitter if I accept USDC?",
    a: "Possibly, depending on jurisdiction. FinCEN guidance generally treats convertible virtual currency businesses as MSBs. State-level MTLs may apply if you hold customer funds. Get counsel before scaling. Accepting payment for your own services is usually treated differently from transmitting on behalf of third parties.",
  },
  {
    q: "OFAC screening obligation?",
    a: "Yes. Sanctioned address lists from OFAC must be checked, and there is precedent for enforcement against crypto businesses. Screen incoming buyer addresses against the SDN list, log decisions, and document your control.",
  },
  {
    q: "Tax treatment of USDC receipts?",
    a: "In the US, USDC received as payment is income at fair value on the date of receipt, and any subsequent fluctuation is a capital gain/loss event on conversion. Same treatment as other cryptocurrency receipts. Tax compliance is on the operator.",
  },
  {
    q: "Refunds?",
    a: "A USDC counter-payment from seller to buyer. No native primitive; one extra Transfer call. No automated dispute resolution if the seller refuses to refund.",
  },
  {
    q: "Who is the facilitator? What if they change pricing?",
    a: "Here, Coinbase at x402.org (free on testnet). Mainnet uses api.cdp.coinbase.com/platform/v2/x402, and fees may apply. Other facilitators (PayAI, others) exist; the protocol does not bind you to one.",
  },
  {
    q: "Subscriptions and recurring payments?",
    a: "Per-call re-authorization for agents (simple, gas-cheap on L2). For high-frequency flows use the batch-settlement scheme where a buyer funds a channel and signs off-chain vouchers redeemed by the seller in batches.",
  },
  {
    q: "Practical price floor?",
    a: "~100 atomic USDC ($0.0001) before facilitator math gets uncomfortable. Above ~$0.001 the rail is comfortable. Below that, batch-settlement is the right pattern.",
  },
  {
    q: "Wallet custody and key compromise?",
    a: "Both wallets are Coinbase CDP server-managed. Secrets live in Vercel env vars, never in this repo. Production: rate-limit per buyer, anomaly detection, minimal hot balance, plus an off-chain off-ramp to cold storage.",
  },
  {
    q: "Address poisoning, phishing, wrong-address attacks?",
    a: "x402 binds payments to the seller's payTo at signature time, so a buyer cannot accidentally pay the wrong address mid-flow. Phishing remains a risk if a malicious server advertises a fraudulent payTo in its accepts[] array; verify endpoints over TLS and check responses against expected sellers.",
  },
  {
    q: "MEV / front-running?",
    a: "Nothing to front-run. Amount is fixed in the signed authorization. Buyer pays no gas; facilitator does. Settlement is a plain ERC-20 Transfer with no extractable value to a third party.",
  },
  {
    q: "PCI scope?",
    a: "Genuinely reduced. No card data ever touches your servers. You still need infrastructure security, custody controls, and the compliance items above, but the PCI-DSS card-data scope drops to near zero.",
  },
  {
    q: "Is the LLM research output real?",
    a: "No. The research, commentary, and backtest tools return deterministic synthetic strings. The PAYMENT is real (signed authorization, on-chain Transfer, verifiable on Basescan). Content is illustrative scaffolding.",
  },
];

export function OpenQuestions() {
  return (
    <section id="questions" data-reveal className="border-b border-[var(--x-border)] bg-[var(--x-bg-elevated)]">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
              Open questions
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text">
              What a payments expert asks first.
            </h2>
          </div>
          <p className="text-sm text-[var(--x-text-muted)] max-w-md font-mono">
            Where x402 solves the problem cleanly, this calls it. Where it
            punts to the operator, it calls that too.
          </p>
        </div>

        <ol className="grid md:grid-cols-2 gap-px bg-[var(--x-border)] border border-[var(--x-border)]">
          {questions.map((qa, i) => (
            <li
              key={i}
              className="bg-[var(--x-bg)] p-5 flex flex-col gap-2"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--x-accent)]">
                  Q{String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-lg leading-tight text-[var(--x-text)]">
                  {qa.q}
                </h3>
              </div>
              <p className="text-[13px] text-[var(--x-text-muted)] leading-relaxed font-mono">
                {qa.a}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
