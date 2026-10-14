import { getDependencies } from '@/lib/data/dependency-container';
import { toSlug } from '@/lib/slugs/to-slug';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import { matchesStudioFilters } from '@/lib/studios/matches-studio-filters';
import type { StudioListQuery } from '@/lib/studios/studio-list-query';
import type { StudioSort } from '@/lib/studios/studio-sort';
import type { StudioSummary } from '@/lib/studios/studio-summary';
import { toStudioSummary } from '@/lib/studios/to-studio-summary';

/** Published studios matching the query as list cards, in the requested order with ties by review time then slug. */
export async function listStudios(query: StudioListQuery): Promise<StudioSummary[]> {
  const { studios, clock } = getDependencies();
  const today = clock.today();
  const published = await studios.listPublished();
  const knownNeighbourhoods = new Set(published.map((studio) => toSlug(studio.neighbourhood ?? '')));
  const effectiveQuery = {
    ...query,
    neighbourhoods: query.neighbourhoods.filter((hood) => knownNeighbourhoods.has(hood)),
  };
  return published
    .filter((studio) => matchesStudioFilters(studio, allInCostOf(studio), effectiveQuery))
    .flatMap((studio) => toStudioSummary(studio, today) ?? [])
    .sort((a, b) => SORTS[query.sort](a, b) || b.reviewedAt.localeCompare(a.reviewedAt) || a.slug.localeCompare(b.slug));
}

const SORTS: Record<StudioSort, (a: StudioSummary, b: StudioSummary) => number> = {
  recent: () => 0,
  cost: (a, b) => a.allInCost2h - b.allInCost2h,
  score: (a, b) => b.overallScore - a.overallScore,
};
