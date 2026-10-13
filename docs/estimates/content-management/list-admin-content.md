# Estimate — List content in the administration area

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. They assume the owner session check, the owner route guard, the central app paths and `lib/freshness/verification-age.ts` from `view-admin-dashboard` already exist. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/content-management/list-admin-content/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `lib/admin/list-admin-content.ts` for three kinds with stale flag | 3 |
| `GET` handlers in `app/api/admin/studios`, `spots` and `guides` route files | 2 |
| DTO types, `AdminContentService` and `HttpAdminContentService` | 2 |
| `admin-content-list-filter.ts` with unit tests | 1 |
| `AdminContentListPageComponent` table, XS cards, search box, empty and no-results states, i18n | 6 |
| Three route entries in `features/admin/routes.ts` | 1 |
| API tests for ordering, stale flag, drafts included and HTTP 401 | 3 |
| Playwright page object and acceptance tests | 4 |
| **Total** | **22** |

## Minimal scope

The minimal version ships the studio list only, with status, last-updated date, stale flag, search and edit links, including the XS card layout. Spot and guide lists are deferred. It satisfies `L2-063` for studios and defers the spot and guide parts of `L2-063`. The minimal scope totals 16 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Guide list | Owner reaches guides only from the dashboard creation link and direct edit URLs | 2 |
| Spot list | Owner reaches spots only from the dashboard re-verification list | 2 |
| Separate no-results state; show an empty table | Less clear feedback when a search matches nothing | 1 |
