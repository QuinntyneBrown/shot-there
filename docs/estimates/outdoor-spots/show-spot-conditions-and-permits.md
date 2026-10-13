# Estimate — Show spot conditions and permits

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes the spot page and route handler exist. The 183-day rule is fixed by the specification. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/outdoor-spots/show-spot-conditions-and-permits/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `Spot` condition fields, `PermitStatus` model and migration | 3 |
| `isPermitStale` in `lib/spots/is-permit-stale.ts` with unit tests | 2 |
| `getSpot` mapping to `SpotConditionsDto` and `SpotPermitsDto` | 2 |
| Type aliases and DTO files | 1 |
| `SpotConditionsComponent` with fallbacks and XS label-above-value layout, i18n | 4 |
| `SpotPermitsComponent` with source link, verified date and stale warning, i18n | 4 |
| API tests for permit rows and stale flag at 10 and 190 days | 2 |
| Playwright acceptance tests via `SpotPage` page object (Chromium) | 4 |
| Review fixes | 2 |
| **Total** | **24** |

## Minimal scope

The minimal scope ships `L2-018` only: the permit table, source link, verified date and stale warning. It is about 17 hours, against a full total of 24 hours. It satisfies `L2-018` and defers `L2-017`.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Practical conditions block (`L2-017`) | Crowds, parking, washrooms and changing options | 7 |
| XS label-above-value layout; keep one table at all widths | Phone layout may scroll horizontally, so `L2-017` criterion 3 fails | 1 |
