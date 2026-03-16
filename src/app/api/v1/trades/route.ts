import { NextResponse } from "next/server";
import { mockTrades } from "@/lib/mock-data";
import type { TradeActionType, TradeTier } from "@/lib/types";

// GET /api/v1/trades?page=1&limit=10&type=all&tier=all
// Returns: paginated trade log with filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
  const typeFilter = (searchParams.get("type") || "all") as TradeActionType | "all";
  const tierFilter = (searchParams.get("tier") || "all") as TradeTier | "all";

  // TODO: Replace with Prisma query with pagination (other developer)
  let filtered = [...mockTrades];

  if (typeFilter !== "all") {
    filtered = filtered.filter((t) => t.actionType === typeFilter);
  }
  if (tierFilter !== "all") {
    filtered = filtered.filter((t) => t.tier === tierFilter);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages,
  });
}
