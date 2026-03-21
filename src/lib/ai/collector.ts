import { createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";
import { CONTRACTS } from "@/lib/constants";
import { vaultAbi } from "@/lib/abis/vault";
import type { MarketSnapshot } from "./types";

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org"),
});

// ─── Fetch token prices from CoinGecko ─────────────────────────────

async function fetchPrices(): Promise<Record<string, number>> {
  const ids = "ethereum,usd-coin,aerodrome-finance,degen-base,bitcoin";
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();
    return {
      ETH: data["ethereum"]?.usd ?? 0,
      USDC: data["usd-coin"]?.usd ?? 1,
      AERO: data["aerodrome-finance"]?.usd ?? 0,
      DEGEN: data["degen-base"]?.usd ?? 0,
      cbBTC: data["bitcoin"]?.usd ?? 0,
    };
  } catch (err) {
    console.error("[collector] Price fetch failed:", err);
    return { ETH: 3400, USDC: 1, AERO: 1.2, DEGEN: 0.01, cbBTC: 65000 };
  }
}

// ─── Fetch on-chain vault state ─────────────────────────────────────

async function fetchVaultState(): Promise<{
  tvl: number;
  sharePrice: number;
  totalShares: bigint;
}> {
  try {
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

    const tvl = parseFloat(formatUnits(totalAssets, 6)); // USDC 6 decimals
    const totalSharesNum = parseFloat(formatUnits(totalSupply, 18));
    const sharePrice = totalSharesNum > 0 ? tvl / totalSharesNum : 1;

    return { tvl, sharePrice, totalShares: totalSupply };
  } catch (err) {
    console.error("[collector] Vault read failed:", err);
    return { tvl: 0, sharePrice: 1, totalShares: BigInt(0) };
  }
}

// ─── Compute basic sentiment scores ────────────────────────────────
// In production, integrate Farcaster/Twitter APIs. For now, derive from price momentum.

function computeSentiment(prices: Record<string, number>): Record<string, number> {
  // Simplified: normalize prices to a -1 to 1 sentiment range
  // In production, use actual social sentiment APIs
  const ethSentiment = Math.min(1, Math.max(-1, (prices.ETH - 3000) / 1000));
  const aeroSentiment = Math.min(1, Math.max(-1, (prices.AERO - 1) / 2));
  const degenSentiment = Math.min(1, Math.max(-1, (prices.DEGEN - 0.005) / 0.02));
  const btcSentiment = Math.min(1, Math.max(-1, (prices.cbBTC - 60000) / 20000));

  return {
    ETH: parseFloat(ethSentiment.toFixed(2)),
    USDC: 0.1,
    AERO: parseFloat(aeroSentiment.toFixed(2)),
    DEGEN: parseFloat(degenSentiment.toFixed(2)),
    cbBTC: parseFloat(btcSentiment.toFixed(2)),
    Overall: parseFloat(((ethSentiment + aeroSentiment + btcSentiment) / 3).toFixed(2)),
  };
}

// ─── Main collector function ────────────────────────────────────────

export async function collectMarketData(): Promise<MarketSnapshot> {
  const [prices, vaultState] = await Promise.all([
    fetchPrices(),
    fetchVaultState(),
  ]);

  const sentiments = computeSentiment(prices);

  return {
    timestamp: new Date().toISOString(),
    vaultTvl: vaultState.tvl,
    sharePrice: vaultState.sharePrice,
    allocations: {
      core: 0.70,
      mid: 0.20,
      degen: 0.10,
    },
    prices,
    sentiments,
  };
}
