export interface PriceData { price: number; decimals: number; timestamp: number; source: PriceSource; confidence: number; }
export type PriceSource = "chainlink" | "coingecko" | "uniswap-twap" | "aerodrome";
export interface PriceFeedConfig { asset: string; chainlinkFeed?: string; coingeckoId?: string; stalePriceThreshold: number; deviationThreshold: number; }
export interface OracleResult { price: number; sources: PriceData[]; aggregatedAt: number; isStale: boolean; deviation: number; }
export interface ChainlinkRoundData { roundId: bigint; answer: bigint; startedAt: bigint; updatedAt: bigint; answeredInRound: bigint; }
