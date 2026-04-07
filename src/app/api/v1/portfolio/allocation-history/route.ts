import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const { data } = await supabaseAdmin.from("vault_snapshots").select("core_alloc, mid_alloc, degen_alloc, timestamp").order("timestamp", { ascending: true }).limit(90);
  return NextResponse.json({ data: (data || []).map(s => ({ core: Number(s.core_alloc), mid: Number(s.mid_alloc), degen: Number(s.degen_alloc), date: s.timestamp })) });
}
