import { NextResponse } from "next/server";
import { mockUserPosition } from "@/lib/mock-data";

// GET /api/v1/vault/user/:address
// Returns: userShares, depositedValue, currentValue, pnl, pnlPercent, depositHistory
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  // TODO: Replace with Prisma query for real user position (other developer)
  return NextResponse.json(mockUserPosition(address));
}
