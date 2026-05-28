import { Hero } from "@/components/landing/hero";
import { HeroNumeral } from "@/components/landing/hero-numeral";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ChatDemo } from "@/components/landing/chat-demo";
import { TransactionFeed } from "@/components/landing/transaction-feed";
import { SpecSheet } from "@/components/landing/spec-sheet";
import { TrustAssumptions } from "@/components/landing/trust-assumptions";
import { CostCalculator } from "@/components/landing/cost-calculator";
import { Comparison } from "@/components/landing/comparison";
import { OpenQuestions } from "@/components/landing/open-questions";
import { IntegrationSnippet } from "@/components/landing/integration-snippet";
import { getOrCreateSellerAccount } from "@/lib/accounts";

export const dynamic = "force-dynamic";

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
      <ChatDemo />
      <TransactionFeed />
      <SpecSheet />
      <TrustAssumptions />
      <CostCalculator />
      <Comparison />
      <OpenQuestions />
      <IntegrationSnippet />
    </>
  );
}
