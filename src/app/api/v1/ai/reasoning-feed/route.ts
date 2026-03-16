import { NextResponse } from "next/server";
import { mockReasoningFeed } from "@/lib/mock-data";

// GET /api/v1/ai/reasoning-feed?page=1&limit=10
// Returns: paginated AI reasoning log entries with timestamps and outcomes
// NOTE: This endpoint is token-gated in production
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));

  // TODO: Add token-gating middleware (other developer)
  // TODO: Replace with Prisma query (other developer)
  const total = mockReasoningFeed.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = mockReasoningFeed.slice(start, start + limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages,
  });
}
