import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Replace with live price fetching
  // - Fetch ETH, AERO, DEGEN, cbBTC prices from DEX or oracle
  // - Update price cache in Redis
  // - Update token_prices table in Supabase

  return NextResponse.json({ ok: true, job: "prices", timestamp: new Date().toISOString() });
}
