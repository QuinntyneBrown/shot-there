import { getDependencies } from '@/lib/data/dependency-container';
import { imagesWithRole } from '@/lib/images/to-image-dto';
import { toThumbnailDto } from '@/lib/images/to-thumbnail-dto';
import { isStale } from '@/lib/shared/is-stale';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import { computeOverallScore } from '@/lib/studios/compute-overall-score';
import { matchesStudioFilters } from '@/lib/studios/matches-studio-filters';
import { rubricScoresOf } from '@/lib/studios/rubric-scores-of';
import type { StudioListQuery } from '@/lib/studios/studio-list-query';
import type { StudioSort } from '@/lib/studios/studio-sort';
import type { StudioSummaryDto } from '@/lib/studios/studio-summary-dto';

/** Published studios matching the query as list cards, in the requested order. */
export async function listStudios(query: StudioListQuery): Promise<StudioSummaryDto[]> {
  const { studios, clock } = getDependencies();
  const today = clock.today();
  const published = await studios.listPublished();
  const knownNeighbourhoods = new Set(published.map((studio) => studio.neighbourhood));
  const effectiveQuery = {
    ...query,
    neighbourhoods: query.neighbourhoods.filter((hood) => knownNeighbourhoods.has(hood)),
  };
  const cards = published
    .filter((studio) => matchesStudioFilters(studio, allInCostOf(studio), effectiveQuery))
    .map((studio) => ({
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
  return cards.sort(SORTS[query.sort]);
}

const SORTS: Record<StudioSort, (a: StudioSummaryDto, b: StudioSummaryDto) => number> = {
  recent: byReviewDateDescending,
  cost: (a, b) => (a.allInCost2h ?? Infinity) - (b.allInCost2h ?? Infinity),
  score: (a, b) => (b.overallScore ?? -1) - (a.overallScore ?? -1) || byReviewDateDescending(a, b),
};

function byReviewDateDescending(a: StudioSummaryDto, b: StudioSummaryDto): number {
  return (b.reviewedAt ?? '').localeCompare(a.reviewedAt ?? '');
}
