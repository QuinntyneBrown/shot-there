import type { LocationKind } from '@/lib/publishing/location-kind';

const LIST_PATH: Record<LocationKind, string> = { studio: '/studios', spot: '/spots' };

/** The public routes one location change touches: its page, its list, the map, comparisons for studios, the sitemap and the guides that feature it. */
export function affectedRoutes(kind: LocationKind, slug: string, guideSlugs: string[]): string[] {
  return [
    `${LIST_PATH[kind]}/${slug}`,
    LIST_PATH[kind],
    '/map',
    ...(kind === 'studio' ? ['/compare'] : []),
    '/sitemap.xml',
    ...guideSlugs.map((guideSlug) => `/guides/${guideSlug}`),
  ];
}

/** The public routes one guide change touches: its page, the guide index and the sitemap. */
export function affectedGuideRoutes(slug: string): string[] {
  return [`/guides/${slug}`, '/guides', '/sitemap.xml'];
}
