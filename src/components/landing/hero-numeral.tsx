import { Waveform } from "@/components/landing/waveform";

/**
 * Big-numeral editorial moment between the hero and the operational
 * sections. Treats the protocol's defining number ($0.0001) like a
 * magazine pullquote — one visual beat that says "this is what is
 * different" before the page resumes its data-dense rhythm.
 */
export function HeroNumeral() {
  return (
    <section
      data-reveal
      className="border-b border-[var(--x-border-bright)] bg-[var(--x-bg-deep)] relative overflow-hidden"
    >
      <div className="absolute left-0 right-0 top-0 h-[6px] tick-ruler opacity-60 pointer-events-none" />
      <div className="absolute left-0 right-0 bottom-0 h-[6px] tick-ruler opacity-60 pointer-events-none" />

      {/* atmosphere */}
      <div className="absolute inset-0 cross-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_50%,rgba(251,191,36,0.10),transparent_55%),radial-gradient(ellipse_at_85%_50%,rgba(56,189,248,0.12),transparent_55%)]" />

      <div className="absolute left-0 right-0 top-1/2 h-[160px] -translate-y-1/2 pointer-events-none opacity-35 mix-blend-screen">
        <Waveform
          className="w-full h-full"
          seed={1001}
          amplitude={0.5}
          samples={220}
          stroke="rgba(251, 191, 36, 0.45)"
          strokeShadow="rgba(245, 158, 11, 0.15)"
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-center">
          {/* LEFT — labels */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] font-mono">
              <span className="text-[var(--x-signal)]">◆</span>
              <span>defining envelope</span>
              <span className="ml-2 flex-1 h-px bg-[var(--x-border-bright)] max-w-[60px]" />
            </div>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--x-text-subtle)] mb-3">
              minimum viable charge
            </p>
            <p
              className="font-serif text-2xl md:text-3xl leading-snug text-[var(--x-text-muted)] italic max-w-sm"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
            >
              The number a card network cannot economically reach.
            </p>

            <ul className="mt-6 space-y-2 text-[11px] font-mono text-[var(--x-text-muted)]">
              <Row label="card network floor" value="~$0.50" tone="muted" />
              <Row label="x402 floor" value="$0.0001" tone="amber" />
              <Row label="compression ratio" value="5,000×" tone="cyan" />
            </ul>
          </div>

          {/* RIGHT — giant numeral */}
          <div className="relative">
            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)] mb-2 flex items-baseline gap-3">
              <span>USDC</span>
              <span className="text-[var(--x-text-faint)]">·</span>
              <span>atomic units</span>
              <span className="text-[var(--x-text-faint)]">·</span>
              <span className="text-[var(--x-signal)]">100</span>
            </div>

            <div
              className="font-serif leading-[0.78] tracking-[-0.06em]"
              style={{
                fontSize: "clamp(5rem, 17vw, 14rem)",
                fontVariationSettings: '"opsz" 144, "SOFT" 100',
                fontWeight: 400,
              }}
            >
              <span className="amber-text">$0.0001</span>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[10.5px] font-mono uppercase tracking-[0.22em] text-[var(--x-text-subtle)]">
              <span>
                =&nbsp;
                <span className="text-[var(--x-accent)] tnum">
                  one ten-thousandth
                </span>{" "}
                of a dollar
              </span>
              <span className="text-[var(--x-text-faint)]">·</span>
              <span>
                seller cost ≈{" "}
                <span className="text-[var(--x-text)] tnum">$0.004</span>
              </span>
              <span className="text-[var(--x-text-faint)]">·</span>
              <span>
                buyer gas{" "}
                <span className="text-[var(--x-positive)] tnum">$0.00</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "cyan" | "muted";
}) {
  const toneClass =
    tone === "amber"
      ? "text-[var(--x-signal)]"
      : tone === "cyan"
        ? "text-[var(--x-accent)]"
        : "text-[var(--x-text-muted)]";
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-dashed border-[var(--x-border-bright)] pb-1.5">
      <span className="uppercase tracking-[0.22em] text-[var(--x-text-subtle)]">
        {label}
      </span>
      <span className={`tnum ${toneClass}`}>{value}</span>
    </li>
  );
}
