import { describe, expect, it } from 'vitest';
import { aSpot, anImage } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getSpotPage } from '@/tests/support/get-spot-page';

describe('L2-001 only published spots are reachable', () => {
  it('Given a draft spot, when its page is requested, then the API responds 404', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 'draft-park', status: 'draft' })] });

    expect((await getSpotPage('draft-park')).status).toBe(404);
  });
});

describe('L2-014 spot location and directions', () => {
  it('Given a published spot with coordinates and directions, when returned, then name, neighbourhood, coordinates and directions are present', async () => {
    useFakeDependencies({
      spots: [
        aSpot({
          slug: 'riverdale-park-east',
          name: 'Riverdale Park East',
          neighbourhood: 'Riverdale',
          latitude: 43.6703,
          longitude: -79.3542,
          directions: 'Take Line 2 to Broadview and walk south.',
        }),
      ],
    });

    const { status, body } = await getSpotPage('riverdale-park-east');

    expect(status).toBe(200);
    expect(body).toMatchObject({
      slug: 'riverdale-park-east',
      name: 'Riverdale Park East',
      neighbourhood: 'Riverdale',
      latitude: 43.6703,
      longitude: -79.3542,
      directions: 'Take Line 2 to Broadview and walk south.',
    });
  });
});

describe('L2-015 spot best light by time and season', () => {
  it('Given light ratings and notes stored out of order, when returned, then times and seasons come in fixed order with their notes', async () => {
    useFakeDependencies({
      spots: [
        aSpot({
          slug: 's',
          lightByTime: [
            { timeOfDay: 'blueHour', rating: 'low', note: null },
            { timeOfDay: 'goldenHour', rating: 'strong', note: 'west-facing, sun drops behind the skyline' },
            { timeOfDay: 'midday', rating: 'none', note: null },
            { timeOfDay: 'morning', rating: 'medium', note: null },
            { timeOfDay: 'afternoon', rating: 'medium', note: null },
          ],
          lightBySeason: [
            { season: 'winter', note: 'closed path after snowfall' },
            { season: 'spring', note: 'blossoms in May' },
            { season: 'autumn', note: null },
            { season: 'summer', note: null },
          ],
        }),
      ],
    });

    const { body } = await getSpotPage('s');

    expect(body.lightByTime.map((row: { timeOfDay: string }) => row.timeOfDay)).toEqual([
      'morning',
      'midday',
      'afternoon',
      'goldenHour',
      'blueHour',
    ]);
    expect(body.lightByTime[3]).toEqual({
      timeOfDay: 'goldenHour',
      rating: 'strong',
      note: 'west-facing, sun drops behind the skyline',
    });
    expect(body.lightBySeason).toEqual([
      { season: 'spring', note: 'blossoms in May' },
      { season: 'summer', note: null },
      { season: 'autumn', note: null },
      { season: 'winter', note: 'closed path after snowfall' },
    ]);
  });
});

describe('L2-016 spot sample shots', () => {
  it('Given sample shots with focal length and angle notes, when returned, then each is a responsive image with its lens and angle note in order', async () => {
    useFakeDependencies({
      spots: [
        aSpot({
          slug: 's',
          images: [
            anImage({ role: 'sampleShot', sortOrder: 1, altText: 'Second', focalLengthMm: 35, angleNote: 'From the bridge' }),
            anImage({
              id: 'first',
              role: 'sampleShot',
              sortOrder: 0,
              altText: 'Couple on the steps',
              focalLengthMm: 85,
              angleNote: 'shoot north from the lower steps',
            }),
          ],
        }),
      ],
    });

    const { body } = await getSpotPage('s');

    expect(body.sampleShots).toHaveLength(2);
    expect(body.sampleShots[0]).toMatchObject({
      alt: 'Couple on the steps',
      focalLengthMm: 85,
      angleNote: 'shoot north from the lower steps',
      fallbackUrl: 'https://cdn.example/images/first/960.jpg',
    });
    expect(body.sampleShots[0].sources[0].format).toBe('avif');
    expect(body.sampleShots[1].alt).toBe('Second');
  });
});
