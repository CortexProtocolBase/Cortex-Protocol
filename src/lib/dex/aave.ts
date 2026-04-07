import { createPublicClient, http, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { AAVE_V3 } from "./constants";
import { AAVE_POOL_ABI } from "./abis/aave-pool";
import type { LendingAdapter, LendingParams, LendingResult } from "./types";

const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
const RAY = 10n ** 27n;

export interface LendingCalldata {
  target: `0x${string}`;
  data: `0x${string}`;
}

export class AaveV3Adapter implements LendingAdapter {
  protocol = "aave" as const;

  /**
   * Build encoded calldata for an Aave V3 supply call.
   * The vault's executeStrategy forwards this to the Aave Pool contract.
   */
  buildSupplyCalldata(params: LendingParams): LendingCalldata {
    const data = encodeFunctionData({
      abi: AAVE_POOL_ABI,
      functionName: "supply",
      args: [
        params.asset as `0x${string}`,
        params.amount,
        params.onBehalfOf as `0x${string}`,
        0, // referralCode
      ],
    });

    return {
      target: AAVE_V3.POOL as `0x${string}`,
      data,
    };
  }

  /**
   * Build encoded calldata for an Aave V3 withdraw call.
   * Uses type(uint256).max pattern when amount is max uint to withdraw all.
   */
  buildWithdrawCalldata(params: LendingParams): LendingCalldata {
    const data = encodeFunctionData({
      abi: AAVE_POOL_ABI,
      functionName: "withdraw",
      args: [
        params.asset as `0x${string}`,
        params.amount,
        params.onBehalfOf as `0x${string}`,
      ],
    });

    return {
      target: AAVE_V3.POOL as `0x${string}`,
      data,
    };
  }

  async supply(params: LendingParams): Promise<LendingResult> {
    const calldata = this.buildSupplyCalldata(params);
    const rate = await this.getAPY(params.asset);

    console.log("[AaveV3] Built supply calldata:", {
      asset: params.asset,
      amount: params.amount.toString(),
      target: calldata.target,
    });

    return {
      txHash: calldata.data,
      shares: params.amount,
      effectiveRate: rate,
    };
  }

  async withdraw(params: LendingParams): Promise<LendingResult> {
    const calldata = this.buildWithdrawCalldata(params);
    const rate = await this.getAPY(params.asset);

    console.log("[AaveV3] Built withdraw calldata:", {
      asset: params.asset,
      amount: params.amount.toString(),
      target: calldata.target,
    });

    return {
      txHash: calldata.data,
      shares: params.amount,
      effectiveRate: rate,
    };
  }

  async getAPY(asset: string): Promise<number> {
    try {
      const data = await client.readContract({
        address: AAVE_V3.POOL as `0x${string}`,
        abi: AAVE_POOL_ABI,
        functionName: "getReserveData",
        args: [asset as `0x${string}`],
      });
      const d = data as { currentLiquidityRate: bigint };
      return Math.round(Number(d.currentLiquidityRate) / Number(RAY) * 10000) / 100;
    } catch (e) {
      console.error("[AaveV3] APY error:", e);
      return 0;
    }
  }

  async getBalance(asset: string, account: string): Promise<bigint> {
    try {
      const d = await client.readContract({
        address: AAVE_V3.POOL as `0x${string}`,
        abi: AAVE_POOL_ABI,
        functionName: "getUserAccountData",
        args: [asset as `0x${string}`, account as `0x${string}`],
      });
      return (d as [bigint])[0];
    } catch {
      return 0n;
    }
  }
}

export const aaveAdapter = new AaveV3Adapter();
