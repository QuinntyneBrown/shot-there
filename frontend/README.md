# ShotThere frontend

An Angular 21 workspace (standalone components, signals, zoneless, server-side
rendering) with three projects:

| Project | Path | Imported as |
|---------|------|-------------|
| `shot-there` | `projects/shot-there/` | the application |
| `api` | `projects/api/` | `@shot-there/api` |
| `components` | `projects/components/` | `@shot-there/components` |

The `@shot-there/*` aliases in `tsconfig.json` point at each library's
`src/public-api.ts`, so the app compiles the libraries from source; there is
no need to build them first.

The application keeps app-wide pieces (shell, routing, compare selection) in
`projects/shot-there/src/app/core/` and each product area in
`projects/shot-there/src/app/features/<area>/`, with its routes in `routes.ts`.

## Commands

```sh
npm install
npm start           # ng serve shot-there, http://localhost:4200
npm run build       # ng build shot-there (browser + SSR server)
npm run build:libs  # ng build api && ng build components
npm run lint        # ESLint, including the template i18n rule
npm run e2e         # Playwright acceptance suite
```

Serve the SSR build with `npm run serve:ssr:shot-there` (set
`NG_ALLOWED_HOSTS` to the host name you browse with).

## Acceptance tests

The Playwright suite lives in `e2e/`: specs at the top, one page object per
screen in `e2e/pages/`, and faked API responses in `e2e/fakes/`. It runs in
Chromium only and never needs the backend. `playwright.config.ts` starts
`ng serve shot-there --configuration e2e` on port 4317; that configuration
renders in the browser so every `/api` request can be faked with route
interception, and any request a test does not fake is aborted.
