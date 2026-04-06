import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const since24h = new Date(Date.now() - 86400000).toISOString();
    const [deposits, withdrawals, snapshot, users, trades, aiCycles] = await Promise.all([
      supabaseAdmin.from("deposits").select("amount").gte("timestamp", since24h),
      supabaseAdmin.from("withdrawals").select("assets_received").gte("timestamp", since24h),
      supabaseAdmin.from("vault_snapshots").select("*").order("timestamp", { ascending: false }).limit(1).single(),
      supabaseAdmin.from("user_positions").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("trades").select("*", { count: "exact", head: true }).gte("timestamp", since24h),
      supabaseAdmin.from("ai_reasoning_logs").select("*", { count: "exact", head: true }).gte("timestamp", since24h),
    ]);
    const totalDeposits = (deposits.data || []).reduce((sum, d) => sum + Number(d.amount), 0);
    const totalWithdrawals = (withdrawals.data || []).reduce((sum, w) => sum + Number(w.assets_received), 0);
    return NextResponse.json({ data: { totalDeposits24h: totalDeposits, totalWithdrawals24h: totalWithdrawals, netFlow24h: totalDeposits - totalWithdrawals, totalUsers: users.count || 0, tvl: snapshot.data?.total_assets || 0, tradesExecuted24h: trades.count || 0, aiCycles24h: aiCycles.count || 0 } });
  } catch (err) { console.error("[admin/stats]", err); return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 }); }
}
