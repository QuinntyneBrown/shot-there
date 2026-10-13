import { beforeAll, describe, expect, it } from 'vitest';
import type { OwnerRecord } from '@/lib/auth/owner-record';
import { stubSiteOriginPerTest } from '@/tests/support/admin-session';
import { expectProblem } from '@/tests/support/expect-problem';
import type { InMemoryOwnerSessionRepository } from '@/tests/support/in-memory-owner-session-repository';
import { captureLogs } from '@/tests/support/captured-logs';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { OWNER_EMAIL, OWNER_PASSWORD, anOwner } from '@/tests/support/owner-account';
import { setCookie, signIn } from '@/tests/support/sign-in';

stubSiteOriginPerTest();

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
const median = (times: number[]) => [...times].sort((a, b) => a - b)[Math.floor(times.length / 2)];

/** Times each path once per round, interleaved, so load from other test files affects every path alike. */
async function medianMsInterleaved(paths: ((round: number) => Promise<Response>)[], rounds = 7) {
  const times = paths.map(() => [] as number[]);
  for (let round = 0; round < rounds; round++) {
    for (const [index, path] of paths.entries()) {
      const started = performance.now();
      await path(round);
      times[index].push(performance.now() - started);
    }
  }
  return times.map(median);
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

  it('Given a wrong password, when submitted, then the response is 401 with an empty body and no session is created', async () => {
    const dependencies = useOwnerAccount();

    const response = await signIn({ email: OWNER_EMAIL, password: 'wrong password' });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('');
    expect(setCookie(response, 'st_session')).toBeUndefined();
    expect(sessionsOf(dependencies).length).toBe(0);
  });

  it('Given an email that does not match the owner, when submitted, then the response is the same as for a wrong password', async () => {
    useOwnerAccount();

    const unknown = await signIn({ email: 'someone@example.com', password: OWNER_PASSWORD });
    const wrong = await signIn({ email: OWNER_EMAIL, password: 'wrong password' });

    expect(unknown.status).toBe(401);
    expect(await unknown.text()).toBe(await wrong.text());
  });

  it('Given the right password with surrounding spaces, when submitted, then it is trimmed and sign-in succeeds (ICD C-14)', async () => {
    useOwnerAccount();

    const response = await signIn({ email: OWNER_EMAIL, password: `  ${OWNER_PASSWORD}  ` });

    expect(response.status).toBe(204);
  });

  it('Given a password over 200 characters, when submitted, then the response is 400 out_of_range on password', async () => {
    useOwnerAccount();

    const problem = await expectProblem(await signIn({ email: OWNER_EMAIL, password: 'x'.repeat(201) }), 'validation-failed', 400);

    expect(problem.errors).toContainEqual({ field: 'password', code: 'out_of_range', message: expect.any(String) });
  });

  it.each([
    ['a foreign origin', 'https://evil.example'],
    ['no origin', null],
  ])('Given %s, when credentials are submitted, then the response is 403 csrf-rejected and no session is created (ICD S-3)', async (_label, origin) => {
    const dependencies = useOwnerAccount();

    const response = await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD }, '198.51.100.7', origin);

    await expectProblem(response, 'csrf-rejected', 403);
    expect(sessionsOf(dependencies)).toEqual([]);
  });

  it('Given a wrong password or unknown email, when submitted, then the response time is within 100 ms of the success path', async () => {
    useOwnerAccount();
    await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD });

    const [success, wrongPassword, unknownEmail] = await medianMsInterleaved([
      () => signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD }),
      (round) => signIn({ email: OWNER_EMAIL, password: 'wrong password' }, `198.51.100.${20 + round}`),
      (round) => signIn({ email: 'someone@example.com', password: 'whatever' }, `198.51.100.${40 + round}`),
    ]);

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
    expect(session).toMatch(/^st_session=[^;]{20,}; HttpOnly; Secure; SameSite=Lax; Path=\/api; Max-Age=604800$/);
    const csrf = setCookie(response, 'st_csrf') ?? '';
    expect(csrf).toMatch(/^st_csrf=[^;]{20,}; Secure; SameSite=Lax; Path=\/; Max-Age=604800$/);
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
