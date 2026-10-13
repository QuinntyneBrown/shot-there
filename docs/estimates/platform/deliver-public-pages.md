# Estimate — Deliver public pages

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who has not seen this codebase. The Angular workspace, `libs/api`, Prisma setup and the public page components of other features already exist. The hosting provider is `<TO SUPPLY>`; the hours assume a provider with a documented per-route regeneration or purge API. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/platform/deliver-public-pages/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `@angular/ssr` setup, `server.ts` and `app.routes.server.ts` with `RenderMode.Prerender` and route report | 6 |
| `PublicRoutesService`, `HttpPublicRoutesService` and `PublicRoutesDto` | 2 |
| `app/api/public-routes/route.ts` and `listPublicRoutes` | 2 |
| `urlNormalisationMiddleware` (lowercase and trailing-slash 301) | 3 |
| `SlugRedirect` Prisma model, migration and `ContentType` enum | 2 |
| `toSlug`, `recordSlugChange` and `findSlugRedirect` | 4 |
| `app/api/slug-redirects/[type]/[slug]/route.ts` and `slugRedirectParamsSchema` | 2 |
| `slugRedirectMiddleware`, `SlugRedirectService`, `HttpSlugRedirectService` and `SlugRedirectDto` | 3 |
| `publicCacheHeaders` middleware and immutable image cache header | 2 |
| `affectedRoutes` and `triggerRegeneration` with hosting provider integration | 8 |
| Hosting and CDN configuration and deployment | 6 |
| Lighthouse CI budgets and k6 load check for the studio list API | 5 |
| API tests for route handlers and lib functions | 5 |
| Playwright acceptance tests via page objects (JavaScript disabled, redirects, cache headers) | 6 |
| **Total** | **56** |

## Minimal scope

The minimal scope ships full prerendering on each build, URL normalisation and the public cache header. It drops `SlugRedirect`, the slug redirect lookup and the targeted regeneration trigger. A publish then triggers a full rebuild through a provider deploy hook. It satisfies `L2-074`, the cache-header part of `L2-073`, the lowercase and trailing-slash parts of `L2-075`, and the static-delivery part of `L2-087`. It defers old-slug redirects in `L2-075`, the 60-second visibility and load criteria of `L2-073`, the targeted regeneration criterion of `L2-087`, and the automated budget checks of `L2-071`. The minimal scope totals 30 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Targeted regeneration; rebuild the whole site on publish | Publishes take build time to appear and may exceed 60 seconds | 5 |
| Slug redirects and the `SlugRedirect` model | Renamed items return 404 at old URLs | 11 |
| Lighthouse CI and k6 automation; measure manually before release | Budget regressions are not caught per build | 5 |
| Route report from the build | No listing of generated routes for review | 1 |
