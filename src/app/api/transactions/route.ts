import { NextResponse } from "next/server";
import {
  createPublicClient,
  http,
  parseAbiItem,
  formatUnits,
  erc20Abi,
} from "viem";
import { baseSepolia } from "viem/chains";
import { getOrCreateSellerAccount } from "@/lib/accounts";

// USDC on Base Sepolia
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

interface TxRecord {
  txHash: string;
  blockNumber: string;
  from: string;
  to: string;
  amountAtomic: string;
  amountUsdc: string;
  timestamp: number | null;
}

interface AggregateStats {
  txCount: number;
  totalAtomic: string;
  totalUsdc: string;
  distinctBuyers: number;
  currentBalanceAtomic: string;
  currentBalanceUsdc: string;
  windowBlocks: number;
}

const transferEvent = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Base Sepolia public RPC rate-limits aggressively (HTTP 429). Cache the
// scan result for a short window so concurrent client polls share one
// upstream pass instead of triggering rate limits.
const CACHE_TTL_MS = 20_000;
interface CachedResponse {
  expiresAt: number;
  body: unknown;
}
let cached: CachedResponse | null = null;
let inflight: Promise<unknown> | null = null;

export async function GET() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.body);
  }
  if (inflight) {
    try {
      const body = await inflight;
      return NextResponse.json(body);
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      return NextResponse.json(
        { error: message, transactions: [] },
        { status: 500 },
      );
    }
  }

  inflight = scanTransfers();
  try {
    const body = await inflight;
    cached = { expiresAt: Date.now() + CACHE_TTL_MS, body };
    return NextResponse.json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: message, transactions: [] },
      { status: 500 },
    );
  } finally {
    inflight = null;
  }
}

async function scanTransfers() {
  const seller = await getOrCreateSellerAccount();
  const sellerAddress = seller.address;

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const latest = await client.getBlockNumber();
  const fetchWindow = async (fromBlock: bigint, toBlock: bigint) =>
    client.getLogs({
      address: USDC_ADDRESS,
      event: transferEvent,
      args: { to: sellerAddress },
      fromBlock,
      toBlock,
    });
  type Transfer = Awaited<ReturnType<typeof fetchWindow>>[number];

  // Base Sepolia public RPC caps eth_getLogs at 2000 blocks per call.
  // Walk backwards in 1900-block chunks. 15 chunks ≈ 28,500 blocks ≈
  // ~16 hours of history on Base, which keeps the feed populated even
  // when there is a quiet stretch of demo usage.
  const chunkSize = BigInt(1900);
  const maxChunks = 15;
  const collected: Transfer[] = [];
  let toBlock = latest;
  for (let i = 0; i < maxChunks && collected.length < 20; i++) {
    const fromBlock = toBlock > chunkSize ? toBlock - chunkSize : BigInt(0);
    const logs = await fetchWindow(fromBlock, toBlock);
    collected.push(...logs);
    if (fromBlock === BigInt(0)) break;
    toBlock = fromBlock - BigInt(1);
  }

  const recent = collected
    .sort((a, b) => {
      const ab = a.blockNumber ?? BigInt(0);
      const bb = b.blockNumber ?? BigInt(0);
      return Number(bb - ab);
    })
    .slice(0, 20);

  // Aggregate stats from everything we collected (not just the trimmed
  // recent[] slice). totalAtomic is a sum across all observed Transfers
  // into the seller in the scanned window, so it understates lifetime
  // volume.
  let totalAtomic = BigInt(0);
  const buyers = new Set<string>();
  for (const log of collected) {
    totalAtomic += log.args.value ?? BigInt(0);
    if (log.args.from) buyers.add(log.args.from.toLowerCase());
  }

  let currentBalanceAtomic = BigInt(0);
  try {
    currentBalanceAtomic = await client.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [sellerAddress],
    });
  } catch {
    currentBalanceAtomic = BigInt(0);
  }

  const aggregate: AggregateStats = {
    txCount: collected.length,
    totalAtomic: totalAtomic.toString(),
    totalUsdc: formatUnits(totalAtomic, 6),
    distinctBuyers: buyers.size,
    currentBalanceAtomic: currentBalanceAtomic.toString(),
    currentBalanceUsdc: formatUnits(currentBalanceAtomic, 6),
    windowBlocks: Number(chunkSize) * maxChunks,
  };

  const enriched: TxRecord[] = await Promise.all(
    recent.map(async (log) => {
      const blockNumber = log.blockNumber;
      let timestamp: number | null = null;
      if (blockNumber !== null) {
        try {
          const block = await client.getBlock({ blockNumber });
          timestamp = Number(block.timestamp);
        } catch {
          timestamp = null;
        }
      }
      const value = log.args.value ?? BigInt(0);
      return {
        txHash: log.transactionHash ?? "",
        blockNumber: blockNumber !== null ? blockNumber.toString() : "",
        from: log.args.from ?? "",
        to: log.args.to ?? "",
        amountAtomic: value.toString(),
        amountUsdc: formatUnits(value, 6),
        timestamp,
      };
    }),
  );

  return {
    sellerAddress,
    network: "eip155:84532",
    networkName: "base-sepolia",
    asset: USDC_ADDRESS,
    assetSymbol: "USDC",
    assetDecimals: 6,
    aggregate,
    transactions: enriched,
  };
}
