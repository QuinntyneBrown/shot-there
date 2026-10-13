import { imagesWithRole, toImageDto } from '@/lib/images/to-image-dto';
import { isStale } from '@/lib/shared/is-stale';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import { computeOverallScore } from '@/lib/studios/compute-overall-score';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
import type { StudioRecord } from '@/lib/studios/studio-record';
import type { StudioSummary } from '@/lib/studios/studio-summary';

/** The published studio's card, or null when it cannot be shown as one, e.g. it has no gallery image with alt text. */
export function toStudioSummary(studio: StudioRecord, today: string): StudioSummary | null {
  const [thumbnail] = imagesWithRole(studio.images, 'gallery');
  const allInCost2h = allInCostOf(studio);
  const overallScore = computeOverallScore(rubricScoresOf(studio));
  if (!thumbnail || !studio.neighbourhood || allInCost2h === null || overallScore === null || !studio.publishedAt) {
    return null;
  }
  return {
    slug: studio.slug,
    name: studio.name,
    neighbourhood: studio.neighbourhood,
    allInCost2h,
    priceStale: isStale(studio.priceVerifiedAt, today),
    overallScore,
    reviewedAt: studio.publishedAt.toISOString(),
    thumbnail: toImageDto(thumbnail),
  };
}
