# Estimate — Show studio verdict and disclosure

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes `StudioPageComponent`, `StudioService` and `GET /api/studios/[slug]` already exist from the show-studio-basics-and-pricing feature. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/studio-reviews/show-studio-verdict-and-disclosure/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| Prisma verdict, score and disclosure fields and migration | 2 |
| `computeOverallScore` with unit tests | 1 |
| `getStudio` mapping and DTO types on both sides | 2 |
| `StudioVerdictComponent` with accessible score text | 4 |
| `StudioDisclosureComponent` and view model with i18n messages | 3 |
| API tests for `overallScore` and disclosure | 2 |
| Playwright page object and acceptance tests | 4 |
| Review fixes | 1 |
| **Total** | **19** |

## Minimal scope

The minimal scope ships the verdict with the server-computed overall score and the disclosure with its three messages. It selects the disclosure message inside the component instead of a separate view model. It satisfies `L2-011` and `L2-012` and defers none. Total: 18 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Separate disclosure view model | Message selection sits in the component | 1 |
| Visual score bars; keep numbers only | Scores show as text without a graphic | 1 |
