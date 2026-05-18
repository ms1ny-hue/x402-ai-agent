"use client";

import { useState } from "react";

const PSP_PERCENT = 0.029;
const PSP_FIXED = 0.3;
const X402_GAS_PER_CALL = 0.00005;
const X402_FACILITATOR_BPS = 0.001;

function formatUsd(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CostCalculator() {
  const [calls, setCalls] = useState(100000);
  const [price, setPrice] = useState(0.01);

  const principal = calls * price;
  const pspFees = calls * (price * PSP_PERCENT + PSP_FIXED);
  const x402Fees = calls * (price * X402_FACILITATOR_BPS + X402_GAS_PER_CALL);
  const pspMarginalPct = principal > 0 ? (pspFees / principal) * 100 : 0;
  const x402MarginalPct = principal > 0 ? (x402Fees / principal) * 100 : 0;
  const savings = pspFees - x402Fees;
  const pspViable = price >= 0.5;

  return (
    <section id="economics" className="border-b border-[#0a0e1a]/10 bg-[#f5f1e8]/50">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono mb-3">
              Unit economics calculator
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
              When the rail <em>actually matters.</em>
            </h2>
          </div>
          <p className="text-sm text-[#0a0e1a]/65 max-w-md">
            Plug in a usage pattern. The numbers below are the marginal cost
            of accepting payment, not the cost of building or operating the
            underlying service.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          <div className="border border-[#0a0e1a]/15 rounded-lg p-5 bg-[#fbfaf7] flex flex-col gap-4">
            <Field
              label="Monthly API calls"
              value={calls}
              onChange={setCalls}
              min={100}
              max={10000000}
              step={1000}
              isInt
            />
            <Field
              label="Average price per call (USD)"
              value={price}
              onChange={setPrice}
              min={0.0001}
              max={100}
              step={0.001}
            />
            <div className="text-[11px] text-[#0a0e1a]/55 leading-relaxed pt-2 border-t border-[#0a0e1a]/10">
              PSP assumption: 2.9% + $0.30 (typical online card-not-present).
              x402 assumption: ~5 mils per call (Base gas) + 10 bps
              facilitator. Both are illustrative ranges, not vendor quotes.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <ResultCard
              label="Card-network PSP"
              accent="#0a0e1a"
              principal={principal}
              fees={pspFees}
              marginalPct={pspMarginalPct}
              note={
                pspViable
                  ? "Within typical PSP economics."
                  : "Per-call price below ~$0.50 — fixed component dominates, unit economics break."
              }
              warn={!pspViable}
            />
            <ResultCard
              label="x402 (USDC on Base)"
              accent="#ff6b1a"
              principal={principal}
              fees={x402Fees}
              marginalPct={x402MarginalPct}
              note={
                price < 0.0001
                  ? "Below the practical minimum (100 atomic USDC units)."
                  : "Within typical x402 economics."
              }
              warn={price < 0.0001}
            />
          </div>
        </div>

        <div className="mt-5 border border-[#0a0e1a]/15 rounded-lg p-5 bg-[#0a0e1a] text-[#fbfaf7] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#fbfaf7]/55 font-mono mb-1">
              Difference, monthly
            </div>
            <div className="font-serif text-3xl md:text-4xl tabular-nums">
              {savings >= 0 ? "x402 saves " : "PSP saves "}
              {formatUsd(Math.abs(savings))}
            </div>
          </div>
          <div className="text-sm text-[#fbfaf7]/70 max-w-md leading-relaxed">
            Treat this as a directional comparison, not a quote. Real-world
            PSP rates depend on merchant category, region, and contract
            tier; real-world x402 fees depend on facilitator pricing and
            chain gas at settlement time.
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  isInt,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  isInt?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono">
        {label}
      </span>
      <input
        type="number"
        value={isInt ? Math.round(value) : value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (!Number.isNaN(n)) onChange(n);
        }}
        className="border border-[#0a0e1a]/20 rounded px-3 py-2 font-mono text-sm tabular-nums bg-[#fbfaf7] focus:outline-none focus:border-[#ff6b1a]"
      />
    </label>
  );
}

function ResultCard({
  label,
  accent,
  principal,
  fees,
  marginalPct,
  note,
  warn,
}: {
  label: string;
  accent: string;
  principal: number;
  fees: number;
  marginalPct: number;
  note: string;
  warn?: boolean;
}) {
  return (
    <div className="border border-[#0a0e1a]/15 rounded-lg p-5 bg-[#fbfaf7] flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <div className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono">
          {label}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#0a0e1a]/45 font-mono mb-1">
          Fees this month
        </div>
        <div
          className="font-serif text-3xl md:text-4xl tabular-nums leading-none"
          style={{ color: accent }}
        >
          {formatUsd(fees)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#0a0e1a]/45 font-mono mb-1">
            Principal
          </div>
          <div className="font-mono tabular-nums">{formatUsd(principal)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#0a0e1a]/45 font-mono mb-1">
            Effective rate
          </div>
          <div className="font-mono tabular-nums">
            {marginalPct.toFixed(2)}%
          </div>
        </div>
      </div>
      <p
        className={`text-xs leading-relaxed mt-1 ${warn ? "text-[#a14400]" : "text-[#0a0e1a]/60"}`}
      >
        {note}
      </p>
    </div>
  );
}
