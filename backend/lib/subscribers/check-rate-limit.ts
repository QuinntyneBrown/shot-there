import { getDependencies } from '@/lib/data/dependency-container';

/** Requests older than this no longer count, so a refused client can retry after it. */
export const SIGNUP_WINDOW_SECONDS = 60;
const WINDOW_MS = SIGNUP_WINDOW_SECONDS * 1000;
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
