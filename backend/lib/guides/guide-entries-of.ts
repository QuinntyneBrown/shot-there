import type { GuideEntryRecord } from '@/lib/guides/guide-entry-record';
import type { GuideInput } from '@/lib/guides/guide-input';

/** The stored entries of a save body: array order is the position. */
export function guideEntriesOf(input: GuideInput): GuideEntryRecord[] {
  return input.entries.map(({ kind, locationId, note }, position) => ({ kind, locationId, note, position }));
}
