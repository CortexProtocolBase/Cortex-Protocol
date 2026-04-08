import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const { count } = await supabaseAdmin.from("ai_reasoning_logs").select("*", { count: "exact", head: true });
  const today = new Date().toISOString().split("T")[0];
  const { count: todayCount } = await supabaseAdmin.from("ai_reasoning_logs").select("*", { count: "exact", head: true }).gte("timestamp", today);
  return NextResponse.json({ data: { total: count || 0, today: todayCount || 0 } });
}
