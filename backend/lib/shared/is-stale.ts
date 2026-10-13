const STALE_AFTER_DAYS = 183;
const MS_PER_DAY = 86_400_000;

/** Days from `fromDate` to `toDate`, both ISO `YYYY-MM-DD`. */
export function daysBetween(fromDate: string, toDate: string): number {
  return Math.round((Date.parse(toDate) - Date.parse(fromDate)) / MS_PER_DAY);
}

/** True when the date lies more than 183 days before today; exactly 183 days is not stale. */
export function isStale(verifiedAt: string, today: string): boolean {
  return daysBetween(verifiedAt, today) > STALE_AFTER_DAYS;
}
