import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session-cookies';
import { HttpProblem } from '@/lib/http/http-problem';
import { MAX_JSON_BODY_BYTES } from '@/lib/http/max-json-body-bytes';
import { payloadTooLarge } from '@/lib/http/payload-too-large';
import { problemResponse } from '@/lib/http/problem-response';
import { securityHeaders } from '@/lib/http/security-headers';
import { CORRELATION_HEADER, correlationIdFor } from '@/lib/logging/correlation-id-for';

const UPLOAD_PATH = '/api/admin/images';
const ADMIN_PATH_PREFIX = '/api/admin/';

export function proxy(request: NextRequest): NextResponse {
  return withSecurityHeaders(route(request));
}

function route(request: NextRequest): NextResponse {
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') === 'http') {
    const secureUrl = new URL(request.url);
    secureUrl.protocol = 'https:';
    return answer(request, NextResponse.redirect(secureUrl, 301));
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (request.nextUrl.pathname !== UPLOAD_PATH && contentLength > MAX_JSON_BODY_BYTES) {
    return answerProblem(request, payloadTooLarge());
  }

  // Cheap first gate; every admin handler still validates the session with requireOwnerSession.
  if (request.nextUrl.pathname.startsWith(ADMIN_PATH_PREFIX) && !request.cookies.has(SESSION_COOKIE)) {
    return answerProblem(request, new HttpProblem(401, null));
  }

  return NextResponse.next();
}

/** A response the proxy gives itself, without reaching a handler, carrying a correlation ID (ICD O-1). */
function answer(request: NextRequest, response: NextResponse): NextResponse {
  response.headers.set(CORRELATION_HEADER, correlationIdFor(request));
  return response;
}

function answerProblem(request: NextRequest, problem: HttpProblem): NextResponse {
  const correlationId = correlationIdFor(request);
  const response = problemResponse(problem, correlationId);
  const answered = new NextResponse(response.body, response);
  answered.headers.set(CORRELATION_HEADER, correlationId);
  return answered;
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [name, value] of Object.entries(securityHeaders)) response.headers.set(name, value);
  return response;
}

export const config = { matcher: '/api/:path*' };
