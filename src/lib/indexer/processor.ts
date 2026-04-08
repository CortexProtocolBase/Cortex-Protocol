import { createPublicClient, http, parseAbiItem, formatUnits } from "viem";
import { base } from "viem/chains";
import { supabaseAdmin } from "../supabase";

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org"),
});

// Vault uses USDC (6 decimals) for assets and 6 decimals for shares
const ASSET_DECIMALS = 6;
const SHARE_DECIMALS = 6;

export async function processDepositEvents(
  vaultAddress: string,
  fromBlock: bigint,
  toBlock: bigint
): Promise<number> {
  try {
    const logs = await client.getLogs({
      address: vaultAddress as `0x${string}`,
      event: parseAbiItem(
        "event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)"
      ),
      fromBlock,
      toBlock,
    });

    for (const log of logs) {
      const block = await client.getBlock({ blockNumber: log.blockNumber });
      const wallet = log.args.owner as string;
      const amount = Number(formatUnits(log.args.assets!, ASSET_DECIMALS));
      const shares = Number(formatUnits(log.args.shares!, SHARE_DECIMALS));
      const timestamp = new Date(Number(block.timestamp) * 1000).toISOString();

      // Insert deposit record
      await supabaseAdmin.from("deposits").upsert(
        {
          tx_hash: log.transactionHash,
          wallet_address: wallet,
          amount,
          shares_received: shares,
          timestamp,
          asset: "USDC",
        },
        { onConflict: "tx_hash" }
      );

      // Upsert user_positions — create or update
      const { data: existing } = await supabaseAdmin
        .from("user_positions")
        .select("shares, deposited_value")
        .eq("wallet_address", wallet)
        .single();

      if (existing) {
        // Update existing position
        await supabaseAdmin
          .from("user_positions")
          .update({
            shares: existing.shares + shares,
            deposited_value: existing.deposited_value + amount,
            last_updated: timestamp,
          })
          .eq("wallet_address", wallet);
      } else {
        // Create new position
        await supabaseAdmin.from("user_positions").insert({
          wallet_address: wallet,
          shares,
          deposited_value: amount,
          last_updated: timestamp,
        });
      }

      console.log(
        `[Indexer] Deposit: ${wallet} +${amount} USDC, +${shares} shares`
      );
    }

    return logs.length;
  } catch (e) {
    console.error("[Indexer] deposit events error:", e);
    return 0;
  }
}

export async function processWithdrawEvents(
  vaultAddress: string,
  fromBlock: bigint,
  toBlock: bigint
): Promise<number> {
  try {
    const logs = await client.getLogs({
      address: vaultAddress as `0x${string}`,
      event: parseAbiItem(
        "event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)"
      ),
      fromBlock,
      toBlock,
    });

    for (const log of logs) {
      const block = await client.getBlock({ blockNumber: log.blockNumber });
      const wallet = log.args.owner as string;
      const assets = Number(formatUnits(log.args.assets!, ASSET_DECIMALS));
      const shares = Number(formatUnits(log.args.shares!, SHARE_DECIMALS));
      const timestamp = new Date(Number(block.timestamp) * 1000).toISOString();

      // Insert withdrawal record
      await supabaseAdmin.from("withdrawals").upsert(
        {
          tx_hash: log.transactionHash,
          wallet_address: wallet,
          assets_received: assets,
          shares_burned: shares,
          timestamp,
        },
        { onConflict: "tx_hash" }
      );

      // Update user_positions — reduce shares
      const { data: existing } = await supabaseAdmin
        .from("user_positions")
        .select("shares, deposited_value")
        .eq("wallet_address", wallet)
        .single();

      if (existing) {
        const newShares = Math.max(0, existing.shares - shares);
        const newDeposited = Math.max(0, existing.deposited_value - assets);
        await supabaseAdmin
          .from("user_positions")
          .update({
            shares: newShares,
            deposited_value: newDeposited,
            last_updated: timestamp,
          })
          .eq("wallet_address", wallet);
      }

      console.log(
        `[Indexer] Withdraw: ${wallet} -${assets} USDC, -${shares} shares`
      );
    }

    return logs.length;
  } catch (e) {
    console.error("[Indexer] withdraw events error:", e);
    return 0;
  }
}
