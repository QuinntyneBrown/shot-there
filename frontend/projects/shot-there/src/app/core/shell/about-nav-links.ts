import { APP_PATHS } from '../routing/app-paths';
import { NavLink } from './nav-link';

/** The links about ShotThere itself, shown in the site menu. */
export const ABOUT_NAV_LINKS: readonly NavLink[] = [
  {
    path: `/${APP_PATHS.editorialPolicy}`,
    label: $localize`Editorial policy`,
    description: $localize`How reviews are made, paid for and corrected`,
  },
];
