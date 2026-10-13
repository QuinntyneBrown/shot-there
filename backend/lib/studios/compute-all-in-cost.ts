import type { StudioFeeRecord } from '@/lib/studios/studio-fee-record';

const STANDARD_SHOOT_HOURS = 2;

/** Hourly rate × max(2, minimum booking hours) plus mandatory fees, rounded to the cent. */
export function computeAllInCost2h(hourlyRate: number, minBookingHours: number, fees: StudioFeeRecord[]): number {
  const hours = Math.max(STANDARD_SHOOT_HOURS, minBookingHours);
  const rentalCents = Math.round(hourlyRate * 100 * hours);
  const feeCents = fees.filter((fee) => fee.mandatory).reduce((sum, fee) => sum + Math.round(fee.amount * 100), 0);
  return (rentalCents + feeCents) / 100;
}
