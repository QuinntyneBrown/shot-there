import { beforeAll, describe, expect, it } from 'vitest';
import type { OwnerRecord } from '@/lib/auth/owner-record';
import type { InMemoryOwnerSessionRepository } from '@/tests/support/in-memory-owner-session-repository';
import { captureLogs } from '@/tests/support/captured-logs';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { OWNER_EMAIL, OWNER_PASSWORD, anOwner } from '@/tests/support/owner-account';
import { setCookie, signIn } from '@/tests/support/sign-in';

function sessionsOf(dependencies: ReturnType<typeof useFakeDependencies>) {
  return (dependencies.ownerSessions as InMemoryOwnerSessionRepository).rows;
}

let owner: OwnerRecord;
beforeAll(async () => {
  owner = await anOwner();
});

function useOwnerAccount() {
  return useFakeDependencies({ owners: [owner] });
}

/** Median response time over several runs, so one slow run on a busy machine does not decide the result. */
async function medianMs(action: () => Promise<Response>, runs = 5) {
  const times: number[] = [];
  for (let run = 0; run < runs; run++) {
    const started = performance.now();
    await action();
    times.push(performance.now() - started);
  }
  return times.sort((a, b) => a - b)[Math.floor(runs / 2)];
}

describe('L2-049 owner sign-in', () => {
  it('Given the correct email and password, when submitted, then a session is created and the response is 204 with no session identifier in the body', async () => {
    const dependencies = useOwnerAccount();

    const response = await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD });

    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
    expect(sessionsOf(dependencies).length).toBe(1);
  });

  it('Given the email in a different case, when submitted with the right password, then sign-in succeeds', async () => {
    useOwnerAccount();

    const response = await signIn({ email: 'Owner@ShotThere.ca', password: OWNER_PASSWORD });

    expect(response.status).toBe(204);
  });

  it('Given a wrong password, when submitted, then the response is 401 "Email or password is incorrect" and no session is created', async () => {
    const dependencies = useOwnerAccount();

    const response = await signIn({ email: OWNER_EMAIL, password: 'wrong password' });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ status: 401, message: 'Email or password is incorrect' });
    expect(setCookie(response, 'st_session')).toBeUndefined();
    expect(sessionsOf(dependencies).length).toBe(0);
  });

  it('Given an email that does not match the owner, when submitted, then the same message as a wrong password is returned', async () => {
    useOwnerAccount();

    const unknown = await signIn({ email: 'someone@example.com', password: OWNER_PASSWORD });
    const wrong = await signIn({ email: OWNER_EMAIL, password: 'wrong password' });

    expect(unknown.status).toBe(401);
    expect(await unknown.json()).toEqual(await wrong.json());
  });

  it('Given a wrong password or unknown email, when submitted, then the response time is within 100 ms of the success path', async () => {
    useOwnerAccount();
    await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD });

    const success = await medianMs(() => signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD }));
    const wrongPassword = await medianMs(() => signIn({ email: OWNER_EMAIL, password: 'wrong password' }, '198.51.100.20'));
    const unknownEmail = await medianMs(() => signIn({ email: 'someone@example.com', password: 'whatever' }, '198.51.100.21'));

    expect(Math.abs(wrongPassword - success)).toBeLessThan(100);
    expect(Math.abs(unknownEmail - success)).toBeLessThan(100);
  }, 20_000);

  it('Given a malformed email or empty password, when submitted, then the response is 400 naming the field', async () => {
    useOwnerAccount();

    const response = await signIn({ email: 'not-an-email', password: '' });

    expect(response.status).toBe(400);
    const fields = (await response.json()).errors.map((error: { field: string }) => error.field);
    expect(fields).toEqual(expect.arrayContaining(['email', 'password']));
  });
});

describe('L2-051 session cookie', () => {
  it('Given a successful sign-in, when the response is inspected, then the session cookie is HttpOnly, Secure and SameSite=Lax and a readable CSRF cookie is set', async () => {
    useOwnerAccount();

    const response = await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD });

    const session = setCookie(response, 'st_session') ?? '';
    expect(session).toMatch(/^st_session=[^;]{20,}/);
    expect(session).toContain('HttpOnly');
    expect(session).toContain('Secure');
    expect(session).toContain('SameSite=Lax');
    expect(session).toContain('Path=/');
    const csrf = setCookie(response, 'st_csrf') ?? '';
    expect(csrf).toMatch(/^st_csrf=[^;]{20,}/);
    expect(csrf).toContain('Secure');
    expect(csrf).not.toContain('HttpOnly');
  });

  it('Given a successful sign-in, when stored, then only a hash of the session token is kept', async () => {
    const dependencies = useOwnerAccount();

    const response = await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD });

    const token = /^st_session=([^;]+)/.exec(setCookie(response, 'st_session') ?? '')?.[1] ?? '';
    expect(JSON.stringify(dependencies.ownerSessions)).not.toContain(token);
  });
});

describe('L2-085 sign-in logging', () => {
  it('Given a sign-in request, when logged, then the password is absent from every log line', async () => {
    useOwnerAccount();
    const logs = captureLogs();

    await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD });
    await signIn({ email: OWNER_EMAIL, password: 'wrong password' });

    expect(logs.length).toBeGreaterThan(0);
    expect(JSON.stringify(logs)).not.toContain(OWNER_PASSWORD);
    expect(JSON.stringify(logs)).not.toContain('wrong password');
  });
});
