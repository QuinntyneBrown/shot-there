import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/public-routes/route';
import { aGuide, aSpot, aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

describe('L2-087 and L2-001 public routes for prerendering', () => {
  it('Given published and draft studios, spots and guides, when the public routes are requested, then only published slugs are returned per type', async () => {
    useFakeDependencies({
      studios: [aStudio({ slug: 'loft' }), aStudio({ slug: 'hidden-studio', status: 'draft' })],
      spots: [aSpot({ slug: 'high-park' }), aSpot({ slug: 'hidden-spot', status: 'draft' })],
      guides: [aGuide({ slug: 'headshots' }), aGuide({ slug: 'hidden-guide', status: 'draft' })],
    });

    const response = await GET(new Request('http://localhost/api/public-routes'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ studios: ['loft'], spots: ['high-park'], guides: ['headshots'] });
  });
});
