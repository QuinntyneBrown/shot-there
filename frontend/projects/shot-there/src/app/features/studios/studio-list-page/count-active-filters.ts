import { StudioListQuery } from './studio-list-query';

/** How many filters are on: the cost range counts once, and each chosen neighbourhood or gear counts on its own. */
export function countActiveFilters(query: StudioListQuery): number {
  return (
    (query.costMin !== undefined || query.costMax !== undefined ? 1 : 0) +
    query.neighbourhoods.length +
    (query.naturalLight ? 1 : 0) +
    (query.cycWall ? 1 : 0) +
    (query.minSpaceSqm !== undefined ? 1 : 0) +
    query.gear.length +
    (query.parking !== undefined ? 1 : 0)
  );
}
