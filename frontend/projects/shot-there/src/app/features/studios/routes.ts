import { Routes } from '@angular/router';

import { APP_PATHS } from '../../core/routing/app-paths';
import { PAGE_TITLES } from '../../core/routing/page-titles';
import { StudioListPageComponent } from './studio-list-page/studio-list-page.component';
import { StudioPageComponent } from './studio-page/studio-page.component';

export const studioRoutes: Routes = [
  { path: APP_PATHS.studios, title: PAGE_TITLES.studios, component: StudioListPageComponent },
  // The page sets its own title from the studio's name.
  { path: APP_PATHS.studio, component: StudioPageComponent }
];
