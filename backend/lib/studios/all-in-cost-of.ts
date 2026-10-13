import { computeAllInCost2h } from '@/lib/studios/compute-all-in-cost';
import type { StudioRecord } from '@/lib/studios/studio-record';

/** The studio's all-in cost, or null while its rate or minimum booking is missing. */
export function allInCostOf(studio: StudioRecord): number | null {
  if (studio.hourlyRate === null || studio.minBookingHours === null) return null;
  return computeAllInCost2h(studio.hourlyRate, studio.minBookingHours, studio.fees);
}
