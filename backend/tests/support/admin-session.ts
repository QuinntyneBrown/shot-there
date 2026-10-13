import { afterEach, beforeEach, vi } from 'vitest';
import type { Dependencies } from '@/lib/data/dependencies';
import { useFakeDependencies, type FakeSeed } from '@/tests/support/fake-dependencies';
import { SITE_ORIGIN, anOwnerSession, ownerHeaders } from '@/tests/support/owner-account';

export const OWNER_TOKEN = 'owner-token';

/** Stubs the site origin around each test so CSRF origin checks can pass. Call once at the top of a test file. */
export function stubSiteOriginPerTest(): void {
  beforeEach(() => vi.stubEnv('SITE_ORIGIN', SITE_ORIGIN));
  afterEach(() => vi.unstubAllEnvs());
}

/** In-memory dependencies with the owner signed in under OWNER_TOKEN. */
export function useSignedInOwner(seed: FakeSeed = {}): Dependencies {
  return useFakeDependencies({ ...seed, ownerSessions: [anOwnerSession(OWNER_TOKEN)] });
}

/** A same-origin admin request carrying the owner's session cookie and CSRF token; `signedIn: false` sends neither. */
export function adminRequest(
  path: string,
  { method = 'GET', body, signedIn = true }: { method?: string; body?: unknown; signedIn?: boolean } = {},
): Request {
  const headers: Record<string, string> = signedIn ? ownerHeaders(OWNER_TOKEN) : { origin: SITE_ORIGIN };
  if (body !== undefined) headers['content-type'] = 'application/json';
  return new Request(`${SITE_ORIGIN}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/** Route context for a dynamic `[id]` segment. */
export function idParams(id: string) {
  return { params: Promise.resolve({ id }) };
}
