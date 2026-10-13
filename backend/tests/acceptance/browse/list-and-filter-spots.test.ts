import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/spots/route';
import { aSpot, anImage } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

async function listSpotsPage(query = '') {
  const response = await GET(new Request(`http://localhost/api/spots${query}`));
  return { status: response.status, body: await response.json() };
}

const slugsOf = (body: { slug: string }[]) => body.map((card) => card.slug);
const permitsWhere = (portraitRequired: boolean) => [
  { shootType: 'portrait' as const, required: portraitRequired },
  { shootType: 'weddingEngagement' as const, required: false },
  { shootType: 'commercial' as const, required: true },
  { shootType: 'video' as const, required: true },
];

describe('L2-024 outdoor spot list', () => {
  it('Given published and draft spots, when listed, then only published spots are returned as cards, most recently reviewed first', async () => {
    useFakeDependencies({
      today: '2026-10-13',
      spots: [
        aSpot({
          slug: 'riverdale',
          name: 'Riverdale Park East',
          neighbourhood: 'Riverdale',
          type: 'park',
          bestUses: ['family', 'engagement'],
          permits: permitsWhere(false),
          permitVerifiedAt: '2026-03-01',
          publishedAt: new Date('2026-09-01T12:00:00Z'),
          images: [
            anImage({ id: 'cover', role: 'sample_shot', altText: 'Skyline from the hill', focalLengthMm: 35, angleNote: 'Hilltop' }),
          ],
        }),
        aSpot({ slug: 'harbourfront', name: 'Harbourfront', type: 'waterfront', publishedAt: new Date('2026-08-01T12:00:00Z') }),
        aSpot({ slug: 'hidden', name: 'Draft Spot', status: 'draft' }),
      ],
    });

    const { status, body } = await listSpotsPage();

    expect(status).toBe(200);
    expect(slugsOf(body)).toEqual(['riverdale', 'harbourfront']);
    expect(body[0]).toEqual({
      slug: 'riverdale',
      name: 'Riverdale Park East',
      neighbourhood: 'Riverdale',
      type: 'park',
      bestUses: ['engagement', 'family'],
      permits: { portrait: 'not_required', weddingEngagement: 'not_required', commercial: 'required', video: 'required' },
      permitStale: true,
      thumbnail: expect.objectContaining({ alt: 'Skyline from the hill', fallbackUrl: 'https://cdn.example/images/cover/960.jpg' }),
    });
  });

  it('Given spots of type park and waterfront, when filtered by waterfront, then only the waterfront spot is listed', async () => {
    useFakeDependencies({
      spots: [aSpot({ slug: 'park', type: 'park' }), aSpot({ slug: 'water', type: 'waterfront' })],
    });

    const { body } = await listSpotsPage('?type=waterfront');

    expect(slugsOf(body)).toEqual(['water']);
  });

  it('Given use case family and permit "none_needed", when listed, then only family spots whose portrait permit is not required are listed', async () => {
    useFakeDependencies({
      spots: [
        aSpot({ slug: 'family-free', bestUses: ['family'], permits: permitsWhere(false) }),
        aSpot({ slug: 'family-permit', bestUses: ['family'], permits: permitsWhere(true) }),
        aSpot({ slug: 'brand-free', bestUses: ['brand'], permits: permitsWhere(false) }),
      ],
    });

    const { body } = await listSpotsPage('?use=family&permit=none_needed');

    expect(slugsOf(body)).toEqual(['family-free']);
  });

  it('Given permit none_needed and no use case, when listed, then spots needing no portrait permit are listed (ICD OI-6)', async () => {
    useFakeDependencies({
      spots: [
        aSpot({ slug: 'portrait-free', permits: permitsWhere(false) }),
        aSpot({ slug: 'portrait-permit', permits: permitsWhere(true) }),
      ],
    });

    const { body } = await listSpotsPage('?permit=none_needed');

    expect(slugsOf(body)).toEqual(['portrait-free']);
  });

  it('Given spots reviewed at the same time, when listed, then ties fall to slug ascending (ICD C-18)', async () => {
    const sameTime = { publishedAt: new Date('2026-09-01T12:00:00Z') };
    useFakeDependencies({ spots: [aSpot({ slug: 'bravo', ...sameTime }), aSpot({ slug: 'alpha', ...sameTime })] });

    const { body } = await listSpotsPage();

    expect(slugsOf(body)).toEqual(['alpha', 'bravo']);
  });

  it('Given unknown filter values, when listed, then they are ignored without error', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 'park', type: 'park' })] });

    const { status, body } = await listSpotsPage('?type=volcano&use=skydiving&permit=maybe');

    expect(status).toBe(200);
    expect(slugsOf(body)).toEqual(['park']);
  });

  it('Given a filter that matches nothing, when listed, then the list is empty', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 'park', type: 'park' })] });

    const { body } = await listSpotsPage('?type=architecture');

    expect(body).toEqual([]);
  });
});
