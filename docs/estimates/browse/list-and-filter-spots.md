# Estimate — List and filter outdoor spots

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer. It assumes `list-studios` and `filter-and-sort-studios` are complete, so the page, card, URL query and empty-state patterns are copied rather than designed. It assumes the use-case-to-permit mapping, now `<TO SUPPLY>`, is a fixed lookup. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/browse/list-and-filter-spots/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `listSpots` application function with type, use case and permit filters | 4 |
| `spotListQuerySchema` and `app/api/spots/route.ts` | 2 |
| API tests for published-only content and each filter | 3 |
| `SpotsService`, `HttpSpotsService` and `SpotSummary` in `libs/api` | 2 |
| `SpotListQuery`, `parseSpotListQuery` and `toSpotListQueryParams` with unit tests | 3 |
| `SpotListPageComponent` with state, route, empty state and i18n | 4 |
| `SpotCardComponent` | 3 |
| `SpotFiltersComponent` | 3 |
| Playwright page object and acceptance tests | 5 |
| **Total** | **29** |

## Minimal scope

The minimal scope ships the list, the cards and the type and use case filters, held in the URL. It defers the permit filter, which depends on the `<TO SUPPLY>` use-case mapping. This scope totals 26 hours. It satisfies the card and type parts of `L2-024` and its criteria 1, 3 and 4. It defers criterion 2 of `L2-024`.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Permit filter | Filtering by "no permit needed" for a use case | 3 |
| Separate `toSpotListQueryParams` unit tests; cover through Playwright | Fast feedback on URL serialization | 1 |
