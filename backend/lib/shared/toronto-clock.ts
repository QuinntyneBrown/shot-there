import type { Clock } from '@/lib/shared/clock';

const torontoDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const torontoClock: Clock = {
  today: () => torontoDate.format(new Date()),
  now: () => new Date(),
};
