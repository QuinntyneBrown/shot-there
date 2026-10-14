import type { HttpProblem } from '@/lib/http/http-problem';
import type { ProblemDetails } from '@/lib/http/problem-details';
import type { ProblemType } from '@/lib/http/problem-type';

const TITLES: Record<ProblemType, string> = {
  'urn:shotthere:problem:validation-failed': 'The request failed validation',
  'urn:shotthere:problem:csrf-rejected': 'The anti-forgery or origin check failed',
  'urn:shotthere:problem:not-found': 'Not found',
  'urn:shotthere:problem:conflict': 'The request conflicts with the item state',
  'urn:shotthere:problem:payload-too-large': 'The request body is too large',
  'urn:shotthere:problem:unsupported-media-type': 'Unsupported request media type',
  'urn:shotthere:problem:publish-incomplete': 'The standard data set is incomplete',
  'urn:shotthere:problem:rate-limited': 'Too many requests',
  'urn:shotthere:problem:internal-error': 'Internal error',
};

/** The response for a problem: `application/problem+json` carrying the correlation ID, or an empty body when it has no type. */
export function problemResponse(problem: HttpProblem, correlationId: string): Response {
  if (problem.type === null) return new Response(null, { status: problem.status, headers: problem.headers });
  const body: ProblemDetails = {
    type: problem.type,
    title: TITLES[problem.type],
    status: problem.status,
    detail: problem.details.detail ?? null,
    correlationId,
    errors: problem.details.errors ?? [],
    missingFields: problem.details.missingFields ?? [],
  };
  return new Response(JSON.stringify(body), {
    status: problem.status,
    headers: { ...problem.headers, 'content-type': 'application/problem+json' },
  });
}
