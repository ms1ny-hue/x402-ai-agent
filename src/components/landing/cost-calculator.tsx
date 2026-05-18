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
  const pspViable = price >= 0.5;
  const savings = pspViable ? pspFees - x402Fees : 0;

  return (
    <section id="economics" className="border-b border-[var(--x-border)]">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
              Unit economics
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text">
              When the rail actually matters.
            </h2>
          </div>
          <p className="text-sm text-[var(--x-text-muted)] max-w-md font-mono">
            Marginal cost of accepting payment. Not the cost of operating
            the underlying service.
          </p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-px bg-[var(--x-border)] border border-[var(--x-border)]">
          <div className="bg-[var(--x-bg-elevated)] p-5 flex flex-col gap-4">
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
            <div className="text-[10.5px] text-[var(--x-text-subtle)] leading-relaxed pt-3 border-t border-[var(--x-border)] font-mono">
              PSP: 2.9% + $0.30 (CNP card). x402: ~5 mils gas + 10 bps
              facilitator. Illustrative ranges, not vendor quotes.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-[var(--x-border)]">
            {pspViable ? (
              <ResultCard
                label="Card-network PSP"
                accent="var(--x-text)"
                principal={principal}
                fees={pspFees}
                marginalPct={pspMarginalPct}
                note="Within typical online card-not-present economics."
                warn={false}
              />
            ) : (
              <NotViableCard
                label="Card-network PSP"
                principal={principal}
              />
            )}
            <ResultCard
              label="x402 (USDC on Base)"
              accent="var(--x-accent)"
              principal={principal}
              fees={x402Fees}
              marginalPct={x402MarginalPct}
              note={
                price < 0.0001
                  ? "Below 100 atomic USDC. Use batch-settlement instead."
                  : "Within typical x402 economics on Base mainnet."
              }
              warn={price < 0.0001}
            />
          </div>
        </div>

        <div className="mt-px bg-black text-[var(--x-chrome-1)] border border-[var(--x-border)] border-t-0 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-1">
              {pspViable ? "Monthly delta" : "Verdict"}
            </div>
            <div className="font-serif text-3xl md:text-4xl tabular-nums chrome-text">
              {pspViable
                ? `${savings >= 0 ? "x402 saves " : "PSP saves "}${formatUsd(Math.abs(savings))}`
                : "Use case not viable on card rails"}
            </div>
          </div>
          <div className="text-[12px] text-[var(--x-text-subtle)] max-w-md leading-relaxed font-mono">
            {pspViable
              ? "Directional. Real PSP rates depend on MCC, region, contract tier. Real x402 fees depend on facilitator pricing and chain gas at settlement."
              : "At this per-call price the PSP fixed component alone exceeds the principal. The interesting question is not how much x402 saves; it is that the use case only exists on x402-style rails."}
          </div>
        </div>
      </div>
    </section>
  );
}

function NotViableCard({
  label,
  principal,
}: {
  label: string;
  principal: number;
}) {
  return (
    <div className="bg-[var(--x-bg-elevated)] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono">
          {label}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-1">
          Fees / month
        </div>
        <div className="font-serif text-3xl md:text-4xl tabular-nums leading-none text-amber-300">
          Not viable
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] mb-1">
            Principal
          </div>
          <div className="tabular-nums text-[var(--x-text)]">
            {formatUsd(principal)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] mb-1">
            Effective
          </div>
          <div className="tabular-nums text-amber-300">{"> 100%"}</div>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed mt-1 font-mono text-amber-300">
        Per-call price below ~$0.50. The $0.30 PSP fixed component alone
        exceeds the principal on most calls. Card rails cannot serve this
        use case at unit economics that work.
      </p>
    </div>
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
      <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono">
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
        className="border border-[var(--x-border-bright)] rounded-sm px-3 py-2 font-mono text-sm tabular-nums bg-[var(--x-bg)] text-[var(--x-text)] focus:outline-none focus:border-[var(--x-accent)]"
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
    <div className="bg-[var(--x-bg-elevated)] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono">
          {label}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-1">
          Fees / month
        </div>
        <div
          className="font-serif text-3xl md:text-4xl tabular-nums leading-none chrome-text"
          style={{ color: accent }}
        >
          {formatUsd(fees)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] mb-1">
            Principal
          </div>
          <div className="tabular-nums text-[var(--x-text)]">
            {formatUsd(principal)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] mb-1">
            Effective
          </div>
          <div className="tabular-nums text-[var(--x-text)]">
            {marginalPct.toFixed(2)}%
          </div>
        </div>
      </div>
      <p
        className={`text-[11px] leading-relaxed mt-1 font-mono ${warn ? "text-amber-300" : "text-[var(--x-text-subtle)]"}`}
      >
        {note}
      </p>
    </div>
  );
}
