"use client";
interface CopyButtonProps { children?: React.ReactNode; className?: string; }
export default function CopyButton({ children, className }: CopyButtonProps) { return <div className={className}>{children}</div>; }
