# Comparison table

| Field | Value |
|---|---|
| Selector | `st-compare-table` (application component, composing `table[st-table]`) |
| Library path | `frontend/projects/shot-there/src/app/features/compare/compare-table/` (application, D-1) |
| Status | planned |
| Traces to | L2-031, L2-032, L2-033, L2-043, L2-064, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072 |
| Design system | [`compare-table.html`](../../design-system/components/compare-table.html), [`table.html`](../../design-system/components/table.html) |
| Source mocks | [`pages/compare/default`](../../mocks/pages/compare/default.html), [`pages/compare/four`](../../mocks/pages/compare/four.html), [`pages/compare/over-limit`](../../mocks/pages/compare/over-limit.html), [`pages/compare/unknown-slug`](../../mocks/pages/compare/unknown-slug.html), [`pages/compare/empty`](../../mocks/pages/compare/empty.html), [`notifications/public-toast/success`](../../mocks/notifications/public-toast/success.html), [`notifications/public-toast/danger`](../../mocks/notifications/public-toast/danger.html) |
| Rendering | [`compare-table.html`](compare-table.html) |

## Purpose and scope

The comparison table sets two to four studios side by side, every measurement
in the same row and the three standard test shots in the same order, so a
photographer reads across "All-in, 2 hours · $145.00 · $91.00 Lowest · $270.00
Prices may be out of date" and decides. Every studio was measured and shot with
the same setup; the table's job is to keep the rows aligned and the row labels
in view while the studio columns scroll past on a phone (L2-031).

It is an application component: `.compare-table*` is application feature CSS
(ICD-002 §11.2). It renders the library's [`table[st-table]`](table.md) without
`stack`, puts [`st-badge`](badge.md) under values, [`a[st-link]`](link.md) on the
studio names, [`st-responsive-image`](responsive-image.md) for photos and test
shots, and writes compact scores as the [score](score.md) CRD's "number plus
hidden out of 5" pattern. Admin lists and spot reference tables are plain
[`table[st-table]`](table.md); one studio's specifications are a
[`st-description-list`](description-list.md).

Out of scope:

- Reading `studios` from the URL, calling `CompareService`, dropping unknown
  or draft slugs, the four-studio cap, computing all-in cost, overall score,
  `priceStale` and `isLowestAllInCost`: the server and `ComparePageComponent`.
- Formatting money, dates, dimensions and scores for `en-CA`, and choosing
  "—" for a missing value: `toComparisonViewModel` beside the page.
- The page header ("Compare 3 studios", subtitle, "Copy link", "Change
  studios"), the unknown-slug and over-limit [`st-alert`](alert.md)s, the empty
  state for fewer than two studios, the copy-link toast, the page title and
  metadata: `ComparePageComponent`.
- The compare bar and toggles that build the selection: [`st-compare-bar`](compare-bar.md), [`button[st-button]`](button.md).

## Usage

Every `.compare-table` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks compare-table "table|td|th|div|col|tr"`).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/compare/default` | 3 columns (`--compare-cols: 3`), 5 groups, 22 rows | Caption "Comparison of The Junction Loft, Leslieville Daylight Studio and Ossington Blackbox"; header photo, name link, neighbourhood; values, multi-line natural light, compact scores, overall in bold, three test shots per studio | Lowest (Leslieville $91.00), stale (Ossington $270.00), missing "—" (mandatory fees), row hover | canvas, inside `.container` |
| `pages/compare/four` | 4 columns, Junction, Leslieville, Ossington, Liberty Cyc House | as above; Liberty "Cyc touch-up $35.00" | Lowest, stale, missing; fits at LG without scroll | canvas |
| `pages/compare/over-limit` | 4 columns from a link with six slugs | as `four`; the page's info alert "You can compare up to 4 studios. We're showing the first 4 from this link." above | over the limit | canvas |
| `pages/compare/unknown-slug` | 2 columns, Junction and Leslieville | the page's info alert "One studio in this link couldn't be found, so we're comparing the other two." above | unknown slug | canvas |
| `pages/compare/empty` | no table | `st-empty-state` "Pick at least two studios to compare" with "Browse studios" | fewer than two | canvas |
| `notifications/public-toast/success`, `danger` | 3 columns behind the "Link copied" / "Couldn't copy the link" toast | Junction, Leslieville, Kensington Window Room (Lowest $80.00) | default | canvas |

Every row above is buildable with the API below: the column count, the
groups, the rows and each cell's lines, emphasis, Lowest and stale markers,
score and test shot are inputs; the alerts, empty state and toast are the
page's. The toast mocks' table is an older sketch (`span.compare-table__value`,
"All-in 2 h"); the product renders the markup below behind the toast.

## Anatomy

1. **Host** — `st-compare-table`, `display: block`, `min-width: 0`, so it never
   widens the page.
2. **Scroll region** — `div.table-wrap` with `tabindex="0"`, `role="region"`
   and `aria-labelledby` pointing at the caption (D-6). The only thing that
   scrolls sideways.
3. **Table** — `table[st-table]` with the application class `compare-table`
   (host classes `table compare-table`) and `style="--compare-cols: N"`.
   `table-layout: fixed`; below 62rem `min-width: calc(9rem + N × 10rem)`.
4. **Caption** — `caption.visually-hidden` with an ID; it names the studios.
5. **Column group** — `colgroup` with `col.compare-table__labels` (9rem) and one
   `col` per studio.
6. **Corner cell** — an empty `td.compare-table__label` at the start of the
   header row, so the label column starts under it and stays opaque.
7. **Studio header** — `th scope="col"`: `span.compare-table__photo` holding a
   decorative `st-responsive-image` (3:2, `--radius-md`, D-5), the name as an
   `a[st-link]` to the review, and `span.text-caption` with the neighbourhood on
   its own line.
8. **Group** — one `tbody` per group, starting with `tr.compare-table__group`
   whose `th scope="rowgroup" colspan="N+1"` holds the label in a `span` that
   stays in view while the studio columns scroll.
9. **Row label** — `th scope="row" class="compare-table__label"`: muted label
   type, sticky at `left: 0` on the surface, hairline inner edge on its right.
10. **Value** — `div.compare-table__value` in each `td`: a column of value lines
    in tabular figures, `--space-1` apart; the all-in cost and the overall score
    in `<strong>`.
11. **Markers** — `st-badge` under the value: success "Lowest", warning (wrapping)
    "Prices may be out of date".
12. **Score** — `<span>4<span aria-hidden="true"> / 5</span><span class="visually-hidden"> out of 5</span></span>`.
13. **Test shot** — `span.compare-table__shot` holding an informative
    `st-responsive-image` (4:5, `--radius-sm`, D-5).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `caption` | `string` | — | yes | The visually hidden caption and the scroll region's name: "Comparison of The Junction Loft, Leslieville Daylight Studio and Ossington Blackbox". Built by the view model with `$localize`. |
| `columns` | `readonly ComparisonColumn[]` | — | yes | The studios in URL order, two to four. Tracked by `slug`. Fewer than two renders nothing (D-8). Its length sets `--compare-cols`, the `col`s and every group's `colspan`. |
| `groups` | `readonly ComparisonGroup[]` | — | yes | The five groups in design-system order (D-12). Tracked by `key`; rows tracked by `key`. Each row has exactly one cell per column, in column order. |

Signal inputs (`input.required()`). Types, one per file beside the view model
in `features/compare/` (D-2):

| Type | Shape | Rule |
|---|---|---|
| `ComparisonColumn` | `{ slug: string; name: string; link: string; area: string; photo: ResponsiveImage \| null }` | `link` from `APP_PATHS`; `area` the neighbourhood ("Leslieville"); `photo` `null` shows the sunken image placeholder in the 3:2 slot. |
| `ComparisonGroup` | `{ key: string; label: string; rows: readonly ComparisonRow[] }` | "Cost", "Space and light", "Gear and logistics", "Scores", "Test shots". |
| `ComparisonRow` | `{ key: string; label: string; kind: ComparisonRowKind; cells: readonly ComparisonCell[] }` | `label` "All-in, 2 hours", "Shot 1 · Headshot". |
| `ComparisonRowKind` | `'text' \| 'score' \| 'shot'` | How each cell in the row renders. |
| `ComparisonCell` | `{ lines: readonly string[]; emphasis: boolean; isLowest: boolean; isStale: boolean; shot: ResponsiveImage \| null }` | `lines` are display strings, at least one ("—" when missing). `emphasis` wraps the value in `<strong>` (all-in, overall). `isLowest` and `isStale` add the badges. `shot` is used when `kind` is `'shot'`; its `alt` names the studio, the shot and what it shows. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The table is read-only. Studio names are links; the page handles "Copy link". |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Everything comes from the inputs. |

Strings the component's own template holds, marked `i18n`: "Lowest", "Prices
may be out of date", " / 5", " out of 5". Everything else is data from the
inputs.

## Variants and sizes

| Variant | `--compare-cols` | Minimum width below 62rem | Screens |
|---|---|---|---|
| Two studios | 2 | 29rem (464 px) | `unknown-slug` |
| Three studios | 3 | 39rem (624 px) | `default`, the toast mocks |
| Four studios | 4 | 49rem (784 px), also scrolls at 768 px | `four`, `over-limit` |
| Fewer than two | — | no table; the page shows `st-empty-state` | `empty` |

| Part | Size |
|---|---|
| Label column | 9rem (`col.compare-table__labels`) |
| Studio column | at least 10rem below 62rem; an equal share of the container from 62rem (`table-layout: fixed`) |
| Cell padding | `--space-4` block, `--space-3` inline (from the table) |
| Header photo | 3:2 at the column's width, `--radius-md` |
| Test shot | 4:5 at the column's width, `--radius-sm` |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Surface cells, sunken group rows, sticky label column | Native table: each value read with its row and column headers |
| Row hover | `tbody tr:hover` | Row and its sticky label fill `--color-bg-subtle`; group rows keep `--color-bg-surface-sunken` | — |
| Focus | `:focus-visible` on the region or a studio name | Shared ring (`--focus-ring-width`, `--color-focus-ring`, `--focus-ring-offset`) | Region "Comparison of …"; link "The Junction Loft" |
| Active | `:active` on a studio name | The link's own active state | — |
| Disabled | — | Never: the table has no inputs | — |
| Lowest | `isLowest` | Success badge "Lowest" under the value; every tied studio gets it | "$91.00 Lowest" |
| Missing value | view model line "—" | "—" in the cell, never empty; "No" (cyc wall) is a value | "—" |
| Stale price | `isStale` on the all-in cell | Warning badge "Prices may be out of date", wrapping inside the column | "$270.00 Prices may be out of date" |
| Unknown slug | server drops it | Two columns; the page's info alert above | The alert is `role="status"` |
| Over the limit | server keeps the first four | Four columns; the page's info alert above | as above |
| Fewer than two | `columns` shorter than 2 | Nothing; the page renders the empty state | The empty state's heading |
| Scrolled | sideways scroll below 62rem | Label column and group labels stay; studio columns move under them | — |
| Image failed | a photo or shot fails to load | The slot keeps its size and shows the alt text placeholder (`st-responsive-image`) | Alt text |

## Markup

```html
<!-- rendered: three studios, first group (abridged) -->
<st-compare-table>
  <div class="table-wrap" tabindex="0" role="region" aria-labelledby="compare-caption">
    <table class="table compare-table" style="--compare-cols: 3;">
      <caption class="visually-hidden" id="compare-caption">Comparison of The Junction Loft, Leslieville Daylight Studio and Ossington Blackbox</caption>
      <colgroup><col class="compare-table__labels"><col><col><col></colgroup>
      <thead>
        <tr>
          <td class="compare-table__label"></td>
          <th scope="col">
            <span class="compare-table__photo"><picture>…<img src="…" alt="" width="1200" height="800" loading="eager" fetchpriority="high"></picture></span>
            <a href="/studios/the-junction-loft">The Junction Loft</a><span class="text-caption">Junction</span>
          </th>
          …
        </tr>
      </thead>
      <tbody>
        <tr class="compare-table__group"><th scope="rowgroup" colspan="4"><span>Cost</span></th></tr>
        <tr>
          <th scope="row" class="compare-table__label">All-in, 2 hours</th>
          <td><div class="compare-table__value"><strong>$145.00</strong></div></td>
          <td><div class="compare-table__value"><strong>$91.00</strong><span class="badge badge--success">Lowest</span></div></td>
          <td><div class="compare-table__value"><strong>$270.00</strong><span class="badge badge--warning">Prices may be out of date</span></div></td>
        </tr>
        <tr>
          <th scope="row" class="compare-table__label">Mandatory fees</th>
          <td><div class="compare-table__value">Cleaning $25.00</div></td>
          <td><div class="compare-table__value">—</div></td>
          <td><div class="compare-table__value">—</div></td>
        </tr>
      </tbody>
      <!-- one <tbody> per group -->
    </table>
  </div>
</st-compare-table>
```

```html
<!-- rendered: multi-line, score, overall and test shot cells -->
<td><div class="compare-table__value"><span>Morning: Medium</span><span>Midday: Strong</span><span>Afternoon: Strong</span><span>Evening: Low</span></div></td>
<td><div class="compare-table__value"><span>4<span aria-hidden="true"> / 5</span><span class="visually-hidden"> out of 5</span></span></div></td>
<td><div class="compare-table__value"><strong><span>3.8<span aria-hidden="true"> / 5</span><span class="visually-hidden"> out of 5</span></span></strong></div></td>
<td><div class="compare-table__value"><span class="compare-table__shot"><picture>…<img src="…" alt="The Junction Loft, test shot 1, headshot: even falloff on grey seamless." width="800" height="1000" loading="lazy"></picture></span></div></td>
```

The `st-badge`, `a[st-link]` and `st-responsive-image` hosts are the elements
shown with their block classes; their tag names are not part of the contract
(ICD-DOM-3). Page objects find the table by its region name, columns by header
text and values by row header.

```html
<!-- consumer: ComparePageComponent template -->
@if (viewModel().canShowTable) {
  <st-compare-table [caption]="viewModel().caption" [columns]="viewModel().columns" [groups]="viewModel().groups" />
} @else {
  <st-empty-state i18n-title title="Pick at least two studios to compare"
    i18n-text text="Use Compare on any studio card, then open the comparison from the bar." icon="...">
    <a st-button variant="primary" slot="actions" [routerLink]="paths.studios" i18n>Browse studios</a>
  </st-empty-state>
}
```

```html
<!-- component template (abridged) -->
@if (columns().length >= 2) {
  <div class="table-wrap" tabindex="0" role="region" [attr.aria-labelledby]="captionId">
    <table st-table class="compare-table" [style.--compare-cols]="columns().length">
      <caption class="visually-hidden" [id]="captionId">{{ caption() }}</caption>
      <colgroup><col class="compare-table__labels">@for (c of columns(); track c.slug) { <col> }</colgroup>
      <thead><tr>
        <td class="compare-table__label"></td>
        @for (c of columns(); track c.slug; let first = $first) {
          <th scope="col">
            <span class="compare-table__photo">@if (c.photo) { <st-responsive-image [image]="c.photo" [sizes]="sizes()" [priority]="first" decorative /> }</span>
            <a st-link [routerLink]="c.link">{{ c.name }}</a><span class="text-caption">{{ c.area }}</span>
          </th>
        }
      </tr></thead>
      @for (g of groups(); track g.key) {
        <tbody>
          <tr class="compare-table__group"><th scope="rowgroup" [attr.colspan]="columns().length + 1"><span>{{ g.label }}</span></th></tr>
          @for (r of g.rows; track r.key) { <tr><th scope="row" class="compare-table__label">{{ r.label }}</th> … </tr> }
        </tbody>
      }
    </table>
  </div>
}
```

## Design

- Layout: `.compare-table { table-layout: fixed; min-width: calc(9rem + var(--compare-cols, 3) * 10rem) }`, the minimum dropped from 62rem; cells `vertical-align: top`.
- Header cells: `white-space: normal`, `--text-label` at `--font-size-md`, `--color-fg-default`, `position: static` (not sticky); the neighbourhood `span.text-caption` is `display: block`.
- Label column: `col.compare-table__labels` 9rem; `.compare-table__label` `position: sticky; left: 0; z-index: var(--z-raised)`, `--color-bg-surface` fill, inner right edge `inset -1px 0 0` in `--color-border-default` (box-shadow), `--color-fg-muted`, `--text-label`.
- Group rows: `.compare-table .compare-table__group th` `--color-bg-surface-sunken`, `--color-fg-default`, `--text-label` at `--font-size-md`; no hover change; the label `span` is `position: sticky; left: var(--space-3)`.
- Value: `.compare-table__value` flex column, `align-items: flex-start`, gap `--space-1`, `font-variant-numeric: tabular-nums`.
- Photos: `.compare-table__photo` `display: block`, `aspect-ratio: 3 / 2`, `--radius-md`, `overflow: hidden`, `--color-bg-surface-sunken` ground, margin below `--space-2`. Shots: `.compare-table__shot` `display: block`, `aspect-ratio: 4 / 5`, `--radius-sm`, `overflow: hidden` (D-5).
- Hover: `.compare-table tbody tr:hover .compare-table__label` `--color-bg-subtle`.
- Elevation: none. Motion: none.
- Component tokens: `--compare-cols` (2, 3 or 4), set inline on the table from `columns().length`; the `.compare-table` rules read it with the fallback 3.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Cells and sticky label column | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Values, group label, studio names | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Row labels, neighbourhood | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Group rows, photo ground | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Hovered row | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Rules, label column edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Lowest badge | `--color-success-bg` / `--color-success-fg` | `--palette-callaloo-50` / `--palette-callaloo-700` | `--palette-callaloo-950` / `--palette-callaloo-300` |
| Stale badge | `--color-warning-bg` / `--color-warning-fg` | `--palette-mango-50` / `--palette-mango-700` | `--palette-mango-950` / `--palette-mango-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Values, studio names |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Row labels, neighbourhood |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Group label |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Row label, hovered row |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Values, hovered row |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | "Lowest" |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | "Prices may be out of date" |
| `--color-fg-link` | `--color-bg-surface` | 4.5:1 | Studio name links |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the region and links |

Photos and test shots are content and keep their colours. Rules and the label
column's edge are decorative; alignment and header cells carry the structure.
Forced colours: `--color-border-default` becomes `CanvasText`, so the label
column edge stays visible; the sticky column keeps `Canvas` behind it, so
scrolled values never show through.

## Responsive behaviour

- XS to MD (below 62rem): every column is kept; the table's minimum width
  makes it scroll sideways inside `.table-wrap`; each studio column is at least
  160 px; the label column stays at the left edge; the group label stays in
  view; the page itself never scrolls sideways (L2-031.4).
- LG and up (62rem): the minimum width is dropped and up to four studios share
  the container without scrolling, each studio column the same width (L2-031.5).
- Long values wrap in their cell ("4 strobes, 2 LED panels, octabox, 2
  stripboxes, beauty dish, 8 C-stands"); the stale badge wraps (D-4); names
  wrap in the header.
- At 320 px the page has no horizontal scroll; at 200 % zoom in a 1280 px
  viewport (640 CSS px) the table scrolls inside its region and every value is
  reachable by keyboard and swipe.
- Photo `sizes`: `max(10rem, calc((min(100vw, 80rem) - 13rem) / N))`, where N is
  the column count, computed once per render.

## Accessibility

### Role and pattern

A native data table (the [APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/),
static): caption, `th scope="col"` per studio, `th scope="row"` per measurement,
`th scope="rowgroup"` per group, each group its own `tbody`. No ARIA grid. The
wrap is a named `role="region"` scroll container, labelled by the caption.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Reaches the scroll region, then each studio name link in the header, in column order. |
| <kbd>←</kbd> <kbd>→</kbd> | With the region focused: scrolls the studio columns; the label column stays. |
| <kbd>Enter</kbd> | On a studio name: opens its review. |
| Screen-reader table keys | Move cell by cell; each value is read with its headers ("Hourly rate, Leslieville Daylight Studio, $45.50"). |

### Focus

The region always has `tabindex="0"` (D-6). The shared ring shows on the region
and on header links. Focusing a header link that is scrolled out of view
scrolls it into view (browser behaviour; nothing may prevent it). The component
never moves focus.

### Labelling

- Header photos are decorative (`alt=""`); the name follows as the link text.
- Test shots carry the full alt from the data: "The Junction Loft, test shot 1, headshot: even falloff on grey seamless."
- Scores read "4 out of 5": the visible " / 5" is `aria-hidden`, " out of 5" visually hidden.
- "Lowest" and "Prices may be out of date" are badge text, read with the value.

### Announcements

None from the table. The unknown-slug and over-limit alerts (`role="status"`)
and the copy-link toast belong to the page.

### Motion

None. Row hover is an instant fill; sideways scrolling is the browser's own
(design-system rule, no AC).

## Content and internationalisation

- Row labels, sentence case, the same words every time: "All-in, 2 hours", "Hourly rate", "Minimum booking", "Mandatory fees", "Prices verified", "Usable space", "Ceiling height", "Natural light", "Cyc wall", "Included gear", "Parking", "Load-in", "Value", "Light", "Space", "Gear", "Logistics", "Condition", "Overall", "Shot 1 · Headshot", "Shot 2 · Full length", "Shot 3 · Product on table".
- Values formatted by the view model for `en-CA`: "$45.50", "22 Sep 2026", "2 hours", "6.1 m × 4.3 m" (metric only, D-13), "4 / 5", "3.8 / 5", one line per time of day "Morning: Medium"; mandatory fees by name and amount, "Cleaning $25.00"; missing "—".
- Caption: "Comparison of " plus the names in URL order joined with commas and "and", built with `$localize` placeholders.
- Translatable: group and row labels, caption, "Lowest", "Prices may be out of date", " / 5", " out of 5". Data: studio names, neighbourhoods, gear, parking, load-in text, alt text.
- Longer translations: the label column is 9rem; a language whose labels wrap past three lines widens it in the application CSS (`:lang(fr) .compare-table col.compare-table__labels { width: 11rem }` and the matching minimum), as the design system shows.

## Performance

- Change detection: `OnPush`, signal inputs; `sizes`, the caption ID and the
  colspan come from `computed`s. No method calls in the template.
- Lists: `@for` over columns tracked by `slug`, groups and rows by `key`, cells by `$index`.
- Images: the first studio's header photo has `priority` (`loading="eager"`,
  `fetchpriority="high"`); all other photos and every test shot lazy-load with
  `width` and `height` reserved (ICD-MEDIA-2).
- Server rendering: the table renders on the server from the view model, with
  no browser-only code, so the HTML holds every value (L2-033).
- Performance scenario: the application's acceptance suite measures
  `/compare?studios=the-junction-loft,leslieville-daylight-studio,ossington-blackbox,liberty-cyc-house`
  (four studios, every group, twelve test shots) with Lighthouse in mobile mode
  against L2-071. Being an application component, it has no harness route.
- Regression rule: a change to the template, view model or `.compare-table*`
  CSS is measured on that page against the base branch before it is pushed.
- Layout stability: the 3:2 and 4:5 slots and the reserved image dimensions
  keep the columns from growing as images arrive (CLS).
- Weight: imports `TableComponent`, `BadgeComponent`, `LinkComponent`,
  `ResponsiveImageComponent` and `RouterLink`; nothing else.

## Acceptance criteria

### Rendering

- **AC-1** Given the view model for The Junction Loft, Leslieville Daylight Studio and Ossington Blackbox, when the comparison renders, then a region named "Comparison of The Junction Loft, Leslieville Daylight Studio and Ossington Blackbox" holds a `table` with the classes `table compare-table`, `--compare-cols: 3`, four `col`s, an empty corner cell and three studio column headers in that order. (L2-031)
- **AC-2** Given the same comparison, when it renders, then five `tbody` groups appear in the order Cost, Space and light, Gear and logistics, Scores, Test shots, each starting with a `th scope="rowgroup"` spanning four columns, and every row has exactly one value cell per studio. (L2-031)
- **AC-3** Given the same comparison, when the "Shot 1 · Headshot" row renders, then it holds each studio's test shot 1 side by side, the first with the alt "The Junction Loft, test shot 1, headshot: even falloff on grey seamless.". (L2-031)
- **AC-4** Given `/compare?studios=the-junction-loft,leslieville-daylight-studio` fetched without JavaScript, when the HTML arrives, then it contains the comparison table with both studios' column headers and the values "$145.00" and "$91.00". (L2-033)

### Variants

- **AC-5** Given the link `/compare?studios=the-junction-loft,annex-attic-studio,leslieville-daylight-studio`, when the comparison renders, then the table has two studio columns, The Junction Loft then Leslieville Daylight Studio, `--compare-cols: 2` and group cells spanning three columns. (L2-032)
- **AC-6** Given a link with six valid slugs starting with the-junction-loft, leslieville-daylight-studio, ossington-blackbox and liberty-cyc-house, when the comparison renders, then the table has exactly those four studio columns in that order and `--compare-cols: 4`. (L2-032)
- **AC-7** Given `/compare?studios=the-junction-loft`, when the page renders, then no comparison table is present and an empty state "Pick at least two studios to compare" links "Browse studios" to the studio list. (L2-032)

### States

- **AC-8** Given the three-studio comparison, when the "All-in, 2 hours" row renders, then Leslieville Daylight Studio's cell shows "$91.00" with a success badge reading "Lowest", and no other cell in the table has that badge. (L2-031)
- **AC-9** Given two compared studios that both have `isLowest` true, when the row renders, then both cells show the "Lowest" badge. (L2-031)
- **AC-10** Given the three-studio comparison, when it renders, then Leslieville Daylight Studio's and Ossington Blackbox's "Mandatory fees" cells show "—", and no value cell in any `tbody` is empty. (L2-031)
- **AC-11** Given Ossington Blackbox with `priceStale` true, when the comparison renders, then its "All-in, 2 hours" cell shows "$270.00" followed by a warning badge reading "Prices may be out of date", and its "Prices verified" cell shows "2 Mar 2026". (L2-043)

### Keyboard and focus

- **AC-12** Given the three-studio comparison, when a keyboard user tabs from "Change studios", then focus goes to the table region, then "The Junction Loft", "Leslieville Daylight Studio" and "Ossington Blackbox", and Enter on "Leslieville Daylight Studio" opens `/studios/leslieville-daylight-studio`. (L2-067)
- **AC-13** Given the comparison at 360 px with the region focused, when the user presses → five times, then the studio columns scroll left while the row labels stay at the left edge, and the region shows a 2 px focus ring with at least 3:1 contrast. (L2-067)

### Screen readers

- **AC-14** Given the three-studio comparison, when the accessibility tree is inspected, then the cell "$45.50" has the row header "Hourly rate" and the column header "Leslieville Daylight Studio". (L2-069)
- **AC-15** Given The Junction Loft's "Value" score of 4, when its cell's text is read by assistive technology, then it reads "4 out of 5" and the visible " / 5" is hidden from it. (L2-069)
- **AC-16** Given the default, four-studio and unknown-slug comparisons, when axe-core scans them in the light and the dark theme at 320 px and 1280 px, then no violation is reported. (L2-069)

### Theming

- **AC-17** Given the three-studio comparison, when the contrast check runs in the light and the dark theme, then row labels, values, the group labels on the sunken rows, a hovered row's label, "Lowest" and "Prices may be out of date" are each at least 4.5:1 against their background. (L2-068)
- **AC-18** Given the three-studio comparison, when its images are inspected, then the three header photos have `alt=""` and all nine test shots have a non-empty `alt`. (L2-068)

### Responsive

- **AC-19** Given the three-studio comparison at 360 px, when it renders, then each studio column is at least 160 px wide, the table scrolls inside its region, and `document.documentElement.scrollWidth` equals 360. (L2-031)
- **AC-20** Given the three-studio comparison at 360 px scrolled fully right, when the "Cost" group and "Hourly rate" row are in view, then the label "Cost" and the row label "Hourly rate" are still visible at the left edge. (L2-031)
- **AC-21** Given the four-studio comparison at 1024 px, when it renders, then the region's `scrollWidth` equals its `clientWidth` and the four studio columns are equal in width. (L2-031)
- **AC-22** Given the four-studio comparison at 320 px, when it renders, then `document.documentElement.scrollWidth` equals 320 and no row label is clipped. (L2-064)
- **AC-23** Given the three-studio comparison at 200 % zoom in a 1280 px viewport, when the user scrolls the region, then every value and test shot is reachable and the page has no horizontal scroll. (L2-066)
- **AC-24** Given the stale Ossington Blackbox column at 360 px, when it renders, then "Prices may be out of date" wraps inside its 160 px column and nothing overflows the cell. (L2-031)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the table has no
animation; row hover is an instant fill
([compare-table.html](../../design-system/components/compare-table.html), Accessibility › Motion).

### Performance

- **AC-25** Given the four-studio comparison, when it is measured with Lighthouse in mobile mode, then LCP is at most 2.5 s, CLS at most 0.1 and INP at most 200 ms. (L2-071)
- **AC-26** Given the four-studio comparison, when its images are inspected, then only The Junction Loft's header photo has `loading="eager"` and `fetchpriority="high"`, and every other photo and test shot has `loading="lazy"` with `width` and `height`. (L2-072)

## Implementation notes

- Folder `frontend/projects/shot-there/src/app/features/compare/compare-table/`:
  `compare-table.component.ts` (`CompareTableComponent`, selector
  `st-compare-table`), `compare-table.component.html`, `compare-table.component.css`
  (the `.compare-table*` rules from `components.css`, adapted per D-4 and D-5).
  Types `ComparisonColumn`, `ComparisonGroup`, `ComparisonRow`,
  `ComparisonRowKind`, `ComparisonCell` in their own files in `features/compare/`.
- `toComparisonViewModel(dto)` (beside the page) builds caption, columns and
  groups, substitutes "—" and maps `isLowestAllInCost` and `priceStale` to the
  all-in cell's `isLowest` and `isStale`.
- Composes `table[st-table]` (no `stack`), `st-badge` (`tone="success"`;
  `tone="warning"`), `a[st-link]`, `st-responsive-image`.
- No ICD change: the stale badge wraps by itself (badge.md D-3; D-4).
- Mocks drift the component corrects: the inline `white-space: normal` on the
  stale badge (the badge wraps by itself, badge.md D-3), the inline `display: block` on the neighbourhood
  caption, the missing `span` around group labels, the missing region
  attributes on the wrap, and raw `img`s in place of `st-responsive-image`.

## Decisions

- **D-1** *The brief says `features/comparison`; the detailed design names
  `features/compare` and `ComparePageComponent`.* `features/compare/compare-table/`,
  following the detailed design, which is the feature's source of truth for
  folders and names.
- **D-2** *The detailed design's `ComparisonRow { label, cells }` and
  `ComparisonCell { text, isLowest }` cannot carry groups, multi-line natural
  light, scores, test shots or the stale marker that L2-031, L2-043 and the
  mocks need.* The view model grows `ComparisonGroup`, a row `key` and `kind`,
  and a cell with `lines`, `emphasis`, `isLowest`, `isStale` and `shot`
  (`text` becomes `lines`). These are application types; no library type changes.
- **D-3** *`.compare-table` sets `table-layout` and `min-width` on the
  `table[st-table]` host, where ICD-DOM-5 limits the application to margin,
  placement and width.* The `.compare-table` block is the application's own
  (ICD-002 §11.2), on the element the application writes, and it overrides
  nothing the library's `.table` sets; `min-width` and `table-layout` are read as
  the width allowance. The cells are the application's own markup.
- **D-4** *The stale badge must wrap in a 160 px column, but `.badge` does not
  wrap and the application may not style a library class (`.compare-table .badge`).*
  No input is needed: `st-badge` itself wraps a label wider than its container
  ([badge.md](badge.md) D-3), so `tone="warning"` alone fits the column.
- **D-5** *The design system sizes photos with `.compare-table thead th img` and
  `td img`, which would reach inside `st-responsive-image`.* Each image sits in
  an application `span.compare-table__photo` (3:2, `--radius-md`) or
  `span.compare-table__shot` (4:5, `--radius-sm`) that clips it; the image fills
  the span's width. The design-system page catches up at the next extraction.
- **D-6** *The mocks give the scroll wrap no `tabindex`, role or name.*
  `tabindex="0" role="region" aria-labelledby="<caption id>"`, as the design
  system resolves, always present: the server cannot know whether the table
  will overflow, and one extra named tab stop at LG is harmless.
- **D-7** *Group labels scroll away on phones in the mocks.* The label sits in a
  `span` made sticky at `left: var(--space-3)`, as the design system fixed.
- **D-8** *What does the component do with fewer than two columns?* It renders
  nothing; the page shows the empty state (L2-032.3). With two to four it
  renders all of them; the server never sends more than four (L2-032.4).
- **D-9** *How are ties for the lowest all-in cost shown?* Every tied studio
  gets "Lowest", from the server's `isLowestAllInCost`, as the design system
  states.
- **D-10** *The design system colours header links with `.compare-table thead th a`.*
  Dropped: the names are `a[st-link]`, whose `--color-fg-link` equals
  `--color-fg-default` in both themes, so the look is unchanged and no
  application rule targets a library host's colour.
- **D-11** *Are scores `st-score-overall`?* No. The comparison uses the compact
  score (number, hidden " out of 5", no pips) that the score CRD and design
  system define for tight cells; the overall is the same in `<strong>`.
- **D-12** *L2-031 lists "price last-verified date" after the overall score;
  the mocks put "Prices verified" in the Cost group (mocks assumption 12).* The
  Cost group, as the design system fixes the group order: the date belongs
  beside the prices it qualifies, and L2-031 names the rows, not their order.
- **D-13** *Usable space and ceiling height show metres only in the mocks,
  though L2-006 asks the studio page for metres and feet.* Metres only in the
  comparison (L2-031 does not ask for feet, and the mocks fit 160 px columns
  this way); the view model formats it. Raised for the owner's content decision.
