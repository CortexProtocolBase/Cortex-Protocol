// Cortex Protocol — Base Mainnet contract addresses

export const BASE_CHAIN_ID = 8453 as const;
export const BASE_RPC_URL = "https://mainnet.base.org" as const;

export const CONTRACTS = {
  CORTEX_TOKEN: "0x7A67AFf42d26bDb1A1569C6DE758A4f28e15e4FD",
  CVAULT: "0x3A0799D13c737b341c41004BF9861eBdba28Dcf1",
  STAKING: "0x494D4ba8BBe8E9041207A206Cd635af343c9007E",
  GOVERNANCE: "0x11cd3AfcBd99c22B47435DA29E93C26844b8d1Dc",
  TREASURY: "0xd637A73E056Da2f8761474621B4889c96257d3f3",
} as const satisfies Record<string, `0x${string}`>;

export type CortexContractName = keyof typeof CONTRACTS;
