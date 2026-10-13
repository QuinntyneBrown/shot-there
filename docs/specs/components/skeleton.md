# Skeleton

| Field | Value |
|---|---|
| Selector | `st-skeleton` |
| Library path | `frontend/projects/components/src/lib/skeleton/` |
| Status | planned |
| Traces to | L2-026, L2-064, L2-067, L2-069, L2-071 |
| Design system | [`skeleton.html`](../../design-system/components/skeleton.html) |
| Source mocks | [`pages/studios/loading`](../../mocks/pages/studios/loading.html), [`pages/spots/loading`](../../mocks/pages/spots/loading.html), [`pages/map/loading`](../../mocks/pages/map/loading.html), [`pages/admin-dashboard/loading`](../../mocks/pages/admin-dashboard/loading.html), [`pages/admin-studios/loading`](../../mocks/pages/admin-studios/loading.html), [`pages/admin-spots/loading`](../../mocks/pages/admin-spots/loading.html), [`pages/admin-guides/loading`](../../mocks/pages/admin-guides/loading.html), [`pages/studio-editor/loading`](../../mocks/pages/studio-editor/loading.html), [`pages/spot-editor/loading`](../../mocks/pages/spot-editor/loading.html), [`pages/guide-editor/loading`](../../mocks/pages/guide-editor/loading.html) |
| Rendering | [`skeleton.html`](skeleton.html) |

## Purpose and scope

A skeleton is one quiet stone block that stands where a piece of content will
land: a studio name, a neighbourhood line, a 3:2 card photo, an "Edit" pill.
Placed in the real layout, skeletons make a loading screen already look like
itself, so nothing jumps when "The Junction Loft" and its photo arrive. They
appear only for client-side refreshes that take longer than 300 ms; a first
visit is server-rendered with its content and never shows them (L2-026.3).

`st-skeleton` is the single placeholder. Composites arrange several:
[`st-location-card-skeleton`](location-card.md) for the studio and spot
lists, and the application's own loading layouts for the map, dashboard,
admin lists and editors. Use [`st-spinner`](spinner.md) for a short wait
inside a control (the entry picker's search), [`st-progress`](progress.md)
for an upload, a busy [`button[st-button]`](button.md) for a submit, and
[`st-empty-state`](empty-state.md) when the load failed or returned nothing:
a skeleton never shimmers forever.

Out of scope:

- `aria-busy="true"` on the region being loaded and its one `role="status"`
  message ("Loading studios…"): the application's (ICD §14).
- How many placeholders a region shows (six cards, five admin rows) and when
  they appear (after 300 ms): the application's.
- Hiding the placeholder container (`aria-hidden="true"` on the
  `ul.location-grid` or `.editor-layout`): the application's or the
  composite's; each `st-skeleton` also hides itself.
- The arrangement of a card, row, tile or section bar: the composite's.

## Usage

Every `.skeleton` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks skeleton "span|div|li|p|td|h1"`), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studios/loading`, `pages/spots/loading` (inside [`st-location-card-skeleton`](location-card.md)) | `rect` filling the 3:2 card media box; `title` at 70 %; two `text` at 50 % | — | loading | canvas |
| `pages/map/loading` list rows | same as a card, inside `.map-list-item` | — | loading | canvas |
| `pages/map/loading` map area | `rect` filling the whole `.static-map` area, square corners | — | loading | sunken map |
| `pages/admin-dashboard/loading` tiles | `title`; `text` at 70 %; `pill` 8rem × `--control-height-md` | — | loading | surface (tile) |
| `pages/admin-dashboard/loading` re-verification rows | `title` 40 %, `text` 25 %, `pill` `--space-20` wide, `--target-comfortable` tall below 48rem and `--control-height-sm` from 48rem (D-4) | — | loading | canvas (row) |
| `pages/admin-studios/loading`, `admin-spots/loading`, `admin-guides/loading` table rows | `text` 14rem + 6rem (name and neighbourhood), 5rem, 6rem; `pill` 5rem (flag); `pill` 3.5rem × `--control-height-sm` (Edit) | — | loading | surface (table) |
| Admin list page header | `text` 14rem in the subtitle, followed by hidden "Loading" | — | loading | canvas |
| `pages/studio-editor/loading`, `spot-editor/loading`, `guide-editor/loading` heading | `title` inside the `h1` after visually hidden "Loading studio", width `min(100%, 22rem)` | — | loading | canvas |
| Editor breadcrumb | `text` 8rem in the current crumb after hidden "Loading" | — | loading | canvas |
| Editor status panel | `title`; two `text`; two `pill` at `--target-comfortable`, full width | — | loading | surface (aside) |
| Editor section bars | `title` at 18–42 % in each bar | — | loading | surface (section) |
| `pages/guide-editor/loading`, `spot-editor/loading` sections | `title`, then two `rect` at `--control-height-md` (field boxes) | — | loading | surface |

Every row is buildable with `shape` plus a width on the host (a feature class
or a `[style.width]` binding, both allowed on a library host by ICD-DOM-5) and,
for `rect` and `pill`, the height of the box around it (D-1). No mock uses
`circle`; it stays for round content (D-2).

## Anatomy

1. **Block** — the host itself, `st-skeleton.skeleton.skeleton--{shape}`,
   `aria-hidden="true"`. A stone gradient (`--color-bg-subtle` through
   `--color-bg-subtle-hover`) moving across it once per `--duration-loop`;
   `display: block`, `max-width: 100%`, `min-height: 1em`, `--radius-sm`.
   Empty: no text, no children.

The host carries the block class (ICD-DOM-1), so the component adds no inner
element and no wrapper.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `shape` | `'text' \| 'title' \| 'pill' \| 'rect' \| 'circle'` | `'text'` | no | Adds `.skeleton--{shape}` to the host. The host always has `aria-hidden="true"`; the application marks the region busy. |

`shape` is a signal input. The consumer sets the width on the host (a feature
class or `[style.width]`); a consumer width always wins over the shape's default
width. `rect`, `pill` and `circle` take their height from the box around them
(*Variants and sizes*).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | A skeleton is never interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | A skeleton holds no content; "Loading" text never goes inside one. |

The skeleton has no library strings (ICD §12).

## Variants and sizes

| Shape | Modifier | Height | Default width | Stands in for |
|---|---|---|---|---|
| Text | `.skeleton--text` | 0.9em with 0.3em above and below | 100 %; the last of a group of siblings 60 % | Neighbourhood line, facts, meta lines, table cells |
| Title | `.skeleton--title` | 1.5em | 40 % | Studio and spot names, tile and section titles, the editor `h1` |
| Rect | `.skeleton--rect` | The box it sits in (100 %), at least 1em | The box it sits in | 3:2 card photo, map photo, the map area, form fields |
| Pill | `.skeleton--pill` | The box it sits in (100 %), at least 1em | The box it sits in | Buttons (Edit, New studio, Save changes) and flag badges |
| Circle | `.skeleton--circle` | Equal to its width | 1.5em | Round content only, never a photo (D-2) |

Corners: text and title `--radius-sm`; rect `--radius-md` (inside the card
media box it inherits the box's `--radius-lg`); pill and circle
`--radius-full`. Width comes from the consumer; the shape only sets defaults.
A skeleton is never wider than its box (`max-width: 100%`).

## States

A skeleton is never interactive and never focusable, so hover, focus, active
and disabled do not apply.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Loading | present in the DOM; region `aria-busy="true"` (application) | Stone block with the shimmer | Hidden (`aria-hidden="true"`); the region's status says "Loading studios…" |
| Loading, reduced motion | `prefers-reduced-motion: reduce` | Flat `--color-bg-subtle` block, no shimmer | Hidden |
| Loading, forced colours | `forced-colors: active` | Backgrounds are removed by the system, so the block is not drawn | Hidden; the status text still says what is loading |
| Loaded | removed by the application | Replaced by content in the same box | Region `aria-busy` removed; status says "7 studios" |
| Failed | removed by the application | Replaced by the error empty state with "Try again" | The error state's `role="alert"` |

## Markup

```html
<!-- rendered: each shape -->
<st-skeleton class="skeleton skeleton--text" aria-hidden="true"></st-skeleton>
<st-skeleton class="skeleton skeleton--title" aria-hidden="true"></st-skeleton>
<st-skeleton class="skeleton skeleton--rect" aria-hidden="true"></st-skeleton>
<st-skeleton class="skeleton skeleton--pill" aria-hidden="true"></st-skeleton>
<st-skeleton class="skeleton skeleton--circle" aria-hidden="true"></st-skeleton>
```

```html
<!-- rendered: the studio list loading (st-location-card-skeleton composes the placeholders) -->
<section class="browse__results" aria-labelledby="results-title" aria-busy="true">
  <p class="result-count" role="status" aria-live="polite">Loading studios…</p>
  <ul class="location-grid" aria-hidden="true">
    <li class="location-card location-card--skeleton">
      <div class="location-card__media"><st-skeleton class="skeleton skeleton--rect" aria-hidden="true"></st-skeleton></div>
      <st-skeleton class="skeleton skeleton--title" aria-hidden="true"></st-skeleton>
      <st-skeleton class="skeleton skeleton--text" aria-hidden="true"></st-skeleton>
      <st-skeleton class="skeleton skeleton--text" aria-hidden="true"></st-skeleton>
    </li>
    …six in all
  </ul>
</section>
```

The `st-skeleton` tag name is not part of the contract (ICD-DOM-3); the
`.skeleton` classes and `aria-hidden` are.

```html
<!-- consumer: editor heading while the studio loads -->
<h1><span class="visually-hidden" i18n>Loading studio</span><st-skeleton shape="title" class="editor-title-placeholder" /></h1>

<!-- consumer: an admin table cell, width by binding -->
<td><st-skeleton [style.width]="'14rem'" /><st-skeleton [style.width]="'6rem'" /></td>

<!-- consumer: the dashboard row's Edit placeholder, sized by an application box -->
<span class="admin-row__edit-slot"><st-skeleton shape="pill" /></span>

<!-- consumer: the map area -->
<div class="static-map"><st-skeleton shape="rect" class="static-map__placeholder" /></div>
```

`.admin-row__edit-slot` is application feature CSS (`width: var(--space-20)`;
`height: var(--target-comfortable)`, `var(--control-height-sm)` from 48rem);
`.editor-title-placeholder` sets `width: min(100%, 22rem)`.

## Design

- Block: `display: block`, `max-width: 100%`, `min-height: 1em`, `--radius-sm`.
- Fill: `linear-gradient(90deg, var(--color-bg-subtle) 25%, var(--color-bg-subtle-hover) 37%, var(--color-bg-subtle) 63%)` at `background-size: 400% 100%`.
- Motion: the `shimmer` keyframes move the gradient across once per `--duration-loop` (1.4 s) with `--ease-standard`, infinitely.
- Text: `height: 0.9em; margin-block: 0.3em`; a text skeleton that is the last child of its parent defaults to 60 % wide.
- Title: `height: 1.5em; width: 40%`.
- Rect: `height: 100%`, `--radius-md`. Pill: `height: 100%`, `--radius-full`. Circle: `aspect-ratio: 1`, `width: 1.5em`, `--radius-full`. Each keeps `min-height: 1em`.
- Default widths have no specificity (`:where()`), so a width the consumer puts on the host always wins.
- The component has no tokens of its own; it reads `--color-bg-subtle`, `--color-bg-subtle-hover`, `--duration-loop`, `--ease-standard` and the radius tokens.

Composite rules stay with their owners: `.location-card--skeleton` (card media
rect fills the 3:2 box, title 70 %, text 50 %) in
[`st-location-card-skeleton`](location-card.md); `.stat-tile--skeleton` and
`.editor-section--skeleton` in the library blocks that own them (ICD §11.2).
A library composite may size the skeleton hosts in its own template with its
own CSS; the application may only set width (ICD-DOM-5) and sizes a `rect` or
`pill` through a box of its own (D-1).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Base | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Shimmer highlight | `--color-bg-subtle-hover` | `--palette-stone-200` | `--palette-stone-700` |

Skeletons convey no information, so WCAG 1.4.11 does not apply to them and
they have no contrast pair; the region's status text does the telling, and it
is held to 4.5:1 by its own component (`st-result-count` or the
application's hidden status). Keep skeletons quiet stone, never coloured.
Forced colours: the system removes the background, so skeletons disappear;
nothing is lost because they carry no meaning.

## Responsive behaviour

- Skeletons sit in the real layout containers and reflow exactly as the
  content will: the card grid is one column below 36rem, two from 36rem, three
  from 62rem; the admin table stacks into cards below 48rem and its skeleton
  cells stack with it; the editor status panel moves above the sections below
  62rem.
- The dashboard row's Edit placeholder is 44 px tall below 48rem and 36 px from
  48rem, matching the small button it stands for (its box is the
  application's).
- Fixed `rem` widths never exceed their cell (`max-width: 100%`), so nothing
  scrolls sideways at 320 px; at 200 % zoom the blocks scale with text.
- There are no touch targets: a skeleton never sits over a control and never
  blocks filters, sort or the admin search.

## Accessibility

### Role and pattern

Presentation only. Every skeleton has `aria-hidden="true"`; the region being
loaded has `aria-busy="true"` and one `role="status"` message ("Loading
studios…", "Loading spots…", "Loading locations…", "Loading the dashboard",
"Loading studio…"), both the application's. This meets L2-026.1 and WCAG
4.1.3. No APG pattern applies.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips skeletons. Real controls around them (filters, Sort by, Filters, the admin search) stay usable while the list loads. |

### Focus

A skeleton never takes focus and never moves it. Focus stays on the filter or
sort control that started the refresh; when content replaces the skeletons,
focus does not jump into it.

### Labelling

One message per region, not one per placeholder. Where a skeleton stands in an
`h1` or the current breadcrumb, real visually hidden words sit beside it
("Loading studio", "Loading"), so headings navigation still works; the
skeleton itself adds nothing.

### Announcements

None. The region's status message is the only announcement.

### Motion

The shimmer is decorative. Under `prefers-reduced-motion: reduce` it stops and
the blocks stay flat `--color-bg-subtle`
([skeleton.html](../../design-system/components/skeleton.html), Accessibility
› Motion). It is slow (1.4 s), low contrast and covers no more than the region
loading.

## Content and internationalisation

- Skeletons have no visible words; "Loading" text never goes inside one.
- The status message the application shows beside them is "Loading" plus what
  is loading, sentence case, with the ellipsis character: "Loading studios…",
  "Loading locations…"; when the content arrives the same element says what
  came: "7 studios".
- Nothing to translate in the component. Placeholder widths stand for
  `en-CA` copy; French runs about 30 % longer, which the percentage widths
  absorb, and the real content replaces them anyway.

## Performance

- Change detection: `OnPush`; `shape` is a signal input; the host class comes
  from one `computed`; no template beyond the empty host.
- The shimmer is a CSS background-position animation on the compositor-cheap
  `background`; no JavaScript timers.
- Performance scenario: the `components-harness` route `skeleton/performance`
  renders the studio list's loading state (six card skeletons, 24
  placeholders) and the admin studios table's five skeleton rows, then swaps
  the cards for the seven studios from Kensington Window Room to Ossington
  Blackbox; the swap must stay within the L2-071 layout-shift budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: each placeholder takes the size of what replaces it (the
  card media rect fills the same 3:2 box as the photo), so loaded content lands
  in place (ICD-PERF-4).
- Weight: imports only `@angular/core`.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-skeleton />` with no inputs, when it renders, then the host has the classes `skeleton skeleton--text`, `aria-hidden="true"`, no `role`, no text and no child elements. (L2-026)
- **AC-2** Given skeletons with `shape` set to `title`, `pill`, `rect` and `circle`, when they render, then their hosts carry `skeleton--title`, `skeleton--pill`, `skeleton--rect` and `skeleton--circle` respectively, each with `aria-hidden="true"`. (L2-026)

### Screen readers

- **AC-3** Given the studio list's results region with six card skeletons, `aria-busy="true"` and the status "Loading studios…", when the accessibility tree is read, then no skeleton is exposed and the only text in the region is "Loading studios…". (L2-026)
- **AC-4** Given the studio editor while The Junction Loft loads, with a title skeleton in the `h1` beside visually hidden "Loading studio", when headings are listed, then the page has one level-one heading named "Loading studio". (L2-069)
- **AC-5** Given the admin studios list in its loading state, when axe-core scans it in light and dark, then no violation is reported. (L2-069)

### Keyboard and focus

- **AC-6** Given the studio list loading after the visitor changed "Sort by", when the visitor presses Tab from "Sort by", then focus moves to the next real control and never to a skeleton, and focus stayed on "Sort by" while the skeletons appeared. (L2-067)

### Layout

- **AC-7** Given a card skeleton whose `rect` sits in the 3:2 `.location-card__media` box, when the Kensington Window Room photo replaces it, then the photo occupies exactly the box the rect filled. (L2-071)
- **AC-8** Given a `title` skeleton whose host the consumer sets to 70 % wide, when it renders in a card, then it is 70 % of the card's width, not the default 40 %. (L2-071)
- **AC-9** Given a `pill` skeleton inside an application box `--space-20` wide and `--target-comfortable` tall, when it renders at 360 px, then the pill is 80 × 44 px with fully rounded ends. (L2-071)

### Responsive

- **AC-10** Given the admin studios loading table at 320 px, where cells hold 14rem and 6rem text skeletons, when the rows stack as cards, then no skeleton is wider than its cell and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the shimmer stops and every skeleton is flat
`--color-bg-subtle` ([skeleton.html](../../design-system/components/skeleton.html),
Accessibility › Motion).

### Performance

- **AC-11** Given the `skeleton/performance` harness route, when the six card skeletons are replaced by the seven studio cards on the Lighthouse mobile profile, then Cumulative Layout Shift is at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/skeleton/`:
  `skeleton.component.ts` (`SkeletonComponent`, selector `st-skeleton`, host
  bindings `class` from a `computed` and `aria-hidden="true"`),
  `skeleton.component.html` (empty), `skeleton.component.css` (port of
  `.skeleton`, `.skeleton--*` and the `shimmer` keyframes from
  `components.css`, written against `:host` and `:host(.skeleton--title)`, with
  the default widths wrapped in `:where()`; the reduced-motion rule
  `animation: none`). Type `SkeletonShape` is not exported; the input type is
  the inline union from ICD §9.7.
- Add `.skeleton--circle` (`aspect-ratio: 1; width: 1.5em; border-radius:
  var(--radius-full)`) and the `height: 100%` on rect and pill; `components.css`
  has neither yet.
- Composed by [`st-location-card-skeleton`](location-card.md) and by the
  application's loading layouts (map, dashboard, admin lists, editors).
- Mocks drift the component corrects: the dashboard's Edit placeholder is a
  `pill`, not a `rect` (D-4); inline widths and heights in the mocks become
  host widths and application boxes; the map area's inline-positioned
  `.skeleton` becomes a `rect` filling the `.static-map` box.

## Decisions

- **D-1** *How does a consumer give a `pill` or `rect` its height when ICD-DOM-5 lets the application set only width, margin and placement on a library host?* `rect` and `pill` fill the height of the box they sit in (`height: 100%`, at least 1em). The card media box, the static map and the editor's field boxes already have their height; elsewhere the application wraps the placeholder in an element of its own sized like the control it stands for. This builds every mock with the ICD as it is, so no input is added.
- **D-2** *ICD-002 offers `circle`, but the design system has no circle and says "Don't use round placeholders".* `circle` stays (removing it would be a breaking change) and is specified as a 1.5em square with `--radius-full`, for round content only. The design system's rule is about photos, which are 3:2 and 4:5 rectangles; no Phase 1 screen uses `circle`.
- **D-3** *Who hides the placeholders: the container (`aria-hidden` on the `ul`) or each skeleton?* Both. ICD-002 makes each skeleton `aria-hidden`, so a skeleton placed anywhere (an `h1`, a breadcrumb, a table cell outside a hidden container) stays silent; the containers in the mocks keep their own `aria-hidden` too.
- **D-4** *The dashboard row's Edit placeholder is a `rect` in the mock and a `pill` everywhere else.* `pill`, as the design system's drift note decides: it stands for the small Edit button, which is a pill.
- **D-5** *Should a consumer's width override the shape's default width (title 40 %, last text 60 %)?* Yes, always: the defaults are written with zero specificity, because every composite in the mocks sets its own widths and the design system says width comes from the composite.
