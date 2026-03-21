import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { FEES, FEE_DISTRIBUTION } from "@/lib/constants";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the two most recent snapshots to calculate fee delta
    const { data: snapshots } = await supabaseAdmin
      .from("vault_snapshots")
      .select("total_assets, share_price, timestamp")
      .order("timestamp", { ascending: false })
      .limit(2);

    if (!snapshots || snapshots.length < 2) {
      return NextResponse.json({
        ok: true,
        job: "fees",
        message: "Not enough snapshots to calculate fees",
        timestamp: new Date().toISOString(),
      });
    }

    const [current, previous] = snapshots;
    const tvl = current.total_assets;
    const timeDeltaHours =
      (new Date(current.timestamp).getTime() - new Date(previous.timestamp).getTime()) /
      (1000 * 60 * 60);

    // Management fee: 2% annualized, prorated
    const managementFee = (tvl * FEES.MANAGEMENT * timeDeltaHours) / (365 * 24);

    // Performance fee: 20% of profit above previous share price
    let performanceFee = 0;
    if (current.share_price > previous.share_price) {
      const profit = (current.share_price - previous.share_price) * tvl / current.share_price;
      performanceFee = profit * FEES.PERFORMANCE;
    }

    const totalFee = managementFee + performanceFee;
    const toStakers = totalFee * (FEE_DISTRIBUTION.STAKERS_PCT / 100);
    const toTreasury = totalFee * (FEE_DISTRIBUTION.TREASURY_PCT / 100);

    // Log the fee calculation (in production, call Treasury.distributeFees())
    console.log(
      `[cron/fees] Management: $${managementFee.toFixed(2)}, Performance: $${performanceFee.toFixed(2)}, Stakers: $${toStakers.toFixed(2)}, Treasury: $${toTreasury.toFixed(2)}`
    );

    return NextResponse.json({
      ok: true,
      job: "fees",
      managementFee: parseFloat(managementFee.toFixed(2)),
      performanceFee: parseFloat(performanceFee.toFixed(2)),
      toStakers: parseFloat(toStakers.toFixed(2)),
      toTreasury: parseFloat(toTreasury.toFixed(2)),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/fees] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
