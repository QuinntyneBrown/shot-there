import { getDependencies } from '@/lib/data/dependency-container';
import { log } from '@/lib/logging/logger';
import { currentCorrelationId } from '@/lib/logging/correlation-context';

/**
 * Deletes objects once their rows are gone. A failure is logged and not retried: the rows are already deleted, so the
 * objects are only orphaned, never shown.
 */
export async function deleteStoredObjects(keys: string[]): Promise<void> {
  try {
    await getDependencies().objectStore.deleteObjects(keys);
  } catch (error) {
    log('error', currentCorrelationId(), {
      event: 'storage.delete-failed',
      keys,
      errorName: error instanceof Error ? error.name : 'Error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
