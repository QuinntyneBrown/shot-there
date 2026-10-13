# Estimate — Publish and unpublish a location

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer.
The studio and spot editors, the Prisma models and the owner session check
already exist from their own designs. The CDN purge interface is `<TO SUPPLY>`;
the hours assume a single authenticated HTTP purge call. Hours cover
implementation, tests and review fixes.
[Detailed design](../../detailed-designs/content-management/publish-and-unpublish-location/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `checkStudioPublishable` and `checkSpotPublishable` with unit tests | 6 |
| `disclosureSchema` with provider rule | 2 |
| `publishLocation` and `unpublishLocation` | 3 |
| Publish route handlers for studios and spots (`POST`, `DELETE`) | 3 |
| `publishedOnly` applied to public reads, sitemap and structured data | 4 |
| Save-time guard for published locations in studio and spot save | 2 |
| `revalidatePublicPages` and cache lifetime of public lists | 4 |
| `PublishingService` and `HttpPublishingService` | 2 |
| `MissingFieldsDialogComponent` with field focus links and label map | 5 |
| `UnpublishDialogComponent` and editor action wiring | 3 |
| API tests for publish, unpublish, 401, 422 and draft 404 | 4 |
| Playwright acceptance tests via page objects | 5 |
| **Total** | **43** |

## Minimal scope

The minimal version keeps the publishing check, the endpoints, the
published-only filter and plain Publish and Unpublish buttons. The refusal shows
the missing field names as a text list without focus links. Revalidation relies
on the 60-second cache lifetime only. It satisfies `L2-002`, `L2-045` and
`L2-001`, and satisfies `L2-056` except the focus links of its third criterion,
which are deferred. Total: 37 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Field focus links in the missing-fields dialog | Owner locates each missing field by hand | 3 |
| CDN purge call; rely on 60-second cache lifetime | Pages change up to 60 seconds after the action | 3 |
| Save-time guard for published locations | A published location can lose a standard field | 2 |
