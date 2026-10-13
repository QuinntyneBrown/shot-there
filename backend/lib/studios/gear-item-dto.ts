import type { GearCategory } from '@/lib/studios/gear-category';

export interface GearItemDto {
  name: string;
  category: GearCategory;
  quantity: number;
  extraCost: number | null;
}
