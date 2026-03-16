import { NextResponse } from "next/server";
import { mockTrades, MOCK_TOTAL_TRADES } from "@/lib/mock-data";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";
import type { PaginatedResponse, TradeResponse, Tier, TradeType } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10))
  );
  const tierFilter = searchParams.get("tier") as Tier | null;
  const typeFilter = searchParams.get("type") as TradeType | null;

  let filtered = [...mockTrades];

  if (tierFilter) {
    filtered = filtered.filter((t) => t.tier === tierFilter);
  }
  if (typeFilter) {
    filtered = filtered.filter((t) => t.type === typeFilter);
  }

  const total = tierFilter || typeFilter ? filtered.length : MOCK_TOTAL_TRADES;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  const response: PaginatedResponse<TradeResponse> = {
    data: paginated,
    total,
    page,
    pageSize,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
