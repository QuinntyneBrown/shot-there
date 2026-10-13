# Estimate — Browse guides

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who is productive in both stacks and does not yet know this codebase. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. The app shell with `SiteNavComponent`, `AppPaths` and the `Guide` model exist from other features. The index order is `<TO SUPPLY>` and does not move the number. [Detailed design](../../detailed-designs/guides/browse-guides/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `GET /api/guides` route handler and `listGuides` | 3 |
| `GuideSummaryDto` and `listGuides()` on `GuideService` and `HttpGuideService` | 1 |
| `GuidesIndexPageComponent` with route, i18n text and empty state | 4 |
| Main navigation links to Studios, Spots, Map, Compare and Guides | 1 |
| API tests for `GET /api/guides` | 2 |
| Playwright page objects and acceptance tests for `L2-035` | 4 |
| Review fixes | 1 |
| **Total** | **16** |

## Minimal scope

The full design is already close to minimal. The minimal scope drops the empty-state message and the API tests, relying on Playwright tests against seeded data. It totals 13 hours. `L2-035` remains fully satisfied; nothing is deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Empty-state message | An empty index shows a blank list | 1 |
| API tests for `GET /api/guides` | Draft filtering covered only by Playwright tests | 2 |
