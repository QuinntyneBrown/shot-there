import type { NewOwnerSession } from '@/lib/auth/new-owner-session';
import { hashSessionToken, newRandomToken } from '@/lib/auth/session-token';
import { getDependencies } from '@/lib/data/dependency-container';

/** Stores a session holding only a hash of a random token and returns the raw token for the cookie. */
export async function createOwnerSession(ownerId: string): Promise<NewOwnerSession> {
  const { ownerSessions, clock } = getDependencies();
  const token = newRandomToken();
  const csrfToken = newRandomToken();
  const now = clock.now();
  await ownerSessions.create({
    id: crypto.randomUUID(),
    ownerId,
    tokenHash: hashSessionToken(token),
    csrfToken,
    createdAt: now,
    lastSeenAt: now,
  });
  return { token, csrfToken };
}
