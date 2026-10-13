import type { ContentType } from '@/lib/slugs/content-type';
import type { SlugRedirectRecord } from '@/lib/slugs/slug-redirect-record';
import type { SlugRedirectRepository } from '@/lib/slugs/slug-redirect-repository';

export class InMemorySlugRedirectRepository implements SlugRedirectRepository {
  constructor(readonly rows: SlugRedirectRecord[] = []) {}

  async find(type: ContentType, fromSlug: string): Promise<SlugRedirectRecord | null> {
    return structuredClone(this.rows.find((row) => row.type === type && row.fromSlug === fromSlug) ?? null);
  }
}
