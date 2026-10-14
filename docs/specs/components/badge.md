# Badge

| Field | Value |
|---|---|
| Selector | `st-badge` |
| Library path | `frontend/projects/components/src/lib/badge/` |
| Status | planned |
| Traces to | L2-004, L2-018, L2-021, L2-031, L2-043, L2-044, L2-063, L2-064, L2-066, L2-068, L2-069, L2-071 |
| Design system | [`badge.html`](../../design-system/components/badge.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/minimal`](../../mocks/pages/studio/minimal.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spots/default`](../../mocks/pages/spots/default.html), [`pages/compare/default`](../../mocks/pages/compare/default.html), [`pages/compare/four`](../../mocks/pages/compare/four.html), [`pages/compare/over-limit`](../../mocks/pages/compare/over-limit.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-studios/default`](../../mocks/pages/admin-studios/default.html), [`pages/admin-spots/default`](../../mocks/pages/admin-spots/default.html), [`notifications/public-toast/success`](../../mocks/notifications/public-toast/success.html) |
| Rendering | [`badge.html`](badge.html) |

## Purpose and scope

A badge adds one short fact to the value or name beside it: a fee is
"Mandatory", a permit is "Not required", a studio has the "Lowest" all-in, its
"Prices may be out of date". It is a word in a tinted pill with a dot, never
interactive and never a colour alone.

Use [`st-status`](status-label.md) for a record's publish state ("Draft",
"Published"), [`st-tag-list`](tag.md) for a spot's best uses and "Featured in"
guides, [`st-active-filters`](chip.md) for an applied filter the visitor can
remove, [`st-alert`](alert.md) for a sentence-long warning, and
[`st-disclosure`](disclosure.md) for who paid for a shoot.

Out of scope:

- Whether a badge shows: the server computes staleness (L2-043), the lowest
  all-in and permit needs; the application renders the badge only when the data
  says so. The component never compares dates or prices (ICD-API-10).
- The verified date beside a warning ("Prices verified 2 Mar 2026"): application text.
- Placement inside other components: [`st-description-list`](description-list.md)
  renders a neutral badge for `Fact.badge`; [`st-location-card`](location-card.md)
  renders a warning badge for stale card data; the application places badges in
  table cells, comparison cells and admin rows.

## Usage

Every `.badge` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks badge "span"` plus grep), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/default`, `minimal`, `in-compare`, `playing`, `media-failed` pricing | neutral, after the fee amount in a `.kv` detail (through `st-description-list` `Fact.badge`) | "Mandatory" ($25.00 cleaning fee at The Junction Loft, $20.00 at Bloordale Sun Studio); "Optional, not in all-in" ($30.00 after-hours access) | default | canvas |
| `pages/spot/*` permit table | success or neutral, in the application's `td data-label="Permit"` | "Not required" (Portrait at Evergreen Brick Works); "Required" (wedding or engagement, commercial, video; every row at Distillery District) | default; stacked below 48rem (`table--stack`) | table surface |
| `pages/studios/default`, `selected`, `selected-one`; `dialogs/studio-filters/*` behind; `notifications/public-toast/warning` | warning, on Ossington Blackbox's card (through `st-location-card`) | "Prices may be out of date" | default | card surface |
| `pages/spots/default`; `dialogs/spot-filters/*` behind | warning, on Distillery District's card (through `st-location-card`) | "Permit info may be out of date" in the mocks; "Permit rules may be out of date" in the product (D-5) | default | card surface |
| `pages/studio/stale` summary panel | warning, in `st-summary-panel`'s default slot | "Prices may be out of date" | default | surface (summary panel) |
| `pages/spot/stale-permit` permit section | warning | "Permit rules may be out of date" | default | canvas |
| `pages/compare/default`, `four`, `over-limit`, `unknown-slug`; `notifications/public-toast/success`, `danger` | success in the all-in cell; warning in a stale studio's all-in cell | "Lowest" ($91.00, Leslieville Daylight Studio; $80.00 Kensington Window Room); "Prices may be out of date" (Ossington Blackbox, $270.00) | default; wrapped in a 10rem column | table surface |
| `pages/admin-dashboard/default` "Needs re-verification" and "Due soon" rows | warning or info inside `.admin-row__title` beside the name | "Stale" (Ossington Blackbox, Distillery District); "Due soon" (Liberty Cyc House) | default; drops to the next line whole when the row is narrow | canvas |
| `pages/admin-studios/default`, `admin-spots/default` Flags column | warning or info in `td data-label="Flags"` | "Prices stale" (Ossington Blackbox); "Permits stale" (Distillery District); "Due soon" (Liberty Cyc House) | default; hovered row; stacked card below 48rem | table surface |

Every row is buildable with the API below: `tone` covers neutral, success,
warning and info; the default slot takes the word. No screen uses `tone="danger"`
or `solid`; both are specified so the whole ICD API renders a valid result (D-1, D-2).

## Anatomy

1. **Container** — the host `st-badge`, carrying `.badge` and its modifiers.
   Pill (`--radius-full`), at least `--target-min` (24 px) tall, `--space-2`
   side padding, tone fill, no border. `display: inline-flex`, items centred,
   `--space-1` gap.
2. **Dot** — `::before`, 6 px (0.375rem) circle in `currentColor`, so the badge
   reads as a marker in greyscale. Not a DOM node; not read.
3. **Label** — projected text, `--text-label` at `--font-size-xs`, in the tone's
   foreground colour. It is the only thing assistive technology reads.

Host: per ICD-DOM-1 the host carries the block class
(`<st-badge class="badge badge--warning">`); there is no inner wrapper.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `Tone` (`'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'`) | `'neutral'` | no | Adds `.badge--{tone}`; neutral adds no modifier. |
| `solid` | `boolean` | `false` | no | Adds `.badge--solid`: the tone's solid fill with a contrasting label (D-2). `booleanAttribute`. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The badge is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text, two to five words | The label, marked `i18n` by the consumer. No icons, links or buttons. |

The badge has no library strings (ICD §12).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Neutral | none (`.badge`) | A plain qualifier: "Mandatory", "Optional, not in all-in", "Required". |
| Success | `.badge--success` | Good news about a value: "Not required", "Lowest". |
| Warning | `.badge--warning` | Data may be stale: "Prices may be out of date", "Permit rules may be out of date"; admin "Prices stale", "Permits stale", "Stale". |
| Info | `.badge--info` | A neutral heads-up for the owner: "Due soon". Stone, not blue. |
| Danger | `.badge--danger` | Reserved: no screen uses it (D-1). Danger tint and label. |
| Solid (any tone) | `.badge--solid` | Reserved: no screen uses it (D-2). The tone's solid fill. |

One size: `--font-size-xs` label, at least `--target-min` tall, `--space-2`
side padding. Width comes from the label; the badge never stretches with its
container, and wraps only when its label is wider than the space it is given (D-3).

## States

Badges are not interactive: no hover, focus, active or disabled state.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (each tone) | `tone` | Tone fill, tone label, dot in the label colour | Read in place with its neighbour: "$25.00 Mandatory", "Portrait, Not required" |
| Solid | `solid` | Solid tone fill, contrasting label and dot | As default |
| Wrapped | label wider than its container (a 10rem comparison column) | Label wraps onto a second line inside the pill; the dot stays beside the first line's centre | Unchanged |
| Dropped to next line | in a wrapping row (`.kv dd`, `.admin-row__title`) with no room left | The whole badge moves to the next line beside its value | Unchanged |
| On a hovered row | the table row's `:hover` | Row fill `--color-bg-subtle` around the pill; badge unchanged | — |
| Appears / goes | the application renders it or not, from server data | No transition | Read with the page; never announced |

## Markup

```html
<!-- rendered: the four tones in use -->
<st-badge class="badge">Mandatory</st-badge>
<st-badge class="badge badge--success">Not required</st-badge>
<st-badge class="badge badge--warning">Prices may be out of date</st-badge>
<st-badge class="badge badge--info">Due soon</st-badge>
```

```html
<!-- rendered: reserved danger tone and solid -->
<st-badge class="badge badge--danger">Removed</st-badge>
<st-badge class="badge badge--success badge--solid">Lowest</st-badge>
```

The mocks write `<span class="badge …">`; the product renders the same classes
on the `st-badge` host (ICD-DOM-1). Page objects select by `.badge` and the tone
class and read the text (ICD-TEST-3).

```html
<!-- consumer: permit table cell -->
<td data-label="Permit" i18n-data-label>
  <st-badge [tone]="row.required ? 'neutral' : 'success'">{{ row.permitText }}</st-badge>
</td>

<!-- consumer: comparison all-in cell -->
<div class="compare-table__value">
  <strong>{{ col.allIn }}</strong>
  @if (col.lowest) { <st-badge tone="success" i18n>Lowest</st-badge> }
  @if (col.priceStale) { <st-badge tone="warning" i18n>Prices may be out of date</st-badge> }
</div>

<!-- consumer: admin Flags cell -->
<td data-label="Flags" i18n-data-label>
  @if (row.priceStale) { <st-badge tone="warning" i18n>Prices stale</st-badge> }
  @else if (row.dueSoon) { <st-badge tone="info" i18n>Due soon</st-badge> }
  @else { <span class="text-muted" i18n>None</span> }
</td>
```

`row.permitText` is a `$localize` string chosen in the view model ("Required",
"Not required").

## Design

- Layout: `inline-flex`, `align-items: center`, `gap: --space-1`,
  `min-height: --target-min`, `padding-inline: --space-2`, `max-width: 100%`,
  `white-space: normal` (D-3).
- Type: `--text-label` at `--font-size-xs`, sentence case as written.
- Shape: `--radius-full`, no border; dot 0.375rem, `border-radius: 50%`,
  `background: currentColor`, `flex: none`.
- Elevation, motion and layering: none.

There are no component tokens; each tone reads a semantic fill and label pair:

| Tone | Fill | Label and dot | Solid fill | Solid label |
|---|---|---|---|---|
| Neutral | `--color-bg-subtle` | `--color-fg-muted` | `--color-action` | `--color-fg-on-action` |
| Info | `--color-info-bg` | `--color-info-fg` | `--color-info-solid` | `--color-bg-surface` |
| Success | `--color-success-bg` | `--color-success-fg` | `--color-success-solid` | `--color-bg-surface` |
| Warning | `--color-warning-bg` | `--color-warning-fg` | `--color-warning-solid` | `--color-bg-surface` |
| Danger | `--color-danger-bg` | `--color-danger-fg` | `--color-danger-solid` | `--color-fg-on-danger` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Neutral fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Neutral label | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Success fill | `--color-success-bg` | `--palette-callaloo-50` | `--palette-callaloo-950` |
| Success label | `--color-success-fg` | `--palette-callaloo-700` | `--palette-callaloo-300` |
| Warning fill | `--color-warning-bg` | `--palette-mango-50` | `--palette-mango-950` |
| Warning label | `--color-warning-fg` | `--palette-mango-700` | `--palette-mango-300` |
| Info fill | `--color-info-bg` | `--palette-stone-50` | `--palette-stone-900` |
| Info label | `--color-info-fg` | `--palette-stone-800` | `--palette-stone-200` |
| Danger fill | `--color-danger-bg` | `--palette-sorrel-50` | `--palette-sorrel-950` |
| Danger label | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Solid neutral fill / label | `--color-action` / `--color-fg-on-action` | `--palette-stone-950` / `--palette-white` | `--palette-stone-100` / `--palette-stone-950` |
| Solid success fill | `--color-success-solid` | `--palette-callaloo-700` | `--palette-callaloo-300` |
| Solid warning fill | `--color-warning-solid` | `--palette-mango-700` | `--palette-mango-300` |
| Solid info fill | `--color-info-solid` | `--palette-stone-800` | `--palette-stone-200` |
| Solid label on success, warning, info | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Solid danger fill / label | `--color-danger-solid` / `--color-fg-on-danger` | `--palette-sorrel-600` / `--palette-white` | `--palette-sorrel-300` / `--palette-sorrel-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Neutral label |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | Success label |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Warning label |
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | Info label |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Danger label |
| `--color-fg-on-action` | `--color-action` | 4.5:1 | Solid neutral label |
| `--color-bg-surface` | `--color-success-solid` | 4.5:1 | Solid success label |
| `--color-bg-surface` | `--color-warning-solid` | 4.5:1 | Solid warning label |
| `--color-bg-surface` | `--color-info-solid` | 4.5:1 | Solid info label |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Solid danger label |

The tinted fills are not a boundary and need no 3:1 against the page; the label
carries the contrast, and the dot shares the label colour.

Forced colours: the badge opts out of forced-colour adjustment and draws a
hairline `CanvasText` border (`components.css`), so the pill and its dot stay
visible and the word carries the meaning.

## Responsive behaviour

- The badge keeps its size at every width; nothing changes by breakpoint.
- In wrapping rows (`.kv dd`, `.admin-row__title`) it drops to the next line as
  a whole beside its value.
- When the badge alone is wider than its container (a 10rem comparison column at
  320 to 576 px) its label wraps inside the pill (D-3), so nothing overflows or
  scrolls sideways (L2-031.4, L2-064.1).
- Below 48rem the permit table and admin lists stack (`table[st-table][stack]`);
  the badge sits under its "Permit" or "Flags" caption.
- At 200 % zoom the badge stays whole and visible. It is not a target, so the
  touch-target rules do not apply.

## Accessibility

### Role and pattern

Plain text in the `st-badge` host; no ARIA role, no widget pattern. It is read
in place with what it qualifies: "$25.00 Mandatory", "Portrait, Not required",
"$91.00 Lowest".

### Keyboard

| Key | Action |
|---|---|
| None | Badges are not focusable. A related action ("Edit Ossington Blackbox prices") is its own button or link. |

### Focus

Never focusable: no `tabindex`, no click handler.

### Labelling

The words carry the meaning; colour and the dot only support them (WCAG 1.4.1).
The label must make sense next to its neighbour: "Lowest" sits in the row
headed "All-in, 2 hours". The dot is a pseudo-element and adds nothing to the text.

### Announcements

None. Badges appear and go with the page; staleness is not live data.

### Motion

None.

## Content and internationalisation

- Sentence case, two to five words, no full stop: "Mandatory", "Not required",
  "Lowest", "Due soon".
- Visitor warnings say what may be wrong: "Prices may be out of date", "Permit
  rules may be out of date" (one wording per kind of data, matching "Permit
  rules verified"). The owner gets terse flags that name the data: "Prices
  stale", "Permits stale", "Stale".
- Pair a warning with the verified date nearby ("Prices verified 2 Mar 2026",
  formatted by the application per L2-070.3).
- Never a badge for a record's state ("Draft") or a fact about the place ("Cyc wall").
- Translatable: the default slot. French runs about 30 % longer ("Les prix
  peuvent être périmés"); the badge wraps rather than overflowing (D-3).

## Performance

- Change detection: `OnPush`, signal inputs; the host class string is one `computed`.
- Template is `<ng-content />`; imports only `@angular/core`.
- Performance scenario: the `components-harness` route `badge/performance`
  renders the comparison's all-in row for The Junction Loft ($145.00),
  Leslieville Daylight Studio ($91.00, "Lowest") and Ossington Blackbox ($270.00,
  "Prices may be out of date", wrapped), plus the studio admin list's nine Flags
  cells, held to the L2-071 layout-shift budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: size depends only on the label, so the server-rendered badge
  is final; a wrapped badge wraps on first paint.

## Acceptance criteria

### Rendering

- **AC-1** Given The Junction Loft's pricing, when it renders, then the cleaning fee's detail reads "$25.00 Mandatory" with a badge that has only the class `badge`, and the after-hours access fee reads "$30.00 Optional, not in all-in". (L2-004)
- **AC-2** Given Evergreen Brick Works' permit table, when it renders, then the Portrait row's Permit cell holds a `badge badge--success` reading "Not required" and the Commercial row's a `badge` reading "Required". (L2-018)
- **AC-3** Given Distillery District's page with permits verified 20 Mar 2026, when it renders, then the permit section shows a `badge badge--warning` reading "Permit rules may be out of date". (L2-018)
- **AC-4** Given the studio list, when Ossington Blackbox's card renders (prices verified 2 Mar 2026), then it shows a `badge badge--warning` reading "Prices may be out of date". (L2-021)
- **AC-5** Given the comparison of The Junction Loft, Leslieville Daylight Studio and Ossington Blackbox, when the all-in row renders, then Leslieville Daylight Studio's $91.00 cell carries a `badge badge--success` reading "Lowest" and the other two cells carry no success badge. (L2-031)
- **AC-6** Given the same comparison, when Ossington Blackbox's all-in cell renders, then it carries a `badge badge--warning` reading "Prices may be out of date". (L2-043)
- **AC-7** Given the dashboard, when the "Needs re-verification" and "Due soon" lists render, then Ossington Blackbox's and Distillery District's rows carry a warning badge "Stale" and Liberty Cyc House's row an info badge "Due soon" beside the name. (L2-044)
- **AC-8** Given the studio admin list, when its Flags column renders, then Ossington Blackbox shows a warning badge "Prices stale", Liberty Cyc House an info badge "Due soon", and the other rows no badge. (L2-063)

### Variants

- **AC-9** Given `<st-badge tone="danger">Removed</st-badge>` and a solid badge of each tone in the harness, when they render in light and dark, then they carry `badge--danger` and `badge--solid` respectively and every label is at least 4.5:1 against its fill. (L2-068)

### Screen readers

- **AC-10** Given the pricing, permit table, comparison and admin list above, when a keyboard user tabs through them, then no badge receives focus, and a screen reader reads each badge's word in place after its value ("$25.00 Mandatory"). (L2-069)
- **AC-11** Given every screen above in light and dark, when axe-core scans it, then no violation involves a badge. (L2-069)

### Theming

- **AC-12** Given neutral, success, warning and info badges on the page, on a card and on a hovered admin row, when the contrast check runs in light and dark, then each label is at least 4.5:1 against its own fill. (L2-068)
- **AC-13** Given a warning and a success badge rendered in greyscale, when they are compared with the page, then each is still identified by its word, and none relies on colour alone. (L2-068)

### Responsive

- **AC-14** Given the comparison at 360 px wide with 160 px studio columns, when Ossington Blackbox's all-in cell renders, then "Prices may be out of date" wraps inside its pill within the column, no badge overflows its cell, and `document.documentElement.scrollWidth` equals the viewport width. (L2-031)
- **AC-15** Given the studio list and the dashboard at 320 px wide, when the badges render, then each fits its container, a badge that does not fit beside its name moves to the next line whole, and the page has no horizontal scroll. (L2-064)
- **AC-16** Given Ossington Blackbox's page at 200 % zoom in a 1280 px viewport, when the visitor reaches the summary panel, then "Prices may be out of date" is fully visible with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): badges have no
animation and appear without a transition
([badge.html](../../design-system/components/badge.html), Accessibility › Motion).

### Performance

- **AC-17** Given the `badge/performance` harness route with the comparison's all-in row and the nine admin Flags cells, when it is measured with Lighthouse on the mobile profile, then Cumulative Layout Shift is at most 0.1 and no badge moves after first paint. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/badge/`: `badge.component.ts`
  (`BadgeComponent`, selector `st-badge`), `badge.component.html`
  (`<ng-content />`), `badge.component.css` (port of `.badge`, `.badge::before`
  and the tone rules from `components.css`, written against `:host` and
  `:host(.badge--warning)` …, plus the new `.badge--danger` and `.badge--solid`
  rules from D-1 and D-2, and `white-space: normal; max-width: 100%` from D-3).
  `Tone` in `src/lib/types/tone.ts`.
- Host binding: `[class]` from a `computed`: `badge`, plus `badge--{tone}` unless
  neutral, plus `badge--solid` when `solid`.
- The forced-colours rule (`forced-color-adjust: none`, hairline `CanvasText`
  border) comes across with the block.
- DS and mock drift the component corrects: `.compare-table .badge { white-space: normal; }`
  (application CSS targeting a library class, which ICD-DOM-5 forbids) and the
  compare mocks' inline `style="white-space: normal;"` are dropped, because the
  badge wraps by itself (D-3); spot cards' "Permit info may be out of date"
  becomes "Permit rules may be out of date" (D-5).
- The design-system page should catch up with D-1 to D-3 at the next extraction.

## Decisions

- **D-1** *ICD-002's `Tone` includes `danger`, but the design system has no `.badge--danger`.* `tone="danger"` renders `.badge--danger` with `--color-danger-bg` and `--color-danger-fg`, the same pattern as the other tones, so every value of the input renders a valid, accessible result (ICD-API-8). No screen uses it today.
- **D-2** *ICD-002 gives the badge `solid` (`.badge--solid`), but the design system defines no solid style and no mock uses one.* A solid badge fills with the tone's solid token and a contrasting label: neutral `--color-action` with `--color-fg-on-action` (the filter count bubble's verified pair), info, success and warning their `-solid` token with `--color-bg-surface` (the pairs `contrast-pairs.json` reserves for solid marks), danger `--color-danger-solid` with `--color-fg-on-danger`. Every pair is at least 4.5:1 in both themes.
- **D-3** *The comparison's stale badge must wrap in a 10rem column, which the design system does with `.compare-table .badge { white-space: normal; }`; ICD-DOM-5 forbids application CSS that targets a library class, and ICD-002 has no wrap input.* The badge itself uses `white-space: normal` with `max-width: 100%`. An inline-flex pill wraps only when its label is wider than the whole space it is given, so in every other place it behaves exactly as `nowrap` did (it moves to the next line whole), and no badge can overflow at 320 px. This needs no ICD change.
- **D-4** *Does a badge ever announce itself when it appears?* No. Staleness and "Lowest" are part of the page the server renders; nothing makes a badge appear while the visitor watches.
- **D-5** *Spot cards say "Permit info may be out of date" while the spot page says "Permit rules may be out of date".* The product uses "Permit rules may be out of date" everywhere, as the design system decided, matching the "Permit rules verified" line. The copy is the application's; the badge renders whatever it is given.
