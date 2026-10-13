import { getDependencies } from '@/lib/data/dependency-container';
import type { ContentType } from '@/lib/slugs/content-type';
import type { SlugRedirectDto } from '@/lib/slugs/slug-redirect-dto';

const PUBLIC_PATH: Record<ContentType, string> = { studio: '/studios', spot: '/spots', guide: '/guides' };

export async function findSlugRedirect(type: ContentType, slug: string): Promise<SlugRedirectDto | null> {
  const redirect = await getDependencies().slugRedirects.find(type, slug);
  if (!redirect) return null;
  return { ...redirect, location: `${PUBLIC_PATH[type]}/${redirect.toSlug}` };
}
