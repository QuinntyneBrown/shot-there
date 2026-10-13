import type { PermitSummary } from '@/lib/spots/permit-summary';

/** One map marker. Studios carry `allInCost2h`; spots carry `permitSummary`. */
export interface MapLocationDto {
  kind: 'studio' | 'spot';
  slug: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  allInCost2h?: number | null;
  permitSummary?: PermitSummary;
}
