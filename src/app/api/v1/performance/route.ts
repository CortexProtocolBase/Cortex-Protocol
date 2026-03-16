import { NextResponse } from "next/server";
import { mockPerformance } from "@/lib/mock-data";
import type { ApiResponse, PerformanceResponse } from "@/lib/types";

export async function GET() {
  const response: ApiResponse<PerformanceResponse> = {
    data: mockPerformance,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
