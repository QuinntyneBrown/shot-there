import { describe, expect, it } from 'vitest';
import { aSpot } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getSpotPage } from '@/tests/support/get-spot-page';

describe('L2-017 spot practical conditions', () => {
  it('Given weekday crowds low, weekend high and no washrooms, when returned, then conditions carry both ratings and a null washroom', async () => {
    useFakeDependencies({
      spots: [
        aSpot({
          slug: 's',
          weekdayCrowds: 'low',
          weekendCrowds: 'high',
          parking: 'Green P on Carlaw',
          washrooms: null,
          changing: 'Car only',
        }),
      ],
    });

    const { body } = await getSpotPage('s');

    expect(body.conditions).toEqual({
      weekdayCrowds: 'low',
      weekendCrowds: 'high',
      parking: 'Green P on Carlaw',
      washrooms: null,
      changing: 'Car only',
    });
  });
});

describe('L2-018 and L2-043 spot permit status', () => {
  it('Given portrait needs no permit and commercial does, when returned, then each shoot type row carries whether it is required, in fixed order', async () => {
    useFakeDependencies({
      today: '2026-10-13',
      spots: [
        aSpot({
          slug: 's',
          permits: [
            { shootType: 'video', required: true },
            { shootType: 'commercial', required: true },
            { shootType: 'portrait', required: false },
            { shootType: 'weddingEngagement', required: false },
          ],
          permitSourceUrl: 'https://www.toronto.ca/parks/permits',
          permitVerifiedAt: '2026-10-03',
        }),
      ],
    });

    const { body } = await getSpotPage('s');

    expect(body.permits).toEqual({
      rows: [
        { shootType: 'portrait', required: false },
        { shootType: 'weddingEngagement', required: false },
        { shootType: 'commercial', required: true },
        { shootType: 'video', required: true },
      ],
      sourceUrl: 'https://www.toronto.ca/parks/permits',
      verifiedOn: '2026-10-03',
      permitStale: false,
    });
  });

  it('Given permit status verified 190 days ago, when returned, then permitStale is true', async () => {
    useFakeDependencies({ today: '2026-10-13', spots: [aSpot({ slug: 's', permitVerifiedAt: '2026-04-06' })] });

    const { body } = await getSpotPage('s');

    expect(body.permits.permitStale).toBe(true);
  });
});

describe('L2-019 spot best uses', () => {
  it('Given a spot tagged engagement and portrait, when returned, then exactly those uses are listed', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 's', bestUses: ['engagement', 'portrait'] })] });

    const { body } = await getSpotPage('s');

    expect(body.bestUses).toEqual(['engagement', 'portrait']);
  });
});

describe('L2-020 spot disclosure and video', () => {
  it('Given a comped spot shoot with a video, when returned, then disclosure and video ID are present', async () => {
    useFakeDependencies({
      spots: [aSpot({ slug: 's', disclosure: 'comped', disclosureProvider: 'Parks Toronto', videoId: 'dQw4w9WgXcQ' })],
    });

    const { body } = await getSpotPage('s');

    expect(body.disclosure).toEqual({ kind: 'comped', provider: 'Parks Toronto' });
    expect(body.videoId).toBe('dQw4w9WgXcQ');
  });

  it('Given a spot with no video ID, when returned, then videoId is null', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 's', videoId: null })] });

    const { body } = await getSpotPage('s');

    expect(body.videoId).toBeNull();
  });
});
