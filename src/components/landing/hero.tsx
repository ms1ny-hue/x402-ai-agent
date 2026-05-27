import Link from "next/link";
import { TimingDiagram } from "@/components/landing/timing-diagram";
import { HeroLiveTape } from "@/components/landing/hero-live-tape";

interface HeroProps {
  sellerAddress: string;
}

export function Hero({ sellerAddress }: HeroProps) {
  return (
    <section className="border-b border-[var(--x-border-bright)] relative overflow-hidden scanlines">
      {/* layered backgrounds */}
      <div className="absolute inset-0 engineering-grid opacity-70 pointer-events-none grid-pulse" />
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_-10%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(ellipse_at_85%_120%,rgba(251,191,36,0.10),transparent_55%)]" />

      {/* corner registration crosshairs */}
      <CornerMark className="top-4 left-4" />
      <CornerMark className="top-4 right-4" flip="x" />
      <CornerMark className="bottom-4 left-4" flip="y" />
      <CornerMark className="bottom-4 right-4" flip="xy" />

      <div className="max-w-7xl mx-auto px-5 pt-10 pb-14 md:pt-14 md:pb-20 relative stage">
        {/* TOP INSTRUMENT LABEL */}
        <div
          className="stage-item flex items-center justify-between mb-8 text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)]"
          style={{ ["--i" as unknown as string]: 0 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[var(--x-accent)]">◢</span>
            <span>protocol surface · live</span>
            <span className="text-[var(--x-text-faint)]">/</span>
            <span className="text-[var(--x-text-muted)]">
              instrument&nbsp;001
            </span>
            <span className="text-[var(--x-text-faint)]">/</span>
            <span className="text-[var(--x-signal)]">rev&nbsp;0.5</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span>nominal · stable</span>
            <span
              className="signal-bars"
              data-level="5"
              aria-label="signal strong"
            >
              <span /><span /><span /><span /><span />
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">
          {/* LEFT — headline column */}
          <div>
            <div
              className="bracket-panel relative pl-5 pr-5 pt-7 pb-7 mb-8 stage-item"
              style={{ ["--i" as unknown as string]: 1 }}
            >
              <span className="bracket-tr" />
              <span className="bracket-bl" />

              {/* schema chips */}
              <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center mb-6 text-[9.5px] uppercase tracking-[0.28em] text-[var(--x-text-muted)] font-mono">
                <span className="hud-chip is-live">
                  <span className="w-1 h-1 rounded-full bg-[var(--x-accent-bright)] diode" />
                  http 402
                </span>
                <span className="hud-chip">eip-3009</span>
                <span className="hud-chip">usdc v2</span>
                <span className="hud-chip is-amber">
                  base-sepolia · 84532
                </span>
              </div>

              <h1
                className="font-serif leading-[0.88] tracking-[-0.04em] mb-4"
                style={{
                  fontSize: "clamp(2.6rem, 6.8vw, 6rem)",
                  fontVariationSettings: '"opsz" 144, "SOFT" 100',
                  fontWeight: 400,
                }}
              >
                <span className="chrome-text">Per-call</span>
                <br />
                <span className="amber-text">settlement,</span>
                <br />
                <span
                  className="italic text-[var(--x-text-muted)] font-normal"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
                >
                  over plain
                </span>{" "}
                <span
                  className="not-italic chrome-text"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                >
                  HTTP.
                </span>
              </h1>

              <p className="text-sm md:text-[15px] text-[var(--x-text-muted)] leading-[1.65] mt-6 max-w-[58ch]">
                Buyer hits a paid endpoint. Server returns{" "}
                <code className="text-[var(--x-accent)] font-mono">402</code>{" "}
                with an{" "}
                <code className="text-[var(--x-accent)] font-mono">
                  accepts
                </code>{" "}
                array. Buyer signs an EIP-3009 USDC authorization off-chain.
                Facilitator verifies and broadcasts the on-chain settlement.
                Resource returned with the tx hash.{" "}
                <span className="text-[var(--x-text)]">
                  No card. No merchant account. No checkout.
                </span>
              </p>

              {/* signature row beneath the headline */}
              <div className="mt-6 pt-4 border-t border-dashed border-[var(--x-border-bright)] flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-[0.28em]">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--x-text-subtle)]">latency</span>
                  <span className="tnum text-[var(--x-accent)]">~2.8s</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--x-text-subtle)]">unit cost</span>
                  <span className="tnum text-[var(--x-signal)]">$0.0042</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--x-text-subtle)]">buyer gas</span>
                  <span className="tnum text-[var(--x-positive)]">$0.00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--x-text-subtle)]">finality</span>
                  <span className="tnum text-[var(--x-text)]">L2 seq</span>
                </div>
              </div>
            </div>

            <div
              className="mb-6 stage-item"
              style={{ ["--i" as unknown as string]: 2 }}
            >
              <HeroLiveTape />
            </div>

            <div
              className="flex flex-wrap gap-2 mb-10 stage-item"
              style={{ ["--i" as unknown as string]: 3 }}
            >
              <Link
                href="#demo"
                className="group relative overflow-hidden rounded-none bg-gradient-to-b from-[var(--x-chrome-1)] via-[var(--x-chrome-2)] to-[var(--x-chrome-4)] text-black px-6 py-3 text-[11px] font-mono uppercase tracking-[0.24em] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_0_rgba(0,0,0,0.5)] hover:from-[var(--x-accent)] hover:via-[var(--x-accent-bright)] hover:to-[var(--x-accent-deep)] hover:text-white transition-all"
              >
                <span className="relative z-10">Trigger a payment →</span>
              </Link>
              <Link
                href="#spec"
                className="rounded-none border border-[var(--x-border-bright)] text-[var(--x-text)] px-6 py-3 text-[11px] font-mono uppercase tracking-[0.24em] hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors"
              >
                Spec sheet
              </Link>
              <Link
                href="#trust"
                className="rounded-none border border-[var(--x-border-bright)] text-[var(--x-text)] px-6 py-3 text-[11px] font-mono uppercase tracking-[0.24em] hover:border-[var(--x-signal)] hover:text-[var(--x-signal)] transition-colors"
              >
                Trust assumptions
              </Link>
              <Link
                href={`https://sepolia.basescan.org/address/${sellerAddress}`}
                target="_blank"
                className="rounded-none border border-[var(--x-border-bright)] text-[var(--x-text-muted)] px-6 py-3 text-[11px] font-mono uppercase tracking-[0.24em] hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors"
              >
                Seller wallet ↗
              </Link>
            </div>
          </div>

          {/* RIGHT — live timing oscilloscope */}
          <div
            className="stage-item lg:sticky lg:top-32"
            style={{ ["--i" as unknown as string]: 4 }}
          >
            <TimingDiagram />
          </div>
        </div>

        {/* BIG STAT STRIP */}
        <div
          className="mt-12 stage-item"
          style={{ ["--i" as unknown as string]: 5 }}
        >
          <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-[0.28em]">
            <div className="flex items-center gap-3 text-[var(--x-text-subtle)]">
              <span className="text-[var(--x-accent)]">▣</span>
              <span>protocol envelope · key parameters</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[var(--x-text-subtle)]">
              <span>source · live deployment</span>
              <span className="w-1 h-1 rounded-full bg-[var(--x-accent-bright)] diode" />
            </div>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--x-border)] border border-[var(--x-border-bright)] chrome-border">
            <Stat
              index="01"
              label="end-to-end"
              value="~3s"
              sub="sequencer-confirmed · L2"
              tone="cyan"
              arrow="up"
            />
            <Stat
              index="02"
              label="cost / call"
              value="$0.004"
              sub="base gas + bps · facilitator pays"
              tone="amber"
              arrow="flat"
            />
            <Stat
              index="03"
              label="buyer gas"
              value="$0.00"
              sub="EIP-3009 signed off-chain"
              tone="positive"
              arrow="flat"
            />
            <Stat
              index="04"
              label="precision"
              value="6 dp"
              sub="USDC atomic units"
              tone="chrome"
              arrow="flat"
            />
          </dl>
        </div>

        <p
          className="text-[10px] text-[var(--x-text-subtle)] font-mono mt-4 leading-relaxed stage-item uppercase tracking-[0.22em]"
          style={{ ["--i" as unknown as string]: 6 }}
        >
          ⌗ testnet · free · mainnet ranges shown · facilitator pricing
          shifts between testnet (free) and mainnet · L1 finality on Base
          typically lands within minutes via batched posting.
        </p>
      </div>
    </section>
  );
}

interface StatProps {
  index: string;
  label: string;
  value: string;
  sub: string;
  tone: "cyan" | "amber" | "positive" | "chrome";
  arrow: "up" | "dn" | "flat";
}

function Stat({ index, label, value, sub, tone, arrow }: StatProps) {
  const valueClass =
    tone === "cyan"
      ? "cyan-text"
      : tone === "amber"
        ? "amber-text"
        : tone === "positive"
          ? "text-[var(--x-positive)]"
          : "chrome-text";

  const arrowClass =
    arrow === "up"
      ? "glyph-arrow-up"
      : arrow === "dn"
        ? "glyph-arrow-dn"
        : "glyph-arrow-flat";

  return (
    <div className="bg-[var(--x-bg-elevated)] p-5 relative group hover:bg-[var(--x-bg-elevated-2)] transition-colors">
      <div className="absolute top-2 right-3 text-[9px] font-mono text-[var(--x-text-faint)] tnum">
        {index}
      </div>
      <dt className="text-[9.5px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] font-mono mb-3">
        {label}
      </dt>
      <dd
        className={`font-serif text-4xl md:text-5xl leading-none mb-2 tnum ${valueClass} ${arrowClass}`}
        style={{ fontVariationSettings: '"opsz" 144', fontWeight: 400 }}
      >
        {value}
      </dd>
      <dd className="text-[10px] text-[var(--x-text-subtle)] font-mono uppercase tracking-[0.22em] leading-snug">
        {sub}
      </dd>
    </div>
  );
}

function CornerMark({
  className,
  flip,
}: {
  className?: string;
  flip?: "x" | "y" | "xy";
}) {
  const rotate =
    flip === "x"
      ? "rotate-90"
      : flip === "y"
        ? "-rotate-90"
        : flip === "xy"
          ? "rotate-180"
          : "";
  return (
    <div
      className={`absolute pointer-events-none w-5 h-5 text-[var(--x-text-faint)] ${rotate} ${className ?? ""}`}
      aria-hidden
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="0.8">
        <path d="M0 0 H8 M0 0 V8" />
        <circle cx="0" cy="0" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
