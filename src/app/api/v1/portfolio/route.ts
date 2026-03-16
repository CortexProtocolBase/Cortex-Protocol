import { NextResponse } from "next/server";
import { mockPortfolio } from "@/lib/mock-data";

// GET /api/v1/portfolio
// Returns: positions[] {asset, amount, value, tier, allocation%, priceChange24h}
export async function GET() {
  // TODO: Replace with real on-chain position reads + price feeds (other developer)
  return NextResponse.json({ positions: mockPortfolio });
}
