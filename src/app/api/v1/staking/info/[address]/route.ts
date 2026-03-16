import { NextResponse } from "next/server";
import { mockStakingInfo } from "@/lib/mock-data";
import type { ApiResponse, StakingInfoResponse } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  const response: ApiResponse<StakingInfoResponse> = {
    data: mockStakingInfo,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
