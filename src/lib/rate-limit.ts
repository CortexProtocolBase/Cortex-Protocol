import { NextResponse } from "next/server";

// Simple in-memory rate limiter (works without Redis)
// For production with multiple instances, use @upstash/ratelimit with Redis

const windowMs = 60_000; // 1 minute
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  identifier: string,
  limit: number = 60
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = requestCounts.get(identifier);

  // Clean expired entries periodically
  if (requestCounts.size > 10_000) {
    for (const [key, val] of requestCounts) {
      if (now > val.resetAt) requestCounts.delete(key);
    }
  }

  if (!entry || now > entry.resetAt) {
    requestCounts.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
