import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ApiResponse, PerformanceResponse } from "@/lib/types";

export async function GET() {
  try {
    const { data: snapshots, error } = await supabase
      .from("vault_snapshots")
      .select("timestamp, total_assets, share_price")
      .order("timestamp", { ascending: true });

    if (error || !snapshots || snapshots.length === 0) throw error;

    // Build monthly performance from snapshots
    const monthlyMap = new Map<string, { date: string; value: number }>();
    for (const s of snapshots) {
      const d = new Date(s.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, {
        date: `${key}-01`,
        value: Number(s.total_assets),
      });
    }
    const monthly = Array.from(monthlyMap.values());

    // Build weekly (last 52 weeks)
    const weeklyMap = new Map<string, { date: string; value: number }>();
    for (const s of snapshots) {
      const d = new Date(s.timestamp);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split("T")[0];
      weeklyMap.set(key, { date: key, value: Number(s.total_assets) });
    }
    const weekly = Array.from(weeklyMap.values()).slice(-52);

    // Daily (last 30 entries)
    const daily = snapshots.slice(-30).map((s) => ({
      date: new Date(s.timestamp).toISOString().split("T")[0],
      value: Number(s.total_assets),
    }));

    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];
    const totalReturn = Number(last.total_assets) - Number(first.total_assets);
    const totalReturnPct =
      Number(first.total_assets) > 0
        ? (totalReturn / Number(first.total_assets)) * 100
        : 0;

    const data: PerformanceResponse = {
      daily,
      weekly,
      monthly,
      benchmarks: [],
      totalReturn,
      totalReturnPct,
    };

    const response: ApiResponse<PerformanceResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[performance] Supabase query failed:", err);
    const data: PerformanceResponse = {
      daily: [],
      weekly: [],
      monthly: [],
      benchmarks: [],
      totalReturn: 0,
      totalReturnPct: 0,
    };
    const response: ApiResponse<PerformanceResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }
}
