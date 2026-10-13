import { StudioListQuery } from './studio-list-query';

/** The same query with every filter cleared; the sort stays. */
export function withoutFilters(query: StudioListQuery): StudioListQuery {
  return { neighbourhoods: [], naturalLight: false, cycWall: false, gear: [], sort: query.sort };
}
