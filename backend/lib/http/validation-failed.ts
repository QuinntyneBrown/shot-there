import { HttpProblem } from '@/lib/http/http-problem';
import type { FieldError } from '@/lib/http/field-error';
import type { ValidationProblem } from '@/lib/http/validation-problem';

export function validationFailed(errors: FieldError[]): HttpProblem {
  const problem: ValidationProblem = { status: 400, errors };
  return new HttpProblem(Response.json(problem, { status: 400 }));
}
