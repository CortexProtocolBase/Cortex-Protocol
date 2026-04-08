"use client";
import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps { text: string; className?: string; size?: number; }

export default function CopyButton({ text, className = "", size = 14 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }, [text]);
  return (
    <button onClick={handleCopy} className={`cursor-pointer text-muted hover:text-foreground transition-colors ${className}`} aria-label="Copy">
      {copied ? <Check size={size} className="text-primary" /> : <Copy size={size} />}
    </button>
  );
}
