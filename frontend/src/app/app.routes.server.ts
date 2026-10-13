import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'studios',
    renderMode: RenderMode.Server
  },
  {
    path: 'studios/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404
  }
];
