import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { supabaseAdmin } from "../supabase";
import { processDepositEvents, processWithdrawEvents } from "./processor";
import { CONTRACTS } from "../constants";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
const BATCH_SIZE = 2000n;
export async function syncEvents(): Promise<{ deposits: number; withdrawals: number; lastBlock: number }> {
  const currentBlock = await client.getBlockNumber();
  // Get last synced block from DB
  const { data: state } = await supabaseAdmin.from("indexer_state").select("last_block").eq("contract", CONTRACTS.CVAULT).single();
  const fromBlock = state ? BigInt(state.last_block) + 1n : currentBlock - 50000n;
  let deposits = 0, withdrawals = 0;
  for (let block = fromBlock; block <= currentBlock; block += BATCH_SIZE) {
    const toBlock = block + BATCH_SIZE - 1n > currentBlock ? currentBlock : block + BATCH_SIZE - 1n;
    deposits += await processDepositEvents(CONTRACTS.CVAULT, block, toBlock);
    withdrawals += await processWithdrawEvents(CONTRACTS.CVAULT, block, toBlock);
  }
  await supabaseAdmin.from("indexer_state").upsert({ contract: CONTRACTS.CVAULT, last_block: Number(currentBlock), updated_at: new Date().toISOString() }, { onConflict: "contract" });
  return { deposits, withdrawals, lastBlock: Number(currentBlock) };
}
