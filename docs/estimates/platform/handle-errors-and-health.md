# Estimate — Handle errors and report health

## Basis

The hours assume an intermediate Angular/TypeScript and Next.js developer working in the scaffolded `frontend/` and `backend/` projects, with Prisma and Playwright available. The spot map and episode player components are assumed to exist from their own features; this estimate covers only their fallback behaviour. The map library and external map URL format are `<TO SUPPLY>`; the hours assume the library exposes a tile error event. Hours cover implementation, tests, and review fixes. [Detailed design](../../detailed-designs/platform/handle-errors-and-health/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `NotFoundPageComponent`, wildcard route, and `serverRoutes` status 404 | 3 |
| `ErrorPageComponent` and SSR 500 error handler in `server.ts` | 4 |
| `GET /api/health` handler, `checkHealth`, and `HealthStatus` | 3 |
| `logger`, `redact`, and `maskEmail` | 3 |
| `withRequestLogging` with correlation ID and error logging, applied to handlers | 4 |
| `FallbackImageDirective` with stable slot size | 3 |
| `MapUnavailableComponent` and tile-failure wiring | 3 |
| Video poster fallback keeping "Play episode" usable | 1 |
| Playwright page objects and tests for error pages and media fallbacks | 6 |
| API tests for health and log output | 4 |
| **Total** | **34** |

## Minimal scope

The minimal version keeps the not-found page with its 404 status, the health endpoint, `logger` with `redact` and `withRequestLogging`, and `FallbackImageDirective`, with their tests. It drops the dedicated SSR 500 error page in favour of a static error response, `MapUnavailableComponent`, and the poster fallback. The minimal scope totals 25 hours. It satisfies `L2-084` and `L2-085`. It partially satisfies `L2-083` and `L2-086`, deferring the branded 500 page and the map and poster fallbacks.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Branded `ErrorPageComponent`; serve a static 500 page | Branded error page with navigation | 3 |
| `MapUnavailableComponent`; leave the map area empty on failure | Coordinates and external map link when tiles fail | 3 |
| Reuse of incoming correlation ID header; always generate a new one | Correlation across an upstream proxy | 1 |
