"use client";
import { Check, Loader2, X, ExternalLink } from "lucide-react";
type TxState = "idle" | "pending" | "confirming" | "success" | "error";
interface TransactionStatusProps { state: TxState; txHash?: string; message?: string; }
export default function TransactionStatus({ state, txHash, message }: TransactionStatusProps) {
  if (state === "idle") return null;
  const icon = { pending: <Loader2 className="w-5 h-5 text-primary animate-spin" />, confirming: <Loader2 className="w-5 h-5 text-primary animate-spin" />, success: <Check className="w-5 h-5 text-green-500" />, error: <X className="w-5 h-5 text-red-500" /> }[state];
  const text = message || { pending: "Waiting for signature...", confirming: "Confirming transaction...", success: "Transaction confirmed!", error: "Transaction failed" }[state];
  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
      {icon}
      <div className="flex-1"><p className="text-sm text-foreground">{text}</p>
        {txHash && <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">View on BaseScan <ExternalLink className="w-3 h-3" /></a>}
      </div>
    </div>
  );
}
