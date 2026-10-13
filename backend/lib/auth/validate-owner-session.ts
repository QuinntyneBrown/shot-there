import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import { hashSessionToken } from '@/lib/auth/session-token';
import { getDependencies } from '@/lib/data/dependency-container';

const IDLE_LIMIT_MS = 12 * 3_600_000;
const ABSOLUTE_LIMIT_MS = 7 * 24 * 3_600_000;

/** The live session for the raw token, marked active, or null when it is unknown, idle over 12 hours or older than 7 days. */
export async function validateOwnerSession(token: string | null): Promise<OwnerSessionRecord | null> {
  if (!token) return null;
  const { ownerSessions, clock } = getDependencies();
  const session = await ownerSessions.findByTokenHash(hashSessionToken(token));
  const now = clock.now();
  if (
    !session ||
    now.getTime() - session.lastSeenAt.getTime() > IDLE_LIMIT_MS ||
    now.getTime() - session.createdAt.getTime() > ABSOLUTE_LIMIT_MS
  ) {
    return null;
  }
  await ownerSessions.touch(session.id, now);
  return { ...session, lastSeenAt: now };
}
