import type { ContentType } from '@/lib/slugs/content-type';
import type { SlugRedirectRecord } from '@/lib/slugs/slug-redirect-record';

export interface SlugRedirectRepository {
  find(type: ContentType, fromSlug: string): Promise<SlugRedirectRecord | null>;
}
