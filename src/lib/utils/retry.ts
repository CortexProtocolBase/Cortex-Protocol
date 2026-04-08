export async function retry<T>(fn: () => Promise<T>, maxRetries: number = 3, baseDelay: number = 1000): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try { return await fn(); } catch (err) { lastError = err as Error; if (attempt < maxRetries) { const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000; await new Promise(r => setTimeout(r, delay)); } }
  }
  throw lastError;
}
