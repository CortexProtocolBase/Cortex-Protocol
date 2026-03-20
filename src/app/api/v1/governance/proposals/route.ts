import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mockGovernance } from "@/lib/mock-data";
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
      tokenPrice: mockGovernance.tokenPrice,
      marketCap: mockGovernance.marketCap,
      totalSupply: 1_000_000_000,
      proposals: mapped,
      parameters: mockGovernance.parameters,
      stats,
    };

    const response: ApiResponse<GovernanceResponse> = {
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<GovernanceResponse> = {
      data: mockGovernance,
      timestamp: new Date().toISOString(),
      cached: true,
    };
    return NextResponse.json(response);
  }
}
