import type { ContentType } from '@/lib/slugs/content-type';

export interface SlugRedirectDto {
  type: ContentType;
  fromSlug: string;
  toSlug: string;
  /** The public path to redirect to, e.g. `/studios/the-junction-loft`. */
  location: string;
}
