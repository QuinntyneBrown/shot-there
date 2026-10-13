# Estimate — Play an episode

## Basis

The hours assume an intermediate Angular/TypeScript developer who does not yet know this codebase. They assume the app shell, `SiteFooterComponent` and review pages exist, and that review DTOs already carry the episode video ID and title. The channel URL and poster image source are `<TO SUPPLY>`; the figures assume the poster URL arrives ready to use. Hours cover implementation, tests and review fixes, not requirements, design or mocks. [Detailed design](../../detailed-designs/video/play-episode/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `EpisodePlayerComponent` with poster link, activation, iframe, styles and i18n | 5 |
| `episode-urls.ts` embed, watch and title functions | 1 |
| Placement on review pages when an episode exists | 1 |
| Channel link in `SiteFooterComponent` with central URL constant | 1 |
| Playwright page objects and acceptance tests for poster, activation, no-JavaScript link, watch link and footer link | 5 |
| **Total** | **13** |

## Minimal scope

The minimal version ships the poster-then-iframe player with the `youtube-nocookie.com` origin, no autoplay and an iframe title. It includes the "Watch on YouTube" link and the footer channel link. It skips the dedicated no-JavaScript Playwright test and relies on the poster being a plain link. It totals 11 hours. It satisfies `L2-047` and `L2-048`, and defers only the automated proof of the no-JavaScript criterion.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| No-JavaScript Playwright test | No automated proof that the poster links to YouTube without scripts | 2 |
| Footer channel link | Channel not linked from the footer; `L2-048` partly unmet | 1 |
