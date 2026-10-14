import { DisplayDate, Fact } from '@shot-there/components';

/** What the pricing section shows, ready for the template. */
export interface StudioPricingView {
  allIn: string;
  allInText: string;
  items: Fact[];
  verifiedLabel: string;
  verified: DisplayDate;
  daysSinceVerified: number;
}
