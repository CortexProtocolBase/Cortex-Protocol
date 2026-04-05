export type TradeAction = "swap" | "add_lp" | "remove_lp" | "stake" | "unstake";
export type TradeTier = "core" | "mid" | "degen";
export type TradeStatus = "pending" | "completed" | "failed";
export interface Trade { id: string; action: TradeAction; tier: TradeTier; assetIn: string; assetOut: string; amountIn: number; amountOut: number; protocol: string; pnl: number; reasoning: string; txHash: string; timestamp: number; status: TradeStatus; }
