import { validationFailed } from '@/lib/http/validation-failed';

/** Refuses a save that would leave a published location without part of its standard data set (L2-002). */
export function refuseIncompletePublishedSave(wasPublished: boolean, missingFields: string[]): void {
  if (!wasPublished || missingFields.length === 0) return;
  throw validationFailed(
    missingFields.map((field) => ({ field, code: 'required_while_published' as const, message: 'This is required while the location is published' })),
  );
}
