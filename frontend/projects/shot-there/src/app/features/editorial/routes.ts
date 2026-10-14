import { Routes } from '@angular/router';

import { APP_PATHS } from '../../core/routing/app-paths';
import { PAGE_TITLES } from '../../core/routing/page-titles';
import { EditorialPolicyPageComponent } from './editorial-policy-page/editorial-policy-page.component';

export const editorialRoutes: Routes = [
  {
    path: APP_PATHS.editorialPolicy,
    title: PAGE_TITLES.editorialPolicy,
    component: EditorialPolicyPageComponent,
  },
];
