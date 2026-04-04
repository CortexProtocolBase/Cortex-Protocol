export interface SwapParams { tokenIn: string; tokenOut: string; amountIn: bigint; minAmountOut: bigint; recipient: string; deadline: number; slippageBps: number; }
export interface SwapResult { amountOut: bigint; gasUsed: bigint; txHash: string; effectivePrice: number; }
export interface LiquidityParams { tokenA: string; tokenB: string; amountA: bigint; amountB: bigint; minAmountA: bigint; minAmountB: bigint; recipient: string; deadline: number; }
export interface LiquidityResult { liquidity: bigint; amountA: bigint; amountB: bigint; txHash: string; }
export interface PoolInfo { address: string; tokenA: string; tokenB: string; fee: number; liquidity: bigint; sqrtPriceX96: bigint; tick: number; }
export interface QuoteResult { amountOut: bigint; priceImpact: number; route: string[]; gasEstimate: bigint; }
export type DEXProtocol = "uniswap-v3" | "aerodrome" | "aave" | "compound";
export interface DEXAdapter { protocol: DEXProtocol; swap(params: SwapParams): Promise<SwapResult>; quote(tokenIn: string, tokenOut: string, amountIn: bigint): Promise<QuoteResult>; getPool(tokenA: string, tokenB: string): Promise<PoolInfo | null>; }
export interface LendingParams { asset: string; amount: bigint; onBehalfOf: string; }
export interface LendingResult { txHash: string; shares: bigint; effectiveRate: number; }
export interface LendingAdapter { protocol: DEXProtocol; supply(params: LendingParams): Promise<LendingResult>; withdraw(params: LendingParams): Promise<LendingResult>; getAPY(asset: string): Promise<number>; getBalance(asset: string, account: string): Promise<bigint>; }
