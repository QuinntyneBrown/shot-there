import { hashSessionToken } from '@/lib/auth/session-token';
import { getDependencies } from '@/lib/data/dependency-container';

/** Deletes the session for the raw token so the cookie can never be reused. */
export async function signOutOwner(token: string | null): Promise<void> {
  if (token) await getDependencies().ownerSessions.deleteByTokenHash(hashSessionToken(token));
}
