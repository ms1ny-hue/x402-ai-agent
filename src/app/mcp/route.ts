import { createPaidMcpHandler } from "x402-mcp";
import z from "zod";
import { facilitator } from "@coinbase/x402";
import { env } from "@/lib/env";
import { getOrCreateSellerAccount } from "@/lib/accounts";

const DISCLAIMER =
  "Synthetic prototype output. Not investment advice. No affiliation with any issuer or employer.";

interface ResearchNote {
  summary: string;
  qualitativeView: string;
  riskFactors: string[];
}

const equityResearch: Record<string, ResearchNote> = {
  NVDA: {
    summary:
      "Synthetic note. NVDA continues to anchor the accelerator narrative, with discussion centered on data-center demand durability and the cadence of next-generation product launches.",
    qualitativeView:
      "Bull and bear arguments both lean on the same variables: hyperscaler capex trajectories and the pace at which custom silicon competes for inference workloads.",
    riskFactors: [
      "Hyperscaler capex digestion risk",
      "Competition from custom inference silicon",
      "Concentration in a small set of buyers",
    ],
  },
  AAPL: {
    summary:
      "Synthetic note. AAPL's discussion remains framed around services growth, on-device AI positioning, and the cadence of hardware refresh cycles.",
    qualitativeView:
      "The qualitative debate is less about hardware unit growth and more about whether services attach rates and AI-driven feature monetization can offset slower device upgrade behavior.",
    riskFactors: [
      "Regulatory pressure on services economics",
      "China demand and supply chain exposure",
      "Pace of on-device AI differentiation",
    ],
  },
  MSFT: {
    summary:
      "Synthetic note. MSFT is positioned as a platform beneficiary of enterprise AI adoption, with Azure inference and Copilot attach rates as the two variables most discussed.",
    qualitativeView:
      "Watchers tend to focus on whether AI-driven Azure consumption growth offsets margin compression from incremental compute and licensing.",
    riskFactors: [
      "Capex intensity of AI infrastructure",
      "Enterprise budget reprioritization",
      "Partnership concentration in AI supply",
    ],
  },
};

function buildResearchNote(ticker: string): ResearchNote {
  const upper = ticker.toUpperCase();
  if (equityResearch[upper]) {
    return equityResearch[upper];
  }
  return {
    summary: `Synthetic note. ${upper} is outside this prototype's curated coverage list. Treat the response as illustrative formatting only.`,
    qualitativeView:
      "No qualitative view is available for tickers outside the curated list. Add the ticker to the equityResearch map in src/app/mcp/route.ts to extend coverage.",
    riskFactors: [
      "Prototype coverage gap",
      "No live data wired up for this ticker",
    ],
  };
}

const sectorCommentary: Record<string, string> = {
  semiconductors:
    "Synthetic commentary. Semiconductor watchers continue to track accelerator demand against signs of digestion in hyperscaler orders. Qualitative tone is mixed: leadership names sit on durable AI-driven backlogs, while broader semis remain sensitive to inventory cycles in autos and industrials.",
  banks:
    "Synthetic commentary. Bank discussion centers on the shape of the curve and the pace at which deposit costs reprice. Net interest income trajectories diverge by deposit franchise quality, and credit normalization in cards and CRE remains the watched variable.",
  energy:
    "Synthetic commentary. Energy commentary leans qualitative around capital discipline versus volume growth. Integrated names continue to emphasize shareholder returns over reinvestment, with the swing variables being commodity prices and policy posture in the medium term.",
  payments:
    "Synthetic commentary. Payments discussion is bifurcated: networks continue to compound on cross-border volume, while issuer-processors and acquirers face tougher take-rate optics. Stablecoin rails and agentic-commerce primitives are emerging as long-tail watch items.",
};

function buildSectorCommentary(sector: string): string {
  const key = sector.toLowerCase();
  if (sectorCommentary[key]) {
    return sectorCommentary[key];
  }
  return `Synthetic commentary. "${sector}" is outside this prototype's curated sectors. Try one of: ${Object.keys(sectorCommentary).join(", ")}.`;
}

interface BacktestResult {
  ticker: string;
  strategy: string;
  syntheticAnnualizedReturn: string;
  syntheticSharpe: string;
  syntheticMaxDrawdown: string;
  caveat: string;
}

function buildBacktest(ticker: string, strategy: string): BacktestResult {
  const seed =
    [...ticker.toUpperCase()].reduce((acc, c) => acc + c.charCodeAt(0), 0) +
    [...strategy.toLowerCase()].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const annualized = (((seed % 25) - 5) / 100).toFixed(3);
  const sharpe = (((seed % 17) - 4) / 10).toFixed(2);
  const drawdown = (-((seed % 35) + 5) / 100).toFixed(3);
  return {
    ticker: ticker.toUpperCase(),
    strategy,
    syntheticAnnualizedReturn: annualized,
    syntheticSharpe: sharpe,
    syntheticMaxDrawdown: drawdown,
    caveat:
      "Synthetic numbers, deterministically generated from inputs. Not a real backtest. Real backtests must control for survivorship bias, transaction costs, slippage, and lookahead leakage.",
  };
}

let handler: ReturnType<typeof createPaidMcpHandler> | null = null;

async function getHandler() {
  if (!handler) {
    const sellerAccount = await getOrCreateSellerAccount();
    handler = createPaidMcpHandler(
      (server) => {
        server.paidTool(
          "get_equity_research",
          "Return a short qualitative research note for a supported ticker. Synthetic prototype data, not investment advice.",
          { price: 0.005 },
          {
            ticker: z
              .string()
              .min(1)
              .max(8)
              .describe("Equity ticker, e.g. NVDA, AAPL, MSFT"),
          },
          {},
          async (args) => {
            const note = buildResearchNote(args.ticker);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ ...note, disclaimer: DISCLAIMER }),
                },
              ],
            };
          }
        );

        server.paidTool(
          "get_market_commentary",
          "Return a one-paragraph qualitative read on a sector. Synthetic prototype data, not investment advice.",
          { price: 0.003 },
          {
            sector: z
              .string()
              .min(1)
              .describe(
                "Sector name, e.g. semiconductors, banks, energy, payments"
              ),
          },
          {},
          async (args) => {
            const text = buildSectorCommentary(args.sector);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    sector: args.sector,
                    commentary: text,
                    disclaimer: DISCLAIMER,
                  }),
                },
              ],
            };
          }
        );

        server.paidTool(
          "run_mini_backtest",
          "Run a deterministic synthetic backtest for a ticker and named strategy. Not a real backtest.",
          { price: 0.01 },
          {
            ticker: z.string().min(1).max(8).describe("Equity ticker"),
            strategy: z
              .string()
              .min(1)
              .describe(
                "Strategy name, e.g. moving-average-crossover, mean-reversion"
              ),
          },
          {},
          async (args) => {
            const result = buildBacktest(args.ticker, args.strategy);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ ...result, disclaimer: DISCLAIMER }),
                },
              ],
            };
          }
        );

        server.tool(
          "ping_agent",
          "Unpaid health check. Returns the seller agent's network and version. No payment required.",
          {},
          async () => {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    network: env.NETWORK,
                    version: "0.1.0",
                    status: "ok",
                  }),
                },
              ],
            };
          }
        );
      },
      {
        serverInfo: {
          name: "agentic-research-x402",
          version: "0.1.0",
        },
      },
      {
        recipient: sellerAccount.address,
        facilitator,
        network: env.NETWORK,
      }
    );
  }
  return handler;
}

export async function GET(req: Request) {
  const handler = await getHandler();
  return handler(req);
}

export async function POST(req: Request) {
  const handler = await getHandler();
  return handler(req);
}
