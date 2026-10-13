import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/map/locations/route';
import { aSpot, aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

async function getMapLocations() {
  const response = await GET(new Request('http://localhost/api/map/locations'));
  return { status: response.status, body: await response.json() };
}

describe('L2-027 map markers for all locations', () => {
  it('Given two published studios and three published spots, when the map data is requested, then five locations are returned with their kind', async () => {
    useFakeDependencies({
      studios: [aStudio({ slug: 's1' }), aStudio({ slug: 's2' })],
      spots: [aSpot({ slug: 'p1' }), aSpot({ slug: 'p2' }), aSpot({ slug: 'p3' })],
    });

    const { status, body } = await getMapLocations();

    expect(status).toBe(200);
    expect(body.map((location: { kind: string; slug: string }) => `${location.kind}:${location.slug}`).sort()).toEqual([
      'spot:p1',
      'spot:p2',
      'spot:p3',
      'studio:s1',
      'studio:s2',
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
          permits: [
            { shootType: 'portrait', required: false },
            { shootType: 'commercial', required: true },
          ],
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
    });
    expect(body).toContainEqual({
      kind: 'spot',
      slug: 'park',
      name: 'High Park',
      latitude: 43.6465,
      longitude: -79.4637,
      permitSummary: 'someRequired',
    });
  });
});
