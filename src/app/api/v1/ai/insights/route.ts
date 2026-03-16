import { NextResponse } from "next/server";
import { mockAiInsights } from "@/lib/mock-data";
import { getWalletFromHeaders } from "@/lib/token-gate";
import type { ApiResponse, AiInsightsResponse } from "@/lib/types";

export async function GET(request: Request) {
  const wallet = getWalletFromHeaders(request.headers);
  if (!wallet) {
    return NextResponse.json(
      { error: "Missing or invalid x-wallet-address header" },
      { status: 403 }
    );
  }

  // TODO: uncomment when contracts are deployed
  // const hasAccess = await hasTokenAccess(wallet);
  // if (!hasAccess) {
  //   return NextResponse.json({ error: "Insufficient CORTEX balance" }, { status: 403 });
  // }

  const response: ApiResponse<AiInsightsResponse> = {
    data: mockAiInsights,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
