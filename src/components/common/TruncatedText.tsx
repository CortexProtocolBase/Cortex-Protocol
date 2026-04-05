"use client";
interface TruncatedTextProps { children?: React.ReactNode; className?: string; }
export default function TruncatedText({ children, className }: TruncatedTextProps) { return <div className={className}>{children}</div>; }
