export function isValidAddress(address: string): boolean { return /^0x[a-fA-F0-9]{40}$/.test(address); }
export function isValidAmount(amount: string): boolean { return /^\d+\.?\d*$/.test(amount) && parseFloat(amount) > 0; }
export function isValidTxHash(hash: string): boolean { return /^0x[a-fA-F0-9]{64}$/.test(hash); }
export function sanitizeInput(input: string): string { return input.replace(/[<>&"']/g, ""); }
