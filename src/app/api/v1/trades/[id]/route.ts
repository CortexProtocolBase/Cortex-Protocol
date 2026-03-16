import { NextResponse } from "next/server";
import { mockTrades } from "@/lib/mock-data";

// GET /api/v1/trades/:id
// Returns: single trade detail with full AI reasoning, market context, outcome
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: Replace with Prisma query (other developer)
  const trade = mockTrades.find((t) => t.id === id);

  if (!trade) {
    return NextResponse.json({ error: "Trade not found" }, { status: 404 });
  }

  return NextResponse.json(trade);
}
