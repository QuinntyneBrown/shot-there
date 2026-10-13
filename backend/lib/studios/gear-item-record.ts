import type { GearCategory } from '@/lib/studios/gear-category';

export interface GearItemRecord {
  name: string;
  category: GearCategory;
  quantity: number;
  included: boolean;
  /** Cost per booking when not included; null when included. */
  extraCost: number | null;
}
