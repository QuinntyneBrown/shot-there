import argon2 from 'argon2';
import type { OwnerRecord } from '@/lib/auth/owner-record';
import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import { hashSessionToken } from '@/lib/auth/session-token';
import { fixedClock } from '@/tests/support/fixed-clock';

export const OWNER_EMAIL = 'owner@shotthere.ca';
export const OWNER_PASSWORD = 'correct horse battery staple';
export const SITE_ORIGIN = 'https://shotthere.ca';

let passwordHash: Promise<string> | undefined;

/** The single owner account, its password hashed with argon2id. */
export async function anOwner(): Promise<OwnerRecord> {
  passwordHash ??= argon2.hash(OWNER_PASSWORD, { type: argon2.argon2id });
  return { id: 'owner-1', email: OWNER_EMAIL, passwordHash: await passwordHash };
}

/** A stored session for the raw cookie token; only its hash is kept, as in production. */
export function anOwnerSession(token: string, overrides: Partial<OwnerSessionRecord> = {}): OwnerSessionRecord {
  const now = fixedClock('2026-10-13').now();
  return {
    id: `session-${token}`,
    ownerId: 'owner-1',
    tokenHash: hashSessionToken(token),
    csrfToken: `csrf-${token}`,
    createdAt: now,
    lastSeenAt: now,
    ...overrides,
  };
}

/** Headers of a same-site admin request: the session cookie, the echoed CSRF token and the site origin. */
export function ownerHeaders(token: string, csrfToken = `csrf-${token}`, origin = SITE_ORIGIN): Record<string, string> {
  return { cookie: `st_csrf=${csrfToken}; st_session=${token}`, 'x-csrf-token': csrfToken, origin };
}
