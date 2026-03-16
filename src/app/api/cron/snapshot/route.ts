import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Replace with Supabase insert
  // - Read on-chain vault TVL via viem
  // - Calculate share price, APY, depositor count
  // - Insert into vault_snapshots table

  return NextResponse.json({ ok: true, job: "snapshot", timestamp: new Date().toISOString() });
}
