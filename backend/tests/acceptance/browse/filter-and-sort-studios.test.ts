import { describe, expect, it } from 'vitest';
import { aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { listStudiosPage } from '@/tests/support/list-studios-page';

const slugsOf = (body: { slug: string }[]) => body.map((card) => card.slug);
const costing = (allInCost: number) => ({ hourlyRate: allInCost / 2, minBookingHours: 2, fees: [] });
const scoredAs = (value: number, light: number, space: number, gear: number, logistics: number, condition: number) => ({
  scoreValue: value,
  scoreLight: light,
  scoreSpace: space,
  scoreGear: gear,
  scoreLogistics: logistics,
  scoreCondition: condition,
});

describe('L2-022 studio filters', () => {
  it('Given all-in costs $90, $120 and $200, when the range is $100 to $150, then only the $120 studio is listed', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'cheap', ...costing(90) }),
        aStudio({ slug: 'mid', ...costing(120) }),
        aStudio({ slug: 'dear', ...costing(200) }),
      ],
    });

    const { body } = await listStudiosPage('?costMin=100&costMax=150');

    expect(slugsOf(body)).toEqual(['mid']);
  });

  it('Given studios in Leslieville, Junction and Liberty Village, when Leslieville and Junction are selected, then both are listed', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'east', neighbourhood: 'Leslieville', reviewedAt: '2026-09-01' }),
        aStudio({ slug: 'west', neighbourhood: 'Junction', reviewedAt: '2026-08-01' }),
        aStudio({ slug: 'south', neighbourhood: 'Liberty Village', reviewedAt: '2026-07-01' }),
      ],
    });

    const { body } = await listStudiosPage('?hood=Leslieville&hood=Junction');

    expect(slugsOf(body)).toEqual(['east', 'west']);
  });

  it('Given cyc wall and on-site parking are selected, when listed, then only studios with both are returned', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'both', hasCycWall: true, parking: 'onSite' }),
        aStudio({ slug: 'cyc-only', hasCycWall: true, parking: 'street' }),
        aStudio({ slug: 'parking-only', hasCycWall: false, parking: 'onSite' }),
      ],
    });

    const { body } = await listStudiosPage('?cyc=yes&parking=on-site');

    expect(slugsOf(body)).toEqual(['both']);
  });

  it('Given natural light, minimum space and included gear filters, when listed, then each narrows the list', async () => {
    const includedLights = [{ name: 'Strobe', category: 'lights' as const, quantity: 2, included: true, extraCost: null }];
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 'match',
          lightMorning: 'none',
          lightMidday: 'medium',
          lightAfternoon: 'low',
          lightEvening: 'none',
          usableWidthM: 6,
          usableDepthM: 5,
          gear: includedLights,
        }),
        aStudio({
          slug: 'dark',
          lightMorning: 'low',
          lightMidday: 'low',
          lightAfternoon: 'low',
          lightEvening: 'none',
          usableWidthM: 6,
          usableDepthM: 5,
          gear: includedLights,
        }),
        aStudio({ slug: 'small', lightMidday: 'strong', usableWidthM: 3, usableDepthM: 3, gear: includedLights }),
        aStudio({
          slug: 'paid-lights',
          lightMidday: 'strong',
          usableWidthM: 6,
          usableDepthM: 5,
          gear: [{ name: 'Strobe', category: 'lights', quantity: 2, included: false, extraCost: 30 }],
        }),
      ],
    });

    const { body } = await listStudiosPage('?light=yes&space=25&gear=lights');

    expect(slugsOf(body)).toEqual(['match']);
  });

  it('Given a gear multi-select, when listed, then a studio offering any selected gear matches', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'backdrops', backdrops: 'Grey seamless', gear: [], reviewedAt: '2026-09-01' }),
        aStudio({
          slug: 'stands',
          backdrops: null,
          gear: [{ name: 'C-stand', category: 'stands', quantity: 4, included: true, extraCost: null }],
          reviewedAt: '2026-08-01',
        }),
        aStudio({ slug: 'bare', backdrops: null, gear: [] }),
      ],
    });

    const { body } = await listStudiosPage('?gear=backdrops&gear=stands');

    expect(slugsOf(body)).toEqual(['backdrops', 'stands']);
  });

  it('Given a filter combination that matches nothing, when listed, then the list is empty', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'a', hasCycWall: false })] });

    const { status, body } = await listStudiosPage('?cyc=yes');

    expect(status).toBe(200);
    expect(body).toEqual([]);
  });
});

describe('L2-023 and L2-046 studio sort', () => {
  it('Given all-in costs $200, $90 and $120, when sorted by cost, then they come $90, $120, $200', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'dear', ...costing(200) }),
        aStudio({ slug: 'cheap', ...costing(90) }),
        aStudio({ slug: 'mid', ...costing(120) }),
      ],
    });

    const { body } = await listStudiosPage('?sort=cost');

    expect(slugsOf(body)).toEqual(['cheap', 'mid', 'dear']);
  });

  it('Given overall scores 3.8, 4.5 and 4.5, when sorted by score, then both 4.5s come first with ties by review date descending', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'three-eight', ...scoredAs(4, 5, 3, 4, 2, 5), reviewedAt: '2026-10-01' }),
        aStudio({ slug: 'older-four-five', ...scoredAs(4, 5, 5, 5, 4, 4), reviewedAt: '2026-06-01' }),
        aStudio({ slug: 'newer-four-five', ...scoredAs(4, 5, 4, 4, 5, 5), reviewedAt: '2026-08-01' }),
      ],
    });

    const { body } = await listStudiosPage('?sort=score');

    expect(slugsOf(body)).toEqual(['newer-four-five', 'older-four-five', 'three-eight']);
    expect(body.map((card: { overallScore: number }) => card.overallScore)).toEqual([4.5, 4.5, 3.8]);
  });
});

describe('L2-025 lenient query parsing', () => {
  it('Given unknown filter values, when listed, then they are ignored and the remaining valid filters apply without error', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'cyc', hasCycWall: true, parking: 'street' }),
        aStudio({ slug: 'plain', hasCycWall: false, parking: 'street' }),
      ],
    });

    const { status, body } = await listStudiosPage('?cyc=yes&parking=helipad&gear=fog-machine&sort=random&hood=Atlantis');

    expect(status).toBe(200);
    expect(slugsOf(body)).toEqual(['cyc']);
  });

  it('Given a cost minimum greater than the maximum, when listed, then the range is treated as unset', async () => {
    useFakeDependencies({
      studios: [
        aStudio({ slug: 'cheap', ...costing(90), reviewedAt: '2026-09-01' }),
        aStudio({ slug: 'dear', ...costing(200), reviewedAt: '2026-08-01' }),
      ],
    });

    const { body } = await listStudiosPage('?costMin=300&costMax=100');

    expect(slugsOf(body)).toEqual(['cheap', 'dear']);
  });

  it('Given a non-numeric cost, when listed, then that bound is ignored', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 'cheap', ...costing(90) })] });

    const { body } = await listStudiosPage('?costMin=abc');

    expect(slugsOf(body)).toEqual(['cheap']);
  });
});
