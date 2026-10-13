# Estimate — View a guide

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who is productive in both stacks and does not yet know this codebase. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. The studio and spot card components, `AppPaths`, the not-found page and the shared `allInCost2h` computation exist from other features. The data-point configuration is `<TO SUPPLY>`; the hours assume one field on `Guide` listing data-point keys. [Detailed design](../../detailed-designs/guides/view-guide/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `GET /api/guides/[slug]` route handler with 404 | 2 |
| `getGuide` with ordering, draft omission and live data points | 6 |
| `GuideDto`, `GuideEntryDto` and `GuideDataPointDto` types | 1 |
| `GuideService` and `HttpGuideService` | 2 |
| `GuidePageComponent` with route, i18n text and one-column layout | 4 |
| `GuideEntryComponent` and `guide-view-model.ts` | 4 |
| API tests for `GET /api/guides/{slug}` | 3 |
| Playwright page object and acceptance tests for `L2-034` | 5 |
| Review fixes | 2 |
| **Total** | **29** |

## Minimal scope

The minimal scope supports studio entries only and shows all-in cost as the single data point for every guide. It keeps ordering, draft omission, live values, the editor's note and the review link. It totals 23 hours. `L2-034` criteria 1–4 remain satisfied for studio guides; spot entries and per-guide data points are deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Spot entries | Guides can list studios only | 3 |
| Per-guide data-point selection | Every guide shows all-in cost only | 3 |
