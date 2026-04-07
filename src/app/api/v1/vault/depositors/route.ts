import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  const { count } = await supabaseAdmin.from("user_positions").select("*", { count: "exact", head: true }).gt("shares", 0);
  return NextResponse.json({ data: { count: count || 0 } });
}
