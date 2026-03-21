import { z } from "zod";

// ─── Common validators ──────────────────────────────────────────────

export const walletAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const tradeFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  tier: z.enum(["Core", "Mid-Risk", "Degen"]).optional(),
  type: z.enum(["Swap", "Add LP", "Remove LP", "Stake", "Unstake"]).optional(),
});

export const tradeIdSchema = z.string().uuid("Invalid trade ID");
