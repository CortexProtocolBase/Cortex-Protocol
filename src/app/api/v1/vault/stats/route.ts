import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockVaultStats } from "@/lib/mock-data";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import type { ApiResponse, VaultStatsResponse } from "@/lib/types";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`vault-stats:${ip}`, 60);
  if (!success) return rateLimitResponse();
  try {
    const { data: snapshot, error } = await supabase
      .from("vault_snapshots")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error || !snapshot) throw error;

    const totalPnl = (snapshot.share_price - 1) * snapshot.total_shares;

    const data: VaultStatsResponse = {
      tvl: snapshot.total_assets,
      sharePriceUsd: snapshot.share_price,
      apy24h: 18.7,
      apy7d: 17.2,
      apy30d: 16.8,
      depositors: snapshot.depositor_count,
      totalProfit: Math.round(totalPnl),
      fees: {
        management: 0.02,
        performance: 0.2,
        withdrawal: 0.005,
        deposit: 0,
      },
    };

    const response: ApiResponse<VaultStatsResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[vault/stats] Supabase query failed:", err);
    // Fallback to mock data if Supabase is unavailable
    const response: ApiResponse<VaultStatsResponse> = {
      data: mockVaultStats,
      timestamp: new Date().toISOString(),
      cached: true,
    };
    return NextResponse.json(response);
  }
}
