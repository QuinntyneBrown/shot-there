import { getDependencies } from '@/lib/data/dependency-container';
import { haversineKm } from '@/lib/shared/haversine-km';
import type { RainBackupStudioDto } from '@/lib/spots/rain-backup-studio-dto';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';

const RAIN_BACKUP_LIMIT = 3;

/** Up to three published studios nearest the point, nearest first. */
export async function findNearestStudios(latitude: number, longitude: number): Promise<RainBackupStudioDto[]> {
  const published = await getDependencies().studios.listPublished();
  return published
    .filter((studio) => studio.latitude !== null && studio.longitude !== null)
    .map((studio) => ({
      studio,
      distance: haversineKm(latitude, longitude, studio.latitude as number, studio.longitude as number),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, RAIN_BACKUP_LIMIT)
    .map(({ studio, distance }) => ({
      slug: studio.slug,
      name: studio.name,
      distanceKm: Math.round(distance * 10) / 10,
      allInCost2h: allInCostOf(studio),
    }));
}
