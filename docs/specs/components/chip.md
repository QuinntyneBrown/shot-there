# Chip

| Field | Value |
|---|---|
| Selector | `st-active-filters` |
| Library path | `frontend/projects/components/src/lib/active-filters/` |
| Status | planned |
| Traces to | L2-022, L2-024, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`chip.html`](../../design-system/components/chip.html) (filter chip), [`filter.html`](../../design-system/components/filter.html) (active filters) |
| Source mocks | [`pages/studios/filtered`](../../mocks/pages/studios/filtered.html), [`pages/studios/no-results`](../../mocks/pages/studios/no-results.html), [`pages/spots/filtered`](../../mocks/pages/spots/filtered.html), [`pages/spots/no-results`](../../mocks/pages/spots/no-results.html) |
| Rendering | [`chip.html`](chip.html) |

## Purpose and scope

A chip is a small pill the visitor can act on. On ShotThere it has one job:
`st-active-filters` shows which filters are on above the studio and spot
results ("Up to $150.00", "Natural light", "Family"), each with its own remove
button, and ends the row with "Clear all". It lets the visitor drop one filter
without reopening the filter column or sheet.

The design system also documents a toggle chip (`button.chip[aria-pressed]`)
and static and link chips (`span.chip`, `a.chip`). No ShotThere screen uses
them, and ICD-002 has no component for them; they are not built (D-1). Use
[`st-tag-list`](tag.md) for read-only facts, [`st-checkbox-group`](checkbox.md)
and [`st-radio-group`](radio-group.md) for choosing filters,
[`st-segmented`](button-group.md) for "Both / Studios / Spots", and
[`button[st-filter-trigger]`](filter.md) to open the filters sheet.

Out of scope:

- Which filters are active, their order and their chip labels ("Up to
  $150.00", "Parking: on-site"): the application derives them from the URL
  (L2-025) beside the page and formats prices for `en-CA` (L2-070.3).
- What removing or clearing does: the application updates the URL query
  (L2-025.2), which reloads the list and the result count.
- Where focus goes after a chip or the whole row disappears: the application
  (ICD-002 §9.5, §14), as specified under *Accessibility › Focus*.
- Announcing the new result count: [`st-result-count`](filter.md) is the only
  announcer (ICD-002 D-7).
- The "Clear filters" action in the no-results empty state:
  [`st-empty-state`](empty-state.md) with an application `button[st-button]`.

## Usage

Every `.chip`, `.active-filters` and `.remove` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks chip "span|button|a"`, `… active-filters "div"`,
`… remove "button"`), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studios/filtered` (`?costMax=150&light=medium&sort=cost`) | two filters, default strings | "Up to $150.00", "Natural light"; "Clear all" | default, hover and focus on a remove button | canvas, top of the results column |
| `pages/studios/no-results` (`?costMax=120&cyc=yes&parking=on-site`) | three filters | "Up to $120.00", "Cyc wall", "Parking: on-site"; "Clear all" in the product (D-3) | default; above the empty state | canvas |
| `pages/spots/filtered` | two filters | "Family", "No permit needed"; "Clear all" | default | canvas |
| `pages/spots/no-results` | two filters | "Waterfront", "Family"; "Clear all" in the product (D-3) | default; above the empty state | canvas |
| `pages/studios/default`, `spots/default`, `loading`, `error` | no filters | `filters` empty | renders nothing | — |
| After "Clear all" or the last remove | `filters` becomes empty | — | renders nothing | — |

Every row is buildable with the API below: `filters` carries key and label,
`filterRemoved` and `cleared` report the two actions, and the three strings have
library defaults with override inputs.

## Anatomy

1. **Row** — the host `st-active-filters`, carrying `.active-filters`: a
   wrapping flex row, items centred, `--space-2` gaps.
2. **Lead-in** — `<span class="visually-hidden">` with `label` ("Active
   filters:"), so the row is introduced once to assistive technology.
3. **Filter chip** — `<span class="chip chip--filter">` per filter: accent-tinted
   pill holding the label text and the remove button. Not focusable itself.
4. **Remove button** — native `<button class="remove" type="button">` inside the
   chip, named by `aria-label` from `removeLabel` ("Remove filter: Natural
   light"), holding an `st-icon` `close` at `sm` (`svg.icon.icon--sm`,
   `aria-hidden="true"`). Round, `--target-min` (24 px) from 48rem,
   `--target-comfortable` (44 px) below.
5. **Clear all** — `button[st-button]` with `variant="link"`, `size="sm"`,
   `type="button"` (`.btn.btn--link.btn--sm`), text from `clearLabel`. Last in
   the row; wraps with the chips.

Host: per ICD-DOM-1 the host carries the block class; the lead-in, chips and
Clear all are its direct children.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `filters` | `readonly ActiveFilter[]` (`{ key: string; label: string }`) | — | yes | One chip per filter, in the given order, tracked by `key`. Empty: the host renders no children, no `.active-filters` class and is `hidden` (D-2). |
| `label` | `string` | §12 `st.activeFilters.label` "Active filters:" | no | Visually hidden lead-in. |
| `removeLabel` | `string` | §12 `st.activeFilters.remove` "Remove filter: {$label}" | no | Each remove button's `aria-label`. The component replaces `{$label}` with the chip's label; an override must contain `{$label}` (D-4). |
| `clearLabel` | `string` | §12 `st.activeFilters.clear` "Clear all" | no | Text of the Clear all button. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `filterRemoved` | `ActiveFilter` (the chip's object, as given) | A remove button is activated (click, Enter or Space). Once per activation. The component does not remove the chip itself; it disappears when the application passes `filters` without it. |
| `cleared` | `void` | "Clear all" is activated. `filterRemoved` is not emitted for each chip. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | All content comes from inputs. |

Library strings: `st.activeFilters.label`, `st.activeFilters.remove`,
`st.activeFilters.clear` (ICD §12), each replaceable through the input above.
Chip labels are application copy.

## Variants and sizes

| Variant | Classes | Use for |
|---|---|---|
| Active filter | `.chip.chip--filter` + `.remove` | Every chip ShotThere shows. Always accent-tinted: each is a choice that is on. |
| Toggle, static, link chips | `button.chip[aria-pressed]`, `span.chip`, `a.chip` | Not built (D-1). |

One design size whose height follows the viewport:

| Part | Below 48rem | 48rem and up | Token |
|---|---|---|---|
| Chip height | at least 44 px | at least 36 px | `--target-comfortable` / `--control-height-sm` |
| Remove button | 44 × 44 px | 24 × 24 px | `--target-comfortable` / `--target-min` |
| Clear all | 44 px tall | 36 px tall | `button[st-button]` `sm` ([button.md](button.md)) |
| Gap between items | 8 px | 8 px | `--space-2` |

Chip width comes from its label plus `--space-3` left and `--space-1` right padding.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (selected) | always | `--color-accent-subtle` fill, `--color-accent` edge, `--color-fg-accent` label and × | Lead-in "Active filters:"; each remove button "Remove filter: Natural light, button" |
| Hover (remove) | `.remove:hover` | Round `--color-accent-subtle-hover` fill under the ×; the chip fill does not change | — |
| Focus (remove) | `.remove:focus-visible` | Shared `--focus-ring-width` ring in `--color-focus-ring`, offset onto the tint | Focus on the remove button |
| Active (remove) | `:active` | No pressed style; the chip leaves when the application updates `filters` | — |
| Disabled | never | A chip exists only while its filter applies | — |
| Removed | the application drops the filter from `filters` | The chip disappears at once; the row reflows without animation; the other chips' buttons are the same elements as before | The result count announces the new total |
| Cleared / no filters | `filters` is `[]` | Nothing rendered; the host is `hidden` | Nothing |
| Above no results | the list is empty but filters remain | Chips and Clear all stay so one filter can be removed at a time (L2-022.4) | — |
| While the list reloads | the application marks the results region `aria-busy` | No spinner on chips; chips stay usable | — |

## Markup

```html
<!-- rendered: two active filters -->
<st-active-filters class="active-filters">
  <span class="visually-hidden">Active filters:</span>
  <span class="chip chip--filter">Up to $150.00<button class="remove" type="button" aria-label="Remove filter: Up to $150.00"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></span>
  <span class="chip chip--filter">Natural light<button class="remove" type="button" aria-label="Remove filter: Natural light"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></span>
  <button class="btn btn--link btn--sm" type="button">Clear all</button>
</st-active-filters>
```

```html
<!-- rendered: no filters -->
<st-active-filters hidden></st-active-filters>
```

The mocks write a `<div class="active-filters">` with an inline
`style="margin-bottom: var(--space-8)"` and end the row with `<a class="btn
btn--link btn--sm" href="default.html">Clear all</a>`. In the product the host
carries the class, the spacing comes from the application's `.browse__head`
layout, and Clear all is a `button` that emits `cleared` (D-5). Page objects
select the row by `.active-filters`, a chip by `.chip--filter`, a remove button
by its name, and Clear all by its name.

```html
<!-- consumer: studio list results header -->
<st-active-filters [filters]="activeFilters()"
                   (filterRemoved)="removeFilter($event)"
                   (cleared)="clearFilters()" />
```

`activeFilters()` is a `computed` beside the page that maps the
`StudioListQuery` to `ActiveFilter[]` in filter-panel order:
`{ key: 'costMax', label: 'Up to $150.00' }` and `{ key: 'light', label: 'Natural light' }`
(the label marked with `$localize`).
For a repeatable parameter each value is its own chip with its own key
(`hood:leslieville`, `hood:junction`).

## Design

- Row: `display: flex; flex-wrap: wrap; gap: --space-2; align-items: center`.
- Chip: `inline-flex`, items centred, `gap: --space-1`, `min-height:
  --control-height-sm` (`--target-comfortable` below 48rem), `padding: 0 --space-1 0 --space-3`,
  `--radius-full`, `--border-width-hairline` solid edge, `--text-label`,
  `cursor: default`.
- Remove button: `inline-grid`, centred, `--target-min` square
  (`--target-comfortable` below 48rem), `border-radius: 50%`, no border,
  transparent, `color: inherit`, `margin-right: calc(-1 * --space-1)`; icon
  `icon--sm`.
- Motion: only the fill transitions, over `--duration-fast` with `--ease-standard`.
- No component tokens: the chip reads the accent roles, so a re-skin of
  "selected" moves every chip with the checked boxes beside it.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Chip fill | `--color-accent-subtle` | `--palette-pepper-50` | `--palette-pepper-950` |
| Chip edge | `--color-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Label and × | `--color-fg-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Remove hover fill | `--color-accent-subtle-hover` | `--palette-pepper-100` | `--palette-pepper-900` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Clear all label | `--color-fg-link` ([button.md](button.md)) | `--palette-stone-950` | `--palette-stone-100` |
| Page | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Label and × on the tint |
| `--color-fg-accent` | `--color-accent-subtle-hover` | 4.5:1 | × on a hovered remove button |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Chip edge on the page |
| `--color-focus-ring` | `--color-accent-subtle` | 3:1 | Focus ring on a remove button over the tint |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on Clear all |
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Clear all |

Forced colours: the chip opts out of forced-colour adjustment, and the filter
chip's edge takes `Highlight`, so "on" survives the loss of the accent colour
(`components.css`).

## Responsive behaviour

- The row sits at the top of the results column at every width, under the
  result count and sort, above the cards (the application's `.browse__head`).
- Below 48rem every chip is at least 44 px tall and each remove button 44 × 44 px
  (L2-065.3); from 48rem chips are 36 px with 24 px remove buttons and 8 px
  between targets (L2-065.2).
- The row wraps, "Clear all" wraps with the chips, and nothing scrolls sideways.
  A chip label stays on one line unless it is wider than the whole row, which
  no ShotThere label is at 320 px ("Parking: on-site", "No permit needed").
- At 200 % zoom every chip and remove button stays visible and operable.

## Accessibility

### Role and pattern

A plain row: a visually hidden lead-in, then each chip as static text holding a
native remove `<button>` ([APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)),
then the Clear all button. The chip itself has no role and is not focusable.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Each remove button is one tab stop, in chip order, then "Clear all". |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | On a remove button: emits `filterRemoved`. On Clear all: emits `cleared`. |

### Focus

- The component never moves focus. Chips are tracked by `key`, so when one
  chip goes, every other remove button is the same DOM element and keeps focus
  if it had it.
- After `filterRemoved`, the application moves focus once the new `filters`
  have rendered: to the remove button now at the removed chip's position (the
  next chip), else to the results heading ("Results", `tabindex="-1"`), as
  ICD-002 fixes (D-6). It finds the button by the public DOM contract
  (`.chip--filter .remove`, ICD-DOM-3).
- After `cleared`, the row disappears; the application moves focus to the
  results heading (D-6).
- The shared 2 px ring draws round the small remove button, offset onto the tint.

### Labelling

- The row is introduced once by the hidden lead-in "Active filters:".
- Each remove button's name is "Remove filter: " plus the chip's full label:
  "Remove filter: Up to $150.00". The × is `aria-hidden`.
- Clear all is named by its text, "Clear all".

### Announcements

None from the component. Removing or clearing changes the URL; the list
reloads and [`st-result-count`](filter.md) announces "5 studios, sorted by
all-in cost" (L2-069.3).

### Motion

Only the remove button's fill transitions, over `--duration-fast`, which the
tokens set to 0 under `prefers-reduced-motion: reduce`. A removed chip
disappears at once; the row reflows without animation.

## Content and internationalisation

- The filter as the visitor set it, sentence case: "Natural light", "Cyc wall",
  "Family", "No permit needed".
- A range names its bound with the full price: "Up to $150.00"; with both bounds
  "$90.00 to $150.00"; prices CAD with cents, formatted by the application.
- A choice from a named group keeps the group: "Parking: on-site". A
  neighbourhood is just its name: "Leslieville".
- The remove name is always "Remove filter: " plus the chip's label.
- "Clear all" ends the row; the empty state's action is "Clear filters" (L2-022.4).
- Translatable: chip labels (application), and the three library strings, which
  the application can override (`label`, `removeLabel`, `clearLabel`). French
  ("Retirer le filtre : Lumière naturelle") is longer; only the hidden names and
  the chips grow, and the row wraps.

## Performance

- Change detection: `OnPush`, signal inputs; each chip's remove name is computed
  once per `filters` or `removeLabel` change in a `computed`, not in the template.
- `@for (filter of filters(); track filter.key)` (ICD-PERF-2).
- Imports `@angular/core`, `$localize`, and the library's `ButtonComponent` and
  `IconComponent`.
- Performance scenario: the `components-harness` route `chip/performance`
  renders the studios no-results row ("Up to $120.00", "Cyc wall", "Parking:
  on-site", Clear all); removing a chip and re-rendering the row without it is
  held to the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the row is server-rendered with the page's filters; it only
  changes in response to the visitor's own action.

## Acceptance criteria

### Rendering

- **AC-1** Given `filters` "Up to $150.00" and "Natural light" on the filtered studio list, when the row renders, then the host has the class `active-filters`, starts with a visually hidden "Active filters:", holds two `span.chip.chip--filter` with those labels, each with a `button.remove` named "Remove filter: Up to $150.00" and "Remove filter: Natural light", and ends with a `button.btn.btn--link.btn--sm` "Clear all". (L2-022)
- **AC-2** Given the spot list filtered to "Family" and "No permit needed", when the row renders, then it shows those two chips in that order and "Clear all". (L2-024)
- **AC-3** Given `filters` is empty, when the component renders, then the page has no `.active-filters` element, no chip and no "Clear all", and the host is hidden. (L2-022)
- **AC-4** Given the studio list filtered to "Up to $120.00", "Cyc wall" and "Parking: on-site" with 0 studios, when the page renders, then the three chips and "Clear all" stay above the "No studios match these filters" empty state. (L2-022)

### Behaviour

- **AC-5** Given the two studio chips, when the visitor activates "Remove filter: Natural light", then `filterRemoved` emits `{ key: 'light', label: 'Natural light' }` exactly once, and the chip stays until the application passes `filters` without it, after which only "Up to $150.00" remains. (L2-022)
- **AC-6** Given the three no-results chips, when the visitor activates "Clear all", then `cleared` emits exactly once with no payload and `filterRemoved` is not emitted. (L2-022)

### Keyboard and focus

- **AC-7** Given the two studio chips, when a keyboard user tabs through the row, then focus visits "Remove filter: Up to $150.00", "Remove filter: Natural light" and "Clear all" in that order, never a chip itself, and Enter or Space on a remove button emits `filterRemoved`. (L2-067)
- **AC-8** Given focus on "Remove filter: Natural light", when the application removes "Up to $150.00" from `filters`, then the focused element is still the "Remove filter: Natural light" button. (L2-067)
- **AC-9** Given a remove button focused by keyboard, when the ring is measured, then it is 2 px of `--color-focus-ring` with at least 3:1 contrast against the `--color-accent-subtle` tint, and no ring shows when the button is clicked with a mouse. (L2-067)

### Screen readers

- **AC-10** Given the filtered studio and spot lists in light and dark, when axe-core scans them, then no violation involves the row, every remove button has a unique name naming its filter, and the × icons are hidden from the accessibility tree. (L2-069)
- **AC-11** Given a screen reader reading the filtered studio list, when it reaches the row, then it hears "Active filters:" once before the chips, and the component itself adds no live region. (L2-069)
- **AC-12** Given `label="Filtres actifs :"`, `removeLabel="Retirer le filtre : {$label}"` and `clearLabel="Tout effacer"`, when the row renders "Lumière naturelle", then the lead-in, the remove name "Retirer le filtre : Lumière naturelle" and the button text use those strings and no English default appears. (L2-070)

### Theming

- **AC-13** Given the chips on the page in light and dark, when the contrast check runs, then the label and × are at least 4.5:1 on `--color-accent-subtle` and on a hovered remove button's `--color-accent-subtle-hover`, and the chip edge is at least 3:1 against the page. (L2-068)

### Responsive

- **AC-14** Given the filtered studio list at 360 px wide, when the chips are measured, then each chip is at least 44 px tall and each remove button at least 44 × 44 CSS px. (L2-065)
- **AC-15** Given the filtered studio list at 1280 px wide, when the chips are measured, then each chip is 36 px tall, each remove button 24 × 24 CSS px, and adjacent targets are at least 8 px apart. (L2-065)
- **AC-16** Given the studios no-results row at 320 px wide, when it renders, then the chips and "Clear all" wrap onto further lines, no chip is clipped, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-17** Given the filtered spot list at 200 % zoom in a 1280 px viewport, when the visitor reaches the row, then both chips, their remove buttons and "Clear all" are visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the remove button's fill change takes 0 ms, and
a removed chip disappears without animation at any setting
([chip.html](../../design-system/components/chip.html), Accessibility › Motion).

### Performance

- **AC-18** Given the `chip/performance` harness route with the three no-results chips, when "Remove filter: Cyc wall" is activated and the row re-renders without it, then interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/active-filters/`:
  `active-filters.component.ts` (`ActiveFiltersComponent`, selector
  `st-active-filters`), `active-filters.component.html`,
  `active-filters.component.css` (port of `.active-filters`, the `.chip` base
  layout, `.chip--filter`, `.chip .remove`, `.chip--filter .remove` and their
  hover rules, the below-48rem target rules and the forced-colours rules, written
  against `:host` and the inner classes). `ActiveFilter` in
  `src/lib/types/active-filter.ts`.
- Host bindings: `[class.active-filters]` and `[attr.hidden]` from one `computed`
  of `filters().length`.
- Strings: three `$localize` strings with the custom IDs `@@st.activeFilters.label`,
  `@@st.activeFilters.remove` and `@@st.activeFilters.clear`; each is the default
  of its input, and the remove name is the `removeLabel` value with `{$label}`
  replaced by the chip's label.
- Composes `button[st-button]` (`variant="link" size="sm" type="button"`) and
  `st-icon name="close" size="sm"`.
- Not ported: `button.chip[aria-pressed]`, `span.chip`/`a.chip` hover rules, `.chip[aria-current]`,
  `.chip[aria-selected]` and `.chip:disabled` (D-1).
- Mock drift corrected: the inline `margin-bottom` on the row (the application's
  layout spaces it), Clear all as a link (D-5), and Clear all missing from the
  no-results rows (D-3).

## Decisions

- **D-1** *The design-system page also shows toggle chips (`button.chip[aria-pressed]`) and static and link chips. Are they built?* No. Every mock in `docs/mocks/` uses only the filter chip inside `.active-filters` (four screens, nine chips), the design system itself says "no ShotThere mock uses them yet", and ICD-002 lists `st-active-filters` as the only chip component. Building them would add API nobody uses (AGENTS.md scope lock). If a screen needs one later it starts upstream: mock, design system, ICD, then this CRD.
- **D-2** *What does an empty row render?* Nothing visible: the host has no children, no `.active-filters` class, and `hidden`, so a margin the application puts on the host does not leave a gap. ICD-002 says "renders nothing when empty".
- **D-3** *The chip design-system page drops "Clear all" from the no-results row (the empty state offers "Clear filters"); the filter design-system page says the row keeps "Clear all" whenever it shows; the mocks omit it in no-results.* The row always ends with "Clear all". ICD-002 gives the component no input to hide it, the filter page is the later and more specific rule, and keeping the row identical in every state keeps it predictable. Both labels stay, as the content rules describe. This is a design conflict, reported to the owner.
- **D-4** *How does an override of `removeLabel` carry the chip's label?* The override is a string containing `{$label}`, the placeholder shown in ICD-002 §12, and the component replaces it per chip. ICD-002 types the input as `string`, so a function is not available, and the placeholder keeps the catalogue string and the override in the same form.
- **D-5** *Clear all is `<a href>` in the mocks and the chip page's code but a `button` on the filter page.* A `button[st-button] variant="link"`: ICD-002 gives the component a `cleared` output, so it acts in place and the application updates the URL; the link look is kept. Without JavaScript the filter column's "Apply filters" form still works.
- **D-6** *Where does focus go after the last chip is removed or after Clear all?* The design-system pages disagree: the filter page says the Filters trigger below LG or the first filter group from LG; the chip page says "Clear all", then the results heading. ICD-002 fixes "next chip, else the results heading" for removal; the CRD follows it, and uses the results heading after Clear all too, so one target works at every breakpoint and the visitor lands where the new count is read. Reported to the owner as a conflict between the two design-system pages.
