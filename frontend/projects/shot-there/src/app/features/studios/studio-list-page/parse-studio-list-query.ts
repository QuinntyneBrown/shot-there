import { ParamMap } from '@angular/router';

import { GEAR_FILTER_VALUES, GearFilter } from './gear-filter';
import { PARKING_VALUES, Parking } from './parking';
import { MIN_SPACE_OPTIONS, NEIGHBOURHOOD_OPTIONS } from './studio-filter-options';
import { StudioListQuery } from './studio-list-query';
import { DEFAULT_STUDIO_SORT, STUDIO_SORTS, StudioSort } from './studio-sort';

/** Reads the studio list query from the URL, ignoring values the site does not offer (L2-025). */
export function parseStudioListQuery(params: ParamMap): StudioListQuery {
  let costMin = parseCost(params.get('costMin'));
  let costMax = parseCost(params.get('costMax'));
  if (costMin !== undefined && costMax !== undefined && costMin > costMax) {
    costMin = undefined;
    costMax = undefined;
  }
  const space = Number(params.get('space'));
  const sort = params.get('sort') as StudioSort;
  const parking = params.get('parking') as Parking;
  return {
    costMin,
    costMax,
    neighbourhoods: unique(params.getAll('hood').filter((hood) => NEIGHBOURHOOD_OPTIONS.some((option) => option.slug === hood))),
    naturalLight: params.get('light') === 'medium',
    cycWall: params.get('cyc') === 'yes',
    minSpaceSqm: MIN_SPACE_OPTIONS.includes(space) ? space : undefined,
    gear: unique(params.getAll('gear').filter((gear): gear is GearFilter => GEAR_FILTER_VALUES.includes(gear as GearFilter))),
    parking: PARKING_VALUES.includes(parking) ? parking : undefined,
    sort: STUDIO_SORTS.includes(sort) ? sort : DEFAULT_STUDIO_SORT
  };
}

function parseCost(value: string | null): number | undefined {
  if (value === null || value.trim() === '') {
    return undefined;
  }
  const cost = Number(value);
  return Number.isFinite(cost) && cost >= 0 ? cost : undefined;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
