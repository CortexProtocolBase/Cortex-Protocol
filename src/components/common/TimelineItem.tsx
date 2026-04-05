"use client";
interface TimelineItemProps { children?: React.ReactNode; className?: string; }
export default function TimelineItem({ children, className }: TimelineItemProps) { return <div className={className}>{children}</div>; }
