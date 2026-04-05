"use client";
interface LoadingDotsProps { children?: React.ReactNode; className?: string; }
export default function LoadingDots({ children, className }: LoadingDotsProps) { return <div className={className}>{children}</div>; }
