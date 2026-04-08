import { z } from "zod";

// ─── Server-side environment variables ──────────────────────────────

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required").optional(),
  BASE_RPC_URL: z.string().url("BASE_RPC_URL must be a valid URL").optional(),
  AI_AGENT_PRIVATE_KEY: z.string().startsWith("0x", "AI_AGENT_PRIVATE_KEY must start with 0x").optional(),
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required").optional(),
  UPSTASH_REDIS_REST_URL: z.string().url("UPSTASH_REDIS_REST_URL must be a valid URL").optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

// ─── Validate on import (server only) ───────────────────────────────

let _validatedEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getServerEnv() {
  if (_validatedEnv) return _validatedEnv;

  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.warn("[env] Missing or invalid environment variables:", errors);
    // Return process.env as-is in development, fail hard in production
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Invalid environment variables:\n${JSON.stringify(errors, null, 2)}`
      );
    }
    return process.env as unknown as z.infer<typeof serverEnvSchema>;
  }

  _validatedEnv = result.data;
  return _validatedEnv;
}
