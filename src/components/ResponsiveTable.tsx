"use client";
interface Column { key: string; label: string; hideOnMobile?: boolean; align?: "left" | "right"; }
interface ResponsiveTableProps { columns: Column[]; data: Record<string, React.ReactNode>[]; onRowClick?: (row: Record<string, React.ReactNode>, index: number) => void; }
export default function ResponsiveTable({ columns, data, onRowClick }: ResponsiveTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead><tr className="text-left text-xs text-muted uppercase tracking-wider border-b border-border">
            {columns.map(col => <th key={col.key} className={`pb-3 pr-4 font-medium ${col.align === "right" ? "text-right" : ""}`}>{col.label}</th>)}
          </tr></thead>
          <tbody>{data.map((row, i) => (
            <tr key={i} onClick={() => onRowClick?.(row, i)} className={`border-b border-border last:border-0 ${onRowClick ? "cursor-pointer hover:bg-card-hover" : ""}`}>
              {columns.map(col => <td key={col.key} className={`py-3 pr-4 text-sm ${col.align === "right" ? "text-right" : ""}`}>{row[col.key]}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {data.map((row, i) => (
          <div key={i} onClick={() => onRowClick?.(row, i)} className={`bg-card-solid rounded-xl p-4 space-y-2 ${onRowClick ? "cursor-pointer" : ""}`}>
            {columns.filter(c => !c.hideOnMobile).map(col => (
              <div key={col.key} className="flex items-center justify-between"><span className="text-xs text-muted">{col.label}</span><span className="text-sm text-foreground">{row[col.key]}</span></div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
