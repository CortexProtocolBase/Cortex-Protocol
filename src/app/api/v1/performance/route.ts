import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import type { ApiResponse, PerformanceResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Only fetch snapshots with non-zero TVL to avoid thousands of empty rows
    const { data: snapshots, error } = await supabase
      .from("vault_snapshots")
      .select("timestamp, total_assets, share_price")
      .gt("total_assets", 0)
      .order("timestamp", { ascending: true });

    if (error) throw error;

    if (!snapshots || snapshots.length === 0) {
      return NextResponse.json({
        data: {
          daily: [],
          weekly: [],
          monthly: [],
          benchmarks: [],
          totalReturn: 0,
          totalReturnPct: 0,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Daily — latest value per day
    const dailyMap = new Map<string, { date: string; value: number }>();
    for (const s of snapshots) {
      const key = new Date(s.timestamp).toISOString().split("T")[0];
      dailyMap.set(key, { date: key, value: Number(s.total_assets) });
    }
    const daily = Array.from(dailyMap.values()).slice(-90);

    // Weekly — latest value per week
    const weeklyMap = new Map<string, { date: string; value: number }>();
    for (const s of snapshots) {
      const d = new Date(s.timestamp);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split("T")[0];
      weeklyMap.set(key, { date: key, value: Number(s.total_assets) });
    }
    const weekly = Array.from(weeklyMap.values()).slice(-52);

    // Monthly — latest value per month
    const monthlyMap = new Map<string, { date: string; value: number }>();
    for (const s of snapshots) {
      const d = new Date(s.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, { date: `${key}-01`, value: Number(s.total_assets) });
    }
    const monthly = Array.from(monthlyMap.values());

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

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[performance]", err);
    return NextResponse.json({
      data: {
        daily: [],
        weekly: [],
        monthly: [],
        benchmarks: [],
        totalReturn: 0,
        totalReturnPct: 0,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
