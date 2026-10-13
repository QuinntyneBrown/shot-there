import { timingSafeEqual } from 'node:crypto';
import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import { verifyOrigin } from '@/lib/auth/verify-origin';
import { HttpProblem } from '@/lib/http/http-problem';

/** Refuses an admin write with 403 unless it echoes the session's CSRF token and comes from the site's own origin. */
export function verifyCsrf(request: Request, session: OwnerSessionRecord): void {
  const sentToken = Buffer.from(request.headers.get('x-csrf-token') ?? '');
  const expectedToken = Buffer.from(session.csrfToken);
  const tokenMatches = sentToken.length === expectedToken.length && timingSafeEqual(sentToken, expectedToken);
  if (!tokenMatches) throw new HttpProblem(403, 'urn:shotthere:problem:csrf-rejected');
  verifyOrigin(request);
}
