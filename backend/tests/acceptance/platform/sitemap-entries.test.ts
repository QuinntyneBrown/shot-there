import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/sitemap-entries/route';
import { aGuide, aSpot, aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

async function getSitemapEntries() {
  const response = await GET(new Request('http://localhost/api/sitemap-entries'));
  return { status: response.status, body: await response.json() };
}

const published = (iso: string) => new Date(`${iso}T15:00:00Z`);

describe('L2-077 sitemap entries', () => {
  it('Given three published studios, two published spots and one published guide, when the entries are requested, then every page, list page, the map and the guides index are listed with a last-modified date', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 's1', publishedAt: published('2026-08-01') }),
        aStudio({ slug: 's2', publishedAt: published('2026-09-15') }),
        aStudio({ slug: 's3', publishedAt: published('2026-07-01') }),
      ],
      spots: [aSpot({ slug: 'p1', publishedAt: published('2026-09-20') }), aSpot({ slug: 'p2', publishedAt: published('2026-06-01') })],
      guides: [aGuide({ slug: 'g1', publishedAt: published('2026-05-05') })],
    });

    const { status, body } = await getSitemapEntries();

    expect(status).toBe(200);
    expect(body).toEqual([
      { path: '/studios/s1', lastModified: '2026-08-01T15:00:00.000Z' },
      { path: '/studios/s2', lastModified: '2026-09-15T15:00:00.000Z' },
      { path: '/studios/s3', lastModified: '2026-07-01T15:00:00.000Z' },
      { path: '/spots/p1', lastModified: '2026-09-20T15:00:00.000Z' },
      { path: '/spots/p2', lastModified: '2026-06-01T15:00:00.000Z' },
      { path: '/guides/g1', lastModified: '2026-05-05T15:00:00.000Z' },
      { path: '/studios', lastModified: '2026-09-15T15:00:00.000Z' },
      { path: '/spots', lastModified: '2026-09-20T15:00:00.000Z' },
      { path: '/map', lastModified: '2026-09-20T15:00:00.000Z' },
      { path: '/guides', lastModified: '2026-05-05T15:00:00.000Z' },
    ]);
  });

  it('Given nothing published, when the entries are requested, then each list page carries the request time', async () => {
    const dependencies = useFakeDependencies();

    const { body } = await getSitemapEntries();

    const now = dependencies.clock.now().toISOString();
    expect(body).toEqual([
      { path: '/studios', lastModified: now },
      { path: '/spots', lastModified: now },
      { path: '/map', lastModified: now },
      { path: '/guides', lastModified: now },
    ]);
  });
});

describe('L2-001 drafts are absent from the sitemap', () => {
  it('Given a draft spot, studio and guide, when the entries are requested, then none of their URLs is listed', async () => {
    useFakeDependencies({
      studios: [aStudio({ slug: 'draft-studio', status: 'draft' })],
      spots: [aSpot({ slug: 'draft-spot', status: 'draft' })],
      guides: [aGuide({ slug: 'draft-guide', status: 'draft' })],
    });

    const { body } = await getSitemapEntries();

    const paths = body.map((entry: { path: string }) => entry.path);
    expect(paths).not.toContain('/spots/draft-spot');
    expect(paths).not.toContain('/studios/draft-studio');
    expect(paths).not.toContain('/guides/draft-guide');
  });
});
