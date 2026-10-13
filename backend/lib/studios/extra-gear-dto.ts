import type { GearCategory } from '@/lib/studios/gear-category';

/** Gear that costs extra; `extraCost` is in Canadian dollars. */
export interface ExtraGearDto {
  name: string;
  category: GearCategory;
  quantity: number;
  extraCost: number;
}
