import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all active proposals
    const { data: activeProposals, error } = await supabaseAdmin
      .from("governance_proposals")
      .select("*")
      .eq("status", "active");

    if (error) throw error;
    if (!activeProposals || activeProposals.length === 0) {
      return NextResponse.json({
        ok: true,
        job: "governance",
        message: "No active proposals",
        timestamp: new Date().toISOString(),
      });
    }

    const now = new Date();
    let updated = 0;

    for (const proposal of activeProposals) {
      const votingEnds = new Date(proposal.voting_ends_at);

      // Check if voting period has ended
      if (now >= votingEnds) {
        const totalVotes = (proposal.votes_for ?? 0) + (proposal.votes_against ?? 0);
        const forPct = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;

        // Determine outcome: passed if >50% for and quorum met
        // Quorum: 4% of 1B supply = 40M votes needed
        const quorumMet = totalVotes >= 40_000_000;
        const newStatus = quorumMet && forPct > 50 ? "passed" : "rejected";

        const { error: updateError } = await supabaseAdmin
          .from("governance_proposals")
          .update({ status: newStatus })
          .eq("id", proposal.id);

        if (updateError) {
          console.error(`[cron/governance] Failed to update ${proposal.id}:`, updateError);
        } else {
          updated++;
          console.log(`[cron/governance] ${proposal.id}: ${newStatus} (${forPct.toFixed(1)}% for, quorum: ${quorumMet})`);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      job: "governance",
      activeChecked: activeProposals.length,
      updated,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/governance] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
