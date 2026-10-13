# Estimate — Create and edit a studio

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. They assume the owner session check, the owner route guard, the central app paths, the app shell and the Prisma models already exist. Image upload, video ID validation, publish, delete and unsaved-changes protection are estimated in their own features. The `<TO SUPPLY>` units for space and ceiling height do not change the number. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/content-management/edit-studio/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `studioInputSchema` with field rules and unit tests | 4 |
| `lib/slugs/assign-unique-slug.ts` with unit tests | 2 |
| `createStudio` with default price date and transaction | 3 |
| `updateStudio` with fee and gear replacement and price date rule | 4 |
| `getStudioForEdit` | 1 |
| `POST`, `GET` and `PUT` route handlers with session check and HTTP 400 and 404 mapping | 3 |
| DTO types, `StudioEditorService` and `HttpStudioEditorService` | 3 |
| `studio-form.ts` form model, mapping and fee and gear rows | 5 |
| `studio-editor-messages.ts` and server error mapping onto controls | 3 |
| `price-verification-rule.ts` and confirmation prompt | 3 |
| `StudioEditorPageComponent` sections, collapsible headings, XS layout, i18n | 10 |
| Routes for new and edit paths | 1 |
| API tests for validation, slug suffix, draft status and price date | 5 |
| Playwright page object and acceptance tests for both requirements | 7 |
| **Total** | **54** |

## Minimal scope

The minimal version creates and edits a studio with basics, pricing with fees, rubric scores, verdict and disclosure, including server validation, field-level messages, draft status and the slug suffix. It keeps the price date default, the future-date refusal and the unchanged-on-unrelated-edit rule, but drops the confirmation prompt. Specifications, gear and logistics sections are deferred. It satisfies `L2-054` in part and `L2-042` except criterion 2. The minimal scope totals 40 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Price date confirmation prompt; show the date field only | The owner can change prices without re-confirming the date | 3 |
| Gear section | Gear lists are entered later | 3 |
| Collapsible section headings; plain headings | Longer scroll on phones | 2 |
| Specifications and logistics sections | Measured specifications are entered later | 4 |
