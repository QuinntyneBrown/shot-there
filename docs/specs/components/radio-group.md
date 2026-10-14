# Radio group

| Field | Value |
|---|---|
| Selector | `st-radio-group` |
| Library path | `frontend/projects/components/src/lib/radio-group/` |
| Status | planned |
| Traces to | L2-022, L2-024, L2-025, L2-045, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`radio-group.html`](../../design-system/components/radio-group.html), [`filter.html`](../../design-system/components/filter.html) |
| Source mocks | [`dialogs/studio-filters/default`](../../mocks/dialogs/studio-filters/default.html), [`dialogs/studio-filters/selected`](../../mocks/dialogs/studio-filters/selected.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studios/filtered`](../../mocks/pages/studios/filtered.html), [`dialogs/spot-filters/default`](../../mocks/dialogs/spot-filters/default.html), [`dialogs/spot-filters/selected`](../../mocks/dialogs/spot-filters/selected.html), [`pages/spots/filtered`](../../mocks/pages/spots/filtered.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/studio-editor/invalid`](../../mocks/pages/studio-editor/invalid.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/new`](../../mocks/pages/spot-editor/new.html) |
| Rendering | [`radio-group.html`](radio-group.html) |

## Purpose and scope

A radio group asks for exactly one answer and keeps every option in view: what
parking a studio must have ("Any", "On-site", "Street", "None"), whether a spot
needs a permit for the chosen use ("Any", "No permit needed for the selected
use"), and how the session behind a review was paid for ("I paid the full
rate", "Discounted", "Comped (free of charge)"). It is a native `<fieldset>`
whose `<legend>` asks the question, with one native radio per option inside a
wrapping `label.choice`.

Use [`st-checkbox-group`](checkbox.md) when any number of answers can apply and
[`st-select`](select.md) for a longer list or a crowded form. The shared field
inputs (label, `inputId`, `name`, help, error, optional) are the contract in
[`form-field.md`](form-field.md); this CRD specifies how a group of radios
renders them.

Out of scope:

- The dependent "Provided by" field: an [`st-text-field`](text-field.md) the
  application places after the group and enables or disables through the forms
  API when the answer changes.
- Which option a filter starts on, mapping the answer to the URL and ignoring
  unknown values (L2-025): the application.
- The rule that a new review starts with nothing chosen, and the error when it
  is saved that way: the application passes `''` and `error`.
- What the public page shows for each disclosure value (L2-012): the review
  page.

## Usage

Every `.choice input[type="radio"]` in `docs/mocks/` (about 120), grouped by
configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/studio-filters/*`, `pages/studios/*` sidebar | `appearance="filter"`, `name="parking"` | "Parking": Any (`''`), On-site, Street, None | "Any" selected; "On-site" selected (`filtered`) | sheet, sidebar |
| `dialogs/spot-filters/*`, `pages/spots/*` sidebar | `appearance="filter"`, `name="permit"` | "Permit": Any (`''`), No permit needed for the selected use | "Any"; "No permit needed …" (`selected`, `filtered`) | sheet, sidebar |
| `pages/studio-editor/*`, `pages/spot-editor/*` | `appearance="form"`, `name="disclosure"` | "How was this session paid for?": I paid the full rate (`paid_in_full`), Discounted (`discounted`), Comped (free of charge) (`comped`) | paid in full; comped (`invalid`, with "Provided by" in error); nothing chosen (`new`) | surface (editor section) |
| DS "Nothing chosen yet" (no mock) | form, error | "Choose how this session was paid for" | invalid | surface |
| DS states (no mock) | either | an option disabled | disabled | surface |

Every row is buildable with the API below; no slot is needed (the dependent
field sits outside the fieldset, as the DS draws it).

## Anatomy

1. **Group** — native `<fieldset>`: `fieldset.filter-group` for
   `appearance="filter"`, `fieldset.stack.stack--sm` for `appearance="form"`.
2. **Legend** — `<legend>` with `label`, the question;
   `legend.filter-group__title` for filter (`--text-label`, `--color-fg-subtle`),
   the foundation legend (`--text-label`, `--color-fg-default`) for form;
   `span.optional` when `optional`.
3. **Error** — `p.field__error` directly under the legend.
4. **Help** — `p.field__help` after the error.
5. **Option row** — `label.choice` wrapping the radio and its text; at least
   `--target-min` (24 px) tall, `--target-comfortable` (44 px) below 48rem.
6. **Radio** — native `input[type="radio"]`, `appearance: none`,
   `--icon-size-md` (20 px) circle (`--radius-full`), 1 px
   `--color-border-strong` ring on `--color-bg-surface`.
7. **Dot** — `::before` on the selected radio: a `--space-2` (8 px) dot in
   `--color-fg-on-accent` on the `--color-accent` fill.
8. **Text** — `span` (or `span.choice__text` with a `small` description),
   `--text-body`, `--space-3` after the circle.

Host: `st-radio-group` renders the `<fieldset>`; because the block must be a
native fieldset, the host adds no box (`display: contents`, ICD-DOM-1).

## API

### Inputs

Shared inputs (ICD-002 §9.2, [form-field.md](form-field.md)): `inputId` is the
**first** radio's `id` (the error summary's target); radio *n* (1-based,
*n* > 1) gets `<inputId>-<n>`. `name` is every radio's native `name`; when it
is `''` the group uses its `inputId` (given or generated) as the name, so the
radios always form one native group (D-2). `help` and `error` render under the
legend and are listed, error first, in the fieldset's `aria-describedby`;
`error` also sets `aria-invalid="true"` on every radio; `warning` sits in the
error's place without `aria-invalid` (form-field.md D-1). `optional` appends
`span.optional` with `optionalLabel` to the legend, and `labelSuffix` hidden
text to it.

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The `<legend>` text: the question ("Parking", "How was this session paid for?"). |
| `options` | `readonly ChoiceOption[]` | — | yes | One radio each, in order, tracked by `value`. `label` is the row text, `description` a `small` line under it, `disabled` native `disabled` on that radio. Values are unique keys; `''` is a real answer ("Any"). |
| `appearance` | `'form' \| 'filter'` | `'form'` | no | `filter` → `fieldset.filter-group` and `legend.filter-group__title`; `form` → `fieldset.stack.stack--sm` and a plain `legend`. |

Forms: `ControlValueAccessor`, value `string` (`null` writes as `''`). The
radio whose `value` equals the value is checked; when none matches (including
`''` with no `''` option), no radio is checked — "nothing chosen" (D-1). The
component never emits on `writeValue`. The value is reported on the radio's
`change`; touched when focus leaves the fieldset; `setDisabledState(true)` sets
native `disabled` on every radio. Arrow keys move the selection natively
(ICD-002 §9.2).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The answer reaches the application through the forms API; the application enables "Provided by" from `valueChanges`. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Every word is an input. |

Library strings: only `st.field.optional` "(optional)" through
`optionalLabel` (ICD-002 §12).

## Variants and sizes

| Variant | How | Use for |
|---|---|---|
| Filter group | `appearance="filter"`, first option "Any" with `''` | Parking, Permit. "Any" first and chosen by default, so a filter is never on by accident and the URL leaves it out. |
| Form question | `appearance="form"` (default) | The disclosure in both editors. |
| Form question, nothing chosen | value `''`, no `''` option | A new studio or spot: no answer is guessed. |
| Option with description | `ChoiceOption.description` | Available for an option that needs its rule stated; no screen uses it yet. |

One size: a 20 px circle beside 16 px text. The whole row is the target;
width is the container's.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Not selected | value ≠ option | `--color-bg-surface` circle, `--color-border-strong` ring | "radio button, not selected, 2 of 3" |
| Hover | `.choice:hover` | Ring `--color-fg-muted` | — |
| Focus | `:focus-visible` on the radio | `--focus-ring-width` ring in `--color-focus-ring` round the circle, offset `--focus-ring-offset` | Focus on the radio |
| Selected | value = option | `--color-accent` fill and ring, `--color-fg-on-accent` dot | "selected" |
| Nothing chosen | value matches no option | Every circle empty | Tab lands on the first radio without selecting it |
| Disabled | forms API, or `ChoiceOption.disabled` | `--color-bg-subtle` circle, `--color-border-default` ring, text `--color-fg-disabled` | Skipped by Tab and by the arrow keys |
| Invalid | `error` non-empty | Every radio `aria-invalid="true"`: `--color-danger-solid` ring plus a 1 px outer shadow; `p.field__error` under the legend | Heard on entering the group: legend, error, then help |
| In the filters sheet | inside `st-sheet` | Unchanged; rings keep 3:1 on `--color-bg-surface-raised` | — |

Pressing (active) shows nothing extra. A selected filter answer is never
invalid (DS states matrix).

## Markup

```html
<!-- rendered: filter group, "Any" selected (studio filters) -->
<st-radio-group>
  <fieldset class="filter-group">
    <legend class="filter-group__title">Parking</legend>
    <label class="choice"><input type="radio" id="parking" name="parking" value=""><span>Any</span></label>
    <label class="choice"><input type="radio" id="parking-2" name="parking" value="on-site"><span>On-site</span></label>
    <label class="choice"><input type="radio" id="parking-3" name="parking" value="street"><span>Street</span></label>
    <label class="choice"><input type="radio" id="parking-4" name="parking" value="none"><span>None</span></label>
  </fieldset>
</st-radio-group>
```

```html
<!-- rendered: form question (studio editor), Discounted selected -->
<st-radio-group>
  <fieldset class="stack stack--sm">
    <legend>How was this session paid for?</legend>
    <label class="choice"><input type="radio" id="disclosure" name="disclosure" value="paid_in_full"><span>I paid the full rate</span></label>
    <label class="choice"><input type="radio" id="disclosure-2" name="disclosure" value="discounted"><span>Discounted</span></label>
    <label class="choice"><input type="radio" id="disclosure-3" name="disclosure" value="comped"><span>Comped (free of charge)</span></label>
  </fieldset>
</st-radio-group>
<!-- the application's dependent field, outside the group -->
<st-text-field class="field">
  <label class="field__label" for="disclosureProvider">Provided by <span class="optional">(needed when discounted or comped)</span></label>
  <input class="input" id="disclosureProvider" name="disclosureProvider" type="text" autocomplete="off" spellcheck="true">
</st-text-field>
```

```html
<!-- rendered: nothing chosen, saved (new studio) -->
<st-radio-group>
  <fieldset class="stack stack--sm" aria-describedby="disclosure-error">
    <legend>How was this session paid for?</legend>
    <p class="field__error" id="disclosure-error">Choose how this session was paid for</p>
    <label class="choice"><input type="radio" id="disclosure" name="disclosure" value="paid_in_full" aria-invalid="true"><span>I paid the full rate</span></label>
    <label class="choice"><input type="radio" id="disclosure-2" name="disclosure" value="discounted" aria-invalid="true"><span>Discounted</span></label>
    <label class="choice"><input type="radio" id="disclosure-3" name="disclosure" value="comped" aria-invalid="true"><span>Comped (free of charge)</span></label>
  </fieldset>
</st-radio-group>
```

The selected radio is set through the DOM `checked` property; the attribute
need not appear. Disabled adds `disabled` to the radio. The fieldset, legend,
`p.field__error`, `p.field__help`, `label.choice`, `id`, `name`, `value` and
`aria-*` are the contract.

```html
<!-- consumer: studio filters -->
<st-radio-group formControlName="parking" inputId="parking" name="parking" appearance="filter"
                i18n-label label="Parking" [options]="parkingOptions" />

<!-- consumer: editor disclosure and its dependent field -->
<st-radio-group formControlName="disclosure" inputId="disclosure" name="disclosure"
                i18n-label label="How was this session paid for?"
                [options]="disclosureOptions" [error]="errors().disclosure ?? null" />
<st-text-field formControlName="disclosureProvider" inputId="disclosureProvider" name="disclosureProvider"
               i18n-label label="Provided by" optional
               i18n-optionalLabel optionalLabel="(needed when discounted or comped)" />
```

## Design

- Row, circle and text as the checkbox ([checkbox.md](checkbox.md)): `gap`
  `--space-3`, `padding-block` `--space-1`, `min-height` `--target-min`,
  circle `--icon-size-md` with `--radius-full` and `--space-0-5` top margin.
- Dot: `--space-2` square, `border-radius: 50%`, grid-centred.
- Filter group: `fieldset.filter-group`; legend `--text-label` in
  `--color-fg-subtle`, `--space-2` below it.
- Form group: `fieldset.stack.stack--sm` (`--space-2` between rows, error and
  help); foundation legend `--text-label`, `--space-2` below it.
- Focus: the shared `:focus-visible` ring, `--focus-ring-width`,
  `--focus-ring-offset`.
- Invalid: `--color-danger-solid` ring and a `--border-width-hairline` outer
  shadow.
- Motion: fill and ring colour over `--duration-fast` with `--ease-standard`;
  the dot appears at once.

The radio declares no component tokens; it shares the checkbox's semantic
tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Circle fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Ring | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Hover ring | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Selected fill and ring | `--color-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Dot | `--color-fg-on-accent` | `--palette-white` | `--palette-stone-950` |
| Label | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Filter group title | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Invalid ring | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Disabled circle | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Disabled label | `--color-fg-disabled` | `--palette-stone-300` | `--palette-stone-700` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label on the editor section |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label in the filters sheet |
| `--color-fg-subtle` | `--color-bg-surface-raised` | 4.5:1 | Filter group title in the sheet |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Ring on the editor section |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Ring in the filters sheet |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Selected circle on the page |
| `--color-accent` | `--color-bg-surface-raised` | 3:1 | Selected circle in the filters sheet |
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Dot on the selected circle |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid ring on the editor section |

Disabled radios are exempt (WCAG 1.4.3). Forced colours: the selected circle
opts out of adjustment and paints `Highlight`.

## Responsive behaviour

- Options stack one per line at every width; the group is the container's width.
- Below 48rem every row is at least `--target-comfortable` (44 px) tall
  (L2-065.3); from 48rem at least `--target-min` (24 px).
- Long options ("No permit needed for the selected use") wrap under their own
  text, never under the circle.
- Below LG the filters are in a full-height sheet, from LG in a sidebar
  (L2-022.5); the group looks the same in both.
- At 320 px nothing scrolls horizontally; at 200 % zoom every option stays
  reachable.

## Accessibility

### Role and pattern

Native radios sharing one `name` inside a `<fieldset>` and `<legend>` (the
[APG radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/),
built natively). A screen reader hears "How was this session paid for?, group.
Discounted, radio button, 2 of 3, selected".

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Into the group, to the selected radio (or the first, or last going backwards, when none is), and out again. The group is one tab stop. |
| <kbd>Down</kbd> / <kbd>Right</kbd>, <kbd>Up</kbd> / <kbd>Left</kbd> | Moves to the next or previous enabled option and selects it, wrapping at the ends (native). |
| <kbd>Space</kbd> | Selects the focused option when none is selected yet. |

### Focus

The shared ring draws round the circle with its offset, 2 px at 3:1 or more
(L2-067.2). Choosing "Discounted" or "Comped" lets the application enable
"Provided by" but never moves focus to it. The error summary moves focus to
the first radio (`inputId`).

### Labelling

- The legend is the question and names the group; each option's text names its
  radio; a description is part of the name.
- The fieldset's description is the error, then help.
- A dependent field outside the group carries its condition in its own label
  ("Provided by (needed when discounted or comped)") so it makes sense alone.

### Announcements

None. Selection is conveyed by the checked state; filter results are announced
by [`st-result-count`](filter.md) when shown.

### Motion

Fill and ring colour transition over `--duration-fast`, which reduced motion
sets to 0; the dot appears at once.

## Content and internationalisation

- The legend asks the question in the owner's words: "How was this session paid
  for?"; filter legends are nouns: "Parking", "Permit".
- Options are short, parallel and mutually exclusive: "Any", "On-site",
  "Street", "None". Filters start with "Any".
- Option words match what the public page shows, or say what visitors will see:
  "I paid the full rate" becomes "Paid in full".
- Brackets explain, they don't qualify: "Comped (free of charge)".
- Values are keys (`paid_in_full`, `discounted`, `comped`; `on-site`), so words
  can change without changing data (L2-045).
- Translatable: `label`, `help`, `error`, `optionalLabel`, each option's
  `label` and `description`. French options run longer and wrap under their
  own text.

## Performance

- Change detection: `OnPush`, signal inputs; radios render with
  `@for (option of options(); track option.value)`; the fieldset class,
  `aria-describedby` and `aria-invalid` come from `computed`s.
- Performance scenario: the `components-harness` route
  `radio-group/performance` renders the studio filters' "Parking" (Any
  selected), the spot filters' "Permit" and the editor's disclosure for
  Leslieville Daylight Studio (Discounted) with "Provided by". Choosing
  "On-site" must stay within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: selecting changes no size; the error appears under the
  legend without animation.
- Weight: `@angular/core` and `@angular/forms` accessor interfaces only.

## Acceptance criteria

### Rendering

- **AC-1** Given the studio filters' `st-radio-group` with `appearance="filter"`, `label` "Parking", `name="parking"` and the options Any (`''`), On-site, Street, None, with the value `''`, when it renders, then it is `fieldset.filter-group` with `legend.filter-group__title` "Parking", four `label.choice` rows whose radios share `name="parking"`, and "Any" is the checked radio. (L2-022)
- **AC-2** Given the "Parking" group on "Any", when the visitor selects "On-site", then "On-site" is checked, "Any" is not, and the control's value is "on-site" after the `change` event. (L2-022)
- **AC-3** Given the studio list opened from `/studios?parking=street`, when the application writes "street", then "Street" is checked and no value is emitted. (L2-025)
- **AC-4** Given the spot filters' "Permit" group, when the visitor selects "No permit needed for the selected use", then that radio is checked and the control's value is its key. (L2-024)
- **AC-5** Given the editor's `st-radio-group` with `label` "How was this session paid for?" and the options paid_in_full, discounted and comped, when it renders with the value "discounted", then it is `fieldset.stack.stack--sm` with a plain `legend`, three radios with those values, and "Discounted" checked. (L2-045)

### States

- **AC-6** Given a new studio whose disclosure control is `''`, when the editor renders, then no radio is checked, and a keyboard user tabbing into the group lands on "I paid the full rate" without selecting it. (L2-045)
- **AC-7** Given the new studio saved with no disclosure and the application sets `error` to "Choose how this session was paid for", when the group renders, then `p.field__error` with that text sits under the legend, the fieldset's `aria-describedby` names it, every radio has `aria-invalid="true"` with the `--color-danger-solid` ring, and the first radio's `id` is the group's `inputId` "disclosure". (L2-069)
- **AC-8** Given the disclosure on "I paid the full rate" with "Provided by" disabled after it, when the owner presses Down to select "Discounted", then the value "discounted" is reported, focus stays on "Discounted", and the application can enable "Provided by" without focus moving to it. (L2-067)
- **AC-9** Given an option with `disabled` true in the middle of a group, when the visitor arrows through the group, then the selection skips that radio, which has native `disabled` and a `--color-fg-disabled` label. (L2-067)

### Keyboard and focus

- **AC-10** Given the "Parking" group with "Any" selected, when a keyboard user tabs in, presses Down three times and then Down once more, then Tab lands on "Any", the selection moves to "On-site", "Street" and "None", wraps back to "Any", and one more Tab leaves the group. (L2-067)
- **AC-11** Given two `st-radio-group`s with no `name` on the same page, when the visitor arrows inside the first, then the selection never moves into the second, because each group's radios share their own generated name. (L2-067)
- **AC-12** Given a radio in the filters sheet, when a keyboard user tabs to it, then a 2 px `--color-focus-ring` ring is drawn `--focus-ring-offset` outside the circle with at least 3:1 against `--color-bg-surface-raised`. (L2-067)

### Screen readers

- **AC-13** Given the editor's disclosure on "Discounted", when a screen reader moves into the group, then it hears the group "How was this session paid for?", "Discounted", the role radio button, "2 of 3" and "selected". (L2-069)
- **AC-14** Given the studio and spot filters and both editors, when axe-core scans them in light and dark, then no radio group reports a name, fieldset, radio-group or `aria-describedby` violation. (L2-069)

### Theming

- **AC-15** Given selected, unselected, invalid and focused radios in the filters sheet and on the editor surface, when the contrast check runs in the light and the dark theme, then labels and the dot are at least 4.5:1 and the ring, selected fill, invalid ring and focus ring are at least 3:1 against what surrounds them. (L2-068)

### Responsive

- **AC-16** Given the filters sheet at 360 px wide, when the "Parking" rows are measured, then each is at least 44 px tall, and at 1280 px in the sidebar each is at least 24 px tall. (L2-065)
- **AC-17** Given the spot filters sheet at 320 px wide, when "No permit needed for the selected use" renders, then it wraps under its own text, not under the circle, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the fill and ring transitions take 0 ms and
the dot appears at once
([radio-group.html](../../design-system/components/radio-group.html), Accessibility › Motion).

### Performance

- **AC-18** Given the `radio-group/performance` harness route with "Parking", "Permit" and the disclosure, when "On-site" is selected, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/radio-group/`:
  `radio-group.component.ts` (`RadioGroupComponent`, selector
  `st-radio-group`, `NG_VALUE_ACCESSOR` provider), `.html`, `.css` (the
  `.choice*` radio rules and `.filter-group*`, shared with the checkbox folder's
  stylesheet). `ChoiceOption` is the shared type.
- The native name is `name() || id()`, computed once; radio IDs are
  `inputId` then `<inputId>-<n>` by position.
- Checked state is the DOM `checked` property bound from a `computed` of the
  value; the component does not hand-roll roving tabindex or arrow handling,
  because native radios already do both.
- Touched: a `focusout` listener on the fieldset marks touched when
  `relatedTarget` is outside it.
- Mock drift the component corrects: none in the radios; the new editors'
  unanswered group and its error are drawn from the DS.

## Decisions

- **D-1** *What does the group show when its value matches no option?* No radio is checked. This is the editors' "nothing chosen yet" (a new review must not guess a disclosure, L2-045.3), and a filter value always matches because "Any" is `''`; the application drops unknown URL values before writing them (L2-025.3).
- **D-2** *ICD-002 defaults `name` to `''`, but native radios only group, and only move with the arrow keys, when they share a name.* With no `name`, the group uses its `inputId` (given or generated, deterministic across hydration) as the name, so every group works on its own and two groups on one page never merge.
- **D-3** *How does `inputId` work for a group?* As for the checkbox group ([checkbox.md](checkbox.md) D-1): the first radio's `id`, so the error summary lands on the first radio as the DS says; others get `<inputId>-<n>`.
- **D-4** *The DS draws the editor group as a plain `<fieldset>` and as `fieldset.stack.stack--sm` once it has an error.* The form appearance is always `fieldset.stack.stack--sm`, so an error never re-spaces the rows; this matches the checkbox group ([checkbox.md](checkbox.md) D-5).
- **D-5** *Should the dependent "Provided by" be a slot inside the group?* No. The DS places it after the fieldset with its condition in its label, so it is reached on its own; enabling it is the application's, through the forms API.
