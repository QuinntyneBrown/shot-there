import { HttpProblem } from '@/lib/http/http-problem';

/** A 422 listing each missing standard field. */
export function missingFields(fields: string[]): HttpProblem {
  return new HttpProblem(422, 'urn:shotthere:problem:publish-incomplete', { missingFields: fields });
}
