import Link from "next/link";
import { TimingDiagram } from "@/components/landing/timing-diagram";
import { HeroLiveTape } from "@/components/landing/hero-live-tape";
import { Waveform, Sparkline } from "@/components/landing/waveform";

interface HeroProps {
  sellerAddress: string;
}

export function Hero({ sellerAddress }: HeroProps) {
  return (
    <section className="border-b border-[var(--x-border-bright)] relative overflow-hidden scanlines">
      {/* layered backgrounds */}
      <div className="absolute inset-0 engineering-grid opacity-70 pointer-events-none grid-pulse" />
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_-10%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(ellipse_at_85%_120%,rgba(251,191,36,0.12),transparent_55%)]" />

      {/* atmospheric waveform behind the headline */}
      <div className="absolute left-0 right-0 top-[35%] h-[180px] pointer-events-none opacity-50 mix-blend-screen">
        <Waveform
          className="w-full h-full"
          seed={84532}
          amplitude={0.85}
          samples={260}
          stroke="rgba(125, 211, 252, 0.45)"
          strokeShadow="rgba(56, 189, 248, 0.18)"
        />
      </div>
      <div className="absolute left-0 right-0 top-[55%] h-[120px] pointer-events-none opacity-30 mix-blend-screen">
        <Waveform
          className="w-full h-full"
          seed={2024}
          amplitude={0.55}
          samples={180}
          stroke="rgba(251, 191, 36, 0.4)"
          strokeShadow="rgba(245, 158, 11, 0.15)"
        />
      </div>

      {/* giant watermark rev tag */}
      <div
        className="absolute right-[-2vw] top-[8vh] pointer-events-none select-none font-serif italic text-[clamp(8rem,18vw,18rem)] leading-none text-[var(--x-border-bright)] opacity-[0.06] hidden md:block"
        aria-hidden
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
      >
        x402
      </div>

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
              <Link href="#demo" className="console-button-primary">
                <span>Trigger a payment</span>
                <span aria-hidden>→</span>
              </Link>
              <Link href="#spec" className="console-button-ghost">
                <span className="text-[var(--x-text-faint)]">◇</span>
                <span>Spec sheet</span>
              </Link>
              <Link
                href="#trust"
                className="console-button-ghost is-amber"
              >
                <span className="text-[var(--x-text-faint)]">⚠</span>
                <span>Trust assumptions</span>
              </Link>
              <Link
                href={`https://sepolia.basescan.org/address/${sellerAddress}`}
                target="_blank"
                className="console-button-ghost"
              >
                <span>Seller wallet</span>
                <span aria-hidden>↗</span>
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
              spark={[3.2, 3.1, 2.9, 3.0, 2.8, 2.7, 2.9, 2.6, 2.8, 2.5, 2.8]}
            />
            <Stat
              index="02"
              label="cost / call"
              value="$0.004"
              sub="base gas + bps · facilitator pays"
              tone="amber"
              arrow="flat"
              spark={[0.0042, 0.0040, 0.0044, 0.0041, 0.0039, 0.0042, 0.0043, 0.0041, 0.0042]}
            />
            <Stat
              index="03"
              label="buyer gas"
              value="$0.00"
              sub="EIP-3009 signed off-chain"
              tone="positive"
              arrow="flat"
              spark={[0, 0, 0, 0, 0, 0, 0, 0, 0]}
            />
            <Stat
              index="04"
              label="precision"
              value="6 dp"
              sub="USDC atomic units"
              tone="chrome"
              arrow="flat"
              spark={[6, 6, 6, 6, 6, 6, 6, 6, 6]}
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
  spark: number[];
}

function Stat({ index, label, value, sub, tone, arrow, spark }: StatProps) {
  const valueClass =
    tone === "cyan"
      ? "cyan-text"
      : tone === "amber"
        ? "amber-text"
        : tone === "positive"
          ? "text-[var(--x-positive)]"
          : "chrome-text";

  const sparkColor =
    tone === "cyan"
      ? "rgba(125,211,252,0.85)"
      : tone === "amber"
        ? "rgba(251,191,36,0.85)"
        : tone === "positive"
          ? "rgba(52,211,153,0.85)"
          : "rgba(212,212,216,0.65)";

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
      <div className="mt-3 h-[18px]" style={{ color: sparkColor }}>
        <Sparkline
          values={spark}
          width={120}
          height={18}
          stroke="currentColor"
          className="w-full h-full"
        />
      </div>
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
