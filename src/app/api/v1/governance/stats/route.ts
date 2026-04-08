import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const { data } = await supabaseAdmin.from("governance_proposals").select("status");
  const proposals = data || [];
  return NextResponse.json({ data: { total: proposals.length, active: proposals.filter(p => p.status === "active").length, passed: proposals.filter(p => p.status === "passed").length, rejected: proposals.filter(p => p.status === "rejected").length } });
}
