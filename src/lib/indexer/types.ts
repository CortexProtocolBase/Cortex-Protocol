export interface IndexedEvent { blockNumber: number; transactionHash: string; logIndex: number; timestamp: number; eventName: string; args: Record<string, unknown>; contractAddress: string; }
export interface DepositEvent extends IndexedEvent { eventName: "Deposit"; args: { sender: string; owner: string; assets: bigint; shares: bigint }; }
export interface WithdrawEvent extends IndexedEvent { eventName: "Withdraw"; args: { sender: string; receiver: string; owner: string; assets: bigint; shares: bigint }; }
export interface TradeExecutedEvent extends IndexedEvent { eventName: "TradeExecuted"; args: { tokenIn: string; tokenOut: string; amountIn: bigint; amountOut: bigint; protocol: string }; }
export interface IndexerState { contractAddress: string; lastBlock: number; eventsProcessed: number; }
export interface IndexerConfig { contracts: { address: string; events: string[]; startBlock: number }[]; batchSize: number; pollInterval: number; confirmations: number; }
