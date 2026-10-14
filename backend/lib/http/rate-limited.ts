import { HttpProblem } from '@/lib/http/http-problem';

/** A 429 telling the client how many whole seconds to wait before trying again. */
export function rateLimited(retryAfterSeconds: number): HttpProblem {
  return new HttpProblem(429, 'urn:shotthere:problem:rate-limited', {}, { 'retry-after': String(retryAfterSeconds) });
}
