import { Routes } from '@angular/router';

import { compareRoutes } from './features/compare/routes';
import { editorialRoutes } from './features/editorial/routes';
import { errorRoutes } from './features/errors/routes';
import { homeRoutes } from './features/home/routes';
import { studioRoutes } from './features/studios/routes';

export const routes: Routes = [
  ...homeRoutes,
  ...studioRoutes,
  ...compareRoutes,
  ...editorialRoutes,
  ...errorRoutes,
];
