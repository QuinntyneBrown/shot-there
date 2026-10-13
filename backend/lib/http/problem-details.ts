import type { FieldError } from '@/lib/http/field-error';
import type { ProblemType } from '@/lib/http/problem-type';

/** The RFC 9457 error body of every error response except 401 and 405 (ICD §9.2). */
export interface ProblemDetails {
  type: ProblemType;
  title: string;
  status: number;
  detail: string | null;
  correlationId: string;
  errors: FieldError[];
  missingFields: string[];
}
