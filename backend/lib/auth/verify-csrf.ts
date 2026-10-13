import { timingSafeEqual } from 'node:crypto';
import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import { HttpProblem } from '@/lib/http/http-problem';

/** Refuses an admin write with 403 unless it echoes the session's CSRF token and comes from the site's own origin. */
export function verifyCsrf(request: Request, session: OwnerSessionRecord): void {
  const origin = request.headers.get('origin');
  const sentToken = Buffer.from(request.headers.get('x-csrf-token') ?? '');
  const expectedToken = Buffer.from(session.csrfToken);
  const tokenMatches = sentToken.length === expectedToken.length && timingSafeEqual(sentToken, expectedToken);
  const originMatches = Boolean(process.env.SITE_ORIGIN) && origin === process.env.SITE_ORIGIN;
  if (!tokenMatches || !originMatches) throw new HttpProblem(Response.json({ status: 403 }, { status: 403 }));
}
