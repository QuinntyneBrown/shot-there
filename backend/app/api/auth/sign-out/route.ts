import { SESSION_COOKIE, clearedCookies } from '@/lib/auth/session-cookies';
import { signOutOwner } from '@/lib/auth/sign-out-owner';
import { validateOwnerSession } from '@/lib/auth/validate-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { readCookie } from '@/lib/http/read-cookie';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const POST = withRequestLogging(async (request: Request) => {
  const token = readCookie(request, SESSION_COOKIE);
  const session = await validateOwnerSession(token);
  if (session) {
    verifyCsrf(request, session);
    await signOutOwner(token);
  }
  const response = new Response(null, { status: 204 });
  for (const cookie of clearedCookies()) response.headers.append('Set-Cookie', cookie);
  return response;
});
