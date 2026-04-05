import { UniswapV3Adapter } from "./uniswap";
import { AerodromeAdapter } from "./aerodrome";
import { AaveV3Adapter } from "./aave";
import { CompoundV3Adapter } from "./compound";
import { COMPOUND_V3 } from "./constants";
import type { DEXAdapter, LendingAdapter, SwapParams, SwapResult, QuoteResult, LendingParams, LendingResult, DEXProtocol } from "./types";
export class DEXRouter {
  private swapAdapters: DEXAdapter[];
  private lendingAdapters: LendingAdapter[];
  constructor() { this.swapAdapters = [new UniswapV3Adapter(), new AerodromeAdapter()]; this.lendingAdapters = [new AaveV3Adapter(), new CompoundV3Adapter(COMPOUND_V3.COMET_USDC), new CompoundV3Adapter(COMPOUND_V3.COMET_WETH)]; }
  async getBestQuote(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<{ quote: QuoteResult; protocol: DEXProtocol } | null> {
    const quotes = await Promise.allSettled(this.swapAdapters.map(async (a) => ({ quote: await a.quote(tokenIn, tokenOut, amountIn), protocol: a.protocol })));
    let best: { quote: QuoteResult; protocol: DEXProtocol } | null = null;
    for (const r of quotes) { if (r.status === "fulfilled" && r.value.quote.amountOut > 0n) { if (!best || r.value.quote.amountOut > best.quote.amountOut) best = r.value; } }
    return best;
  }
  async executeSwap(params: SwapParams): Promise<SwapResult & { protocol: DEXProtocol }> {
    const best = await this.getBestQuote(params.tokenIn, params.tokenOut, params.amountIn);
    if (!best) throw new Error("No valid quote");
    const adapter = this.swapAdapters.find((a) => a.protocol === best.protocol)!;
    const result = await adapter.swap({ ...params, minAmountOut: best.quote.amountOut });
    return { ...result, protocol: best.protocol };
  }
  async getBestLendingRate(asset: string): Promise<{ apy: number; protocol: DEXProtocol } | null> {
    const rates = await Promise.allSettled(this.lendingAdapters.map(async (a) => ({ apy: await a.getAPY(asset), protocol: a.protocol })));
    let best: { apy: number; protocol: DEXProtocol } | null = null;
    for (const r of rates) { if (r.status === "fulfilled" && r.value.apy > 0) { if (!best || r.value.apy > best.apy) best = r.value; } }
    return best;
  }
  async supply(params: LendingParams): Promise<LendingResult & { protocol: DEXProtocol }> {
    const best = await this.getBestLendingRate(params.asset); if (!best) throw new Error("No lending rate");
    const adapter = this.lendingAdapters.find((a) => a.protocol === best.protocol)!;
    return { ...await adapter.supply(params), protocol: best.protocol };
  }
  getSwapAdapter(protocol: DEXProtocol) { return this.swapAdapters.find((a) => a.protocol === protocol); }
  getLendingAdapter(protocol: DEXProtocol) { return this.lendingAdapters.find((a) => a.protocol === protocol); }
}
export const dexRouter = new DEXRouter();
