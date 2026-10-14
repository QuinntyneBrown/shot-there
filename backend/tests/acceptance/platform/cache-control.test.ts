import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { GET as getDashboard } from '@/app/api/admin/dashboard/route';
import { GET as getSession } from '@/app/api/auth/session/route';
import { GET as health } from '@/app/api/health/route';
import { GET as getPublicRoutes } from '@/app/api/public-routes/route';
import { GET as getSitemapEntries } from '@/app/api/sitemap-entries/route';
import { GET as getSlugRedirect } from '@/app/api/slug-redirects/[type]/[slug]/route';
import { GET as getStudio } from '@/app/api/studios/[slug]/route';
import { GET as listStudios } from '@/app/api/studios/route';
import { POST as subscribe } from '@/app/api/subscribers/route';
import { proxy } from '@/proxy';
import { adminRequest, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

stubSiteOriginPerTest();

const PUBLIC = 'public, max-age=60';
const get = (path: string) => new Request(`http://localhost${path}`);

describe('ICD §10 caching', () => {
  it.each([
    ['the studio list', () => listStudios(get('/api/studios'))],
    ['a published studio', () => getStudio(get('/api/studios/loft'), { params: Promise.resolve({ slug: 'loft' }) })],
    ['an unknown studio (404)', () => getStudio(get('/api/studios/nope'), { params: Promise.resolve({ slug: 'nope' }) })],
    ['the public routes', () => getPublicRoutes(get('/api/public-routes'))],
    ['the sitemap entries', () => getSitemapEntries(get('/api/sitemap-entries'))],
    [
      'a missing slug redirect (404)',
      () => getSlugRedirect(get('/api/slug-redirects/studio/gone'), { params: Promise.resolve({ type: 'studio', slug: 'gone' }) }),
    ],
  ])('Given %s, when fetched, then the CDN may cache it for 60 seconds', async (_label, fetch) => {
    useFakeDependencies({ studios: [aStudio({ slug: 'loft' })] });

    const response = await fetch();

    expect(response.headers.get('cache-control')).toBe(PUBLIC);
  });

  it.each([
    ['the health check', () => health(get('/api/health'))],
    ['the session state', () => getSession(get('/api/auth/session'))],
    ['the admin dashboard', () => getDashboard(adminRequest('/api/admin/dashboard'))],
    [
      'an email signup',
      () =>
        subscribe(
          new Request('http://localhost/api/subscribers', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.77' },
            body: JSON.stringify({ email: 'jane@example.com', sourcePath: '/' }),
          }),
        ),
    ],
  ])('Given %s, when answered, then it is never stored', async (_label, fetch) => {
    useSignedInOwner();

    const response = await fetch();

    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('Given an admin request without a session, when the proxy answers 401, then it is never stored', async () => {
    const response = await proxy(new NextRequest('https://shotthere.ca/api/admin/studios'));

    expect(response.headers.get('cache-control')).toBe('no-store');
  });
});
