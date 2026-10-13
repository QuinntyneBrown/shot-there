import { HttpProblem } from '@/lib/http/http-problem';
import type { MissingFieldsProblem } from '@/lib/publishing/missing-fields-problem';

/** A 422 listing each missing standard field. */
export function missingFields(fields: string[]): HttpProblem {
  const problem: MissingFieldsProblem = { status: 422, missingFields: fields };
  return new HttpProblem(Response.json(problem, { status: 422 }));
}
