"use client";
import { useState, useEffect, useRef } from "react";

interface CountUpProps { end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; className?: string; }

export default function CountUp({ end, duration = 1000, prefix = "", suffix = "", decimals = 0, className = "" }: CountUpProps) {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startRef.current = value;
    startTimeRef.current = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(startRef.current + (end - startRef.current) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span className={className}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
}
