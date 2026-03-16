import { NextResponse } from "next/server";
import { mockTrades } from "@/lib/mock-data";
import type { ApiResponse, TradeResponse } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const trade = mockTrades.find((t) => t.id === id);

  if (!trade) {
    return NextResponse.json({ error: "Trade not found" }, { status: 404 });
  }

  const response: ApiResponse<TradeResponse> = {
    data: trade,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
