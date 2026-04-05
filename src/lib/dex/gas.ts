import { createPublicClient, http, formatGwei } from "viem";
import { base } from "viem/chains";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
export interface GasEstimate { baseFee: bigint; maxPriorityFee: bigint; maxFeePerGas: bigint; estimatedCostWei: bigint; estimatedCostUsd: number; }
export async function getGasPrice(): Promise<{ baseFee: bigint; maxPriorityFee: bigint }> {
  try { const block = await client.getBlock({ blockTag: "latest" }); return { baseFee: block.baseFeePerGas || 0n, maxPriorityFee: 1500000n }; } catch { return { baseFee: 100000000n, maxPriorityFee: 1500000n }; }
}
export async function estimateSwapGas(ethPrice: number): Promise<GasEstimate> {
  const { baseFee, maxPriorityFee } = await getGasPrice(); const maxFeePerGas = baseFee * 2n + maxPriorityFee; const gasLimit = 250000n;
  const costWei = maxFeePerGas * gasLimit; return { baseFee, maxPriorityFee, maxFeePerGas, estimatedCostWei: costWei, estimatedCostUsd: Number(costWei) / 1e18 * ethPrice };
}
export function isTradeWorthGas(profit: number, gasCost: number, minRatio = 3): boolean { return profit > gasCost * minRatio; }
