# Estimate — Select studios to compare

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer who is productive in both stacks and does not yet know this codebase. Hours cover implementation, tests and review fixes; they exclude requirements, design and mock work. The app shell, `StudioCardComponent` and `StudioPageComponent` already exist; this slice places the toggle in them. The `localStorage` key name is `<TO SUPPLY>` and does not move the number. [Detailed design](../../detailed-designs/comparison/select-studios-to-compare/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `CompareSelectionItem`, `CompareAddResult` and `CompareSelectionStore` with storage guards | 3 |
| `CompareSelectionService` with signals and 4-maximum rule, plus unit tests | 4 |
| `CompareToggleComponent` with i18n text and limit announcement | 3 |
| `CompareBarComponent` with 2-minimum hint and navigation | 4 |
| Fixed bottom bar at XS with safe-area inset and content padding | 2 |
| Placing the toggle in the studio card and studio page | 1 |
| Playwright page objects and acceptance tests for `L2-030` criteria 1–6 | 6 |
| Review fixes | 2 |
| **Total** | **25** |

## Minimal scope

The minimal scope keeps the toggle on the studio card, the bar with count, 2-minimum rule and navigation, the 4-maximum refusal and `localStorage` persistence. It drops the toggle on the studio page and the live-region announcement, keeping the inline limit message. It totals 23 hours. `L2-030` criteria 1–6 remain satisfied because criterion 1 names the card; the "or its page" clause of `L2-030` is deferred.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Toggle on the studio page | Studios can be added only from list cards | 1 |
| Live-region announcement of the limit | Screen-reader users rely on the inline message only | 1 |
| Unit tests on `CompareSelectionService` | Selection rules covered only by Playwright tests | 2 |
