# Estimate — Publish the editorial policy

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. They assume the app shell, `SiteFooterComponent`, central paths and titles, and the studio and spot list functions already exist. The policy wording comes from `L2-046`; final copy approval is outside these hours. Hours cover implementation, tests and review fixes, not requirements, design or mocks. [Detailed design](../../detailed-designs/editorial/publish-editorial-policy/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `EditorialPolicyPageComponent` with i18n-marked policy text and styles | 3 |
| `features/editorial/routes.ts`, central path and title, prerender entry | 1 |
| Footer link in `SiteFooterComponent` | 1 |
| Score-only ordering check in `listStudios` and `listSpots` | 1 |
| API tests asserting score-descending order for studios and spots | 2 |
| Playwright page objects and acceptance tests for footer link and policy statements | 3 |
| **Total** | **11** |

## Minimal scope

The minimal version ships the policy page, its route and the footer link, with one Playwright test. It relies on the existing list functions for ordering without dedicated API tests. It totals 7 hours. It satisfies the footer and policy-page criteria of `L2-046` and defers the automated proof of score-only ordering.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| API ordering tests | No automated proof that score order is exact | 2 |
| Ordering review in list functions | Placement-free ordering rests on the browse slices alone | 1 |
| Playwright footer-link check on multiple pages; check one page | Footer link verified on one page only | 1 |
