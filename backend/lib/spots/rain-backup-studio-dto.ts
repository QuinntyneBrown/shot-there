export interface RainBackupStudioDto {
  slug: string;
  name: string;
  /** Straight-line distance from the spot, rounded to one decimal. */
  distanceKm: number;
  allInCost2h: number;
  priceStale: boolean;
}
