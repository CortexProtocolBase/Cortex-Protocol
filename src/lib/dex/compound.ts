import { createPublicClient, http, encodeFunctionData } from "viem";
import { base } from "viem/chains";
import { COMPOUND_V3 } from "./constants";
import { COMPOUND_COMET_ABI } from "./abis/compound-comet";
import type { LendingAdapter, LendingParams, LendingResult } from "./types";

const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });

export interface LendingCalldata {
  target: `0x${string}`;
  data: `0x${string}`;
}

export class CompoundV3Adapter implements LendingAdapter {
  protocol = "compound" as const;
  private comet: string;

  constructor(comet: string = COMPOUND_V3.COMET_USDC) {
    this.comet = comet;
  }

  /**
   * Build encoded calldata for a Compound V3 supply call.
   * The vault's executeStrategy forwards this to the Comet contract.
   */
  buildSupplyCalldata(params: LendingParams): LendingCalldata {
    const data = encodeFunctionData({
      abi: COMPOUND_COMET_ABI,
      functionName: "supply",
      args: [
        params.asset as `0x${string}`,
        params.amount,
      ],
    });

    return {
      target: this.comet as `0x${string}`,
      data,
    };
  }

  /**
   * Build encoded calldata for a Compound V3 withdraw call.
   */
  buildWithdrawCalldata(params: LendingParams): LendingCalldata {
    const data = encodeFunctionData({
      abi: COMPOUND_COMET_ABI,
      functionName: "withdraw",
      args: [
        params.asset as `0x${string}`,
        params.amount,
      ],
    });

    return {
      target: this.comet as `0x${string}`,
      data,
    };
  }

  async supply(params: LendingParams): Promise<LendingResult> {
    const calldata = this.buildSupplyCalldata(params);
    const rate = await this.getAPY(params.asset);

    console.log("[CompoundV3] Built supply calldata:", {
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

    console.log("[CompoundV3] Built withdraw calldata:", {
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
      const util = await client.readContract({
        address: this.comet as `0x${string}`,
        abi: COMPOUND_COMET_ABI,
        functionName: "getUtilization",
      });
      const rate = await client.readContract({
        address: this.comet as `0x${string}`,
        abi: COMPOUND_COMET_ABI,
        functionName: "getSupplyRate",
        args: [util as bigint],
      });
      return Math.round((Math.pow(1 + Number(rate) / 1e18, 31536000) - 1) * 10000) / 100;
    } catch (e) {
      console.error("[CompoundV3] APY error:", e);
      return 0;
    }
  }

  async getBalance(asset: string, account: string): Promise<bigint> {
    try {
      return (await client.readContract({
        address: this.comet as `0x${string}`,
        abi: COMPOUND_COMET_ABI,
        functionName: "balanceOf",
        args: [account as `0x${string}`],
      })) as bigint;
    } catch {
      return 0n;
    }
  }
}

export const compoundUsdcAdapter = new CompoundV3Adapter(COMPOUND_V3.COMET_USDC);
export const compoundWethAdapter = new CompoundV3Adapter(COMPOUND_V3.COMET_WETH);
