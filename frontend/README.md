# ShotThere frontend

An Angular 21 workspace (standalone components, signals, zoneless, server-side
rendering) with three projects:

| Project              | Path                           | Imported as                               |
| -------------------- | ------------------------------ | ----------------------------------------- |
| `shot-there`         | `projects/shot-there/`         | the application                           |
| `api`                | `projects/api/`                | `@shot-there/api`                         |
| `components`         | `projects/components/`         | `@shot-there/components`                  |
| `components-harness` | `projects/components-harness/` | test host for the library, never deployed |

`@shot-there/api` resolves to the API library's source. `@shot-there/components`
resolves to the built package in `dist/components` (ICD-002, ICD-PKG-3), so
**build the components library before the app or the harness**:
`npm start` and `npm run build` do it for you; after any library change run
`npm run build:components`. The library also publishes the only global
stylesheet, `dist/components/styles/shot-there.css` (tokens, foundations,
utilities), which `angular.json` lists first.

The application keeps app-wide pieces (shell, routing, compare selection) in
`projects/shot-there/src/app/core/` and each product area in
`projects/shot-there/src/app/features/<area>/`, with its routes in `routes.ts`.

## Commands

```sh
npm install
npm start                 # build components, then ng serve shot-there, http://localhost:4200
npm run build             # build components, then ng build shot-there (browser + SSR server)
npm run build:components  # ng build components
npm run build:libs        # ng build api && ng build components
npm run lint              # ESLint (template i18n, import boundaries) and Stylelint (no colour literals)
npm run e2e               # Playwright acceptance suite: app and library projects
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

`playwright.config.ts` has two Chromium projects, and starts both web servers
in order (the first builds the components library):

| Project   | Specs                   | Server                                               |
| --------- | ----------------------- | ---------------------------------------------------- |
| `app`     | `e2e/*.spec.ts`         | `ng serve shot-there --configuration e2e`, port 4317 |
| `library` | `e2e/library/*.spec.ts` | `ng serve components-harness`, port 4318             |

The harness mounts one library component state per route
(`<component>/<state>`, listed on its index page) and renders on the server, so
SSR checks run against it. Each library component has one component object in
`e2e/components/<component>.component.ts`; app page objects compose them.
Run one project with `npx playwright test --project=library`.
