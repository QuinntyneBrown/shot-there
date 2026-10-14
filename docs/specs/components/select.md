# Select

| Field | Value |
|---|---|
| Selector | `st-select` |
| Library path | `frontend/projects/components/src/lib/select/` |
| Status | planned |
| Traces to | L2-022, L2-023, L2-025, L2-054, L2-055, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`select.html`](../../design-system/components/select.html), [`form-field.html`](../../design-system/components/form-field.html) |
| Source mocks | [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studios/filtered`](../../mocks/pages/studios/filtered.html), [`dialogs/studio-filters/default`](../../mocks/dialogs/studio-filters/default.html), [`dialogs/studio-filters/selected`](../../mocks/dialogs/studio-filters/selected.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/new`](../../mocks/pages/spot-editor/new.html), [`pages/spot-editor/invalid`](../../mocks/pages/spot-editor/invalid.html) |
| Rendering | [`select.html`](select.html) |

## Purpose and scope

The select takes one answer from a short, fixed list through the platform's own
picker: how to sort the studios, the minimum usable space in the filters, which
way a studio's windows face, how strong the morning light is, whether a fee is
mandatory, a spot's type, the permit status for each shoot type, weekday and
weekend crowds. It is a complete form field around a native `<select>`: label,
optional marker, the select with a CSS chevron, one error, and help.

Use [`st-radio-group`](radio-group.md) when the options must be compared at a
glance or there are only two or three (parking in the filters, the
disclosure), [`st-checkbox`](checkbox.md) for a yes-or-no fact, and
[`st-search-field`](combobox.md) to type and find one of many. The label,
optional marker, help, error and their ID wiring are the shared field contract
in [`form-field.md`](form-field.md); this CRD specifies what the select adds.

Out of scope:

- The option list, its order, its words and which empty option a screen
  offers ("Any size", "No windows", "Not set"): the application's, as data.
- Reloading the list when the sort changes, and announcing "5 studios, sorted
  by all-in cost": the application and [`st-result-count`](filter.md).
- Reading and writing the URL (L2-025) and ignoring unknown values: the
  application maps the URL to the form value before it reaches the select.
- Grouping several selects under one question ("Natural light", "Permit needed
  for") and laying them out in rows: the application's fieldset and layout.
- The open list: drawn by the platform, never styled.

## Usage

Every `select.select` in `docs/mocks/` (196 in all), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studios/*` results head | `inline`, `name="sort"` | "Sort by"; "Most recent review", "All-in cost, low to high", "Overall score, high to low" | default "Most recent review", "All-in cost, low to high" chosen (`filtered`) | canvas |
| `dialogs/studio-filters/*` top of the sheet | full-width form select, same options | "Sort by" | default, chosen | sheet |
| `dialogs/studio-filters/*`, `pages/studios/*` sidebar, "Space and light" group | filter select, `name="space"` | "Minimum usable space"; "Any size" (`''`), "20 m² or more", "30 m² or more", "50 m² or more" | "Any size", "30 m² or more" | sheet, sidebar (projected into the [`st-checkbox-group`](checkbox.md) filter group) |
| `pages/studio-editor/*` basics and specifications | form select | "Window direction" (No windows, North, East, South, West), "Cyc wall", "Load-in" (Stairs, Elevator, Freight elevator, Ground level), "Parking" (On-site, Street, None) | default, empty "Not set" on `new` | surface (editor section) |
| `pages/studio-editor/*` "Natural light" fieldset | four form selects | "Morning", "Midday", "Afternoon", "Evening": None, Low, Medium, Strong | Medium/Strong/Strong/Low; "Not set" on `new` | surface |
| `pages/spot-editor/*` "Time of day" fieldset | five form selects | "Morning" … "Blue hour" | chosen; "Choose a rating" on `new` | surface |
| `pages/spot-editor/*` "Permit needed for" fieldset | four form selects | "Portrait", "Wedding or engagement", "Commercial", "Video": Not required, Required | chosen; "Choose" on `new` | surface |
| `pages/spot-editor/*` basics and conditions | form select | "Type" (Park, Architecture, Waterfront, Indoor public), "Weekday crowds", "Weekend crowds" (Low, Medium, High) | chosen; "Choose a type" on `new` | surface |
| `pages/studio-editor/*` fee rows | form select in `.fee-row` | "Type": Mandatory, Optional | "Mandatory" | fee row (sunken) |
| `pages/studio-editor/*` included and extra rows | form select in `.fee-row` | "Category": Lights, Modifiers, Stands, Other | chosen | fee row (sunken) |
| DS states (no mock) | form select | "Type" with error "Choose a type" (a tampered value refused, L2-055.3) | invalid, disabled | surface |

Every row is buildable with the API below: options are data (`SelectOption`
with a stable `value` key), `inline` gives the sort's layout, and the shared
inputs give label, help, error and the optional marker. No row needs a size
other than medium.

## Anatomy

1. **Field** — the host `st-select` carries `.field` (ICD-DOM-1), plus
   `.field--inline` when `inline`.
2. **Label** — `label.field__label[for]`; `span.optional` when `optional`.
3. **Select** — native `select.select`: the text-field look (44 px,
   `--radius-md`, 1 px `--field-border`, `--text-body`), `appearance: none`,
   end padding `--space-10` for the chevron.
4. **Options** — one native `<option value>` per `SelectOption`, in input
   order, `disabled` when the option is.
5. **Chevron** — two CSS gradients in `currentColor` on the select's
   background, centred `--space-3` from the end. Decorative; not a DOM node.
6. **Error**, then **Help** — `span.field__error`, `span.field__help`
   ([form-field.md](form-field.md)).

Host: `st-select` is the `.field` box; the `<select>` is inner, so every
attribute it needs is an input.

## API

### Inputs

Shared inputs (ICD-002 §9.2), specified in [form-field.md](form-field.md):
`label` (required), `inputId`, `name`, `help`, `error`, `optional`,
`optionalLabel`, and the additive `warning` and `labelSuffix` (ICD-002 1.1.0,
form-field.md D-1, D-2); rendered as the label, the select's `id` and `name`,
`.field__help`, `.field__error` with `aria-invalid`, `.field__warning`, and
`span.optional`.

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `options` | `readonly SelectOption[]` | — | yes | One `<option>` each, in order, tracked by `value`. `value` is a stable key ("freight-elevator"); `label` is the visible text; `disabled` renders native `disabled` on that option. Values are unique within a list (D-3). An empty option ("Any size", "No windows", "Not set") is the application's, with value `''`. |
| `size` | `ControlSize` | `'md'` | no | Accepted; the select has one size (44 px) and adds no class (D-4). |
| `inline` | `boolean` | `false` | no | `.field--inline`: "Sort by" beside the select, which keeps its natural width. Never with an error. |

`inline` uses `booleanAttribute`.

Forms (ICD-FORM-1 to 4): `ControlValueAccessor` with value type `string`.
`writeValue(v)` selects the option whose `value` equals `v` (`null` is treated
as `''`); when none matches, no option is selected (`selectedIndex` −1, D-2).
The value is reported on `change`; the control is marked touched on `blur`.
`setDisabledState(true)` sets native `disabled` on the select. When `options`
changes, the current value is re-applied.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The chosen value reaches the application through the forms API (`valueChanges`). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Options are data; every word is an input (ICD-I18N-2). |

Library strings: only `st.field.optional` "(optional)" through
`optionalLabel` (ICD-002 §12).

## Variants and sizes

| Variant | How | Use for |
|---|---|---|
| Form select | default | Editor facts from a fixed set: window direction, light per time of day, cyc wall, load-in, parking, type, permit, crowds. Full width of its column. |
| Set of selects | several form selects inside the application's `<fieldset>` | "Natural light" (four times of day), "Time of day" (five), "Permit needed for" (four). Each keeps its own short label. |
| Filter select | form select, first option `''` | "Minimum usable space" with "Any size" meaning no filter; sits in the "Space and light" filter group. |
| Inline sort | `inline` | "Sort by" above the studio list; full width again inside the filters sheet. |
| Fee row | form select inside `.fee-row` | "Type" (Mandatory, Optional) and "Category"; stacks on phones, one row wider. |

| Size | Class | Height | Text |
|---|---|---|---|
| One size | — | `--control-height-md` (44 px) | `--text-body` (16 px) |

Width: 100 % of the field's column; inline, the width of the longest option
("Overall score, high to low").

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--field-bg` fill, `--field-border` edge, value and chevron in `--field-fg` | combobox with the label as name, chosen option as value |
| Hover | `:hover` | Edge `--color-fg-muted` | — |
| Focus | `:focus-visible` | 2 px `--color-focus-ring` ring flush with the edge (offset 0); edge takes the ring colour | Focus on the select |
| Open | platform picker | The platform's list (wheel, sheet or menu); follows the page's `color-scheme` | Platform listbox |
| Empty answer chosen | value `''` with an option `''` | "Any size", "No windows", "Not set" shown | That option's text is the value |
| No match | value matches no option | Blank select (D-2) | No value |
| Invalid | `error` non-empty | `aria-invalid="true"`; `--color-danger-solid` edge doubled by a 1 px inset shadow; `.field__error` under it | "invalid entry"; error then help in the description |
| Disabled | forms API | Native `disabled`; `--color-bg-subtle` fill, `--color-fg-disabled` text and chevron, `--color-border-default` edge | Removed from the tab order |
| Disabled option | `SelectOption.disabled` | Platform greys it in the list | Not selectable |
| On a fee row | inside `.fee-row` | Unchanged: white field on the sunken row; edge keeps 3:1 | — |
| In the filters sheet | inside `st-sheet` | Unchanged; edge keeps 3:1 on `--color-bg-surface-raised` | — |

A filter and a sort are never invalid or disabled (DS states matrix).

## Markup

```html
<!-- rendered: form select (studio editor) -->
<st-select class="field">
  <label class="field__label" for="windowDirection">Window direction</label>
  <select class="select" id="windowDirection" name="windowDirection">
    <option value="">No windows</option>
    <option value="north">North</option>
    <option value="east">East</option>
    <option value="south">South</option>
    <option value="west">West</option>
  </select>
</st-select>
```

```html
<!-- rendered: inline sort (studio list) -->
<st-select class="field field--inline">
  <label class="field__label" for="sort">Sort by</label>
  <select class="select" id="sort" name="sort">
    <option value="recent">Most recent review</option>
    <option value="cost">All-in cost, low to high</option>
    <option value="score">Overall score, high to low</option>
  </select>
</st-select>
```

```html
<!-- rendered: invalid (spot editor, tampered type refused) -->
<st-select class="field">
  <label class="field__label" for="type">Type</label>
  <select class="select" id="type" name="type" aria-invalid="true" aria-describedby="type-error">
    <option value="">Choose a type</option>
    <option value="park">Park</option>
    <option value="architecture">Architecture</option>
    <option value="waterfront">Waterfront</option>
    <option value="indoor-public">Indoor public</option>
  </select>
  <span class="field__error" id="type-error">Choose a type</span>
</st-select>
```

The chosen option is set through the DOM `value` property, not a `selected`
attribute, so the rendered HTML may carry no `selected`; page objects read the
select's value. Disabled adds `disabled` to the `<select>`.

```html
<!-- consumer: sort above the studio list -->
<st-select [formControl]="sort" inputId="sort" name="sort" inline
           i18n-label label="Sort by" [options]="sortOptions" />

<!-- consumer: one of the four light selects inside the application's fieldset -->
<fieldset class="stack stack--sm">
  <legend i18n>Natural light</legend>
  <div class="field-row">
    <st-select formControlName="morning" inputId="light-morning" name="light.morning"
               i18n-label label="Morning" [options]="lightOptions" />
    …
  </div>
</fieldset>
```

```ts
// application, beside the page: options are data with stable keys, labels marked
readonly sortOptions: readonly SelectOption[] = [
  { value: 'recent', label: $localize`Most recent review` },
  { value: 'cost', label: $localize`All-in cost, low to high` },
  { value: 'score', label: $localize`Overall score, high to low` },
];
```

## Design

- Field and label as [form-field.md](form-field.md); inline: one wrapping row,
  `--space-2` apart, the select `width: auto`.
- Select: `width: 100%`, `min-height` `--control-height-md`, padding
  `--space-2` `--space-3` with end padding `--space-10`, `--text-body`,
  `--border-width-hairline` edge, `--radius-md`, `appearance: none`.
- Chevron: two `linear-gradient`s in `currentColor`, 5 px square, positioned
  `--space-3` and `--space-4` plus `--space-0-5` from the end, no repeat.
- Focus: `--focus-ring-width` outline in `--color-focus-ring`, offset 0.
- Invalid: `--color-danger-solid` edge plus an inset `--border-width-hairline`
  shadow.
- Motion: edge colour and shadow over `--duration-fast` with `--ease-standard`.

Component tokens (shared with `.input`, declared on `.select`):

| Token | Aliases | Overridden by |
|---|---|---|
| `--field-bg` | `--color-bg-surface` | disabled `--color-bg-subtle` |
| `--field-border` | `--color-border-strong` | hover `--color-fg-muted`; focus `--color-focus-ring`; invalid `--color-danger-solid`; disabled `--color-border-default` |
| `--field-fg` | `--color-fg-default` | disabled `--color-fg-disabled` (the chevron follows) |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Value and chevron | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Hover edge | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Focus edge and ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Invalid edge | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Disabled fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Disabled text and chevron | `--color-fg-disabled` | `--palette-stone-300` | `--palette-stone-700` |
| Disabled edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Value; chevron (needs 3:1) |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Edge on the page (sort) |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Edge in an editor section and the sidebar |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Edge in the filters sheet |
| `--color-border-strong` | `--color-bg-surface-sunken` | 3:1 | Edge on a fee row |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Field label on a fee row |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge |

Disabled selects are exempt (WCAG 1.4.3). Forced colours: the select keeps a
`CanvasText` hairline edge and opts out of forced-colour adjustment; the
chevron is drawn in `currentColor` and stays visible.

## Responsive behaviour

- Full width of its column at every width; pairs side by side and the light
  and permit rows (as many 9rem columns as fit: one per row on a phone, four
  across from about 40rem) are the application's layout.
- 44 px tall at every width, so the sort and the filter select meet the 44 px
  phone target (L2-065.3); the whole control opens the picker.
- Inline sort: keeps its natural width and wraps under "Sort by" on the
  narrowest phones; the longest option "Overall score, high to low" fits at
  320 px.
- Phones open the native picker (iOS wheel, Android sheet).
- At 320 px nothing scrolls horizontally; at 200 % zoom the select and its
  options stay usable.

## Accessibility

### Role and pattern

Native `<select>` (a combobox with a listbox popup in the accessibility tree)
with a sibling `<label for>`. Not a custom ARIA listbox: the native control
gives the phone picker, type-ahead and screen-reader support.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Into and out of the select; disabled selects are skipped. |
| <kbd>Space</kbd> / <kbd>Alt</kbd>+<kbd>Down</kbd> | Opens the list (native). |
| <kbd>Up</kbd> / <kbd>Down</kbd> | Moves through the options; on Windows also changes the value while closed (native). |
| A letter | Jumps to the next option starting with it: "S" for South, Stairs or Strong. |
| <kbd>Enter</kbd> / <kbd>Esc</kbd> | Chooses the highlighted option / closes without changing. |

### Focus

The ring sits flush on the edge, 2 px at 3:1 or more (L2-067.2). Choosing an
option never moves focus: after a sort change focus stays on "Sort by" while
the list updates below it.

### Labelling

- Name: the visible label, always, including the inline "Sort by" and each
  light select's "Morning"; the application's legend groups them ("Natural
  light, group").
- Value: the chosen option's text, so options are complete phrases that make
  sense alone ("All-in cost, low to high", "20 m² or more").
- Description: error, then help ([form-field.md](form-field.md)).
- The chevron is a background image and is not exposed.

### Announcements

None. A sort or filter change is announced by the page's
[`st-result-count`](filter.md) (L2-023.3, ICD-002 D-7).

### Motion

Edge colour transitions over `--duration-fast`, which reduced motion sets to
0. The open list's animation belongs to the platform.

## Content and internationalisation

- Options in sentence case, in a meaningful order: by strength (None, Low,
  Medium, Strong), by compass (North, East, South, West), by size (20, 30,
  50 m²), never alphabetical for its own sake.
- Sort options name the field and the direction: "All-in cost, low to high",
  "Overall score, high to low".
- An empty first option says what it means ("No windows", "Any size", "Not
  set"), never "Select…".
- Every option has a stable value key; the words can change without breaking
  saved studios or shared URLs.
- Translatable: `label`, `help`, `error`, `optionalLabel`, and each option's
  `label` (marked by the application with `$localize`). French option text runs
  about 30 % longer; the inline sort's natural width grows with it and still
  wraps under its label at 320 px.

## Performance

- Change detection: `OnPush`, signal inputs; options render with
  `@for (option of options(); track option.value)`; `aria-describedby` and
  `aria-invalid` come from `computed`s.
- Performance scenario: the `components-harness` route `select/performance`
  renders the studio list's "Sort by" and the studio editor's twelve selects
  for The Junction Loft (window direction North, morning Medium, midday Strong,
  afternoon Strong, evening Low, cyc wall Yes, load-in Freight elevator,
  parking Street, two fee types, two categories). Changing the sort must stay
  within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the select's height never changes between states; the
  error appears below without animation.
- Weight: `@angular/core` and `@angular/forms` accessor interfaces only.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-select inputId="windowDirection" label="Window direction">` with the options No windows (`''`), North, East, South, West, when it renders, then the host has the class `field` and contains `label.field__label[for="windowDirection"]` and `select.select#windowDirection` with five `<option>` elements whose `value`s are `''`, "north", "east", "south" and "west", and the select's accessible name is "Window direction". (L2-069)
- **AC-2** Given The Junction Loft in the studio editor with the "Load-in" control set to "freight-elevator", when the owner chooses "Stairs", then the select shows "Stairs" and the control's value is the string "stairs" after the `change` event. (L2-054)
- **AC-3** Given a fee row's "Type" select with the options Mandatory ("mandatory") and Optional ("optional"), when the owner adds a fee, then both options are offered with those keys and the control reports one of them, never the display words. (L2-054)
- **AC-4** Given the studio filters' "Minimum usable space" with the value `''`, when it renders, then "Any size" is shown, and choosing "30 m² or more" reports "30". (L2-022)
- **AC-5** Given the inline "Sort by" with `inline` true, when it renders, then the host has the classes `field field--inline`, the label and select share a row `--space-2` apart, and the select is as wide as "Overall score, high to low" rather than the full row. (L2-023)
- **AC-6** Given the studio list opened from the URL `/studios?sort=cost`, when the application writes "cost" to the sort control, then the select shows "All-in cost, low to high" without emitting a change. (L2-025)

### States

- **AC-7** Given the sort select focused, when the visitor chooses "Overall score, high to low" with the keyboard, then focus stays on the select and its value is "score" while the list updates. (L2-023)
- **AC-8** Given the spot editor's "Type" and the application sets `error` to "Choose a type" after the server refuses a tampered value, when the field renders, then the select has `aria-invalid="true"`, the double `--color-danger-solid` edge, and `span.field__error` reading "Choose a type" referenced by its `aria-describedby`. (L2-055)
- **AC-9** Given a select whose form control is disabled, when a keyboard user tabs through the form, then the select has native `disabled`, is skipped, and shows `--color-fg-disabled` text and chevron on `--color-bg-subtle`. (L2-067)
- **AC-10** Given the studio editor's "Natural light" fieldset with four selects labelled "Morning", "Midday", "Afternoon" and "Evening", when a screen reader moves into "Morning", then it hears the group "Natural light", the name "Morning" and the value "Medium". (L2-069)

### Keyboard and focus

- **AC-11** Given the "Window direction" select, when a keyboard user tabs to it, then a 2 px `--color-focus-ring` outline is drawn flush with the edge with at least 3:1 against the editor surface, and typing "S" moves the choice to "South". (L2-067)

### Theming

- **AC-12** Given the sort on the page, the space filter in the filters sheet and a fee row's "Type", when the contrast check runs in the light and the dark theme, then the value is at least 4.5:1 against the fill and the chevron, edge, focus ring and invalid edge are at least 3:1 against what surrounds them. (L2-068)

### Responsive

- **AC-13** Given the filters sheet at 360 px wide, when "Sort by" and "Minimum usable space" are measured, then each select is at least 44 px tall. (L2-065)
- **AC-14** Given the studio list at 320 px wide with the sort set to "Overall score, high to low", when the inline sort renders, then the select wraps under "Sort by", its text is not clipped, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Screen readers

- **AC-15** Given the studio editor and the filters sheet, when axe-core scans them in light and dark, then no select reports a label, name or `aria-describedby` violation. (L2-069)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the edge transition takes 0 ms
([select.html](../../design-system/components/select.html), Accessibility › Motion).

### Performance

- **AC-16** Given the `select/performance` harness route with "Sort by" and the studio editor's twelve selects, when the sort is changed, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/select/`: `select.component.ts`
  (`SelectComponent`, selector `st-select`, `NG_VALUE_ACCESSOR` provider),
  `select.component.html`, `select.component.css` (port of the `.select`
  rules and the shared `.input, .select, .textarea` field rules, `.field--inline .select`,
  and the forced-colours rule). `SelectOption` is the shared type in
  `src/lib/types/select-option.ts`.
- Host binding: `class="field"` plus `field--inline` from a `computed`.
- Value: write the DOM `value` property in an effect after the options render
  (and again when `options` changes), so `writeValue` before the options
  arrive still selects the right option on SSR hydration.
- IDs, error and help come from the shared form-field helpers
  ([form-field.md](form-field.md)).
- Mock drift the component corrects: editor selects without `id` inside a
  wrapping `<label class="field">` become `div.field` with a sibling label;
  options without `value` (display words submitted as data) get keys; the
  inline `grid-template-columns` on the light and permit rows is application
  layout, not the select's.

## Decisions

- **D-1** *Which element carries `.field`?* The host `st-select`, as ICD-DOM-1 requires for a `div` block; the `<select>` is inside it with its label before and error and help after.
- **D-2** *What does the select show when the value matches no option (a stale URL value such as `sort=price`)?* No option: `selectedIndex` is −1 and the select is blank, and the component reports nothing. Choosing a fallback would hide a value the form still holds; the application ignores unknown URL values before writing them (L2-025.3, ICD-API-10).
- **D-3** *`pages/studio-editor/new` gives both "Not set" and "No windows" the value `''`.* Values are unique within a list; the component selects the first match. The application gives "No windows" its own key ("none") wherever "Not set" is also offered.
- **D-4** *ICD-002 gives the select a `size` input, but the DS has one size and says `.input--lg` applies only to text fields.* `size` is accepted and changes nothing: every select is 44 px with 16 px text. Removing the input would be a breaking change; no screen passes it.
- **D-5** *Is the "No" / "Yes" cyc-wall select in the studio editor a select?* It stays a select because the editor mocks and the API it feeds are three-state ("Not set" on a new studio); the DS prefers a checkbox for yes-or-no facts, and the application may switch to [`st-checkbox`](checkbox.md) without any change here.
- **D-6** *Should the inline sort ever show an error or be disabled?* No: the DS says a sort can't be wrong and is never disabled; the inputs still work if passed, with the message on its own line under the row ([form-field.md](form-field.md) D-7).
