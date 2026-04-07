export function generateId(): string { return crypto.randomUUID(); }
export function hashString(input: string): string { let hash = 0; for (let i = 0; i < input.length; i++) { const char = input.charCodeAt(i); hash = ((hash << 5) - hash) + char; hash |= 0; } return Math.abs(hash).toString(36); }
export function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
