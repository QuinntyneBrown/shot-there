import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import { SESSION_COOKIE } from '@/lib/auth/session-cookies';
import { validateOwnerSession } from '@/lib/auth/validate-owner-session';
import { HttpProblem } from '@/lib/http/http-problem';
import { readCookie } from '@/lib/http/read-cookie';

/** Called first in every `/api/admin/*` handler: the owner's live session, or a 401 with no body before any other read or write. */
export async function requireOwnerSession(request: Request): Promise<OwnerSessionRecord> {
  const session = await validateOwnerSession(readCookie(request, SESSION_COOKIE));
  if (!session) throw new HttpProblem(new Response(null, { status: 401 }));
  return session;
}
