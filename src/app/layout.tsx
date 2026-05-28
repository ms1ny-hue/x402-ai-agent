import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { DisclaimerBar } from "@/components/landing/disclaimer-bar";
import { LiveTicker } from "@/components/landing/live-ticker";
import { SessionBar } from "@/components/landing/session-bar";
import { SectionNav } from "@/components/landing/section-nav";
import { TelemetryDock } from "@/components/landing/telemetry-dock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://x402-ai-agent-zeta.vercel.app"),
  title: "x402.demo: payment rails for software, not for humans with cards",
  description:
    "A working portfolio prototype where an AI agent pays a research API in stablecoin per call, in seconds, for fractions of a cent. Built on x402, EIP-3009, USDC on Base Sepolia. Synthetic data, not investment advice.",
  openGraph: {
    title: "x402.demo: payment rails for software, not for humans with cards",
    description:
      "An AI agent paying an API in stablecoin per call, over HTTP, on Base Sepolia. Portfolio prototype by Michael Stanat.",
    type: "website",
    url: "https://x402-ai-agent-zeta.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "x402.demo: payment rails for software",
    description:
      "AI agent paying an API in stablecoin per call, over HTTP, on Base Sepolia.",
  },
};

const NAV_LINKS = [
  { href: "#how", label: "Handshake" },
  { href: "#demo", label: "Agent" },
  { href: "#payments", label: "On-chain" },
  { href: "#spec", label: "Spec" },
  { href: "#trust", label: "Trust" },
  { href: "#economics", label: "Econ" },
  { href: "#compare", label: "vs PSPs" },
  { href: "#integrate", label: "Integrate" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} ${fraunces.variable} antialiased bg-[var(--x-bg)] text-[var(--x-text)] brushed`}
      >
        <div className="min-h-full flex flex-col relative z-10">
          <SessionBar />
          <DisclaimerBar />
          <LiveTicker />

          <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--x-bg)]/85 border-b border-[var(--x-border-bright)] relative">
            {/* tick ruler beneath the header */}
            <div className="absolute left-0 right-0 bottom-0 h-[6px] tick-ruler opacity-50 pointer-events-none" />

            <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 relative">
              <Link
                href="/"
                className="flex items-center gap-3 font-semibold group"
              >
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-[var(--x-accent-bright)] diode shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
                  <span className="inline-block w-1 h-1 bg-[var(--x-signal)] diode-amber shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
                </span>
                <span className="font-mono text-[13px] tracking-tight text-[var(--x-text)] group-hover:text-white transition-colors">
                  x402<span className="text-[var(--x-text-subtle)]">.demo</span>
                </span>
                <span className="text-[9.5px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] ml-1 border-l border-[var(--x-border-bright)] pl-3 font-mono">
                  payment&nbsp;rails&nbsp;for&nbsp;software
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1 text-[10.5px] font-mono uppercase tracking-[0.22em] text-[var(--x-text-muted)]">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-2.5 py-1.5 hover:text-[var(--x-accent)] hover:bg-white/[0.03] transition-colors border border-transparent hover:border-[var(--x-border-bright)]"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="https://github.com/ms1ny-hue/x402-ai-agent"
                  className="ml-2 rounded-none border border-[var(--x-border-bright)] px-3 py-1.5 hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors font-mono text-[10.5px] uppercase tracking-[0.22em] flex items-center gap-1.5"
                >
                  <span className="text-[var(--x-text-subtle)]">⌗</span>
                  Source
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1 relative">{children}</main>

          <SectionNav />
          <TelemetryDock />

          <footer className="border-t border-[var(--x-border-bright)] mt-16 bg-[var(--x-bg-deep)] relative">
            <div className="absolute left-0 right-0 top-0 h-[6px] tick-ruler opacity-40 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-5 py-10 text-[11px] text-[var(--x-text-muted)] font-mono">
              <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-8 mb-6">
                <div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-mono text-[var(--x-text)] text-sm">
                      x402.demo
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)]">
                      rev 0.5 · sepolia
                    </span>
                  </div>
                  <p className="leading-relaxed text-[var(--x-text-subtle)] max-w-md">
                    Portfolio prototype by Michael Stanat. Synthetic data; not
                    a regulated product, not financial advice, no real client
                    relationships, no employer affiliation.
                  </p>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] mb-3">
                    Surface
                  </div>
                  <ul className="space-y-1.5">
                    <li>
                      <Link
                        href="#how"
                        className="hover:text-[var(--x-accent)]"
                      >
                        Protocol handshake
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#spec"
                        className="hover:text-[var(--x-accent)]"
                      >
                        Spec sheet
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#payments"
                        className="hover:text-[var(--x-accent)]"
                      >
                        On-chain settlement log
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--x-text-subtle)] mb-3">
                    External
                  </div>
                  <ul className="space-y-1.5">
                    <li>
                      <Link
                        href="https://github.com/ms1ny-hue/x402-ai-agent"
                        className="hover:text-[var(--x-accent)]"
                      >
                        Source on GitHub ↗
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/disclaimer"
                        className="hover:text-[var(--x-accent)]"
                      >
                        Full disclaimer →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--x-border)] pt-4 text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-faint)]">
                <span>
                  © {new Date().getUTCFullYear()} Michael Stanat · all
                  prototypes
                </span>
                <span>
                  built with next.js · coinbase cdp · viem · x402-mcp
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
