import { NextResponse } from "next/server";
import { mockPortfolio } from "@/lib/mock-data";
import type { ApiResponse, PortfolioResponse } from "@/lib/types";

export async function GET() {
  const response: ApiResponse<PortfolioResponse> = {
    data: mockPortfolio,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
