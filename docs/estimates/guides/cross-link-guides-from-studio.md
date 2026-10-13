# Estimate — Cross-link guides from a studio

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who is productive in both stacks and does not yet know this codebase. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. `StudioPageComponent`, `StudioService`, `HttpStudioService`, `getStudio` and the studio route exist from the studio-reviews features; this slice extends them. The link order is `<TO SUPPLY>` and does not move the number. [Detailed design](../../detailed-designs/guides/cross-link-guides-from-studio/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `listGuidesForStudio` and wiring into `getStudio` | 3 |
| `GuideLinkDto` and `StudioDto.featuredIn` field | 1 |
| `FeaturedInComponent` with i18n text and conditional rendering | 2 |
| API tests for `featuredIn` on `GET /api/studios/{slug}` | 2 |
| Playwright page object additions and acceptance tests for `L2-036` | 3 |
| Review fixes | 1 |
| **Total** | **12** |

## Minimal scope

The full design is already the minimal shippable slice. Dropping the API tests leaves a 10-hour scope in which `L2-036` remains fully satisfied, with published-guide filtering covered only by Playwright tests. Nothing is deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| API tests for `featuredIn` | Draft-guide filtering covered only by Playwright tests | 2 |
