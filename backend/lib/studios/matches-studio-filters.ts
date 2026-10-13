import type { LightRating } from '@/lib/studios/light-rating';
import type { StudioListQuery } from '@/lib/studios/studio-list-query';
import type { StudioRecord } from '@/lib/studios/studio-record';

const GOOD_LIGHT: (LightRating | null)[] = ['medium', 'strong'];

/** Filters combine with AND; values within a multi-select combine with OR. */
export function matchesStudioFilters(studio: StudioRecord, allInCost: number | null, query: StudioListQuery): boolean {
  if (query.costMin !== undefined && (allInCost === null || allInCost < query.costMin)) return false;
  if (query.costMax !== undefined && (allInCost === null || allInCost > query.costMax)) return false;
  if (query.neighbourhoods.length > 0 && !query.neighbourhoods.includes(studio.neighbourhood ?? '')) return false;
  if (query.naturalLight && !hasGoodNaturalLight(studio)) return false;
  if (query.cycWall && !studio.hasCycWall) return false;
  if (query.minSpaceSqm !== undefined && usableSpaceSqm(studio) < query.minSpaceSqm) return false;
  if (query.gear.length > 0 && !query.gear.some((gear) => offersGear(studio, gear))) return false;
  if (query.parking !== undefined && studio.parking !== query.parking) return false;
  return true;
}

function hasGoodNaturalLight(studio: StudioRecord): boolean {
  return [studio.lightMorning, studio.lightMidday, studio.lightAfternoon, studio.lightEvening].some((rating) =>
    GOOD_LIGHT.includes(rating),
  );
}

function usableSpaceSqm(studio: StudioRecord): number {
  return (studio.usableWidthM ?? 0) * (studio.usableDepthM ?? 0);
}

function offersGear(studio: StudioRecord, gear: StudioListQuery['gear'][number]): boolean {
  if (gear === 'backdrops') return Boolean(studio.backdrops?.trim());
  return studio.gear.some((item) => item.included && item.category === gear);
}
