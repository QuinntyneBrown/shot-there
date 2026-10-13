# Estimate — View a side-by-side comparison

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who is productive in both stacks and does not yet know this codebase. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. The page-title helper, `AppPaths`, SSR setup and the shared computation of `allInCost2h`, `overallScore` and `priceStale` exist from other features. The rubric categories and natural-light format follow the studio page. [Detailed design](../../detailed-designs/comparison/view-comparison/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `compareQuerySchema` and `GET /api/compare` route handler | 3 |
| `getComparison` with URL order, unknown-slug filtering, 4 cap and lowest-cost flag | 6 |
| `ComparisonDto` and `ComparedStudioDto` types | 2 |
| `CompareService` and `HttpCompareService` | 2 |
| `ComparePageComponent` with notices, i18n text and route | 6 |
| `comparison-view-model.ts` rows, dash cells and Lowest marker, plus unit tests | 5 |
| Sticky row labels, 160px columns and LG fit in `compare-page.css` | 4 |
| Copy link with clipboard and announcement | 2 |
| Server rendering check, title and description metadata | 2 |
| API tests for `GET /api/compare` | 4 |
| Playwright page object and acceptance tests for `L2-031` to `L2-033` | 8 |
| Review fixes | 3 |
| **Total** | **47** |

## Minimal scope

The minimal scope delivers the API, the server-rendered table with every `L2-031` row, URL-driven order with the unknown-slug, under-2 and over-4 messages, and the title. It drops "Copy link", the description metadata and the view-model unit tests. It totals 42 hours. `L2-031` and `L2-033` remain satisfied; `L2-032` criterion 5 (Copy link) is deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Copy link action | Visitors copy the address bar manually | 2 |
| Description metadata | Shared links show no description | 1 |
| View-model unit tests | Row rules covered only by Playwright tests | 2 |
| Standard test shots row | Shots are not compared; `L2-031` criterion 1 is partly unmet | 4 |
