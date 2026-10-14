# Form field

| Field | Value |
|---|---|
| Selector | None of its own. Implemented by `st-text-field`, `st-textarea`, `st-select`, `st-checkbox`, `st-checkbox-group`, `st-radio-group`, `st-search-field` |
| Library path | `frontend/projects/components/src/lib/form-field/` (shared, not exported) |
| Status | planned |
| Traces to | L2-039, L2-042, L2-049, L2-054, L2-064, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-074 |
| Design system | [`form-field.html`](../../design-system/components/form-field.html) |
| Source mocks | [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/sign-in/submitting`](../../mocks/pages/sign-in/submitting.html), [`pages/home/invalid`](../../mocks/pages/home/invalid.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`dialogs/studio-filters/invalid`](../../mocks/dialogs/studio-filters/invalid.html), [`pages/admin-studios/loading`](../../mocks/pages/admin-studios/loading.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/invalid`](../../mocks/pages/studio-editor/invalid.html), [`pages/studio-editor/price-changed`](../../mocks/pages/studio-editor/price-changed.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/invalid`](../../mocks/pages/spot-editor/invalid.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html), [`pages/guide-editor/invalid`](../../mocks/pages/guide-editor/invalid.html), [`dialogs/guide-entry-picker/invalid`](../../mocks/dialogs/guide-entry-picker/invalid.html) |
| Rendering | [`form-field.html`](form-field.html) |

## Purpose and scope

The form field is the wrapper every form control renders around itself: a
visible label, the control, one message slot for an error or a warning, then
help, 4 px apart. It gives the control its name and its descriptions and keeps
them in the same order everywhere: the owner's sign-in, the studio, spot and
guide editors, the filters, the admin list search and the email signup.

It has **no selector of its own**. It is the shared contract that the seven
form controls of ICD-002 §9.2 implement: [`st-text-field`](text-field.md),
[`st-textarea`](textarea.md), [`st-select`](select.md),
[`st-checkbox`](checkbox.md), [`st-checkbox-group`](checkbox.md),
[`st-radio-group`](radio-group.md) and [`st-search-field`](combobox.md). This
CRD is definitive for the shared inputs, the field markup, the generated IDs,
the `aria-describedby` / `aria-invalid` wiring and the forms-API behaviour
(ICD-FORM-1 to ICD-FORM-6). Each control's CRD specifies only what is its own
(the native control, its size, addon, options, counter) and refers here for
the rest. How the messages look and which component renders a message that has
no field is in [`inline-message.md`](inline-message.md); rows of fields, the
error summary, the sticky actions and the save status are in
[`form-layout.md`](form-layout.md).

Out of scope:

- Validation rules, their timing and their wording: the application's
  (ICD-FORM-5, ICD-API-10). The field shows the `error`, `warning` and `help`
  it is given and never reads `AbstractControl.errors`.
- The native control itself (input types, addon, Show toggle, options,
  combobox popup, character counter): each control's CRD.
- Placing fields side by side, sections, fieldsets that group several fields
  (Fees, Natural light), the error summary and the save status:
  [`form-layout.md`](form-layout.md) and the application.
- Focus after a refused submit: the error summary's (ICD-FORM-7).
- A value shown as text under a plain label (DS "Read-only value"): not a
  control; see D-6.

## Usage

Every `.field` and `fieldset` around a control in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks field "div|label|span|p"` plus grep for
`field__help`, `field__error`, `field__warning` and `.optional`), grouped by
configuration. The control column names the component that renders the field.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/sign-in/*` | `st-text-field` `type="email"` and `"password"`, `size="lg"`, `inputId` "email", "password" | label "Email", "Password" | default; invalid "Enter your email address", "Enter your password"; read-only while submitting | canvas (`.auth`) |
| `pages/home/*` hero, every public footer | `st-text-field` `type="email"` | label "Email address" | default; invalid "Enter your email address", "Enter a valid email address, like name@example.com" | canvas, footer |
| `pages/studios/*` sidebar, `dialogs/studio-filters/*` | `st-text-field` `type="number"`, `prefix="$"` in a `.field-row--pair`; `st-select` "Minimum usable space"; `st-checkbox-group` and `st-radio-group` with `appearance="filter"` | "Minimum", "Maximum", "Neighbourhood", "Parking" | default; invalid maximum "The minimum must be lower than the maximum" | canvas, sheet |
| `pages/studios/*` toolbar | `st-select` `inline` | "Sort by" | default | canvas |
| `pages/admin-studios/*`, `admin-spots/*`, `admin-guides/*` | `st-text-field` `type="search"` | "Search by name or neighbourhood", "Search by title" | default; disabled while the list loads | canvas |
| `pages/studio-editor/*` Basics, Pricing, Logistics, Verdict, Video | `st-text-field`, `st-select`, `st-textarea` with `help`, `optional`, `optionalLabel` | "Booking link" + help "The studio's own booking page. Opens in a new tab for visitors."; "Backdrops (optional)"; "Changing area" + help "Write "None" rather than leaving it empty."; "YouTube link or video ID (optional)" + help | default; invalid "Enter a web address that starts with http:// or https://", "Enter an amount of 0 or more", "The date can't be in the future", "Enter a whole number from 1 to 5" | surface (editor section) |
| `pages/studio-editor/price-changed` | `st-text-field` `type="date"` with `warning` and `help` | "Prices last verified"; warning "You changed a price. Confirm the date you verified it."; help "Previously 11 Oct 2026. Visitors see a warning after 183 days." | warning; error replaces it "The date can't be in the future" | surface, warning tint |
| `pages/studio-editor/*` Disclosure | `st-radio-group` "How was this session paid for?"; `st-text-field` with `optionalLabel="(needed when discounted or comped)"` | "Provided by (needed when discounted or comped)" | disabled until Discounted or Comped; invalid "Enter who provided the session" | surface |
| `pages/studio-editor/*`, `spot-editor/*` image rows | `st-text-field` | "Alt text" | default; invalid "Describe this image" | surface (row) |
| `pages/spot-editor/*` | `st-text-field` "Latitude", "Permit source link", "Permits last verified"; `st-checkbox-group` "Best for" with help "Choose at least one before publishing."; `st-textarea` "Transit", "Driving", "Walking" | as listed | default; invalid "Enter a latitude from -90 to 90", "Enter a web address that starts with http:// or https://", "Enter a YouTube link or video ID"; group error "Choose at least one best use" (DS) | surface |
| `pages/guide-editor/*` | `st-text-field` "Title", "Slug" + help; `st-textarea` "Introduction"; `st-textarea` "Editor's note" with `labelSuffix` | "Editor's note" + hidden "for Kensington Window Room" | default; invalid "Enter a title" | surface |
| `pages/studio-editor/*` fee and gear rows | `st-text-field` "Fee name", "Amount" (`prefix="$"`), "Item", "Quantity"; `st-select` "Type", "Category" | as listed | default | surface (row) |
| `dialogs/guide-entry-picker/*` | `st-search-field` | "Studio or spot" + help "Type part of a name" | default; invalid "This studio is already in the guide" | dialog surface |

Every row is buildable with the shared inputs below plus each control's own
inputs. Two rows need inputs that ICD-002 1.0.0 does not have: the price-changed
warning (`warning`, D-1) and the guide editor's unique note names
(`labelSuffix`, D-2).

## Anatomy

1. **Field** — the control's host element carries `.field`: a column with a
   `--space-1` gap. `.field--inline` puts label and control on one wrapping
   row; `.field--warning` adds the warning-tinted well.
2. **Label** — `label.field__label` with `for` pointing at the control's `id`.
   `--text-label` in `--color-fg-default`. A sibling of the control, never its
   parent. Text flow (`display: block`), so it wraps between words and never
   truncates (D-10).
3. **Hidden label suffix (optional)** — `span.visually-hidden` inside the label,
   after the label text, from `labelSuffix`. Part of the accessible name.
4. **Optional marker (optional)** — `span.optional` inside the label, after the
   suffix: "(optional)" or the condition, regular weight, `--color-fg-subtle`.
   Part of the accessible name.
5. **Control** — the control's own element (input, input group, textarea,
   select, search field, choice), full width, `--space-1` below the label.
6. **Message slot** — at most one: `span.field__error` or `span.field__warning`,
   directly under the control and before the help. The glyph is CSS.
7. **Help (optional)** — `span.field__help`, `--text-body-sm` in
   `--color-fg-muted`. Stays in place when a message appears.

For a group (`st-checkbox-group`, `st-radio-group`) the field is a native
`fieldset`: the label is the `legend`, the message and help are `p` elements
directly under the legend and before the options, and the fieldset carries
`aria-describedby`.

Host: the control's host element (`st-text-field` …) **is** the `.field`, so the
library adds no wrapper (ICD-DOM-1). A group control renders the `fieldset`
inside its host, and the host adds no box of its own (`display: contents`).

## API

### Shared inputs

Every control of ICD-002 §9.2 has these inputs with exactly these names, types
and defaults. Rows marked ICD 1.1.0 are additive (D-1, D-2).

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | Visible text of `.field__label` (a `legend` in a group, the `.choice` text in `st-checkbox`). Never a placeholder. |
| `inputId` | `string` | generated `st-field-<n>` | no | Becomes the native control's `id`; in a group, the first option's `id`, and option *n* (1-based, *n* > 1) gets `<inputId>-<n>`. The application sets it on every field an error summary links to (ICD-FORM-6). Generated IDs are the same on the server and in the browser (D-3). |
| `name` | `string` | `''` | no | Native `name` on the control (every option in a group). Omitted from the DOM when empty. |
| `help` | `string \| null` | `null` | no | Renders `.field__help` with ID `<inputId>-help`. `null` and `''` render nothing. |
| `error` | `string \| null` | `null` | no | A non-empty string renders `.field__error` with ID `<inputId>-error`, sets `aria-invalid="true"` on the control (every option in a group) and leads `aria-describedby` (ICD-FORM-5). `null` and `''` render nothing and remove `aria-invalid`. |
| `warning` | `string \| null` | `null` | no | **ICD 1.1.0.** A non-empty string renders `.field__warning` with ID `<inputId>-warning` in the message slot, adds `.field--warning` to the field, and leads `aria-describedby`. Never sets `aria-invalid`. Ignored while `error` is non-empty. |
| `optional` | `boolean` | `false` | no | Appends `span.optional` with `optionalLabel` inside the label (the `legend` in a group). Required is the default and is never marked. A single `st-checkbox` renders no marker, because an unticked box is already an answer ([checkbox](checkbox.md)). |
| `optionalLabel` | `string` | §12 `st.field.optional` "(optional)" | no | Replaces the marker text, for a condition: "(needed when discounted or comped)". |
| `labelSuffix` | `string \| null` | `null` | no | **ICD 1.1.0.** Visually hidden text after the label text, preceded by one space: "Editor's note" + "for Kensington Window Room". Makes repeated labels unique while the visible label stays the same (WCAG 2.5.3). |

Inputs are signal inputs; `optional` uses `booleanAttribute`. `label`, `help`,
`error`, `warning`, `optionalLabel` and `labelSuffix` carry product copy that
the application marks for translation (`i18n-label`, `$localize`).

### Forms API (shared behaviour)

| Rule | Behaviour |
|---|---|
| ICD-FORM-1 | Each control provides itself as `NG_VALUE_ACCESSOR` and works with `formControlName`, `[formControl]` and `ngModel`. |
| ICD-FORM-2 | Values: text field, textarea, select, radio group and search field `string`; `writeValue(null)` shows `''` and the control never emits `null`. Checkbox `boolean`; checkbox group `string[]`. |
| ICD-FORM-3 | Disabled comes only from `setDisabledState`: native `disabled` on the control (every option in a group). No `disabled` input. |
| ICD-FORM-4 | `onTouched` on `blur` (a group: when focus leaves the last option of the fieldset). Value changes are reported on `input` for typed text and on `change` for choices and selects. |
| ICD-FORM-5 | See `error` above. |
| ICD-FORM-6 | See `inputId` above. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The shared field adds no output. Value and touched state reach the application through the forms API. Control-specific outputs (`optionSelected` on `st-search-field`) are in that control's CRD. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | The field projects nothing. Every word it shows arrives through the inputs above. |

Library strings (ICD §12): `st.field.optional` "(optional)", replaced through
`optionalLabel`.

## Variants and sizes

| Variant | Trigger | Use for |
|---|---|---|
| Stacked (default) | — | Every field: label above, control, message, help. |
| With help | `help` | "Booking link", "Prices last verified", "YouTube link or video ID", "Slug", "Studio or spot". |
| Optional | `optional` | "Backdrops (optional)", "Load-in note (optional)", "YouTube link or video ID (optional)". |
| Conditional | `optional` + `optionalLabel` | "Provided by (needed when discounted or comped)". |
| Hidden label suffix | `labelSuffix` | Each guide entry's "Editor's note". |
| Warning | `warning` → `.field--warning` | "Prices last verified" after a price edit. |
| Inline | `inline` (`st-text-field`, `st-select` only) → `.field--inline` | "Sort by" beside the studio list. A short label and one control; never with `help`, `warning` or `error` (D-7). |
| Group | `st-checkbox-group`, `st-radio-group` | `fieldset` + `legend`: "Best for", "How was this session paid for?", every filter group. |

The field has one size. Label `--text-label`, help and messages `--text-body-sm`
at every control size; the control's own size (`.input--lg` on sign-in, 52 px;
44 px everywhere else) changes nothing in the field.

## States

The field shows its control's state and adds the message. Hover, focus and
active belong to the control.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Label, control, help | Name from the label; description from the help |
| Hover | `:hover` on the control | Control edge `--color-fg-muted` | — |
| Focus | `:focus-visible` on the control | Ring on the control, never on the field | Reads label, value, description |
| Invalid | `error` non-empty | `.field__error` under the control with the "⚠" glyph; control gets the double danger edge | `aria-invalid="true"`; "invalid entry", then the error, then the help |
| Warning | `warning` non-empty, `error` empty | `.field--warning` tint, `.field__warning` with the ringed "!" | Description: warning, then help; not invalid |
| Error and warning | both non-empty | Only the error; no tint | As invalid |
| Disabled | `setDisabledState(true)` | Control fades; label, help unchanged | Control removed from the tab order, "dimmed" |
| Read-only | `readonly` (`st-text-field` only) | Sunken fill | Stays in the tab order, value readable (sign-in while submitting) |
| Optional | `optional` | Subtle "(optional)" in the label | Part of the name |
| On a surface | in an editor section, the filters sheet, a dialog | Same tokens; text pairs keep 4.5:1 on `--color-bg-surface`, `--color-bg-surface-raised` and `--color-warning-bg` | — |

## Markup

```html
<!-- rendered: st-text-field with help, optional marker (studio editor) -->
<st-text-field class="field">
  <label class="field__label" for="bookingUrl">Booking link</label>
  <input class="input" id="bookingUrl" name="bookingUrl" type="url" aria-describedby="bookingUrl-help">
  <span class="field__help" id="bookingUrl-help">The studio's own booking page. Opens in a new tab for visitors.</span>
</st-text-field>
<st-text-field class="field">
  <label class="field__label" for="backdrops">Backdrops <span class="optional">(optional)</span></label>
  <input class="input" id="backdrops" name="backdrops" type="text">
</st-text-field>
```

```html
<!-- rendered: invalid, error first then help (studio-editor/invalid) -->
<st-text-field class="field">
  <label class="field__label" for="priceVerifiedAt">Prices last verified</label>
  <input class="input" id="priceVerifiedAt" name="priceVerifiedAt" type="date" max="2026-10-13"
         aria-invalid="true" aria-describedby="priceVerifiedAt-error priceVerifiedAt-help">
  <span class="field__error" id="priceVerifiedAt-error">The date can't be in the future</span>
  <span class="field__help" id="priceVerifiedAt-help">Change this only when you have checked the prices again. Visitors see a warning after 183 days.</span>
</st-text-field>
```

```html
<!-- rendered: warning (studio-editor/price-changed) -->
<st-text-field class="field field--warning">
  <label class="field__label" for="priceVerifiedAt">Prices last verified</label>
  <input class="input" id="priceVerifiedAt" name="priceVerifiedAt" type="date" max="2026-10-13"
         aria-describedby="priceVerifiedAt-warning priceVerifiedAt-help">
  <span class="field__warning" id="priceVerifiedAt-warning">You changed a price. Confirm the date you verified it.</span>
  <span class="field__help" id="priceVerifiedAt-help">Previously 11 Oct 2026. Visitors see a warning after 183 days.</span>
</st-text-field>
```

```html
<!-- rendered: hidden label suffix and condition (guide editor, studio editor) -->
<st-textarea class="field">
  <label class="field__label" for="note-1">Editor's note<span class="visually-hidden"> for Kensington Window Room</span></label>
  <textarea class="textarea" id="note-1" name="entries[1].note" rows="2"></textarea>
</st-textarea>
<st-text-field class="field">
  <label class="field__label" for="disclosureProvider">Provided by <span class="optional">(needed when discounted or comped)</span></label>
  <input class="input" id="disclosureProvider" name="disclosureProvider" type="text" disabled>
</st-text-field>
```

```html
<!-- rendered: inline (studios toolbar) -->
<st-select class="field field--inline">
  <label class="field__label" for="sort">Sort by</label>
  <select class="select" id="sort" name="sort">…</select>
</st-select>
```

```html
<!-- rendered: group with error and help (spot editor); options shortened -->
<st-checkbox-group>
  <fieldset class="stack stack--sm" aria-describedby="uses-error uses-help">
    <legend>Best for</legend>
    <p class="field__error" id="uses-error">Choose at least one best use</p>
    <p class="field__help" id="uses-help">Choose at least one before publishing.</p>
    <label class="choice"><input type="checkbox" id="uses" name="bestUses" value="engagement" aria-invalid="true"><span>Engagement</span></label>
    <label class="choice"><input type="checkbox" name="bestUses" value="family" aria-invalid="true"><span>Family</span></label>
  </fieldset>
</st-checkbox-group>
```

```html
<!-- rendered: single checkbox with help (the control is the .choice row) -->
<st-checkbox class="field">
  <label class="choice"><input type="checkbox" id="has20A" name="power.has20A" aria-describedby="has20A-help"><span>20 A circuits available</span></label>
  <span class="field__help" id="has20A-help">…</span>
</st-checkbox>
```

Order inside the field is fixed: label, control, message, help (a textarea's
counter comes last, see [`textarea.md`](textarea.md)). `aria-describedby` lists
the IDs in the same order and is omitted when empty; `aria-invalid` is present
only as `"true"`. IDs are `<inputId>-error`, `<inputId>-warning`,
`<inputId>-help`. Element IDs and the host tag are not public API (ICD-DOM-3);
the classes, the order, `for`, `aria-invalid` and `aria-describedby` are.

```html
<!-- consumer: editor field with a server error -->
<st-text-field i18n-label label="Prices last verified" inputId="priceVerifiedAt" name="priceVerifiedAt"
               type="date" [max]="today" formControlName="priceVerifiedAt"
               [error]="errors().priceVerifiedAt ?? null" [warning]="priceWarning()"
               i18n-help help="Change this only when you have checked the prices again. Visitors see a warning after 183 days." />

<!-- consumer: conditional and optional -->
<st-text-field i18n-label label="Provided by" inputId="disclosureProvider" formControlName="disclosureProvider"
               optional i18n-optionalLabel optionalLabel="(needed when discounted or comped)" />

<!-- consumer: repeated note -->
<st-textarea i18n-label label="Editor's note" [labelSuffix]="noteSuffix(entry)" [inputId]="'note-' + $index"
             [name]="'entries[' + $index + '].note'" [rows]="2" [formControl]="entry.controls.note" />
```

## Design

- Field: `display: flex`, column, `gap: --space-1` between label, control,
  message and help. No margins on the parts.
- Inline: row, `flex-wrap: wrap`, `align-items: center`, `gap: --space-2`; the
  control keeps its own width (`width: auto`).
- Label `--text-label` in `--color-fg-default`; `display: block` (text
  flow): the template writes one space between the label text and the marker,
  and the hidden suffix starts with a space (D-10).
- Optional marker `--color-fg-subtle`, `--font-weight-regular`.
- Help, error and warning `--text-body-sm`; error `--color-danger-fg`, warning
  `--color-warning-fg`, help `--color-fg-muted`. Glyphs and their gaps are in
  [`inline-message.md`](inline-message.md).
- Warning well (`.field--warning`): padding `--space-4`, `--radius-md`,
  `--color-warning-bg`.
- Label, help and messages break long words (`overflow-wrap: anywhere`).
- Group: `fieldset` reset by the foundations (no border, no padding,
  `min-width: 0`); `legend` `--text-label` with `--space-2` below; the group
  CRDs set the option spacing.
- Spacing between fields is the container's: `--space-5` in an editor section,
  `--space-4` on sign-in and in a `.field-row`, `--space-3` in a filter group
  ([`form-layout.md`](form-layout.md)).

The field declares no component tokens; the control's `--field-bg`,
`--field-border` and `--field-fg` are the controls' ([`text-field.md`](text-field.md)).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Label | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Optional marker | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Help | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Error text and glyph | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Invalid control edge | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Warning text and glyph | `--color-warning-fg` | `--palette-mango-700` | `--palette-mango-300` |
| Warning well | `--color-warning-bg` | `--palette-mango-50` | `--palette-mango-950` |
| Focus ring (on the control) | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Label on the page (sign-in, filters sidebar, signup) |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label in an editor section |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label in the filters sheet and dialogs |
| `--color-fg-default` | `--color-warning-bg` | 4.5:1 | Label in the warning well |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Optional marker in an editor section |
| `--color-fg-subtle` | `--color-warning-bg` | 4.5:1 | Marker in the warning well |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Help on the page |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Help in an editor section |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Help in dialogs |
| `--color-fg-muted` | `--color-warning-bg` | 4.5:1 | Help in the warning well |
| `--color-danger-fg` | `--color-bg-canvas` | 4.5:1 | Error on the page |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Error in an editor section |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Error in the filters sheet and dialogs |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Warning in its well |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid control edge |
| `--color-border-strong` | `--color-warning-bg` | 3:1 | Control edge in the warning well |
| `--color-focus-ring` | `--color-warning-bg` | 3:1 | Focus ring in the warning well |

Forced colours: the warning well's tint disappears; the ringed "!" glyph and
the words keep the warning distinct, and the control keeps its `CanvasText`
edge.

## Responsive behaviour

- A field is the full width of its column at every breakpoint. Nothing in the
  field changes by breakpoint; the control's height grows to 44 px below 48rem
  where its CRD says so (L2-065.3), and sign-in uses the 52 px large control.
- `.field--inline` wraps: at 320 px "Sort by" stays on its line and the select
  drops under it instead of pushing the page sideways.
- Labels, help and messages wrap and break long words; a pasted booking link in
  an error or help never widens the form. Nothing truncates.
- At 320 px nothing scrolls horizontally; at 200 % zoom every label, message
  and control stays readable and operable.
- Tapping the label focuses the control, so the label adds to the touch target.

## Accessibility

### Role and pattern

Native labelling: `label for` → the control's `id`; groups use `fieldset` and
`legend`. Descriptions through `aria-describedby` in visual order (message,
help); errors set `aria-invalid="true"` (WCAG 1.3.1, 3.3.1, 3.3.3; L2-069.2).
Required fields are not marked; the server says what is missing.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves between controls. Label, help and messages are never tab stops. Disabled controls are skipped; read-only ones are not. |
| Click or tap on the label | Focuses the control (checks a checkbox wrapped in its `.choice`). |

### Focus

The ring sits on the control, never on the field or the warning well. The field
never moves focus. After a refused submit the error summary takes focus and its
links bring focus back to the control by its `inputId`
([`form-layout.md`](form-layout.md)).

### Labelling

- Accessible name: label text, then the hidden suffix, then the marker:
  "Backdrops (optional)", "Editor's note for Kensington Window Room",
  "Provided by (needed when discounted or comped)". The name starts with the
  visible words (WCAG 2.5.3).
- Description: "The date can't be in the future" then "Change this only when
  you have checked the prices again. Visitors see a warning after 183 days."
- The error and warning glyphs have empty alternative text; the words carry the
  meaning.
- Help, error and warning are never inside the `label`, so they never become
  part of the name (the DS drift of wrapping `label.field`).

### Announcements

The field has no live region. A field error appears after a submit and is
announced through the error summary, which takes focus; the control reads its
error when focused. A message that arrives without a submit is the application's
to announce ([`inline-message.md`](inline-message.md)).

### Motion

Messages appear and disappear without animation. The control's edge colour
transitions over `--duration-fast`, which the tokens set to 0 under
`prefers-reduced-motion: reduce`.

## Content and internationalisation

- Labels are short nouns in sentence case without colons, with the unit:
  "Hourly rate", "Usable width (m)", "Minimum booking (hours)", "Prices last
  verified". Never a placeholder as the label; no ShotThere field uses one.
- Mark only the exceptions: "(optional)" or the condition. Never "(required)" or
  an asterisk.
- Help gives the rule, an example or the consequence: "Write "None" rather than
  leaving it empty.", "Lowercase words and hyphens. Changing it after publishing
  redirects the old address."
- Errors say what to do and name the limit: "Enter an amount of 0 or more",
  "Enter a latitude from -90 to 90". Warnings say what changed and what to do:
  "You changed a price. Confirm the date you verified it." Message rules in full:
  [`inline-message.md`](inline-message.md).
- Dates in help use the long en-CA form the application formats: "Previously
  11 Oct 2026" (L2-070.3). The field formats nothing (ICD-I18N-4).
- Translatable inputs: `label`, `labelSuffix`, `help`, `error`, `warning`,
  `optionalLabel`. Data inside them: studio and spot names in `labelSuffix`.
- French runs about 30 % longer: every part wraps, so longer labels and help
  grow downward; the inline "Sort by" wraps its select below.

## Performance

- Change detection: `OnPush`; the IDs, `aria-describedby` string, `invalid`
  flag and which message shows are `computed` signals from the inputs, never
  template expressions.
- One generated ID per field, taken once at construction; no per-render work.
- Performance scenario: the `components-harness` route `form-field/performance`
  renders the studio editor's Basics, Pricing and Rubric fields for Corktown
  Garage Studio (24 fields), then sets the six errors of
  `pages/studio-editor/invalid` at once; that update must stay within the
  L2-071 INP budget.
- Regression rule: a change to the shared template, inputs, styles or change
  detection is measured on that route against the base branch before it is
  pushed.
- Layout stability: a message pushes the help down by one line; that shift
  follows the user's own submit, so it does not count toward CLS. Nothing else
  moves.
- Weight: `@angular/core` and `@angular/forms` (`ControlValueAccessor`,
  `NG_VALUE_ACCESSOR`) only.

## Acceptance criteria

### Rendering

- **AC-1** Given `st-text-field` with label "Booking link", `inputId` "bookingUrl", `name` "bookingUrl" and help "The studio's own booking page. Opens in a new tab for visitors.", when it renders, then the host has the class `field`, its children are `label.field__label[for="bookingUrl"]`, the input with `id="bookingUrl"` and `name="bookingUrl"`, and `span.field__help` in that order, the input's `aria-describedby` is the help's ID, and the input has no `aria-invalid`. (L2-069)
- **AC-2** Given the "Backdrops" field with `optional` and no `optionalLabel`, when it renders, then the label contains `span.optional` reading "(optional)" and the input's accessible name is "Backdrops (optional)". (L2-069)
- **AC-3** Given the "Provided by" field with `optional` and `optionalLabel` "(needed when discounted or comped)", when it renders, then the marker reads "(needed when discounted or comped)" and the accessible name is "Provided by (needed when discounted or comped)". (L2-069)
- **AC-4** Given the library built with `ng extract-i18n` in the application, when the messages file is inspected, then it holds "(optional)" under the ID `st.field.optional`, and the shared field template contains no unmarked text. (L2-070)
- **AC-5** Given the "Best for headshots" guide with an `st-textarea` labelled "Editor's note" and `labelSuffix` "for Kensington Window Room", when it renders, then the visible label reads "Editor's note", and the textarea's accessible name is "Editor's note for Kensington Window Room". (L2-069)
- **AC-6** Given the home page signup rendered on the server with an `st-text-field` that has no `inputId`, when the page hydrates in the browser, then the input keeps the `id` it had in the server HTML and the label's `for` still names it. (L2-069)
- **AC-7** Given the studio list's sidebar filters rendered on the server with JavaScript disabled, when the visitor submits minimum "100" and maximum "150", then the GET request carries `costMin=100&costMax=150` from the controls' native `name` attributes. (L2-074)

### Messages

- **AC-8** Given Corktown Garage Studio's hourly rate field with value "-5" and error "Enter an amount of 0 or more", when it renders, then the input has `aria-invalid="true"`, a `span.field__error` with that text directly follows the input group, the input's `aria-describedby` names it, and the value is still "-5". (L2-054)
- **AC-9** Given "Prices last verified" with error "The date can't be in the future" and its help, when it renders, then the error precedes the help in the DOM and `aria-describedby` is "priceVerifiedAt-error priceVerifiedAt-help" in that order. (L2-069)
- **AC-10** Given the invalid hourly rate field, when the application sets `error` to `null` and then to `''`, then in both cases the error element is gone, the input has no `aria-invalid` attribute at all, and `aria-describedby` is absent. (L2-069)
- **AC-11** Given "Prices last verified" after the hourly rate changed from $65.00 to $70.00, with warning "You changed a price. Confirm the date you verified it." and help "Previously 11 Oct 2026. Visitors see a warning after 183 days.", when it renders, then the host has `field field--warning`, a `span.field__warning` sits between the input and the help, `aria-describedby` lists the warning then the help, and the input has no `aria-invalid`. (L2-042)
- **AC-12** Given that warning field, when the application also sets error "The date can't be in the future", then only the error renders, `field--warning` is removed and the input is invalid; when the error is cleared again, the warning and the tint return. (L2-042)
- **AC-13** Given the hero signup submitted empty with error "Enter your email address", when it renders, then the message is a `span.field__error` inside the field directly under the "Email address" input and the input's `aria-describedby` names it. (L2-039)
- **AC-14** Given `st-radio-group` "How was this session paid for?" with `inputId` "disclosure" and error "Choose how this session was paid for", when it renders, then the `fieldset` holds the `legend`, then `p.field__error`, then the options, the fieldset's `aria-describedby` names the error, every radio has `aria-invalid="true"`, and the first radio has `id="disclosure"`. (L2-069)
- **AC-15** Given `st-checkbox-group` "Best for" with help "Choose at least one before publishing.", when it renders, then `p.field__help` follows the legend before the first option and the fieldset's `aria-describedby` names it. (L2-069)

### Forms API

- **AC-16** Given the studio editor's "Name" bound with `formControlName` and the form patched with `null`, when it renders, then the input shows an empty value and the form control's value read back is `''`, never `null`. (L2-054)
- **AC-17** Given the hourly rate bound with `formControlName`, when the owner types "70" and presses Tab, then the form control's value is "7" after the first keystroke and "70" after the second, and the control is touched only after the blur. (L2-054)
- **AC-18** Given "Provided by" disabled through the form API while "I paid the full rate" is chosen, when a keyboard user tabs through the Disclosure section, then the input has native `disabled`, is skipped, and its label and marker are unchanged. (L2-054)

### Keyboard and focus

- **AC-19** Given the sign-in page, when the owner clicks the "Password" label, then focus moves to the password input, and the label, help and messages of every field are skipped by Tab. (L2-067)
- **AC-20** Given focus on the "Prices last verified" input inside its warning well, when it is focused by keyboard, then the 2 px `--color-focus-ring` ring is drawn on the input, not on the field, with at least 3:1 against `--color-warning-bg`. (L2-067)

### Screen readers

- **AC-21** Given `pages/studio-editor/invalid` with six field errors, when axe-core scans the form in light and dark, then no form-label, `aria-describedby` or `aria-invalid` violation is reported and every invalid control's description starts with its error. (L2-069)

### Theming

- **AC-22** Given a label, an optional marker, help, an error and a warning on the page, in an editor section, in the filters sheet and in the warning well, when the contrast check runs in light and dark, then every text pair in the Colour table is at least 4.5:1 and the invalid edge and focus ring are at least 3:1. (L2-068)
- **AC-23** Given an error field and a warning field side by side in light and dark, when they are compared in greyscale, then the error carries the "⚠" glyph and the double edge, the warning carries the ringed "!" glyph, and neither glyph appears in the accessible description. (L2-068)

### Responsive

- **AC-24** Given the studio editor at 320 px with "Provided by (needed when discounted or comped)" and the error "Enter a web address that starts with http:// or https://" under a booking link holding "https://thejunctionloft.example/book/studio-a/weekday-rates", when it renders, then the label wraps only between words ("Provided" is never split), the error and help wrap inside the column, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-25** Given the studio list toolbar at 320 px, where "Sort by" shares the row with "7 studios" and Filters, when the inline field renders with "All-in cost, low to high" selected, then the select sits beside its label when both fit and wraps below it when they do not, is never narrower than its selected text, and nothing scrolls sideways. (L2-064)
- **AC-26** Given the sign-in page at 360 px, when the "Email" and "Password" fields render, then each field is the full width of the form and each input is 52 px tall. (L2-049)
- **AC-27** Given `pages/studio-editor/invalid` at 200 % zoom in a 1280 px viewport, when the owner reaches the hourly rate field, then its label, input, error and help are all visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): messages appear
without animation, and the control's edge transition takes 0 ms under
`prefers-reduced-motion: reduce`
([form-field.html](../../design-system/components/form-field.html), Accessibility › Motion).

### Performance

- **AC-28** Given the `form-field/performance` harness route with Corktown Garage Studio's 24 editor fields, when the six errors of the refused save are set at once, then the next paint follows within 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/form-field/`, none of it exported
  from `public-api.ts` (ICD-API-7):
  - `field-control.ts`: `FieldControl`, an abstract `@Directive()` base class
    that declares the shared signal inputs (including `warning` and
    `labelSuffix`), the computed `controlId`, `errorId`, `warningId`, `helpId`,
    `message` (error wins over warning), `invalid`, `describedBy`, and the
    `ControlValueAccessor` plumbing (`onChange`, `onTouched`, a `disabled`
    signal set by `setDisabledState`). Each control extends it and provides
    itself as `NG_VALUE_ACCESSOR` with `forwardRef`.
  - `field-id.service.ts`: `FieldIdService`, `providedIn: 'root'`, a counter that
    returns `st-field-0`, `st-field-1` … A root service is created per
    application instance, so on the server each request starts at 0 and the
    browser repeats the same sequence while hydrating (D-3).
  - `form-field.css`: the `.field*`, `.optional` rules from `components.css`
    (form field section, `.field--inline`, `.field--warning`, `.field__error`,
    `.field__warning`); each control's stylesheet `@import`s it so the rules
    exist once in source.
- Hosts: single controls bind `class="field"` plus `field--inline` and
  `field--warning` on the host; groups bind `display: contents` on the host and
  render the `fieldset`.
- ICD change (ICD-002 1.1.0, additive): the §9.2 shared-input table gains
  `warning` and `labelSuffix` (D-1, D-2).
- Mock drift the component corrects: the editors' wrapping `label.field` (with
  help and errors inside the name) becomes the sibling `label for`; the spot
  editor's "help, then error" `aria-describedby` order becomes "error, then
  help"; the price-changed mock's inline tint and "(required)" marker become
  `.field--warning` and no marker; the signup error moves into its field (D-5).

## Decisions

- **D-1** *How does the price-changed warning reach the field when ICD-002 1.0.0 has no warning input?* A shared `warning: string | null` input (default `null`, ICD-002 1.1.0, additive). The message must sit between the control and the help and tint the field, which only the control can render; L2-042.2 needs it.
- **D-2** *How do repeated labels such as each guide entry's "Editor's note" get unique names when `label` is a plain string?* A shared `labelSuffix: string | null` input (default `null`, ICD-002 1.1.0, additive) rendered as visually hidden text inside the label. The DS form-field and textarea pages require the hidden suffix, and putting the name into `label` would change the visible text.
- **D-3** *How is a generated ID the same on the server and in the browser (ICD-FORM-6)?* A root-provided counter service, not a module-level counter: a module counter keeps counting across server requests, while a root service restarts with each application instance, and hydration creates fields in the server's order. Fields created only in the browser (dialogs) take later numbers, which never existed on the server.
- **D-4** *Is the warning field tinted (`.field--warning`), as the inline-message, editor-layout, price-block and forms pages show, or plain, as the form-field page's drift note implies?* Tinted. Four DS pages, `components.css` and `contrast-pairs.json` (text, help, marker and edge on `--color-warning-bg`) all define the well; the form-field page's own example omits it.
- **D-5** *The DS keeps the signup error after the field-and-button row, outside its field; ICD-FORM-5 has the control render it in `.field__error`.* The error renders inside the field, under the input, like every other field. ICD-FORM-5 fixes it, and only the control can set `aria-invalid` and `aria-describedby` on its input. Keeping Subscribe level with the input while the field grows is `.signup*` application CSS (ICD §11.2).
- **D-6** *Who renders the DS "Read-only value" (a `span.field__label` over `.read-only-value`)?* No library component. The only mock uses are the inert editor stand-ins behind dialogs, which in the product are the real editor; `.read-only-value` stays a global utility (ICD §11.1), and a labelled value elsewhere uses [`st-description-list`](description-list.md).
- **D-7** *What does an inline field do if given help, a warning or an error?* They render on their own line under the label-and-control row (`flex-basis: 100%`). The DS says never to give an inline field a message, and no mock does; wrapping keeps a misuse readable instead of squeezing the select.
- **D-8** *Does an empty string count as an error or a help text?* No. `''` renders nothing and removes `aria-invalid`, so the application can clear a message with either `null` or `''` from a typed form's error map.
- **D-9** *Where are the group's message and help?* Under the legend and before the options, with the fieldset's `aria-describedby`, and `inputId` on the first option so a summary link lands in the group. This is the checkbox and radio-group DS pages' shape; it is heard on entering the group.
- **D-10** *`components.css` makes `.field__label` a flex row (`gap: --space-1`) and breaks long words anywhere; at phone width a label with a long condition squeezes its first flex item, so "Provided by (needed when discounted or comped)" renders as "Provide / d by". How does the label lay out?* As text flow (`display: block`) with a literal space before the marker. The words then wrap between words as L2-064 needs; the DS rule changes at the next extraction.
