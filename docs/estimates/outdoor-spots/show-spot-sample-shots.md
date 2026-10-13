# Estimate — Show spot sample shots

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes the spot page and route handler exist, the gallery lightbox from the studio slice is built and reusable, and the image pipeline already writes `Image` and `ImageVariant` rows. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/outdoor-spots/show-spot-sample-shots/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| Spot-to-image link and order in Prisma, with migration | 3 |
| `getSpot` mapping to `SpotSampleShotDto` with `srcset` from variants | 3 |
| `SpotSampleShotsComponent` grid (2 columns XS, 4 columns LG) and captions, i18n | 4 |
| Wiring the reused gallery lightbox with focal length and note caption | 2 |
| API test for sample-shot mapping | 1 |
| Playwright acceptance tests via `SpotPage` page object (Chromium) | 3 |
| Review fixes | 1 |
| **Total** | **17** |

## Minimal scope

The minimal scope shows thumbnails with captions and opens the reused lightbox, with a single-size image instead of a `srcset`. It is about 16 hours, against a full total of 17 hours. It satisfies `L2-016` in full; only image weight on small screens is worse.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| `srcset` from variants; serve the 960 variant only | Smaller downloads on phones | 1 |
