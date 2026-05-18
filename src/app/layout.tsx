import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <div className="size-full flex flex-col">
          <header className={`${geistSans.className} border-b border-black`}>
            <div className="flex flex-col gap-2 w-full px-4 py-3">
              <div className="flex flex-row gap-2 text-xl font-bold items-baseline justify-center flex-wrap">
                <h1>Agentic Research, Pay-Per-Call</h1>
                <span className="text-sm font-normal text-neutral-500">
                  a portfolio prototype by Michael Stanat
                </span>
              </div>
              <p className="text-sm text-neutral-600 text-center max-w-3xl mx-auto">
                A chat agent that pays a research API in stablecoin per call,
                using the{" "}
                <Link href="https://x402.org" className="underline">
                  x402
                </Link>{" "}
                HTTP payment protocol on{" "}
                <Link
                  href="https://docs.base.org/chain/network-information"
                  className="underline"
                >
                  Base Sepolia
                </Link>
                . Stablecoin rails for AI agents, not a card-network alternative
                for humans. Synthetic data, not investment advice.
              </p>
              <div className="w-full flex flex-row items-center justify-center py-1">
                <div className="flex flex-row gap-5 items-center text-sm">
                  <Link href="/" className="underline">
                    Chat
                  </Link>
                  <Link href="/playground" className="underline">
                    API playground
                  </Link>
                  <Link
                    href="https://github.com/ms1ny-hue/x402-ai-agent"
                    className="underline"
                  >
                    GitHub
                  </Link>
                  <Link href="https://x402.org" className="underline">
                    About x402
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
          <footer className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500 text-center">
            Prototype output is synthetic and illustrative. Not investment
            advice, not affiliated with any issuer, employer, or third party.
            See the README for the full disclaimer.
          </footer>
        </div>
      </body>
    </html>
  );
}
