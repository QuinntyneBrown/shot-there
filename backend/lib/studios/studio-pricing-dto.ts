import type { StudioFeeDto } from '@/lib/studios/studio-fee-dto';

export interface StudioPricingDto {
  hourlyRate: number;
  minBookingHours: number;
  /** In configured order. */
  fees: StudioFeeDto[];
  allInCost2h: number;
  priceVerifiedAt: string;
  priceStale: boolean;
}
