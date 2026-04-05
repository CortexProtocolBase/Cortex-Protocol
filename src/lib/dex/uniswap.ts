import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { UNISWAP_V3, FEE_TIERS } from "./constants";
import { UNISWAP_QUOTER_ABI } from "./abis/uniswap-quoter";
import { UNISWAP_FACTORY_ABI } from "./abis/uniswap-factory";
import { UNISWAP_POOL_ABI } from "./abis/uniswap-pool";
import type { DEXAdapter, SwapParams, SwapResult, QuoteResult, PoolInfo } from "./types";
import { applySlippage, getDeadline, calculatePriceImpact } from "./utils";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
export class UniswapV3Adapter implements DEXAdapter {
  protocol = "uniswap-v3" as const;
  async quote(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<QuoteResult> {
    const fee = await this.findBestFee(tokenIn, tokenOut, amountIn);
    const result = await client.readContract({ address: UNISWAP_V3.QUOTER as `0x${string}`, abi: UNISWAP_QUOTER_ABI, functionName: "quoteExactInputSingle", args: [{ tokenIn: tokenIn as `0x${string}`, tokenOut: tokenOut as `0x${string}`, amountIn, fee, sqrtPriceLimitX96: 0n }] });
    const [amountOut, , , gasEstimate] = result as [bigint, bigint, number, bigint];
    return { amountOut, priceImpact: calculatePriceImpact(amountIn, amountOut), route: [tokenIn, tokenOut], gasEstimate };
  }
  async swap(params: SwapParams): Promise<SwapResult> {
    const minOut = applySlippage(params.minAmountOut, params.slippageBps);
    console.log("[UniswapV3] Swap:", { tokenIn: params.tokenIn, tokenOut: params.tokenOut, amountIn: params.amountIn.toString(), minOut: minOut.toString() });
    return { amountOut: minOut, gasUsed: 150000n, txHash: "0x" + "0".repeat(64), effectivePrice: 0 };
  }
  async getPool(tokenA: string, tokenB: string): Promise<PoolInfo | null> {
    for (const fee of [FEE_TIERS.LOW, FEE_TIERS.MEDIUM, FEE_TIERS.HIGH]) {
      try { const pool = await client.readContract({ address: UNISWAP_V3.FACTORY as `0x${string}`, abi: UNISWAP_FACTORY_ABI, functionName: "getPool", args: [tokenA as `0x${string}`, tokenB as `0x${string}`, fee] });
        if (pool && pool !== "0x0000000000000000000000000000000000000000") { const [slot0, liq] = await Promise.all([client.readContract({ address: pool as `0x${string}`, abi: UNISWAP_POOL_ABI, functionName: "slot0" }), client.readContract({ address: pool as `0x${string}`, abi: UNISWAP_POOL_ABI, functionName: "liquidity" })]);
          const [sqrtPriceX96, tick] = slot0 as [bigint, number, ...unknown[]]; return { address: pool as string, tokenA, tokenB, fee, liquidity: liq as bigint, sqrtPriceX96, tick }; }
      } catch { continue; }
    } return null;
  }
  private async findBestFee(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<number> {
    let bestFee = FEE_TIERS.MEDIUM; let bestOutput = 0n;
    for (const fee of [FEE_TIERS.LOWEST, FEE_TIERS.LOW, FEE_TIERS.MEDIUM, FEE_TIERS.HIGH]) {
      try { const result = await client.readContract({ address: UNISWAP_V3.QUOTER as `0x${string}`, abi: UNISWAP_QUOTER_ABI, functionName: "quoteExactInputSingle", args: [{ tokenIn: tokenIn as `0x${string}`, tokenOut: tokenOut as `0x${string}`, amountIn, fee, sqrtPriceLimitX96: 0n }] });
        const [out] = result as [bigint, ...unknown[]]; if (out > bestOutput) { bestOutput = out; bestFee = fee; }
      } catch { continue; }
    } return bestFee;
  }
}
export const uniswapAdapter = new UniswapV3Adapter();
