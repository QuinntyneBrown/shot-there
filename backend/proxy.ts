import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session-cookies';
import { MAX_JSON_BODY_BYTES } from '@/lib/http/max-json-body-bytes';
import { securityHeaders } from '@/lib/http/security-headers';

const UPLOAD_PATH = '/api/admin/images';
const ADMIN_PATH_PREFIX = '/api/admin/';

export function proxy(request: NextRequest): NextResponse {
  return withSecurityHeaders(route(request));
}

function route(request: NextRequest): NextResponse {
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') === 'http') {
    const secureUrl = new URL(request.url);
    secureUrl.protocol = 'https:';
    return NextResponse.redirect(secureUrl, 301);
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (request.nextUrl.pathname !== UPLOAD_PATH && contentLength > MAX_JSON_BODY_BYTES) {
    return NextResponse.json({ status: 413 }, { status: 413 });
  }

  // Cheap first gate; every admin handler still validates the session with requireOwnerSession.
  if (request.nextUrl.pathname.startsWith(ADMIN_PATH_PREFIX) && !request.cookies.has(SESSION_COOKIE)) {
    return new NextResponse(null, { status: 401 });
  }

  return NextResponse.next();
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [name, value] of Object.entries(securityHeaders)) response.headers.set(name, value);
  return response;
}

export const config = { matcher: '/api/:path*' };
