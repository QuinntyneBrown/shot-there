import type { GearItemDto } from '@/lib/studios/gear-item-dto';

export interface StudioGearDto {
  included: GearItemDto[];
  extras: GearItemDto[];
}
