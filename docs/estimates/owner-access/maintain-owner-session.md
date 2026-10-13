# Estimate — Maintain the owner session

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. The `OwnerSession` model, `AuthService`, `HttpAuthService` and `SignInPageComponent` are assumed delivered by `sign-in-as-owner`. The expired-row cleanup schedule is `<TO SUPPLY>` and excluded from the hours. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/owner-access/maintain-owner-session/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `validateOwnerSession` with 12-hour idle and 7-day absolute checks | 3 |
| `requireOwnerSession` and 401 and 404 error mapping for admin handlers | 3 |
| `middleware.ts` for `/api/admin/:path*` | 2 |
| `GET /api/auth/session` route handler and `OwnerSessionState` | 2 |
| `POST /api/auth/sign-out` route handler and `signOutOwner` | 2 |
| `AuthService.getSession()` and `signOut()` in `HttpAuthService` | 1 |
| `ownerSessionGuard` with `returnUrl` on `/admin` routes | 3 |
| `adminUnauthorizedInterceptor` with `reason=expired` | 2 |
| `SignOutButtonComponent` with i18n text | 2 |
| Session-expired message and `returnUrl` handling on sign-in page | 2 |
| Admin navigation shown only when signed in | 1 |
| API tests for cookie attributes, idle, absolute expiry, 401, 404 and sign-out | 5 |
| Playwright acceptance tests via sign-in and admin page objects | 5 |
| **Total** | **33** |

## Minimal scope

The minimal version keeps `validateOwnerSession`, `requireOwnerSession`, the sign-out endpoint and button, and the route guard without `returnUrl`. It drops the middleware, the interceptor and the session-expired message. It takes 26 hours. It satisfies `L2-079` and the core of `L2-051`. It partially satisfies `L2-052`; return-destination preservation and the session-expired message are deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| `middleware.ts`; rely on `requireOwnerSession` alone | No cheap early rejection of cookieless admin calls | 2 |
| `adminUnauthorizedInterceptor` | Expiry during use shows an error instead of redirecting to sign-in | 2 |
| Session-expired message and `returnUrl` handling | Owner is not told why sign-in is shown and lands on the dashboard | 3 |
