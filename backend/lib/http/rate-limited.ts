import { HttpProblem } from '@/lib/http/http-problem';

export function rateLimited(): HttpProblem {
  return new HttpProblem(429, 'urn:shotthere:problem:rate-limited');
}
