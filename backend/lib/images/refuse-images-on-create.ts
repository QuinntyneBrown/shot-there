import { validationFailed } from '@/lib/http/validation-failed';

/** A create body's image lists must be empty: nothing can be attached before the item exists (ICD E19). */
export function refuseImagesOnCreate(lists: Record<string, unknown[]>): void {
  const errors = Object.entries(lists).flatMap(([field, items]) =>
    items.length > 0 ? [{ field, code: 'invalid_value' as const, message: 'Upload images after the item is created' }] : [],
  );
  if (errors.length > 0) throw validationFailed(errors);
}
