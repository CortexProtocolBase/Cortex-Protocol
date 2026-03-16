import { NextResponse } from "next/server";
import { mockStakingInfo } from "@/lib/mock-data";

// GET /api/v1/staking/info/:address
// Returns: stakedAmount, lockDuration, multiplier, pendingRewards, claimHistory
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  // TODO: Replace with on-chain FeeDistributor reads + Prisma claim history (other developer)
  return NextResponse.json(mockStakingInfo(address));
}
