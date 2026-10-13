import { StudioFeeDto } from '@shot-there/api';

/** What the pricing section shows, ready for the template. */
export interface StudioPricingView {
  /** Hours the all-in cost pays for: the 2-hour shoot or the minimum booking, whichever is longer. */
  billableHours: number;
  mandatoryFees: StudioFeeDto[];
  optionalFees: StudioFeeDto[];
  daysSinceVerified: number;
}
