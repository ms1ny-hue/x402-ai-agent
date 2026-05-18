import Link from "next/link";

interface HeroProps {
  sellerAddress: string;
}

export function Hero({ sellerAddress }: HeroProps) {
  return (
    <section className="border-b border-[var(--x-border)] relative overflow-hidden scanlines">
      <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_-10%,rgba(125,211,252,0.16),transparent_55%),radial-gradient(circle_at_85%_110%,rgba(228,228,231,0.06),transparent_55%)]" />

      <div className="max-w-6xl mx-auto px-5 pt-14 pb-12 md:pt-20 md:pb-16 relative">
        {/* Top instrument label */}
        <div className="flex items-center justify-between mb-8 text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--x-text-subtle)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--x-accent)]">◢</span>
            <span>protocol surface · live</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>signal · stable</span>
            <span className="w-1 h-1 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
          </div>
        </div>

        <div className="bracket-panel relative pl-3 pr-3 pt-6 pb-6 mb-10">
          <span className="bracket-tr" />
          <span className="bracket-bl" />

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 items-center mb-6 text-[10px] uppercase tracking-[0.28em] text-[var(--x-text-muted)] font-mono">
            <span className="text-[var(--x-text-subtle)]">⌗</span>
            <span>http 402</span>
            <span className="text-[var(--x-text-subtle)]">/</span>
            <span>eip-3009 transferWithAuthorization</span>
            <span className="text-[var(--x-text-subtle)]">/</span>
            <span>usdc v2</span>
            <span className="text-[var(--x-text-subtle)]">/</span>
            <span>caip-2 eip155:84532</span>
          </div>

          <h1
            className="font-serif text-[clamp(2.4rem,7vw,5.6rem)] leading-[0.92] tracking-[-0.035em] mb-2"
            style={{
              fontVariationSettings: '"opsz" 144, "SOFT" 100',
              fontWeight: 400,
            }}
          >
            <span className="chrome-text">Per-call settlement,</span>
            <br />
            <span
              className="italic text-[var(--x-text-muted)]"
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

          <p className="text-sm md:text-base text-[var(--x-text-muted)] max-w-3xl leading-relaxed mt-6 font-mono">
            Buyer hits a paid endpoint. Server returns{" "}
            <code className="text-[var(--x-accent)]">402</code> with an{" "}
            <code className="text-[var(--x-accent)]">accepts</code> array.
            Buyer signs an EIP-3009 USDC authorization off-chain. Facilitator
            verifies and broadcasts the on-chain settlement. Resource is
            returned with the tx hash. No card. No merchant account. No
            checkout.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          <Link
            href="#demo"
            className="rounded-sm bg-gradient-to-b from-[var(--x-chrome-1)] via-[var(--x-chrome-2)] to-[var(--x-chrome-4)] text-black px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] hover:from-[var(--x-accent)] hover:to-[var(--x-accent-bright)] hover:text-black transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
          >
            Trigger a payment →
          </Link>
          <Link
            href="#spec"
            className="rounded-sm border border-[var(--x-border-bright)] text-[var(--x-text)] px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors"
          >
            Spec sheet
          </Link>
          <Link
            href="#trust"
            className="rounded-sm border border-[var(--x-border-bright)] text-[var(--x-text)] px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors"
          >
            Trust assumptions
          </Link>
          <Link
            href={`https://sepolia.basescan.org/address/${sellerAddress}`}
            target="_blank"
            className="rounded-sm border border-[var(--x-border-bright)] text-[var(--x-text-muted)] px-5 py-2.5 text-[11px] font-mono hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors"
          >
            Seller wallet ↗
          </Link>
        </div>

        <div className="bracket-panel relative">
          <span className="bracket-tr" />
          <span className="bracket-bl" />
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--x-border)] border border-[var(--x-border)]">
            <Stat
              index="01"
              label="end-to-end"
              value="~3s"
              sub="sequencer-confirmed, L2"
            />
            <Stat
              index="02"
              label="seller cost / call"
              value="~$0.001-0.01"
              sub="base mainnet gas, facilitator pays"
            />
            <Stat
              index="03"
              label="buyer gas / call"
              value="$0"
              sub="eip-3009 signed off-chain"
            />
            <Stat
              index="04"
              label="precision"
              value="6 dp"
              sub="usdc atomic units"
            />
          </dl>
        </div>
        <p className="text-[10px] text-[var(--x-text-subtle)] font-mono mt-4 leading-relaxed">
          ⌗ testnet values free. mainnet ranges shown above. facilitator
          pricing shifts between testnet (free) and mainnet (varies). L1
          finality on Base typically lands within minutes via batched
          posting.
        </p>
      </div>
    </section>
  );
}

function Stat({
  index,
  label,
  value,
  sub,
}: {
  index: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-[var(--x-bg-elevated)] p-5 relative">
      <div className="absolute top-2 right-2 text-[9px] font-mono text-[var(--x-text-subtle)] tabular-nums">
        {index}
      </div>
      <dt className="text-[10px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] font-mono mb-3">
        {label}
      </dt>
      <dd
        className="font-serif text-3xl md:text-4xl leading-none mb-2 chrome-text"
        style={{ fontVariationSettings: '"opsz" 144', fontWeight: 400 }}
      >
        {value}
      </dd>
      <dd className="text-[10.5px] text-[var(--x-text-subtle)] font-mono uppercase tracking-[0.18em]">
        {sub}
      </dd>
    </div>
  );
}
