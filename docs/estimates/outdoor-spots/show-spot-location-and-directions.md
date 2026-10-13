# Estimate — Show spot location and directions

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes this is the first spot slice, so it builds the shared page, service, route handler and `getSpot`. The map library and tile provider are `<TO SUPPLY>`; the hours assume a common open-source library with documented Angular use. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/outdoor-spots/show-spot-location-and-directions/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `Spot` Prisma model fields and migration for location and directions | 2 |
| `app/api/spots/[slug]/route.ts`, `getSpot` and base `SpotDetailDto` with 404 path | 4 |
| `SpotsService` contract, `HttpSpotsService` and DI registration | 2 |
| `SpotPageComponent`, route in `features/spots/routes.ts`, central path and title, i18n | 5 |
| `SpotMapComponent` with single marker, accessible name and skippable focus | 7 |
| Responsive map sizing at XS and safe-area checks | 1 |
| API tests for the route handler (published, draft, unknown slug) | 2 |
| Playwright acceptance tests via `SpotPage` page object (Chromium) | 4 |
| Review fixes | 2 |
| **Total** | **29** |

## Minimal scope

The minimal scope keeps the page, service, route handler and directions text, and replaces the interactive map with a static map image plus a link to an external map. It is about 25 hours, against a full total of 29 hours. It still satisfies the name, neighbourhood and directions parts of `L2-014`; the embedded map, single marker and keyboard criteria of `L2-014` are deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Interactive map; show a static map image with the marker | Panning and zoom; focus-skip handling becomes trivial | 4 |
| API tests for draft and unknown slug; keep published case | Regression cover for the 404 path | 1 |
