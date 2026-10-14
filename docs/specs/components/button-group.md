# Button group

| Field | Value |
|---|---|
| Selector | `st-segmented` |
| Library path | `frontend/projects/components/src/lib/segmented/` |
| Status | planned |
| Traces to | L2-027, L2-029, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`button-group.html`](../../design-system/components/button-group.html) |
| Source mocks | [`pages/map/default`](../../mocks/pages/map/default.html), [`pages/map/list`](../../mocks/pages/map/list.html), [`pages/map/studios-only`](../../mocks/pages/map/studios-only.html), [`pages/map/loading`](../../mocks/pages/map/loading.html), [`pages/map/empty`](../../mocks/pages/map/empty.html), [`pages/map/error`](../../mocks/pages/map/error.html), [`pages/map/tiles-failed`](../../mocks/pages/map/tiles-failed.html), [`dialogs/map-popup/default`](../../mocks/dialogs/map-popup/default.html), [`dialogs/map-popup/spot`](../../mocks/dialogs/map-popup/spot.html) |
| Rendering | [`button-group.html`](button-group.html) |

## Purpose and scope

The segmented control is a short row of toggle buttons where exactly one is on.
It changes what the current page shows, instantly. On ShotThere it is the map
bar's "Show" control (Both, Studios, Spots), which filters the markers and the
list by type (L2-027.2), and its phone "View as" control (Map, List), which swaps
the map and the list below 62rem (L2-029). It is drawn as a quiet wrapping row of
words: muted at rest, accent and semibold when pressed.

Use a [`st-select`](select.md) for sort ("Sort by", three long options), the
checkboxes and radios in the filter panel for filters ([`checkbox`](checkbox.md), [`radio-group`](radio-group.md)), and a
[`button[st-button]`](button.md) toggle for a single on/off action such as "Add
to compare".

Out of scope:

- What each option does (filtering markers, hiding the map), the URL state and
  which option is pressed on first load: the application's. It passes `value`
  ("both", "map") and reacts to `valueChange`.
- The bar's polite count ("12 locations", "7 locations", "Loading locations…"):
  the map page's status element, not the control.
- Hiding "View as" from 62rem and the group's margin inside the map bar: the
  application's placement on the host (D-4).

## Usage

Every `.segmented` in `docs/mocks/` (grep of `class="segmented`; nine mocks, two
groups each), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/map/default`, `list`, `loading`, `empty`, `error`, `tiles-failed`; `dialogs/map-popup/default`, `spot` | `label` "Show", options Both / Studios / Spots (`both`, `studios`, `spots`) | — | "Both" pressed; usable while loading, empty and failed | canvas (`.map-page__bar`) |
| `pages/map/studios-only` | same group | — | "Studios" pressed; count "7 locations" | canvas |
| Every map mock above, below 62rem | `label` "View as", options Map / List (`map`, `list`); host also carries the application's `until-lg` and its bar class | — | "Map" pressed (`default`), "List" pressed (`list`); hidden from 62rem | canvas |

Every row is buildable with the API below: `label`, `options` and `value` are the
whole API; placement and visibility are global utilities or application feature
classes on the host (ICD-DOM-5).

## Anatomy

1. **Group** — the host element `st-segmented`, carrying `.segmented`,
   `role="group"` and `aria-label` from `label`. A wrapping flex row with
   `--space-5` between items.
2. **Item** — one native `<button type="button">` per option, borderless, muted
   body text, at least 44 px tall (`--target-comfortable`), `aria-pressed`, and
   `data-text` repeating the label so its semibold width is reserved.
3. **Pressed item** — `aria-pressed="true"`: `--color-fg-accent` and
   `--font-weight-semibold`, so the state does not rely on colour alone. Exactly
   one per group while `value` matches an option.

Host: `st-segmented` is the group itself (ICD-DOM-1): the host carries the block
class, role and label, and its children are the buttons. No wrapper element.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The group's `aria-label`: what is being chosen ("Show", "View as"). Product copy, marked `i18n-label`. |
| `options` | `readonly SegmentedOption[]` | — | yes | One button per option, in order, tracked by `value`. `label` is the button text and `data-text`; `value` is never shown. Two or three options of one word. |

### Model

| Model | Type | Default | Rule |
|---|---|---|---|
| `value` | `string` | `''` | The pressed option's `value`. The button whose option matches renders `aria-pressed="true"`, every other `aria-pressed="false"`. When the user presses an unpressed item the component sets `value` and emits `valueChange` with that option's `value`, once. Pressing the pressed item does nothing and emits nothing. Setting `value` from the application emits nothing. Not a form control (ICD-002). |

Inputs are signal inputs; `value` is a `model()`, so `[(value)]` works.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `valueChange` | `string`, the newly pressed option's `value` | The user pressed an unpressed item (from `model()`). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Items come from `options`; the component renders every word it shows from them. |

The control has no library strings (ICD §12).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Segmented | `.segmented` | Two or three short, mutually exclusive options that change the current view at once: "Show" and "View as" on the map. |

The DS also styles `aria-current="page"` link items and disabled items in a
segmented row; ShotThere uses neither and the ICD's `SegmentedOption` has no link
or disabled field, so the component renders only buttons (D-2, D-3).

| Size | Modifier | Type | Height | Gap |
|---|---|---|---|---|
| One size | — | `--text-body` | `--target-comfortable` (44 px) | `--space-5` between items; `--space-2` between wrapped rows below 48rem |

Width is the words'. The size does not change by breakpoint.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (not pressed) | `aria-pressed="false"` | `--color-fg-muted`, regular weight | "Studios, toggle button, not pressed" |
| Hover | `:hover` | `--color-fg-default` | — |
| Focus | `:focus-visible` | `--focus-ring-width` ring in `--color-focus-ring`, offset `--focus-ring-offset`, round the word | Focus on the item |
| Active | `:active` | As hover until the view updates | — |
| Pressed | `aria-pressed="true"` | `--color-fg-accent`, `--font-weight-semibold`; underlined in forced colours | "Both, toggle button, pressed" |
| Pressed, pressed again | press on the pressed item | Unchanged | Unchanged; no `valueChange` |
| No match | `value` matches no option (`''` before the application sets it) | Every item not pressed | Every item "not pressed" |
| Page loading, empty or failed | the map list's `aria-busy`, empty or error state | Unchanged: the control stays usable | Unchanged |

Loading is not a state of the control (DS button group, States). Disabled items
do not exist (D-3).

## Markup

```html
<!-- rendered: "Show", Both pressed (host element name is not part of the contract) -->
<st-segmented class="segmented" role="group" aria-label="Show">
  <button type="button" aria-pressed="true" data-text="Both">Both</button>
  <button type="button" aria-pressed="false" data-text="Studios">Studios</button>
  <button type="button" aria-pressed="false" data-text="Spots">Spots</button>
</st-segmented>
```

```html
<!-- rendered: "View as", List pressed, with the application's placement classes on the host -->
<st-segmented class="map-page__toggle until-lg segmented" role="group" aria-label="View as">
  <button type="button" aria-pressed="false" data-text="Map">Map</button>
  <button type="button" aria-pressed="true" data-text="List">List</button>
</st-segmented>
```

The page objects locate the group by `role="group"` and its name, and the items by
role button and name with `aria-pressed`; `st-segmented` and Angular's
`_ngcontent-*` attributes are not part of the contract (ICD-DOM-3).

```html
<!-- consumer: the map bar -->
<div class="map-page__bar">
  <h1 i18n>Map</h1>
  <st-segmented class="map-page__show" i18n-label label="Show" [options]="typeOptions" [(value)]="type" />
  <st-segmented class="map-page__toggle until-lg" i18n-label label="View as" [options]="viewOptions" [(value)]="view" />
  <p class="visually-hidden" role="status">{{ countText() }}</p>
</div>
```

```ts
// consumer: options built in TypeScript beside the page, labels translated with $localize
readonly typeOptions: readonly SegmentedOption[] = [
  { value: 'both', label: $localize`Both` },
  { value: 'studios', label: $localize`Studios` },
  { value: 'spots', label: $localize`Spots` },
];
```

## Design

- Group: `display: flex`, `flex-wrap: wrap`, column gap `--space-5`, row gap 0
  (`--space-2` below 48rem), `margin-bottom` `--space-4` (the application zeroes
  it in the map bar, D-4).
- Item: `--text-body`, `--color-fg-muted`, no background, no border, no padding,
  `min-height` `--target-comfortable`, `inline-flex`, centred, `gap` `--space-1`.
- Pressed: `--color-fg-accent`, `--font-weight-semibold`.
- Reserved width: each item is an inline grid whose hidden second row holds
  `attr(data-text)` in `--font-weight-semibold`, so pressing "Studios" never
  nudges "Spots" (design-system rule; DS button group, Do and don't).
- Focus ring: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset`.
- Motion: only `color` transitions, over `--duration-fast` with `--ease-standard`.
- No elevation, no layer, no component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Item at rest | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Item on hover | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Pressed item | `--color-fg-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Map bar surface | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Item at rest |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Item on hover |
| `--color-fg-accent` | `--color-bg-canvas` | 4.5:1 | Pressed item |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

Pressed is carried by weight as well as colour. Forced colours: the pressed item
is underlined (DS button-group D-8), so the state survives the loss of colour.

## Responsive behaviour

- The row wraps and never scrolls sideways; below 48rem wrapped lines sit
  `--space-2` apart.
- Below 62rem the map bar holds the title, "Show" and "View as" and wraps, so at
  320 and 360 px "View as" drops to a second row (the bar is the application's
  layout).
- From 62rem the application hides "View as" with the global `.until-lg` utility
  on its host, because list and map sit side by side (L2-029.3); "Show" stays.
- Every item is at least 44 px tall at every width (L2-065.3), with 20 px between
  neighbouring words. At 320 px and at 200 % zoom nothing scrolls horizontally.
- In landscape at SM the bar stays one or two rows high, so the groups stay
  usable above the map (L2-066.2).

## Accessibility

### Role and pattern

`role="group"` with an `aria-label`, holding native toggle buttons with
`aria-pressed` ([APG Button, toggle](https://www.w3.org/WAI/ARIA/apg/patterns/button/)).
Each button is its own tab stop, which suits two or three items better than a
radio group's arrow keys (DS button group, Accessibility; D-1).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves between items, then on to the next group or the list. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Presses the item; the one that was pressed is released. Focus stays on the item. |
| Arrow keys | No effect (D-1). |

### Focus

The shared ring draws round the word. Pressing never moves focus: switching
"View as" to "List" hides the map but leaves focus on "List".

### Labelling

- The group's name is `label` ("Show", "View as"); each button's text is its name,
  and screen readers add "pressed" or "not pressed".
- No counts in the items; the result is announced by the bar's status ("7
  locations"), not by the control.

### Announcements

None. The component has no live region; the map page's status element announces
the result of a change.

### Motion

Only the text colour transitions, over `--duration-fast`, which the tokens set to
0 under `prefers-reduced-motion: reduce`. The view change itself is instant.

## Content and internationalisation

- One word per item, sentence case, the noun the page uses: "Both", "Studios",
  "Spots", "Map", "List".
- The group label is short and reads before every item: "Show", "View as".
- Broadest option first and pressed by default: "Both" before "Studios" and
  "Spots"; "Map" before "List" (the application sets `value`).
- Translatable content: `label` and every option's `label` (the application uses
  `i18n-label` and `$localize`). `value` is a machine key and is never translated.
- Longer translations wrap the row; the reserved width follows the translated word
  because `data-text` repeats it.

## Performance

- Change detection: `OnPush`, signal inputs and `model()`; each item's pressed
  state comes from a `computed` comparison with `value`, and the `@for` tracks
  `option.value` (ICD-PERF-2), so a new `options` array with the same values
  keeps the buttons and their focus.
- Performance scenario: the `components-harness` route `button-group/performance`
  renders the map bar's "Show" (Both pressed) and "View as" (Map pressed) groups;
  pressing "Studios" must stay within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: `data-text` reserves the semibold width, so pressing an item
  moves nothing.
- Weight: imports `@angular/core` only.

## Acceptance criteria

### Rendering

- **AC-1** Given `st-segmented` with `label` "Show", options Both, Studios and Spots and `value` "both", when the map page renders, then the group has the class `segmented`, `role="group"` and the name "Show", and holds three `button type="button"` elements named "Both", "Studios" and "Spots", each with `data-text` equal to its name, "Both" with `aria-pressed="true"` and the others `aria-pressed="false"`. (L2-027)
- **AC-2** Given `st-segmented` with `label` "View as", options Map and List and `value` "map", when the map page renders at 360 px, then "Map" has `aria-pressed="true"` and "List" `aria-pressed="false"`. (L2-029)

### States

- **AC-3** Given "Show" with "Both" pressed, when the visitor presses "Studios", then "Studios" has `aria-pressed="true"` in `--color-fg-accent` and semibold, "Both" and "Spots" have `aria-pressed="false"`, and `valueChange` is emitted once with "studios". (L2-027)
- **AC-4** Given "Show" with "Studios" pressed, when the visitor presses "Studios" again, then it stays pressed, no item changes and `valueChange` is not emitted. (L2-027)
- **AC-5** Given "View as" with "Map" pressed at 360 px, when the visitor presses "List", then "List" is pressed, `valueChange` is emitted with "list", and focus stays on "List". (L2-029)
- **AC-6** Given the application sets `value` to "studios" (the map opened with only studios showing), when the control renders, then "Studios" is pressed and `valueChange` is not emitted. (L2-027)

### Keyboard and focus

- **AC-7** Given the map bar at 360 px, when a keyboard user tabs from the title onwards, then focus visits "Both", "Studios", "Spots", "Map" and "List" in that order, each with a `--focus-ring-width` (2 px) ring in `--color-focus-ring` of at least 3:1, and Space or Enter on "Spots" presses it. (L2-067)

### Screen readers

- **AC-8** Given the map page in light and dark, when a screen reader reaches "Both" and axe-core scans the bar, then the group is announced as "Show, group", the item as "Both, toggle button, pressed", and no violation is reported. (L2-069)

### Theming

- **AC-9** Given both groups in the light and the dark theme, when the contrast check runs, then items at rest (`--color-fg-muted`), on hover (`--color-fg-default`) and pressed (`--color-fg-accent`) are each at least 4.5:1 against the map bar. (L2-068)

### Responsive

- **AC-10** Given the map bar at 360 px, when every item is measured, then each is at least 44 CSS px tall. (L2-065)
- **AC-11** Given the map bar at 320 px, when it renders with both groups, then the title and the groups wrap onto as many rows as they need, every item stays whole and on screen, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-12** Given the map page at 1280 px, when it renders, then "Show" is visible and "View as" is not displayed, because its host carries `.until-lg`. (L2-029)
- **AC-13** Given the map page in landscape at 640 × 360 px, when it renders, then both groups are visible and operable above the map and the header takes no more than 25 % of the viewport height. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the colour change takes 0 ms
([button-group.html](../../design-system/components/button-group.html), Accessibility › Motion).

### Performance

- **AC-14** Given the `button-group/performance` harness route, when "Studios" is pressed, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/segmented/`:
  `segmented.component.ts` (`SegmentedControlComponent`, selector
  `st-segmented`), `segmented.component.html` (an `@for` over `options()` tracked
  by `option.value`, each a `<button type="button">` with `[attr.aria-pressed]`
  and `[attr.data-text]`), `segmented.component.css` (port of the `.segmented`
  rules from `components.css` written against `:host` and `button`, including the
  `data-text` grid, the 48rem row gap and the forced-colours underline).
  `SegmentedOption` in `src/lib/types/segmented-option.ts`.
- Host bindings: `class: 'segmented'`, `role: 'group'`, `[attr.aria-label]` from
  `label`.
- Press handler: `if (option.value !== value()) value.set(option.value)`.
- Not ported: the DS link-item (`aria-current`) and `button:disabled` rules,
  which no option can produce (D-2, D-3); `[data-state]` hooks (ICD-DOM-2).
- Application side (map page, not this library): the mocks' `.map-page__bar
  .segmented { margin: 0 }` targets a library class, which ICD-DOM-5 forbids; the
  map page sets the margin through its own class on the host, and hides "View as"
  with `.until-lg` (D-4).
- Mock drift: none of the nine map mocks set `data-text`; the component always
  renders it.

## Decisions

- **D-1** *Toggle buttons or a radio group with arrow keys?* Toggle buttons with `aria-pressed`, each its own tab stop, as the DS and every map mock draw them; for two or three items Tab is the expected key, and arrow keys do nothing.
- **D-2** *The DS styles link items with `aria-current="page"`.* Not supported: `SegmentedOption` has no link field and no ShotThere screen needs one. Adding it later is an additive ICD change.
- **D-3** *The DS has a disabled item look.* Not supported: `SegmentedOption` has no `disabled`, and the DS says a type with no locations stays enabled and leads to the map's empty state ("No locations yet.").
- **D-4** *The DS hides "View as" with `.map-page__toggle { display: none }` and zeroes the group margin with `.map-page__bar .segmented`.* The application hides it with the global `.until-lg` on the host (the same 62rem rule, and the utility the ICD names for per-breakpoint visibility) and sets the margin with its own class on the host. ICD-DOM-5 forbids application selectors on library classes and limits host styling to margin, placement and width.
- **D-5** *What does the control show before the application sets `value`?* No item pressed. Choosing a default is a page rule (ICD-API-10); the map page passes "both" and "map" on first load, so a real screen always has exactly one pressed.
