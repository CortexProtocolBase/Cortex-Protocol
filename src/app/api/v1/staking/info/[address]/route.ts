import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { walletAddressSchema } from "@/lib/validation";
import type { ApiResponse, StakingInfoResponse } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  const validated = walletAddressSchema.safeParse(address);
  if (!validated.success) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  try {
    // Get user's staking position
    const { data: position } = await supabase
      .from("staking_positions")
      .select("*")
      .eq("wallet_address", address)
      .single();

    // Get total staked across all users
    const { data: allPositions } = await supabase
      .from("staking_positions")
      .select("amount, multiplier");

    const totalStaked = allPositions?.reduce((a, p) => a + Number(p.amount), 0) ?? 0;

    const userPosition = position
      ? {
          stakedAmount: Number(position.amount),
          lockDurationDays: position.lock_duration,
          multiplier: Number(position.multiplier),
          effectiveStake: Number(position.amount) * Number(position.multiplier),
          pendingRewards: Number(position.pending_rewards ?? 0),
          pendingRewardsUsd: Number(position.pending_rewards_usd ?? 0),
          unlockDate: position.unlocks_at ?? "",
        }
      : null;

    const data: StakingInfoResponse = {
      totalStaked,
      totalStakedUsd: totalStaked * 0.42,
      currentApr: 0,
      userPosition,
      rewardHistory: [],
      lockTiers: [
        { label: "No Lock", days: 0, multiplier: 1 },
        { label: "1 Month", days: 30, multiplier: 1.5 },
        { label: "3 Months", days: 90, multiplier: 2 },
        { label: "6 Months", days: 180, multiplier: 2.5 },
      ],
    };

    const response: ApiResponse<StakingInfoResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[staking/info] Supabase query failed:", err);
    const data: StakingInfoResponse = {
      totalStaked: 0,
      totalStakedUsd: 0,
      currentApr: 0,
      userPosition: null,
      rewardHistory: [],
      lockTiers: [
        { label: "No Lock", days: 0, multiplier: 1 },
        { label: "1 Month", days: 30, multiplier: 1.5 },
        { label: "3 Months", days: 90, multiplier: 2 },
        { label: "6 Months", days: 180, multiplier: 2.5 },
      ],
    };
    const response: ApiResponse<StakingInfoResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }
}
