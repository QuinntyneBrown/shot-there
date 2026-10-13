import { HttpProblem } from '@/lib/http/http-problem';
import { problemResponse } from '@/lib/http/problem-response';
import { correlationContext } from '@/lib/logging/correlation-context';
import { log } from '@/lib/logging/logger';

const CORRELATION_HEADER = 'x-correlation-id';
const SAFE_CORRELATION_ID = /^[A-Za-z0-9-]{1,64}$/;

type RouteHandler<C> = (request: Request, context: C) => Promise<Response>;

/** Wraps a route handler: correlation ID, one request log line, `HttpProblem` responses, and a generic 500 for unhandled errors. */
export function withRequestLogging<C = unknown>(
  handler: RouteHandler<C>,
): (request: Request, context?: C) => Promise<Response> {
  return async (request, context) => {
    const started = performance.now();
    const incoming = request.headers.get(CORRELATION_HEADER);
    const correlationId = incoming && SAFE_CORRELATION_ID.test(incoming) ? incoming : crypto.randomUUID();

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
