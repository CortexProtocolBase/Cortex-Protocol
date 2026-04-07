"use client";
import { useState } from "react";
import { X, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { showToast } from "./Toast";
interface VoteModalProps { proposalId: string; title: string; onClose: () => void; onVote: (support: number) => Promise<void>; }
export default function VoteModal({ proposalId, title, onClose, onVote }: VoteModalProps) {
  const [loading, setLoading] = useState(false);
  const [support, setSupport] = useState<number | null>(null);
  const handleVote = async () => {
    if (support === null) return;
    setLoading(true);
    try { await onVote(support); showToast("Vote submitted successfully", "success"); onClose(); } catch (e) { showToast("Failed to submit vote", "error"); } finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold">Cast Vote</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-muted mb-6">{title}</p>
        <div className="flex gap-3 mb-6">
          <button onClick={() => setSupport(1)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-all ${support === 1 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:text-foreground"}`}><ThumbsUp className="w-4 h-4" />For</button>
          <button onClick={() => setSupport(0)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-all ${support === 0 ? "border-red-500 bg-red-500/10 text-red-500" : "border-border text-muted hover:text-foreground"}`}><ThumbsDown className="w-4 h-4" />Against</button>
        </div>
        <button onClick={handleVote} disabled={support === null || loading} className="w-full bg-foreground text-background rounded-xl py-3 font-heading font-bold cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Submitting..." : "Submit Vote"}</button>
      </div>
    </div>
  );
}
