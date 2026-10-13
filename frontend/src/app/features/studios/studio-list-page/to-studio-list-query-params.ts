import { StudioListParams } from '@shot-there/api';

import { StudioListQuery } from './studio-list-query';
import { DEFAULT_STUDIO_SORT } from './studio-sort';

/** Writes the studio list query as URL and API parameters, leaving defaults out. */
export function toStudioListQueryParams(query: StudioListQuery): StudioListParams {
  const params: Record<string, string | string[]> = {};
  if (query.sort !== DEFAULT_STUDIO_SORT) {
    params['sort'] = query.sort;
  }
  return params;
}
