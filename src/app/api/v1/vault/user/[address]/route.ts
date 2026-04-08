import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { walletAddressSchema } from "@/lib/validation";
import type { ApiResponse, UserPositionResponse } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  const validated = walletAddressSchema.safeParse(address);
  if (!validated.success) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  try {
    // Get user position (case-insensitive address match)
    const { data: position, error: posError } = await supabase
      .from("user_positions")
      .select("*")
      .ilike("wallet_address", address)
      .single();

    if (posError || !position) throw posError;

    // Get latest vault snapshot for share price
    const { data: snapshot } = await supabase
      .from("vault_snapshots")
      .select("share_price, total_shares")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    const sharePrice = snapshot?.share_price ?? 1;
    const totalShares = snapshot?.total_shares ?? 1;
    const currentValue = position.shares * sharePrice;
    const profitLoss = currentValue - position.deposited_value;
    const profitLossPct = position.deposited_value > 0
      ? (profitLoss / position.deposited_value) * 100
      : 0;
    const vaultSharePct = totalShares > 0
      ? (position.shares / totalShares) * 100
      : 0;

    // Get recent deposits and withdrawals
    const [{ data: deposits }, { data: withdrawals }] = await Promise.all([
      supabase
        .from("deposits")
        .select("*")
        .ilike("wallet_address", address)
        .order("timestamp", { ascending: false })
        .limit(5),
      supabase
        .from("withdrawals")
        .select("*")
        .ilike("wallet_address", address)
        .order("timestamp", { ascending: false })
        .limit(5),
    ]);

    const recentTransactions = [
      ...(deposits ?? []).map((d) => ({
        type: "Deposit",
        amount: Number(d.amount),
        share: Number(d.shares_received),
        date: d.timestamp,
      })),
      ...(withdrawals ?? []).map((w) => ({
        type: "Withdraw",
        amount: Number(w.assets_received),
        share: Number(w.shares_burned),
        date: w.timestamp,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const data: UserPositionResponse = {
      walletAddress: address,
      depositedAmount: Number(position.deposited_value),
      currentValue: Math.round(currentValue * 100) / 100,
      profitLoss: Math.round(profitLoss * 100) / 100,
      profitLossPct: Math.round(profitLossPct * 100) / 100,
      cvaultShares: Number(position.shares),
      vaultSharePct: Math.round(vaultSharePct * 100) / 100,
      entryDate: position.last_updated,
      recentTransactions,
    };

    const response: ApiResponse<UserPositionResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[vault/user] Supabase query failed:", err);
    const data: UserPositionResponse = {
      walletAddress: address,
      depositedAmount: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPct: 0,
      cvaultShares: 0,
      vaultSharePct: 0,
      entryDate: "",
      recentTransactions: [],
    };
    const response: ApiResponse<UserPositionResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }
}
