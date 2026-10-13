import { StudioFeeDto } from './studio-fee-dto';

/** Pricing, with the all-in cost and staleness already computed by the server. */
export interface StudioPricingDto {
  hourlyRate: number;
  minBookingHours: number;
  fees: StudioFeeDto[];
  allInCost2h: number;
  /** ISO date, YYYY-MM-DD. */
  priceVerifiedAt: string;
  priceStale: boolean;
}
