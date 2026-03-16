import { NextResponse } from "next/server";
import { mockGovernance } from "@/lib/mock-data";
import type { ApiResponse, GovernanceResponse } from "@/lib/types";

export async function GET() {
  const response: ApiResponse<GovernanceResponse> = {
    data: mockGovernance,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
