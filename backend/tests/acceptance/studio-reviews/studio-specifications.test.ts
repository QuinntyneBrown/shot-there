import { describe, expect, it } from 'vitest';
import { aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getStudioPage } from '@/tests/support/get-studio-page';

describe('L2-006 measured specifications', () => {
  it('Given a studio with measured specs, when returned, then space, ceiling, window, light, power and backdrops are in metres and ratings', async () => {
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 's',
          usableWidthM: 6.1,
          usableDepthM: 4.3,
          ceilingHeightM: 3.4,
          windowDirection: 'North',
          lightMorning: 'low',
          lightMidday: 'strong',
          lightAfternoon: 'medium',
          lightEvening: 'none',
          outletCount: 8,
          outletType: '15A household',
          has20ACircuits: true,
          backdrops: 'White seamless',
        }),
      ],
    });

    const { body } = await getStudioPage('s');

    expect(body.specifications).toMatchObject({
      usableWidthM: 6.1,
      usableDepthM: 4.3,
      ceilingHeightM: 3.4,
      windowDirection: 'North',
      naturalLight: { morning: 'low', midday: 'strong', afternoon: 'medium', evening: 'none' },
      power: { outletCount: 8, outletType: '15A household', has20ACircuits: true },
      backdrops: 'White seamless',
    });
  });

  it('Given a studio with no cyc wall, when returned, then the cyc wall is absent with no condition', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 's', hasCycWall: false, cycWallCondition: 'stale note' })] });

    const { body } = await getStudioPage('s');

    expect(body.specifications.cycWall).toEqual({ present: false, condition: null });
  });

  it('Given a studio with a scuffed cyc wall, when returned, then the cyc wall is present with condition "scuffed"', async () => {
    useFakeDependencies({ studios: [aStudio({ slug: 's', hasCycWall: true, cycWallCondition: 'scuffed' })] });

    const { body } = await getStudioPage('s');

    expect(body.specifications.cycWall).toEqual({ present: true, condition: 'scuffed' });
  });
});

describe('L2-007 included gear and extras', () => {
  it('Given two included lights and one paid backdrop at $15, when returned, then gear is split into included and extras', async () => {
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 's',
          gear: [
            { name: 'Profoto D2', category: 'lights', quantity: 2, included: true, extraCost: null },
            { name: 'Coloured backdrop', category: 'other', quantity: 1, included: false, extraCost: 15 },
          ],
        }),
      ],
    });

    const { body } = await getStudioPage('s');

    expect(body.gear).toEqual({
      included: [{ name: 'Profoto D2', category: 'lights', quantity: 2, extraCost: null }],
      extras: [{ name: 'Coloured backdrop', category: 'other', quantity: 1, extraCost: 15 }],
    });
  });

  it('Given a studio with no paid extras, when returned, then extras is an empty list', async () => {
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 's',
          gear: [{ name: 'C-stand', category: 'stands', quantity: 3, included: true, extraCost: null }],
        }),
      ],
    });

    const { body } = await getStudioPage('s');

    expect(body.gear.extras).toEqual([]);
    expect(body.gear.included[0].quantity).toBe(3);
  });
});

describe('L2-008 logistics', () => {
  it('Given load-in by freight elevator with a note and no changing area, when returned, then logistics carry each row', async () => {
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 's',
          loadIn: 'freightElevator',
          loadInNote: 'small, 1.2 m wide',
          parking: 'street',
          parkingNote: 'Metered on Queen',
          transit: '501 streetcar',
          washroom: 'Shared',
          changingArea: null,
          clientSeating: 'Sofa',
          noise: 'Street noise by day',
        }),
      ],
    });

    const { body } = await getStudioPage('s');

    expect(body.logistics).toEqual({
      loadIn: 'freightElevator',
      loadInNote: 'small, 1.2 m wide',
      parking: 'street',
      parkingNote: 'Metered on Queen',
      transit: '501 streetcar',
      washroom: 'Shared',
      changingArea: null,
      clientSeating: 'Sofa',
      noise: 'Street noise by day',
    });
  });
});
