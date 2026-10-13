import { getDependencies } from '@/lib/data/dependency-container';
import type { BestUse } from '@/lib/spots/best-use';
import type { ShootType } from '@/lib/spots/shoot-type';
import type { SpotListQuery } from '@/lib/spots/spot-list-query';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { SpotSummary } from '@/lib/spots/spot-summary';
import { toSpotSummary } from '@/lib/spots/to-spot-summary';

/** The shoot type whose permit status answers "is a permit needed" for each use case. */
const PERMIT_SHOOT_TYPE: Record<BestUse, ShootType> = {
  engagement: 'weddingEngagement',
  family: 'portrait',
  portrait: 'portrait',
  brand: 'commercial',
  video: 'video',
};

/** Published spots matching the query as list cards, most recently reviewed first, ties by slug. */
export async function listSpots(query: SpotListQuery): Promise<SpotSummary[]> {
  const { spots, clock } = getDependencies();
  const today = clock.today();
  return (await spots.listPublished())
    .filter((spot) => matchesSpotFilters(spot, query))
    .sort((a, b) => reviewTime(b) - reviewTime(a) || a.slug.localeCompare(b.slug))
    .flatMap((spot) => toSpotSummary(spot, today) ?? []);
}

/** The time of the latest publish (ICD OI-4). */
const reviewTime = (spot: SpotRecord) => spot.publishedAt?.getTime() ?? 0;

function matchesSpotFilters(spot: SpotRecord, query: SpotListQuery): boolean {
  if (query.types.length > 0 && (spot.type === null || !query.types.includes(spot.type))) return false;
  if (query.useCases.length > 0 && !query.useCases.some((use) => spot.bestUses.includes(use))) return false;
  if (query.permit === 'none_needed') {
    // With no use case selected, a spot must need no permit for a portrait (ICD OI-6).
    const shootTypes: ShootType[] = query.useCases.length > 0 ? query.useCases.map((use) => PERMIT_SHOOT_TYPE[use]) : ['portrait'];
    const needsNone = (shootType: ShootType) =>
      spot.permits.some((permit) => permit.shootType === shootType && !permit.required);
    if (!shootTypes.every(needsNone)) return false;
  }
  return true;
}
