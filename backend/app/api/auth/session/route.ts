import type { OwnerSessionState } from '@/lib/auth/owner-session-state';
import { SESSION_COOKIE } from '@/lib/auth/session-cookies';
import { validateOwnerSession } from '@/lib/auth/validate-owner-session';
import { readCookie } from '@/lib/http/read-cookie';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const dynamic = 'force-dynamic';

export const GET = withRequestLogging(async (request: Request) => {
  const state: OwnerSessionState = { signedIn: (await validateOwnerSession(readCookie(request, SESSION_COOKIE))) !== null };
  return Response.json(state);
});
