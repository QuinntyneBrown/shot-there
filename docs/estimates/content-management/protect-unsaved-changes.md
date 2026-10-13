# Estimate — Protect unsaved changes

## Basis

The estimate assumes an intermediate Angular/TypeScript developer. The three
editor pages and their forms exist from their own designs, and the UI
framework's dialog primitive is available. Hours cover implementation, tests
and review fixes.
[Detailed design](../../detailed-designs/content-management/protect-unsaved-changes/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `HasUnsavedChanges` and `unsavedChangesGuard` | 2 |
| `DiscardChangesDialogComponent` | 2 |
| `warnOnBeforeUnload` with SSR check and cleanup | 1 |
| Route registration and `hasUnsavedChanges` in 3 editors | 2 |
| Playwright acceptance tests via page objects | 3 |
| **Total** | **10** |

## Minimal scope

The minimal version protects the studio editor only, with the guard, dialog
and `beforeunload` listener. The spot and guide editors receive the same
protection when they ship. It satisfies `L2-062` for the studio editor and
defers it for the other two. Total: 8 hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Spot and guide editor wiring | Unsaved changes in those editors are unprotected | 1 |
