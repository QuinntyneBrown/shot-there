# Estimate — Show studio test shots and gallery

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who does not yet know the codebase. It assumes the shared studio page, service and endpoint exist, and that the admin image-upload feature produces the `Image` and `ImageVariant` rows. It assumes the Angular CDK dialog is the accessible dialog primitive. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. [Detailed design](../../detailed-designs/studio-reviews/show-studio-test-shots-and-gallery/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `Image` and `ImageVariant` read mapping in `getStudio` | 3 |
| `ImageDto` and `ImageVariantDto` types on both sides | 1 |
| `StudioTestShotsComponent` with fixed slot and captions | 3 |
| `StudioGalleryComponent` responsive grid with `srcset` | 3 |
| `GalleryLightboxDialogComponent` and view model with focus handling | 6 |
| API tests for image ordering and alt text | 2 |
| Playwright page object and acceptance tests including keyboard paths | 6 |
| Review fixes | 2 |
| **Total** | **26** |

## Minimal scope

The minimal scope ships both sections and a lightbox with Next and Close only, relying on the dialog primitive's built-in focus trap and focus return. It satisfies `L2-009` in full. It satisfies `L2-010` except the Previous control, which it defers. Total: 24 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Previous control in the lightbox | Backward navigation; `L2-010` partly unmet | 1 |
| `srcset` across all variants; serve the 960 variant only | Larger downloads at phone width | 1 |
| Separate lightbox view model | Index logic sits in the dialog component | 1 |
