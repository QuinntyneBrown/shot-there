import { HttpProblem } from '@/lib/http/http-problem';

/** A 409: the request conflicts with the item's state; `detail` is English diagnostic text. */
export function conflict(detail: string): HttpProblem {
  return new HttpProblem(409, 'urn:shotthere:problem:conflict', { detail });
}
