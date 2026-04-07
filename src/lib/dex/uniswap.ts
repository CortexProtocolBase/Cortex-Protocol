import { createPublicClient, http, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { UNISWAP_V3, FEE_TIERS } from "./constants";
import { UNISWAP_QUOTER_ABI } from "./abis/uniswap-quoter";
import { UNISWAP_ROUTER_ABI } from "./abis/uniswap-router";
import { UNISWAP_FACTORY_ABI } from "./abis/uniswap-factory";
import { UNISWAP_POOL_ABI } from "./abis/uniswap-pool";
import type { DEXAdapter, SwapParams, SwapResult, QuoteResult, PoolInfo } from "./types";
import { applySlippage, getDeadline, calculatePriceImpact } from "./utils";

const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });

export interface SwapCalldata {
  target: `0x${string}`;
  data: `0x${string}`;
}

export class UniswapV3Adapter implements DEXAdapter {
  protocol = "uniswap-v3" as const;

  async quote(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<QuoteResult> {
    const fee = await this.findBestFee(tokenIn, tokenOut, amountIn);
    const result = await client.readContract({
      address: UNISWAP_V3.QUOTER as `0x${string}`,
      abi: UNISWAP_QUOTER_ABI,
      functionName: "quoteExactInputSingle",
      args: [{
        tokenIn: tokenIn as `0x${string}`,
        tokenOut: tokenOut as `0x${string}`,
        amountIn,
        fee,
        sqrtPriceLimitX96: 0n,
      }],
    });
    const [amountOut, , , gasEstimate] = result as [bigint, bigint, number, bigint];
    return {
      amountOut,
      priceImpact: calculatePriceImpact(amountIn, amountOut),
      route: [tokenIn, tokenOut],
      gasEstimate,
    };
  }

  /**
   * Build the encoded calldata for a Uniswap V3 exactInputSingle swap.
   * Returns the router address as the target and the ABI-encoded function call.
   * The vault's executeStrategy will forward this call to the Uniswap router.
   */
  buildSwapCalldata(params: SwapParams, fee: number): SwapCalldata {
    const minOut = applySlippage(params.minAmountOut, params.slippageBps);
    const deadline = params.deadline > 0 ? BigInt(params.deadline) : BigInt(getDeadline());

    const data = encodeFunctionData({
      abi: UNISWAP_ROUTER_ABI,
      functionName: "exactInputSingle",
      args: [{
        tokenIn: params.tokenIn as `0x${string}`,
        tokenOut: params.tokenOut as `0x${string}`,
        fee,
        recipient: params.recipient as `0x${string}`,
        deadline,
        amountIn: params.amountIn,
        amountOutMinimum: minOut,
        sqrtPriceLimitX96: 0n,
      }],
    });

    return {
      target: UNISWAP_V3.ROUTER as `0x${string}`,
      data,
    };
  }

  /**
   * Build swap calldata with automatic best-fee detection.
   * Used by the executor to get the transaction data for vault.executeStrategy().
   */
  async buildSwapCalldataWithQuote(params: SwapParams): Promise<SwapCalldata & { fee: number; expectedOut: bigint }> {
    const fee = await this.findBestFee(params.tokenIn, params.tokenOut, params.amountIn);
    const calldata = this.buildSwapCalldata(params, fee);

    const quote = await this.quote(params.tokenIn, params.tokenOut, params.amountIn);

    return {
      ...calldata,
      fee,
      expectedOut: quote.amountOut,
    };
  }

  async swap(params: SwapParams): Promise<SwapResult> {
    // Build real calldata - the executor should use buildSwapCalldataWithQuote() directly,
    // but this method remains for interface compliance and returns the calldata info.
    const result = await this.buildSwapCalldataWithQuote(params);
    const minOut = applySlippage(params.minAmountOut, params.slippageBps);

    console.log("[UniswapV3] Built swap calldata:", {
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      amountIn: params.amountIn.toString(),
      minOut: minOut.toString(),
      fee: result.fee,
      target: result.target,
    });

    return {
      amountOut: result.expectedOut,
      gasUsed: 150000n,
      txHash: result.data, // Return encoded calldata as txHash for executor to use
      effectivePrice: 0,
    };
  }

  async getPool(tokenA: string, tokenB: string): Promise<PoolInfo | null> {
    for (const fee of [FEE_TIERS.LOW, FEE_TIERS.MEDIUM, FEE_TIERS.HIGH]) {
      try {
        const pool = await client.readContract({
          address: UNISWAP_V3.FACTORY as `0x${string}`,
          abi: UNISWAP_FACTORY_ABI,
          functionName: "getPool",
          args: [tokenA as `0x${string}`, tokenB as `0x${string}`, fee],
        });
        if (pool && pool !== "0x0000000000000000000000000000000000000000") {
          const [slot0, liq] = await Promise.all([
            client.readContract({ address: pool as `0x${string}`, abi: UNISWAP_POOL_ABI, functionName: "slot0" }),
            client.readContract({ address: pool as `0x${string}`, abi: UNISWAP_POOL_ABI, functionName: "liquidity" }),
          ]);
          const s0 = slot0 as unknown as [bigint, number, ...unknown[]];
          const [sqrtPriceX96, tick] = s0;
          return { address: pool as string, tokenA, tokenB, fee, liquidity: liq as bigint, sqrtPriceX96, tick };
        }
      } catch { continue; }
    }
    return null;
  }

  private async findBestFee(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<number> {
    let bestFee: number = FEE_TIERS.MEDIUM;
    let bestOutput = 0n;
    for (const fee of [FEE_TIERS.LOWEST, FEE_TIERS.LOW, FEE_TIERS.MEDIUM, FEE_TIERS.HIGH]) {
      try {
        const result = await client.readContract({
          address: UNISWAP_V3.QUOTER as `0x${string}`,
          abi: UNISWAP_QUOTER_ABI,
          functionName: "quoteExactInputSingle",
          args: [{
            tokenIn: tokenIn as `0x${string}`,
            tokenOut: tokenOut as `0x${string}`,
            amountIn,
            fee,
            sqrtPriceLimitX96: 0n,
          }],
        });
        const [out] = result as [bigint, ...unknown[]];
        if (out > bestOutput) { bestOutput = out; bestFee = fee as number; }
      } catch { continue; }
    }
    return bestFee;
  }
}

export const uniswapAdapter = new UniswapV3Adapter();
