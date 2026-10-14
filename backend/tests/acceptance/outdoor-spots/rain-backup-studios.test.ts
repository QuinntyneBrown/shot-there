import { describe, expect, it } from 'vitest';
import { aSpot, aStudio } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getSpotPage } from '@/tests/support/get-spot-page';

// Spot at Trinity Bellwoods; studios placed due east at known distances.
const SPOT = { latitude: 43.6475, longitude: -79.4136 };
const kmEast = (km: number) => ({
  latitude: SPOT.latitude,
  longitude: SPOT.longitude + (km / (6371 * Math.cos((SPOT.latitude * Math.PI) / 180))) * (180 / Math.PI),
});

describe('L2-037 nearest studios as rain backup', () => {
  it('Given five published studios, when the spot is returned, then the three nearest come ordered by distance with km to one decimal and all-in cost', async () => {
    useFakeDependencies({
      spots: [aSpot({ slug: 's', ...SPOT })],
      studios: [
        aStudio({ slug: 'far', ...kmEast(9.2) }),
        aStudio({ slug: 'near', name: 'Near Studio', ...kmEast(1.4), hourlyRate: 60, minBookingHours: 2, fees: [] }),
        aStudio({ slug: 'farthest', ...kmEast(15) }),
        aStudio({ slug: 'mid', ...kmEast(3.06) }),
        aStudio({ slug: 'second', ...kmEast(2.5) }),
      ],
    });

    const { body } = await getSpotPage('s');

    expect(body.rainBackup.map((studio: { slug: string }) => studio.slug)).toEqual(['near', 'second', 'mid']);
    expect(body.rainBackup[0]).toEqual({ slug: 'near', name: 'Near Studio', distanceKm: 1.4, allInCost2h: 120, priceStale: false });
    expect(body.rainBackup[2].distanceKm).toBe(3.1);
  });

  it('Given one published studio, when the spot is returned, then one studio is listed', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 's', ...SPOT })], studios: [aStudio({ slug: 'only', ...kmEast(4) })] });

    const { body } = await getSpotPage('s');

    expect(body.rainBackup).toHaveLength(1);
  });

  it('Given the nearest studio is a draft, when the spot is returned, then it is excluded and the next nearest published studio is shown', async () => {
    useFakeDependencies({
      spots: [aSpot({ slug: 's', ...SPOT })],
      studios: [
        aStudio({ slug: 'draft', status: 'draft', ...kmEast(0.5) }),
        aStudio({ slug: 'published', ...kmEast(2) }),
      ],
    });

    const { body } = await getSpotPage('s');

    expect(body.rainBackup.map((studio: { slug: string }) => studio.slug)).toEqual(['published']);
  });
});

describe('L2-038 rain backup empty state', () => {
  it('Given no published studios, when the spot is returned, then rainBackup is an empty list', async () => {
    useFakeDependencies({ spots: [aSpot({ slug: 's', ...SPOT })], studios: [] });

    const { body } = await getSpotPage('s');

    expect(body.rainBackup).toEqual([]);
  });
});
