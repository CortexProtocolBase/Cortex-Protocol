import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch prices from CoinGecko
    const ids = "ethereum,usd-coin,aerodrome-finance,degen-base,bitcoin";
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`CoinGecko API returned ${res.status}`);

    const data = await res.json();

    const prices = {
      ETH: data["ethereum"]?.usd ?? 0,
      USDC: data["usd-coin"]?.usd ?? 1,
      AERO: data["aerodrome-finance"]?.usd ?? 0,
      DEGEN: data["degen-base"]?.usd ?? 0,
      cbBTC: data["bitcoin"]?.usd ?? 0,
    };

    const changes = {
      ETH: data["ethereum"]?.usd_24h_change ?? 0,
      AERO: data["aerodrome-finance"]?.usd_24h_change ?? 0,
      DEGEN: data["degen-base"]?.usd_24h_change ?? 0,
      cbBTC: data["bitcoin"]?.usd_24h_change ?? 0,
    };

    // Cache in Redis if available
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
      await redis.set("prices:latest", JSON.stringify(prices), { ex: 120 });
      await redis.set("prices:changes", JSON.stringify(changes), { ex: 120 });
    }

    return NextResponse.json({
      ok: true,
      job: "prices",
      prices,
      changes,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/prices] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
