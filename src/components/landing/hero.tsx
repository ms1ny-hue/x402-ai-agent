import Link from "next/link";

interface HeroProps {
  sellerAddress: string;
}

export function Hero({ sellerAddress }: HeroProps) {
  return (
    <section className="border-b border-[var(--x-border)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_25%_-10%,rgba(125,211,252,0.10),transparent_55%)]" />
      <div className="max-w-6xl mx-auto px-5 pt-12 pb-10 md:pt-16 md:pb-14 relative">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 items-center mb-7 text-[10.5px] uppercase tracking-[0.22em] text-[var(--x-text-muted)] font-mono">
          <span className="border border-[var(--x-border-bright)] px-2 py-0.5">
            HTTP 402
          </span>
          <span className="border border-[var(--x-border-bright)] px-2 py-0.5">
            EIP-3009 transferWithAuthorization
          </span>
          <span className="border border-[var(--x-border-bright)] px-2 py-0.5">
            USDC v2
          </span>
          <span className="border border-[var(--x-border-bright)] px-2 py-0.5">
            base-sepolia · eip155:84532
          </span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-[-0.025em] mb-6">
          <span className="chrome-text">Per-call settlement</span>
          <br />
          <span className="text-[var(--x-text-muted)] italic">over plain HTTP.</span>
        </h1>

        <p className="text-base md:text-lg text-[var(--x-text-muted)] max-w-3xl leading-relaxed mb-8 font-mono">
          A buyer hits a paid endpoint. Server returns 402 with an{" "}
          <code className="text-[var(--x-accent)]">accepts</code> array. Buyer
          signs an EIP-3009 USDC authorization off-chain. Server hands the
          signature to a facilitator, which broadcasts the on-chain settlement
          and returns the resource. No card, no merchant account, no checkout.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="#demo"
            className="rounded-sm bg-gradient-to-b from-[var(--x-chrome-1)] to-[var(--x-chrome-3)] text-black px-4 py-2 text-[12px] font-mono uppercase tracking-[0.18em] hover:from-[var(--x-accent)] hover:to-[var(--x-accent-bright)] hover:text-black transition-colors"
          >
            Trigger a payment →
          </Link>
          <Link
            href="#spec"
            className="rounded-sm border border-[var(--x-border-bright)] text-[var(--x-text)] px-4 py-2 text-[12px] font-mono uppercase tracking-[0.18em] hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors"
          >
            Spec sheet
          </Link>
          <Link
            href={`https://sepolia.basescan.org/address/${sellerAddress}`}
            target="_blank"
            className="rounded-sm border border-[var(--x-border-bright)] text-[var(--x-text-muted)] px-4 py-2 text-[12px] font-mono hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors"
          >
            Seller wallet ↗
          </Link>
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--x-border)] border border-[var(--x-border)]">
          <Stat
            label="end-to-end"
            value="~3s"
            sub="402 → sign → 200 + tx hash"
          />
          <Stat
            label="seller cost / call"
            value="≈ $0.0003"
            sub="base gas, facilitator pays"
          />
          <Stat
            label="buyer gas / call"
            value="$0"
            sub="signed off-chain"
          />
          <Stat
            label="precision"
            value="6 dp"
            sub="USDC atomic units"
          />
        </dl>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-[var(--x-bg-elevated)] p-5">
      <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-2">
        {label}
      </dt>
      <dd className="font-serif text-3xl md:text-4xl leading-none mb-1.5 chrome-text">
        {value}
      </dd>
      <dd className="text-[11px] text-[var(--x-text-subtle)] font-mono">
        {sub}
      </dd>
    </div>
  );
}
