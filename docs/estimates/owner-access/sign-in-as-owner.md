# Estimate — Sign in as the owner

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. The Angular app, the `libs/api` library, the Next.js API and Prisma are assumed scaffolded. The `argon2` package is assumed to install without native build issues. Each `<TO SUPPLY>` item (client IP header, `argon2id` cost parameters, owner provisioning) is assumed to need one short decision. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/owner-access/sign-in-as-owner/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| Prisma models `Owner`, `OwnerSession`, `SignInAttempt` and migration | 2 |
| `signInSchema` zod schema | 1 |
| `verifyPassword` with `argon2id` and dummy-hash timing path | 3 |
| `createOwnerSession` with random token and stored hash | 2 |
| `checkSignInRateLimit` per client and per account | 3 |
| `signInOwner` orchestration and failed-attempt recording | 3 |
| `POST /api/auth/sign-in` route handler, cookie and client key | 3 |
| `AuthService`, `HttpAuthService`, `SignInRequest`, `SignInResult` | 2 |
| `SignInPageComponent`, view model, i18n messages and XS layout | 5 |
| API tests for 204, 400, 401, 429 and timing | 4 |
| Playwright acceptance tests via sign-in page object | 4 |
| **Total** | **32** |

## Minimal scope

The minimal version keeps the sign-in page, `argon2id` verification, the generic failure message and session creation. It enforces only the per-client limit and drops the dummy-hash timing path with its test. It takes 28 hours. It satisfies `L2-049` except the 100 ms timing criterion. It partially satisfies `L2-050`; the per-account limit and the timing criterion are deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Per-account limit; keep per-client limit only | Distributed guessing against the account is not slowed | 1 |
| Dummy-hash timing path | Unknown-email failures may answer faster than wrong-password failures | 2 |
| Timing assertion in API tests | The 100 ms criterion is not checked automatically | 1 |
| 400 path for malformed bodies; treat as 401 | Malformed input is not distinguished from bad credentials | 1 |
