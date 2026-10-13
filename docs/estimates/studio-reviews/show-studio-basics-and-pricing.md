# Estimate — Show studio basics and pricing

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes Angular SSR, `libs/api` and Prisma are scaffolded. `StudioPageComponent`, `StudioService` and the `GET /api/studios/[slug]` route are first built here and reused by the other studio-reviews features. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/studio-reviews/show-studio-basics-and-pricing/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `StudioPageComponent`, route entry and not-found handling | 4 |
| `StudioService` and `HttpStudioService` | 2 |
| `GET /api/studios/[slug]` route handler and `getStudio` with published-only filter | 4 |
| `StudioDetailDto` types on both sides | 1 |
| Prisma `Studio` and `StudioFee` fields and migration | 2 |
| `computeAllInCost2h` with unit tests | 2 |
| `isStale` with boundary unit tests | 1 |
| `StudioBasicsComponent` with i18n and XS layout | 3 |
| `StudioPricingComponent` and view model with currency, long date and status warning | 5 |
| API tests for `allInCost2h` and `priceStale` | 3 |
| Playwright page object and acceptance tests | 5 |
| Review fixes | 2 |
| **Total** | **34** |

## Minimal scope

The minimal scope ships the shared page, service and endpoint, the basics block, and the pricing block with the server-computed all-in cost. It drops the separate view model and shows fees in one list with a mandatory or optional label. It still satisfies `L2-003` and `L2-004`. It defers `L2-005` and `L2-043` by omitting the verified date, `isStale` and the stale warning. Total: 27 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Stale warning and `isStale` | No stale flag on the page; `L2-005` and `L2-043` unmet | 3 |
| Pricing view model | Fee grouping logic sits in the component | 1 |
| XS layout checks in Playwright | Phone-width overflow has no automated guard | 1 |
