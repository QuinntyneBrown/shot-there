import type { ContentType } from '@/lib/slugs/content-type';

/** An old slug of a published item and the slug it now has. */
export interface SlugRedirectRecord {
  type: ContentType;
  fromSlug: string;
  toSlug: string;
}
