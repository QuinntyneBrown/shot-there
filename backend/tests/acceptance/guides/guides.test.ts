import { describe, expect, it } from 'vitest';
import { GET as getGuideRoute } from '@/app/api/guides/[slug]/route';
import { GET as listGuidesRoute } from '@/app/api/guides/route';
import { aGuide, aSpot, aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

async function listGuides() {
  const response = await listGuidesRoute(new Request('http://localhost/api/guides'));
  return { status: response.status, body: await response.json() };
}

async function getGuide(slug: string) {
  const response = await getGuideRoute(new Request(`http://localhost/api/guides/${slug}`), {
    params: Promise.resolve({ slug }),
  });
  return { status: response.status, body: response.status === 200 ? await response.json() : null };
}

const entrySlugs = (body: { entries: { location: { slug: string } }[] }) =>
  body.entries.map((entry) => entry.location.slug);

describe('L2-035 guide index', () => {
  it('Given two published guides and one draft guide, when the index is requested, then the two published guides are listed most recently published first with their stored summary (ICD E7, OI-9)', async () => {
    useFakeDependencies({
      guides: [
        aGuide({
          slug: 'natural-light',
          title: 'Best natural light',
          summary: 'Big north windows.',
          publishedAt: new Date('2026-08-01T12:00:00Z'),
        }),
        aGuide({ slug: 'draft-guide', status: 'draft' }),
        aGuide({ slug: 'under-120', title: 'Best for under $120', summary: null, publishedAt: new Date('2026-09-01T12:00:00Z') }),
      ],
    });

    const { status, body } = await listGuides();

    expect(status).toBe(200);
    expect(body).toEqual([
      { slug: 'under-120', title: 'Best for under $120', summary: null },
      { slug: 'natural-light', title: 'Best natural light', summary: 'Big north windows.' },
    ]);
  });
});

describe('L2-034 guide page', () => {
  it('Given a guide with three studio entries, when it is requested, then the entries come in configured order with the card, current all-in cost and note', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ id: 'st-a', slug: 'a', name: 'Studio A', hourlyRate: 50, minBookingHours: 2, fees: [] }),
        aStudio({ id: 'st-b', slug: 'b', name: 'Studio B', hourlyRate: 55, minBookingHours: 2, fees: [] }),
        aStudio({ id: 'st-c', slug: 'c', name: 'Studio C', hourlyRate: 59, minBookingHours: 2, fees: [] }),
      ],
      guides: [
        aGuide({
          slug: 'under-120',
          title: 'Best studios under $120 for 2 hours',
          summary: 'Three studios under $120.',
          introduction: 'Our picks.',
          dataPoints: ['overall_score', 'all_in_cost_2h'],
          entries: [
            { kind: 'studio', locationId: 'st-c', note: 'Third', position: 2 },
            { kind: 'studio', locationId: 'st-a', note: 'First', position: 0 },
            { kind: 'studio', locationId: 'st-b', note: 'Second', position: 1 },
          ],
        }),
      ],
    });

    const { status, body } = await getGuide('under-120');

    expect(status).toBe(200);
    expect(body).toMatchObject({
      slug: 'under-120',
      title: 'Best studios under $120 for 2 hours',
      summary: 'Three studios under $120.',
      introduction: 'Our picks.',
    });
    expect(entrySlugs(body)).toEqual(['a', 'b', 'c']);
    expect(body.entries[0]).toEqual({
      kind: 'studio',
      location: expect.objectContaining({ slug: 'a', name: 'Studio A', neighbourhood: 'Leslieville', allInCost2h: 100 }),
      dataPoints: [
        { key: 'overall_score', value: 3.7 },
        { key: 'all_in_cost_2h', value: 100 },
      ],
      editorNote: 'First',
    });
    expect(body.entries[0].location.thumbnail).toHaveProperty('fallbackUrl');
  });

  it('Given a guide entry whose studio has become draft, when the guide is requested, then that entry is omitted and the rest are shown', async () => {
    useFakeDependencies({
      studios: [aStudio({ id: 'live', slug: 'live' }), aStudio({ id: 'gone', slug: 'gone', status: 'draft' })],
      guides: [
        aGuide({
          slug: 'g',
          entries: [
            { kind: 'studio', locationId: 'gone', note: '', position: 0 },
            { kind: 'studio', locationId: 'live', note: '', position: 1 },
          ],
        }),
      ],
    });

    const { body } = await getGuide('g');

    expect(entrySlugs(body)).toEqual(['live']);
  });

  it('Given a guide with a spot entry, when it is requested, then the spot entry carries its spot card and no data points', async () => {
    useFakeDependencies({
      spots: [aSpot({ id: 'sp', slug: 'park', name: 'High Park' })],
      guides: [aGuide({ slug: 'g', entries: [{ kind: 'spot', locationId: 'sp', note: 'Go early', position: 0 }] })],
    });

    const { body } = await getGuide('g');

    expect(body.entries[0]).toEqual({
      kind: 'spot',
      location: expect.objectContaining({ slug: 'park', name: 'High Park', permits: expect.any(Object) }),
      dataPoints: [],
      editorNote: 'Go early',
    });
  });

  it('Given an entry without a note and a guide without an introduction, when it is requested, then both are null', async () => {
    useFakeDependencies({
      studios: [aStudio({ id: 'st', slug: 'st' })],
      guides: [aGuide({ slug: 'g', introduction: null, entries: [{ kind: 'studio', locationId: 'st', note: null, position: 0 }] })],
    });

    const { body } = await getGuide('g');

    expect(body.introduction).toBeNull();
    expect(body.entries[0].editorNote).toBeNull();
  });

  it('Given a draft guide or an unknown slug, when it is requested, then the API responds 404', async () => {
    useFakeDependencies({ guides: [aGuide({ slug: 'draft', status: 'draft' })] });

    expect((await getGuide('draft')).status).toBe(404);
    expect((await getGuide('nope')).status).toBe(404);
  });
});
