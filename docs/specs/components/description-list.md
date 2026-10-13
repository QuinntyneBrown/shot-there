# Description list

| Field | Value |
|---|---|
| Selector | `st-description-list` |
| Library path | `frontend/projects/components/src/lib/description-list/` |
| Status | planned |
| Traces to | L2-004, L2-005, L2-006, L2-007, L2-008, L2-011, L2-017, L2-064, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`description-list.html`](../../design-system/components/description-list.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/minimal`](../../mocks/pages/studio/minimal.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/studio/playing`](../../mocks/pages/studio/playing.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html), [`pages/spot/no-rain-backup`](../../mocks/pages/spot/no-rain-backup.html), [`pages/spot/map-failed`](../../mocks/pages/spot/map-failed.html) |
| Rendering | [`description-list.html`](description-list.html) |

## Purpose and scope

The description list carries the measured facts every review shares, one label
and one value per row: a studio's pricing, measured specifications, included
gear and extras, and logistics; a spot's directions and practical conditions.
The labels are the same on every location and the rows come in the same order,
so two reviews compare side by side. It is the `.kv` block of the design
system's description-list page.

Use a [`table`](table.md) when people read down a second column (permits by
shoot type, light by time and season). The verdict's paired regions
(`.regions`) and the summary panel's two headline facts
(`.summary-panel__row`) are on the same DS page but belong to
[`review-layout`](review-layout.md). The basics under the `h1` are a plain list
(`.review-head__meta`), and cards, guide entries and the editor's status panel
keep their own lists.

Out of scope:

- Formatting values: money, measurements, quantities and dates arrive as
  display strings from the application (ICD-I18N-4): "$60.00", "6.1 m × 4.3 m
  (20 ft × 14 ft)", "Godox AD600 strobe × 2".
- Deciding which rows appear and the sparse words ("No", "None", "None nearby",
  "Not measured"): the application's view model, from the server's data.
- The section heading that names the list, the price block's all-in line and
  verified line, and the stale warning alert ([`price-block`](price-block.md),
  [`alert`](alert.md)).
- The text that replaces an empty list ("Nothing costs extra at this studio."):
  the application renders it instead of the list (D-2).

## Usage

Every `dl.kv` in `docs/mocks/` (11 review mocks).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/*` Pricing (inside `st-price-block`, its `items`) | "Hourly rate" `$60.00` numeric; "Minimum booking" "2 hours"; "Cleaning fee" `$25.00` numeric + badge "Mandatory"; "After-hours access" `$30.00` numeric + badge "Optional, not in all-in" | — | default; stale (Ossington: "$90.00", "3 hours", "Extra fees" "None", alert after the verified line) | canvas |
| `pages/studio/*` Measured specifications | "Usable shooting space" "6.1 m × 4.3 m (20 ft × 14 ft)", "Ceiling height" "4.0 m (13 ft)", "Window direction" "North", "Power" "8 outlets, standard 15 A · 20 A circuits: Yes (2)", "Cyc wall" "Yes · scuffed", "Backdrops" | — | default; sparse (Bloordale: "Cyc wall" "No") | canvas |
| `pages/studio/*` Gear, "Included in the hourly rate" | "Lights" "Godox AD600 strobe × 2 · 60 cm LED panel × 1", "Modifiers", "Stands" "C-stand × 4", "Other" "Garment steamer" | — | default | canvas |
| `pages/studio/*` Gear, "Costs extra" | "Hazer" `$20.00` numeric, "Extra seamless roll" `$15.00` numeric | — | default; empty (minimal: no list, "Nothing costs extra at this studio.") | canvas |
| `pages/studio/*` Logistics | "Load-in" "Freight elevator · small, 1.2 m wide", "Parking", "Transit", "Washroom", "Changing area", "Client seating", "Noise" | — | default; sparse (Bloordale: "Changing area" "None") | canvas |
| `pages/spot/*` How to get there | "Transit" "TTC 28A shuttle from Davisville or Broadview station", "Driving", "Walking" | — | default | canvas |
| `pages/spot/*` Practical conditions | "Crowds" "Weekday: Low · Weekend: High", "Parking", "Washrooms", "Changing" | — | default | canvas |

Every row is buildable: each is a `Fact` (`term`, `detail`, optional `numeric`,
`badge`, `srSuffix`) in `items`.

## Anatomy

1. **List** — native `dl.kv`: a grid, one column below 36rem, a 12rem label
   column and a value column from 36rem.
2. **Label** — `dt`, `--text-label` in `--color-fg-subtle`; a direct child of
   the `dl`.
3. **Value** — `dd`, body text, a wrapping flex row (`space-between`) so a badge
   sits at the end; long values wrap anywhere. A hairline `--color-border-default`
   rule under it (and under its label from 36rem).
4. **Numeric value (optional)** — `span.num` around the detail: tabular figures.
5. **Hidden suffix (optional)** — `span.visually-hidden` after the detail.
6. **Qualifier (optional)** — `st-badge` (neutral) after the value: "Mandatory",
   "Optional, not in all-in".

Host: the block must be a native `<dl>` whose `dt` and `dd` are direct children,
so the component renders the `dl` and the host `st-description-list` adds no box
(`display: contents`, ICD-DOM-1).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `items` | `readonly Fact[]` | — | yes | One `dt` + `dd` pair per item, in order, tracked by `$index`. `term` is the `dt` text; `detail` the `dd` text; `numeric` wraps the detail in `<span class="num">`; `srSuffix` follows the detail in `<span class="visually-hidden">`; `badge` renders `<st-badge>` after them. An empty array renders nothing (D-2). |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The list is static text. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Values are text; a value with a link is not used in the product (D-4). |

Library strings: none (ICD §12).

## Variants and sizes

| Variant | Fact fields | Example |
|---|---|---|
| Text value | `term`, `detail` | "Window direction" · "North" |
| Numeric value | + `numeric: true` | "Hourly rate" · "$60.00" in tabular figures |
| With qualifier | + `badge` | "Cleaning fee" · "$25.00" · badge "Mandatory" |
| With hidden suffix | + `srSuffix` | "Light" · "5" read as "5 out of 5" |

One size: values in body text (`--text-body`), labels in `--text-label`. Width is
the container's.

## States

The list has no pointer, focus or disabled states; nothing in it is focusable.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | `items` | Label and value rows with hairline rules | A description list of term and definition pairs |
| Hover / focus / active | — | None: no controls inside | — |
| Disabled | — | Not used | — |
| Sparse value | Data | The row still renders with a word: "No", "None", "None nearby", "Not measured" (never a blank or a dash) | Read as any value |
| Empty | `items` is `[]` | Nothing rendered; the application shows its own sentence | Nothing announced |
| Stale | Price or permit date stale | The list is not restyled; a warning alert follows the verified line in the price block | The alert is the status region (L2-005.2) |

## Markup

```html
<!-- rendered: pricing items -->
<st-description-list>
  <dl class="kv">
    <dt>Hourly rate</dt><dd><span class="num">$60.00</span></dd>
    <dt>Minimum booking</dt><dd>2 hours</dd>
    <dt>Cleaning fee</dt><dd><span class="num">$25.00</span> <st-badge class="badge">Mandatory</st-badge></dd>
    <dt>After-hours access</dt><dd><span class="num">$30.00</span> <st-badge class="badge">Optional, not in all-in</st-badge></dd>
  </dl>
</st-description-list>
```

```html
<!-- rendered: hidden suffix -->
<dl class="kv"><dt>Light</dt><dd>5<span class="visually-hidden"> out of 5</span></dd></dl>
```

```html
<!-- consumer: measured specifications -->
<section class="review-section" aria-labelledby="specs">
  <h2 id="specs" i18n>Measured specifications</h2>
  <st-description-list [items]="vm().specs" />
</section>

<!-- consumer: extras, empty -->
<h3 i18n>Costs extra</h3>
@if (vm().extras.length) { <st-description-list [items]="vm().extras" /> }
@else { <p i18n>Nothing costs extra at this studio.</p> }
```

```ts
// view model beside the page (application): labels marked, values formatted for en-CA
specs: Fact[] = [
  { term: $localize`Usable shooting space`, detail: '6.1 m × 4.3 m (20 ft × 14 ft)' },
  { term: $localize`Cyc wall`, detail: $localize`No` },
  { term: $localize`Cleaning fee`, detail: '$25.00', numeric: true, badge: $localize`Mandatory` },
];
```

`dt` and `dd` are direct children of the `dl`: never wrap a pair in a `div`
(that is `.regions`). The badge host carries `.badge` as `st-badge` renders it.

## Design

- `.kv`: `display: grid; grid-template-columns: minmax(0, 1fr); gap: --space-1
  --space-6; margin: 0`; from 36rem `grid-template-columns: 12rem minmax(0, 1fr)`.
- `dt`: `--text-label`, `--color-fg-subtle`, `padding-top: --space-4`; from
  36rem `padding-block: --space-4` and a `--border-width-hairline`
  `--color-border-default` bottom rule.
- `dd`: `margin: 0`; `padding-block: --space-1 --space-4` (`--space-3` from
  36rem); bottom rule as the label's; `display: flex; flex-wrap: wrap;
  justify-content: space-between; align-items: center; gap: --space-2`;
  `overflow-wrap: anywhere`.
- `.num`: `font-variant-numeric: tabular-nums`.
- Badge: neutral `st-badge` (`--color-bg-subtle`, `--color-fg-muted`,
  `--radius-full`, `--text-label` at `--font-size-xs`).
- No fill: the list takes the surface it sits on. No component tokens; no motion.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Label | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Value | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Rule | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Badge text | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Badge fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Page | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Label on the page |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Value on the page |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Label on a surface |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Neutral qualifier badge |

The rule is decorative (rows are also separated by spacing and the label).
Forced colours: text takes `CanvasText`, the rule stays visible; the badge keeps
a `CanvasText` border (badge CRD).

## Responsive behaviour

- Below 36rem (XS): each label sits above its value in one column, and only the
  value carries the rule, so a row reads as one block (L2-008.3, L2-017.3).
- From 36rem: the label takes a fixed 12rem column and both cells carry the
  rule; at MD and above this is the two-column label and value grid L2-008.3
  asks for.
- Values wrap anywhere, so a long transit note never widens the page at 320 px;
  the badge wraps under the value when the row is narrow.
- At 200 % zoom the one-column layout takes over. No targets.

## Accessibility

### Role and pattern

Native `dl`, `dt`, `dd`: no WAI-ARIA pattern or role. Screen readers announce a
list with term and definition pairs.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips the list: nothing in it is focusable. |
| Screen reader list keys | Move pair by pair; the term is read before its value. |

### Focus

Not focusable.

### Labelling

Each list sits in a section named by its heading through `aria-labelledby`
("Measured specifications", "Practical conditions"); the application owns that
heading. Units are symbols a screen reader can say ("m", "ft", "A"). The hidden
suffix completes a value ("5 out of 5"). Middle dots are plain text and read as
a pause.

### Announcements

None.

### Motion

None.

## Content and internationalisation

- Labels are the same on every location and never change wording between
  reviews: "Usable shooting space", "Ceiling height", "Window direction",
  "Power", "Cyc wall", "Backdrops"; "Load-in", "Parking", "Transit", "Washroom",
  "Changing area", "Client seating", "Noise".
- Measurements are metric first with imperial in brackets: "7.0 m × 5.2 m (23 ft
  × 17 ft)", "3.4 m (11 ft)".
- Prices are CAD with two decimals, `numeric`: "$45.50". Fees say whether they
  count: badge "Mandatory" or "Optional, not in all-in".
- Several facts in one value are joined with " · ": "Weekday: Low · Weekend:
  High"; quantities follow the item with "×": "C-stand × 4".
- Absent values are words: "No", "None", "None nearby", "Not measured"; never
  blank, never a dash.
- Translatable: `term`, `badge`, `srSuffix` and word values ("No", "None");
  data: names, notes and formatted numbers. Longer translations wrap.

## Performance

- Change detection: `OnPush`; `@for (item of items(); track $index)`; no template
  work.
- Performance scenario: the `components-harness` route
  `description-list/performance` renders The Junction Loft's four lists
  (pricing with two badges, six measured specifications, four included gear
  rows, seven logistics rows) on one page; held to the L2-071 layout-shift
  budget.
- Regression rule: a change to the template, inputs or styles is measured on
  that route against the base branch before it is pushed.
- Layout stability: the list renders from server data with the page; nothing
  inside loads later.
- Weight: imports `@angular/core` and `st-badge` only.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-description-list>` with The Junction Loft's six measured specifications, when it renders, then it is one `dl.kv` whose `dt` and `dd` elements are its direct children in the given order, and the host adds no box of its own. (L2-069)
- **AC-2** Given the fact "Usable shooting space" / "6.1 m × 4.3 m (20 ft × 14 ft)", when the list renders, then that row's value reads exactly "6.1 m × 4.3 m (20 ft × 14 ft)". (L2-006)
- **AC-3** Given the fact "Hourly rate" / "$60.00" with `numeric`, when it renders, then the value is `<span class="num">$60.00</span>` with tabular figures. (L2-004)
- **AC-4** Given "Cleaning fee" / "$25.00" with the badge "Mandatory" and "After-hours access" / "$30.00" with the badge "Optional, not in all-in", when the pricing list renders, then each badge sits after its amount at the end of the row. (L2-004)
- **AC-5** Given the fact "Light" / "5" with `srSuffix` " out of 5", when a screen reader reads the row, then it hears "Light 5 out of 5" while the page shows "5". (L2-011)
- **AC-6** Given The Junction Loft's included gear, when it renders, then the "Lights" row reads "Godox AD600 strobe × 2 · 60 cm LED panel × 1". (L2-007)
- **AC-7** Given a studio with no paid extras (Bloordale Sun Studio), when its Gear section renders, then there is no empty list under "Costs extra" and the text "Nothing costs extra at this studio." is shown. (L2-007)
- **AC-8** Given Bloordale Sun Studio with no cyc wall, when its specifications render, then the "Cyc wall" row is present and reads "No" with no condition. (L2-006)
- **AC-9** Given Bloordale Sun Studio with no changing area, when its logistics render, then the "Changing area" row is present and reads "None". (L2-008)
- **AC-10** Given The Junction Loft's logistics, when they render, then the "Load-in" row reads "Freight elevator · small, 1.2 m wide". (L2-008)
- **AC-11** Given Evergreen Brick Works' practical conditions, when they render, then the "Crowds" row reads "Weekday: Low · Weekend: High". (L2-017)
- **AC-12** Given a spot with no washrooms, when its practical conditions render, then the "Washrooms" row is present and reads "None nearby". (L2-017)
- **AC-13** Given Ossington Blackbox with stale prices, when its pricing renders, then the list has the same classes and rows as a fresh one, and the warning that follows the verified line is a `role="status"` region. (L2-005)
- **AC-14** Given any description list, when its template is inspected, then it renders no text that did not arrive in `items`. (L2-070)

### Responsive

- **AC-15** Given The Junction Loft's logistics at 360 px and at 768 px, when they render, then at 360 px each label sits above its value with one rule under the value, and at 768 px labels sit in a 12rem column beside their values with a rule under both. (L2-008)
- **AC-16** Given Trinity Bellwoods Park's "Transit" value "501 Queen streetcar to Strachan Ave or Shaw St; the park is at the stop" at 320 px, when it renders, then it wraps inside the list and `document.documentElement.scrollWidth` equals 320. (L2-064)

### Screen readers and theming

- **AC-17** Given the specifications list, when a screen reader user lists it, then it is announced as a description list of six terms with their values, and pressing Tab never lands inside it. (L2-069)
- **AC-18** Given the pricing list in the light and the dark theme, when the contrast check runs, then labels (`--color-fg-subtle`) and values are at least 4.5:1 against the page and the "Mandatory" badge text is at least 4.5:1 against its fill. (L2-068)

### Motion

The list does not animate; there is no motion rule to test.

### Performance

- **AC-19** Given the `description-list/performance` harness route with The Junction Loft's four lists, when it renders, then the cumulative layout shift is at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/description-list/`:
  `description-list.component.ts` (`DescriptionListComponent`, selector
  `st-description-list`, `:host { display: contents }`), `.html`, `.css` (port of
  `.kv` and `.num` scoped to the component; `.num` is also a global utility).
  Uses `BadgeComponent`. `Fact` from `src/lib/types/fact.ts`.
- Template: `@if (items().length) { <dl class="kv"> @for (item of items(); track $index) { <dt>{{ item.term }}</dt><dd>@if (item.numeric) {<span class="num">{{ item.detail }}</span>} @else {{{ item.detail }}}@if (item.srSuffix) {<span class="visually-hidden">{{ item.srSuffix }}</span>}@if (item.badge) { <st-badge>{{ item.badge }}</st-badge>}</dd> } </dl> }`.
- `st-price-block` renders its `items` with this component (its CRD).
- Mocks drift the component corrects: `<dd class="num">$60.00</dd>` in
  `studio/default` becomes `<dd><span class="num">$60.00</span></dd>` (D-1).

## Decisions

- **D-1** *The mocks mark numeric values two ways: `<dd class="num">` and `<dd><span class="num">`.* The span form, as the DS documents it: it also works when a badge follows, and the `dd` keeps one class contract.
- **D-2** *What does an empty `items` render?* Nothing: an empty `dl` is announced as an empty list. The application shows its own sentence instead ("Nothing costs extra at this studio.", L2-007.2), as `studio/minimal` does.
- **D-3** *Which badge tone does `Fact.badge` use?* Neutral, as every qualifier in the mocks ("Mandatory", "Optional, not in all-in"). Stale and status words are not qualifiers and use their own components.
- **D-4** *Can a value hold a link or other markup?* No. Every `.kv` value in the mocks is text; links in a review (the permit source, "Watch on YouTube") sit outside the list. A value that needs a link is a different component, so `items` stays the only input.
