import type { ContentType } from '@/lib/slugs/content-type';
import type { SlugRedirectRecord } from '@/lib/slugs/slug-redirect-record';

export interface SlugRedirectRepository {
  find(type: ContentType, fromSlug: string): Promise<SlugRedirectRecord | null>;
  /**
   * Records that `fromSlug` now lives at `toSlug` in one transaction: repoints older rows that pointed at `fromSlug`
   * and drops any row redirecting away from `toSlug`, so redirects never chain or loop.
   */
  recordChange(type: ContentType, fromSlug: string, toSlug: string): Promise<void>;
}
