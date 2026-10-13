import type { Clock } from '@/lib/shared/clock';

export function fixedClock(today: string): Clock {
  return { today: () => today, now: () => new Date(`${today}T12:00:00-04:00`) };
}
