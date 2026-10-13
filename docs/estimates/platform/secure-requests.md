# Estimate — Secure requests

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer working in the scaffolded `frontend/` and `backend/` projects, with Prisma, zod, and GitHub Actions available. The `OwnerSession` model and sign-in flow are assumed to exist from the owner access feature; this estimate adds only the `csrfToken` column and cookie. The map provider origin and the secret scanner are `<TO SUPPLY>`; the hours assume a scanner available as a ready-made CI step. Hours cover implementation, tests, and review fixes. [Detailed design](../../detailed-designs/platform/secure-requests/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `securityHeaders` map with CSP, nosniff, Referrer-Policy, and HSTS | 2 |
| `middleware.ts` with HTTPS redirect, `Content-Length` limit, and headers | 3 |
| `server.ts` security headers and HTTPS redirect for pages | 2 |
| `readJsonBody` streamed 1 MB limit and `PayloadTooLargeError` | 2 |
| `parseWithSchema` and `ValidationProblem` | 3 |
| Strict zod schema conventions applied to `studioSaveSchema` | 2 |
| `OwnerSession.csrfToken` migration and `st_csrf` cookie on sign-in | 2 |
| `verifyCsrf` with Origin check and constant-time compare | 2 |
| Angular `withXsrfConfiguration` setup | 1 |
| `.env.example` files documenting configuration | 1 |
| CI audit, secret scan, and bundle secret check steps | 4 |
| API tests for 400, 403, 413, 301, and headers | 5 |
| Playwright HTML-escaping test via `StudioEditPage` page object | 2 |
| **Total** | **31** |

## Minimal scope

The minimal version keeps `middleware.ts` with the shared headers and size limit, `parseWithSchema` with strict schemas, `verifyCsrf` with the Angular XSRF configuration, and the CI `npm audit` step, with API tests for each. It drops the streamed `readJsonBody` limit, the web server header and redirect code in favour of hosting configuration, the bundle secret check, and the Playwright escaping test. The minimal scope totals 21 hours. It satisfies `L2-078` and `L2-082` acceptance criterion 1. It partially satisfies `L2-080`, leaving page-response headers to hosting configuration, and defers the secret scan of `L2-082`.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Streamed `readJsonBody` limit; keep `Content-Length` check only | Chunked bodies without a length header bypass the limit | 2 |
| Bundle secret check in CI | Automated proof that no secret reaches the client bundle | 2 |
| Origin check inside `verifyCsrf`; keep token check only | Second defence layer against forged writes | 1 |
| Playwright escaping test | End-to-end proof that stored HTML renders as text | 2 |
