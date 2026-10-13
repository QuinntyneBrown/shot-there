import { GearCategory } from './gear-category';

export interface GearItemDto {
  name: string;
  category: GearCategory;
  quantity: number | null;
  /** Price in dollars for an extra; null for included gear. */
  extraCost: number | null;
}
