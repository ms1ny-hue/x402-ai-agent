import dynamic from "next/dynamic";
import { Hero } from "@/components/landing/hero";
import { HeroNumeral } from "@/components/landing/hero-numeral";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SpecSheet } from "@/components/landing/spec-sheet";
import { TrustAssumptions } from "@/components/landing/trust-assumptions";
import { CostCalculator } from "@/components/landing/cost-calculator";
import { Comparison } from "@/components/landing/comparison";
import { OpenQuestions } from "@/components/landing/open-questions";
import { IntegrationSnippet } from "@/components/landing/integration-snippet";
import { getOrCreateSellerAccount } from "@/lib/accounts";

// Code-split the heavy / interactive sections so they don't ship in the
// initial JS bundle. SSR stays on so the HTML still renders for LCP.
const ChatDemo = dynamic(() =>
  import("@/components/landing/chat-demo").then((m) => ({ default: m.ChatDemo })),
);
const TransactionFeed = dynamic(() =>
  import("@/components/landing/transaction-feed").then((m) => ({
    default: m.TransactionFeed,
  })),
);
const Topology = dynamic(() =>
  import("@/components/landing/topology").then((m) => ({ default: m.Topology })),
);
const ClosingCta = dynamic(() =>
  import("@/components/landing/closing-cta").then((m) => ({ default: m.ClosingCta })),
);

// ISR: regenerate the page at most every 5 minutes. The seller account
// rarely changes, so we don't need force-dynamic; this drops TTFB by
// reusing the cached SSR pass across requests.
export const revalidate = 300;

export default async function Page() {
  let sellerAddress = "0x0000000000000000000000000000000000000000";
  try {
    const seller = await getOrCreateSellerAccount();
    sellerAddress = seller.address;
  } catch {
    // Fall back to placeholder if CDP creds are not configured for this
    // build (e.g. local dev with empty .env). The on-chain feed will
    // surface the real error in its own UI.
  }

  return (
    <>
      <Hero sellerAddress={sellerAddress} />
      <HeroNumeral />
      <HowItWorks />
      <Topology />
      <ChatDemo />
      <TransactionFeed />
      <SpecSheet />
      <TrustAssumptions />
      <CostCalculator />
      <Comparison />
      <OpenQuestions />
      <IntegrationSnippet />
      <ClosingCta />
    </>
  );
}
