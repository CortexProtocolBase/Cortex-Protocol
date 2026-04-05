"use client";
interface AccordionProps { children?: React.ReactNode; className?: string; }
export default function Accordion({ children, className }: AccordionProps) { return <div className={className}>{children}</div>; }
