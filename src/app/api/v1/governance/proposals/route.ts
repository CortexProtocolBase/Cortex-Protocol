import { NextResponse } from "next/server";
import { mockProposals } from "@/lib/mock-data";

// GET /api/v1/governance/proposals?status=all
// Returns: active and past proposals with vote tallies, status, execution state
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status") || "all";

  // TODO: Replace with Prisma query + on-chain Governor reads (other developer)
  let proposals = [...mockProposals];

  if (statusFilter !== "all") {
    proposals = proposals.filter((p) => p.status === statusFilter);
  }

  return NextResponse.json({ proposals });
}
