import { imagesWithRole, toImageDto } from '@/lib/images/to-image-dto';
import { isStale } from '@/lib/shared/is-stale';
import { inBestUseOrder } from '@/lib/spots/in-best-use-order';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { SpotSummary } from '@/lib/spots/spot-summary';
import { toPermitsByShootType } from '@/lib/spots/to-permits-by-shoot-type';

/** The published spot's card, or null when it cannot be shown as one, e.g. it has no sample shot with alt text. */
export function toSpotSummary(spot: SpotRecord, today: string): SpotSummary | null {
  const [thumbnail] = imagesWithRole(spot.images, 'sample_shot');
  const permits = toPermitsByShootType(spot.permits);
  if (!thumbnail || !permits || !spot.neighbourhood) return null;
  return {
    slug: spot.slug,
    name: spot.name,
    neighbourhood: spot.neighbourhood,
    type: spot.type,
    bestUses: inBestUseOrder(spot.bestUses),
    permits,
    permitStale: isStale(spot.permitVerifiedAt, today),
    thumbnail: toImageDto(thumbnail),
  };
}
