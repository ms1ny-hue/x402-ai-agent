interface Question {
  q: string;
  a: string;
}

const questions: Question[] = [
  {
    q: "Where do chargebacks come from if there is no network?",
    a: "They do not. x402 has no native dispute layer. A production deployment needs out-of-band terms (refund policy, SLA credits) and an off-chain dispute process. For agent-to-API commerce this is often acceptable, since the buyer is software with a defined contract; for consumer commerce it is not.",
  },
  {
    q: "How does the seller comply with KYC / AML / sanctions screening?",
    a: "The protocol does not perform any screening. Operators handling regulated activity need to add their own checks: chain-analysis (Chainalysis, TRM), sanctions-list blocking by address, and KYT on the buyer wallet. This is exactly the same posture as building a stablecoin payments product from first principles. The facilitator handles signature verification and settlement only.",
  },
  {
    q: "What about refunds?",
    a: "A refund is just a counter-payment from seller to buyer. There is no native refund primitive; it is a separate USDC transfer. For automated agent flows this is usually adequate. For consumer flows, expect to implement a small refund service.",
  },
  {
    q: "Who is the facilitator and what is the trust assumption?",
    a: "Here the facilitator is operated by Coinbase at x402.org. It verifies the buyer's EIP-3009 signature and submits the on-chain settlement. The trust assumption is that the facilitator will not censor, will settle promptly, and will keep its on-chain submitter funded with gas. Multiple facilitators exist and a seller can switch.",
  },
  {
    q: "What if the facilitator goes down?",
    a: "Payments fail until it recovers or you switch. Today (early 2026) there are a handful of facilitators (Coinbase, PayAI, others). Long-term you would either run your own facilitator or implement client-side fallback across multiple.",
  },
  {
    q: "How do subscriptions work?",
    a: "Out of the box, not. Either the agent re-authorizes each call (most common for agent-to-API), or you adopt the x402 batch-settlement scheme where the buyer funds a channel and signs vouchers off-chain that the seller redeems in batches.",
  },
  {
    q: "What is the practical floor on price?",
    a: "Around 100 atomic USDC units (about $0.0001) on Base before facilitator economics get awkward. Below that the per-call gas amortization stops working. Above ~$0.001 the rail is comfortable. For sub-cent micro-payments, batch-settlement is the right pattern.",
  },
  {
    q: "Is the LLM research output real?",
    a: "No. The research, commentary, and backtest tools in this demo all return deterministically generated synthetic strings. The PAYMENT is real (signed EIP-3009 authorization, on-chain USDC transfer, verifiable on Basescan). The CONTENT is illustrative scaffolding to make the protocol demo concrete.",
  },
  {
    q: "Could a sophisticated attacker drain the seller wallet?",
    a: "The seller wallet only receives funds; the buyer wallet is the one that could be drained via key compromise. In this demo both wallets are server-managed by Coinbase CDP (the secrets live in Vercel env vars, not in this repo). A production deployment should layer additional controls: rate limits per buyer, anomaly detection, and a maximum balance kept hot.",
  },
  {
    q: "What about MEV / front-running on the settlement tx?",
    a: "Each settlement is a plain ERC-20 Transfer call. There is nothing to front-run since the price is fixed in the signed authorization. The facilitator pays gas; the buyer is not exposed to gas price spikes at settlement time.",
  },
];

export function OpenQuestions() {
  return (
    <section id="questions" className="border-b border-[#0a0e1a]/10">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono mb-3">
              Open questions
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
              What a payments expert <em>actually asks.</em>
            </h2>
          </div>
          <p className="text-sm text-[#0a0e1a]/65 max-w-md">
            Honest answers to the skeptical questions. Where x402 cleanly
            solves a problem, this calls it out. Where it punts to the
            operator, this calls that out too.
          </p>
        </div>

        <ol className="grid md:grid-cols-2 gap-4">
          {questions.map((qa, i) => (
            <li
              key={i}
              className="border border-[#0a0e1a]/15 rounded-lg p-5 bg-[#fbfaf7] flex flex-col gap-2"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tracking-[0.18em] text-[#ff6b1a]">
                  Q{String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-lg leading-tight">{qa.q}</h3>
              </div>
              <p className="text-sm text-[#0a0e1a]/70 leading-relaxed">
                {qa.a}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
