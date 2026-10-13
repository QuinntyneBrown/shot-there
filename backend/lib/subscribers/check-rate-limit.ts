import { getDependencies } from '@/lib/data/dependency-container';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 6;

/** Request times per client, held in process memory (single-instance deployment). */
const requestTimes = new Map<string, number[]>();

/** Records a signup request and reports whether the client is within six requests a minute. */
export function checkRateLimit(clientKey: string): boolean {
  const now = getDependencies().clock.now().getTime();
  const recent = (requestTimes.get(clientKey) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  requestTimes.set(clientKey, recent);
  return recent.length <= MAX_REQUESTS_PER_WINDOW;
}
