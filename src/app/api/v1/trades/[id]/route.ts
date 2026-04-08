import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { tradeIdSchema } from "@/lib/validation";
import type { ApiResponse, TradeResponse, TradeType, Tier } from "@/lib/types";

const ACTION_LABELS: Record<string, TradeType> = {
  swap: "Swap", add_lp: "Add LP", remove_lp: "Remove LP", stake: "Stake", unstake: "Unstake",
};
const TIER_LABELS: Record<string, Tier> = {
  core: "Core", mid: "Mid-Risk", degen: "Degen",
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data: t, error } = await supabase
      .from("trades")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !t) throw error;

    const trade: TradeResponse = {
      id: t.id,
      time: timeAgo(t.timestamp),
      type: ACTION_LABELS[t.action_type] ?? (t.action_type as TradeType),
      assetPair: `${t.asset_in} → ${t.asset_out}`,
      amountUsd: Number(t.amount_in),
      protocol: t.protocol,
      tier: TIER_LABELS[t.tier] ?? (t.tier as Tier),
      pnlUsd: Number(t.pnl ?? 0),
      pnlPositive: Number(t.pnl ?? 0) >= 0,
      reasoning: t.reasoning,
      txHash: t.tx_hash,
    };

    const response: ApiResponse<TradeResponse> = {
      data: trade,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[trades/[id]] Supabase query failed:", err);
    return NextResponse.json({ error: "Trade not found" }, { status: 404 });
  }
}
