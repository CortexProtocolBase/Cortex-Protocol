"use client";
interface SliderProps { children?: React.ReactNode; className?: string; }
export default function Slider({ children, className }: SliderProps) { return <div className={className}>{children}</div>; }
