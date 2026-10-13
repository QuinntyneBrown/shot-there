# Estimate — Filter and sort studios

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer. It assumes `list-studios` is complete, including `StudioListPageComponent`, `StudiosService` and `GET /api/studios`. It assumes the UI framework supplies an accessible dialog primitive; the framework is `<TO SUPPLY>`. Hours rest on in-memory filtering over a small catalogue, whose size is `<TO SUPPLY>`. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/browse/filter-and-sort-studios/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `StudioListQuery`, `StudioSort` and related types | 1 |
| `parseStudioListQuery`, `toStudioListQueryParams` and `countActiveFilters` with unit tests | 5 |
| `StudioListPageComponent` URL binding, Back and Forward handling | 3 |
| `StudioFiltersComponent` with seven filter controls and i18n | 6 |
| `StudioFiltersDialogComponent` full-height dialog at XS | 3 |
| LG sidebar layout and active filter count badge | 2 |
| `StudioSortControlComponent` with live announcement | 2 |
| Empty state with "Clear filters" | 1 |
| `HttpStudiosService` query parameters | 1 |
| `studioListQuerySchema` zod schema | 2 |
| `listStudios` filters and sort with tie-breaking | 4 |
| API tests for filters, sort and lenient parsing | 4 |
| Playwright page object and acceptance tests | 7 |
| **Total** | **41** |

## Minimal scope

The minimal scope keeps all seven filters, the sort and the URL state, so the core of all three requirements holds. It presents filters in one panel at every width, without the XS dialog. It drops the active filter count badge and the live sort announcement. This scope totals 36 hours. It satisfies `L2-025` in full. It defers criterion 5 and criterion 6 of `L2-022`, and criterion 3 of `L2-023`.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| `StudioFiltersDialogComponent`; show the filter panel inline at XS | Full-height filter dialog at XS | 3 |
| Active filter count badge | Count of active filters on the filters control | 1 |
| Live announcement of sort changes | Sort change announced to assistive technology | 1 |
| Separate client-side `countActiveFilters` unit tests; cover through Playwright | Fast feedback on badge counting | 1 |
