import { ParamMap } from '@angular/router';

import { StudioListQuery } from './studio-list-query';
import { DEFAULT_STUDIO_SORT, STUDIO_SORTS, StudioSort } from './studio-sort';

/** Reads the studio list query from the URL, ignoring values the site does not offer. */
export function parseStudioListQuery(params: ParamMap): StudioListQuery {
  const sort = params.get('sort');
  return {
    sort: STUDIO_SORTS.includes(sort as StudioSort) ? (sort as StudioSort) : DEFAULT_STUDIO_SORT
  };
}
