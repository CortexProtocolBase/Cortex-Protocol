import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Get cached value or compute + cache it.
 * Returns `{ data, cached }` so API routes can include cache status.
 */
export async function getCached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<{ data: T; cached: boolean }> {
  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return { data: cached, cached: true };
    }
  } catch {
    // Redis unavailable — fall through to fetcher
  }

  const data = await fetcher();

  try {
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
  } catch {
    // Redis unavailable — return data without caching
  }

  return { data, cached: false };
}

export { redis };
