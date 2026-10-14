import { StudioPricingDto } from '@shot-there/api';

import { StudioPricingView } from './studio-pricing-view';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Splits the fees and counts the days since verification. The all-in cost itself comes from the server. */
export function toStudioPricingView(pricing: StudioPricingDto, today: Date): StudioPricingView {
  const [year, month, day] = pricing.priceVerifiedAt.split('-').map(Number);
  const verified = Date.UTC(year, month - 1, day);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return {
    billableHours: Math.max(2, pricing.minBookingHours),
    mandatoryFees: pricing.fees.filter((fee) => fee.mandatory),
    optionalFees: pricing.fees.filter((fee) => !fee.mandatory),
    daysSinceVerified: Math.round((now - verified) / DAY_MS),
  };
}
