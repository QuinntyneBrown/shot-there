import { describe, expect, it } from 'vitest';
import { aStudio, anImage } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { listStudiosPage } from '@/tests/support/list-studios-page';

describe('L2-021 studio list', () => {
  it('Given three published studios, when the list is requested with no parameters, then they come ordered by review date descending', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'older', reviewedAt: '2026-05-01' }),
        aStudio({ slug: 'newest', reviewedAt: '2026-09-20' }),
        aStudio({ slug: 'middle', reviewedAt: '2026-07-14' }),
      ],
    });

    const { status, body } = await listStudiosPage();

    expect(status).toBe(200);
    expect(body.map((card: { slug: string }) => card.slug)).toEqual(['newest', 'middle', 'older']);
  });

  it('Given a published studio, when listed, then its card carries name, neighbourhood, all-in cost, overall score, stale flag, review date and a 480 px thumbnail', async () => {
    useFakeDependencies({
      today: '2026-10-13',
      studios: [
        aStudio({
          slug: 'the-junction-loft',
          name: 'The Junction Loft',
          neighbourhood: 'The Junction',
          hourlyRate: 60,
          minBookingHours: 2,
          fees: [{ name: 'Cleaning', amount: 25, mandatory: true }],
          scoreValue: 4,
          scoreLight: 5,
          scoreSpace: 3,
          scoreGear: 4,
          scoreLogistics: 2,
          scoreCondition: 5,
          priceVerifiedAt: '2026-03-27',
          reviewedAt: '2026-03-27',
          images: [anImage({ id: 'cover', role: 'gallery', altText: 'Cyc wall with softboxes' })],
        }),
      ],
    });

    const { body } = await listStudiosPage();

    expect(body).toEqual([
      {
        slug: 'the-junction-loft',
        name: 'The Junction Loft',
        neighbourhood: 'The Junction',
        allInCost2h: 145,
        overallScore: 3.8,
        priceStale: true,
        reviewedAt: '2026-03-27',
        thumbnail: { url: 'https://cdn.example/images/cover/480.jpg', alt: 'Cyc wall with softboxes' },
      },
    ]);
  });
});

describe('L2-001 drafts never listed', () => {
  it('Given one published and one draft studio, when the list is requested, then only the published studio is returned', async () => {
    useFakeDependencies({
      studios: [aStudio({ slug: 'live' }), aStudio({ slug: 'hidden', status: 'draft' })],
    });

    const { body } = await listStudiosPage();

    expect(body.map((card: { slug: string }) => card.slug)).toEqual(['live']);
  });
});
