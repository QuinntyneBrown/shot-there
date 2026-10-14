import { GearItemDto } from './gear-item-dto';

export interface StudioGearDto {
  included: GearItemDto[];
  extras: GearItemDto[];
}
