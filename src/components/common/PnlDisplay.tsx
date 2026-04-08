interface PnlDisplayProps { value: number; prefix?: string; suffix?: string; className?: string; }

export default function PnlDisplay({ value, prefix = "", suffix = "", className = "" }: PnlDisplayProps) {
  const isPositive = value >= 0;
  const color = isPositive ? "text-primary" : "text-red-500";
  const sign = isPositive ? "+" : "";
  return <span className={`${color} ${className}`}>{sign}{prefix}{value.toLocaleString()}{suffix}</span>;
}
