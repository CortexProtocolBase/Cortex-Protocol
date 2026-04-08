import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";
import { tradeFilterSchema } from "@/lib/validation";
import type { PaginatedResponse, TradeResponse, Tier, TradeType } from "@/lib/types";

const ACTION_LABELS: Record<string, TradeType> = {
  swap: "Swap",
  add_lp: "Add LP",
  remove_lp: "Remove LP",
  stake: "Stake",
  unstake: "Unstake",
};

const TIER_LABELS: Record<string, Tier> = {
  core: "Core",
  mid: "Mid-Risk",
  degen: "Degen",
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = tradeFilterSchema.safeParse({
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
    tier: searchParams.get("tier") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, pageSize, tier: tierFilter, type: typeFilter } = parsed.data;

  try {
    let query = supabase
      .from("trades")
      .select("*", { count: "exact" })
      .order("timestamp", { ascending: false });

    if (tierFilter) {
      // Accept both display names ("Core") and db keys ("core")
      const lowerTier = tierFilter.toLowerCase();
      const dbTier = Object.keys(TIER_LABELS).find((k) => k === lowerTier)
        ?? Object.entries(TIER_LABELS).find(([, v]) => v === tierFilter)?.[0];
      if (dbTier) query = query.eq("tier", dbTier);
    }
    if (typeFilter) {
      // Accept comma-separated values (e.g. "add_lp,remove_lp") and single values
      const types = typeFilter.split(",").map((t) => t.trim()).filter(Boolean);
      const dbTypes = types.map((t) => {
        const lower = t.toLowerCase();
        return Object.keys(ACTION_LABELS).find((k) => k === lower)
          ?? Object.entries(ACTION_LABELS).find(([, v]) => v === t)?.[0]
          ?? lower;
      });
      if (dbTypes.length === 1) {
        query = query.eq("action_type", dbTypes[0]);
      } else if (dbTypes.length > 1) {
        query = query.in("action_type", dbTypes);
      }
    }

    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    const { data: trades, error, count } = await query;
    if (error || !trades) throw error;

    const mapped: TradeResponse[] = trades.map((t) => ({
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
    }));

    const response: PaginatedResponse<TradeResponse> = {
      data: mapped,
      total: count ?? mapped.length,
      page,
      pageSize,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[trades] Supabase query failed:", err);
    const response: PaginatedResponse<TradeResponse> = {
      data: [],
      total: 0,
      page,
      pageSize,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }
}
