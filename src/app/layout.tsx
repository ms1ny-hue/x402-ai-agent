import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
  title: "Agentic Research, Pay-Per-Call",
  description:
    "A portfolio prototype where an AI agent pays a research API in stablecoin per call, using the x402 protocol on Base Sepolia. Synthetic data, not investment advice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-[#fbfaf7] text-[#0a0e1a]`}
      >
        <div className="min-h-full flex flex-col">
          <header className="sticky top-0 z-40 backdrop-blur-md bg-[#fbfaf7]/85 border-b border-[#0a0e1a]/10">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ff6b1a] animate-pulse" />
                <span className="font-mono text-[13px] tracking-tight">
                  x402.demo
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 ml-2 border-l border-[#0a0e1a]/15 pl-2">
                  testnet
                </span>
              </Link>
              <nav className="flex items-center gap-5 text-[13px] text-[#0a0e1a]/75">
                <Link href="#how" className="hidden md:inline hover:text-[#0a0e1a]">
                  How it works
                </Link>
                <Link href="#demo" className="hidden md:inline hover:text-[#0a0e1a]">
                  Live demo
                </Link>
                <Link href="#payments" className="hidden md:inline hover:text-[#0a0e1a]">
                  Payments
                </Link>
                <Link href="#compare" className="hidden md:inline hover:text-[#0a0e1a]">
                  vs. PSPs
                </Link>
                <Link
                  href="https://github.com/ms1ny-hue/x402-ai-agent"
                  className="rounded-full border border-[#0a0e1a]/20 px-3 py-1 hover:bg-[#0a0e1a] hover:text-[#fbfaf7] transition-colors"
                >
                  GitHub
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[#0a0e1a]/10 mt-16">
            <div className="max-w-6xl mx-auto px-5 py-8 text-[12px] text-[#0a0e1a]/55 flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-[#0a0e1a]/80">x402.demo</span>
                <span>
                  A portfolio prototype by Michael Stanat. Source on{" "}
                  <Link
                    href="https://github.com/ms1ny-hue/x402-ai-agent"
                    className="underline"
                  >
                    GitHub
                  </Link>
                  .
                </span>
              </div>
              <p className="leading-relaxed max-w-4xl">
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
