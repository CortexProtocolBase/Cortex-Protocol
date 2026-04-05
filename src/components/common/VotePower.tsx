"use client";
interface VotePowerProps { children?: React.ReactNode; className?: string; }
export default function VotePower({ children, className }: VotePowerProps) { return <div className={className}>{children}</div>; }
