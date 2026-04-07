export function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
export function truncate(s: string, maxLen: number): string { return s.length > maxLen ? s.slice(0, maxLen - 3) + "..." : s; }
export function slugify(s: string): string { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
export function camelToKebab(s: string): string { return s.replace(/([A-Z])/g, "-$1").toLowerCase(); }
