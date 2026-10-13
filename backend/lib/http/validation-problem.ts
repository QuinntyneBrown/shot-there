import type { FieldError } from '@/lib/http/field-error';

/** The 400 body for input that fails validation. */
export interface ValidationProblem {
  status: 400;
  errors: FieldError[];
}
