export interface StudioMapLocation {
  kind: 'studio';
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  allInCost2h: number;
  priceStale: boolean;
}
