import { SESSION_COOKIE, clearedSessionCookie } from '@/lib/auth/session-cookies';
import { signOutOwner } from '@/lib/auth/sign-out-owner';
import { readCookie } from '@/lib/http/read-cookie';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const POST = withRequestLogging(async (request: Request) => {
  await signOutOwner(readCookie(request, SESSION_COOKIE));
  const response = new Response(null, { status: 204 });
  response.headers.append('Set-Cookie', clearedSessionCookie());
  return response;
});
