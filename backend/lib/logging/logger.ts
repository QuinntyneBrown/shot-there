import type { LogLevel } from '@/lib/logging/log-level';

/** Writes one JSON line to stdout. */
export function log(level: LogLevel, correlationId: string, fields: Record<string, unknown>): void {
  const line = { time: new Date().toISOString(), level, correlationId, ...fields };
  process.stdout.write(`${JSON.stringify(line)}\n`);
}
