import type { Address, PublicClient } from "viem";
import { vaultAbi } from "./abis/vault.js";
import { tokenAbi } from "./abis/token.js";
import { stakingAbi } from "./abis/staking.js";
import { CONTRACTS } from "./addresses.js";
import type { UserVaultPosition, VaultStats } from "./types.js";

const ONE_E18 = 10n ** 18n;

export interface CortexClient {
  vault: {
    /** Total underlying assets held by the vault (USDC, 6 decimals). */
    totalAssets: () => Promise<bigint>;
    /** Total supply of cVLT shares (18 decimals). */
    totalSupply: () => Promise<bigint>;
    /**
     * Share price scaled to 1e18. 1.0 = `10n ** 18n`.
     * Returns 1e18 when the vault has zero supply.
     */
    sharePrice: () => Promise<bigint>;
    /** Atomic snapshot of totalAssets, totalSupply, and sharePrice. */
    stats: () => Promise<VaultStats>;
    /** cVLT shares held by an account. */
    balanceOf: (account: Address) => Promise<bigint>;
    /** Convert a share amount to its underlying asset amount via the vault's own conversion. */
    convertToAssets: (shares: bigint) => Promise<bigint>;
    /** Convert an asset amount to the share amount the vault would mint for it. */
    convertToShares: (assets: bigint) => Promise<bigint>;
    /** A user's vault position: shares + asset value computed via convertToAssets. */
    positionOf: (account: Address) => Promise<UserVaultPosition>;
    /** Address of the underlying asset (USDC on Base). */
    asset: () => Promise<Address>;
    /** Whether the vault is currently paused. */
    paused: () => Promise<boolean>;
  };
  token: {
    /** Total $CORTEX supply (18 decimals). */
    totalSupply: () => Promise<bigint>;
    /** $CORTEX balance of an account. */
    balanceOf: (account: Address) => Promise<bigint>;
    /** ERC-20 decimals (18). */
    decimals: () => Promise<number>;
    /** ERC-20 symbol. */
    symbol: () => Promise<string>;
  };
  staking: {
    /** Sum of all effective stake (raw staked amount × lock multiplier) across positions. */
    totalEffectiveStake: () => Promise<bigint>;
    /** Pending unclaimed rewards for a staker. */
    pendingRewards: (account: Address) => Promise<bigint>;
  };
  /** Underlying viem client, in case the consumer needs lower-level access. */
  publicClient: PublicClient;
}

/**
 * Create a Cortex Protocol read client backed by a viem PublicClient.
 *
 * ```ts
 * import { createPublicClient, http } from "viem";
 * import { base } from "viem/chains";
 * import { createCortexClient } from "@cortex-protocol/sdk";
 *
 * const cortex = createCortexClient(
 *   createPublicClient({ chain: base, transport: http() })
 * );
 *
 * const sharePrice = await cortex.vault.sharePrice();
 * ```
 */
export function createCortexClient(publicClient: PublicClient): CortexClient {
  const vaultTotalAssets = () =>
    publicClient.readContract({
      address: CONTRACTS.CVAULT,
      abi: vaultAbi,
      functionName: "totalAssets",
    }) as Promise<bigint>;

  const vaultTotalSupply = () =>
    publicClient.readContract({
      address: CONTRACTS.CVAULT,
      abi: vaultAbi,
      functionName: "totalSupply",
    }) as Promise<bigint>;

  const vaultConvertToAssets = (shares: bigint) =>
    publicClient.readContract({
      address: CONTRACTS.CVAULT,
      abi: vaultAbi,
      functionName: "convertToAssets",
      args: [shares],
    }) as Promise<bigint>;

  const vaultBalanceOf = (account: Address) =>
    publicClient.readContract({
      address: CONTRACTS.CVAULT,
      abi: vaultAbi,
      functionName: "balanceOf",
      args: [account],
    }) as Promise<bigint>;

  return {
    vault: {
      totalAssets: vaultTotalAssets,
      totalSupply: vaultTotalSupply,
      convertToAssets: vaultConvertToAssets,
      balanceOf: vaultBalanceOf,
      sharePrice: async () => {
        const [assets, supply] = await Promise.all([
          vaultTotalAssets(),
          vaultTotalSupply(),
        ]);
        if (supply === 0n) return ONE_E18;
        return (assets * ONE_E18) / supply;
      },
      stats: async () => {
        const [totalAssets, totalSupply] = await Promise.all([
          vaultTotalAssets(),
          vaultTotalSupply(),
        ]);
        const sharePrice =
          totalSupply === 0n ? ONE_E18 : (totalAssets * ONE_E18) / totalSupply;
        return { totalAssets, totalSupply, sharePrice };
      },
      convertToShares: (assets: bigint) =>
        publicClient.readContract({
          address: CONTRACTS.CVAULT,
          abi: vaultAbi,
          functionName: "convertToShares",
          args: [assets],
        }) as Promise<bigint>,
      positionOf: async (account: Address) => {
        const shares = await vaultBalanceOf(account);
        const assetValue = shares === 0n ? 0n : await vaultConvertToAssets(shares);
        return { shares, assetValue };
      },
      asset: () =>
        publicClient.readContract({
          address: CONTRACTS.CVAULT,
          abi: vaultAbi,
          functionName: "asset",
        }) as Promise<Address>,
      paused: () =>
        publicClient.readContract({
          address: CONTRACTS.CVAULT,
          abi: vaultAbi,
          functionName: "paused",
        }) as Promise<boolean>,
    },
    token: {
      totalSupply: () =>
        publicClient.readContract({
          address: CONTRACTS.CORTEX_TOKEN,
          abi: tokenAbi,
          functionName: "totalSupply",
        }) as Promise<bigint>,
      balanceOf: (account: Address) =>
        publicClient.readContract({
          address: CONTRACTS.CORTEX_TOKEN,
          abi: tokenAbi,
          functionName: "balanceOf",
          args: [account],
        }) as Promise<bigint>,
      decimals: () =>
        publicClient.readContract({
          address: CONTRACTS.CORTEX_TOKEN,
          abi: tokenAbi,
          functionName: "decimals",
        }) as Promise<number>,
      symbol: () =>
        publicClient.readContract({
          address: CONTRACTS.CORTEX_TOKEN,
          abi: tokenAbi,
          functionName: "symbol",
        }) as Promise<string>,
    },
    staking: {
      totalEffectiveStake: () =>
        publicClient.readContract({
          address: CONTRACTS.STAKING,
          abi: stakingAbi,
          functionName: "totalEffectiveStake",
        }) as Promise<bigint>,
      pendingRewards: (account: Address) =>
        publicClient.readContract({
          address: CONTRACTS.STAKING,
          abi: stakingAbi,
          functionName: "pendingRewards",
          args: [account],
        }) as Promise<bigint>,
    },
    publicClient,
  };
}
