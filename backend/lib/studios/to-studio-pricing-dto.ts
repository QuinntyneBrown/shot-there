import { isStale } from '@/lib/shared/is-stale';
import { present } from '@/lib/shared/present';
import { allInCostOf } from '@/lib/studios/all-in-cost-of';
import type { StudioPricingDto } from '@/lib/studios/studio-pricing-dto';
import type { StudioRecord } from '@/lib/studios/studio-record';

export function toStudioPricingDto(studio: StudioRecord, today: string): StudioPricingDto {
  return {
    hourlyRate: present(studio.hourlyRate, 'hourlyRate'),
    minBookingHours: present(studio.minBookingHours, 'minBookingHours'),
    fees: studio.fees.map(({ name, amount, mandatory }) => ({ name, amount, mandatory })),
    allInCost2h: present(allInCostOf(studio), 'allInCost2h'),
    priceVerifiedAt: studio.priceVerifiedAt,
    priceStale: isStale(studio.priceVerifiedAt, today),
  };
}
