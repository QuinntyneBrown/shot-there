# Estimate — Emit metadata and sitemap

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who has not seen this codebase. Server rendering from `deliver-public-pages`, the public page components, `StudioDto`, `SpotDto` and the `sharp` pipeline from `serve-responsive-images` already exist. `SITE_ORIGIN` and the default Open Graph image are `<TO SUPPLY>`; the hours assume both arrive before work starts. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/platform/emit-metadata-and-sitemap/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `PageMetadataService`, `PageMetadata` and `SITE_ORIGIN` token | 4 |
| Metadata calls in each public page component and admin `noIndex` route data | 4 |
| `buildStudioJsonLd` and `buildSpotJsonLd` with Schema.org validation | 4 |
| `generateOgImage` and `ogImageUrl` on `StudioDto` | 3 |
| `app/api/sitemap-entries/route.ts` and `listSitemapEntries` | 3 |
| `SitemapService`, `HttpSitemapService`, `SitemapEntryDto` and `sitemap.route.ts` XML serialiser | 4 |
| `robots.txt` static file | 1 |
| API tests for `listSitemapEntries` and the route handler | 2 |
| Playwright acceptance tests via page objects (head tags, JSON-LD, sitemap, robots, admin noindex) | 5 |
| **Total** | **30** |

## Minimal scope

The minimal scope ships `PageMetadataService` on every public page, the JSON-LD builders, the sitemap and `robots.txt`. It uses the first gallery image at its 1440-pixel variant as the Open Graph image instead of a 1200 by 630 crop. It satisfies `L2-077` and every criterion of `L2-076` except the 1200 by 630 Open Graph size, which it defers. The minimal scope totals 27 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| `generateOgImage` crop; use an existing gallery variant | Link previews show an uncropped image, not 1200 by 630 | 3 |
| Per-list `lastmod` from latest item change; use build time | List-page `lastmod` values are less precise | 1 |
