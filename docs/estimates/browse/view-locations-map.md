# Estimate — View locations on a map

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer. It assumes the map library and tile provider, both `<TO SUPPLY>`, offer DOM-based markers that accept focus and keyboard events. A library without such markers would raise the hours for keyboard access. It assumes the `allInCost2h` and permit summary rules exist from the studio and spot features. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/browse/view-locations-map/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `listMapLocations` application function | 3 |
| `app/api/map/locations/route.ts` route handler | 1 |
| API tests for published-only locations and key facts | 2 |
| `MapLocationsService`, `HttpMapLocationsService` and `MapLocation` in `libs/api` | 2 |
| `MapViewQuery`, `parseMapViewQuery`, `toMapViewQueryParams` and `filterMapLocations` with unit tests | 3 |
| `MapPageComponent` with route, type filter and i18n | 4 |
| `LocationsMapComponent` with browser-only rendering and distinct marker styles | 6 |
| Keyboard-focusable markers with Enter activation | 3 |
| `MapPopupComponent` with Escape and focus return | 3 |
| `MapLegendComponent` | 1 |
| `MapLocationCardComponent` and list view | 2 |
| Map and list toggle at XS and SM, side-by-side layout at LG | 3 |
| Playwright page object and acceptance tests | 6 |
| **Total** | **39** |

## Minimal scope

The minimal scope ships the API, the map with distinct markers, the legend, the type filter and the keyboard-accessible popup. At every width it shows the map above the card list instead of a toggle. This scope totals 36 hours. It satisfies `L2-027` and `L2-028`. It defers the toggle and the full-height map in `L2-029`.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Map and list toggle; stack map above list at XS and SM | Toggle between map and list at phone width | 3 |
| Type filter held in the URL; keep it in component state | Shareable and restorable type filter | 1 |
| Separate `MapLocationCardComponent`; reuse a plain list of links | Card presentation in the list view | 1 |
