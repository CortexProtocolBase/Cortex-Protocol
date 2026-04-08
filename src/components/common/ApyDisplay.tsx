export default function ApyDisplay({ value, className = "" }: { value: number; className?: string }) {
  const color = value > 0 ? "text-primary" : value < 0 ? "text-red-500" : "text-muted";
  return <span className={`font-heading font-bold ${color} ${className}`}>{value > 0 ? "+" : ""}{value.toFixed(1)}%</span>;
}
