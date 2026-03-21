import { NextResponse } from "next/server";
import { runAgentCycle } from "@/lib/ai/agent";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAgentCycle();
    return NextResponse.json({
      ok: true,
      job: "ai-cycle",
      cycleId: result.cycleId,
      decision: result.decision.decision,
      confidence: result.decision.confidence,
      tradesExecuted: result.decision.tradesExecuted.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/ai-cycle] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
