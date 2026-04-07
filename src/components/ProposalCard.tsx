"use client";
import { useState } from "react";
import VoteModal from "./VoteModal";
interface Proposal { id: string; title: string; status: string; proposer: string; forPct: number; againstPct: number; quorumPct: number; timeRemaining: string | null; }
export default function ProposalCard({ proposal, onVote }: { proposal: Proposal; onVote: (id: string, support: number) => Promise<void> }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-border-hover">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-foreground font-heading text-base font-semibold">{proposal.title}</h3>
          <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 whitespace-nowrap">{proposal.status}</span>
        </div>
        <p className="text-muted text-sm mb-4">Proposed by <span className="font-mono">{proposal.proposer}</span></p>
        <div className="w-full h-2 rounded-full bg-card-solid overflow-hidden mb-2"><div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: proposal.forPct + "%" }} /></div>
        <div className="flex justify-between text-sm mb-2"><span className="text-foreground">For: {proposal.forPct}%</span><span className="text-muted">Against: {proposal.againstPct}%</span></div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-muted text-sm">
            <span>Quorum: {proposal.quorumPct}%</span>
            {proposal.timeRemaining ? <span>{proposal.timeRemaining}</span> : <span className="text-primary">Executed</span>}
          </div>
          {proposal.status === "Active" && <button onClick={() => setShowModal(true)} className="cursor-pointer bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90">Vote</button>}
        </div>
      </div>
      {showModal && <VoteModal proposalId={proposal.id} title={proposal.title} onClose={() => setShowModal(false)} onVote={(support) => onVote(proposal.id, support)} />}
    </>
  );
}
