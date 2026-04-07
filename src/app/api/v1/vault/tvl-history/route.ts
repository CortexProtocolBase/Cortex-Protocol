import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const { data } = await supabaseAdmin.from("vault_snapshots").select("total_assets, timestamp").order("timestamp", { ascending: true }).limit(365);
  return NextResponse.json({ data: (data || []).map(s => ({ tvl: Number(s.total_assets), date: s.timestamp })) });
}
