import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import { GET } from '@/app/api/slug-redirects/[type]/[slug]/route';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

const requestRedirect = (type: string, slug: string) =>
  GET(new Request(`http://localhost/api/slug-redirects/${type}/${slug}`), { params: Promise.resolve({ type, slug }) });

async function findRedirect(type: string, slug: string) {
  const response = await requestRedirect(type, slug);
  return { status: response.status, body: await response.json() };
}

describe('L2-075 renamed items redirect from old slugs', () => {
  it('Given a studio renamed from old-loft to the-junction-loft, when the old slug is looked up, then the new location is returned', async () => {
    useFakeDependencies({ slugRedirects: [{ type: 'studio', fromSlug: 'old-loft', toSlug: 'the-junction-loft' }] });

    const { status, body } = await findRedirect('studio', 'old-loft');

    expect(status).toBe(200);
    expect(body).toEqual({
      type: 'studio',
      fromSlug: 'old-loft',
      toSlug: 'the-junction-loft',
      location: '/studios/the-junction-loft',
    });
  });

  it.each([
    { type: 'spot', location: '/spots/new-park' },
    { type: 'guide', location: '/guides/new-park' },
  ])('Given a renamed $type, when the old slug is looked up, then the location uses its fixed path', async ({ type, location }) => {
    useFakeDependencies({ slugRedirects: [{ type: type as 'spot' | 'guide', fromSlug: 'old-park', toSlug: 'new-park' }] });

    const { body } = await findRedirect(type, 'old-park');

    expect(body.location).toBe(location);
  });

  it('Given no redirect for the slug, when it is looked up, then the API responds 404', async () => {
    useFakeDependencies({ slugRedirects: [{ type: 'spot', fromSlug: 'old-loft', toSlug: 'x' }] });

    expect((await findRedirect('studio', 'old-loft')).status).toBe(404);
  });

  it.each([
    { type: 'venue', slug: 'old-loft' },
    { type: 'studio', slug: 'Old_Loft' },
    { type: 'studio', slug: 'a'.repeat(101) },
  ])('Given a malformed type or slug ($type/$slug), when looked up, then the API responds 400 (ICD E11)', async ({ type, slug }) => {
    useFakeDependencies();

    await expectProblem(await requestRedirect(type, slug), 'validation-failed', 400);
  });
});
