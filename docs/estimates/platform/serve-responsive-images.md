# Estimate — Serve responsive images

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who has not seen this codebase. The upload feature, the object store bucket, the CDN and the `Image` model already exist. The design system breakpoints for `sizes` are `<TO SUPPLY>`; the hours assume they are documented before work starts. Hours cover implementation, tests and review fixes. [Detailed design](../../detailed-designs/platform/serve-responsive-images/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `ImageVariant` Prisma model, `ImageFormat` enum and migration | 2 |
| `generateVariants` with `sharp`, `VARIANT_WIDTHS` and immutable upload headers | 6 |
| `toImageDto`, `ImageDto`, `ImageSourceDto` and wiring into public route handlers | 3 |
| `buildSrcset` function | 1 |
| `ResponsiveImageComponent` with `picture`, `source`, `img` and priority inputs | 5 |
| Gallery `sizes` values and first-image `priority` wiring in public pages | 2 |
| API tests for `generateVariants` and `toImageDto` | 3 |
| Playwright acceptance tests via page objects (markup, eager first image, format, XS width) | 5 |
| **Total** | **27** |

## Minimal scope

The minimal scope generates WebP and JPEG variants only and renders `ResponsiveImageComponent` with `srcset`, `sizes`, dimensions and loading hints. It drops AVIF encoding. It still satisfies `L2-072`, because a browser that accepts WebP receives WebP. Nothing is deferred. The minimal scope totals 25 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| AVIF variants | Browsers that support AVIF receive larger WebP files | 2 |
| 2048-pixel width | Large high-density screens show a softer full-size image | 1 |
