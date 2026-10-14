import { beforeAll, describe, expect, it } from 'vitest';
import { stubSiteOriginPerTest } from '@/tests/support/admin-session';
import { expectProblem } from '@/tests/support/expect-problem';
import type { OwnerRecord } from '@/lib/auth/owner-record';
import type { SignInAttemptRecord } from '@/lib/auth/sign-in-attempt-record';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { fixedClock } from '@/tests/support/fixed-clock';
import { OWNER_EMAIL, OWNER_PASSWORD, anOwner } from '@/tests/support/owner-account';
import { signIn } from '@/tests/support/sign-in';

stubSiteOriginPerTest();

const now = fixedClock('2026-10-13').now();
const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000);

function failures(count: number, attempt: (index: number) => Omit<SignInAttemptRecord, 'email'> & { email?: string }) {
  return Array.from({ length: count }, (_, index) => ({ email: OWNER_EMAIL, ...attempt(index) }));
}

let owner: OwnerRecord;
beforeAll(async () => {
  owner = await anOwner();
});

describe('L2-050 sign-in rate limiting', () => {
  it('Given five failed attempts from one client within 15 minutes, when a sixth arrives from that client, then the response is 429', async () => {
    useFakeDependencies({
      owners: [owner],
      signInAttempts: failures(5, () => ({ clientKey: '198.51.100.7', email: 'guess@example.com', attemptedAt: minutesAgo(5) })),
    });

    const response = await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD }, '198.51.100.7');

    await expectProblem(response, 'rate-limited', 429);
    expect(response.headers.get('retry-after')).toMatch(/^[1-9]\d*$/);
  });

  it('Given four failed attempts from one client, when a fifth try arrives, then it is still evaluated', async () => {
    useFakeDependencies({
      owners: [owner],
      signInAttempts: failures(4, () => ({ clientKey: '198.51.100.7', attemptedAt: minutesAgo(5) })),
    });

    const response = await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD }, '198.51.100.7');

    expect(response.status).toBe(204);
  });

  it('Given ten failed attempts against the owner account from different clients, when an eleventh arrives from a new client, then the response is 429', async () => {
    useFakeDependencies({
      owners: [owner],
      signInAttempts: failures(10, (index) => ({ clientKey: `203.0.113.${index}`, attemptedAt: minutesAgo(10) })),
    });

    const response = await signIn({ email: 'OWNER@shotthere.ca', password: OWNER_PASSWORD }, '192.0.2.99');

    expect(response.status).toBe(429);
  });

  it('Given the lockout window has passed, when the owner signs in with correct credentials, then sign-in succeeds', async () => {
    useFakeDependencies({
      owners: [owner],
      signInAttempts: failures(10, () => ({ clientKey: '198.51.100.7', attemptedAt: minutesAgo(16) })),
    });

    const response = await signIn({ email: OWNER_EMAIL, password: OWNER_PASSWORD }, '198.51.100.7');

    expect(response.status).toBe(204);
  });

  it('Given repeated wrong passwords from one client, when the sixth arrives, then it is refused with 429', async () => {
    useFakeDependencies({ owners: [owner] });

    const statuses: number[] = [];
    for (let attempt = 0; attempt < 6; attempt++) {
      statuses.push((await signIn({ email: OWNER_EMAIL, password: 'wrong password' }, '198.51.100.30')).status);
    }

    expect(statuses).toEqual([401, 401, 401, 401, 401, 429]);
  });
});
