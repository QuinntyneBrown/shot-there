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
      byShootType: { portrait: 'not_required', weddingEngagement: 'not_required', commercial: 'required', video: 'required' },
      sourceUrl: 'https://www.toronto.ca/parks/permits',
      verifiedAt: '2026-10-03',
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
    useFakeDependencies({ spots: [aSpot({ slug: 's', bestUses: ['portrait', 'engagement'] })] });

    const { body } = await getSpotPage('s');

    expect(body.bestUses).toEqual(['engagement', 'portrait']);
  });
});

describe('L2-020 spot disclosure and video', () => {
  it('Given a comped spot shoot with a titled video, when returned, then disclosure and the episode are present', async () => {
    useFakeDependencies({
      spots: [
        aSpot({
          slug: 's',
          disclosure: 'comped',
          disclosureProvider: 'Parks Toronto',
          videoId: 'dQw4w9WgXcQ',
          episodeTitle: 'Golden hour at Riverdale',
        }),
      ],
    });

    const { body } = await getSpotPage('s');

    expect(body.disclosure).toEqual({ kind: 'comped', provider: 'Parks Toronto' });
    expect(body.episode).toEqual({ videoId: 'dQw4w9WgXcQ', title: 'Golden hour at Riverdale' });
  });

  it('Given a video without an episode title, when returned, then the title falls back to the spot name (ICD A8)', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 's', name: 'Riverdale Park East', videoId: 'dQw4w9WgXcQ' })] });

    const { body } = await getSpotPage('s');

    expect(body.episode).toEqual({ videoId: 'dQw4w9WgXcQ', title: 'Riverdale Park East' });
  });

  it('Given a spot with no video ID, when returned, then the episode is null', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 's', videoId: null })] });

    const { body } = await getSpotPage('s');

    expect(body.episode).toBeNull();
    expect(body).not.toHaveProperty('videoId');
  });
});
