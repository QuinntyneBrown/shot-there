import { StudioListParams } from '@shot-there/api';

import { StudioListQuery } from './studio-list-query';
import { DEFAULT_STUDIO_SORT } from './studio-sort';

/** Writes the studio list query as URL and API parameters, leaving defaults out. */
export function toStudioListQueryParams(query: StudioListQuery): StudioListParams {
  const params: Record<string, string | string[]> = {};
  if (query.costMin !== undefined) {
    params['costMin'] = String(query.costMin);
  }
  if (query.costMax !== undefined) {
    params['costMax'] = String(query.costMax);
  }
  if (query.neighbourhoods.length > 0) {
    params['hood'] = query.neighbourhoods;
  }
  if (query.naturalLight) {
    params['light'] = 'medium';
  }
  if (query.cycWall) {
    params['cyc'] = 'yes';
  }
  if (query.minSpaceSqm !== undefined) {
    params['space'] = String(query.minSpaceSqm);
  }
  if (query.gear.length > 0) {
    params['gear'] = query.gear;
  }
  if (query.parking !== undefined) {
    params['parking'] = query.parking;
  }
  if (query.sort !== DEFAULT_STUDIO_SORT) {
    params['sort'] = query.sort;
  }
  return params;
}
