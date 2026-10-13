import type { FieldError } from '@/lib/http/field-error';
import { HttpProblem } from '@/lib/http/http-problem';

export function validationFailed(errors: FieldError[]): HttpProblem {
  return new HttpProblem(400, 'urn:shotthere:problem:validation-failed', { errors });
}
