import { getDependencies } from '@/lib/data/dependency-container';
import { imagesWithRole } from '@/lib/images/to-image-dto';
import { toThumbnailDto } from '@/lib/images/to-thumbnail-dto';
import { isStale } from '@/lib/shared/is-stale';
import type { BestUse } from '@/lib/spots/best-use';
import type { ShootType } from '@/lib/spots/shoot-type';
import type { SpotListQuery } from '@/lib/spots/spot-list-query';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { SpotSummaryDto } from '@/lib/spots/spot-summary-dto';
import { summarizePermits } from '@/lib/spots/summarize-permits';

/** The shoot type whose permit status answers "is a permit needed" for each use case. */
const PERMIT_SHOOT_TYPE: Record<BestUse, ShootType> = {
  engagement: 'weddingEngagement',
  family: 'portrait',
  portrait: 'portrait',
  brand: 'commercial',
  video: 'video',
};

/** Published spots matching the query as list cards, by name. */
export async function listSpots(query: SpotListQuery): Promise<SpotSummaryDto[]> {
  const { spots, clock } = getDependencies();
  const today = clock.today();
  return (await spots.listPublished())
    .filter((spot) => matchesSpotFilters(spot, query))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((spot) => ({
      slug: spot.slug,
      name: spot.name,
      neighbourhood: spot.neighbourhood,
      type: spot.type,
      bestUses: spot.bestUses,
      permitSummary: summarizePermits(spot.permits),
      permitStale: isStale(spot.permitVerifiedAt, today),
      thumbnail: toThumbnailDto(imagesWithRole(spot.images, 'sample_shot')[0]),
    }));
}

function matchesSpotFilters(spot: SpotRecord, query: SpotListQuery): boolean {
  if (query.types.length > 0 && (spot.type === null || !query.types.includes(spot.type))) return false;
  if (query.useCases.length > 0 && !query.useCases.some((use) => spot.bestUses.includes(use))) return false;
  if (query.permit === 'none_needed') {
    const shootTypes = query.useCases.length > 0 ? query.useCases.map((use) => PERMIT_SHOOT_TYPE[use]) : undefined;
    const relevant = spot.permits.filter((permit) => !shootTypes || shootTypes.includes(permit.shootType));
    if (relevant.length === 0 || relevant.some((permit) => permit.required)) return false;
  }
  return true;
}
