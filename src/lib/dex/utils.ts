import { formatUnits, parseUnits } from "viem";
export function applySlippage(amount: bigint, slippageBps: number): bigint { return amount - (amount * BigInt(slippageBps)) / 10000n; }
export function calculatePriceImpact(expected: bigint, actual: bigint): number { if (expected === 0n) return 0; return Math.round(Number(expected - actual) / Number(expected) * 10000) / 100; }
export function getDeadline(seconds: number = 1200): number { return Math.floor(Date.now() / 1000) + seconds; }
export function formatTokenAmount(amount: bigint, decimals: number, dp: number = 4): string { return parseFloat(formatUnits(amount, decimals)).toFixed(dp); }
export function parseTokenAmount(amount: string, decimals: number): bigint { return parseUnits(amount, decimals); }
export function estimateGasCostUsd(gasUsed: bigint, gasPriceGwei: number, ethPrice: number): number { return Number(gasUsed) * gasPriceGwei * 1e-9 * ethPrice; }
export function isSameToken(a: string, b: string): boolean { return a.toLowerCase() === b.toLowerCase(); }
export function sortTokens(a: string, b: string): [string, string] { return a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a]; }
export function encodePath(tokens: string[], fees: number[]): string { let encoded = tokens[0].toLowerCase(); for (let i = 0; i < fees.length; i++) { encoded += fees[i].toString(16).padStart(6, "0") + tokens[i + 1].toLowerCase().slice(2); } return encoded; }
