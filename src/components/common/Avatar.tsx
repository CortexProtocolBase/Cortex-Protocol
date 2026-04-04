"use client";
interface AvatarProps { children?: React.ReactNode; className?: string; }
export default function Avatar({ children, className }: AvatarProps) { return <div className={className}>{children}</div>; }
