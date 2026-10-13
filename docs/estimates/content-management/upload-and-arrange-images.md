# Estimate — Upload and arrange images

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer
who reads the `sharp` and S3 client documentation as needed. The editors, the
Prisma models and the owner session check exist from their own designs. An
S3-compatible bucket is available for development; the vendor is `<TO SUPPLY>`.
Hours cover implementation, tests and review fixes.
[Detailed design](../../detailed-designs/content-management/upload-and-arrange-images/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `object-store.ts` with put and delete under server-generated keys | 4 |
| `inspectImage` content detection and mismatch rejection | 4 |
| `generateVariants` with `sharp` | 3 |
| `uploadImage` and `POST /api/admin/images` with 401, 413 and 400 paths | 6 |
| `removeImage` and `DELETE /api/admin/images/[id]` with published rule | 4 |
| `applyImageOrder` and alt-text schema in editor save | 3 |
| `ImageService` and `HttpImageService` with progress events | 3 |
| `ImageUploadQueue` with client checks, busy state and retry | 5 |
| `ImageListComponent` with alt text, reorder buttons and live region | 7 |
| `RemoveImageDialogComponent` | 2 |
| API tests for upload, inspection, size limit, removal and session | 6 |
| Playwright acceptance tests via page objects | 6 |
| **Total** | **53** |

## Minimal scope

The minimal version uploads one file at a time with server inspection, variants,
server-generated keys and the session check. It keeps alt text, reorder buttons
and removal. It drops the per-file progress indicator, the multi-file queue with
retry and the live-region announcement. It satisfies `L2-081` and most of
`L2-057` and `L2-058`. Criteria 6 and 7 of `L2-057` and criterion 3 of `L2-058`
are deferred. Total: 43 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Per-file retry; owner re-selects the failed file | Retry without re-selecting others | 2 |
| Progress indicator; keep Save disabled while busy | Visible upload progress | 2 |
| Live-region announcement of new position | Screen reader feedback after reorder | 1 |
| Client-side size and type checks; rely on server | Immediate messages before upload | 2 |
