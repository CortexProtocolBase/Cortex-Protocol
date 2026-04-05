import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { AAVE_V3 } from "./constants";
import { AAVE_POOL_ABI } from "./abis/aave-pool";
import type { LendingAdapter, LendingParams, LendingResult } from "./types";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
const RAY = 10n ** 27n;
export class AaveV3Adapter implements LendingAdapter {
  protocol = "aave" as const;
  async supply(params: LendingParams): Promise<LendingResult> { console.log("[AaveV3] Supply:", params.asset, params.amount.toString()); return { txHash: "0x" + "0".repeat(64), shares: params.amount, effectiveRate: await this.getAPY(params.asset) }; }
  async withdraw(params: LendingParams): Promise<LendingResult> { console.log("[AaveV3] Withdraw:", params.asset); return { txHash: "0x" + "0".repeat(64), shares: params.amount, effectiveRate: await this.getAPY(params.asset) }; }
  async getAPY(asset: string): Promise<number> { try { const data = await client.readContract({ address: AAVE_V3.POOL as `0x${string}`, abi: AAVE_POOL_ABI, functionName: "getReserveData", args: [asset as `0x${string}`] }); const d = data as { currentLiquidityRate: bigint }; return Math.round(Number(d.currentLiquidityRate) / Number(RAY) * 10000) / 100; } catch (e) { console.error("[AaveV3] APY error:", e); return 0; } }
  async getBalance(asset: string, account: string): Promise<bigint> { try { const d = await client.readContract({ address: AAVE_V3.POOL as `0x${string}`, abi: AAVE_POOL_ABI, functionName: "getUserAccountData", args: [asset as `0x${string}`, account as `0x${string}`] }); return (d as [bigint])[0]; } catch { return 0n; } }
}
export const aaveAdapter = new AaveV3Adapter();
