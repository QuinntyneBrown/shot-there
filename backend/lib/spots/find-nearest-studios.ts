import { getDependencies } from '@/lib/data/dependency-container';
import { haversineKm } from '@/lib/shared/haversine-km';
import { isStale } from '@/lib/shared/is-stale';
import type { RainBackupStudioDto } from '@/lib/spots/rain-backup-studio-dto';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';

const RAIN_BACKUP_LIMIT = 3;

/** Up to three published studios that have coordinates, nearest the point first. */
export async function findNearestStudios(latitude: number, longitude: number): Promise<RainBackupStudioDto[]> {
  const { studios, clock } = getDependencies();
  const today = clock.today();
  return (await studios.listPublished())
    .flatMap((studio) => {
      const allInCost2h = allInCostOf(studio);
      if (studio.latitude === null || studio.longitude === null || allInCost2h === null) return [];
      return [
        {
          slug: studio.slug,
          name: studio.name,
          distance: haversineKm(latitude, longitude, studio.latitude, studio.longitude),
          allInCost2h,
          priceStale: isStale(studio.priceVerifiedAt, today),
        },
      ];
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, RAIN_BACKUP_LIMIT)
    .map(({ distance, ...studio }) => ({ ...studio, distanceKm: Math.round(distance * 10) / 10 }));
}
