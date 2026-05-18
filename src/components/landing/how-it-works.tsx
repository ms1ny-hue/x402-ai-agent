interface Step {
  num: string;
  title: string;
  facts: string[];
  code: string;
}

const steps: Step[] = [
  {
    num: "01",
    title: "Server responds 402",
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
      className="border-b border-[var(--x-border)] bg-[var(--x-bg-elevated)]"
    >
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
              Protocol handshake
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text">
              Three round trips. One signature.
            </h2>
          </div>
          <p className="text-sm text-[var(--x-text-muted)] max-w-md font-mono">
            x402 reuses HTTP semantics. No new transport, no new auth model.
            The handshake completes in 2-3 seconds end-to-end on Base.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-px bg-[var(--x-border)] border border-[var(--x-border)]">
          {steps.map((step) => (
            <li
              key={step.num}
              className="bg-[var(--x-bg)] p-5 flex flex-col gap-3"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--x-accent)]">
                  {step.num}
                </span>
                <h3 className="font-serif text-xl leading-tight text-[var(--x-text)]">
                  {step.title}
                </h3>
              </div>
              <ul className="text-[11px] font-mono text-[var(--x-text-muted)] space-y-1 leading-relaxed">
                {step.facts.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--x-text-subtle)]">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <pre className="bg-black text-[var(--x-chrome-2)] font-mono text-[10.5px] leading-relaxed p-3 rounded-sm overflow-x-auto mt-1 border border-[var(--x-border)]">
                <code>{step.code}</code>
              </pre>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
