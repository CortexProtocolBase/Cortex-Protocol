import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import type { ApiResponse, GovernanceResponse, ProposalStatus } from "@/lib/types";

function timeRemaining(endDate: string): string | null {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
  const hours = Math.floor(diff / 3600000);
  return `${hours}h left`;
}

export async function GET() {
  try {
    const { data: proposals, error } = await supabase
      .from("governance_proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !proposals) throw error;

    const mapped = proposals.map((p) => {
      const total = Number(p.votes_for) + Number(p.votes_against);
      return {
        id: p.id,
        title: p.title,
        status: (p.status.charAt(0).toUpperCase() + p.status.slice(1)) as ProposalStatus,
        proposer: p.proposer,
        forPct: total > 0 ? Math.round((Number(p.votes_for) / total) * 100) : 0,
        againstPct: total > 0 ? Math.round((Number(p.votes_against) / total) * 100) : 0,
        quorumPct: total > 0 ? Math.round((total / 10000000) * 100) : 0,
        timeRemaining: timeRemaining(p.voting_ends_at),
      };
    });

    const stats = {
      totalProposals: proposals.length,
      passed: proposals.filter((p) => p.status === "passed").length,
      rejected: proposals.filter((p) => p.status === "rejected").length,
      active: proposals.filter((p) => p.status === "active").length,
      totalVotesCast: proposals.reduce((a, p) => a + Number(p.votes_for) + Number(p.votes_against), 0),
    };

    const data: GovernanceResponse = {
      tokenPrice: 0,
      marketCap: 0,
      totalSupply: 1_000_000_000,
      proposals: mapped,
      parameters: [
        { name: "Core Allocation", value: "70%", range: "50-90%" },
        { name: "Mid-Risk Allocation", value: "20%", range: "5-35%" },
        { name: "Degen Allocation", value: "10%", range: "0-15%" },
        { name: "Max Slippage", value: "1.5%", range: "0.5-5%" },
        { name: "Management Fee", value: "2%", range: "0-5%" },
        { name: "Performance Fee", value: "20%", range: "0-30%" },
        { name: "Withdrawal Fee", value: "0.5%", range: "0-2%" },
        { name: "AI Trade Rate", value: "20/hour", range: "1-50" },
        { name: "Quorum", value: "4%", range: "1-10%" },
        { name: "Voting Period", value: "3 days", range: "1-14 days" },
        { name: "Timelock", value: "24h", range: "6-72h" },
      ],
      stats,
      feesCollected: 0,
    };

    const response: ApiResponse<GovernanceResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[governance/proposals] Supabase query failed:", err);
    const data: GovernanceResponse = {
      tokenPrice: 0,
      marketCap: 0,
      totalSupply: 1_000_000_000,
      proposals: [],
      parameters: [
        { name: "Core Allocation", value: "70%", range: "50-90%" },
        { name: "Mid-Risk Allocation", value: "20%", range: "5-35%" },
        { name: "Degen Allocation", value: "10%", range: "0-15%" },
        { name: "Max Slippage", value: "1.5%", range: "0.5-5%" },
        { name: "Management Fee", value: "2%", range: "0-5%" },
        { name: "Performance Fee", value: "20%", range: "0-30%" },
        { name: "Withdrawal Fee", value: "0.5%", range: "0-2%" },
        { name: "AI Trade Rate", value: "20/hour", range: "1-50" },
        { name: "Quorum", value: "4%", range: "1-10%" },
        { name: "Voting Period", value: "3 days", range: "1-14 days" },
        { name: "Timelock", value: "24h", range: "6-72h" },
      ],
      stats: { totalProposals: 0, passed: 0, rejected: 0, active: 0, totalVotesCast: 0 },
      feesCollected: 0,
    };
    const response: ApiResponse<GovernanceResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }
}
