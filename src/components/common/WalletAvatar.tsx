"use client";
interface WalletAvatarProps { children?: React.ReactNode; className?: string; }
export default function WalletAvatar({ children, className }: WalletAvatarProps) { return <div className={className}>{children}</div>; }
