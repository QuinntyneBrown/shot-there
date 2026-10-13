import type { ObjectStore } from '@/lib/storage/object-store';
import type { StoredObject } from '@/tests/support/stored-object';

/** Keeps uploaded objects in memory instead of an S3 bucket. */
export class InMemoryObjectStore implements ObjectStore {
  readonly objects = new Map<string, StoredObject>();

  async putObject(key: string, body: Buffer, contentType: string, cacheControl?: string): Promise<void> {
    this.objects.set(key, { body, contentType, cacheControl });
  }

  async deleteObjects(keys: string[]): Promise<void> {
    for (const key of keys) this.objects.delete(key);
  }
}
