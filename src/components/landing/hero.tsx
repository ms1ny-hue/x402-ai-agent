import Link from "next/link";

interface HeroProps {
  sellerAddress: string;
}

export function Hero({ sellerAddress }: HeroProps) {
  return (
    <section className="border-b border-[#0a0e1a]/10">
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="flex flex-wrap gap-2 items-center mb-6 text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono">
          <span className="rounded-full border border-[#0a0e1a]/15 px-2 py-0.5">
            x402 protocol
          </span>
          <span>·</span>
          <span>EIP-3009 transferWithAuthorization</span>
          <span>·</span>
          <span>USDC on Base Sepolia</span>
          <span>·</span>
          <span>CAIP-2 eip155:84532</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em] mb-6">
          Payment rails for{" "}
          <em className="italic text-[#ff6b1a]">software</em>,
          <br />
          not for humans with cards.
        </h1>

        <p className="text-lg md:text-xl text-[#0a0e1a]/75 max-w-3xl leading-relaxed mb-8">
          A working portfolio prototype where an AI agent settles a stablecoin
          payment per API call over plain HTTP, in seconds, for fractions of a
          cent. Built on the{" "}
          <Link
            href="https://x402.org"
            className="underline decoration-[#0a0e1a]/30 underline-offset-2 hover:text-[#ff6b1a]"
          >
            x402
          </Link>{" "}
          payment-required protocol, USDC on Base Sepolia testnet, and
          Coinbase-managed server wallets.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="#demo"
            className="rounded-full bg-[#0a0e1a] text-[#fbfaf7] px-5 py-2.5 text-sm font-medium hover:bg-[#ff6b1a] transition-colors"
          >
            Watch a payment happen →
          </Link>
          <Link
            href="#how"
            className="rounded-full border border-[#0a0e1a]/25 px-5 py-2.5 text-sm font-medium hover:bg-[#0a0e1a] hover:text-[#fbfaf7] transition-colors"
          >
            How the protocol works
          </Link>
          <Link
            href={`https://sepolia.basescan.org/address/${sellerAddress}`}
            target="_blank"
            className="rounded-full border border-[#0a0e1a]/25 px-5 py-2.5 text-sm font-medium hover:bg-[#0a0e1a] hover:text-[#fbfaf7] transition-colors font-mono"
          >
            Seller wallet on Basescan ↗
          </Link>
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-[#0a0e1a]/10 pt-8">
          <Stat
            label="Settlement"
            value="<5s"
            sub="402 → signed → on-chain"
          />
          <Stat
            label="Min charge"
            value="$0.001"
            sub="vs ~$0.50 on card rails"
          />
          <Stat
            label="Fee per call"
            value="≈ $0.00001"
            sub="Base gas + facilitator"
          />
          <Stat label="Buyer" value="Agent" sub="No card, no checkout" />
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
    <div>
      <dt className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono mb-1.5">
        {label}
      </dt>
      <dd className="font-serif text-3xl md:text-4xl leading-none mb-1.5">
        {value}
      </dd>
      <dd className="text-xs text-[#0a0e1a]/55">{sub}</dd>
    </div>
  );
}
