# Estimate — Show studio specifications

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes `StudioPageComponent`, `StudioService` and `GET /api/studios/[slug]` already exist from the show-studio-basics-and-pricing feature. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/studio-reviews/show-studio-specifications/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| Prisma specification, logistics and `GearItem` fields and migration | 3 |
| `getStudio` mapping for the three DTO parts | 2 |
| Enumerations and DTO types on both sides | 2 |
| `StudioSpecificationsComponent` and view model with unit conversion | 5 |
| `StudioGearComponent` with categories, quantities and empty extras | 3 |
| `StudioLogisticsComponent` with responsive grid | 3 |
| API tests for the three DTO parts | 2 |
| Playwright page object and acceptance tests | 5 |
| Review fixes | 2 |
| **Total** | **27** |

## Minimal scope

The minimal scope renders all three sections as label and value lists that share one responsive layout. It keeps the metres-to-feet conversion, the cyc wall rule, the empty-extras statement and "None" for an absent changing area. It drops grouping of included gear by category. It satisfies `L2-006`, `L2-007` and `L2-008` and defers none. Total: 22 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Gear grouping by category | Included gear shows as one flat list | 1 |
| Four-column natural-light row at MD | Light ratings stay stacked at every width; `L2-006` criterion 4 unmet | 1 |
| Separate specifications view model | Unit formatting sits in the component | 1 |
