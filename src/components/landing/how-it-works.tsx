interface Step {
  num: string;
  title: string;
  facts: string[];
  code: string;
  accent: "cyan" | "amber" | "positive";
}

const steps: Step[] = [
  {
    num: "01",
    title: "Server responds 402",
    accent: "amber",
    facts: [
      "Status 402 · application/json",
      "accepts[] · scheme, network, asset, payTo",
      "maxAmountRequired in atomic units",
      "maxTimeoutSeconds bounds signature validity",
    ],
    code: `GET /api/research?ticker=NVDA
HTTP/1.1 402 Payment Required
content-type: application/json

{
  "accepts": [{
    "scheme": "exact",
    "network": "base-sepolia",
    "maxAmountRequired": "5000",
    "asset": "0x036C...DCF7e",
    "payTo": "0x9830...1633",
    "maxTimeoutSeconds": 300
  }],
  "x402Version": 1
}`,
  },
  {
    num: "02",
    title: "Buyer signs EIP-3009",
    accent: "cyan",
    facts: [
      "Off-chain ECDSA over EIP-712 typed data",
      "domain: USDC v2, chainId 84532",
      "binds amount, recipient, nonce, validity window",
      "Buyer wallet spends zero gas",
    ],
    code: `// signed by buyer EOA, off-chain
TransferWithAuthorization {
  from:         0x8b2f...3b66,
  to:           0x9830...1633,
  value:        5000,             // 0.005 USDC
  validAfter:   1779077038,
  validBefore:  1779077938,
  nonce:        0x6055...e02      // unique
}
// signature = ecdsa(typedDataHash)`,
  },
  {
    num: "03",
    title: "Facilitator settles on-chain",
    accent: "positive",
    facts: [
      "Buyer retries with X-PAYMENT header",
      "Facilitator verifies signature, broadcasts tx",
      "USDC.transferWithAuthorization() emits Transfer",
      "Server returns 200 + tx hash in X-PAYMENT-RESPONSE",
    ],
    code: `GET /api/research?ticker=NVDA
X-PAYMENT: <base64(auth)>

HTTP/1.1 200 OK
X-PAYMENT-RESPONSE: tx=0x021...2424
content-type: application/json

{ "summary": "Synthetic note. NVDA...",
  "riskFactors": [ ... ] }`,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      data-reveal
      className="border-b border-[var(--x-border-bright)] bg-[var(--x-bg-elevated)] relative"
    >
      <div className="absolute left-0 right-0 top-0 h-[6px] tick-ruler opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 py-14 md:py-20">
        <SectionHeader
          eyebrow="Protocol handshake"
          title="Three round trips."
          titleAccent="One signature."
          rightCopy="x402 reuses HTTP semantics. No new transport, no new auth model. The handshake completes in 2-3 seconds end-to-end on Base."
        />

        <ol className="grid md:grid-cols-3 gap-px bg-[var(--x-border)] border border-[var(--x-border-bright)] chrome-border mt-10">
          {steps.map((step) => (
            <Step key={step.num} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ step }: { step: Step }) {
  const accentClass =
    step.accent === "amber"
      ? "text-[var(--x-signal)]"
      : step.accent === "positive"
        ? "text-[var(--x-positive)]"
        : "text-[var(--x-accent)]";
  const bar =
    step.accent === "amber"
      ? "bg-[var(--x-signal)]"
      : step.accent === "positive"
        ? "bg-[var(--x-positive)]"
        : "bg-[var(--x-accent)]";

  return (
    <li className="bg-[var(--x-bg)] p-6 flex flex-col gap-4 relative">
      {/* top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-px ${bar} opacity-70`} />

      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span
            className={`font-mono text-[11px] tracking-[0.28em] ${accentClass} tnum`}
          >
            {step.num}
          </span>
          <h3 className="font-serif text-2xl leading-tight text-[var(--x-text)] tracking-[-0.01em]">
            {step.title}
          </h3>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-faint)]">
          step
        </span>
      </div>

      <ul className="text-[11px] font-mono text-[var(--x-text-muted)] space-y-1.5 leading-relaxed border-l border-[var(--x-border-bright)] pl-3">
        {step.facts.map((f, i) => (
          <li key={i} className="flex gap-2">
            <span className={`${accentClass} flex-none`}>›</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="relative mt-1">
        <div className="absolute -top-2 left-3 px-1.5 text-[8.5px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] bg-[var(--x-bg)]">
          wire
        </div>
        <pre className="bg-black text-[var(--x-chrome-2)] font-mono text-[10.5px] leading-relaxed p-4 pt-5 rounded-none overflow-x-auto border border-[var(--x-border-bright)]">
          <code>{step.code}</code>
        </pre>
      </div>
    </li>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  titleAccent,
  rightCopy,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  rightCopy: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
      <div className="md:max-w-2xl">
        <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] font-mono">
          <span className="text-[var(--x-accent)]">◢</span>
          <span>{eyebrow}</span>
          <span className="ml-2 flex-1 h-px bg-[var(--x-border-bright)] max-w-[200px]" />
        </div>
        <h2
          className="font-serif text-[clamp(2rem,4.6vw,3.6rem)] leading-[0.95] tracking-[-0.03em]"
          style={{ fontVariationSettings: '"opsz" 144', fontWeight: 400 }}
        >
          <span className="chrome-text">{title}</span>
          {titleAccent && (
            <>
              <br />
              <span
                className="italic amber-text"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
              >
                {titleAccent}
              </span>
            </>
          )}
        </h2>
      </div>
      <p className="text-[13px] text-[var(--x-text-muted)] max-w-md font-mono leading-relaxed border-l border-[var(--x-border-bright)] pl-4">
        {rightCopy}
      </p>
    </div>
  );
}
