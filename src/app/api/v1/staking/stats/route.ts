import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const { data } = await supabaseAdmin.from("staking_positions").select("amount, multiplier");
  const positions = data || [];
  const totalStaked = positions.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalEffective = positions.reduce((sum, p) => sum + Number(p.amount) * Number(p.multiplier), 0);
  return NextResponse.json({ data: { totalStaked, totalEffective, stakers: positions.length } });
}
