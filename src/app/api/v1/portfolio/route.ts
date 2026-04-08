import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ApiResponse, PortfolioResponse } from "@/lib/types";

export async function GET() {
  try {
    const { data: snapshot, error } = await supabase
      .from("vault_snapshots")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error || !snapshot) throw error;

    const tvl = snapshot.total_assets;
    const corePct = Number(snapshot.core_alloc);
    const midPct = Number(snapshot.mid_alloc);
    const degenPct = Number(snapshot.degen_alloc);

    const data: PortfolioResponse = {
      allocations: [],
      tiers: [
        { name: "Core", allocationPct: corePct, valueUsd: Math.round(tvl * corePct / 100) },
        { name: "Mid-Risk", allocationPct: midPct, valueUsd: Math.round(tvl * midPct / 100) },
        { name: "Degen", allocationPct: degenPct, valueUsd: Math.round(tvl * degenPct / 100) },
      ],
      riskMetrics: { sharpeRatio: 0, maxDrawdown: 0, volatility: 0, winRate: 0 },
      lastRebalance: snapshot.timestamp,
      nextRebalance: new Date(new Date(snapshot.timestamp).getTime() + 10 * 60000).toISOString(),
      confidence: 0,
    };

    const response: ApiResponse<PortfolioResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[portfolio] Supabase query failed:", err);
    const data: PortfolioResponse = {
      allocations: [],
      tiers: [
        { name: "Core", allocationPct: 70, valueUsd: 0 },
        { name: "Mid-Risk", allocationPct: 20, valueUsd: 0 },
        { name: "Degen", allocationPct: 10, valueUsd: 0 },
      ],
      riskMetrics: { sharpeRatio: 0, maxDrawdown: 0, volatility: 0, winRate: 0 },
      lastRebalance: "",
      nextRebalance: "",
      confidence: 0,
    };
    const response: ApiResponse<PortfolioResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }
}
