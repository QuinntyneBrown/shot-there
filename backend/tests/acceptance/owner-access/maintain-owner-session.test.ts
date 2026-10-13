import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as getSession } from '@/app/api/auth/session/route';
import { POST as signOut } from '@/app/api/auth/sign-out/route';
import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { HttpProblem } from '@/lib/http/http-problem';
import { problemResponse } from '@/lib/http/problem-response';
import { proxy } from '@/proxy';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { fixedClock } from '@/tests/support/fixed-clock';
import type { InMemoryOwnerSessionRepository } from '@/tests/support/in-memory-owner-session-repository';
import { SITE_ORIGIN, anOwnerSession, ownerHeaders } from '@/tests/support/owner-account';

const now = fixedClock('2026-10-13').now();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 3_600_000);

beforeEach(() => vi.stubEnv('SITE_ORIGIN', SITE_ORIGIN));
afterEach(() => vi.unstubAllEnvs());

function sessionsOf(dependencies: ReturnType<typeof useFakeDependencies>) {
  return (dependencies.ownerSessions as InMemoryOwnerSessionRepository).rows;
}

function adminRequest(headers: Record<string, string> = {}, method = 'GET') {
  return new Request(`${SITE_ORIGIN}/api/admin/studios`, { method, headers });
}

async function sessionState(headers: Record<string, string> = {}) {
  const response = await getSession(new Request(`${SITE_ORIGIN}/api/auth/session`, { headers }));
  return { status: response.status, body: await response.json() };
}

/** The response of a request refused by a session or CSRF check. */
async function rejection(action: () => unknown): Promise<Response> {
  try {
    await action();
  } catch (error) {
    if (error instanceof HttpProblem) return problemResponse(error, 'test');
    throw error;
  }
  throw new Error('Expected the request to be refused');
}

describe('L2-051 session state and expiry', () => {
  it('Given a valid session, when the session state is requested, then signedIn is true with no identity and the session is marked active', async () => {
    const dependencies = useFakeDependencies({ ownerSessions: [anOwnerSession('tok', { lastSeenAt: hoursAgo(1) })] });

    const state = await sessionState(ownerHeaders('tok'));

    expect(state).toEqual({ status: 200, body: { signedIn: true } });
    expect(sessionsOf(dependencies)[0].lastSeenAt).toEqual(now);
  });

  it('Given no session cookie, when the session state is requested, then signedIn is false', async () => {
    useFakeDependencies();

    expect(await sessionState()).toEqual({ status: 200, body: { signedIn: false } });
  });

  it('Given a session idle for more than 12 hours, when used, then it is rejected', async () => {
    useFakeDependencies({ ownerSessions: [anOwnerSession('tok', { lastSeenAt: hoursAgo(12.1) })] });

    expect((await sessionState(ownerHeaders('tok'))).body).toEqual({ signedIn: false });
  });

  it('Given a session older than 7 days, when used, then it is rejected even if recently active', async () => {
    useFakeDependencies({
      ownerSessions: [anOwnerSession('tok', { createdAt: hoursAgo(7 * 24 + 1), lastSeenAt: hoursAgo(0.5) })],
    });

    expect((await sessionState(ownerHeaders('tok'))).body).toEqual({ signedIn: false });
  });
});

describe('L2-051 sign-out', () => {
  it('Given a signed-in owner, when they sign out, then the session is deleted, the cookie is cleared and the old cookie is rejected', async () => {
    const dependencies = useFakeDependencies({ ownerSessions: [anOwnerSession('tok')] });

    const response = await signOut(
      new Request(`${SITE_ORIGIN}/api/auth/sign-out`, { method: 'POST', headers: ownerHeaders('tok') }),
    );

    expect(response.status).toBe(204);
    const cleared = response.headers.getSetCookie().find((cookie) => cookie.startsWith('st_session='));
    expect(cleared).toMatch(/^st_session=;.*Max-Age=0/);
    expect(sessionsOf(dependencies)).toEqual([]);
    expect((await sessionState(ownerHeaders('tok'))).body).toEqual({ signedIn: false });
  });
});

describe('L2-052 and L2-079 administration APIs require a valid session', () => {
  it('Given no session cookie, when an administration API is called, then the proxy answers 401 with no data', async () => {
    const response = await proxy(new NextRequest(`${SITE_ORIGIN}/api/admin/studios`));

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('');
  });

  it('Given a session cookie, when an administration API is called, then the proxy passes it on to the handler', async () => {
    const response = await proxy(
      new NextRequest(`${SITE_ORIGIN}/api/admin/studios`, { headers: { cookie: 'st_session=abc' } }),
    );

    expect(response.status).not.toBe(401);
  });

  it('Given a valid session, when an administration handler checks it, then it gets the session', async () => {
    useFakeDependencies({ ownerSessions: [anOwnerSession('tok')] });

    const session = await requireOwnerSession(adminRequest(ownerHeaders('tok')));

    expect(session.ownerId).toBe('owner-1');
  });

  it('Given a forged session cookie, when an administration handler checks it, then it is refused with 401, an empty body and no write', async () => {
    const dependencies = useFakeDependencies({ ownerSessions: [anOwnerSession('tok', { lastSeenAt: hoursAgo(1) })] });
    const before = structuredClone(sessionsOf(dependencies));

    const response = await rejection(() => requireOwnerSession(adminRequest(ownerHeaders('forged'))));

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('');
    expect(sessionsOf(dependencies)).toEqual(before);
  });

  it('Given an expired session cookie, when an administration handler checks it, then it is refused with 401 and nothing is written', async () => {
    const dependencies = useFakeDependencies({ ownerSessions: [anOwnerSession('tok', { lastSeenAt: hoursAgo(13) })] });
    const before = structuredClone(sessionsOf(dependencies));

    const response = await rejection(() => requireOwnerSession(adminRequest(ownerHeaders('tok'))));

    expect(response.status).toBe(401);
    expect(sessionsOf(dependencies)).toEqual(before);
  });
});

describe('L2-080 anti-forgery protection on administration writes', () => {
  it('Given the matching anti-forgery token and the site origin, when an administration write is checked, then it is allowed', () => {
    expect(() => verifyCsrf(adminRequest(ownerHeaders('tok'), 'PUT'), anOwnerSession('tok'))).not.toThrow();
  });

  it.each([
    { case: 'without the anti-forgery token', headers: { cookie: 'st_session=tok', origin: SITE_ORIGIN } },
    { case: 'with a wrong anti-forgery token', headers: ownerHeaders('tok', 'csrf-wrong') },
    { case: 'from a different origin', headers: ownerHeaders('tok', 'csrf-tok', 'https://evil.example') },
    { case: 'without an origin', headers: { cookie: 'st_session=tok', 'x-csrf-token': 'csrf-tok' } },
  ])('Given a state-changing administration request $case, when checked, then it is refused with 403', async ({ headers }) => {
    const response = await rejection(() => verifyCsrf(adminRequest(headers, 'POST'), anOwnerSession('tok')));

    expect(response.status).toBe(403);
  });
});
