# Estimate — Create and edit an outdoor spot

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. They assume the owner session check, the owner route guard, the central app paths, `assignUniqueSlug` and `FieldErrors` from `edit-studio`, and the spot map component from `show-spot-location-and-directions` already exist. The `<TO SUPPLY>` map tile provider is assumed to be already wired into that map component. Image upload, video ID validation, the publish check, delete and unsaved-changes protection are estimated in their own features. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/content-management/edit-outdoor-spot/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `spotInputSchema` with ranges, fixed sets and unit tests | 4 |
| `createSpot` with permit rows and default verified dates | 3 |
| `updateSpot` with permit rows and verified date rule | 3 |
| `getSpotForEdit` | 1 |
| `POST`, `GET` and `PUT` route handlers with session check and HTTP 400 and 404 mapping | 3 |
| DTO and enum types, `SpotEditorService` and `HttpSpotEditorService` | 3 |
| `spot-form.ts` form model, mapping and coordinates signal | 5 |
| `spot-editor-messages.ts` and server error mapping onto controls | 2 |
| Preview map binding to coordinates | 2 |
| `SpotEditorPageComponent` sections, light and permit grids, XS layout, i18n | 10 |
| Routes for new and edit paths | 1 |
| API tests for ranges, tampered enums, draft status and permit dates | 4 |
| Playwright page object and acceptance tests | 6 |
| **Total** | **47** |

## Minimal scope

The minimal version creates and edits a spot with basics, coordinates, directions, permit status per shoot type, best uses and disclosure, with server validation, HTTP 400 on tampered values and field-level messages. Light by time and season, practical conditions and the preview map are deferred. It satisfies `L2-055` criteria 1, 2 and 3 and defers criterion 4 and the light and conditions fields. The minimal scope totals 36 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Preview map | The owner cannot confirm the position visually while typing | 2 |
| Practical conditions section | Crowds, parking, washrooms and changing options are entered later | 3 |
| Light by time and season section | Best-light data is entered later | 5 |
