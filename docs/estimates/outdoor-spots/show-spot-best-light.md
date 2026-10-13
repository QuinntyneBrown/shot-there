# Estimate — Show spot best light

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes the spot page, service and route handler from the location slice exist. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/outdoor-spots/show-spot-best-light/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `Spot` light fields and migration | 2 |
| `getSpot` mapping to `SpotLightByTimeDto` and `SpotLightBySeasonDto` in fixed order | 2 |
| Type aliases `LightRating`, `TimeOfDay`, `Season` and DTO files | 1 |
| `SpotLightComponent` with cards at XS and tables at MD, i18n labels | 5 |
| API test for light mapping | 1 |
| Playwright acceptance tests via `SpotPage` page object (Chromium) | 3 |
| Review fixes | 1 |
| **Total** | **15** |

## Minimal scope

The minimal scope renders both blocks as stacked cards at every width. It is about 12 hours, against a full total of 15 hours. It satisfies the content criteria of `L2-015` and defers the MD-and-above table layout of `L2-015`.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Table layout at MD and above | Denser desktop reading; `L2-015` criterion 3 is partly unmet | 2 |
