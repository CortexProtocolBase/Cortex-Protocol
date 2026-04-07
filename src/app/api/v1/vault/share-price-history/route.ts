import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const { data } = await supabaseAdmin.from("vault_snapshots").select("share_price, timestamp").order("timestamp", { ascending: true }).limit(365);
  return NextResponse.json({ data: (data || []).map(s => ({ price: Number(s.share_price), date: s.timestamp })) });
}
