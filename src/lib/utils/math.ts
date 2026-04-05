export function clamp(value: number, min: number, max: number): number { return Math.min(max, Math.max(min, value)); }
export function lerp(start: number, end: number, t: number): number { return start + (end - start) * clamp(t, 0, 1); }
export function roundTo(value: number, decimals: number): number { const factor = Math.pow(10, decimals); return Math.round(value * factor) / factor; }
export function percentChange(from: number, to: number): number { if (from === 0) return 0; return roundTo(((to - from) / from) * 100, 2); }
