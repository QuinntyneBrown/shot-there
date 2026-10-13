import type { GearCategory } from '@/lib/studios/gear-category';

export interface IncludedGearDto {
  name: string;
  category: GearCategory;
  quantity: number;
}
