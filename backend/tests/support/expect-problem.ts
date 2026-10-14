import { expect } from 'vitest';
import type { ProblemDetails } from '@/lib/http/problem-details';

/** Asserts an ICD §9.2 problem response of the given short type (e.g. `not-found`) and status, and returns its body. */
export async function expectProblem(response: Response, type: string, status: number): Promise<ProblemDetails> {
  expect(response.status).toBe(status);
  expect(response.headers.get('content-type')).toBe('application/problem+json');
  const body = (await response.json()) as ProblemDetails;
  expect(body).toMatchObject({
    type: `urn:shotthere:problem:${type}`,
    status,
    correlationId: response.headers.get('x-correlation-id'),
  });
  return body;
}
