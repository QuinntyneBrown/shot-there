import { HttpProblem } from '@/lib/http/http-problem';
import { problemResponse } from '@/lib/http/problem-response';
import { correlationContext } from '@/lib/logging/correlation-context';
import { CORRELATION_HEADER, correlationIdFor } from '@/lib/logging/correlation-id-for';
import { log } from '@/lib/logging/logger';

type RouteHandler<C> = (request: Request, context: C) => Promise<Response>;

/** Wraps a route handler: correlation ID, one request log line, `HttpProblem` responses, and a generic 500 for unhandled errors. */
export function withRequestLogging<C = unknown>(
  handler: RouteHandler<C>,
): (request: Request, context?: C) => Promise<Response> {
  return async (request, context) => {
    const started = performance.now();
    const correlationId = correlationIdFor(request);

    let response: Response;
    try {
      response = await correlationContext.run(correlationId, () => handler(request, context as C));
    } catch (error) {
      if (error instanceof HttpProblem) {
        response = problemResponse(error, correlationId);
      } else {
        const failure = error instanceof Error ? error : new Error(String(error));
        log('error', correlationId, { errorName: failure.name, message: failure.message, stack: failure.stack });
        response = problemResponse(new HttpProblem(500, 'urn:shotthere:problem:internal-error'), correlationId);
      }
    }

    response.headers.set(CORRELATION_HEADER, correlationId);
    log('info', correlationId, {
      method: request.method,
      path: new URL(request.url).pathname,
      status: response.status,
      durationMs: Math.round(performance.now() - started),
    });
    return response;
  };
}
