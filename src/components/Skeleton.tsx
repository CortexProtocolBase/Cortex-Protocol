export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-card-solid rounded-xl ${className}`} />;
}
export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
export function ChartSkeleton() {
  return <Skeleton className="h-72 w-full" />;
}
