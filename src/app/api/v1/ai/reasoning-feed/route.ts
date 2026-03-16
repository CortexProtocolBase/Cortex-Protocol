import { NextResponse } from "next/server";
import { mockReasoningFeed } from "@/lib/mock-data";
import { getWalletFromHeaders } from "@/lib/token-gate";
import type { ApiResponse, ReasoningFeedEntry } from "@/lib/types";

export async function GET(request: Request) {
  const wallet = getWalletFromHeaders(request.headers);
  if (!wallet) {
    return NextResponse.json(
      { error: "Missing or invalid x-wallet-address header" },
      { status: 403 }
    );
  }

  const response: ApiResponse<ReasoningFeedEntry[]> = {
    data: mockReasoningFeed,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
