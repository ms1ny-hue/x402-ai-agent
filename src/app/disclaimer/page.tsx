import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer: x402.demo",
  description:
    "Full legal disclaimer for x402.demo, a personal portfolio prototype by Michael Stanat. Synthetic data, not a regulated product, not financial advice.",
};

export default function DisclaimerPage() {
  return (
    <article className="max-w-3xl mx-auto px-5 py-16">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
        Legal
      </p>
      <h1 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text mb-8">
        Disclaimer.
      </h1>

      <Section title="Personal portfolio prototype">
        <p>
          x402.demo is a personal portfolio prototype created by Michael Stanat
          for educational and demonstration purposes only. It is not a product,
          service, or business. No services are offered. No fees are charged.
          No user accounts are created. No client relationships exist.
        </p>
      </Section>

      <Section title="Not a regulated entity">
        <p>
          x402.demo is not a registered investment adviser, broker-dealer,
          bank, custodian, payment processor, money transmitter, money services
          business (MSB), trust company, treasury management system, electronic
          money institution, virtual asset service provider (VASP), or stablecoin
          issuer. The site does not provide investment, legal, tax, accounting,
          payments, or regulatory advice. The author is not acting in any
          regulated capacity.
        </p>
      </Section>

      <Section title="Not an offer or solicitation">
        <p>
          Nothing on this site constitutes an offer to buy or sell any security,
          stablecoin, tokenized fund, payment service, or other financial
          instrument. No business relationship is formed by visiting this site.
          The protocol demonstration is illustrative; it is not a productized
          payment rail, settlement service, or API monetization platform on
          offer to anyone.
        </p>
      </Section>

      <Section title="Synthetic data">
        <p>
          All research notes, sector commentary, backtest statistics, agent log
          output, settlement narratives, and qualitative views are illustrative
          and synthetic. Research and commentary strings are deterministic
          fixtures generated at build time for portfolio demonstration. They do
          not reflect any analyst view, model output, or proprietary research
          and they do not constitute investment recommendations.
        </p>
        <p>
          The on-chain settlements are real, but on Base Sepolia testnet.
          Testnet USDC has no monetary value. Wallet addresses, transaction
          hashes, and gas costs are illustrative of the protocol mechanics and
          should not be interpreted as production-grade economics.
        </p>
      </Section>

      <Section title="Stylized illustrative tickers">
        <p>
          Ticker references (NVDA, AAPL, MSFT) and sector references
          (semiconductors, banks, energy, payments) are stylized illustrative
          examples used to demonstrate the shape of a paid research API call.
          They do not represent any view on the underlying securities or
          sectors and are not investment recommendations. Any resemblance to
          actual analyst commentary is coincidental.
        </p>
      </Section>

      <Section title="Backtest framing">
        <p>
          The mini backtest tool returns deterministic synthetic statistics
          generated from the input arguments. It is not a real backtest. Real
          backtests must control for survivorship bias, transaction costs,
          slippage, lookahead leakage, regime change, and other corrections
          that this prototype explicitly does not model. Past performance,
          synthetic or otherwise, does not predict future results.
        </p>
      </Section>

      <Section title="Third-party marks">
        <p>
          Brand names, product names, and trademarks of any third party
          referenced on this site (including but not limited to Vercel,
          Coinbase, Coinbase CDP, Base, Base Sepolia, Circle Internet
          Financial, USDC, Tether, USDT, x402, EIP-3009, Stripe, Visa,
          Mastercard, ACH, PayAI, Anthropic, OpenAI, Google, NVDA, AAPL, MSFT)
          are the property of their respective owners. Mention is nominative
          and for context only. It does not imply affiliation, partnership,
          endorsement, sponsorship, or any commercial relationship.
        </p>
      </Section>

      <Section title="Regulatory references are educational">
        <p>
          References elsewhere on this site to FinCEN, OFAC, the SDN list,
          state money transmitter licensing (MTL), MSB classification,
          PCI-DSS, PSD2, the SEC, MiCA, Chainalysis, TRM Labs, KYT, AML,
          sanctions screening, and similar authorities or regimes are
          summaries of publicly available material for the purpose of
          discussing where this prototype would or would not sit in a real
          compliance landscape. They are not legal interpretations. They are
          not legal, compliance, tax, or regulatory advice. They may be
          incomplete or outdated. Anyone with an actual regulatory question
          should consult qualified counsel.
        </p>
      </Section>

      <Section title="AI-generated content">
        <p>
          Portions of this site&apos;s text, code, and design were drafted with
          the assistance of large language models and reviewed by the author.
          AI outputs may contain errors, fabrications, or inaccurate citations
          and should not be relied upon for any operational, financial, or
          regulatory purpose. The chat surface, when enabled, routes through a
          model provider; model output is subject to that provider&apos;s own
          limitations and policies.
        </p>
      </Section>

      <Section title="No employer affiliation">
        <p>
          This site is a personal portfolio project of Michael Stanat. It is
          not affiliated with, endorsed by, or sponsored by any current or
          past employer, client, counterparty, or vendor. Nothing on this
          site represents the views, positions, products, commitments,
          strategy, or roadmap of any employer or affiliated party.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          The site is provided &quot;as is&quot; without warranty of any kind,
          express or implied, including warranties of accuracy, completeness,
          merchantability, fitness for a particular purpose, title, or
          non-infringement. Use at your own risk.
        </p>
      </Section>

      <Section title="No liability">
        <p>
          To the maximum extent permitted by applicable law, Michael Stanat is
          not liable for any direct, indirect, incidental, consequential,
          special, exemplary, or punitive loss, damage, expense, or claim
          arising from use of, reliance on, inability to access, or
          interactions with this site, including any on-chain transactions
          initiated through the demo.
        </p>
      </Section>

      <Section title="Jurisdiction">
        <p>
          This site is hosted in the United States. By accessing it, you
          acknowledge that local laws in your jurisdiction may restrict or
          prohibit such access; you are responsible for compliance with your
          local laws. Any disputes arising from use of this prototype are
          governed by the laws of the State of New York, without regard to
          conflict-of-law principles.
        </p>
      </Section>

      <div className="mt-12 pt-6 border-t border-[var(--x-border)] text-sm text-[var(--x-text-subtle)] font-mono">
        Last updated 2026-05-25. Source on{" "}
        <Link
          href="https://github.com/ms1ny-hue/x402-ai-agent"
          className="underline decoration-[var(--x-border-bright)] hover:text-[var(--x-accent)]"
        >
          GitHub
        </Link>
        .{" "}
        <Link
          href="/"
          className="underline decoration-[var(--x-border-bright)] hover:text-[var(--x-accent)]"
        >
          Back to home
        </Link>
        .
      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-accent)] font-mono mb-2">
        {title}
      </h2>
      <div className="text-[14px] leading-relaxed text-[var(--x-text-muted)] space-y-3">
        {children}
      </div>
    </section>
  );
}
