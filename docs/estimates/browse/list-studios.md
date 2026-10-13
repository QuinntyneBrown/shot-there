# Estimate — List studios

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer. It assumes the app shell, central paths and titles, Prisma schema and responsive image component exist from the platform features. It assumes the `allInCost2h` and `overallScore` rules exist as shared functions from the studio review features. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/browse/list-studios/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `listStudios` application function with computed fields and default order | 4 |
| `app/api/studios/route.ts` route handler | 1 |
| API tests for published-only content, computed fields and order | 3 |
| `StudiosService`, `HttpStudiosService` and `StudioSummary` in `libs/api` | 2 |
| `StudioListPageComponent` with `StudioListState`, route and i18n | 4 |
| `StudioCardComponent` with stale indicator | 3 |
| Responsive grid at XS, SM and LG | 1 |
| Skeleton loading state with `aria-busy` and error state with retry | 3 |
| SSR transfer cache verification | 1 |
| Playwright page object and acceptance tests | 5 |
| **Total** | **27** |

## Minimal scope

The minimal scope ships the API, the service and a server-rendered page of cards in the default order, with the stale indicator. It replaces skeleton cards with plain loading text in the busy region and keeps the error state with retry. This scope totals 25 hours. It satisfies `L2-021` in full. It defers the skeleton placeholders in the first criterion of `L2-026` and satisfies the rest of `L2-026`.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Skeleton cards; keep loading text | Placeholder layout while loading | 2 |
| Separate `StudioCardComponent`; card markup in the page template | Card reuse in later features | 1 |
