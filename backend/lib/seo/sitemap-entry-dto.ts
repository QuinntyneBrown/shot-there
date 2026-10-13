export interface SitemapEntryDto {
  path: string;
  /** ISO `YYYY-MM-DD`; null for a list page with no published items. */
  lastModified: string | null;
}
