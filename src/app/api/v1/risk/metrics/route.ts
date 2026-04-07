import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { data: trades } = await supabaseAdmin.from("trades").select("pnl, timestamp").order("timestamp", { ascending: true }).limit(500);
    const { data: snapshots } = await supabaseAdmin.from("vault_snapshots").select("total_assets, timestamp").order("timestamp", { ascending: true }).limit(365);
    if (!snapshots || snapshots.length < 2) return NextResponse.json({ data: null });
    // Calculate daily returns
    const returns: number[] = [];
    for (let i = 1; i < snapshots.length; i++) {
      const prev = Number(snapshots[i - 1].total_assets);
      const curr = Number(snapshots[i].total_assets);
      if (prev > 0) returns.push((curr - prev) / prev);
    }
    const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((s, r) => s + (r - avg) ** 2, 0) / (returns.length - 1));
    const negReturns = returns.filter(r => r < 0);
    const downDev = negReturns.length > 0 ? Math.sqrt(negReturns.reduce((s, r) => s + r ** 2, 0) / negReturns.length) : 0.001;
    const annualReturn = avg * 252;
    const annualVol = stdDev * Math.sqrt(252);
    const sharpe = annualVol > 0 ? (annualReturn - 0.05) / annualVol : 0;
    const sortino = downDev > 0 ? (annualReturn - 0.05) / (downDev * Math.sqrt(252)) : 0;
    // Max drawdown
    let peak = snapshots[0].total_assets; let maxDD = 0;
    for (const s of snapshots) { if (s.total_assets > peak) peak = s.total_assets; const dd = (peak - s.total_assets) / peak; if (dd > maxDD) maxDD = dd; }
    const winRate = trades ? trades.filter(t => Number(t.pnl) > 0).length / Math.max(1, trades.length) * 100 : 0;
    const gains = trades ? trades.filter(t => Number(t.pnl) > 0).reduce((s, t) => s + Number(t.pnl), 0) : 0;
    const losses = trades ? Math.abs(trades.filter(t => Number(t.pnl) < 0).reduce((s, t) => s + Number(t.pnl), 0)) : 1;
    const sorted = [...returns].sort((a, b) => a - b);
    const varIndex = Math.floor(0.05 * sorted.length);
    return NextResponse.json({ data: { sharpeRatio: Math.round(sharpe * 100) / 100, sortinoRatio: Math.round(sortino * 100) / 100, maxDrawdown: -Math.round(maxDD * 10000) / 100, volatility: Math.round(annualVol * 10000) / 100, winRate: Math.round(winRate * 100) / 100, profitFactor: losses > 0 ? Math.round(gains / losses * 100) / 100 : 0, calmarRatio: maxDD > 0 ? Math.round(annualReturn / maxDD * 100) / 100 : 0, valueAtRisk95: Math.round(Math.abs(sorted[varIndex] || 0) * 10000) / 100, riskLevel: annualVol > 0.3 ? "high" : annualVol > 0.15 ? "moderate" : "low", riskScore: Math.min(100, Math.round(annualVol * 200)), factors: [], recommendations: [] } });
  } catch (err) { console.error("[risk/metrics]", err); return NextResponse.json({ data: null }); }
}
