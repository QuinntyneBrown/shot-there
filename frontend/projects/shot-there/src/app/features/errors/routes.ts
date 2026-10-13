import { Routes } from '@angular/router';

import { PAGE_TITLES } from '../../core/routing/page-titles';
import { NotFoundPageComponent } from './not-found-page.component';

export const errorRoutes: Routes = [
  { path: '**', title: PAGE_TITLES.notFound, component: NotFoundPageComponent }
];
