import { PAGE_TITLES } from './page-titles';

/** "Studios" → "Studios · ShotThere"; no page title → "ShotThere". */
export function formatPageTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} · ${PAGE_TITLES.suffix}` : PAGE_TITLES.suffix;
}
