export function bigintMin(a: bigint, b: bigint): bigint { return a < b ? a : b; }
export function bigintMax(a: bigint, b: bigint): bigint { return a > b ? a : b; }
export function bigintAbs(n: bigint): bigint { return n < 0n ? -n : n; }
export function bigintToNumber(n: bigint, decimals: number): number { return Number(n) / Math.pow(10, decimals); }
export function numberToBigint(n: number, decimals: number): bigint { return BigInt(Math.round(n * Math.pow(10, decimals))); }
