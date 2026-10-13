# Compare bar

| Field | Value |
|---|---|
| Selector | `st-compare-bar` |
| Library path | `frontend/projects/components/src/lib/compare-bar/` |
| Status | planned |
| Traces to | L2-030, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`compare-bar.html`](../../design-system/components/compare-bar.html) |
| Source mocks | [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studios/selected-one`](../../mocks/pages/studios/selected-one.html), [`pages/studios/selected`](../../mocks/pages/studios/selected.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`notifications/public-toast/warning`](../../mocks/notifications/public-toast/warning.html) |
| Rendering | [`compare-bar.html`](compare-bar.html) |

## Purpose and scope

The compare bar is the persistent strip fixed to the bottom of the viewport that
counts the studios picked for comparison, lists their names, and holds "Clear"
and "Compare". It appears as soon as one studio is picked, on every page that has
a compare toggle, and opens the comparison once two to four are picked (L2-030).
It is a complementary landmark, "Studios to compare", and its count is a polite
live region, so every change to the selection is announced without moving focus.

The compare toggle that feeds it ("Compare" / "Remove" on cards, "Add to compare"
/ "Remove from compare" on the review page) is
[`button[st-button]`](button.md) with `pressed`, specified in the button CRD; this
CRD does not re-specify it. The bar's "Clear" and "Compare" are also
`st-button`s the application projects into the bar's `actions` slot; this CRD
states the configuration the bar needs from them. The comparison itself is the
compare table on `/compare` ([`compare-table`](compare-table.md)).

Out of scope:

- The selection: which studios are picked, their order, the four-studio limit,
  storage that survives a reload (L2-030.5), and the `/compare?studios=…` URL.
  `CompareSelectionService` in the application (detailed design
  *select-studios-to-compare*) owns them and passes the bar display strings.
- Whether the bar is rendered: the application renders `st-compare-bar` only when
  at least one studio is picked, and adds and removes `.has-compare-bar` on
  `<body>` with it (D-2).
- The limit message: the application raises the warning toast "You can compare up
  to 4 studios" through `ToastService` ([`toast`](toast.md)); the toast region
  lifts itself above the bar.
- Focus after "Clear": the bar disappears, so the application moves focus to
  `<main>` (ICD §14, focus after page-level changes).

## Usage

Every `.compare-bar` and `.has-compare-bar` in `docs/mocks/` (grep; four mocks),
grouped by state.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studios/default` (and every page with nothing picked) | not rendered; no `.has-compare-bar` | — | hidden | — |
| `pages/studios/selected-one` | `label` "Studios to compare", `countText` "1 selected", `names` "The Junction Loft", `hint` "Pick at least 2 studios to compare" | `actions`: ghost "Clear"; primary "Compare" soft-disabled and described by the hint (D-3) | 1 picked with hint | raised surface, fixed bottom |
| `pages/studio/in-compare` | `countText` "2 selected", `names` "The Junction Loft, Leslieville Daylight Studio" | `actions`: "Clear", then "Compare" as a link (D-5) | 2 picked | raised surface |
| `pages/studios/selected` | `countText` "3 selected", `names` "The Junction Loft, Leslieville Daylight Studio, Kensington Window Room" | `actions`: "Clear", "Compare" link | 3 picked | raised surface |
| `notifications/public-toast/warning` | `countText` "4 selected", four names ending "Liberty Cyc House" | `actions`: "Clear", "Compare" link | 4 picked, fifth refused: bar unchanged, warning toast above it | raised surface, toast over the page |

Every row is buildable with the API below: `label`, `countText`, `names`, `hint`
and `hintId` are inputs; "Clear" and "Compare" are projected `st-button`s; page
padding and toast offset come from the global `.has-compare-bar` utility.

## Anatomy

1. **Bar** — `aside.compare-bar` with `aria-label` from `label`: a complementary
   landmark fixed to the bottom of the viewport, raised surface, hairline top
   edge, `--shadow-3`, safe-area padding, `--z-sticky`.
2. **Inner row** — `.compare-bar__inner`: centred, capped at the container width,
   wrapping flex row.
3. **Status** — `.compare-bar__status`: a column that grows from a 12rem basis.
4. **Count** — `p.compare-bar__count` with `role="status"` and
   `aria-live="polite"`: `countText` ("3 selected"), label type.
5. **Names (optional)** — `p.compare-bar__names`: `names`, muted small text, one
   line, ellipsis.
6. **Hint (optional)** — `p.compare-bar__hint` with `id` from `hintId`: `hint`,
   muted small text, only with one studio picked.
7. **Actions** — `.compare-bar__actions`: the projected `actions` slot, "Clear"
   then "Compare", `--space-2` apart.

Host: `st-compare-bar` renders the `aside` and adds no box of its own
(`display: contents`), because the landmark must be a native `aside`
(ICD-DOM-1). The application places the host after `<main>` and before the site
footer, which is also its tab position.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The `aside`'s `aria-label`: "Studios to compare". Product copy, `i18n-label`. |
| `countText` | `string` | — | yes | Text of the live count: "1 selected" … "4 selected", formatted and pluralised by the application. Announced politely each time it changes, including on the bar's first appearance (D-1); an unchanged value is not re-announced. |
| `hint` | `string \| null` | `null` | no | When non-null, renders `p.compare-bar__hint` ("Pick at least 2 studios to compare"). The application passes it only while one studio is picked. |
| `names` | `string \| null` | `null` | no | When non-null, renders `p.compare-bar__names`: the picked names, comma separated, in the order picked, joined by the application. |
| `hintId` | `string` | `'compare-hint'` | no | The `id` of the hint element, so the projected "Compare" can reference it with `aria-describedby`. **ICD change (ICD-002 1.1.0, additive)**, D-4. |

All inputs are signal inputs. `countText`, `hint` and `names` are display strings;
the component does no counting, joining or pluralising (ICD-API-10).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | "Clear" and "Compare" are the consumer's buttons; it listens to their native `click` or follows the link. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `actions` | "Clear": `button[st-button] variant="ghost" type="button"`; then "Compare": `button[st-button] variant="primary" type="button" softDisabled` with `aria-describedby` = `hintId` while one is picked, or `a[st-button] variant="primary"` with the `/compare?studios=…` link from two | Projected into `.compare-bar__actions` in the order given; Clear first, Compare last (DS). The component never queries or changes the projected buttons (ICD-API-9). |

The compare bar has no library strings (ICD §12).

## Variants and sizes

The bar has one variant. Its states (below) come from which inputs are set and
what the application projects.

| Size | Rule |
|---|---|
| One size | Height is the content: one to three text lines and the 44 px buttons, with `--space-3` padding above and `--space-3` plus the safe-area inset below. Width is the viewport; the inner row is capped at `--layout-container-max` less two `--layout-margin`. Measured at 360 px: 143 px with one picked, 122 px with two to four. |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Hidden (0 picked) | application does not render the host; `body` lacks `.has-compare-bar` | No bar; no end padding | No landmark |
| One picked, with hint | `countText` "1 selected", `names`, `hint` | Count, name, hint; "Compare" at 50 % opacity (`aria-disabled`) | "1 selected" announced; "Compare, dimmed, Pick at least 2 studios to compare" |
| Two to four picked | `countText` "2 selected" … "4 selected", `names`, `hint` null | Count and names; "Compare" solid ink link | Each new count announced politely |
| Over the limit (fifth refused) | the application keeps `countText` "4 selected" and raises the warning toast | Bar unchanged; the toast sits above it (`.has-compare-bar .toast-region`) | Nothing from the bar (count unchanged); the toast announces itself |
| Long names | `names` wider than the status column | One line, ellipsis; the count stays complete | Full names in the accessibility tree |
| Narrow (below 36rem) | status and actions do not fit one line | Actions wrap below the status, still Clear then Compare | Unchanged |
| Focus inside | Tab reaches "Clear" or "Compare" | The buttons' focus ring on the raised surface | — |
| Dark theme | `data-theme="dark"` | Raised surface lighter than the canvas, deeper shadow | — |

## Markup

```html
<!-- rendered: one picked, with hint (host element name is not part of the contract) -->
<st-compare-bar>
  <aside class="compare-bar" aria-label="Studios to compare">
    <div class="compare-bar__inner">
      <div class="compare-bar__status">
        <p class="compare-bar__count" role="status" aria-live="polite">1 selected</p>
        <p class="compare-bar__names">The Junction Loft</p>
        <p class="compare-bar__hint" id="compare-hint">Pick at least 2 studios to compare</p>
      </div>
      <div class="compare-bar__actions">
        <button class="btn btn--ghost" type="button">Clear</button>
        <button class="btn btn--primary" type="button" aria-disabled="true" aria-describedby="compare-hint">Compare</button>
      </div>
    </div>
  </aside>
</st-compare-bar>
```

```html
<!-- rendered: three picked; no hint element; Compare is a link -->
<aside class="compare-bar" aria-label="Studios to compare">
  <div class="compare-bar__inner">
    <div class="compare-bar__status">
      <p class="compare-bar__count" role="status" aria-live="polite">3 selected</p>
      <p class="compare-bar__names">The Junction Loft, Leslieville Daylight Studio, Kensington Window Room</p>
    </div>
    <div class="compare-bar__actions">
      <button class="btn btn--ghost" type="button">Clear</button>
      <a class="btn btn--primary" href="/compare?studios=the-junction-loft,leslieville-daylight-studio,kensington-window-room">Compare</a>
    </div>
  </div>
</aside>
```

```html
<!-- page: the application's body class, landmark order -->
<body class="has-compare-bar">
  <main id="main" tabindex="-1">… cards with compare toggles …</main>
  <st-compare-bar>…</st-compare-bar>
  <footer class="site-footer">…</footer>
</body>
```

```html
<!-- consumer: the application's compare-bar host component -->
@if (selection.count() > 0) {
  <st-compare-bar i18n-label label="Studios to compare" [countText]="countText()" [names]="names()"
                  [hint]="selection.canCompare() ? null : hintText">
    <button st-button slot="actions" variant="ghost" type="button" (click)="clear()" i18n>Clear</button>
    @if (selection.canCompare()) {
      <a st-button slot="actions" variant="primary" [routerLink]="comparePath" [queryParams]="{ studios: slugs() }" i18n>Compare</a>
    } @else {
      <button st-button slot="actions" variant="primary" type="button" softDisabled aria-describedby="compare-hint" i18n>Compare</button>
    }
  </st-compare-bar>
}
```

## Design

- Bar: `position: fixed`, `left: 0`, `right: 0`, `bottom: 0`, `z-index` `--z-sticky`; background `--color-bg-surface-raised`; top edge `--border-width-hairline` in `--color-border-default`; `--shadow-3`.
- Padding: `--space-3` top, `--layout-margin` inline, `calc(var(--space-3) + env(safe-area-inset-bottom))` bottom (ICD-STY-7, L2-065.1).
- Inner row: `max-width` `--layout-container-max` less two `--layout-margin`, centred; `display: flex`, `flex-wrap: wrap`, `align-items: center`, gap `--space-2` (rows) `--space-4` (columns).
- Status: `flex: 1 1 12rem`, `min-width: 0`, column.
- Count: `--text-label` at `--font-size-md`, `--color-fg-default`.
- Names and hint: `--text-body-sm`, `--color-fg-muted`; names `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`.
- Actions: `display: flex`, gap `--space-2`; buttons are md (44 px).
- Motion: none; the bar appears and disappears without animation.
- Page end, global utility `.has-compare-bar` on `<body>`: `padding-bottom` `--space-24` plus the inset; below 36rem `--space-32` plus `--space-8` plus the inset. `html:has(body.has-compare-bar)` sets the same 36rem-and-below value as `scroll-padding-bottom` so a focused element is scrolled clear of the bar (WCAG 2.4.11).
- Toasts: `.has-compare-bar .toast-region` sits at `--space-24` plus the inset (below 36rem `--space-32` plus `--space-4` plus the inset), above the bar; the toast region owns that rule.

No component tokens; the bar reads semantic tokens directly.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Bar surface | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Top edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Count | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Names and hint | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Compare fill (primary button) | `--color-action` | `--palette-stone-950` | `--palette-stone-100` |
| Compare label | `--color-fg-on-action` | `--palette-white` | `--palette-stone-950` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Page behind | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Count and "Clear" label |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Names and hint |
| `--color-fg-on-action` | `--color-action` | 4.5:1 | "Compare" label |
| `--color-action` | `--color-bg-surface-raised` | 3:1 | "Compare" edge on the bar |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring on the bar |

The top edge is decorative: the shadow and the raised surface separate the bar
from the page. In light the raised surface equals the canvas and `--shadow-3`
carries the separation; in dark the raised surface is lighter than the canvas.
Forced colours: the bar keeps the system `Canvas` background and the buttons keep
their `CanvasText` borders (button CRD), so its controls stay distinct.

## Responsive behaviour

- Every width: fixed to the bottom of the viewport (L2-030.6); the inner row is
  centred and capped, so on a wide screen the count lines up with the page's left
  edge and "Compare" with its right edge.
- Safe area: the bottom padding adds `env(safe-area-inset-bottom)`, so the buttons
  clear a phone's home indicator (L2-065.1); the application's viewport meta has
  `viewport-fit=cover`.
- Below 36rem: when status and actions do not fit one line, the actions wrap below
  the status in Clear-then-Compare order; `.has-compare-bar` reserves 160 px plus
  the inset, which clears the 143 px one-picked bar.
- Names never wrap: they end in an ellipsis and the count stays complete.
- At 320 px nothing scrolls horizontally; at 200 % zoom the bar's controls stay
  reachable. "Clear" and "Compare" are 44 px tall at every width, `--space-2`
  apart.
- The rendering shows 320, 360 and 768 px frames, because the layout wraps by
  width.

## Accessibility

### Role and pattern

`<aside aria-label="Studios to compare">`, a complementary landmark reachable
from the landmarks list. Its count is a `role="status"` polite live region. It is
not a dialog and traps nothing.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | After the page's main content: "Clear", then "Compare", then the footer. A soft-disabled "Compare" stays in the order. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | On "Clear": empties the selection. On "Compare" with one picked: nothing. |
| <kbd>Enter</kbd> | On "Compare" as a link: opens the comparison. |
| <kbd>Esc</kbd> | No effect on the bar. |

### Focus

The bar never takes or moves focus: toggling a studio leaves focus on the toggle
and the count announces the change. Focus is never hidden behind the bar,
because `.has-compare-bar` reserves scroll padding as tall as the bar's two-row
phone layout. After "Clear" the application moves focus to `<main>`.

### Labelling

- The landmark's name is `label` ("Studios to compare"); one label on every page
  (D-5).
- With one picked, "Compare" is `aria-disabled="true"` and described by the hint:
  "Compare, dimmed, Pick at least 2 studios to compare".
- The names line is plain text; the count says how many.

### Announcements

- `p.compare-bar__count` is the only announcer of the selection count (ICD-A11Y-4,
  `live`); the application does not also announce it.
- Each change of `countText` is announced once, politely, without moving focus.
- The first count after the bar appears is announced too: in the browser the
  component renders the live region empty and writes `countText` into it after
  the first render, so assistive technology registers the region before its text
  arrives (D-1).
- When `countText` does not change (the fifth studio refused), the bar announces
  nothing; the warning toast is the message.

### Motion

None: the bar appears and disappears without animation, so
`prefers-reduced-motion` changes nothing. The limit toast's slide is the toast's.

## Content and internationalisation

- Count: "n selected", a numeral, no "studios" (the landmark's label says what is
  counted). The application pluralises with ICU in its catalogue.
- Names: the studios' published names in the order picked, comma separated, no
  "and" ("The Junction Loft, Leslieville Daylight Studio, Kensington Window Room").
- Hint with one picked: "Pick at least 2 studios to compare". Nothing below the
  count from two to four.
- Actions: "Clear" and "Compare". Not "Reset", not "Compare now".
- Translatable content: `label`, `countText`, `hint` and the projected buttons'
  text. Data: the names.
- Longer translations: the count and hint wrap within the status column; the names
  stay on one line and truncate with an ellipsis.

## Performance

- Change detection: `OnPush`, signal inputs; the hint and names elements render
  from `@if` on their inputs; the live-region write is one effect on `countText`.
- Performance scenario: the `components-harness` route `compare-bar/performance`
  renders the studio list's seven cards with compare toggles and the bar with
  three picked (The Junction Loft, Leslieville Daylight Studio, Kensington Window
  Room); pressing "Compare Liberty Cyc House" updates the bar to "4 selected" and
  must stay within the L2-071 INP budget, and the bar's first appearance must add
  no layout shift.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the bar is fixed and `.has-compare-bar` pads only the end of
  the page, so content above the fold never moves when the bar appears.
- Weight: imports `@angular/core` and `@angular/common` (`afterNextRender`) only.

## Acceptance criteria

### Rendering

- **AC-1** Given The Junction Loft is the only studio picked, when the bar renders with `label` "Studios to compare", `countText` "1 selected", `names` "The Junction Loft" and `hint` "Pick at least 2 studios to compare", then there is one `aside.compare-bar` named "Studios to compare" holding `p.compare-bar__count` with `role="status"` and `aria-live="polite"` reading "1 selected", `p.compare-bar__names` "The Junction Loft" and `p.compare-bar__hint#compare-hint`, with "Clear" before "Compare" in `.compare-bar__actions`. (L2-030)
- **AC-2** Given one studio picked, when a keyboard user tabs to "Compare" and presses Enter and Space, then it receives focus, has `aria-disabled="true"`, its description is "Pick at least 2 studios to compare", and nothing navigates. (L2-030)
- **AC-3** Given The Junction Loft, Leslieville Daylight Studio and Kensington Window Room picked, when the bar renders with `hint` null, then it has no `.compare-bar__hint` element, the names line lists the three in that order, and "Compare" is a link with the classes `btn btn--primary`. (L2-030)
- **AC-4** Given The Junction Loft and Leslieville Daylight Studio picked, when the visitor presses Enter on "Compare" in the bar, then the browser opens `/compare?studios=the-junction-loft,leslieville-daylight-studio`. (L2-030)
- **AC-5** Given no studio picked on the studio list, when the page renders, then there is no complementary landmark named "Studios to compare" and `body` has no `has-compare-bar` class. (L2-030)
- **AC-6** Given four studios picked, when the visitor presses "Compare Ossington Blackbox" and the warning toast "You can compare up to 4 studios" appears, then the bar still reads "4 selected" with the same four names, makes no new announcement, and the toast's bottom edge is above the bar's top edge at 360 px and at 1280 px. (L2-030)
- **AC-7** Given `hintId` "studio-page-compare-hint" and a Compare button described by it, when the bar renders with one studio picked, then the hint element has that `id` and the button's accessible description is the hint text. (L2-069)

### Announcements

- **AC-8** Given the bar reads "1 selected", when the visitor presses "Compare Leslieville Daylight Studio" on its card, then a screen reader announces "2 selected" once, politely, and focus stays on the toggle. (L2-069)
- **AC-9** Given no studio picked, when the visitor presses "Compare The Junction Loft" and the bar appears, then a screen reader announces "1 selected". (L2-069)

### Layout and safe area

- **AC-10** Given a phone at 360 px with a 34 px bottom safe-area inset and one studio picked, when the bar is shown, then it is fixed to the bottom of the viewport, its bottom padding is `--space-3` plus 34 px, and "Clear" and "Compare" end at least 34 px above the viewport's bottom edge. (L2-065)
- **AC-11** Given the studio list at 360 px with one studio picked (bar 143 px tall), when the visitor scrolls to the end of the page, then the footer's last link is fully above the bar's top edge, because `body.has-compare-bar` pads the end by `--space-32` plus `--space-8` plus the inset. (L2-030)
- **AC-12** Given the studio list at 1280 px with three studios picked, when the visitor scrolls to the end of the page, then the footer's last link is fully above the bar's top edge (`--space-24` end padding). (L2-030)
- **AC-13** Given the studio list at 360 px with one studio picked, when a keyboard user tabs to the footer's "YouTube channel" link, then the page scrolls so that link and its focus ring are fully visible above the bar. (L2-067)

### Keyboard and focus

- **AC-14** Given The Junction Loft's page with two studios picked, when a keyboard user tabs past the last control in `main`, then focus moves to "Clear", then "Compare", then the first footer control, each with a focus ring of at least 3:1 against the bar, and Escape on either does nothing. (L2-067)

### Screen readers

- **AC-15** Given the studio list with three studios picked in light and dark, when axe-core scans the page, then no violation is reported and the landmarks list contains one complementary landmark named "Studios to compare". (L2-069)

### Theming

- **AC-16** Given the bar with one and with three studios picked, when the contrast check runs in the light and the dark theme, then the count is at least 4.5:1, the names and hint at least 4.5:1, the "Compare" label at least 4.5:1, and the "Compare" edge and the focus ring at least 3:1 against `--color-bg-surface-raised`. (L2-068)

### Responsive

- **AC-17** Given the bar with four studios picked at 320 px, when it renders, then the names line is one line ending in an ellipsis, "4 selected" is complete, the actions sit below the status in the order Clear, Compare, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-18** Given the bar at 360 px and at 1280 px, when "Clear" and "Compare" are measured, then each is at least 44 CSS px tall and they are `--space-2` (8 px) apart. (L2-065)
- **AC-19** Given the studio list with two studios picked at 200 % zoom in a 1280 px viewport, when the visitor reaches the bar, then the count, "Clear" and "Compare" are fully visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the bar appears and
disappears without animation, so reduced motion changes nothing
([compare-bar.html](../../design-system/components/compare-bar.html), Accessibility › Motion).

### Performance

- **AC-20** Given the `compare-bar/performance` harness route with three studios picked, when "Compare Liberty Cyc House" is pressed and the bar updates to "4 selected", then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)
- **AC-21** Given the same route with nothing picked, when the first studio is picked and the bar appears, then the cumulative layout shift stays at most 0.1 and no element above the bar moves. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/compare-bar/`:
  `compare-bar.component.ts` (`CompareBarComponent`, selector `st-compare-bar`),
  `compare-bar.component.html` (the `aside` with its inner row, status, `@if` for
  names and hint, and `<ng-content select="[slot=actions]" />` in
  `.compare-bar__actions`), `compare-bar.component.css` (port of `.compare-bar*`
  from `components.css`; `:host { display: contents }`).
- Live region: render `p.compare-bar__count` from the start; in the browser,
  write `countText` into it in `afterNextRender` on first render and on each
  change afterwards (an effect), so the first value is announced (D-1). On the
  server the count is rendered directly.
- `.has-compare-bar` and `html:has(body.has-compare-bar)` are global utilities in
  `styles/utilities.css` (ICD §11.1); `.has-compare-bar .toast-region` belongs to
  the toast region's CSS (`:host-context(.has-compare-bar)`).
- ICD change (ICD-002 1.1.0, additive): `CompareBarComponent` gains the optional
  input `hintId: string`, default `'compare-hint'` (D-4).
- Application side: the compare-bar host component of the *select-studios-to-compare*
  design renders `st-compare-bar` from `CompareSelectionService`, toggles
  `.has-compare-bar` on `document.body` through `Renderer2`, and moves focus to
  `main` after "Clear".
- Mock drift the product corrects: `pages/studio/in-compare` puts "Compare" before
  "Clear", labels the bar "Comparison" and puts `.has-compare-bar` on `<main>`;
  `pages/studios/selected-one` disables "Compare" natively;
  `notifications/public-toast/warning` lifts the toast with an inline style.

## Decisions

- **D-1** *The application renders the bar only when one studio is picked, so the live region and its first text arrive together, which many screen readers do not announce.* The component renders the count element empty and writes `countText` into it after the first render in the browser, so "1 selected" is announced when the first studio is picked (L2-030.1 makes the bar's appearance the feedback). A selection restored on page load is announced once as well, which confirms that it survived the reload (L2-030.5).
- **D-2** *ICD-002 says the application adds `.has-compare-bar` to "the page container"; the DS puts it on `<body>`.* On `<body>`: the footer, which must scroll clear of the bar, is outside `main`, and the focus scroll padding rule is `html:has(body.has-compare-bar)`. The ICD's wording is read as `<body>`.
- **D-3** *With one picked, is "Compare" natively disabled (the `selected-one` mock, and the button CRD's AC-12) or `aria-disabled`?* `aria-disabled` through `softDisabled`, as the DS compare-bar page decides: a natively disabled button cannot be focused, so its `aria-describedby` hint is never heard from the keyboard. L2-030.2's "disabled" is met because the button is exposed as unavailable and does nothing.
- **D-4** *How does the projected "Compare" reference the hint's `id` when the component renders the hint and must not touch projected content?* A new optional input `hintId` (additive, ICD-002 1.1.0) with the default `'compare-hint'`, as the mocks write it. There is one bar per page, so the fixed default is unique and identical on the server and in the browser; the consumer writes the same value in `aria-describedby`.
- **D-5** *`pages/studio/in-compare` orders "Compare" before "Clear" and labels the bar "Comparison".* Clear then Compare and "Studios to compare" on every page, as the DS resolves: the primary action stays in one place and one landmark name serves every page.
- **D-6** *Does the bar announce anything when a fifth studio is refused?* No. The application keeps `countText` at "4 selected", so the live region does not change; the warning toast is the one announcement, which keeps one announcer per change (ICD-A11Y-4).
