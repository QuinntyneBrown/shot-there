# Estimate — View the administration dashboard

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. They assume the owner session check, the owner route guard, the central app paths, the app shell and the Prisma models already exist. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/content-management/view-admin-dashboard/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `lib/freshness/verification-age.ts` with unit tests for the 153 and 183 day boundaries | 2 |
| `lib/admin/get-dashboard.ts` counts and ordered re-verification entries | 4 |
| `app/api/admin/dashboard/route.ts` with owner session check | 1 |
| DTO types, `AdminDashboardService` and `HttpAdminDashboardService` | 2 |
| `AdminDashboardViewModel` tile labels, groups and edit links | 2 |
| `AdminDashboardPageComponent` template, styles, XS layout and i18n markers | 5 |
| Route registration in `features/admin/routes.ts` | 1 |
| API tests for counts, groups, ordering and HTTP 401 | 3 |
| Playwright page object and acceptance tests for both requirements | 4 |
| **Total** | **24** |

## Minimal scope

The minimal version shows the three count tiles, the creation links and one "Needs re-verification" list of stale entries ordered oldest first, each with an edit link. It omits the "Due soon" group. It satisfies `L2-053` in full and `L2-044` except its "Due soon" criterion, which is deferred. The minimal scope totals 20 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| "Due soon" group | The owner sees data only after it turns stale | 2 |
| View model as a separate file; compute labels in the page class | Labels are harder to unit test | 1 |
| API tests for ordering; rely on acceptance tests | Ordering regressions surface later | 1 |
