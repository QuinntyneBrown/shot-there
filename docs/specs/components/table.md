# Table

| Field | Value |
|---|---|
| Selector | `table[st-table]` |
| Library path | `frontend/projects/components/src/lib/table/` (component); `frontend/projects/components/styles/utilities.css` (the `.table*` cell rules, D-1) |
| Status | planned |
| Traces to | L2-015, L2-018, L2-026, L2-031, L2-063, L2-064, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`table.html`](../../design-system/components/table.html), [`patterns/tables-and-lists.html`](../../design-system/patterns/tables-and-lists.html) |
| Source mocks | [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html), [`pages/admin-studios/default`](../../mocks/pages/admin-studios/default.html), [`pages/admin-studios/loading`](../../mocks/pages/admin-studios/loading.html), [`pages/admin-studios/empty`](../../mocks/pages/admin-studios/empty.html), [`pages/admin-studios/no-results`](../../mocks/pages/admin-studios/no-results.html), [`pages/admin-studios/error`](../../mocks/pages/admin-studios/error.html), [`pages/admin-spots/default`](../../mocks/pages/admin-spots/default.html), [`pages/admin-guides/default`](../../mocks/pages/admin-guides/default.html), [`pages/compare/default`](../../mocks/pages/compare/default.html) |
| Rendering | [`table.html`](table.html) |

## Purpose and scope

The table holds the records people read across and down at once: a spot's
light by time of day ("Golden hour · Strong · West light rakes the brick; the
best hour here.") and by season, its permits by shoot type ("Commercial ·
Required"), and the owner's lists of studios, spots and guides with status,
last-updated date and flags. Below 48rem every ShotThere table becomes a column
of label-over-value cards, so nothing scrolls sideways on a phone.

Use [`st-description-list`](description-list.md) (`.kv`) when each row is one
label and one value (a studio's pricing, specifications, gear, logistics, a
spot's practical conditions and directions): there is nothing to read down a
column. The side-by-side comparison of two to four studios is the application's
[`st-compare-table`](compare-table.md), which puts `table[st-table]` under its own
`.compare-table` block and scrolls sideways instead of stacking.

Out of scope:

- The caption, header cells, rows, cells, `data-label` attributes and
  `aria-sort`: the application writes them as native content (ICD-002 §9.4).
- The `.table-wrap` container and its `aria-busy`: a global utility the
  application writes around the table.
- What goes in a cell: [`st-light-rating`](score.md), [`st-badge`](badge.md),
  [`st-status`](status-label.md), [`a[st-link]`](link.md), the Edit
  [`a[st-button]`](button.md), [`st-skeleton`](skeleton.md), `<time>`.
- Sorting, filtering and searching rows, the result count, and the order of
  rows: application logic (ICD-API-10). The admin lists have a fixed order.
- Empty, no-results and error: the application renders
  [`st-empty-state`](empty-state.md) instead of the table (D-4).

## Usage

Every `table.table` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks table "table"`, plus `grep table-wrap`), grouped
by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/spot/default`, `map-failed`, `no-rain-backup`, `no-video`, `stale-permit` "Best light › By time of day" | `stack`; 3 columns (Time, Rating, Note); 5 rows | Visually hidden caption "Light at Evergreen Brick Works by time of day"; row header "Morning" … "Blue hour"; `st-light-rating` (word plus `aria-hidden` pips) in Rating; one-sentence note | default, hover; stacked below 48rem | canvas (review section) |
| Same pages, "By season" | `stack`; 2 columns (Season, Note); 4 rows | Caption "Conditions at Evergreen Brick Works by season"; "Spring" … "Winter" | default; stacked | canvas |
| Same pages, "Permits" | `stack`; 2 columns (Shoot type, Permit); 4 rows | Caption "Permit needed at Evergreen Brick Works by shoot type"; `st-badge` success "Not required" or neutral "Required"; the verified line and source link follow the wrap (application) | default; all four "Required" for Distillery District (`stale-permit`), with the page's stale `st-alert` below | canvas |
| `pages/admin-studios/default` | `stack`; 5 columns (Name, Status, Last updated sorted, Flags, hidden Actions); 9 rows | Caption "Studios, most recently updated first"; row header = editor link "Ossington Blackbox" + muted neighbourhood "Ossington"; `st-status` Draft / Published; `<time datetime="2026-03-06">6 Mar 2026</time>`; flags "None" (muted text), `st-badge` info "Due soon", warning "Prices stale"; `a[st-button]` sm "Edit" + hidden " Ossington Blackbox" with no `data-label` | default, hover, focus on links and Edit; stacked below 48rem | canvas |
| `pages/admin-spots/default` | as above, 6 rows | Caption "Outdoor spots, most recently updated first"; flags "Permits stale" | as above | canvas |
| `pages/admin-guides/default` | as above, columns Title, Status, Last updated, Entries, Actions; 4 rows | Caption "Guides, most recently updated first"; row header is the title link only; Entries "2", "3" | as above | canvas |
| `pages/admin-studios/loading`, `admin-spots/loading`, `admin-guides/loading` | `stack`; wrap `aria-busy="true"`; real caption and header row; 5 skeleton rows | `st-skeleton` text and pill placeholders per cell | loading | canvas |
| `pages/admin-*/empty`, `no-results`, `error` | no table | `st-empty-state` "No studios yet", "No studios match “parkdale”", "We couldn't load your studios" | empty, no results, error | canvas |
| `pages/compare/*`, `notifications/public-toast/*` (behind the toast) | `stack` false, under the application's `.compare-table` | see [`compare-table.md`](compare-table.md) | default, hover; scrolls sideways | canvas |

Every row above is buildable with the API below: `stack` is an input; the
caption, header cells, `scope`, `data-label`, `aria-sort`, cells and the wrap
are the application's native markup; cell contents are other library
components. No mock uses `dense`; ICD-002 fixes it and this CRD specifies it
(D-2).

## Anatomy

1. **Wrap** — `div.table-wrap` (global utility, written by the application):
   hairline top rule in `--color-border-default`, `--color-bg-surface` fill,
   `overflow-x: auto`. Carries `aria-busy="true"` while rows load. When the
   table inside stacks (below 48rem) the wrap drops its rule, fill and scroll.
2. **Table** — the host itself, `table.table` (plus `.table--stack`,
   `.table--dense`). Full width, `border-collapse: collapse`, `--text-body-sm`.
3. **Caption** — `<caption>`, usually `class="visually-hidden"` under a section
   heading; otherwise `--text-label` in `--color-fg-muted`, left-aligned, above.
4. **Column header** — `thead th[scope="col"]`: `--text-label` in
   `--color-fg-muted` on `--color-bg-surface`, no wrap, sticky to the top of the
   wrap. The action column's header holds only a visually hidden "Actions".
5. **Row header** — `tbody th[scope="row"]`: `--text-body-sm` at
   `--font-weight-medium` in `--color-fg-default`: the time of day, the season,
   the shoot type, or the record's name link plus a muted, regular-weight
   neighbourhood (`<br><span class="text-muted">`).
6. **Cell** — `td` with `data-label` (the column name) when the table stacks;
   padding `--space-4` × `--space-3`; hairline rule beneath, none under the last
   row. `td.num` / `th.num` right-align with tabular figures.
7. **Stacked card** (below 48rem, `.table--stack`) — each `tr` is a card:
   `--space-4` padding, `--radius-md`, hairline `--color-border-default` edge,
   `--space-3` below; the row header is the card title; each `td[data-label]`
   prints its label above the value.

Host: the component uses an attribute selector on the native element, so the
host **is** the `<table>` and the component adds no wrapper (ICD-DOM-1). Its
template is a single `<ng-content />`; everything inside the table is the
application's native markup.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `stack` | `boolean` | `false` | no | Adds `.table--stack`: label-over-value cards below 48rem. Every public and admin table in the mocks sets it; the application then writes `data-label` on every `td` except an action cell. |
| `dense` | `boolean` | `false` | no | Adds `.table--dense`: cell block padding `--space-2` instead of `--space-4` (D-2). No current screen uses it. |

Both use `booleanAttribute`, so `<table st-table stack>` works. The host
always carries `.table`; the classes come from one `computed`.

Native content and attributes belong to the consumer: `<caption>` (required by
this CRD, D-9), `<colgroup>`, `<thead>`, `<tbody>` (one or more), `th scope`,
`colspan`, `aria-sort` on the column the rows are ordered by, `data-label` on
cells, `class` on the host for an application block (`compare-table`), and the
`--compare-cols` custom property in `style`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The table is not interactive. Links and buttons inside cells are their own components. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | `caption`, `colgroup`, `thead`, `tbody` | Native table content written by the application. The component never queries or changes it (ICD-API-9). |

The table has no library strings (ICD-002 §12): the caption, headers, the
hidden "Actions" and every cell come from the consumer.

## Variants and sizes

| Variant | Classes | Use for |
|---|---|---|
| Reference table | `.table.table--stack` | A spot's light by time of day (Time, Rating, Note) and by season (Season, Note) (L2-015). No focusable content. |
| Permit table | `.table.table--stack` | Shoot type against an `st-badge`: success "Not required", neutral "Required" (L2-018). |
| Admin list | `.table.table--stack` | Studios, spots or guides with Status, Last updated (`aria-sort="descending"`), Flags or Entries, and Edit (L2-063). The only table with links and buttons. |
| Comparison base | `.table.compare-table` | The application's comparison table; `stack` false, scrolls sideways ([compare-table.md](compare-table.md)). |
| Dense | `.table--dense` | Not used today; tighter rows for a longer list (D-2). |

| Size | Cell padding (block × inline) | Type |
|---|---|---|
| Default | `--space-4` × `--space-3` | Cells `--text-body-sm`; headers `--text-label` |
| Dense | `--space-2` × `--space-3` | Same |

Width is always 100 % of the wrap. Columns size from their content (`auto`
layout) except where an application block sets `table-layout` (compare table).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Surface fill, hairline rules between rows | Native table: caption, column and row headers announced with each cell |
| Row hover | `tbody tr:hover` | Row fills `--color-bg-subtle` (from 48rem); stacked cards keep `--color-bg-surface` | — |
| Focus | `:focus-visible` on a link or button in a row | Shared ring `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset`, at least 3:1 on the hovered fill | Focus on the control, never the row |
| Active | `:active` on a link or button | The control's own active state | — |
| Disabled | — | Not used: drafts and published rows are both editable | — |
| Sorted | `aria-sort="descending"` on "Last updated" (application) | Plain header text; no arrow, no button (D-5) | "Last updated, sorted descending" |
| Loading | `aria-busy="true"` on `.table-wrap` (application); five skeleton rows | Real caption and header row; `st-skeleton` in each cell, row structure as loaded (D-3) | Region busy; the visible headers stay |
| Empty, no results, error | Application | No table: `st-empty-state` replaces the wrap (D-4) | The empty state's heading and actions |
| Stacked | viewport below 48rem with `stack` | Header row visually hidden, each row a card, labels above values | Headers stay in the tree; cells keep their header associations |
| Selected | — | Not ported: no ShotThere table selects a row (D-6) | — |

## Markup

```html
<!-- rendered: reference table (application content inside the host) -->
<div class="table-wrap">
  <table class="table table--stack">
    <caption class="visually-hidden">Light at Evergreen Brick Works by time of day</caption>
    <thead><tr><th scope="col">Time</th><th scope="col">Rating</th><th scope="col">Note</th></tr></thead>
    <tbody>
      <tr>
        <th scope="row">Golden hour</th>
        <td data-label="Rating"><span class="light-rating"><span class="pips" aria-hidden="true"><i data-on></i><i data-on></i><i data-on></i></span>Strong</span></td>
        <td data-label="Note">West light rakes the brick; the best hour here.</td>
      </tr>
    </tbody>
  </table>
</div>
```

```html
<!-- rendered: permit table -->
<div class="table-wrap">
  <table class="table table--stack">
    <caption class="visually-hidden">Permit needed at Evergreen Brick Works by shoot type</caption>
    <thead><tr><th scope="col">Shoot type</th><th scope="col">Permit</th></tr></thead>
    <tbody>
      <tr><th scope="row">Portrait</th><td data-label="Permit"><span class="badge badge--success">Not required</span></td></tr>
      <tr><th scope="row">Commercial</th><td data-label="Permit"><span class="badge">Required</span></td></tr>
    </tbody>
  </table>
</div>
```

```html
<!-- rendered: admin list row, sorted header, hidden action header -->
<div class="table-wrap">
  <table class="table table--stack">
    <caption class="visually-hidden">Studios, most recently updated first</caption>
    <thead><tr>
      <th scope="col">Name</th><th scope="col">Status</th>
      <th scope="col" aria-sort="descending">Last updated</th><th scope="col">Flags</th>
      <th scope="col"><span class="visually-hidden">Actions</span></th>
    </tr></thead>
    <tbody><tr>
      <th scope="row"><a href="/admin/studios/ossington-blackbox">Ossington Blackbox</a><br><span class="text-muted">Ossington</span></th>
      <td data-label="Status"><span class="status status--published">Published</span></td>
      <td data-label="Last updated"><time datetime="2026-03-06">6 Mar 2026</time></td>
      <td data-label="Flags"><span class="badge badge--warning">Prices stale</span></td>
      <td><a class="btn btn--sm" href="/admin/studios/ossington-blackbox">Edit<span class="visually-hidden"> Ossington Blackbox</span></a></td>
    </tr></tbody>
  </table>
</div>
```

```html
<!-- rendered: loading (five rows, same structure as a loaded row) -->
<div class="table-wrap" aria-busy="true">
  <table class="table table--stack">
    <caption class="visually-hidden">Studios, most recently updated first</caption>
    <thead>…as loaded…</thead>
    <tbody><tr>
      <th scope="row"><span class="skeleton skeleton--text"></span><span class="skeleton skeleton--text"></span></th>
      <td data-label="Status"><span class="skeleton skeleton--text"></span></td>
      <td data-label="Last updated"><span class="skeleton skeleton--text"></span></td>
      <td data-label="Flags"><span class="skeleton skeleton--pill"></span></td>
      <td><span class="skeleton skeleton--pill"></span></td>
    </tr></tbody>
  </table>
</div>
```

`dense` adds `.table--dense`. Angular's `_ngcontent-*` and `_nghost-*`
attributes are not part of the contract (ICD-DOM-3).

```html
<!-- consumer: spot page, light by time of day -->
<div class="table-wrap">
  <table st-table stack>
    <caption class="visually-hidden" i18n>Light at {{ spot().name }} by time of day</caption>
    <thead><tr><th scope="col" i18n>Time</th><th scope="col" i18n>Rating</th><th scope="col" i18n>Note</th></tr></thead>
    <tbody>
      @for (row of lightRows(); track row.key) {
        <tr>
          <th scope="row">{{ row.time }}</th>
          <td i18n-data-label data-label="Rating"><st-light-rating [level]="row.level" [text]="row.levelText" /></td>
          <td i18n-data-label data-label="Note">{{ row.note }}</td>
        </tr>
      }
    </tbody>
  </table>
</div>

<!-- consumer: admin studios list -->
<div class="table-wrap" [attr.aria-busy]="loading() || null">
  <table st-table stack>
    <caption class="visually-hidden" i18n>Studios, most recently updated first</caption>
    <thead><tr>
      <th scope="col" i18n>Name</th><th scope="col" i18n>Status</th>
      <th scope="col" aria-sort="descending" i18n>Last updated</th><th scope="col" i18n>Flags</th>
      <th scope="col"><span class="visually-hidden" i18n>Actions</span></th>
    </tr></thead>
    <tbody>
      @for (row of rows(); track row.id) {
        <tr>
          <th scope="row"><a st-link [routerLink]="row.editLink">{{ row.name }}</a><br><span class="text-muted">{{ row.area }}</span></th>
          <td i18n-data-label data-label="Status"><st-status [status]="row.status">{{ row.statusText }}</st-status></td>
          <td i18n-data-label data-label="Last updated"><time [attr.datetime]="row.updated.datetime">{{ row.updated.text }}</time></td>
          <td i18n-data-label data-label="Flags">
            @if (row.flag) { <st-badge [tone]="row.flag.tone">{{ row.flag.text }}</st-badge> }
            @else { <span class="text-muted" i18n>None</span> }
          </td>
          <td><a st-button size="sm" [routerLink]="row.editLink"><ng-container i18n>Edit</ng-container><span class="visually-hidden"> {{ row.name }}</span></a></td>
        </tr>
      }
    </tbody>
  </table>
</div>
```

## Design

- Layout: the host is `display: table`, `width: 100%`, `border-collapse: collapse`.
- Type: cells `--text-body-sm`; column headers and the caption `--text-label`;
  row headers `--text-body-sm` at `--font-weight-medium`, their muted
  neighbourhood at `--font-weight-regular` (D-7); stacked card titles
  `--text-label` at `--font-size-md`; stacked labels `--text-label`.
- Spacing: cell padding `--space-4` block and `--space-3` inline (dense:
  `--space-2` block); stacked card padding `--space-4`, gap below `--space-3`,
  stacked cell padding `--space-1` block, title padding-bottom `--space-2`.
- Rules: `--border-width-hairline` in `--color-border-default` under each row,
  none under the last row; the wrap's top rule the same.
- Shape: stacked card `--radius-md`. No elevation.
- Sticky: column headers `position: sticky; top: 0` inside the wrap.
- Alignment: left and `vertical-align: middle`; `.num` cells right-aligned with
  `font-variant-numeric: tabular-nums`.
- Motion: none. Row hover is an instant fill change.
- The table declares no component tokens; it reads semantic tokens, and an
  application block (the compare table) adds its own rules on top.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Wrap, header and stacked card fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Rules, stacked card edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Hovered row | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Cell text, row header, record link | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Column header, caption, neighbourhood, "None" | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Stacked label | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Cell text, row headers |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Column headers, neighbourhood, "None" |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Stacked labels |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Cell text on a hovered row |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Muted text on a hovered row |
| `--color-success-fg` | `--color-bg-subtle` | 4.5:1 | "Published" on a hovered row |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | "Prices stale" badge |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | "Not required" badge |
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | "Due soon" badge |
| `--color-fg-link` | `--color-bg-surface` | 4.5:1 | Record name link |
| `--color-focus-ring` | `--color-bg-subtle` | 3:1 | Focus ring on a hovered row |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a resting row |

Row rules and the stacked card edge are decorative (alignment, headers and the
card titles carry the structure). Forced colours: `--color-border-default`
resolves to `CanvasText` (tokens), so rules and card edges stay visible; the
hover fill is dropped by the browser, which loses nothing.

## Responsive behaviour

- Below 48rem (XS and SM) `.table--stack` hides the header row visually (it
  stays in the accessibility tree), displays the table, `tbody`, rows, row
  headers and cells as blocks, makes each row a card with its row header as the
  title, and prints each `td[data-label]` label above its value (L2-015.3,
  L2-063.3). The wrap drops its top rule, fill and scroll. An action cell has
  no `data-label`, so the Edit button stands alone at the bottom of the card.
- From 48rem the same markup is an ordinary table; nothing is duplicated for
  phones. The admin list's five columns fit 768 px without sideways scroll.
- A table without `stack` keeps its columns and scrolls inside `.table-wrap`;
  only the compare table does this, and it makes the wrap a focusable region
  ([compare-table.md](compare-table.md)).
- Text wraps in cells (notes, names); column headers do not wrap from 48rem.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom in a 1280 px
  viewport the tables are stacked and fully available; the admin Edit button is
  44 px tall below 48rem through the shared small-button rule, and the name link
  is at least 24 px tall.
- The stacked rules use `(max-width: 47.99rem)`, as the design system writes
  them, rather than a `min-width` restore (D-8).

## Accessibility

### Role and pattern

A native `<table>` with `<caption>`, `<thead>`, `th scope="col"` and
`th scope="row"`: the [APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
without ARIA roles. The stacked layout changes CSS `display` only. The
application never rebuilds a table out of `div`s for phones, and the component
adds no `role` to the host. If an engine drops table semantics for
`display: block` tables, that is accepted: the row header, the visible
`data-label` and the value still read in order ("Golden hour, Rating, Strong").

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the name links and Edit buttons of admin rows in reading order (name, then Edit, row by row). Reference and permit tables contain nothing focusable. |
| <kbd>Enter</kbd> | Follows the name link or the Edit link. |
| Screen-reader table keys | Move cell by cell with headers announced; the component adds no arrow-key grid behaviour. |

### Focus

Focus lands on the link or button, never on a row or cell. The shared ring
(`--color-focus-ring`, `--focus-ring-width`, `--focus-ring-offset`) stays at
least 3:1 against the hovered row fill. The component never moves focus.

### Labelling

- The caption names the table: "Studios, most recently updated first",
  "Permit needed at Evergreen Brick Works by shoot type".
- The action column's header holds a visually hidden "Actions"; each Edit link
  appends the record's name in `.visually-hidden` ("Edit Ossington Blackbox").
- Pips are `aria-hidden`; the rating word is the cell's content.
- "None" is a word in a muted span, never a blank cell.

### Announcements

The table has no live region. Loading is `aria-busy` on the wrap; the result
count of a searched admin list is the application's
`st-result-count`.

### Motion

None. Row hover is an instant fill change; the loading skeleton's shimmer
belongs to [`st-skeleton`](skeleton.md) and stops under
`prefers-reduced-motion: reduce` (design-system rule, no AC).

## Content and internationalisation

- Column headers are one or two words in sentence case: "Shoot type", "Last
  updated". Row headers name the thing described: "Golden hour", "Wedding or
  engagement".
- Ratings are words from the fixed scale (None, Low, Medium, Strong); permits
  "Required" or "Not required". Notes are one sentence with a full stop.
- Admin dates are short, "6 Mar 2026", inside `<time datetime="2026-03-06">`,
  formatted by the application for `en-CA`.
- Absent values are words ("None"), never a blank cell or a lone dash.
- Captions say what and whose: "Light at Evergreen Brick Works by time of day".
- Translatable: caption, header text, hidden "Actions", `data-label` values
  (`i18n-data-label`), "None", "Edit". Data: spot, studio and guide names,
  neighbourhoods, notes, dates.
- Longer translations wrap in cells; stacked labels wrap above their values;
  column headers from 48rem stay on one line, and a translation that no longer
  fits five admin columns at 768 px is shortened in the catalogue.

## Performance

- Change detection: `OnPush`; the host class string is one `computed` of
  `stack` and `dense`. The component has no template logic beyond
  `<ng-content />`.
- Rows are the application's `@for` with a stable `track` (slug or id).
- Performance scenario: the `components-harness` route `table/performance`
  renders the admin studios list: five loading rows inside an `aria-busy` wrap,
  then the nine rows from the cast (Corktown Garage Studio … Ossington Blackbox)
  at 360 px and 1280 px; held to the L2-071 layout-shift budget.
- Regression rule: a change to the component, its host bindings or the global
  `.table*` rules is measured on that route against the base branch before it
  is pushed.
- Layout stability: loading rows keep the loaded row structure (row header,
  labelled cells, pill placeholders the size of a badge and of the small Edit
  button), so stacked cards keep their height when data arrives (D-3).
- Weight: imports only `@angular/core`; the CSS is part of the global
  stylesheet (D-1), a few hundred bytes.

## Acceptance criteria

### Rendering

- **AC-1** Given `<table st-table stack>` holding Evergreen Brick Works' light caption, header row and five rows, when it renders, then the element is a native `table` with the classes `table table--stack`, no element is added around or inside it by the component, and the caption, `th scope="col"` and `th scope="row"` cells are exactly those the application wrote. (L2-069)
- **AC-2** Given Evergreen Brick Works' light-by-time table, when it renders at 1280 px, then the row headed "Golden hour" shows "Strong" in the Rating column and "West light rakes the brick; the best hour here." in the Note column. (L2-015)
- **AC-3** Given Evergreen Brick Works' season table, when it renders, then the row headed "Winter" shows "Skating rink in the courtyard; icy paths, so wear grips." and there are exactly four rows, Spring to Winter. (L2-015)
- **AC-4** Given Evergreen Brick Works' permit table, when it renders, then the "Portrait" row shows a success badge reading "Not required" and the "Commercial" row a neutral badge reading "Required". (L2-018)
- **AC-5** Given the admin studios list with nine studios, when it renders, then the rows run from "Corktown Garage Studio" (11 Oct 2026) to "Ossington Blackbox" (6 Mar 2026), the "Last updated" header has `aria-sort="descending"`, and each row has a status label and a `<time>` with a `datetime` attribute. (L2-063)
- **AC-6** Given the same list, when it renders, then Ossington Blackbox's Flags cell shows the warning badge "Prices stale", Liberty Cyc House's the info badge "Due soon", and every other Flags cell the muted word "None", with no empty cell. (L2-063)
- **AC-7** Given `<table st-table class="compare-table">` without `stack`, when it renders at 360 px, then the host has the classes `table compare-table` and no `table--stack`, and its rows stay table rows inside the scrolling wrap. (L2-031)

### States

- **AC-8** Given the admin studios list at 1280 px, when the pointer rests on the Ossington Blackbox row, then the row fills with `--color-bg-subtle` and the row's text, "Published" and "Prices stale" each keep at least 4.5:1 against what is behind them. (L2-068)
- **AC-9** Given the admin studios list while its request is pending, when it renders, then the `.table-wrap` has `aria-busy="true"`, the caption and five column headers are present, and five rows of skeleton placeholders follow, each with a row header and labelled cells. (L2-026)
- **AC-10** Given the admin studios request fails, when the page renders, then no table and no header row are shown, and an empty state "We couldn't load your studios" with a "Try again" button takes its place. (L2-026)
- **AC-11** Given the owner searches the admin studios list for "parkdale", when no row matches, then no table is shown and an empty state reads "No studios match “parkdale”" with a "Clear search" action. (L2-063)

### Keyboard and focus

- **AC-12** Given the admin studios list, when a keyboard user tabs from the search field, then focus moves to "Corktown Garage Studio", then "Edit Corktown Garage Studio", then "Annex Attic Studio", and no row or cell receives focus. (L2-067)
- **AC-13** Given the pointer over the Liberty Cyc House row, when a keyboard user tabs to its Edit button, then a 2 px `--color-focus-ring` ring is drawn round it with at least 3:1 contrast against the hovered row fill. (L2-067)
- **AC-14** Given Evergreen Brick Works' page, when a keyboard user tabs through the "Best light" and "Permits" sections, then no element inside the three tables receives focus. (L2-067)

### Screen readers

- **AC-15** Given the light-by-time table at 1280 px and at 360 px, when the accessibility tree is inspected, then the cell "Strong" has the column header "Rating" and the row header "Golden hour", and the column header row is present though visually hidden at 360 px. (L2-069)
- **AC-16** Given the admin studios list, when a screen reader lists links, then each Edit link is named after its studio ("Edit Ossington Blackbox"), and the last column header's accessible name is "Actions". (L2-069)
- **AC-17** Given the spot page's three tables and the admin studios list, when axe-core scans them in the light and the dark theme at 320 px and 1280 px, then no violation is reported. (L2-069)

### Theming

- **AC-18** Given the permit and admin tables, when the contrast check runs in the light and the dark theme, then column headers, cell text, stacked labels, the record links and the "Not required", "Required", "Due soon" and "Prices stale" badges are each at least 4.5:1 against their background. (L2-068)

### Responsive

- **AC-19** Given Evergreen Brick Works' light-by-time table at 360 px, when it renders, then it shows five bordered cards titled "Morning" to "Blue hour", each with "Rating" and "Note" printed above their values, and at 768 px the same markup shows one header row and five table rows. (L2-015)
- **AC-20** Given the admin studios list at 360 px, when it renders, then each row is a card showing the studio name, its status, its flag and the Edit button, the Edit button has no label above it, and the Edit button is at least 44 × 44 CSS px. (L2-063)
- **AC-21** Given the spot page tables and the admin guides list at 320 px, when they render, then `document.documentElement.scrollWidth` equals the viewport width and no cell text is clipped. (L2-064)
- **AC-22** Given the admin spots list at 200 % zoom in a 1280 px viewport, when the owner reaches "Distillery District", then its name, status, "Permits stale" flag and Edit button are visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the table has no
motion of its own, and the loading skeleton's shimmer stops under
`prefers-reduced-motion: reduce`
([table.html](../../design-system/components/table.html), Accessibility › Motion).

### Performance

- **AC-23** Given the `table/performance` harness route at 360 px, when the five loading rows are replaced by the nine studio rows, then the cumulative layout shift of the cards that were already on screen is at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/table/`: `table.component.ts`
  (`TableComponent`, selector `table[st-table]`, `OnPush`, standalone) and
  `table.component.html` (`<ng-content />`). No component stylesheet (D-1).
- Host binding: `[class]` from a `computed`: `'table'` plus `table--stack` and
  `table--dense` when set.
- Global CSS: port the `.table*` rules from `components.css` (base, caption,
  cells, `tbody th`, last-row rule, hover, `.num` cells and the stacked block)
  into `styles/utilities.css`, plus `.table--dense` (D-2) and
  `.table tbody th .text-muted` (D-7). Do not port `.table th[aria-sort] button`
  (D-5) or the `aria-current` / `aria-selected` row fill (D-6).
- ICD change (ICD-002 1.1.0, additive): §11.1 Utilities gains the row
  "Tables: `.table`, `.table--stack`, `.table--dense` (global because the
  application writes the cells, which component CSS cannot reach, D-1)", and
  §11.2 moves `.table*` from "Library component CSS" to "Library global".
- The application writes `.table-wrap`, `aria-busy`, `<caption>`, `scope`,
  `data-label` and `aria-sort`; page objects find a table by its caption and
  cells by header (ICD-TEST-3).
- Mocks drift the application corrects: the inline
  `style="font-weight: var(--font-weight-regular)"` on the neighbourhood goes
  (D-7); loading rows get a row header and `data-label`s (D-3).

## Decisions

- **D-1** *How does a component style cells it does not render?* The
  application writes the caption, rows and cells as native content inside
  `table[st-table]`, and emulated encapsulation scopes component CSS to the
  component's own template, so `TableComponent`'s stylesheet could style only
  the host; ICD-STY-3 forbids `::ng-deep` and `ViewEncapsulation.None`. The
  `.table*` rules therefore ship in the library's global stylesheet, as
  `.table-wrap` and the map markers already do for the same reason, and the
  component binds the classes. This is an additive ICD change (new utilities;
  the ownership row moves within the library).
- **D-2** *ICD-002 gives the table a `dense` input, but the design system has one
  density and no `.table--dense` rule.* The input stays (ICD-API-7) and
  `.table--dense` sets the cell block padding to `--space-2`, keeping inline
  padding, type and every other rule. No screen uses it; no criterion tests it
  because no L2 requirement depends on it.
- **D-3** *The loading mocks put skeletons in plain `td`s with no row header and no
  `data-label`.* Loading rows mirror a loaded row: a `th scope="row"` with two
  text skeletons, then labelled cells, five rows. Stacked skeleton cards then
  have the loaded cards' height and labels, so nothing jumps when data arrives
  (L2-071), and the header associations stay valid for assistive technology.
- **D-4** *What does an empty, unmatched or failed list show?* An
  `st-empty-state` in place of the whole wrap, never a header row with no body,
  as the design system and every admin mock show.
- **D-5** *Should a sorted header be a button?* No. The admin lists have one
  fixed order (L2-063.1); `aria-sort="descending"` on plain header text states
  it. The design system's sort-button rules are not ported.
- **D-6** *Is the selected-row fill ported?* No. No mock selects a row; adding it
  later is an additive change.
- **D-7** *The mocks set the neighbourhood's regular weight inline.* The global
  rules add `.table tbody th .text-muted { font-weight: var(--font-weight-regular) }`,
  so the application writes only `<span class="text-muted">`.
- **D-8** *ICD-STY-6 asks for mobile-first `min-width` queries, but the stacked
  layout is written with `max-width: 47.99rem`.* It stays as the design system
  writes it: restoring `display: table-row`, `table-cell` and the header at 48rem
  would duplicate the browser's table rules for no gain. The breakpoint is still
  the design-system literal.
- **D-9** *Is the caption optional?* No. Every ShotThere table has a
  `<caption>`, visually hidden when a section heading names it, because the
  caption is what names the table for assistive technology and page objects.
