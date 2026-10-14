import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session-cookies';
import { allowedMethods } from '@/lib/http/allowed-methods';
import { HttpProblem } from '@/lib/http/http-problem';
import { MAX_JSON_BODY_BYTES } from '@/lib/http/max-json-body-bytes';
import { payloadTooLarge } from '@/lib/http/payload-too-large';
import { problemResponse } from '@/lib/http/problem-response';
import { securityHeaders } from '@/lib/http/security-headers';
import { MAX_UPLOAD_BYTES } from '@/lib/images/max-upload-bytes';
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

  const allow = allowedMethods(request.nextUrl.pathname);
  if (allow && !allow.split(', ').includes(request.method)) {
    return answer(request, new NextResponse(null, { status: 405, headers: { allow } }));
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  const maxBytes = request.nextUrl.pathname === UPLOAD_PATH ? MAX_UPLOAD_BYTES : MAX_JSON_BODY_BYTES;
  if (contentLength > maxBytes) return answerProblem(request, payloadTooLarge());

  // Cheap first gate; every admin handler still validates the session with requireOwnerSession.
  if (request.nextUrl.pathname.startsWith(ADMIN_PATH_PREFIX) && !request.cookies.has(SESSION_COOKIE)) {
    return answerProblem(request, new HttpProblem(401, null));
  }

  return NextResponse.next();
}

/** A response the proxy gives itself, without reaching a handler: never stored, with a correlation ID (ICD §10, O-1). */
function answer(request: NextRequest, response: NextResponse, correlationId = correlationIdFor(request)): NextResponse {
  response.headers.set(CORRELATION_HEADER, correlationId);
  response.headers.set('cache-control', 'no-store');
  return response;
}

function answerProblem(request: NextRequest, problem: HttpProblem): NextResponse {
  const correlationId = correlationIdFor(request);
  const response = problemResponse(problem, correlationId);
  return answer(request, new NextResponse(response.body, response), correlationId);
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [name, value] of Object.entries(securityHeaders)) response.headers.set(name, value);
  return response;
}

export const config = { matcher: '/api/:path*' };
