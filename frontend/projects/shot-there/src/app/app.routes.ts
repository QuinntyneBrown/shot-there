import { Routes } from '@angular/router';

import { compareRoutes } from './features/compare/routes';
import { editorialRoutes } from './features/editorial/routes';
import { errorRoutes } from './features/errors/routes';
import { studioRoutes } from './features/studios/routes';

export const routes: Routes = [
  ...studioRoutes,
  ...compareRoutes,
  ...editorialRoutes,
  ...errorRoutes
];
