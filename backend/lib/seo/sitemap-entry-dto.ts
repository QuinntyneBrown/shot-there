export interface SitemapEntryDto {
  /** Page path starting with "/". */
  path: string;
  /** RFC 3339 instant in UTC. */
  lastModified: string;
}
