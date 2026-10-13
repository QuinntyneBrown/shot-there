import { describe, expect, it } from 'vitest';
import { GET as getMapLocations } from '@/app/api/map/locations/route';
import { GET as getPublicRoutes } from '@/app/api/public-routes/route';
import { GET as getSitemapEntries } from '@/app/api/sitemap-entries/route';
import { GET as listStudios } from '@/app/api/studios/route';
import { POST } from '@/app/api/subscribers/route';
import type { InMemorySubscriberRepository } from '@/tests/support/in-memory-subscriber-repository';
import { aStudio } from '@/tests/support/builders';
import { captureLogs } from '@/tests/support/captured-logs';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

let clientNumber = 0;
/** Each test signs up from its own client address so the rate limit does not leak between tests. */
const newClientIp = () => `203.0.113.${++clientNumber}`;

function signUp(body: unknown, clientIp = newClientIp()) {
  return POST(
    new Request('http://localhost/api/subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `${clientIp}, 10.0.0.1` },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
}

function subscribersOf(dependencies: ReturnType<typeof useFakeDependencies>) {
  return (dependencies.subscribers as InMemorySubscriberRepository).rows;
}

describe('L2-040 signup validation and storage', () => {
  it('Given a valid new email, when submitted, then it is stored lowercase with the subscription time and source path', async () => {
    const dependencies = useFakeDependencies({ today: '2026-10-13' });

    const response = await signUp({ email: '  Jane.Doe@Example.com ', sourcePath: '/studios/the-junction-loft' });

    expect(response.status).toBe(200);
    expect(subscribersOf(dependencies)).toEqual([
      {
        email: 'jane.doe@example.com',
        subscribedAt: dependencies.clock.now(),
        sourcePath: '/studios/the-junction-loft',
      },
    ]);
  });

  it('Given an email longer than 254 characters, when submitted, then the response is 400 with a validation message for email', async () => {
    useFakeDependencies();

    const response = await signUp({ email: `${'a'.repeat(250)}@example.com`, sourcePath: '/' });

    expect(response.status).toBe(400);
    const problem = await response.json();
    expect(problem.status).toBe(400);
    expect(problem.errors).toEqual([{ field: 'email', message: expect.any(String) }]);
  });

  it('Given a syntactically invalid email, when submitted, then the response is 400 and nothing is stored', async () => {
    const dependencies = useFakeDependencies();

    const response = await signUp({ email: 'not-an-email', sourcePath: '/' });

    expect(response.status).toBe(400);
    expect(subscribersOf(dependencies)).toEqual([]);
  });

  it('Given a filled honeypot field, when submitted, then the response is 200 and nothing is stored', async () => {
    const dependencies = useFakeDependencies();

    const response = await signUp({ email: 'bot@example.com', sourcePath: '/', website: 'http://spam.example' });

    expect(response.status).toBe(200);
    expect(subscribersOf(dependencies)).toEqual([]);
  });

  it('Given a client that sent six signups within one minute, when the seventh arrives, then the response is 429 while another client is unaffected', async () => {
    useFakeDependencies();
    const clientIp = newClientIp();

    const statuses = [];
    for (let attempt = 1; attempt <= 7; attempt++) {
      statuses.push((await signUp({ email: `fan${attempt}@example.com`, sourcePath: '/' }, clientIp)).status);
    }

    expect(statuses).toEqual([200, 200, 200, 200, 200, 200, 429]);
    expect((await signUp({ email: 'other@example.com', sourcePath: '/' })).status).toBe(200);
  });
});

describe('L2-039 repeat signups', () => {
  it('Given an already subscribed email, when submitted again, then the response is identical and the original record is unchanged', async () => {
    const dependencies = useFakeDependencies();
    const first = await signUp({ email: 'jane@example.com', sourcePath: '/' });

    const repeat = await signUp({ email: 'JANE@example.com', sourcePath: '/guides' });

    expect(repeat.status).toBe(first.status);
    expect(await repeat.json()).toEqual(await first.json());
    expect(subscribersOf(dependencies)).toEqual([expect.objectContaining({ email: 'jane@example.com', sourcePath: '/' })]);
  });
});

describe('L2-078 strict input', () => {
  it('Given an unknown field, when submitted, then the response is 400 naming the field', async () => {
    useFakeDependencies();

    const response = await signUp({ email: 'jane@example.com', sourcePath: '/', isAdmin: true });

    expect(response.status).toBe(400);
    expect((await response.json()).errors).toContainEqual({ field: 'isAdmin', message: expect.any(String) });
  });

  it('Given a body that is not JSON, when submitted, then the response is 400', async () => {
    useFakeDependencies();

    expect((await signUp('{not json')).status).toBe(400);
  });

  it('Given a streamed body larger than 1 MB with no content length, when submitted, then the response is 413', async () => {
    useFakeDependencies();

    const response = await signUp({ email: 'jane@example.com', sourcePath: `/${'x'.repeat(1024 * 1024)}` });

    expect(response.status).toBe(413);
  });
});

describe('L2-085 signup logging', () => {
  it('Given an email signup, when logged, then the email appears only masked to its first character and domain', async () => {
    useFakeDependencies();
    const logs = captureLogs();

    await signUp({ email: 'jane@example.com', sourcePath: '/' });

    const output = JSON.stringify(logs);
    expect(output).not.toContain('jane@example.com');
    expect(output).toContain('j***@example.com');
  });
});

describe('L2-079 subscriber data is never public', () => {
  it('Given a subscriber, when the public read endpoints are requested, then none of them contains subscriber data', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'loft' })] });
    await signUp({ email: 'private.person@example.com', sourcePath: '/' });

    const bodies = await Promise.all(
      [
        listStudios(new Request('http://localhost/api/studios')),
        getMapLocations(new Request('http://localhost/api/map/locations')),
        getPublicRoutes(new Request('http://localhost/api/public-routes')),
        getSitemapEntries(new Request('http://localhost/api/sitemap-entries')),
      ].map(async (response) => (await response).text()),
    );

    for (const body of bodies) expect(body).not.toContain('private.person');
  });
});
