# Estimate — Show studio episode

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes the shared studio page, service and endpoint exist and that the episode player from video/play-episode is built and estimated separately. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/studio-reviews/show-studio-episode/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| Prisma `youtubeVideoId` and `episodeTitle` fields and migration | 1 |
| `getStudio` episode mapping and DTO types | 1 |
| `StudioEpisodeComponent` with conditional render and 16:9 container | 2 |
| API test for present and absent episode | 1 |
| Playwright page object and acceptance tests | 3 |
| Review fixes | 1 |
| **Total** | **9** |

## Minimal scope

The minimal scope equals the full design, since the section is a thin host for the shared player. It satisfies `L2-013` and defers none. Total: 9 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| API test for absent episode; rely on Playwright | Null episode is covered only end to end | 1 |
