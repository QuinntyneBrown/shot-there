import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/map/locations/route';
import { aSpot, aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

async function getMapLocations() {
  const response = await GET(new Request('http://localhost/api/map/locations'));
  return { status: response.status, body: await response.json() };
}

describe('L2-027 map markers for all locations', () => {
  it('Given two published studios and three published spots, when the map data is requested, then studios then spots are returned, each by slug', async () => {
    useFakeDependencies({
      studios: [aStudio({ slug: 's2' }), aStudio({ slug: 's1' })],
      spots: [aSpot({ slug: 'p3' }), aSpot({ slug: 'p1' }), aSpot({ slug: 'p2' })],
    });

    const { status, body } = await getMapLocations();

    expect(status).toBe(200);
    expect(body.map((location: { kind: string; slug: string }) => `${location.kind}:${location.slug}`)).toEqual([
      'studio:s1',
      'studio:s2',
      'spot:p1',
      'spot:p2',
      'spot:p3',
    ]);
  });

  it('Given a draft studio and a draft spot, when the map data is requested, then neither is returned', async () => {
    useFakeDependencies({
      studios: [aStudio({ slug: 'live' }), aStudio({ slug: 'draft-studio', status: 'draft' })],
      spots: [aSpot({ slug: 'draft-spot', status: 'draft' })],
    });

    const { body } = await getMapLocations();

    expect(body.map((location: { slug: string }) => location.slug)).toEqual(['live']);
  });
});

describe('L2-028 marker popup facts', () => {
  it('Given a studio and a spot, when the map data is requested, then each carries name, coordinates and its key fact', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'loft', name: 'The Loft', latitude: 43.65, longitude: -79.45, hourlyRate: 60, minBookingHours: 2, fees: [] }),
      ],
      spots: [
        aSpot({
          slug: 'park',
          name: 'High Park',
          latitude: 43.6465,
          longitude: -79.4637,
          permitVerifiedAt: '2026-10-01',
        }),
      ],
    });

    const { body } = await getMapLocations();

    expect(body).toContainEqual({
      kind: 'studio',
      slug: 'loft',
      name: 'The Loft',
      latitude: 43.65,
      longitude: -79.45,
      allInCost2h: 120,
      priceStale: false,
    });
    expect(body).toContainEqual({
      kind: 'spot',
      slug: 'park',
      name: 'High Park',
      latitude: 43.6465,
      longitude: -79.4637,
      permits: { portrait: 'not_required', weddingEngagement: 'not_required', commercial: 'required', video: 'required' },
      permitStale: false,
    });
  });

  it('Given a published studio without coordinates, when the map data is requested, then it is left out (ICD OI-3)', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'placed' }), aStudio({ slug: 'unplaced', latitude: null, longitude: null })] });

    const { body } = await getMapLocations();

    expect(body.map((location: { slug: string }) => location.slug)).toEqual(['placed']);
  });
});
