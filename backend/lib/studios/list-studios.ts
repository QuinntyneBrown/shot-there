import { getDependencies } from '@/lib/data/dependency-container';
import { imagesWithRole } from '@/lib/images/to-image-dto';
import { toThumbnailDto } from '@/lib/images/to-thumbnail-dto';
import { isStale } from '@/lib/shared/is-stale';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import { computeOverallScore } from '@/lib/studios/compute-overall-score';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
import type { StudioSummaryDto } from '@/lib/studios/studio-summary-dto';

/** Published studios as list cards, most recent review first. */
export async function listStudios(): Promise<StudioSummaryDto[]> {
  const { studios, clock } = getDependencies();
  const today = clock.today();
  const cards = (await studios.listPublished()).map((studio) => ({
    slug: studio.slug,
    name: studio.name,
    neighbourhood: studio.neighbourhood,
    allInCost2h: allInCostOf(studio),
    overallScore: computeOverallScore(rubricScoresOf(studio)),
    priceStale: isStale(studio.priceVerifiedAt, today),
    reviewedAt: studio.reviewedAt,
    thumbnail: toThumbnailDto(
      imagesWithRole(studio.images, 'gallery')[0] ?? imagesWithRole(studio.images, 'testShot')[0],
    ),
  }));
  return cards.sort(byReviewDateDescending);
}

function byReviewDateDescending(a: StudioSummaryDto, b: StudioSummaryDto): number {
  return (b.reviewedAt ?? '').localeCompare(a.reviewedAt ?? '');
}
