import { createPublicClient, http, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { AERODROME } from "./constants";
import { AERODROME_ROUTER_ABI } from "./abis/aerodrome-router";
import type { DEXAdapter, SwapParams, SwapResult, QuoteResult, PoolInfo } from "./types";
import { applySlippage, getDeadline } from "./utils";

const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });

export interface SwapCalldata {
  target: `0x${string}`;
  data: `0x${string}`;
}

export class AerodromeAdapter implements DEXAdapter {
  protocol = "aerodrome" as const;

  async quote(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<QuoteResult> {
    const routes = [
      { from: tokenIn, to: tokenOut, stable: false, factory: AERODROME.FACTORY },
      { from: tokenIn, to: tokenOut, stable: true, factory: AERODROME.FACTORY },
    ];
    let bestOutput = 0n;
    let bestStable = false;
    for (const route of routes) {
      try {
        const amounts = await client.readContract({
          address: AERODROME.ROUTER as `0x${string}`,
          abi: AERODROME_ROUTER_ABI,
          functionName: "getAmountsOut",
          args: [[{
            from: route.from as `0x${string}`,
            to: route.to as `0x${string}`,
            stable: route.stable,
            factory: route.factory as `0x${string}`,
          }], amountIn],
        });
        const arr = amounts as bigint[];
        const out = arr[arr.length - 1];
        if (out > bestOutput) {
          bestOutput = out;
          bestStable = route.stable;
        }
      } catch { continue; }
    }
    return { amountOut: bestOutput, priceImpact: 0, route: [tokenIn, tokenOut], gasEstimate: 200000n };
  }

  /**
   * Determine whether the stable or volatile pool gives better output.
   */
  private async findBestRoute(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<{ stable: boolean; amountOut: bigint }> {
    let bestOutput = 0n;
    let bestStable = false;
    for (const stable of [false, true]) {
      try {
        const amounts = await client.readContract({
          address: AERODROME.ROUTER as `0x${string}`,
          abi: AERODROME_ROUTER_ABI,
          functionName: "getAmountsOut",
          args: [[{
            from: tokenIn as `0x${string}`,
            to: tokenOut as `0x${string}`,
            stable,
            factory: AERODROME.FACTORY as `0x${string}`,
          }], amountIn],
        });
        const arr = amounts as bigint[];
        const out = arr[arr.length - 1];
        if (out > bestOutput) {
          bestOutput = out;
          bestStable = stable;
        }
      } catch { continue; }
    }
    return { stable: bestStable, amountOut: bestOutput };
  }

  /**
   * Build the encoded calldata for an Aerodrome swapExactTokensForTokens call.
   * Returns the router address as target and ABI-encoded calldata.
   */
  async buildSwapCalldata(params: SwapParams): Promise<SwapCalldata & { expectedOut: bigint }> {
    const { stable, amountOut } = await this.findBestRoute(params.tokenIn, params.tokenOut, params.amountIn);
    const minOut = applySlippage(params.minAmountOut, params.slippageBps);
    const deadline = params.deadline > 0 ? BigInt(params.deadline) : BigInt(getDeadline());

    const data = encodeFunctionData({
      abi: AERODROME_ROUTER_ABI,
      functionName: "swapExactTokensForTokens",
      args: [
        params.amountIn,
        minOut,
        [{
          from: params.tokenIn as `0x${string}`,
          to: params.tokenOut as `0x${string}`,
          stable,
          factory: AERODROME.FACTORY as `0x${string}`,
        }],
        params.recipient as `0x${string}`,
        deadline,
      ],
    });

    return {
      target: AERODROME.ROUTER as `0x${string}`,
      data,
      expectedOut: amountOut,
    };
  }

  async swap(params: SwapParams): Promise<SwapResult> {
    const result = await this.buildSwapCalldata(params);
    const minOut = applySlippage(params.minAmountOut, params.slippageBps);

    console.log("[Aerodrome] Built swap calldata:", {
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      amountIn: params.amountIn.toString(),
      minOut: minOut.toString(),
      target: result.target,
    });

    return {
      amountOut: result.expectedOut,
      gasUsed: 200000n,
      txHash: result.data,
      effectivePrice: 0,
    };
  }

  async getPool(tokenA: string, tokenB: string): Promise<PoolInfo | null> {
    return null;
  }
}

export const aerodromeAdapter = new AerodromeAdapter();
