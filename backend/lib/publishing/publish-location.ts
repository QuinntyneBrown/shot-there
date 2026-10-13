import { getDependencies } from '@/lib/data/dependency-container';
import { checkSpotPublishable, checkStudioPublishable } from '@/lib/publishing/check-publishable';
import type { LocationKind } from '@/lib/publishing/location-kind';
import { missingFields } from '@/lib/publishing/missing-fields';
import { revalidatePublicPages } from '@/lib/publishing/revalidate-public-pages';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { StudioRecord } from '@/lib/studios/studio-record';

/**
 * Publishes the location when its standard data set is complete, otherwise throws a 422 listing the missing fields.
 * A studio without a review date is reviewed today. Null when no location of the kind has the id.
 */
export async function publishLocation(kind: LocationKind, id: string): Promise<StudioRecord | SpotRecord | null> {
  const { studios, spots, clock } = getDependencies();

  if (kind === 'studio') {
    const studio = await studios.findById(id);
    if (!studio) return null;
    const missing = checkStudioPublishable(studio);
    if (missing.length > 0) throw missingFields(missing);
    const published: StudioRecord = {
      ...studio,
      status: 'published',
      publishedAt: studio.status === 'published' ? studio.publishedAt : clock.now(),
      reviewedAt: studio.reviewedAt ?? clock.today(),
      updatedAt: clock.now(),
    };
    await studios.save(published);
    await revalidatePublicPages(kind, published);
    return published;
  }

  const spot = await spots.findById(id);
  if (!spot) return null;
  const missing = checkSpotPublishable(spot);
  if (missing.length > 0) throw missingFields(missing);
  const published: SpotRecord = {
    ...spot,
    status: 'published',
    publishedAt: spot.status === 'published' ? spot.publishedAt : clock.now(),
    updatedAt: clock.now(),
  };
  await spots.save(published);
  await revalidatePublicPages(kind, published);
  return published;
}
