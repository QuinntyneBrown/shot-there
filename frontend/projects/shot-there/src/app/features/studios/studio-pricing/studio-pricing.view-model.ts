import { formatCurrency, formatDate } from '@angular/common';
import { StudioPricingDto } from '@shot-there/api';
import { DisplayDate, Fact } from '@shot-there/components';

import { StudioPricingView } from './studio-pricing-view';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Splits the fees and counts the days since verification. The all-in cost itself comes from the server. */
export function toStudioPricingView(
  pricing: StudioPricingDto,
  today: Date,
  locale: string,
): StudioPricingView {
  const [year, month, day] = pricing.priceVerifiedAt.split('-').map(Number);
  const verified = Date.UTC(year, month - 1, day);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const billableHours = Math.max(2, pricing.minBookingHours);
  const mandatoryFees = pricing.fees.filter((fee) => fee.mandatory);
  const optionalFees = pricing.fees.filter((fee) => !fee.mandatory);
  const money = (amount: number) => formatCurrency(amount, locale, '$', 'CAD', '1.2-2');
  const rate = money(pricing.hourlyRate);
  const verifiedDate: DisplayDate = {
    datetime: pricing.priceVerifiedAt,
    text: formatDate(pricing.priceVerifiedAt, 'd MMMM y', locale),
  };
  const items: Fact[] = [
    { term: $localize`Hourly rate`, detail: rate, numeric: true },
    {
      term: $localize`Minimum booking`,
      detail:
        pricing.minBookingHours === 1
          ? $localize`1 hour`
          : $localize`${pricing.minBookingHours}:hours: hours`,
    },
    ...mandatoryFees.map((fee) => ({
      term: fee.name,
      detail: money(fee.amount),
      numeric: true,
      badge: $localize`Mandatory`,
    })),
    ...optionalFees.map((fee) => ({
      term: fee.name,
      detail: money(fee.amount),
      numeric: true,
      badge: $localize`Optional, not in all-in`,
    })),
  ];
  return {
    allIn: money(pricing.allInCost2h),
    allInText:
      mandatoryFees.length > 0
        ? $localize`All-in for a standard 2-hour shoot: ${billableHours}:hours: hours at ${rate}:hourlyRate: plus mandatory fees.`
        : $localize`All-in for a standard 2-hour shoot: ${billableHours}:hours: hours at ${rate}:hourlyRate:.`,
    items,
    verifiedLabel: $localize`Prices verified`,
    verified: verifiedDate,
    daysSinceVerified: Math.round((now - verified) / DAY_MS),
  };
}
