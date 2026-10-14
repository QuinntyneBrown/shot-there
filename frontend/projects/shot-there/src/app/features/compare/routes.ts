import { Routes } from '@angular/router';

import { APP_PATHS } from '../../core/routing/app-paths';
import { PAGE_TITLES } from '../../core/routing/page-titles';
import { ComparePageComponent } from './compare-page/compare-page.component';

export const compareRoutes: Routes = [
  // The page refines the title with the compared studios' names.
  { path: APP_PATHS.compare, title: PAGE_TITLES.compare, component: ComparePageComponent },
];
