import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const start = Date.now();
    await supabaseAdmin.from("vault_snapshots").select("id").limit(1);
    const supabaseLatency = Date.now() - start;
    const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
    const rpcStart = Date.now();
    await client.getBlockNumber();
    const rpcLatency = Date.now() - rpcStart;
    const { count: errorCount } = await supabaseAdmin.from("error_logs").select("*", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 86400000).toISOString());
    return NextResponse.json({ data: { status: "healthy", supabaseLatency, rpcLatency, errorCount24h: errorCount || 0, timestamp: Date.now() } });
  } catch (err) { console.error("[admin/health]", err); return NextResponse.json({ data: { status: "degraded" } }); }
}
