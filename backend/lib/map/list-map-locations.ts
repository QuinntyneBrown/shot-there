import { getDependencies } from '@/lib/data/dependency-container';
import type { MapLocationDto } from '@/lib/map/map-location-dto';
import { summarizePermits } from '@/lib/spots/summarize-permits';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';

/** Every published studio and spot as a map marker. */
export async function listMapLocations(): Promise<MapLocationDto[]> {
  const { studios, spots } = getDependencies();
  const [publishedStudios, publishedSpots] = await Promise.all([studios.listPublished(), spots.listPublished()]);
  return [
    ...publishedStudios.map((studio): MapLocationDto => ({
      kind: 'studio',
      slug: studio.slug,
      name: studio.name,
      latitude: studio.latitude,
      longitude: studio.longitude,
      allInCost2h: allInCostOf(studio),
    })),
    ...publishedSpots.map((spot): MapLocationDto => ({
      kind: 'spot',
      slug: spot.slug,
      name: spot.name,
      latitude: spot.latitude,
      longitude: spot.longitude,
      permitSummary: summarizePermits(spot.permits),
    })),
  ];
}
