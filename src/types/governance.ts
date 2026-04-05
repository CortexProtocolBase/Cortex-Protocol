export type ProposalStatus = "pending" | "active" | "passed" | "rejected" | "executed" | "cancelled";
export type VoteType = "for" | "against" | "abstain";
export interface Proposal { id: string; title: string; description: string; proposer: string; status: ProposalStatus; votesFor: bigint; votesAgainst: bigint; quorum: number; startBlock: number; endBlock: number; }
export interface Vote { proposalId: string; voter: string; support: VoteType; weight: bigint; reason?: string; }
