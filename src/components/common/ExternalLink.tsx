"use client";
interface ExternalLinkProps { children?: React.ReactNode; className?: string; }
export default function ExternalLink({ children, className }: ExternalLinkProps) { return <div className={className}>{children}</div>; }
