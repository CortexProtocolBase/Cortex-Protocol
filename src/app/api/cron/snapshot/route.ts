import { NextResponse } from "next/server";
import { createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";
import { supabaseAdmin } from "@/lib/supabase";
import { CONTRACTS } from "@/lib/constants";
import { vaultAbi } from "@/lib/abis/vault";

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org"),
});

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Read vault contract state
    const [totalAssets, totalSupply] = await Promise.all([
      client.readContract({
        address: CONTRACTS.CVAULT,
        abi: vaultAbi,
        functionName: "totalAssets",
      }) as Promise<bigint>,
      client.readContract({
        address: CONTRACTS.CVAULT,
        abi: vaultAbi,
        functionName: "totalSupply",
      }) as Promise<bigint>,
    ]);

    const tvl = parseFloat(formatUnits(totalAssets, 6));
    const totalShares = parseFloat(formatUnits(totalSupply, 6));
    const sharePrice = totalShares > 0 ? tvl / totalShares : 1;

    // Count unique depositors from user_positions
    const { count: depositorCount } = await supabaseAdmin
      .from("user_positions")
      .select("*", { count: "exact", head: true });

    // Get last snapshot for allocation data
    const { data: lastSnapshot } = await supabaseAdmin
      .from("vault_snapshots")
      .select("core_alloc, mid_alloc, degen_alloc")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    // Insert new snapshot
    const { error } = await supabaseAdmin.from("vault_snapshots").insert({
      timestamp: new Date().toISOString(),
      total_assets: tvl,
      share_price: sharePrice,
      total_shares: totalShares,
      depositor_count: depositorCount ?? 0,
      core_alloc: lastSnapshot?.core_alloc ?? 0.70,
      mid_alloc: lastSnapshot?.mid_alloc ?? 0.20,
      degen_alloc: lastSnapshot?.degen_alloc ?? 0.10,
      idle_cash: 0,
    });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      job: "snapshot",
      tvl,
      sharePrice,
      depositors: depositorCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/snapshot] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
