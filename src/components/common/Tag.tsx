"use client";
interface TagProps { children?: React.ReactNode; className?: string; }
export default function Tag({ children, className }: TagProps) { return <div className={className}>{children}</div>; }
