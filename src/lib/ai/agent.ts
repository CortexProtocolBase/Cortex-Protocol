import { collectMarketData } from "./collector";
import { analyzeMarket } from "./analyzer";
import { validateDecision } from "./guardrails";
import { executeTrades } from "./executor";
import { supabaseAdmin } from "@/lib/supabase";
import type { CycleResult } from "./types";

// ─── Get next cycle ID from database ────────────────────────────────

async function getNextCycleId(): Promise<number> {
  const { data } = await supabaseAdmin
    .from("ai_reasoning_logs")
    .select("cycle_id")
    .order("cycle_id", { ascending: false })
    .limit(1)
    .single();

  return (data?.cycle_id ?? 0) + 1;
}

// ─── Main agent cycle ───────────────────────────────────────────────

export async function runAgentCycle(): Promise<CycleResult> {
  const cycleId = await getNextCycleId();
  console.log(`[agent] Starting cycle ${cycleId}`);

  // 1. Collect market data
  const snapshot = await collectMarketData();
  console.log(`[agent] Collected data: TVL=$${snapshot.vaultTvl}, prices=${JSON.stringify(snapshot.prices)}`);

  // 2. Analyze with Claude
  const decision = await analyzeMarket(snapshot);
  console.log(`[agent] Decision: ${decision.decision} (confidence: ${decision.confidence})`);

  // 3. Validate against guardrails
  const guardrailResult = validateDecision(decision, snapshot);

  let tradesExecuted = decision.tradesExecuted;
  let gasUsed = 0;

  if (guardrailResult.passed && guardrailResult.filteredTrades.length > 0) {
    // 4. Execute approved trades
    const result = await executeTrades(guardrailResult.filteredTrades);
    tradesExecuted = result.executed;
    gasUsed = result.gasUsed;
    console.log(`[agent] Executed ${tradesExecuted.length} trades`);
  } else if (!guardrailResult.passed) {
    console.log(`[agent] Guardrails blocked: ${guardrailResult.reason}`);
  } else {
    console.log(`[agent] No trades to execute (${decision.decision})`);
  }

  // 5. Log to Supabase
  const { error } = await supabaseAdmin.from("ai_reasoning_logs").insert({
    timestamp: new Date().toISOString(),
    cycle_id: cycleId,
    market_summary: decision.marketSummary,
    sentiment_data: decision.sentimentData,
    risk_assessment: decision.riskAssessment,
    decision: decision.decision,
    confidence: decision.confidence,
    trades_proposed: guardrailResult.filteredTrades,
    trades_executed: tradesExecuted,
  });

  if (error) {
    console.error("[agent] Failed to log cycle:", error);
  }

  return {
    cycleId,
    decision: { ...decision, tradesExecuted },
    gasUsed,
  };
}
