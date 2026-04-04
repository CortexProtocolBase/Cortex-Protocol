"use client";
interface BreadcrumbProps { children?: React.ReactNode; className?: string; }
export default function Breadcrumb({ children, className }: BreadcrumbProps) { return <div className={className}>{children}</div>; }
