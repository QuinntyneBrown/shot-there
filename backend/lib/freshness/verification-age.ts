import type { VerificationGroup } from '@/lib/freshness/verification-group';
import { daysBetween, isStale } from '@/lib/shared/is-stale';

const DUE_SOON_FROM_DAYS = 153;

/** Classifies a last-verified date: stale after 183 days, due soon from 153 to 183 days, otherwise current. */
export function verificationGroup(verifiedAt: string, today: string): VerificationGroup {
  if (isStale(verifiedAt, today)) return 'stale';
  return daysBetween(verifiedAt, today) >= DUE_SOON_FROM_DAYS ? 'due_soon' : 'current';
}
