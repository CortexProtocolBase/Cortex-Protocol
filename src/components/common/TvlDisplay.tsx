export default function TvlDisplay({ value, className = "" }: { value: number; className?: string }) {
  const formatted = value >= 1e9 ? `$${(value / 1e9).toFixed(2)}B` : value >= 1e6 ? `$${(value / 1e6).toFixed(2)}M` : value >= 1e3 ? `$${(value / 1e3).toFixed(1)}K` : `$${value.toFixed(2)}`;
  return <span className={`font-heading font-bold ${className}`}>{formatted}</span>;
}
