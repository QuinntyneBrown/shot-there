import type { ParkingOption } from '@/lib/studios/parking-option';
import type { StudioGearFilter } from '@/lib/studios/studio-gear-filter';
import type { StudioSort } from '@/lib/studios/studio-sort';

/** Parsed `GET /api/studios` filters and sort. Unset filters are undefined or empty. */
export interface StudioListQuery {
  costMin?: number;
  costMax?: number;
  /** Neighbourhood slugs, compared with `toSlug(neighbourhood)`. */
  neighbourhoods: string[];
  naturalLight: boolean;
  cycWall: boolean;
  minSpaceSqm?: number;
  gear: StudioGearFilter[];
  parking?: ParkingOption;
  sort: StudioSort;
}
