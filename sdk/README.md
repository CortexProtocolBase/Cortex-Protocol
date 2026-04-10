# @cortex-protocol/sdk

TypeScript SDK for [Cortex Protocol](https://github.com/CortexProtocolBase/Cortex-Protocol) — AI-managed vaults on Base.

Ships contract ABIs, deployed addresses, public types, and a thin [viem](https://viem.sh)-powered client for reading vault, token, staking, governance, and treasury state. Framework-agnostic — bring your own viem client.

## Install

```bash
npm install @cortex-protocol/sdk viem
```

`viem` is a peer dependency.

## Quick start

```ts
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { createCortexClient } from "@cortex-protocol/sdk";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const cortex = createCortexClient(publicClient);

// Read vault state
const totalAssets = await cortex.vault.totalAssets();
const sharePrice = await cortex.vault.sharePrice();
const myShares = await cortex.vault.balanceOf("0x...");

// Read token state
const totalSupply = await cortex.token.totalSupply();
const myBalance = await cortex.token.balanceOf("0x...");
```

## Lower-level access

Need to call something the client doesn't expose? Import the raw ABIs and addresses and compose with viem directly:

```ts
import { vaultAbi, CONTRACTS } from "@cortex-protocol/sdk";

const result = await publicClient.readContract({
  address: CONTRACTS.CVAULT,
  abi: vaultAbi,
  functionName: "yourCustomFunction",
});
```

All ABIs are exported as `as const` arrays so viem can fully infer return types.

## Exports

- `createCortexClient(publicClient)` — typed read client
- `CONTRACTS` — Base mainnet contract addresses (`CORTEX_TOKEN`, `CVAULT`, `STAKING`, `GOVERNANCE`, `TREASURY`)
- `BASE_CHAIN_ID`, `BASE_RPC_URL`
- `FEES`, `GOVERNANCE_PARAMS`, `LOCK_TIERS`, `FEE_DISTRIBUTION`
- `vaultAbi`, `tokenAbi`, `stakingAbi`, `governorAbi`, `treasuryAbi`
- Public TypeScript types: `Tier`, `RiskLevel`, `ProposalStatus`, `TradeType`, `MarketRegime`, etc.

## Contracts

All addresses are on Base mainnet (chain id `8453`).

| Contract       | Address                                      |
| -------------- | -------------------------------------------- |
| CORTEX_TOKEN   | `0x7A67AFf42d26bDb1A1569C6DE758A4f28e15e4FD` |
| CVAULT         | `0x3A0799D13c737b341c41004BF9861eBdba28Dcf1` |
| STAKING        | `0x494D4ba8BBe8E9041207A206Cd635af343c9007E` |
| GOVERNANCE     | `0x11cd3AfcBd99c22B47435DA29E93C26844b8d1Dc` |
| TREASURY       | `0xd637A73E056Da2f8761474621B4889c96257d3f3` |

## License

MIT
