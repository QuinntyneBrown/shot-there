import { GearFilter } from './gear-filter';
import { Parking } from './parking';
import { StudioSort } from './studio-sort';

/** The filters and sort the studio list URL holds. */
export interface StudioListQuery {
  costMin?: number;
  costMax?: number;
  neighbourhoods: string[];
  naturalLight: boolean;
  cycWall: boolean;
  minSpaceSqm?: number;
  gear: GearFilter[];
  parking?: Parking;
  sort: StudioSort;
}
