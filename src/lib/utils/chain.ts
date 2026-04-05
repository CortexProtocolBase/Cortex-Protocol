import { base } from "viem/chains";
export const getExplorerUrl = (hash: string, type: "tx" | "address" = "tx") => `https://basescan.org/${type}/${hash}`;
export const isBaseNetwork = (chainId: number) => chainId === base.id;
export const getBlockTimestamp = (blockNumber: bigint) => blockNumber * 2n; // ~2s blocks on Base
