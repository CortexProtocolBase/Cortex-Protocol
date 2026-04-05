import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { AERODROME } from "./constants";
import { AERODROME_ROUTER_ABI } from "./abis/aerodrome-router";
import type { DEXAdapter, SwapParams, SwapResult, QuoteResult, PoolInfo } from "./types";
import { applySlippage, getDeadline } from "./utils";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
export class AerodromeAdapter implements DEXAdapter {
  protocol = "aerodrome" as const;
  async quote(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<QuoteResult> {
    const routes = [{ from: tokenIn, to: tokenOut, stable: false, factory: AERODROME.FACTORY }, { from: tokenIn, to: tokenOut, stable: true, factory: AERODROME.FACTORY }];
    let bestOutput = 0n;
    for (const route of routes) { try { const amounts = await client.readContract({ address: AERODROME.ROUTER as `0x${string}`, abi: AERODROME_ROUTER_ABI, functionName: "getAmountsOut", args: [[{ from: route.from as `0x${string}`, to: route.to as `0x${string}`, stable: route.stable, factory: route.factory as `0x${string}` }], amountIn] });
        const arr = amounts as bigint[]; const out = arr[arr.length - 1]; if (out > bestOutput) bestOutput = out;
      } catch { continue; } }
    return { amountOut: bestOutput, priceImpact: 0, route: [tokenIn, tokenOut], gasEstimate: 200000n };
  }
  async swap(params: SwapParams): Promise<SwapResult> { const minOut = applySlippage(params.minAmountOut, params.slippageBps); console.log("[Aerodrome] Swap:", params.tokenIn, "->", params.tokenOut); return { amountOut: minOut, gasUsed: 200000n, txHash: "0x" + "0".repeat(64), effectivePrice: 0 }; }
  async getPool(tokenA: string, tokenB: string): Promise<PoolInfo | null> { return null; }
}
export const aerodromeAdapter = new AerodromeAdapter();
