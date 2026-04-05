"use client";
interface TvlDisplayProps { children?: React.ReactNode; className?: string; }
export default function TvlDisplay({ children, className }: TvlDisplayProps) { return <div className={className}>{children}</div>; }
