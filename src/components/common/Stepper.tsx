"use client";
interface StepperProps { children?: React.ReactNode; className?: string; }
export default function Stepper({ children, className }: StepperProps) { return <div className={className}>{children}</div>; }
