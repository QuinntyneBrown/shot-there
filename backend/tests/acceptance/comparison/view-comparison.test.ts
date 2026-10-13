import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/compare/route';
import { aStudio, anImage } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

async function compare(query: string) {
  const response = await GET(new Request(`http://localhost/api/compare${query}`));
  return { status: response.status, body: await response.json() };
}

const slugsOf = (body: { studios: { slug: string }[] }) => body.studios.map((studio) => studio.slug);

describe('L2-032 shareable comparison URL', () => {
  it('Given studios a and b, when /api/compare?studios=b,a is requested, then both are compared in URL order', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'a' }), aStudio({ slug: 'b' })] });

    const { status, body } = await compare('?studios=b,a');

    expect(status).toBe(200);
    expect(slugsOf(body)).toEqual(['b', 'a']);
    expect(body.notFoundSlugs).toEqual([]);
    expect(body.truncated).toBe(false);
  });

  it('Given one unknown and two valid slugs, when compared, then the valid two are compared and the unknown one is reported', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'a' }), aStudio({ slug: 'b' })] });

    const { status, body } = await compare('?studios=a,ghost,b');

    expect(status).toBe(200);
    expect(slugsOf(body)).toEqual(['a', 'b']);
    expect(body.notFoundSlugs).toEqual(['ghost']);
  });

  it('Given a draft studio slug, when compared, then it is treated as not found', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'a' }), aStudio({ slug: 'hidden', status: 'draft' })] });

    const { status, body } = await compare('?studios=a,hidden');

    expect(status).toBe(200);
    expect(slugsOf(body)).toEqual(['a']);
    expect(body.notFoundSlugs).toEqual(['hidden']);
  });

  it('Given no studios parameter, when compared, then the response is 200 with no studios', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'a' })] });

    const { status, body } = await compare('');

    expect(status).toBe(200);
    expect(body).toEqual({ studios: [], notFoundSlugs: [], truncated: false });
  });

  it('Given more than four slugs including an unknown one, when compared, then unknown slugs are dropped first and only the first four valid are compared', async () => {
    useFakeDependencies({ studios: ['a', 'b', 'c', 'd', 'e'].map((slug) => aStudio({ slug })) });

    const { status, body } = await compare('?studios=a,ghost,b,c,d,e');

    expect(status).toBe(200);
    expect(slugsOf(body)).toEqual(['a', 'b', 'c', 'd']);
    expect(body.notFoundSlugs).toEqual(['ghost']);
    expect(body.truncated).toBe(true);
  });
});

describe('L2-031 and L2-043 comparison columns', () => {
  it('Given three studios, when compared, then each column carries the comparison rows with server-computed values', async () => {
    const testShot = anImage({ role: 'test_shot', altText: 'Standard headshot setup' });
    useFakeDependencies({
      today: '2026-10-13',
      studios: [
        aStudio({
          slug: 'loft',
          name: 'The Loft',
          hourlyRate: 60,
          minBookingHours: 2,
          fees: [
            { name: 'Cleaning', amount: 25, mandatory: true },
            { name: 'Strobe', amount: 40, mandatory: false },
          ],
          usableWidthM: 6.1,
          usableDepthM: 4.3,
          ceilingHeightM: 3.4,
          hasCycWall: true,
          cycWallCondition: 'scuffed',
          parking: 'street',
          loadIn: 'freight_elevator',
          gear: [
            { name: 'Strobe head', category: 'lights', quantity: 2, included: true, extraCost: null },
            { name: 'Paper roll', category: 'other', quantity: 1, included: false, extraCost: 15 },
          ],
          scoreValue: 4,
          scoreLight: 5,
          scoreSpace: 3,
          scoreGear: 4,
          scoreLogistics: 2,
          scoreCondition: 5,
          priceVerifiedAt: '2026-03-27',
          images: [testShot],
        }),
        aStudio({ slug: 'b' }),
        aStudio({ slug: 'c' }),
      ],
    });

    const { body } = await compare('?studios=loft,b,c');

    expect(body.studios).toHaveLength(3);
    expect(body.studios[0]).toMatchObject({
      slug: 'loft',
      name: 'The Loft',
      allInCost2h: 145,
      hourlyRate: 60,
      minBookingHours: 2,
      mandatoryFees: [{ name: 'Cleaning', amount: 25, mandatory: true }],
      usableWidthM: 6.1,
      usableDepthM: 4.3,
      ceilingHeightM: 3.4,
      naturalLight: { morning: 'medium', midday: 'strong', afternoon: 'medium', evening: 'low' },
      cycWall: { present: true, condition: 'scuffed' },
      includedGear: [{ name: 'Strobe head', category: 'lights', quantity: 2, extraCost: null }],
      parking: 'street',
      loadIn: 'freight_elevator',
      scores: { value: 4, light: 5, space: 3, gear: 4, logistics: 2, condition: 5 },
      overallScore: 3.8,
      priceVerifiedAt: '2026-03-27',
      priceStale: true,
    });
    expect(body.studios[0].testShots).toHaveLength(1);
    expect(body.studios[0].testShots[0].alt).toBe('Standard headshot setup');
  });

  it('Given compared studios with different all-in costs, when compared, then only the cheapest is marked lowest', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'dear', hourlyRate: 100, fees: [] }),
        aStudio({ slug: 'cheap', hourlyRate: 50, fees: [] }),
      ],
    });

    const { body } = await compare('?studios=dear,cheap');

    expect(body.studios.map((studio: { isLowestAllInCost: boolean }) => studio.isLowestAllInCost)).toEqual([false, true]);
  });

  it('Given two studios tied for the cheapest all-in cost, when compared, then both are marked lowest', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'x', hourlyRate: 50, fees: [] }),
        aStudio({ slug: 'y', hourlyRate: 50, fees: [] }),
        aStudio({ slug: 'z', hourlyRate: 80, fees: [] }),
      ],
    });

    const { body } = await compare('?studios=x,y,z');

    expect(body.studios.map((studio: { isLowestAllInCost: boolean }) => studio.isLowestAllInCost)).toEqual([true, true, false]);
  });
});
