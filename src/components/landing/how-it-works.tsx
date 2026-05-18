interface Step {
  num: string;
  title: string;
  detail: string;
  code: string;
}

const steps: Step[] = [
  {
    num: "01",
    title: "Buyer calls a paid endpoint",
    detail:
      "The server responds with HTTP 402 Payment Required and a structured 'accepts' array listing valid payment schemes, prices, networks, and recipient addresses.",
    code: `GET /api/research?ticker=NVDA
HTTP/1.1 402 Payment Required
{
  "accepts": [{
    "scheme": "exact",
    "network": "eip155:84532",
    "maxAmountRequired": "5000",
    "asset": "0x036C...DCF7e",
    "payTo": "0x9830...1633"
  }]
}`,
  },
  {
    num: "02",
    title: "Buyer signs an EIP-3009 authorization",
    detail:
      "The agent's wallet signs a USDC transferWithAuthorization message off-chain. It binds amount, recipient, validAfter, validBefore, and a unique nonce. No gas spent yet.",
    code: `// signed off-chain by buyer
{
  "from": "0x8b2f...3b66",
  "to":   "0x9830...1633",
  "value": "5000",
  "validAfter":  1779077038,
  "validBefore": 1779077938,
  "nonce": "0x6055...e02"
}`,
  },
  {
    num: "03",
    title: "Buyer retries with X-PAYMENT header",
    detail:
      "Same request, now carrying the signed authorization. The seller hands it to a facilitator (here, Coinbase x402) which verifies the signature and submits the on-chain settlement.",
    code: `GET /api/research?ticker=NVDA
X-PAYMENT: <base64-encoded-auth>

HTTP/1.1 200 OK
X-PAYMENT-RESPONSE: tx=0x021...2424
{
  "summary": "Synthetic note. NVDA...",
  "riskFactors": [...]
}`,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="border-b border-[#0a0e1a]/10 bg-[#f5f1e8]/50"
    >
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono mb-3">
              How it works
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
              Three round trips. One signature. <em>Settled.</em>
            </h2>
          </div>
          <p className="text-sm text-[#0a0e1a]/65 max-w-md">
            The x402 handshake reuses HTTP semantics rather than inventing a
            new transport. Any agent that speaks HTTP can pay any server that
            speaks x402, on any supported chain.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <li
              key={step.num}
              className="bg-[#fbfaf7] border border-[#0a0e1a]/10 rounded-lg p-5 flex flex-col gap-3"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-[0.18em] text-[#ff6b1a]">
                  {step.num}
                </span>
                <h3 className="font-serif text-xl leading-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-[#0a0e1a]/70 leading-relaxed">
                {step.detail}
              </p>
              <pre className="bg-[#0a0e1a] text-[#fbfaf7]/90 font-mono text-[10.5px] leading-relaxed p-3 rounded overflow-x-auto mt-1">
                <code>{step.code}</code>
              </pre>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
