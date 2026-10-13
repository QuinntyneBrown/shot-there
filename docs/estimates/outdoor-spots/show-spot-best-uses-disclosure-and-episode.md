# Estimate — Show spot best uses, disclosure and episode

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes the spot page, the spot list with a use-case filter, and the episode embed component from `video/play-episode` exist. The disclosure text source is `<TO SUPPLY>`; the hours assume one stored string. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/outdoor-spots/show-spot-best-uses-disclosure-and-episode/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `Spot` fields `bestUses`, disclosure and `videoId` with migration | 2 |
| `getSpot` mapping and `BestUse` type | 1 |
| `SpotBestUsesComponent` with filtered list links from central paths, i18n | 3 |
| `SpotDisclosureComponent`, i18n | 1 |
| Conditional episode embed in a 16:9 container | 2 |
| API test for tag, disclosure and video mapping | 1 |
| Playwright acceptance tests via `SpotPage` page object (Chromium) | 3 |
| Review fixes | 1 |
| **Total** | **14** |

## Minimal scope

The minimal scope shows tags as plain text, the disclosure, and the conditional episode embed. It is about 12 hours, against a full total of 14 hours. It satisfies `L2-020` and the display criterion of `L2-019`; the filtered-list link of `L2-019` is deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Tag links to the filtered spot list | Navigation from a tag to matching spots | 2 |
