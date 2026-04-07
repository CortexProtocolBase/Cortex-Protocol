export function chunk<T>(arr: T[], size: number): T[][] { const result: T[][] = []; for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size)); return result; }
export function unique<T>(arr: T[]): T[] { return [...new Set(arr)]; }
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> { return arr.reduce((acc, item) => { const k = String(item[key]); (acc[k] = acc[k] || []).push(item); return acc; }, {} as Record<string, T[]>); }
export function sortBy<T>(arr: T[], key: keyof T, desc = false): T[] { return [...arr].sort((a, b) => { const cmp = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0; return desc ? -cmp : cmp; }); }
