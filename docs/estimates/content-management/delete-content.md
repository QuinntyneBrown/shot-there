# Estimate — Delete content

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer.
The editors, the admin lists, the Prisma models, the owner session check and
`object-store.ts` exist from their own designs. The hours assume failed object
deletes are logged only, since that handling is `<TO SUPPLY>`. Hours cover
implementation, tests and review fixes.
[Detailed design](../../detailed-designs/content-management/delete-content/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `deleteLocation` transaction with guide entry and image cleanup | 4 |
| `deleteGuide` | 1 |
| `DELETE` handlers for studios, spots and guides | 2 |
| `ContentDeletionService` and `HttpContentDeletionService` | 1 |
| `DeleteContentDialogComponent` and `delete-eligibility.ts` | 3 |
| Editor wiring, navigation and confirmation notification in 3 editors | 3 |
| API tests for draft delete, published refusal, guide entry removal and session | 3 |
| Playwright acceptance tests via page objects | 3 |
| **Total** | **20** |

## Minimal scope

The minimal version covers studios and outdoor spots only, with the dialog,
the published refusal and guide entry cleanup. Guide deletion is deferred until
guides ship. It satisfies `L2-061` for locations and defers its guide clause.
Total: 17 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Guide deletion | Draft guides cannot be deleted | 3 |
| Image object cleanup; delete rows only | Orphaned objects stay in the image store | 1 |
