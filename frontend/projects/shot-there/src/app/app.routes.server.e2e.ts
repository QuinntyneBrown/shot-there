import { RenderMode, ServerRoute } from '@angular/ssr';

/** e2e build: render in the browser so Playwright fakes every API call. */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
