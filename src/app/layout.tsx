import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { DisclaimerBar } from "@/components/landing/disclaimer-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://x402-ai-agent-zeta.vercel.app"),
  title: "x402.demo — payment rails for software, not for humans with cards",
  description:
    "A working portfolio prototype where an AI agent pays a research API in stablecoin per call, in seconds, for fractions of a cent. Built on x402, EIP-3009, USDC on Base Sepolia. Synthetic data, not investment advice.",
  openGraph: {
    title: "x402.demo — payment rails for software, not for humans with cards",
    description:
      "An AI agent paying an API in stablecoin per call, over HTTP, on Base Sepolia. Portfolio prototype by Michael Stanat.",
    type: "website",
    url: "https://x402-ai-agent-zeta.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "x402.demo — payment rails for software",
    description:
      "AI agent paying an API in stablecoin per call, over HTTP, on Base Sepolia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-[var(--x-bg)] text-[var(--x-text)] brushed`}
      >
        <div className="min-h-full flex flex-col">
          <DisclaimerBar />
          <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--x-bg)]/85 border-b border-[var(--x-border)]">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--x-accent-bright)] animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.7)]" />
                <span className="font-mono text-[13px] tracking-tight text-[var(--x-text)]">
                  x402.demo
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] ml-2 border-l border-[var(--x-border-bright)] pl-2">
                  testnet
                </span>
              </Link>
              <nav className="flex items-center gap-4 text-[12px] text-[var(--x-text-muted)]">
                <Link href="#how" className="hidden md:inline hover:text-[var(--x-text)]">
                  How
                </Link>
                <Link href="#demo" className="hidden md:inline hover:text-[var(--x-text)]">
                  Demo
                </Link>
                <Link href="#payments" className="hidden md:inline hover:text-[var(--x-text)]">
                  On-chain
                </Link>
                <Link href="#spec" className="hidden md:inline hover:text-[var(--x-text)]">
                  Spec
                </Link>
                <Link href="#economics" className="hidden md:inline hover:text-[var(--x-text)]">
                  Economics
                </Link>
                <Link href="#compare" className="hidden md:inline hover:text-[var(--x-text)]">
                  vs PSPs
                </Link>
                <Link href="#questions" className="hidden md:inline hover:text-[var(--x-text)]">
                  Q&amp;A
                </Link>
                <Link href="#integrate" className="hidden md:inline hover:text-[var(--x-text)]">
                  Integrate
                </Link>
                <Link
                  href="https://github.com/ms1ny-hue/x402-ai-agent"
                  className="rounded-sm border border-[var(--x-border-bright)] px-2.5 py-1 hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors font-mono text-[11px] uppercase tracking-[0.18em]"
                >
                  Source
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[var(--x-border)] mt-16 bg-[var(--x-bg-elevated)]">
            <div className="max-w-6xl mx-auto px-5 py-8 text-[12px] text-[var(--x-text-muted)] flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-[var(--x-text)]">x402.demo</span>
                <span>
                  Portfolio prototype by Michael Stanat. Source on{" "}
                  <Link
                    href="https://github.com/ms1ny-hue/x402-ai-agent"
                    className="underline decoration-[var(--x-border-bright)] hover:text-[var(--x-accent)]"
                  >
                    GitHub
                  </Link>
                  .
                </span>
              </div>
              <p className="leading-relaxed max-w-4xl text-[var(--x-text-subtle)]">
                Prototype output is synthetic and illustrative. Not investment
                advice, not affiliated with any issuer, employer, or third
                party. Third-party trademarks used nominatively for context.
                Some content drafted with AI assistance and reviewed by the
                author. See the README for the full disclaimer.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
