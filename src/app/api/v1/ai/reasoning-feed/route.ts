import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getWalletFromHeaders } from "@/lib/token-gate";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import type { ApiResponse, ReasoningFeedEntry, AiDecision } from "@/lib/types";

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const DECISION_MAP: Record<string, AiDecision> = {
  hold: "HOLD",
  trade: "TRADE",
  rebalance: "REBALANCE",
};

export async function GET(request: Request) {
  const wallet = getWalletFromHeaders(request.headers);
  if (!wallet) {
    return NextResponse.json(
      { error: "Missing or invalid x-wallet-address header" },
      { status: 403 }
    );
  }

  const { success } = rateLimit(`ai-feed:${wallet}`, 30);
  if (!success) return rateLimitResponse();

  try {
    const { data: logs, error } = await supabase
      .from("ai_reasoning_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(10);

    if (error || !logs) throw error;

    const feed: ReasoningFeedEntry[] = logs.map((log, i) => ({
      cycle: 1042 - i,
      decision: DECISION_MAP[log.decision] ?? (log.decision.toUpperCase() as AiDecision),
      reasoning: log.market_summary,
      time: timeAgo(log.timestamp),
      confidence: log.confidence,
    }));

    const response: ApiResponse<ReasoningFeedEntry[]> = {
      data: feed,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[ai/reasoning-feed] Supabase query failed:", err);
    const response: ApiResponse<ReasoningFeedEntry[]> = {
      data: [],
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }
}
