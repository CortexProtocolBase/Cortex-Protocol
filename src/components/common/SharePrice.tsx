export default function SharePrice({ value, symbol = "cVLT", className = "" }: { value: number; symbol?: string; className?: string }) {
  return <span className={`font-mono text-foreground ${className}`}>${value.toFixed(4)} <span className="text-muted text-xs">{symbol}</span></span>;
}
