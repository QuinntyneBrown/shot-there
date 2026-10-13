import { Routes } from '@angular/router';

import { APP_PATHS } from '../../core/routing/app-paths';
import { HomePageComponent } from './home-page/home-page.component';

export const homeRoutes: Routes = [
  // No page title: the home page is titled with the site name alone.
  { path: APP_PATHS.home, pathMatch: 'full', component: HomePageComponent }
];
