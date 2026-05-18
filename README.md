# Agentic Research, Pay-Per-Call

A portfolio prototype that demonstrates the [x402](https://x402.org) HTTP payment protocol for AI agents. An LLM agent calls a small set of paid research tools, and a server-managed wallet pays each call in stablecoin (USDC on Base Sepolia testnet).

Live demo: [x402-ai-agent-zeta.vercel.app](https://x402-ai-agent-zeta.vercel.app)

## Why this matters

x402 is a payment rail for software, not for humans with cards. The interesting use case is not "crypto checkout" but agents paying APIs per call, where card-network fees and merchant onboarding would make the unit economics impossible.

| | Payment Service Providers (Stripe, etc.) | x402 |
| --- | --- | --- |
| Rails | Card networks, ACH | USDC on Base or Solana |
| Fees | ~2.9% + 30¢ | Gas + small facilitator fee, often well under 1¢ |
| Minimum viable charge | Around 50¢ before fees dominate | Fractions of a cent |
| Settlement | T+1 to T+2 typical | Seconds, onchain |
| Buyer | A human with a card on file | A wallet, often an AI agent |
| Chargebacks, subscriptions, refunds | First-class | Not native, would be built separately |

For a PM coming out of payments, the framing that matters is that x402 opens a buyer class that PSPs cannot serve cheaply: software agents making sub-cent purchases without a human entering card details.

## What's in the prototype

A chat agent backed by Vercel AI SDK and AI Gateway can call four MCP tools:

| Tool | Paid? | Price | Purpose |
| --- | --- | --- | --- |
| `get_equity_research(ticker)` | Yes | $0.005 | Returns a short qualitative note for a curated ticker. |
| `get_market_commentary(sector)` | Yes | $0.003 | Returns a one-paragraph sector read. |
| `run_mini_backtest(ticker, strategy)` | Yes | $0.010 | Returns deterministically generated synthetic backtest stats. |
| `ping_agent()` | No | Free | Health check, confirms seller agent is reachable. |

Each paid call flows through the x402 server-managed wallet via Coinbase CDP. The buyer agent receives an HTTP 402, signs a stablecoin payment authorization, retries with a payment header, and the server returns the response.

## Production gotcha worth pointing out

The CDP balance API returns amounts in raw atomic units (USDC has six decimals, so `1000000` means `1.00 USDC`). The unmodified starter passes that integer straight to the LLM, which reads it as `1,000,000 USDC` in conversation. This fork adds a `format-usdc-atomic` tool and a system-prompt instruction that converts atomic units before display. It is a small fix, but it is the kind of bug that silently lands in production AI features if no one is reading the tool outputs.

## Stack

- Next.js App Router on Vercel
- Vercel AI SDK + AI Gateway
- AI Elements for the chat UI
- Coinbase CDP for server-managed wallets and the x402 facilitator
- [`x402-mcp`](https://www.npmjs.com/package/x402-mcp) for the paid MCP server
- Base Sepolia testnet by default; switch to `base` mainnet via the `NETWORK` env var

## Running locally

```bash
git clone https://github.com/ms1ny-hue/x402-ai-agent
cd x402-ai-agent
pnpm install
```

Set the three CDP credentials in `.env.local` (see `.env.example`):

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`
- `CDP_WALLET_SECRET`

For AI Gateway, run `vc link` then `vc env pull` to wire up the OIDC token automatically, or supply an `AI_GATEWAY_API_KEY` manually.

Then:

```bash
pnpm dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000). The seller wallet auto-refills from the Coinbase testnet faucet when it runs low, so no manual funding is needed.

## Cost ceiling

The deployed demo runs on testnet, so x402 payments themselves move no real money. Vercel AI Gateway is the only real cost surface, and that is capped via Vercel Spend Management. Set a hard monthly cap in Vercel settings if forking this for your own use.

## Disclaimer

This is a portfolio prototype. It is not a regulated investment product, financial advice, or a recommendation of any security or strategy. Outputs are synthetic, deterministically generated for demonstration, and do not reflect real market data. Any references to backtests are illustrative; they do not control for survivorship bias, transaction costs, slippage, lookahead leakage, or other corrections required for credible quantitative research. References to named companies are for example purposes only and should not be read as a view on any security. Third-party trademarks (Vercel, Coinbase, Base, Stripe, NVDA, AAPL, MSFT, x402) are the property of their respective owners and are used here nominatively for context. Some text and code in this repository was drafted with the assistance of AI tools and reviewed by the author. The author is not acting on behalf of any current or former employer, and nothing in this repository represents the views, positions, products, or commitments of any employer or affiliated party. The software is provided as is, without warranty of any kind, express or implied, including but not limited to fitness for a particular purpose, merchantability, or non-infringement. The author disclaims any liability for losses, damages, or claims arising from use of this software or its outputs. Any disputes arising from use of this prototype are governed by the laws of the State of New York, without regard to conflict-of-law principles.

## Credit

Forked from [`vercel-labs/x402-ai-starter`](https://github.com/vercel-labs/x402-ai-starter) and customized for a payments-and-fintech portfolio narrative.
