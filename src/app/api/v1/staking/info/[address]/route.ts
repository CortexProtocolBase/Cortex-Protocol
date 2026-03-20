import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockStakingInfo } from "@/lib/mock-data";
import type { ApiResponse, StakingInfoResponse } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
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
          pendingRewards: 0.142,
          pendingRewardsUsd: 483.4,
          unlockDate: position.unlocks_at ?? "",
        }
      : null;

    const data: StakingInfoResponse = {
      totalStaked,
      totalStakedUsd: totalStaked * 0.42,
      currentApr: 12.4,
      userPosition,
      rewardHistory: mockStakingInfo.rewardHistory,
      lockTiers: mockStakingInfo.lockTiers,
    };

    const response: ApiResponse<StakingInfoResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<StakingInfoResponse> = {
      data: mockStakingInfo,
      timestamp: new Date().toISOString(),
      cached: true,
    };
    return NextResponse.json(response);
  }
}
