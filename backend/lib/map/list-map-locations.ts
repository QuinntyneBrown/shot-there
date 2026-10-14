import { getDependencies } from '@/lib/data/dependency-container';
import type { MapLocation } from '@/lib/map/map-location';
import type { SpotMapLocation } from '@/lib/map/spot-map-location';
import type { StudioMapLocation } from '@/lib/map/studio-map-location';
import { isStale } from '@/lib/shared/is-stale';
import { toPermitsByShootType } from '@/lib/spots/to-permits-by-shoot-type';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';

/** Every published studio and spot that has coordinates: studios first, then spots, each by slug (ICD E5). */
export async function listMapLocations(): Promise<MapLocation[]> {
  const { studios, spots, clock } = getDependencies();
  const today = clock.today();
  const [publishedStudios, publishedSpots] = await Promise.all([studios.listPublished(), spots.listPublished()]);
  const bySlug = (a: { slug: string }, b: { slug: string }) => a.slug.localeCompare(b.slug);

  const studioMarkers = publishedStudios.flatMap((studio): StudioMapLocation[] => {
    const allInCost2h = allInCostOf(studio);
    if (studio.latitude === null || studio.longitude === null || allInCost2h === null) return [];
    const { slug, name, latitude, longitude } = studio;
    return [{ kind: 'studio', slug, name, latitude, longitude, allInCost2h, priceStale: isStale(studio.priceVerifiedAt, today) }];
  });
  const spotMarkers = publishedSpots.flatMap((spot): SpotMapLocation[] => {
    const permits = toPermitsByShootType(spot.permits);
    if (spot.latitude === null || spot.longitude === null || !permits) return [];
    const { slug, name, latitude, longitude } = spot;
    return [{ kind: 'spot', slug, name, latitude, longitude, permits, permitStale: isStale(spot.permitVerifiedAt, today) }];
  });
  return [...studioMarkers.sort(bySlug), ...spotMarkers.sort(bySlug)];
}
