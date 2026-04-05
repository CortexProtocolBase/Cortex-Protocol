"use client";
interface RewardDisplayProps { children?: React.ReactNode; className?: string; }
export default function RewardDisplay({ children, className }: RewardDisplayProps) { return <div className={className}>{children}</div>; }
