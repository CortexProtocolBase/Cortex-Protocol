import { NextResponse } from "next/server";
import { mockVaultStats } from "@/lib/mock-data";
import type { ApiResponse, VaultStatsResponse } from "@/lib/types";

export async function GET() {
  const response: ApiResponse<VaultStatsResponse> = {
    data: mockVaultStats,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
