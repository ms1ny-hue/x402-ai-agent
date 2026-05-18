import { NextResponse } from "next/server";
import { createPublicClient, http, parseAbiItem, formatUnits } from "viem";
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

const transferEvent = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const seller = await getOrCreateSellerAccount();
    const sellerAddress = seller.address;

    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });

    const latest = await client.getBlockNumber();
    // Base Sepolia public RPC caps eth_getLogs at 2000 blocks per call.
    // Walk backwards in 1900-block chunks to surface roughly the last
    // hour of activity. Stop once we have 20 transfers or hit 5 chunks.
    const chunkSize = BigInt(1900);
    const maxChunks = 5;
    type Transfer = Awaited<ReturnType<typeof client.getLogs>>[number];
    const collected: Transfer[] = [];
    let toBlock = latest;
    for (let i = 0; i < maxChunks && collected.length < 20; i++) {
      const fromBlock =
        toBlock > chunkSize ? toBlock - chunkSize : BigInt(0);
      const logs = await client.getLogs({
        address: USDC_ADDRESS,
        event: transferEvent,
        args: { to: sellerAddress },
        fromBlock,
        toBlock,
      });
      collected.push(...logs);
      if (fromBlock === BigInt(0)) break;
      toBlock = fromBlock - BigInt(1);
    }

    const recent = collected
      .sort((a, b) => Number(b.blockNumber - a.blockNumber))
      .slice(0, 20);

    const enriched: TxRecord[] = await Promise.all(
      recent.map(async (log) => {
        let timestamp: number | null = null;
        try {
          const block = await client.getBlock({
            blockNumber: log.blockNumber,
          });
          timestamp = Number(block.timestamp);
        } catch {
          timestamp = null;
        }
        const value = (log.args.value as bigint | undefined) ?? BigInt(0);
        return {
          txHash: log.transactionHash,
          blockNumber: log.blockNumber.toString(),
          from: (log.args.from as string | undefined) ?? "",
          to: (log.args.to as string | undefined) ?? "",
          amountAtomic: value.toString(),
          amountUsdc: formatUnits(value, 6),
          timestamp,
        };
      })
    );

    return NextResponse.json({
      sellerAddress,
      network: "eip155:84532",
      networkName: "base-sepolia",
      asset: USDC_ADDRESS,
      assetSymbol: "USDC",
      assetDecimals: 6,
      transactions: enriched,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: message, transactions: [] },
      { status: 500 }
    );
  }
}
