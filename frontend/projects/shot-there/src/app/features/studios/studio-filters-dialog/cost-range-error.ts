import { StudioListQuery } from '../studio-list-page/studio-list-query';

/** The message for a cost range that cannot match anything, or null when the range is fine. */
export function costRangeError(query: StudioListQuery): string | null {
  return query.costMin !== undefined && query.costMax !== undefined && query.costMin > query.costMax
    ? $localize`The minimum must be lower than the maximum`
    : null;
}
