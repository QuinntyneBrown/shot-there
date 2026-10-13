import { Routes } from '@angular/router';

import { errorRoutes } from './features/errors/routes';
import { studioRoutes } from './features/studios/routes';

export const routes: Routes = [
  ...studioRoutes,
  ...errorRoutes
];
