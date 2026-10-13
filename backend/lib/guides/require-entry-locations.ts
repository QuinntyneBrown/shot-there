import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideEntryRecord } from '@/lib/guides/guide-entry-record';
import { validationFailed } from '@/lib/http/validation-failed';

const MISSING_MESSAGE = { studio: 'This studio no longer exists', spot: 'This spot no longer exists' };

/** Throws a 400 naming each entry whose studio or spot does not exist, in any status. */
export async function requireEntryLocations(entries: GuideEntryRecord[]): Promise<void> {
  const { studios, spots } = getDependencies();
  const exists = await Promise.all(
    entries.map(async (entry) =>
      entry.kind === 'studio'
        ? (await studios.findById(entry.locationId)) !== null
        : (await spots.findById(entry.locationId)) !== null,
    ),
  );
  const errors = entries.flatMap((entry, index) =>
    exists[index] ? [] : [{ field: `entries.${index}.locationId`, message: MISSING_MESSAGE[entry.kind] }],
  );
  if (errors.length > 0) throw validationFailed(errors);
}
