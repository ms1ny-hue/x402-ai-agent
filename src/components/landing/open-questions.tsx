interface Question {
  q: string;
  a: string;
}

const questions: Question[] = [
  {
    q: "Chargebacks?",
    a: "None at the protocol layer. Build an off-chain dispute process if your audience needs one. Agent-to-API contexts typically don't.",
  },
  {
    q: "KYC / AML / sanctions?",
    a: "Not handled by the protocol. Operator layers on KYT (Chainalysis, TRM), sanctions-list blocking by address, etc. Same posture as any USDC payments product.",
  },
  {
    q: "Refunds?",
    a: "A USDC counter-payment from seller to buyer. No native primitive; one extra Transfer call.",
  },
  {
    q: "Who is the facilitator?",
    a: "Here, Coinbase at x402.org. Verifies the buyer's EIP-3009 signature and broadcasts the on-chain settlement. Multiple facilitators exist; sellers can switch.",
  },
  {
    q: "Facilitator outage?",
    a: "Payments fail until recovery or you switch. Multi-facilitator fallback is solvable at the seller layer.",
  },
  {
    q: "Subscriptions?",
    a: "Per-call re-authorization for agents, or use the batch-settlement scheme where a buyer funds a channel and signs off-chain vouchers.",
  },
  {
    q: "Practical price floor?",
    a: "~100 atomic USDC ($0.0001) before facilitator math gets uncomfortable. Above ~$0.001 the rail is comfortable.",
  },
  {
    q: "Is the LLM research output real?",
    a: "No. The research, commentary, and backtest tools return deterministic synthetic strings. The PAYMENT is real (signed authorization, on-chain Transfer, verifiable on Basescan). Content is illustrative scaffolding.",
  },
  {
    q: "Wallet custody risk?",
    a: "Both wallets are Coinbase CDP server-managed. Secrets live in Vercel env vars, never in this repo. Production: rate-limit per buyer, anomaly detection, keep balances minimal.",
  },
  {
    q: "MEV / front-running?",
    a: "Nothing to front-run. The amount is fixed in the signed authorization. Buyer pays no gas; facilitator does. Settlement is a plain ERC-20 Transfer.",
  },
];

export function OpenQuestions() {
  return (
    <section id="questions" className="border-b border-[var(--x-border)] bg-[var(--x-bg-elevated)]">
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
