# x402.demo · Payment rails for software, not for humans with cards

A working portfolio prototype that demonstrates the [x402](https://x402.org) HTTP-native payment protocol for AI agents. An LLM agent calls a paid research API; a server-managed wallet settles each call in stablecoin (USDC on Base Sepolia testnet) within seconds.

**Live demo:** [x402-ai-agent-zeta.vercel.app](https://x402-ai-agent-zeta.vercel.app)

## What this demonstrates

x402 is not a Stripe replacement for consumers. It is a payment rail for software buyers (AI agents, API callers) where card-network fees and merchant onboarding make sub-cent unit economics impossible.

| | Card-network PSP | x402 |
| --- | --- | --- |
| Rails | Visa / Mastercard / ACH | USDC on Base or Solana |
| Marginal fee | ~2.9% + $0.30 | Gas + small facilitator fee, well under 1¢ |
| Viable minimum charge | ~$0.50 | $0.0001 (100 atomic USDC units) |
| Settlement | T+1 to T+2 typical | Seconds, on-chain |
| Buyer | Human with stored card | Wallet, often an autonomous agent |
| Chargebacks, subs, refunds | First-class | Build separately |
| Onboarding | Merchant account, KYC | Wallet address + facilitator URL |

## How the protocol handshake works

1. Buyer calls a paid endpoint. Server returns **HTTP 402 Payment Required** with a structured `accepts` array (scheme, network, price, recipient, asset).
2. Buyer signs an off-chain **EIP-3009 `transferWithAuthorization`** message binding amount, recipient, validAfter, validBefore, and a unique nonce. No gas yet.
3. Buyer retries with an `X-PAYMENT` header carrying the signed authorization. Seller hands it to a facilitator (here, Coinbase x402) which verifies the signature and settles on-chain. Seller returns 200 with the resource and a settlement tx hash in `X-PAYMENT-RESPONSE`.

The whole round trip completes in a few seconds on Base Sepolia.

## What is in this repo

| File | Purpose |
| --- | --- |
| `src/app/page.tsx` | Composed landing page (server component) |
| `src/components/landing/disclaimer-bar.tsx` | Persistent top-of-page truth-in-advertising bar |
| `src/components/landing/hero.tsx` | Hero with editorial typography, stats strip, CTAs |
| `src/components/landing/how-it-works.tsx` | Three-step protocol explainer with real payloads |
| `src/components/landing/chat-demo.tsx` | Embedded chat that triggers paid MCP tool calls |
| `src/components/landing/transaction-feed.tsx` | Live on-chain feed (polls every 15s) plus proof-of-realness callout and aggregate stats |
| `src/components/landing/cost-calculator.tsx` | Interactive x402 vs PSP cost comparator |
| `src/components/landing/comparison.tsx` | PSP vs x402 dimensions table |
| `src/components/landing/open-questions.tsx` | 10-question FAQ addressing TradFi skeptic objections |
| `src/components/landing/integration-snippet.tsx` | "Two files, that's the integration" code section |
| `src/app/mcp/route.ts` | Paid MCP server: research, commentary, mini-backtest, ping |
| `src/app/api/chat/route.ts` | Chat handler wiring AI SDK to the paid MCP client |
| `src/app/api/transactions/route.ts` | Server-side RPC query for incoming USDC Transfers to the seller wallet, plus aggregate stats |
| `src/app/opengraph-image.tsx` | Generated OG image for social sharing |
| `src/lib/accounts.ts` | CDP server-wallet provisioning + testnet auto-faucet |

## Paid tools exposed by the MCP server

| Tool | Price | Purpose |
| --- | --- | --- |
| `get_equity_research(ticker)` | 0.005 USDC (5,000 atomic) | Short qualitative note for a curated ticker (NVDA, AAPL, MSFT) |
| `get_market_commentary(sector)` | 0.003 USDC (3,000 atomic) | One-paragraph qualitative sector read (semis, banks, energy, payments) |
| `run_mini_backtest(ticker, strategy)` | 0.010 USDC (10,000 atomic) | Deterministic synthetic backtest stats |
| `ping_agent()` | Free | Health check, confirms seller agent and network |

All outputs are synthetic. The named-ticker references are illustrative, not investment views.

## Notable engineering decisions

- **GPT-4o is the default model.** Gemini Flash Lite is available in the dropdown but smaller models tend to refuse the "auto-authorize" instruction, breaking the one-click demo. Cost exposure is bounded by Vercel Spend Management plus the free AI Gateway credit pool.
- **Auto-authorize on testnet.** The system prompt instructs the model to call the paid tool, take the 402, sign the authorization, and retry without asking the user. A mainnet variant should reinstate explicit confirmation per call.
- **402 handshake hidden from chat UI.** AI Elements labels the first 402 response as "Error" since its raw state is `output-error`. A duplicate-detection pass in `chat-demo.tsx` drops the first occurrence of any paid tool that gets retried, keeping the chat focused on the actual answer.
- **On-chain feed via paginated `eth_getLogs`.** Base Sepolia's public RPC caps a single `eth_getLogs` call at 2,000 blocks; the route walks backwards in 1,900-block chunks (up to five) to surface roughly the last hour of incoming USDC Transfers.
- **Atomic-units precision in chat output.** Every settled call appends a line in the form `Settled 0.005 USDC (5,000 atomic units) on Base Sepolia.` Tilde-approximation language is explicitly banned from the system prompt.

## Stack

- Next.js App Router on Vercel
- Vercel AI SDK + AI Gateway
- AI Elements for the chat surface
- Coinbase CDP for server-managed wallets and the x402 facilitator
- [`x402-mcp`](https://www.npmjs.com/package/x402-mcp) for the paid MCP server
- viem for read-only Base Sepolia RPC calls
- Tailwind 4, Instrument Serif + Geist Sans + Geist Mono
- Base Sepolia testnet by default; switch to `base` mainnet via the `NETWORK` env var

## Running locally

```bash
git clone https://github.com/ms1ny-hue/x402-ai-agent
cd x402-ai-agent
pnpm install
```

Three CDP credentials in `.env.local`:

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`

Wire up AI Gateway: `vc link && vc env pull` to pull the OIDC token automatically, or set `AI_GATEWAY_API_KEY` directly. Then:

```bash
pnpm dev
```

App on [http://localhost:3000](http://localhost:3000). The seller wallet auto-refills from Coinbase's Base Sepolia faucet when its USDC balance dips below 0.5 USDC.

## Cost ceiling

The demo runs on testnet, so x402 payments themselves move no real money. Vercel AI Gateway is the only real cost surface, and Vercel Spend Management lets you cap monthly exposure to a flat dollar amount that auto-pauses the project on breach.

## Disclaimer

This is a portfolio prototype. It is not a regulated investment product, financial advice, or a recommendation of any security or strategy. Outputs are synthetic, deterministically generated for demonstration, and do not reflect real market data. Any references to backtests are illustrative; they do not control for survivorship bias, transaction costs, slippage, lookahead leakage, or other corrections required for credible quantitative research. References to named companies are for example purposes only and should not be read as a view on any security. Third-party trademarks (Vercel, Coinbase, Base, Stripe, USDC, NVDA, AAPL, MSFT, Visa, Mastercard, x402) are the property of their respective owners and are used here nominatively for context. Some text and code in this repository was drafted with the assistance of AI tools and reviewed by the author. The author is not acting on behalf of any current or former employer, and nothing in this repository represents the views, positions, products, or commitments of any employer or affiliated party. The software is provided as is, without warranty of any kind, express or implied, including but not limited to fitness for a particular purpose, merchantability, or non-infringement. The author disclaims any liability for losses, damages, or claims arising from use of this software or its outputs. Any disputes arising from use of this prototype are governed by the laws of the State of New York, without regard to conflict-of-law principles.

## Credit

Forked from [`vercel-labs/x402-ai-starter`](https://github.com/vercel-labs/x402-ai-starter) and substantially rewritten as a payments-and-fintech portfolio piece.
