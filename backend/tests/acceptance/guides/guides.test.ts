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
  it('Given two published guides and one draft guide, when the index is requested, then the two published guides are listed by title with their summary', async () => {
    useFakeDependencies({
      guides: [
        aGuide({ slug: 'natural-light', title: 'Best natural light', introduction: 'Big north windows.\n\nMore detail.' }),
        aGuide({ slug: 'draft-guide', status: 'draft' }),
        aGuide({ slug: 'under-120', title: 'Best for under $120', introduction: 'Cheap and good.' }),
      ],
    });

    const { status, body } = await listGuides();

    expect(status).toBe(200);
    expect(body).toEqual([
      { slug: 'under-120', title: 'Best for under $120', summary: 'Cheap and good.' },
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
          introduction: 'Our picks.',
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
    expect(body).toMatchObject({ slug: 'under-120', title: 'Best studios under $120 for 2 hours', introduction: 'Our picks.' });
    expect(entrySlugs(body)).toEqual(['a', 'b', 'c']);
    expect(body.entries[0]).toMatchObject({
      position: 0,
      kind: 'studio',
      location: { slug: 'a', name: 'Studio A', neighbourhood: 'Leslieville' },
      editorNote: 'First',
    });
    expect(body.entries[0].dataPoints).toContainEqual({ label: 'allInCost2h', value: 100 });
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

  it('Given a guide with a spot entry, when it is requested, then the spot entry carries its permit summary', async () => {
    useFakeDependencies({
      spots: [aSpot({ id: 'sp', slug: 'park', name: 'High Park' })],
      guides: [aGuide({ slug: 'g', entries: [{ kind: 'spot', locationId: 'sp', note: 'Go early', position: 0 }] })],
    });

    const { body } = await getGuide('g');

    expect(body.entries[0]).toMatchObject({ kind: 'spot', location: { slug: 'park', name: 'High Park' }, editorNote: 'Go early' });
    expect(body.entries[0].dataPoints).toEqual([{ label: 'permitSummary', value: 'someRequired' }]);
  });

  it('Given a draft guide or an unknown slug, when it is requested, then the API responds 404', async () => {
    useFakeDependencies({ guides: [aGuide({ slug: 'draft', status: 'draft' })] });

    expect((await getGuide('draft')).status).toBe(404);
    expect((await getGuide('nope')).status).toBe(404);
  });
});
