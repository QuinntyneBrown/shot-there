import { describe, expect, it } from 'vitest';
import { aStudio, anImage } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getStudioPage } from '@/tests/support/get-studio-page';

describe('ICD §13.2 StudioDetailDto', () => {
  it('Given a published studio, when its page is requested, then the body carries exactly the ICD properties', async () => {
    useFakeDependencies({
      today: '2026-10-13',
      studios: [
        aStudio({
          slug: 'loft',
          name: 'The Loft',
          disclosure: 'comped',
          disclosureProvider: 'The Loft',
          ogImageUrl: 'https://cdn.example/images/og/abc.jpg',
          publishedAt: new Date('2026-09-02T12:00:00Z'),
          images: [anImage({ role: 'test_shot', caption: 'Key light' }), anImage({ role: 'gallery' })],
        }),
      ],
    });

    const { body } = await getStudioPage('loft');

    expect(Object.keys(body).sort()).toEqual(
      [
        'slug',
        'basics',
        'pricing',
        'specifications',
        'gear',
        'logistics',
        'testShots',
        'gallery',
        'verdict',
        'disclosure',
        'episode',
        'featuredIn',
        'reviewedAt',
        'ogImageUrl',
      ].sort(),
    );
    expect(body.basics).toEqual({
      name: 'The Loft',
      neighbourhood: 'Leslieville',
      addressOrCrossStreets: 'Queen St E & Logan Ave',
      bookingUrl: 'https://studio.example/book',
    });
    expect(body.verdict).toEqual({
      whoItsFor: 'Portrait photographers who want soft north light.',
      whoShouldSkip: 'Crews over six people.',
      scores: { value: 4, light: 4, space: 3, gear: 3, logistics: 4, condition: 4 },
      overallScore: 3.7,
    });
    expect(body.disclosure).toEqual({ kind: 'comped', provider: 'The Loft' });
    expect(body.reviewedAt).toBe('2026-09-02T12:00:00.000Z');
    expect(body.ogImageUrl).toBe('https://cdn.example/images/og/abc.jpg');
  });
});
