import type { ContentType } from '@/lib/slugs/content-type';
import type { SlugRedirectRecord } from '@/lib/slugs/slug-redirect-record';
import type { SlugRedirectRepository } from '@/lib/slugs/slug-redirect-repository';

export class InMemorySlugRedirectRepository implements SlugRedirectRepository {
  constructor(public rows: SlugRedirectRecord[] = []) {}

  async find(type: ContentType, fromSlug: string): Promise<SlugRedirectRecord | null> {
    return structuredClone(this.rows.find((row) => row.type === type && row.fromSlug === fromSlug) ?? null);
  }

  async recordChange(type: ContentType, fromSlug: string, toSlug: string): Promise<void> {
    this.rows = this.rows
      .filter((row) => !(row.type === type && (row.fromSlug === toSlug || row.fromSlug === fromSlug)))
      .map((row) => (row.type === type && row.toSlug === fromSlug ? { ...row, toSlug } : row));
    this.rows.push({ type, fromSlug, toSlug });
  }
}
