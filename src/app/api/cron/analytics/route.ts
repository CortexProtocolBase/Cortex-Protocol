import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all vault snapshots for aggregation
    const { data: snapshots, error } = await supabaseAdmin
      .from("vault_snapshots")
      .select("timestamp, total_assets, share_price")
      .order("timestamp", { ascending: true });

    if (error) throw error;
    if (!snapshots || snapshots.length < 2) {
      return NextResponse.json({
        ok: true,
        job: "analytics",
        message: "Not enough data for analytics",
        timestamp: new Date().toISOString(),
      });
    }

    // Calculate daily returns for risk metrics
    const returns: number[] = [];
    for (let i = 1; i < snapshots.length; i++) {
      const prev = snapshots[i - 1].share_price;
      const curr = snapshots[i].share_price;
      if (prev > 0) {
        returns.push((curr - prev) / prev);
      }
    }

    // Volatility (annualized)
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + (r - meanReturn) ** 2, 0) / returns.length;
    const dailyVol = Math.sqrt(variance);
    const annualizedVol = dailyVol * Math.sqrt(365);

    // Max drawdown
    let peak = snapshots[0].share_price;
    let maxDrawdown = 0;
    for (const s of snapshots) {
      if (s.share_price > peak) peak = s.share_price;
      const drawdown = (s.share_price - peak) / peak;
      if (drawdown < maxDrawdown) maxDrawdown = drawdown;
    }

    // Sharpe ratio (assuming 4% risk-free rate)
    const annualizedReturn = meanReturn * 365;
    const sharpeRatio = annualizedVol > 0 ? (annualizedReturn - 0.04) / annualizedVol : 0;

    // Win rate from trades
    const { data: trades } = await supabaseAdmin
      .from("trades")
      .select("pnl");

    const totalTrades = trades?.length ?? 0;
    const winningTrades = trades?.filter((t) => (t.pnl ?? 0) > 0).length ?? 0;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    const metrics = {
      volatility: parseFloat((annualizedVol * 100).toFixed(1)),
      maxDrawdown: parseFloat((maxDrawdown * 100).toFixed(1)),
      sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
      winRate: parseFloat(winRate.toFixed(1)),
      totalReturn: parseFloat(
        (((snapshots[snapshots.length - 1].share_price - snapshots[0].share_price) / snapshots[0].share_price) * 100).toFixed(1)
      ),
    };

    // Cache in Redis if available
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
      await redis.set("analytics:metrics", JSON.stringify(metrics), { ex: 21600 }); // 6h TTL
    }

    return NextResponse.json({
      ok: true,
      job: "analytics",
      metrics,
      snapshotsAnalyzed: snapshots.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/analytics] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
