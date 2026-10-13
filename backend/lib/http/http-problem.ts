import type { FieldError } from '@/lib/http/field-error';
import type { ProblemType } from '@/lib/http/problem-type';

/**
 * Thrown to end a request early with an error. The route wrapper turns it into a problem response,
 * or an empty body when `type` is null (401).
 */
export class HttpProblem extends Error {
  constructor(
    readonly status: number,
    readonly type: ProblemType | null,
    readonly details: { detail?: string; errors?: FieldError[]; missingFields?: string[] } = {},
    readonly headers: Readonly<Record<string, string>> = {},
  ) {
    super(`HTTP ${status}`);
    this.name = 'HttpProblem';
  }
}
