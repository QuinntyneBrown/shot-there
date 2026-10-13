# Estimate — Create, edit and publish a guide

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. They assume the owner session check, the owner route guard, the central app paths, the UI framework dialog primitive, `assignUniqueSlug` and `FieldErrors` from `edit-studio`, and the public cache refresh from `publish-and-unpublish-location` already exist. Delete and unsaved-changes protection are estimated in their own features. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/content-management/edit-guide/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `guideInputSchema` with duplicate rule and unit tests | 2 |
| `createGuide`, `updateGuide` and `getGuideForEdit` with ordered entries | 5 |
| `searchGuideCandidates` with name index | 2 |
| `publishGuide` and `unpublishGuide` | 2 |
| Four route files with session checks and error mapping | 3 |
| DTO types, `GuideEditorService` and `HttpGuideEditorService` | 3 |
| `guide-form.ts` add, move, remove and duplicate refusal with unit tests | 3 |
| `GuideEntryPickerDialogComponent` keyboard combobox | 5 |
| `GuideEditorPageComponent` form, entry list, publish actions, XS layout, i18n | 7 |
| Routes for new and edit paths | 1 |
| API tests for order, duplicates, search and publish refusal | 4 |
| Playwright page object and acceptance tests | 5 |
| **Total** | **42** |

## Minimal scope

The minimal version creates and edits a guide with ordered entries, the duplicate refusal, the entry picker and publish with the `entries` check. Unpublish and server-side candidate search are deferred; the picker searches a list loaded once when the dialog opens, reusing the admin list endpoints. It satisfies the core of `L2-060` and defers its unpublish clause. The minimal scope totals 37 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Unpublish action | A published guide is withdrawn only by deletion | 2 |
| Server candidate search; filter admin lists in the browser | Picker loads all locations up front | 2 |
| Move-up and move-down; order by addition | Reordering needs remove and re-add | 2 |
