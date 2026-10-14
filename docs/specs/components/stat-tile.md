# Stat tile

| Field | Value |
|---|---|
| Selector | `ul[st-stat-grid]`, `li[st-stat-tile]`, `li[st-stat-tile-skeleton]` |
| Library path | `frontend/projects/components/src/lib/stat-tile/` |
| Status | planned |
| Traces to | L2-053, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`stat-tile.html`](../../design-system/components/stat-tile.html) |
| Source mocks | [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-dashboard/empty`](../../mocks/pages/admin-dashboard/empty.html), [`pages/admin-dashboard/loading`](../../mocks/pages/admin-dashboard/loading.html), [`pages/admin-dashboard/error`](../../mocks/pages/admin-dashboard/error.html), [`pages/admin-dashboard/partial`](../../mocks/pages/admin-dashboard/partial.html), [`pages/admin-dashboard/up-to-date`](../../mocks/pages/admin-dashboard/up-to-date.html), [`dialogs/site-menu/admin`](../../mocks/dialogs/site-menu/admin.html) |
| Rendering | [`stat-tile.html`](stat-tile.html) |

## Purpose and scope

Stat tiles open the administration dashboard, the first screen the owner sees
after signing in. One tile each for studios, spots and guides answers two
questions: how much is live ("7 published, 2 draft") and what can be added next
("New studio"). The title links to the content type's admin list (L2-053).

This CRD covers `ul[st-stat-grid]` (the one-to-three-column list),
`li[st-stat-tile]` (one tile) and `li[st-stat-tile-skeleton]` (its loading
placeholder, an additive ICD component, D-3). Use the stacked table on the
admin list screens for individual records, and admin rows (`.admin-list`) for
the re-verification list beside the tiles. Stat tiles never appear on public
pages and are never KPI cards: no trends, deltas, sparklines or percentages.

Out of scope:

- Counting and wording the counts ("7 published, 2 draft"): the server and
  `AdminDashboardViewModel` (ICD-API-10).
- The action itself: the consumer's [`a[st-button]`](button.md) with a leading
  [`st-icon`](icon.md) `plus`, projected into the default slot; which tile's
  action is primary is the dashboard's choice (one primary per screen).
- The dashboard wrapper's `aria-busy`, the "Loading the dashboard" status, the
  error empty state, the partial-failure alert and the re-verification list:
  `AdminDashboardPageComponent`, [`st-empty-state`](empty-state.md) and
  [`st-alert`](alert.md).

## Usage

Every `.stat-tile` and `.stat-grid` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks stat-tile "li"` and grep).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-dashboard/default`, `partial`, `up-to-date` | Three tiles in `ul[st-stat-grid]` under a visually hidden `h2` "Content"; `headingLevel` 3; `link` to `/admin/studios`, `/admin/spots`, `/admin/guides`; counts "7 published, 2 draft", "5 published, 1 draft", "3 published, 1 draft" | Action: `a[st-button]` "New studio" primary, "New spot" and "New guide" secondary, each with the `plus` icon | default, hover, focus, active | canvas |
| `pages/admin-dashboard/empty` | Same, counts "0 published, 0 draft" | All three actions secondary; the empty state below holds the primary "New studio" | zero counts | canvas |
| `pages/admin-dashboard/loading` | Three `li[st-stat-tile-skeleton]` in `ul[st-stat-grid]` inside the page's `aria-busy="true"` wrapper with the hidden status "Loading the dashboard" | none | loading | canvas |
| `pages/admin-dashboard/error` | No grid: the page shows `st-empty-state` (error) "We couldn't load the dashboard" with "Try again" | — | error | canvas |
| `dialogs/site-menu/admin` | Inert dashboard behind the menu, drawn with `h2` titles, no links and "7 published · 2 drafts" | — | — | Drift; the dashboard mocks and L2-053 win (D-5) |

Every row is buildable with the API below once the tile has its default slot
(D-1) and the skeleton component exists (D-3).

## Anatomy

1. **Grid** — the host `<ul>` itself (`ul[st-stat-grid]`, class `stat-grid`):
   no markers, one column, three from 48rem, `--layout-gutter` gap.
2. **Tile** — the host `<li>` itself (`li[st-stat-tile]`, class `stat-tile`):
   flex column, `--space-3` between parts, items aligned to the start,
   `height: 100%`, padding `--space-5` × `--space-6`,
   `--border-width-hairline` `--color-border-default` edge, `--radius-lg`, no
   fill.
3. **Title** — `.stat-tile__title`, a heading at `headingLevel` in
   `--text-h4`; with `link`, it wraps an `<a routerLink>` held at
   `--color-fg-default` and underlined.
4. **Counts** — `.stat-tile__counts`, `--text-body-lg` in `--color-fg-muted`,
   tabular figures; it grows to fill the tile so the action sits at the bottom
   (D-2).
5. **Action** — the default slot: the consumer's button-styled link with its
   natural width.

Skeleton: the host `<li>` with classes `stat-tile stat-tile--skeleton` and
`aria-hidden="true"`, holding [`st-skeleton`](skeleton.md) `title`, `text`
(70 % wide) and `pill` (8rem × `--control-height-md`).

## API

### `ul[st-stat-grid]`

No inputs, outputs or slots of its own: the children are
`li[st-stat-tile]` or `li[st-stat-tile-skeleton]` elements written by the
application. Native attributes on the host belong to the consumer.

### `li[st-stat-tile]`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | The plural content type: "Studios", "Spots", "Guides". The heading text and, with `link`, the link's accessible name. |
| `counts` | `string` | — | yes | Exactly as formatted by the application: "7 published, 2 draft" (L2-053.1). Zero is "0 published, 0 draft". |
| `link` | `string \| null` | `null` | no | Router path to the admin list (`/admin/studios`). Makes the title a link; `null` renders plain heading text (D-7). |
| `headingLevel` | `HeadingLevel` | `2` | no | Element of `.stat-tile__title`. The dashboard passes `3`, under its visually hidden `h2` "Content" (D-4). |

Inputs are signal inputs.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The title and the action are native links. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | **ICD change (D-1).** One `a[st-button]` with a leading `st-icon name="plus"` and the label "New studio" / "New spot" / "New guide" | Rendered after the counts at the bottom of the tile with its natural width. The consumer sets `variant` (one primary per screen) and `routerLink`. |

The tile has no library strings (ICD-002 §12).

### `li[st-stat-tile-skeleton]`

**ICD change (D-3).** New component, no inputs, outputs or slots. Renders the
skeleton tile described under *Anatomy* with `aria-hidden="true"`. The
dashboard renders three while the counts load; the busy wrapper and the status
message are the page's.

## Variants and sizes

| Variant | How | Use for |
|---|---|---|
| Primary action | Consumer `variant="primary"` on the projected button | "New studio" on a populated dashboard: studios come first on ShotThere |
| Secondary action | Consumer default variant | "New spot", "New guide"; all three on the empty dashboard, where the empty state holds the primary |
| Title without link | `link` `null` | Not used by the mocks; renders a plain heading |
| Skeleton | `li[st-stat-tile-skeleton]` | Dashboard loading |

One size. The tile fills its grid cell (`height: 100%`), so tiles in a row
match the tallest; the grid decides the width.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Edge, title link, counts, action at the bottom | `listitem` n of 3, heading with link "Studios", counts as text, link "New studio" |
| Title hover | `:hover` on the link | Underline thickens (link rule); colour stays `--color-fg-default` | — |
| Title focus | `:focus-visible` | Shared ring, `--focus-ring-width` `--color-focus-ring`, offset `--focus-ring-offset` | Focus on "Studios" |
| Action hover, focus, active | the button's states | As the [button CRD](button.md) | — |
| Disabled | — | Never: an empty list still opens and creating is always allowed | — |
| Zero counts | `counts` "0 published, 0 draft" | Tile unchanged; zero is shown, never hidden | Read as written |
| Loading | `li[st-stat-tile-skeleton]` × 3 | Edge kept; title bar, 70 % counts bar, 8rem pill where the button goes; shimmer | Hidden; the page's `role="status"` says "Loading the dashboard" and its wrapper is `aria-busy="true"` |
| Dashboard error | counts failed (page) | No grid and no tile: the error empty state replaces them; a tile never shows a guessed or zero count | The empty state's alert |
| Partial | counts loaded, list failed (page) | Tiles as default; the danger alert sits where the list was | — |
| Up to date | nothing to re-verify (page) | Tiles as default; compact success empty state below | — |
| Reduced motion | `prefers-reduced-motion: reduce` | Skeleton shimmer stops; button transitions 0 ms | — |

## Markup

```html
<!-- rendered: populated dashboard -->
<section aria-labelledby="content-title">
  <h2 class="visually-hidden" id="content-title">Content</h2>
  <ul class="stat-grid">
    <li class="stat-tile">
      <h3 class="stat-tile__title"><a href="/admin/studios">Studios</a></h3>
      <p class="stat-tile__counts">7 published, 2 draft</p>
      <a class="btn btn--primary" href="/admin/studios/new"><st-icon><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></st-icon>New studio</a>
    </li>
    <li class="stat-tile">
      <h3 class="stat-tile__title"><a href="/admin/spots">Spots</a></h3>
      <p class="stat-tile__counts">5 published, 1 draft</p>
      <a class="btn" href="/admin/spots/new">…New spot</a>
    </li>
    <li class="stat-tile">
      <h3 class="stat-tile__title"><a href="/admin/guides">Guides</a></h3>
      <p class="stat-tile__counts">3 published, 1 draft</p>
      <a class="btn" href="/admin/guides/new">…New guide</a>
    </li>
  </ul>
</section>
```

```html
<!-- rendered: title without link -->
<li class="stat-tile">
  <h3 class="stat-tile__title">Studios</h3>
  <p class="stat-tile__counts">7 published, 2 draft</p>
  …
</li>
```

```html
<!-- rendered: loading (wrapper and status are the page's) -->
<div aria-busy="true">
  <p class="visually-hidden" role="status">Loading the dashboard</p>
  <section aria-labelledby="content-title">
    <h2 class="visually-hidden" id="content-title">Content</h2>
    <ul class="stat-grid">
      <li class="stat-tile stat-tile--skeleton" aria-hidden="true">
        <st-skeleton class="skeleton skeleton--title" aria-hidden="true"></st-skeleton>
        <st-skeleton class="skeleton skeleton--text" aria-hidden="true"></st-skeleton>
        <st-skeleton class="skeleton skeleton--pill" aria-hidden="true"></st-skeleton>
      </li>
      <!-- × 3 -->
    </ul>
  </section>
</div>
```

The mocks' inline sizes on the skeleton spans are replaced by the
`.stat-tile--skeleton` rules (D-3).

```html
<!-- consumer: AdminDashboardPageComponent -->
<ul st-stat-grid>
  @for (tile of tiles(); track tile.kind; let first = $first) {
    <li st-stat-tile [title]="tile.title" [counts]="tile.counts" [link]="tile.listLink" [headingLevel]="3">
      <a st-button [variant]="first && !empty() ? 'primary' : 'secondary'" [routerLink]="tile.newLink">
        <st-icon name="plus" />{{ tile.newLabel }}
      </a>
    </li>
  }
</ul>

<!-- consumer: loading -->
<ul st-stat-grid>
  @for (n of [1, 2, 3]; track n) { <li st-stat-tile-skeleton></li> }
</ul>
```

`tile.title`, `tile.counts` and `tile.newLabel` come from the view model with
`$localize` ("Studios", "{n} published, {m} draft", "New studio").

## Design

- Grid: `list-style: none`, no padding or margin, `display: grid`,
  `minmax(0, 1fr)`; `repeat(3, minmax(0, 1fr))` from 48rem; gap
  `--layout-gutter` (24, 32, 40 px as the page widens).
- Tile: `display: flex`, column, `align-items: flex-start`, gap `--space-3`,
  `height: 100%`, padding `--space-5` `--space-6`, border
  `--border-width-hairline` solid `--color-border-default`, `--radius-lg`, no
  background.
- Title: `--text-h4`; link `--color-fg-default`, underlined (global link rule).
- Counts: `--text-body-lg`, `--color-fg-muted`, `font-variant-numeric:
  tabular-nums`, `flex-grow: 1`, so the action is pinned to the bottom (D-2).
- Action: the button's own styles; natural width at every size.
- Skeleton: `skeleton--text` 70 % wide; `skeleton--pill` 8rem wide,
  `--control-height-md` tall; edge kept.
- Motion: none of its own; the skeleton shimmer runs on `--duration-loop`.

No component tokens; the tile reads semantic tokens only (DS *Theming*).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Tile edge (decorative) | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Title | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Counts | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Page behind | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Primary action fill | `--color-action` | `--palette-stone-950` | `--palette-stone-100` |
| Primary action label | `--color-fg-on-action` | `--palette-white` | `--palette-stone-950` |
| Secondary action edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Title link |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Counts |
| `--color-fg-on-action` | `--color-action` | 4.5:1 | Primary action label |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Secondary action edge |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

The tile edge groups content and marks no control, so WCAG 1.4.11 does not
apply. Forced colours: the edge becomes `CanvasText`, the title `LinkText`,
the focus ring `Highlight`.

## Responsive behaviour

| Viewport | Grid | Gap |
|---|---|---|
| XS, SM (below 48rem) | One column, tiles stacked Studios, Spots, Guides (L2-053.3) | `--layout-gutter` (24 px) |
| MD (48rem) | Three equal columns; actions aligned on one line | 32 px |
| LG and up (62rem) | Three equal columns | 40 px |

- The action keeps its natural width on phones; it is 44 px tall (`md`
  button), and the title link and the action are at least `--space-3` apart.
- Counts wrap rather than truncate; "0 published, 0 draft" fits a 288 px tile.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything
  stays available; every target is at least 24 × 24 CSS px.
- The tile adds no fixed positioning; safe areas come from the page container.

## Accessibility

### Role and pattern

Native structure, no ARIA widget: a `<ul>` of `<li>`, so screen readers
announce "list, 3 items". Each title is a heading wrapping a link, so heading
navigation lands on Studios, Spots and Guides. The action is a link styled as
a button because it navigates to the editor. The tile never wraps its links in
a bigger link.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Studios, New studio, Spots, New spot, Guides, New guide. |
| <kbd>Enter</kbd> | Follows the focused link: the title opens the admin list, the action opens a new editor. |

### Focus

Both links show the shared ring on `:focus-visible`. The tile has no focus of
its own and never moves focus.

### Labelling

- Title link name: "Studios". Action name: "New studio" (names its object, so
  it reads well in a links list). The plus icon is `aria-hidden`.
- Counts are plain text after the heading; no `aria-label` rewrites them.
- Skeleton tiles are `aria-hidden="true"` and empty; the page's status message
  carries the meaning.

### Announcements

The tile has no live region. The page announces loading through its hidden
`role="status"`; the error state is the empty state's.

### Motion

The design-system rule (no AC; L2 has no motion requirement): only the skeleton
shimmer moves, and it stops under `prefers-reduced-motion: reduce`; the
button's hover transition reads `--duration-fast`, which reduced motion sets to
0 ([stat-tile.html](../../design-system/components/stat-tile.html),
Accessibility › Motion).

## Content and internationalisation

- Title: the plural content type as the admin navigation names it: "Studios",
  "Spots", "Guides".
- Counts: exactly "{n} published, {m} draft" (L2-053.1): published first, a
  comma, "draft" unchanged at any count; zero written "0". The application
  builds it with `$localize` placeholders and `en-CA` number formatting.
- Action: "New" plus the singular type, with the plus icon before it.
- No other copy in the tile: no help text, dates or "last updated".
- Translatable: title, counts template, action label (all the consumer's).
  Longer translations wrap; nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs; the heading element comes from a
  `@switch` on `headingLevel` with the link in one shared `<ng-template>`.
- Performance scenario: the `components-harness` route `stat-tile/performance`
  renders three skeleton tiles, then the populated dashboard's three tiles
  (Studios "7 published, 2 draft" with the primary "New studio", Spots, Guides);
  the swap must keep layout shift within the L2-071 budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the skeleton keeps the tile's edge, padding, gap and a
  pill of the button's height, so the grid does not jump when counts arrive.
- Weight: `@angular/core`, `RouterLink`, the library's `SkeletonComponent`.

## Acceptance criteria

### Rendering

- **AC-1** Given the Studios tile with `link` "/admin/studios", counts "7 published, 2 draft", `headingLevel` 3 and a primary "New studio" link in the slot, when it renders, then the host is an `li.stat-tile` holding an `h3.stat-tile__title` with a link "Studios" to `/admin/studios`, then `p.stat-tile__counts` "7 published, 2 draft", then the `a.btn.btn--primary` "New studio". (L2-053)
- **AC-2** Given the view model gives counts "3 published, 2 draft" for studios, when the tile renders, then the counts read exactly "3 published, 2 draft". (L2-053)
- **AC-3** Given the dashboard, when the owner activates "New studio", then the studio creation screen `/admin/studios/new` opens. (L2-053)
- **AC-4** Given the empty dashboard, when the tiles render with counts "0 published, 0 draft" and secondary actions, then all three tiles are shown with "0 published, 0 draft", no tile action has `btn--primary`, and the tile adds or hides nothing because a count is zero. (L2-053)
- **AC-5** Given the dashboard counts fail to load, when the page renders, then no `.stat-tile` is in the DOM and the error state "We couldn't load the dashboard" with "Try again" is shown instead. (L2-053)
- **AC-6** Given the counts load and the re-verification list fails (partial) or is empty (up to date), when the page renders, then the three tiles are identical to the default dashboard's. (L2-053)
- **AC-7** Given a tile with `link` `null`, when it renders, then the heading contains the text "Studios" and no link, and with `link` set the heading contains exactly one link whose name is "Studios". (L2-069)

### Loading

- **AC-8** Given the dashboard while counts load, when three `li[st-stat-tile-skeleton]` render inside the wrapper with `aria-busy="true"`, then each has `stat-tile stat-tile--skeleton` and `aria-hidden="true"`, holds no text, and a screen reader hears "Loading the dashboard" from the page's status. (L2-069)

### Keyboard and focus

- **AC-9** Given the populated dashboard, when a keyboard user tabs through the tiles, then focus visits Studios, New studio, Spots, New spot, Guides, New guide in that order. (L2-067)
- **AC-10** Given keyboard focus on the "Spots" title link, when it is inspected, then a ring of `--focus-ring-width` (2 px) in `--color-focus-ring` surrounds it with at least 3:1 contrast against the page. (L2-067)

### Screen readers

- **AC-11** Given the dashboard, when a screen reader lists headings, then it finds `h1` "Dashboard", the hidden `h2` "Content" and three `h3` "Studios", "Spots", "Guides", with no skipped level, inside a list of 3 items. (L2-069)
- **AC-12** Given the dashboard in its default, empty and loading states, when axe-core scans it at 320 px and 1280 px in light and dark, then no violation is reported. (L2-069)

### Theming

- **AC-13** Given the populated dashboard in the light and the dark theme, when the contrast check runs, then the title and the counts are at least 4.5:1 against the page, the primary action label at least 4.5:1 on its fill, and the secondary action edge and the focus ring at least 3:1 against the page. (L2-068)

### Responsive

- **AC-14** Given the dashboard at 360 px wide, when it renders, then the tiles stack in one column in the order Studios, Spots, Guides. (L2-053)
- **AC-15** Given the dashboard at 1024 px wide, when it renders, then the three tiles share one row with equal widths and heights, and the three actions' top edges are aligned. (L2-064)
- **AC-16** Given the dashboard at 320 px wide, when it renders, then `document.documentElement.scrollWidth` equals the viewport width and no tile text is clipped. (L2-064)
- **AC-17** Given the dashboard at 360 px wide, when the targets are measured, then each action is at least 44 CSS px tall and at least `--space-3` (12 px) below the title link. (L2-065)
- **AC-18** Given the dashboard at 200 % zoom in a 1280 px viewport, when the owner reaches the Guides tile, then its title, counts and "New guide" are visible and operable with no horizontal page scroll. (L2-066)

### Performance

- **AC-19** Given the `stat-tile/performance` harness route, when three skeleton tiles are replaced by the three loaded tiles at 1280 px, then the cumulative layout shift of the swap is at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/stat-tile/`:
  `stat-grid.component.ts|html|css` (`StatGridComponent`, selector
  `ul[st-stat-grid]`, host class `stat-grid`, template `<ng-content />`),
  `stat-tile.component.ts|html|css` (`StatTileComponent`, selector
  `li[st-stat-tile]`, host class `stat-tile`),
  `stat-tile-skeleton.component.ts|html|css` (`StatTileSkeletonComponent`,
  selector `li[st-stat-tile-skeleton]`, host classes
  `stat-tile stat-tile--skeleton`, `aria-hidden="true"`).
- CSS: port `.stat-grid`, `.stat-tile`, `.stat-tile__title*`,
  `.stat-tile__counts` and `.stat-tile--skeleton*`; replace
  `.stat-tile .btn { align-self: flex-start; margin-top: auto; }` with D-2.
- ICD change (ICD-002 1.1.0, additive): `StatTileComponent` gains a default
  slot (D-1); new `StatTileSkeletonComponent` — `li[st-stat-tile-skeleton]`, no
  members (D-3).
- Mock drift corrected: the skeleton spans' inline sizes (D-3); the
  site-menu backdrop's `h2` titles and "7 published · 2 drafts" (D-5).

## Decisions

- **D-1** *ICD-002 1.0.0 gives `li[st-stat-tile]` no slot, but every tile in the mocks and L2-053.2 has a "New studio / spot / guide" action, and the application may not write it inside the tile otherwise.* A default slot for the one action (additive, ICD-002 1.1.0). A slot, not inputs, because the consumer chooses the variant per screen (one primary) and wires `routerLink`, and the button already exists as `a[st-button]`.
- **D-2** *The DS pins the action with `.stat-tile .btn { align-self: flex-start; margin-top: auto; }`, but the tile's encapsulated CSS cannot select projected content.* The tile aligns its items to the start (`align-items: flex-start`) and lets the counts grow (`flex-grow: 1`), so the action sits at the bottom at its natural width. Same look.
- **D-3** *The loading dashboard needs skeleton tiles, but ICD-002 has no skeleton tile and the application may not write `.stat-tile--skeleton` (ICD-DOM-4).* New `li[st-stat-tile-skeleton]` with no members (additive), mirroring `st-location-card-skeleton`. Giving `li[st-stat-tile]` a loading flag instead would force placeholder values into its required inputs.
- **D-4** *ICD-002 defaults `headingLevel` to 2, but the dashboard puts the tiles under a hidden `h2` "Content".* The default stays; the dashboard passes 3, as the DS and mocks draw it.
- **D-5** *The dashboard behind `dialogs/site-menu/admin` uses `h2` titles without links or actions and "7 published · 2 drafts".* The dashboard mocks and L2-053.1 win: `h3` title links, "7 published, 2 draft", a New action.
- **D-6** *What does a tile show when the counts fail?* Nothing: the page renders no grid and shows the error empty state; a tile never shows a guessed or zero count (DS States).
- **D-7** *What does a tile render with `link` `null`?* A plain heading with the title text and no link. No mock uses it; it keeps the ICD's optional input valid and accessible (ICD-API-8).
- **D-8** *The admin dashboard is not a public page, but the components README traces each harness scenario to L2-071.* The `stat-tile/performance` route holds the skeleton-to-tiles swap to the L2-071 layout-shift budget, so the convention is kept and the budget is the same one the public lists use.
