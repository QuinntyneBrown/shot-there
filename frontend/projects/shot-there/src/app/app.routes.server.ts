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
    path: 'compare',
    renderMode: RenderMode.Server
  },
  {
    path: 'editorial-policy',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404
  }
];
