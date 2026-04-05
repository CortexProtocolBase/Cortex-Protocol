export function formatDate(date: Date | string | number): string { return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
export function formatDateTime(date: Date | string | number): string { return new Date(date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
export function timeAgo(timestamp: number): string { const s = Math.floor(Date.now() / 1000 - timestamp); if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.floor(s/60)}m ago`; if (s < 86400) return `${Math.floor(s/3600)}h ago`; return `${Math.floor(s/86400)}d ago`; }
export function daysUntil(date: Date | string): number { return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)); }
