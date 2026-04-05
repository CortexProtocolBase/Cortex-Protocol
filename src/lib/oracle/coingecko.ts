import type { PriceData } from "./types";
const CG = "https://api.coingecko.com/api/v3";
const ID_MAP: Record<string, string> = { ETH: "ethereum", BTC: "bitcoin", USDC: "usd-coin", AERO: "aerodrome-finance", DEGEN: "degen-base", cbBTC: "coinbase-wrapped-btc" };
export async function getCoinGeckoPrice(asset: string): Promise<PriceData | null> {
  const id = ID_MAP[asset.toUpperCase()]; if (!id) return null;
  try { const h: Record<string,string> = {}; if (process.env.COINGECKO_API_KEY) h["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
    const res = await fetch(`${CG}/simple/price?ids=${id}&vs_currencies=usd&include_last_updated_at=true`, { headers: h, next: { revalidate: 60 } });
    if (!res.ok) return null; const data = await res.json(); const info = data[id]; if (!info?.usd) return null;
    return { price: info.usd, decimals: 8, timestamp: info.last_updated_at || Math.floor(Date.now()/1000), source: "coingecko", confidence: 0.9 };
  } catch (e) { console.error("[CoinGecko]", asset, e); return null; }
}
export async function getCoinGeckoPrices(assets: string[]): Promise<Record<string, PriceData>> {
  const ids = assets.map(a => ID_MAP[a.toUpperCase()]).filter(Boolean);
  if (!ids.length) return {};
  try { const h: Record<string,string> = {}; if (process.env.COINGECKO_API_KEY) h["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
    const res = await fetch(`${CG}/simple/price?ids=${ids.join(",")}&vs_currencies=usd&include_last_updated_at=true`, { headers: h, next: { revalidate: 60 } });
    if (!res.ok) return {}; const data = await res.json(); const results: Record<string, PriceData> = {};
    for (const asset of assets) { const id = ID_MAP[asset.toUpperCase()]; if (id && data[id]) results[asset] = { price: data[id].usd, decimals: 8, timestamp: data[id].last_updated_at || Math.floor(Date.now()/1000), source: "coingecko", confidence: 0.9 }; }
    return results;
  } catch (e) { console.error("[CoinGecko] batch error:", e); return {}; }
}
