# Estimate — Show rain backup studios

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes the spot page, studio coordinates and the server-side `allInCost2h` computation from the studio slices exist. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/outdoor-spots/show-rain-backup-studios/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `findNearestStudios` with haversine distance, draft exclusion and top three, with unit tests | 4 |
| `getSpot` integration and `RainBackupStudioDto` | 1 |
| `RainBackupComponent` list with links, distance format and all-in cost, i18n | 3 |
| Empty state with studio list link (`L2-038`) | 1 |
| API tests for five studios, one studio, nearest draft and none | 2 |
| Playwright acceptance tests via `SpotPage` page object (Chromium) | 3 |
| Review fixes | 1 |
| **Total** | **15** |

## Minimal scope

The full design is already close to minimal. The smallest version drops the all-in cost column and is about 14 hours, against a full total of 15 hours. It satisfies `L2-038` and the ordering, distance and link parts of `L2-037`; the all-in cost part of `L2-037` is deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| All-in cost per studio | Price comparison within the rain backup list | 1 |
