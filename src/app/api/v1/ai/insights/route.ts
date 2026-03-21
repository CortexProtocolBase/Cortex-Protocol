import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

  try {
    const { data: latest, error } = await supabase
      .from("ai_reasoning_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error || !latest) throw error;

    const sentimentData = latest.sentiment_data as Record<string, number> | null;
    const riskData = latest.risk_assessment as Record<string, number> | null;

    const sentiments = sentimentData
      ? Object.entries(sentimentData).map(([asset, score]) => ({ asset, score }))
      : mockAiInsights.sentiments;

    const overallScore = sentiments.reduce((a, s) => a + s.score, 0) / sentiments.length;
    const regime = overallScore > 0.4 ? "Bullish" : overallScore < -0.2 ? "Bearish" : overallScore > 0.1 ? "Neutral" : "Volatile";

    // Count cycles today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("ai_reasoning_logs")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", todayStart.toISOString());

    const data: AiInsightsResponse = {
      confidence: latest.confidence,
      marketRegime: regime as AiInsightsResponse["marketRegime"],
      nextRebalanceMinutes: 8,
      cyclesToday: count ?? 0,
      sentiments,
      marketSummary: latest.market_summary,
    };

    const response: ApiResponse<AiInsightsResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[ai/insights] Supabase query failed:", err);
    const response: ApiResponse<AiInsightsResponse> = {
      data: mockAiInsights,
      timestamp: new Date().toISOString(),
      cached: true,
    };
    return NextResponse.json(response);
  }
}
