import { NextResponse } from "next/server";
import { mockPerformance } from "@/lib/mock-data";

// GET /api/v1/performance
// Returns: historical share price series, daily/weekly/monthly returns, drawdown, Sharpe ratio
export async function GET() {
  // TODO: Replace with analytics-aggregator output from DB (other developer)
  return NextResponse.json(mockPerformance);
}
