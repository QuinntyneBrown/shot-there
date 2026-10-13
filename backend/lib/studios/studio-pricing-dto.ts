import type { StudioFeeDto } from '@/lib/studios/studio-fee-dto';

export interface StudioPricingDto {
  hourlyRate: number | null;
  minBookingHours: number | null;
  fees: StudioFeeDto[];
  allInCost2h: number | null;
  priceVerifiedAt: string;
  priceStale: boolean;
}
