type LogLevel = "debug" | "info" | "warn" | "error";
const LOG_LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL = (process.env.LOG_LEVEL as LogLevel) || "info";
export function log(level: LogLevel, source: string, message: string, data?: Record<string, unknown>) {
  if (LOG_LEVELS[level] < LOG_LEVELS[MIN_LEVEL]) return;
  const entry = { timestamp: new Date().toISOString(), level, source, message, ...data };
  if (level === "error") console.error(JSON.stringify(entry));
  else if (level === "warn") console.warn(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}
export const logger = { debug: (src: string, msg: string, data?: Record<string, unknown>) => log("debug", src, msg, data), info: (src: string, msg: string, data?: Record<string, unknown>) => log("info", src, msg, data), warn: (src: string, msg: string, data?: Record<string, unknown>) => log("warn", src, msg, data), error: (src: string, msg: string, data?: Record<string, unknown>) => log("error", src, msg, data) };
