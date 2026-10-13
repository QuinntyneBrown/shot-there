import { afterEach, vi } from 'vitest';

/** Captures the JSON log lines the backend writes to stdout. */
export function captureLogs(): Record<string, unknown>[] {
  const lines: Record<string, unknown>[] = [];
  const spy = vi.spyOn(process.stdout, 'write').mockImplementation((chunk: string | Uint8Array) => {
    for (const line of String(chunk).split('\n').filter(Boolean)) lines.push(JSON.parse(line));
    return true;
  });
  afterEach(() => spy.mockRestore());
  return lines;
}
