import { HttpProblem } from '@/lib/http/http-problem';

/** Ends the request with a 404 problem that leaks no identifiers. */
export function notFound(): never {
  throw new HttpProblem(404, 'urn:shotthere:problem:not-found');
}
