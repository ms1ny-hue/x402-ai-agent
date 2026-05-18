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
    const window = BigInt(5000);
    const fromBlock = latest > window ? latest - window : BigInt(0);

    const logs = await client.getLogs({
      address: USDC_ADDRESS,
      event: transferEvent,
      args: { to: sellerAddress },
      fromBlock,
      toBlock: latest,
    });

    const recent = logs.slice(-20).reverse();

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
