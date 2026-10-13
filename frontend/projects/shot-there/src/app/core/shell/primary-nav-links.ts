import { APP_PATHS } from '../routing/app-paths';
import { NavLink } from './nav-link';

/** The primary links shown in the header and in the site menu. */
export const PRIMARY_NAV_LINKS: readonly NavLink[] = [
  { path: `/${APP_PATHS.studios}`, label: $localize`Studios`, description: $localize`Rental studios, measured the same way` },
  { path: `/${APP_PATHS.spots}`, label: $localize`Spots`, description: $localize`Outdoor locations with permit notes` },
  { path: `/${APP_PATHS.map}`, label: $localize`Map`, description: $localize`Every studio and spot on one map` },
  { path: `/${APP_PATHS.compare}`, label: $localize`Compare`, description: $localize`Up to 4 studios side by side` },
  { path: `/${APP_PATHS.guides}`, label: $localize`Guides`, description: $localize`Short lists, like the best studios under $120` }
];
