import { describe, expect, it } from 'vitest';
import { aStudio, anImage } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { listStudiosPage } from '@/tests/support/list-studios-page';

describe('L2-021 studio list', () => {
  it('Given three published studios, when the list is requested with no parameters, then they come ordered by review date descending', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'older', publishedAt: new Date('2026-05-01T12:00:00Z') }),
        aStudio({ slug: 'newest', publishedAt: new Date('2026-09-20T12:00:00Z') }),
        aStudio({ slug: 'middle', publishedAt: new Date('2026-07-14T12:00:00Z') }),
      ],
    });

    const { status, body } = await listStudiosPage();

    expect(status).toBe(200);
    expect(body.map((card: { slug: string }) => card.slug)).toEqual(['newest', 'middle', 'older']);
  });

  it('Given a published studio, when listed, then its card carries name, neighbourhood, all-in cost, overall score, stale flag, review date and a responsive thumbnail', async () => {
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
          publishedAt: new Date('2026-03-27T12:00:00Z'),
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
        reviewedAt: '2026-03-27T12:00:00.000Z',
        thumbnail: expect.objectContaining({
          alt: 'Cyc wall with softboxes',
          fallbackUrl: 'https://cdn.example/images/cover/960.jpg',
          sources: expect.any(Array),
        }),
      },
    ]);
  });
});

describe('ICD §12.2 E1 order and thumbnails', () => {
  it('Given studios with the same review time, when sorted by cost with equal costs, then ties fall to slug ascending (ICD C-18)', async () => {
    const sameTime = { publishedAt: new Date('2026-09-01T12:00:00Z') };
    useFakeDependencies({
      studios: [aStudio({ slug: 'bravo', ...sameTime }), aStudio({ slug: 'alpha', ...sameTime }), aStudio({ slug: 'charlie', ...sameTime })],
    });

    const { body } = await listStudiosPage('?sort=cost');

    expect(body.map((card: { slug: string }) => card.slug)).toEqual(['alpha', 'bravo', 'charlie']);
  });

  it('Given a published studio whose only gallery image has no alt text, when listed, then it is left out because it has no thumbnail', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'shown' }),
        aStudio({ slug: 'no-thumbnail', images: [anImage({ role: 'test_shot' }), anImage({ role: 'gallery', altText: '' })] }),
      ],
    });

    const { body } = await listStudiosPage();

    expect(body.map((card: { slug: string }) => card.slug)).toEqual(['shown']);
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
