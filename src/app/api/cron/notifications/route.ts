import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { dispatch } from "@/lib/notifications";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const since = new Date(Date.now() - 600000).toISOString(); // last 10 min
    // Check for large deposits
    const { data: deposits } = await supabaseAdmin.from("deposits").select("*").gte("timestamp", since);
    for (const d of deposits || []) {
      if (Number(d.amount) > 10000) {
        await dispatch("large_deposit", { amount: Number(d.amount).toLocaleString(), address: d.wallet_address.slice(0, 6) + "..." + d.wallet_address.slice(-4) });
      }
    }
    // Check for large withdrawals
    const { data: withdrawals } = await supabaseAdmin.from("withdrawals").select("*").gte("timestamp", since);
    for (const w of withdrawals || []) {
      if (Number(w.assets_received) > 10000) {
        await dispatch("large_withdrawal", { amount: Number(w.assets_received).toLocaleString(), address: w.wallet_address.slice(0, 6) + "..." + w.wallet_address.slice(-4) });
      }
    }
    return NextResponse.json({ success: true, deposits: (deposits || []).length, withdrawals: (withdrawals || []).length });
  } catch (err) { console.error("[cron/notifications]", err); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
