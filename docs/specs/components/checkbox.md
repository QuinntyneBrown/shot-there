# Checkbox

| Field | Value |
|---|---|
| Selector | `st-checkbox`, `st-checkbox-group` |
| Library path | `frontend/projects/components/src/lib/checkbox/` |
| Status | planned |
| Traces to | L2-022, L2-024, L2-025, L2-054, L2-055, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`checkbox.html`](../../design-system/components/checkbox.html), [`filter.html`](../../design-system/components/filter.html) |
| Source mocks | [`dialogs/studio-filters/default`](../../mocks/dialogs/studio-filters/default.html), [`dialogs/studio-filters/selected`](../../mocks/dialogs/studio-filters/selected.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studios/filtered`](../../mocks/pages/studios/filtered.html), [`dialogs/spot-filters/default`](../../mocks/dialogs/spot-filters/default.html), [`dialogs/spot-filters/selected`](../../mocks/dialogs/spot-filters/selected.html), [`pages/spots/filtered`](../../mocks/pages/spots/filtered.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/published`](../../mocks/pages/spot-editor/published.html), [`dialogs/missing-fields/spot`](../../mocks/dialogs/missing-fields/spot.html) |
| Rendering | [`checkbox.html`](checkbox.html) |

## Purpose and scope

Checkboxes let people pick any number of answers. `st-checkbox-group` is a
question with several boxes: the neighbourhoods and included gear in the studio
filters, the spot types and use cases in the spot filters, a spot's best uses
in the editor. `st-checkbox` is one yes-or-no fact: "20 A circuits available"
in the studio editor. Each box is a native checkbox inside a wrapping
`label.choice`, so the whole row is the target.

Use [`st-radio-group`](radio-group.md) when exactly one answer applies (parking,
permit, disclosure) and [`st-select`](select.md) for a longer fixed list. The
shared field inputs (label, `inputId`, `name`, help, error, optional) are the
contract in [`form-field.md`](form-field.md); this CRD specifies how a single
checkbox and a fieldset of checkboxes render them.

Out of scope:

- Which filters exist, their order and when they apply ("Show 7 studios",
  "Apply filters"): the application; filters never apply on each tick.
- Mapping the group's value to the URL (`hood=junction`, L2-025) and ignoring
  unknown keys: the application.
- Validation ("Choose at least one best use") and when the error appears: the
  application passes `error`.
- The "All-in cost for 2 hours" range group: two text fields, not checkboxes
  (see [text-field.md](text-field.md) D-10).
- Checkbox-styled switches and an "all" box with a mixed state: no ShotThere
  screen uses them (D-6).

## Usage

Every `.choice input[type="checkbox"]` in `docs/mocks/` (about 300), grouped by
configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/studio-filters/*`, `pages/studios/*` sidebar | `st-checkbox-group`, `appearance="filter"`, `name="hood"` | "Neighbourhood": Bloordale, Junction, Kensington Market, Leslieville, Liberty Village, Ossington, Riverside | none ticked; Junction and Leslieville ticked | sheet, sidebar |
| Same, "Space and light" | `st-checkbox-group`, filter, two options; projected `st-select` "Minimum usable space" | "Natural light" with description "At least medium at some time of day"; "Cyc wall" | Natural light ticked (`selected`, `filtered`) | sheet, sidebar |
| Same, "Included gear" | `st-checkbox-group`, filter, `name="gear"` | Lights, Modifiers, Stands, Backdrops | none ticked | sheet, sidebar |
| `dialogs/spot-filters/*`, `pages/spots/*` | `st-checkbox-group`, filter, `name="type"` and `name="use"` | "Type": Park, Architecture, Waterfront, Indoor public; "Use case": Engagement, Family, Portrait, Brand, Video | Family ticked; Waterfront ticked (`no-results`) | sheet, sidebar |
| `pages/spot-editor/*` | `st-checkbox-group`, `appearance="form"`, `name="bestUses"`, help | "Best for": Engagement, Family, Portrait, Brand, Video; help "Choose at least one before publishing." | none on `new`; four ticked on `published`; group error "Choose at least one best use" (DS, from `dialogs/missing-fields/spot`) | surface (editor section) |
| `pages/studio-editor/*` measured specifications | `st-checkbox`, `name="power.has20A"` | "20 A circuits available" | ticked; unticked on `new` | surface |
| DS states (no mock) | either | disabled box, invalid single box | disabled, invalid | surface |

Every row is buildable with the API below. "Space and light" needs one
addition: a default slot on `st-checkbox-group` for the "Minimum usable space"
select that answers the same question (ICD change, D-2).

## Anatomy

### `st-checkbox`

1. **Row** — `label.choice`: the box and its text, the whole row clickable;
   at least `--target-min` tall (24 px), `--target-comfortable` (44 px) below
   48rem; `--space-1` block padding.
2. **Box** — native `input[type="checkbox"]`, `appearance: none`,
   `--icon-size-md` (20 px) square, `--radius-xs`, 1 px
   `--color-border-strong` edge on `--color-bg-surface`; top-aligned with
   `--space-0-5` margin.
3. **Tick** — `::before` on the checked box: a clip-path tick in
   `--color-fg-on-accent` on the `--color-accent` fill.
4. **Text** — `span` after the box, `--text-body`, `--space-3` from the box;
   with a description it is `span.choice__text` holding the label and a
   `small` in `--color-fg-muted`.
5. **Error, help (optional)** — `span.field__error`, `span.field__help` after
   the row ([form-field.md](form-field.md)).

Host: `st-checkbox` carries `.field` (a column with `--space-1` between the
row, the message and the help), as [form-field.md](form-field.md) gives every
control host; the `.choice` row is its control.

### `st-checkbox-group`

1. **Group** — native `<fieldset>`: `fieldset.filter-group` for
   `appearance="filter"`, `fieldset.stack.stack--sm` for `appearance="form"`.
2. **Legend** — `<legend>` with `label` (`legend.filter-group__title` for
   filter: `--text-label` in `--color-fg-subtle`); `span.optional` when
   `optional`.
3. **Error** — `p.field__error`, directly under the legend.
4. **Help** — `p.field__help`, after the error.
5. **Options** — one `label.choice` per `ChoiceOption`, as the single
   checkbox's row, with `value` set to the option's key.
6. **More controls (optional)** — projected default-slot content, inside the
   fieldset after the options, `--space-2` below the last row.

Host: `st-checkbox-group` renders the `<fieldset>`; because the block must be a
native fieldset, the host adds no box (`display: contents`, ICD-DOM-1).

## API

### `st-checkbox`

#### Inputs

Shared inputs (ICD-002 §9.2, [form-field.md](form-field.md)): `label`
(required) is the row's text and the box's name; `inputId` is the box's `id`;
`name` its native `name`; `help` and `error` render after the row and set
`aria-describedby` and `aria-invalid` on the box; `warning` renders like
`error` without `aria-invalid` (form-field.md D-1). `optional` and
`optionalLabel` render nothing on a single checkbox (D-4); `labelSuffix` is
visually hidden text after the row's text.

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `description` | `string \| null` | `null` | no | When set, the text becomes `span.choice__text` with the label then `<small>` description; both are part of the name. |

Forms: `ControlValueAccessor`, value `boolean` (`null` writes as `false`).
Reported on `change`; touched on `blur`; `setDisabledState` sets native
`disabled`.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The value reaches the application through the forms API. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Every word is an input. |

### `st-checkbox-group`

#### Inputs

Shared inputs: `inputId` is the **first** box's `id` (the error summary's
target); box *n* (1-based, *n* > 1) gets `<inputId>-<n>` (D-1). `name` is every
box's native `name`. `help` and `error` render under the legend and are listed,
error first, in the fieldset's `aria-describedby`; `error` also sets
`aria-invalid="true"` on every box; `warning` sits in the error's place
without `aria-invalid`. `optional` appends `span.optional` with
`optionalLabel` to the legend, and `labelSuffix` hidden text to it.

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The `<legend>` text: the question ("Neighbourhood", "Best for"). |
| `options` | `readonly ChoiceOption[]` | — | yes | One box each, in order, tracked by `value`. `label` is the row text, `description` the `small` line, `disabled` native `disabled` on that box. Values are unique keys. |
| `appearance` | `'form' \| 'filter'` | `'form'` | no | `filter` → `fieldset.filter-group` and `legend.filter-group__title`; `form` → `fieldset.stack.stack--sm` and a plain `legend` (D-5). |

Forms: `ControlValueAccessor`, value `string[]` of the ticked options' values
**in `options` order**, whatever order they were ticked in; `[]` when none
(`null` writes as `[]`). Values in a written array that match no option are
ignored and are not rendered; the component never emits on `writeValue`.
Reported on each box's `change`; touched when focus leaves the fieldset;
`setDisabledState(true)` sets native `disabled` on every box.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The value reaches the application through the forms API. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | One or more form controls that answer the same question: the studio filters' `st-select` "Minimum usable space" | Rendered inside the fieldset after the options, `--space-2` below the last row, so it is grouped under the legend. Not part of the group's value; the projected control has its own form control. **ICD change (ICD-002 1.1.0, additive)**, D-2. |

Library strings: only `st.field.optional` "(optional)" through
`optionalLabel` on the group (ICD-002 §12).

## Variants and sizes

| Variant | How | Use for |
|---|---|---|
| Single | `st-checkbox` | One fact, stated positively: "20 A circuits available". |
| Single with description | `st-checkbox` `description` | A fact whose rule needs saying. |
| Filter group | `st-checkbox-group appearance="filter"` | Studio and spot filters: any number of values within the question, combined with OR. |
| Filter group with more controls | filter group + default slot | "Space and light": two boxes, then "Minimum usable space". |
| Form group | `st-checkbox-group` (default `form`) | Editor questions: "Best for", with help under the legend. |
| Option with description | `ChoiceOption.description` | "Natural light / At least medium at some time of day". |

One size: a 20 px box beside 16 px text. The row, not the box, is the target;
width is the container's, and long text wraps under itself.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Unchecked | value false / key absent | `--color-bg-surface` box, `--color-border-strong` edge | "checkbox, not checked" |
| Hover | `.choice:hover` | Box edge `--color-fg-muted` | — |
| Focus | `:focus-visible` on the box | `--focus-ring-width` ring in `--color-focus-ring` round the box, offset `--focus-ring-offset` | Focus on the box |
| Checked | value true / key present | `--color-accent` fill and edge, tick in `--color-fg-on-accent` | "checked" |
| Disabled | forms API, or `ChoiceOption.disabled` | `--color-bg-subtle` box, `--color-border-default` edge, text `--color-fg-disabled`, `not-allowed` cursor | Skipped by Tab; announced unavailable |
| Invalid (single) | `error` on `st-checkbox` | Box edge `--color-danger-solid` plus a 1 px outer shadow; error after the row | "invalid entry"; error, then help |
| Group invalid | `error` on the group | Every box `aria-invalid="true"` with the danger edge; `p.field__error` under the legend | Heard on entering the group: legend, then error, then help |
| Group with help | `help` on the group | `p.field__help` under the legend (and under the error) | Heard on entering the group |
| In the filters sheet | inside `st-sheet` | Unchanged; edges keep 3:1 on `--color-bg-surface-raised` | — |

Pressing (active) shows nothing extra. Indeterminate is not offered (D-6).

## Markup

```html
<!-- rendered: st-checkbox, ticked (studio editor) -->
<st-checkbox class="field">
  <label class="choice"><input type="checkbox" id="has20A" name="power.has20A"><span>20 A circuits available</span></label>
</st-checkbox>
```

```html
<!-- rendered: filter group, Junction and Leslieville ticked (studio filters) -->
<st-checkbox-group>
  <fieldset class="filter-group">
    <legend class="filter-group__title">Neighbourhood</legend>
    <label class="choice"><input type="checkbox" id="hood" name="hood" value="bloordale"><span>Bloordale</span></label>
    <label class="choice"><input type="checkbox" id="hood-2" name="hood" value="junction"><span>Junction</span></label>
    <label class="choice"><input type="checkbox" id="hood-3" name="hood" value="kensington-market"><span>Kensington Market</span></label>
    <label class="choice"><input type="checkbox" id="hood-4" name="hood" value="leslieville"><span>Leslieville</span></label>
    …
  </fieldset>
</st-checkbox-group>
```

```html
<!-- rendered: filter group with a description and a projected select -->
<st-checkbox-group>
  <fieldset class="filter-group">
    <legend class="filter-group__title">Space and light</legend>
    <label class="choice"><input type="checkbox" id="space-light" name="spaceLight" value="light">
      <span class="choice__text">Natural light<small>At least medium at some time of day</small></span></label>
    <label class="choice"><input type="checkbox" id="space-light-2" name="spaceLight" value="cyc"><span>Cyc wall</span></label>
    <div><!-- free to change: spacing wrapper -->
      <st-select class="field">
        <label class="field__label" for="space">Minimum usable space</label>
        <select class="select" id="space" name="space">…</select>
      </st-select>
    </div>
  </fieldset>
</st-checkbox-group>
```

```html
<!-- rendered: form group with help and a group error (spot editor) -->
<st-checkbox-group>
  <fieldset class="stack stack--sm" aria-describedby="uses-error uses-help">
    <legend>Best for</legend>
    <p class="field__error" id="uses-error">Choose at least one best use</p>
    <p class="field__help" id="uses-help">Choose at least one before publishing.</p>
    <label class="choice"><input type="checkbox" id="uses" name="bestUses" value="engagement" aria-invalid="true"><span>Engagement</span></label>
    <label class="choice"><input type="checkbox" id="uses-2" name="bestUses" value="family" aria-invalid="true"><span>Family</span></label>
    …
  </fieldset>
</st-checkbox-group>
```

Checked state is the DOM `checked` property; the attribute need not appear.
Disabled adds `disabled` to the box. Without help or error the fieldset has no
`aria-describedby`. The slot wrapper `div` is free to change; the fieldset,
legend, `p.field__error`, `p.field__help`, `label.choice`, `.choice__text`,
`small`, `id`, `name`, `value` and `aria-*` are the contract.

```html
<!-- consumer: studio filters -->
<st-checkbox-group formControlName="hoods" inputId="hood" name="hood" appearance="filter"
                   i18n-label label="Neighbourhood" [options]="neighbourhoodOptions()" />

<st-checkbox-group formControlName="spaceLight" inputId="space-light" name="spaceLight" appearance="filter"
                   i18n-label label="Space and light" [options]="spaceLightOptions">
  <st-select formControlName="space" inputId="space" name="space"
             i18n-label label="Minimum usable space" [options]="spaceOptions" />
</st-checkbox-group>

<!-- consumer: spot editor -->
<st-checkbox-group formControlName="bestUses" inputId="uses" name="bestUses"
                   i18n-label label="Best for" i18n-help help="Choose at least one before publishing."
                   [options]="useOptions" [error]="errors().bestUses ?? null" />

<!-- consumer: studio editor -->
<st-checkbox formControlName="has20A" inputId="has20A" name="power.has20A"
             i18n-label label="20 A circuits available" />
```

## Design

- Row: `display: flex`, `gap` `--space-3`, `align-items: flex-start`,
  `padding-block` `--space-1`, `min-height` `--target-min`, `--text-body`,
  `cursor: pointer`.
- Box: `--icon-size-md` square, `--border-width-hairline` edge, `--radius-xs`,
  top margin `--space-0-5`; tick 0.75 rem; grid-centred.
- Description: `.choice__text` column with `--space-0-5` gap; `small` in
  `--color-fg-muted`.
- Filter group: `fieldset.filter-group` column with no border, padding or
  margin, `min-width: 0`; legend `--text-label` in `--color-fg-subtle`,
  `--space-2` below it; groups are spaced by the application's `.stack--lg`.
- Form group: `fieldset.stack.stack--sm` (`--space-2` between rows, error and
  help); the foundation `legend` in `--text-label`, `--space-2` below it.
- Slot content: `--space-2` above the first projected control.
- Focus: the shared `:focus-visible` ring, `--focus-ring-width`,
  `--focus-ring-offset`.
- Invalid: `--color-danger-solid` edge and a `--border-width-hairline` outer
  shadow in the same colour.
- Motion: fill and edge colour over `--duration-fast` with `--ease-standard`;
  the tick appears at once.

The checkbox declares no component tokens; it reads the semantic tokens below
directly.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Box fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Box edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Hover edge, description | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Checked fill and edge | `--color-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Tick | `--color-fg-on-accent` | `--palette-white` | `--palette-stone-950` |
| Label | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Filter group title | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Invalid edge | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Disabled box | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Disabled edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Disabled label | `--color-fg-disabled` | `--palette-stone-300` | `--palette-stone-700` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label on an editor section and the sidebar |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label in the filters sheet |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Description in the filters sheet |
| `--color-fg-subtle` | `--color-bg-surface-raised` | 4.5:1 | Filter group title in the sheet |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Box edge on a surface |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Box edge in the filters sheet |
| `--color-accent` | `--color-bg-surface` | 3:1 | Checked box on a surface |
| `--color-accent` | `--color-bg-surface-raised` | 3:1 | Checked box in the filters sheet |
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Tick on the checked box |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in the filters sheet |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge in the editor |

Disabled boxes and labels are exempt (WCAG 1.4.3). Forced colours: a checked
box opts out of adjustment and paints `Highlight`, so ticked stays visible.

## Responsive behaviour

- One option per line at every width; the group is the container's width.
- Below 48rem every `.choice` row is at least `--target-comfortable` (44 px)
  tall (L2-065.3); from 48rem at least `--target-min` (24 px), so the sidebar's
  seven neighbourhoods fit without scrolling.
- Long text wraps under itself, never under the box ("Natural light / At least
  medium at some time of day" in a 15rem sidebar and at 320 px).
- Below LG the filters are in a full-height sheet, from LG in a sidebar
  (L2-022.5); the groups look the same in both.
- At 320 px nothing scrolls horizontally; at 200 % zoom every row stays
  reachable and operable.

## Accessibility

### Role and pattern

Native checkboxes ([APG checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/))
inside wrapping labels; groups use `<fieldset>` and `<legend>`, so each box is
heard with its question: "Included gear, group. Lights, checkbox, not
checked". `.filter-group__title` stays a real `<legend>`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves to the next or previous box; every box is its own tab stop; disabled boxes are skipped. |
| <kbd>Space</kbd> | Ticks or unticks the focused box. |
| <kbd>Enter</kbd> | Never ticks; submits the enclosing form where the form submits on Enter (native). |

### Focus

The shared ring draws round the box with its offset, 2 px at 3:1 or more
against the page and the sheet (L2-067.2). Ticking never moves focus. The
error summary moves focus to the group's first box (`inputId`).

### Labelling

- A box's name is its row text; with a description, both ("Natural light At
  least medium at some time of day"), so descriptions stay short.
- The legend names the group and is read on entering it, with the fieldset's
  description: error, then help.
- A single checkbox's description is its error, then help, on the box.

### Announcements

None. A tick is conveyed by the checked state; filter results are announced by
[`st-result-count`](filter.md) when they are shown.

### Motion

Fill and edge colour transition over `--duration-fast`, which reduced motion
sets to 0; the tick appears at once.

## Content and internationalisation

- Labels are the option's name in sentence case, matching the public page:
  "Kensington Market", "Indoor public", "Cyc wall".
- A single checkbox states the positive fact: "20 A circuits available", never
  "No 20 A circuits".
- When an option hides a rule, its description says it: "At least medium at
  some time of day".
- Order by what people scan for: neighbourhoods alphabetically, gear in review
  order (Lights, Modifiers, Stands, Backdrops), uses in the spot pages' order.
- Legends are nouns or short questions: "Neighbourhood", "Included gear",
  "Best for".
- Translatable: `label`, `help`, `error`, `optionalLabel`, `description` and
  each option's `label` and `description`. Neighbourhood names are data.
  French labels run longer and wrap under themselves.

## Performance

- Change detection: `OnPush`, signal inputs; boxes render with
  `@for (option of options(); track option.value)`; the checked set is a
  `computed` `Set` of the current value, so each row's `checked` is a lookup.
- Emitting: one value array per `change`, rebuilt from `options` order.
- Performance scenario: the `components-harness` route `checkbox/performance`
  renders the studio filters' groups: "Neighbourhood" (seven), "Space and
  light" (two plus "Minimum usable space") and "Included gear" (four), with
  Junction and Leslieville ticked. Ticking "Kensington Market" must stay within
  the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: ticking changes no size; the group error appears under the
  legend without animation.
- Weight: `@angular/core` and `@angular/forms` accessor interfaces only.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-checkbox inputId="has20A" name="power.has20A" label="20 A circuits available">` set to true, when it renders, then the host has the class `field` and contains `label.choice` wrapping `input[type="checkbox"]#has20A` (checked, `name="power.has20A"`) and `span` "20 A circuits available", and the box's accessible name is "20 A circuits available". (L2-054)
- **AC-2** Given the studio filters' `st-checkbox-group` with `appearance="filter"`, `label` "Neighbourhood", `name="hood"` and the seven neighbourhoods, when it renders, then it is `fieldset.filter-group` with `legend.filter-group__title` "Neighbourhood" and seven `label.choice` rows whose boxes have `name="hood"` and the values "bloordale" … "riverside" in that order. (L2-022)
- **AC-3** Given the "Space and light" filter group with the option "Natural light" described "At least medium at some time of day", when it renders, then the row's text is `span.choice__text` with "Natural light" and `small` "At least medium at some time of day", and the box's accessible name is "Natural light At least medium at some time of day". (L2-022)
- **AC-4** Given the "Space and light" group with an `st-select` "Minimum usable space" in its default slot, when it renders, then the select's field is inside the same `<fieldset>` after the "Cyc wall" row, and a screen reader entering the select hears the group "Space and light". (L2-022)
- **AC-5** Given the spot editor's `st-checkbox-group` "Best for" with help "Choose at least one before publishing.", when it renders, then it is `fieldset.stack.stack--sm` with a plain `legend` "Best for", then `p.field__help` with that text, then five rows, and the fieldset's `aria-describedby` names the help. (L2-055)

### Value

- **AC-6** Given the "Neighbourhood" group with no box ticked, when the visitor ticks Leslieville and then Junction, then the control's value is `["junction", "leslieville"]`, in options order, after the second tick. (L2-022)
- **AC-7** Given the studio list opened from `/studios?hood=leslieville&hood=soho`, when the application writes `["leslieville", "soho"]` to the group, then only Leslieville is ticked, nothing else changes, and no value is emitted. (L2-025)
- **AC-8** Given the spot filters' "Use case" group, when the visitor ticks "Family", then the "Family" box is checked and the control's value is `["family"]`. (L2-024)
- **AC-9** Given the "20 A circuits available" checkbox ticked, when the owner clicks the row's text, then the box unticks and the control's value is `false`. (L2-054)

### States

- **AC-10** Given Scarborough Bluffs with no best use ticked and the application sets `error` to "Choose at least one best use", when the group renders, then `p.field__error` with that text sits under the legend before the help, the fieldset's `aria-describedby` lists the error's ID then the help's, every box has `aria-invalid="true"`, and the first box's `id` is the group's `inputId` "uses". (L2-055)
- **AC-11** Given the group error showing, when the owner ticks "Portrait" and the application sets `error` to `null`, then every box loses `aria-invalid`, the error element is gone, and the fieldset's `aria-describedby` names only the help. (L2-069)
- **AC-12** Given an option with `disabled` true, when a keyboard user tabs through the group, then that box has native `disabled`, is skipped, and its label is drawn in `--color-fg-disabled`. (L2-067)

### Keyboard and focus

- **AC-13** Given focus on "Lights" in "Included gear", when the visitor presses Tab, Space and Enter, then Tab moves to "Modifiers", Space ticks it, Enter does not change it, and focus stays on "Modifiers". (L2-067)
- **AC-14** Given a box in the filters sheet, when a keyboard user tabs to it, then a 2 px `--color-focus-ring` ring is drawn `--focus-ring-offset` outside the box with at least 3:1 against `--color-bg-surface-raised`. (L2-067)

### Screen readers

- **AC-15** Given the "Included gear" group, when a screen reader moves into "Lights", then it hears the group "Included gear", the name "Lights", the role checkbox and "not checked". (L2-069)
- **AC-16** Given the studio and spot filters and the spot editor, when axe-core scans them in light and dark, then no checkbox or group reports a name, fieldset or `aria-describedby` violation. (L2-069)

### Theming

- **AC-17** Given unticked, ticked, invalid and focused boxes in the filters sheet and on the editor surface, when the contrast check runs in the light and the dark theme, then labels and the tick are at least 4.5:1 and the box edge, checked fill, invalid edge and focus ring are at least 3:1 against what surrounds them. (L2-068)

### Responsive

- **AC-18** Given the filters sheet at 360 px wide, when the "Neighbourhood" rows are measured, then each row is at least 44 px tall, and at 1280 px in the sidebar each is at least 24 px tall. (L2-065)
- **AC-19** Given the filters sheet at 320 px wide, when "Natural light" with its description "At least medium at some time of day" renders, then the description and any wrapped line start under "Natural light", never under the box, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the fill and edge transitions take 0 ms and
the tick appears at once
([checkbox.html](../../design-system/components/checkbox.html), Accessibility › Motion).

### Performance

- **AC-20** Given the `checkbox/performance` harness route with the studio filters' checkbox groups, when "Kensington Market" is ticked, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/checkbox/`:
  `checkbox.component.ts` (`CheckboxComponent`, selector `st-checkbox`) and
  `checkbox-group.component.ts` (`CheckboxGroupComponent`, selector
  `st-checkbox-group`), each with its `.html` and `.css` and an
  `NG_VALUE_ACCESSOR` provider. The `.choice*` and `.filter-group*` rules are
  ported into each component's CSS (shared through one imported stylesheet in
  the folder). `ChoiceOption` is the shared type.
- The group's `<fieldset>` class, `aria-describedby` and every box's
  `aria-invalid` come from `computed`s; the box IDs are computed once from
  `inputId` and the option index.
- Touched: a `focusout` listener on the fieldset marks touched when
  `relatedTarget` is outside it.
- ICD change (ICD-002 1.1.0, additive): `CheckboxGroupComponent` gains a
  default slot (kind slot, accepts form controls answering the same question,
  rendered inside the fieldset after the options) (D-2).
- Mock drift the component corrects: the editor's "Best for" help moves from
  after the fieldset to under the legend and is referenced by
  `aria-describedby`; the sidebar's inline `margin-top` on the projected
  select's field becomes the slot's own spacing.

## Decisions

- **D-1** *How does `inputId` work for a group of boxes?* It is the first box's `id`, so an error summary item for the group lands on the first box (DS: "the error summary links to the first box"); the others get `<inputId>-2`, `<inputId>-3` … by position, which are stable on the server and in the browser.
- **D-2** *"Space and light" puts the "Minimum usable space" select inside the same fieldset as two checkboxes; ICD-002 gives `st-checkbox-group` no slot and forbids the application writing `.filter-group`.* Add a default slot (ICD-002 1.1.0, additive): projected controls render inside the fieldset after the options. Without it the select would leave the group the DS and filters pattern put it in, or the application would hand-write library markup.
- **D-3** *How do "Natural light" (`light=medium`) and "Cyc wall" (`cyc=yes`), two different URL keys in the mocks, become one group?* They are two options of one `st-checkbox-group` with the keys "light" and "cyc"; the application maps the array to its URL parameters (L2-025). Native `name`/`value` submission is not used by the Angular form.
- **D-4** *What does `optional` do on a single checkbox?* Nothing: an unticked box is a complete answer ("no"), so marking it optional says nothing; on a group it marks the legend.
- **D-5** *The DS draws the editor group as a plain `<fieldset>` without help and as `fieldset.stack.stack--sm` with help or an error.* The form appearance is always `fieldset.stack.stack--sm`, so adding help or an error never re-spaces the rows; the editors' other fieldsets ("Fees", "Sample shots") use the same spacing.
- **D-6** *The DS draws an indeterminate "All neighbourhoods" box that no mock uses, and ICD-002 has no input for it.* Not specified: no screen needs it, and adding it later is an additive input.
- **D-7** *Do filter groups ever show an error or help?* No screen does; the inputs work the same in both appearances (error and help under the legend), so a later filter rule needs no API change.
