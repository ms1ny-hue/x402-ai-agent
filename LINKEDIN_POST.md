# LinkedIn post draft

## Version C (recommended after external review, ~160 words)

Card rails cannot price sub-cent API calls. x402 can.

I built a live prototype where an AI agent pays an API in USDC, per call, on Base Sepolia. The flow is simple: server returns HTTP 402, buyer signs an EIP-3009 USDC authorization off-chain, retries with payment authorization, and the facilitator settles on-chain. Each paid call produces a verifiable transaction hash.

This is testnet, not real funds. The research outputs are synthetic. The payment flow is real.

Includes three paid MCP tools, one free health check, on-chain settlement proof, protocol walkthrough, trust assumptions table, PSP cost comparator, and payments FAQ.

Stack: Next.js, TypeScript, Vercel, Coinbase CDP, x402, MCP, viem, Tailwind, Base Sepolia.

Live demo: https://x402-ai-agent-zeta.vercel.app
Source: https://github.com/ms1ny-hue/x402-ai-agent

---

## Version A (~190 words, thought-piece tone)

Stripe and the card networks were built for a buyer who can hold a card. They are excellent at that. They are not built for a buyer who is software making sub-cent purchases without a human in the loop.

That is the gap x402 is built for. It is an HTTP-native payment protocol that lets a server respond with 402 Payment Required, lets a client (often an AI agent) sign a stablecoin payment inline, and returns the resource on retry. Settlement is in USDC on Base or Solana, in seconds, for a fraction of a cent per call.

Over the weekend I forked Vercel's x402 starter and customized it into a small portfolio prototype: a chat agent that pays a research API in stablecoin, per call, on Base Sepolia testnet. Three paid MCP tools and a free health check. Synthetic data, hedged outputs, not investment advice.

Live demo: https://x402-ai-agent-zeta.vercel.app
Source: https://github.com/ms1ny-hue/x402-ai-agent

What I find interesting is not "crypto checkout for consumers." It is that x402 opens a new buyer class for API monetization. Curious how others are thinking about pricing and metering for agent-driven traffic.

---

## Version B (shorter, ~110 words, shipping-update tone)

Forked Vercel's x402 starter into a small portfolio prototype this weekend: a chat agent that pays a research API in stablecoin (USDC on Base Sepolia testnet), per call, via the x402 HTTP payment protocol. Three paid MCP tools plus a free health check.

The framing I keep coming back to: x402 is not a Stripe replacement for consumers. It is a payment rail for software buyers (AI agents, API callers) where card-network fees and merchant onboarding would make sub-cent unit economics impossible.

Live demo: https://x402-ai-agent-zeta.vercel.app
Source: https://github.com/ms1ny-hue/x402-ai-agent

Synthetic data, hedged outputs, not investment advice. Would love to hear how others are pricing and metering for agent-driven API traffic.

---

## Notes

- All three versions avoid em dashes per the style rule.
- All three keep the named-company language at the level of "research note on a ticker" without endorsing any view on the equity.
- All three include the synthetic-data caveat plain in the post, not buried.
- Tool count phrasing: "three paid MCP tools, one free health check" (not "four paid tools"). The fourth tool is `ping_agent`, which is free.
- Version C reflects an external review pass and is the tightest. Version A is closer to a thought piece. Version B is closer to a shipping update.
- Repo is public at github.com/ms1ny-hue/x402-ai-agent.
- Full disclaimer at x402-ai-agent-zeta.vercel.app/disclaimer.
