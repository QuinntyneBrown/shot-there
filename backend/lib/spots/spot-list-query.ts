import type { BestUse } from '@/lib/spots/best-use';
import type { SpotPermitFilter } from '@/lib/spots/spot-permit-filter';
import type { SpotType } from '@/lib/spots/spot-type';

export interface SpotListQuery {
  types: SpotType[];
  useCases: BestUse[];
  permit: SpotPermitFilter;
}
