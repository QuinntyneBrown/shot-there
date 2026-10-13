import { APP_PATHS } from '../routing/app-paths';
import { NavLink } from './nav-link';

/** The primary links shown in the header and in the site menu. */
export const PRIMARY_NAV_LINKS: readonly NavLink[] = [
  { path: `/${APP_PATHS.studios}`, label: $localize`Studios` },
  { path: `/${APP_PATHS.compare}`, label: $localize`Compare` }
];
