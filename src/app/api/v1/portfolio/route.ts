import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockPortfolio } from "@/lib/mock-data";
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
      allocations: mockPortfolio.allocations,
      tiers: [
        { name: "Core", allocationPct: corePct, valueUsd: Math.round(tvl * corePct / 100) },
        { name: "Mid-Risk", allocationPct: midPct, valueUsd: Math.round(tvl * midPct / 100) },
        { name: "Degen", allocationPct: degenPct, valueUsd: Math.round(tvl * degenPct / 100) },
      ],
      riskMetrics: mockPortfolio.riskMetrics,
      lastRebalance: snapshot.timestamp,
      nextRebalance: new Date(new Date(snapshot.timestamp).getTime() + 10 * 60000).toISOString(),
      confidence: 87,
    };

    const response: ApiResponse<PortfolioResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<PortfolioResponse> = {
      data: mockPortfolio,
      timestamp: new Date().toISOString(),
      cached: true,
    };
    return NextResponse.json(response);
  }
}
