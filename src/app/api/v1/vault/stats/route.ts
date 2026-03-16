import { NextResponse } from "next/server";
import { mockVaultStats } from "@/lib/mock-data";

// GET /api/v1/vault/stats
// Returns: totalAUM, sharePrice, totalDepositors, 24hVolume, performanceSinceInception, currentAllocation
export async function GET() {
  // TODO: Replace with Prisma query + Redis cache (other developer)
  return NextResponse.json(mockVaultStats);
}
