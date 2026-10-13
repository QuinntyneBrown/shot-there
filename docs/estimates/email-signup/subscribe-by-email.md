# Estimate — Subscribe by email

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer who does not yet know this codebase. They assume the app shell, site footer, home page, Prisma client and API test harness already exist. The rate-limit counter store is `<TO SUPPLY>`; the figures assume an in-process store on a single instance. Hours cover implementation, tests and review fixes, not requirements, design or mocks. [Detailed design](../../detailed-designs/email-signup/subscribe-by-email/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `EmailSignupComponent` with template, styles, view states, XS stacking and live region | 6 |
| `signup-form.ts` validation and status mapping, `SignupState` | 2 |
| `SubscriberService`, `HttpSubscriberService`, `SubscribeRequest` and provider registration | 2 |
| Placement in the site footer and `HomePageComponent`, i18n markup | 1 |
| `Subscriber` Prisma model and migration | 1 |
| `subscribeSchema` zod schema | 1 |
| `app/api/subscribers/route.ts` route handler with status mapping | 2 |
| `subscribe` with honeypot check, lowercase and upsert | 2 |
| `checkRateLimit` per-client one-minute window | 3 |
| API tests for 200, 400, 429, honeypot and stored fields | 4 |
| Playwright page object and acceptance tests for success, invalid, repeat, busy, 429, 500 and XS | 6 |
| **Total** | **30** |

## Minimal scope

The minimal version ships the footer form with client and server validation. It stores the lowercase email with timestamp and source path, returns success for a repeat address, and keeps the honeypot. It shows one generic failure message. It omits the rate limiter, the dedicated 429 message and the home-page placement. It totals 24 hours. It satisfies `L2-039` except home-page placement and `L2-041` except the 429 message. It defers the rate-limit criterion of `L2-040`.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| `checkRateLimit` and its API test | No HTTP 429 protection against bulk signups | 4 |
| Dedicated 429 message; show the generic failure | Visitor is not told to wait a minute | 1 |
| Home-page placement; footer only | Signup appears only in the footer | 1 |
| Honeypot field and its test | Scripted submissions are stored | 1 |
