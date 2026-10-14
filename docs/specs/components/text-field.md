# Text field

| Field | Value |
|---|---|
| Selector | `st-text-field` |
| Library path | `frontend/projects/components/src/lib/text-field/` |
| Status | planned |
| Traces to | L2-039, L2-042, L2-045, L2-049, L2-054, L2-055, L2-063, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`text-field.html`](../../design-system/components/text-field.html), [`form-field.html`](../../design-system/components/form-field.html) |
| Source mocks | [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/sign-in/submitting`](../../mocks/pages/sign-in/submitting.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/studio-editor/invalid`](../../mocks/pages/studio-editor/invalid.html), [`pages/studio-editor/price-changed`](../../mocks/pages/studio-editor/price-changed.html), [`pages/studio-editor/submitting`](../../mocks/pages/studio-editor/submitting.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/invalid`](../../mocks/pages/spot-editor/invalid.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html), [`pages/guide-editor/invalid`](../../mocks/pages/guide-editor/invalid.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/home/invalid`](../../mocks/pages/home/invalid.html), [`pages/admin-studios/default`](../../mocks/pages/admin-studios/default.html), [`pages/admin-studios/loading`](../../mocks/pages/admin-studios/loading.html), [`pages/admin-guides/default`](../../mocks/pages/admin-guides/default.html), [`dialogs/studio-filters/selected`](../../mocks/dialogs/studio-filters/selected.html), [`dialogs/studio-filters/invalid`](../../mocks/dialogs/studio-filters/invalid.html) |
| Rendering | [`text-field.html`](text-field.html) |

## Purpose and scope

The text field takes one short value typed on one line: the owner's email and
password, a studio's name and booking link, an hourly rate, a ceiling height, a
latitude, the date prices were last verified, a visitor's email for the signup,
a search of the admin lists, the minimum and maximum all-in cost in the studio
filters. It is a complete form field: label, optional marker, the native
`<input>`, an optional `$` prefix or a joined "Show" toggle for passwords, one
error, and help.

Use [`st-textarea`](textarea.md) for more than one line, [`st-select`](select.md)
or [`st-radio-group`](radio-group.md) for a fixed list of answers,
[`st-checkbox`](checkbox.md) for a yes-or-no fact, and
[`st-search-field`](combobox.md) when typing suggests results (the guide
entry picker's "Studio or spot"). The label, optional marker, help, error and
their ID wiring are the shared field contract in [`form-field.md`](form-field.md);
this CRD specifies only what the text field adds and how it renders that
contract.

Out of scope:

- Validation rules, messages, when an error appears and where focus goes after
  a failed submit: the application's (ICD-FORM-5), with
  [`st-error-summary`](form-layout.md) for the summary.
- Formatting and parsing: the value is the string the person typed; the
  application parses numbers and dates (ICD-FORM-2).
- The search `<form role="search">`, its 28rem cap and the result filtering
  (L2-063.2): the application's page layout and logic.
- Layout across fields (`.field-row`, editor sections, the sign-in stack, the
  signup row): global utilities and application feature CSS.
- A value shown as text rather than an input (`.read-only-value` in the editor
  summaries): a global utility the application writes.
- The `.filter-group` fieldset around the filters' "Minimum" and "Maximum": not
  rendered by this component (see *Decisions*, D-10).

## Usage

Every `input.input` in `docs/mocks/` (634 inputs over pages, dialogs and
notifications), grouped by configuration. Editors repeat behind the
admin toasts; public pages repeat the footer signup. The guide entry picker's
"Studio or spot" is [`st-search-field`](combobox.md), not this component.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/sign-in/*` "Email" | `type="email"`, `size="lg"`, `autocomplete="username"`, `spellcheck` false | label | default, invalid "Enter your email address", read-only while submitting | surface (auth card) |
| `pages/sign-in/*` "Password" | `type="password"`, `size="lg"`, `autocomplete="current-password"`; Show toggle (`.btn--lg`) | label, "Show" + hidden " password" | default, invalid "Enter your password", read-only with Show disabled | surface (auth card) |
| `pages/home/*` hero, footer signup on every public page | `type="email"`, `inputmode="email"`, `autocomplete="email"` | label "Email address" | default, invalid "Enter your email address", "Enter a valid email address, like name@example.com" | canvas, footer |
| Studio, spot and guide editors: Name, Neighbourhood, Address or cross streets, Title, Transit, Washroom, Outlet type, Cyc condition, alt text, angle note, light and season notes | `type="text"`, `autocomplete="off"` | label; `optional` on "Backdrops", "Load-in note", "Parking note", "Morning note" … | default, invalid "Describe this image", "Enter a title" | surface (editor section) |
| Guide editor "Slug" | `type="text"`, `autocomplete="off"`, `spellcheck` false | label, help "Lowercase words and hyphens. …" | default | surface |
| Editors "Booking link", "Permit source link" | `type="url"` | label, help | default, invalid "Enter a web address that starts with http:// or https://" (error then help) | surface |
| Editors "Prices last verified", "Permits last verified" | `type="date"`, `max="2026-10-13"` | label, help "Change this only when you have checked the prices again. …" | default, invalid "The date can't be in the future", warning after a price change (form-field.md) | surface |
| Studio editor "Usable width (m)", "Usable depth (m)", "Ceiling height (m)" | `type="number"`, `inputmode="decimal"`, `step="0.1"` | label with unit | default | surface |
| Studio editor rubric scores "Value" … "Light" | `type="number"`, `inputmode="numeric"`, `min="1"`, `max="5"` | label | default, invalid "Enter a whole number from 1 to 5" | surface |
| Studio editor "Minimum booking (hours)", "Outlets", spot editor "Focal length (mm)", included "Quantity" | `type="number"`, `inputmode="numeric"`, `min="1"`, `step="1"` | label | default | surface, fee row |
| Spot editor "Latitude", "Longitude" | `type="number"`, `inputmode="decimal"`, `min`/`max` ±90/±180, `step="0.0001"` | label | default, invalid "Enter a latitude from -90 to 90" | surface |
| Studio editor "Hourly rate" | `type="number"`, `inputmode="decimal"`, `min="0"`, `step="0.01"`, `prefix="$"` | label | default, invalid "Enter an amount of 0 or more" (value "-5" kept) | surface |
| Studio editor fee and extra rows "Amount", "Price"; "Fee name", "Item" | `$` prefix number, or text | label | default | fee row (sunken) |
| Studio editor "Provided by" | `type="text"`, `optional` with `optionalLabel` "(needed when discounted or comped)" | label | disabled (paid in full), enabled, invalid "Enter who provided the session" | surface |
| `pages/admin-studios/*`, `admin-spots/*`, `admin-guides/*` | `type="search"`, `autocomplete="off"`, `spellcheck` false | label "Search by name or neighbourhood" / "Search by title", search icon | default, disabled while the list loads | canvas |
| `dialogs/studio-filters/*`, `pages/studios/*` sidebar "Minimum", "Maximum" | `type="number"`, `inputmode="decimal"`, `min="0"`, `step="10"`, `autocomplete="off"`, `prefix="$"` | label | default, value "150", invalid "The minimum must be lower than the maximum" | sheet, sidebar |

Every row is buildable with the API below: type, size, autocomplete,
inputmode, spellcheck, min, max, step, maxlength, prefix, readonly and the
Show labels are inputs; the label, optional marker, help and error are the
shared inputs ([form-field.md](form-field.md)); disabled comes from the forms
API. No mock uses a placeholder, a unit suffix, a small field or an inline text
field (D-6, D-7, D-8).

## Anatomy

1. **Field** — the host `st-text-field` carries `.field` (ICD-DOM-1), plus
   `.field--inline` when `inline`. Column with `--space-1` between parts
   ([form-field.md](form-field.md)).
2. **Label** — `label.field__label[for]`, the visible name; holds
   `span.optional` with `optionalLabel` when `optional`.
3. **Input** — native `input.input` (`.input--lg` at large). Full width, 44 px
   minimum (52 px large), `--radius-md`, 1 px `--field-border` edge, value in
   `--text-body`.
4. **Input group (optional)** — `span.input-group`, rendered when `prefix` is
   set or `type` is `password`; joins its parts with squared inner corners and
   1 px overlapping seams.
5. **Prefix addon (optional)** — `span.addon[aria-hidden="true"]` before the
   input: `--color-bg-subtle` fill, `--color-fg-muted` text, the same strong
   edge. Decorative ("$").
6. **Show toggle (password only)** — a library `button[st-button]`
   ([button.md](button.md)) after the input: `type="button"`, `pressed`,
   `aria-controls` = the input's ID, `.btn--lg` beside a large input. Visible
   "Show" plus visually hidden " password".
7. **Search icon (search only)** — `span.search` wraps an `st-icon`
   `name="search"` (`svg.icon`, `aria-hidden="true"`) and the input; the icon
   sits `--space-3` from the start in `--color-fg-subtle`.
8. **Error** — `span.field__error` directly under the input or the group, then
   **Help** — `span.field__help`; both per [form-field.md](form-field.md).

Host: `st-text-field` is the `.field` box. The input is an inner element, so
the consumer never puts native attributes on the host for the input; every
input attribute the product uses is an input of the component.

## API

### Inputs

Shared inputs (ICD-002 §9.2), specified in [form-field.md](form-field.md):
`label` (required), `inputId`, `name`, `help`, `error`, `optional`,
`optionalLabel`, and the additive `warning` and `labelSuffix` (ICD-002 1.1.0,
form-field.md D-1, D-2). This control renders them as the label, the input's
`id` and `name`, `.field__help`, `.field__error` with `aria-invalid`,
`.field__warning` with `.field--warning` on the host ("Prices last verified"
after a price edit), and `span.optional`.

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'number' \| 'date'` | `'text'` | no | Native `type`. `password` adds the Show toggle; `search` adds the `.search` wrapper and icon. |
| `size` | `ControlSize` | `'md'` | no | `lg` → `.input--lg` and a `.btn--lg` Show toggle; `sm` → `.input--sm`, which keeps the medium look (D-7). |
| `autocomplete` | `string` | `'off'` | no | Native `autocomplete`, always rendered. |
| `inputmode` | `string \| null` | `null` | no | Native `inputmode` when not null (`decimal`, `numeric`, `email`). |
| `spellcheck` | `boolean` | `true` | no | Native `spellcheck="true\|false"`. |
| `min`, `max`, `step` | `string \| null` | `null` | no | Native attributes when not null, for `number` and `date`. They describe the rule; the application and server enforce it. |
| `maxlength` | `number \| null` | `null` | no | Native `maxlength` when not null. No counter (that is the textarea's). |
| `prefix` | `string \| null` | `null` | no | Renders `.input-group` with a leading `span.addon[aria-hidden="true"]`. Never part of the value or the name. |
| `readonly` | `boolean` | `false` | no | Native `readonly`: sunken fill, focusable, selectable, not editable; disables the Show toggle (D-4). |
| `revealLabel` | `string` | `st.textField.reveal` ("Show") | no | Visible text of the Show toggle. Only with `type="password"`. |
| `concealLabel` | `string` | `st.textField.conceal` ("Hide") | no | Accepted, not rendered: the toggle keeps `revealLabel` and `aria-pressed` carries the state (D-3). |
| `revealContext` | `string` | `st.textField.revealContext` ("password") | no | Visually hidden text after `revealLabel`, joined with a space: the name "Show password". |
| `inline` | `boolean` | `false` | no | `.field--inline` on the host: label beside the input, which keeps its natural width. For a short label and a field that cannot show an error. |

Inputs are signal inputs; `spellcheck`, `readonly` and `inline` use
`booleanAttribute`, `maxlength` uses `numberAttribute`.

Forms (ICD-FORM-1 to 4): `ControlValueAccessor` with value type `string`
(empty is `''`, never `null`). The value is reported on every `input` event;
the control is marked touched on `blur` of the input (not of the Show toggle).
`setDisabledState(true)` sets native `disabled` on the input and on the Show
toggle. `writeValue(null)` renders `''`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Value changes reach the application through the forms API. The Show toggle is internal state; it emits nothing. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Every word comes from inputs (ICD-I18N-2); the icon is internal. |

Library strings (ICD-002 §12): `st.textField.reveal` "Show",
`st.textField.conceal` "Hide", `st.textField.revealContext` "password", and
`st.field.optional` "(optional)" through `optionalLabel`. Each is a `$localize`
string with that custom ID and is replaced by its input.

## Variants and sizes

| Variant | How | Use for |
|---|---|---|
| Text, email, url, tel | `type` | Names, notes, alt text, booking and permit source links, the owner and signup email. |
| Number, decimal | `type="number"`, `inputmode="decimal"`, `step` | Metres to one decimal, coordinates, money. Money uses `step="0.01"` (D-9). |
| Number, whole | `type="number"`, `inputmode="numeric"`, `min`, `step="1"` | Minimum booking hours, outlets, quantity, focal length, rubric scores 1 to 5. |
| Date | `type="date"`, `max` | "Prices last verified", "Permits last verified"; `max` is today, set by the application. Platform picker. |
| Prefix | `prefix="$"` | Every price: hourly rate, fee and extra amounts, the filters' cost range. |
| Password with Show | `type="password"` | Sign-in password. |
| Search | `type="search"` | Admin studio, spot and guide lists. |
| Read-only | `readonly` | Sign-in fields while the request is in flight. |
| Inline | `inline` | Label beside the input. No ShotThere screen uses it; kept for the ICD (D-8). |

| Size | Class | Height | Value type | Show toggle |
|---|---|---|---|---|
| md (default) | — | `--control-height-md` (44 px) | `--text-body` (16 px) | `.btn` (44 px) |
| lg | `.input--lg` | `--control-height-lg` (52 px) | `--font-size-lg` (18 px) | `.btn--lg` (52 px) |
| sm | `.input--sm` | `--control-height-md` (44 px, D-7) | `--text-body` | `.btn` |

Width: 100 % of the field's column; inline, the natural width of the input.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--field-bg` fill, `--field-border` edge, `--field-fg` value | Name from the label; description from help |
| Hover | `:hover` | Edge `--color-fg-muted` | — |
| Focus | `:focus-visible` on the input | Edge and 2 px ring in `--color-focus-ring`, offset 0, drawn above a joined neighbour | Focus on the input |
| Filled | value not empty | Value in `--field-fg`; kept when wrong ("-5", "corktowngarage") | Value read |
| Invalid | `error` non-empty | `aria-invalid="true"`; edge `--color-danger-solid` doubled by a 1 px inset shadow; `.field__error` under the input or group | "invalid entry"; error read first in the description, then help |
| Disabled | forms API `setDisabledState(true)` | Native `disabled`; `--color-bg-subtle` fill, `--color-fg-disabled` value, `--color-border-default` edge, `not-allowed` cursor; Show toggle disabled | Removed from the tab order; announced unavailable |
| Read-only | `readonly` | Native `readonly`; `--color-bg-surface-sunken` fill; Show toggle disabled | Stays a tab stop; announced read-only; value selectable |
| Password concealed | `type="password"`, toggle `aria-pressed="false"` | Dots; Show in the secondary look | "Show password, toggle button, not pressed" |
| Password revealed | toggle pressed → input `type="text"`, `aria-pressed="true"` | Plain text; Show in the pressed accent tint (`.compare-toggle[aria-pressed="true"]`, ICD-002 D-9) | "Show password, toggle button, pressed" |
| Search | `type="search"` | Leading icon, `--space-10` start padding; the browser's clear control | Role searchbox inside the application's search landmark |
| On a fee row | inside the application's `.fee-row` | Unchanged: the white field on the sunken row | — |
| In the filters sheet | inside `st-sheet` | Unchanged; edge keeps 3:1 on `--color-bg-surface-raised` | — |

A text field has no active state of its own. A search field is never invalid or
read-only; sign-in fields are never disabled (DS states matrix).

## Markup

```html
<!-- rendered: text with help (studio editor) -->
<st-text-field class="field">
  <label class="field__label" for="bookingUrl">Booking link</label>
  <input class="input" id="bookingUrl" name="bookingUrl" type="url" autocomplete="off" spellcheck="true" aria-describedby="bookingUrl-help">
  <span class="field__help" id="bookingUrl-help">The studio's own booking page. Opens in a new tab for visitors.</span>
</st-text-field>
```

```html
<!-- rendered: $ prefix, invalid (studio editor) -->
<st-text-field class="field">
  <label class="field__label" for="hourlyRate">Hourly rate</label>
  <span class="input-group">
    <span class="addon" aria-hidden="true">$</span>
    <input class="input" id="hourlyRate" name="hourlyRate" type="number" inputmode="decimal" min="0" step="0.01" autocomplete="off" spellcheck="true"
           aria-invalid="true" aria-describedby="hourlyRate-error">
  </span>
  <span class="field__error" id="hourlyRate-error">Enter an amount of 0 or more</span>
</st-text-field>
```

```html
<!-- rendered: large password with Show (sign-in), concealed -->
<st-text-field class="field">
  <label class="field__label" for="password">Password</label>
  <span class="input-group">
    <input class="input input--lg" id="password" name="password" type="password" autocomplete="current-password" spellcheck="true">
    <button class="btn btn--lg compare-toggle" type="button" aria-pressed="false" aria-controls="password">Show<span class="visually-hidden"> password</span></button>
  </span>
</st-text-field>
```

```html
<!-- rendered: the same, read-only while sign-in submits -->
<input class="input input--lg" id="password" name="password" type="password" autocomplete="current-password" spellcheck="true" readonly>
<button class="btn btn--lg compare-toggle" type="button" aria-pressed="false" aria-controls="password" disabled>Show<span class="visually-hidden"> password</span></button>
```

```html
<!-- rendered: search (admin studio list) -->
<st-text-field class="field">
  <label class="field__label" for="q">Search by name or neighbourhood</label>
  <span class="search"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="input" id="q" name="q" type="search" autocomplete="off" spellcheck="false"></span>
</st-text-field>
```

```html
<!-- rendered: conditional optional marker, disabled -->
<st-text-field class="field">
  <label class="field__label" for="disclosureProvider">Provided by <span class="optional">(needed when discounted or comped)</span></label>
  <input class="input" id="disclosureProvider" name="disclosureProvider" type="text" autocomplete="off" spellcheck="true" disabled>
</st-text-field>
```

`size="lg"` adds `.input--lg`; `inline` adds `.field--inline` to the host.
The `st-icon` host around the search `svg` and the Show toggle's Angular
attributes are not part of the contract (ICD-DOM-3); the classes, `type`,
`aria-*`, `for`/`id` pairs and the order of label, control, error and help are.

```html
<!-- consumer: sign-in -->
<st-text-field formControlName="email" inputId="email" name="email" type="email" size="lg"
               autocomplete="username" [spellcheck]="false" [readonly]="submitting()"
               i18n-label label="Email" [error]="emailError()" />
<st-text-field formControlName="password" inputId="password" name="password" type="password" size="lg"
               autocomplete="current-password" [readonly]="submitting()"
               i18n-label label="Password" [error]="passwordError()" />

<!-- consumer: hourly rate -->
<st-text-field formControlName="hourlyRate" inputId="hourlyRate" name="hourlyRate" type="number"
               inputmode="decimal" min="0" step="0.01" prefix="$"
               i18n-label label="Hourly rate" [error]="errors().hourlyRate ?? null" />

<!-- consumer: admin search inside the application's search landmark -->
<form role="search" class="admin-search" (ngSubmit)="search()">
  <st-text-field [formControl]="query" inputId="q" name="q" type="search" [spellcheck]="false"
                 i18n-label label="Search by name or neighbourhood" />
</form>
```

## Design

- Field: column, `--space-1` between label, control, message and help
  ([form-field.md](form-field.md)); inline: one wrapping row, `--space-2` apart.
- Input: `width: 100%`, `min-height` `--control-height-md` (large
  `--control-height-lg`), padding `--space-2` `--space-3`, value `--text-body`
  (large `--font-size-lg`), `--border-width-hairline` edge, `--radius-md`.
- Input group: `display: flex`, parts stretched to the same height; inner
  corners square; every joined part overlaps its neighbour by
  `--border-width-hairline`; the focused part is raised (`z-index: 1`) so its
  ring is never clipped. No inline sizing on the input: the group fits at
  320 px as it is.
- Addon: padding-inline `--space-3`, `--text-body-sm`, `--color-bg-subtle` fill,
  `--color-fg-muted` text, `--color-border-strong` edge.
- Search: start padding `--space-10`; icon `--icon-size-md` at `--space-3` from
  the start, centred vertically, `--color-fg-subtle`, no pointer events.
- Focus: `--focus-ring-width` outline in `--color-focus-ring`, offset 0, and the
  edge takes the same colour.
- Invalid: `--color-danger-solid` edge plus an inset `--border-width-hairline`
  shadow in the same colour.
- Motion: edge colour and shadow over `--duration-fast` with `--ease-standard`.
- Placeholder (none used): `--color-fg-subtle`.

Component tokens declared on `.input` (shared with `.select` and `.textarea`):

| Token | Aliases | Overridden by |
|---|---|---|
| `--field-bg` | `--color-bg-surface` | disabled `--color-bg-subtle`; read-only `--color-bg-surface-sunken` |
| `--field-border` | `--color-border-strong` | hover `--color-fg-muted`; focus `--color-focus-ring`; invalid `--color-danger-solid`; disabled `--color-border-default` |
| `--field-fg` | `--color-fg-default` | disabled `--color-fg-disabled` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Value | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Hover edge, addon text | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Search icon, placeholder | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Focus edge and ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Invalid edge | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Read-only fill | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Addon fill, disabled fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Disabled value | `--color-fg-disabled` | `--palette-stone-300` | `--palette-stone-700` |
| Disabled edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |

Label, help, error and optional-marker colours are in [form-field.md](form-field.md);
the Show toggle's are in [button.md](button.md).

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Value on the field |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Value on the read-only fill |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | "$" on the addon |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Search icon and any placeholder |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Edge on the page |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Edge in an editor section and the sidebar |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Edge in the filters sheet |
| `--color-border-strong` | `--color-bg-surface-sunken` | 3:1 | Edge on a fee row and on the read-only fill |
| `--color-fg-muted` | `--color-bg-surface` | 3:1 | Hover edge |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring and edge |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge |

Disabled fields are exempt from contrast minimums (WCAG 1.4.3). Forced
colours: the input keeps a `CanvasText` hairline edge and opts out of forced
colour adjustment, so its boundary survives; the focus outline uses the system
colour.

## Responsive behaviour

- The field is 100 % of its column at every width; the text field has no
  breakpoint rule of its own. Pairs side by side (`.field-row` from 36rem) and
  the always-paired filter cost range are the application's layout.
- Medium (44 px) and large (52 px) meet the 44 px phone target at every width
  (L2-065.3); the label adds to the tap area.
- Value text is at least 16 px, so iOS Safari never zooms on focus (L2-049.4).
- Input groups never wrap: the addon or Show stays joined. At 320 px the large
  password keeps at least 190 px for typing beside Show; keep prefixes to one
  or two characters.
- Inline: the row wraps, so at 320 px the input drops under its label rather
  than pushing the page sideways.
- Label, help and error wrap (`overflow-wrap: anywhere`), never truncate; a
  long pasted link scrolls inside the input.
- Date inputs open the platform picker (wheel on iOS, calendar elsewhere).
- At 320 px nothing scrolls horizontally; at 200 % zoom every field and its
  messages stay visible and usable.

## Accessibility

### Role and pattern

Native `<input>` with a sibling `<label for>` (textbox, or searchbox for
`type="search"`). Errors set `aria-invalid="true"` and are referenced first in
`aria-describedby`, then help (L2-069.2, [form-field.md](form-field.md)). The
Show toggle is an APG toggle button (`aria-pressed`, `aria-controls`). Search
fields sit inside the application's `role="search"` form. `autocomplete`
tokens meet WCAG 1.3.5: `username` and `current-password` on sign-in, `email`
in the signup.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Into and out of the field; in the password group, from the input to Show. Read-only fields are tab stops; disabled ones are not. |
| <kbd>Enter</kbd> | Submits the enclosing form (native). |
| <kbd>Space</kbd> / <kbd>Enter</kbd> on Show | Reveals or conceals the password; focus stays on Show. |
| <kbd>Up</kbd> / <kbd>Down</kbd> in a number | Steps by `step` (native); typing is always allowed. |
| <kbd>Esc</kbd> in a search | Clears the value (native), which reports `''`. |
| Paste | Always allowed, including the password (WCAG 3.3.8). |

### Focus

The ring sits flush on the edge (offset 0) and the edge takes the ring colour:
2 px at 3:1 or more (L2-067.2). The component never moves focus; revealing the
password keeps focus on Show, and the input keeps its caret position. After a
failed submit the application moves focus to the error summary or, in the
filters sheet, to the invalid "Maximum".

### Labelling

- Accessible name = the visible label, including the optional marker
  ("Backdrops (optional)", "Provided by (needed when discounted or comped)").
  The "$" addon is `aria-hidden` and never part of the name or the value.
- Description = error (when present), then help, in the order they appear.
- Show is named "Show password": `revealLabel` plus visually hidden
  `revealContext`. The name does not change when pressed (D-3).
- The search icon is decorative (`aria-hidden="true"`).

### Announcements

None. The field has no live region; errors are read when the field is reached
(and by the error summary); search results are announced by the page's
[`st-result-count`](filter.md).

### Motion

Edge colour and the invalid shadow transition over `--duration-fast`, which
the tokens set to 0 under `prefers-reduced-motion: reduce`. No shake on error.

## Content and internationalisation

- Labels are short nouns in sentence case without colons; the unit is in the
  label ("Usable width (m)", "Minimum booking (hours)") or the `$` prefix, never
  in the value.
- Prices are typed as plain numbers after "$" ("65.00"); visitors see "$65.00".
- No placeholders: a format hint goes in help.
- Translatable inputs (marked by the application): `label`, `help`, `error`,
  `optionalLabel`, `prefix`, and the Show strings when overridden. Data values:
  the field's value only.
- Library strings: "Show", "Hide", "password", "(optional)" (ICD-002 §12); a
  French "Afficher le mot de passe" fits beside the large password at 320 px
  because the group never wraps and the input shrinks to its 190 px floor.
- Dates the application passes in `max` are ISO (`2026-10-13`); the picker
  displays them in the browser's locale.

## Performance

- Change detection: `OnPush`, signal inputs; the input's `aria-describedby`,
  `aria-invalid` and the group/search/plain structure come from `computed`s.
- The value accessor writes the DOM value directly and reports on `input`; no
  per-keystroke signal writes inside the component beyond the forms callback.
- Performance scenario: the `components-harness` route
  `text-field/performance` renders the studio editor's pricing and measured
  specifications for Corktown Garage Studio: "Hourly rate" ($ prefix),
  "Minimum booking (hours)", "Prices last verified", "Usable width (m)",
  "Usable depth (m)", "Ceiling height (m)", "Outlets", six rubric scores and the
  sign-in password with Show. Typing into "Hourly rate" must stay within the
  L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the error appears under the input without animation; the
  input's height never changes between states.
- Weight: imports `@angular/core`, `@angular/forms` (accessor interfaces), and
  the library's `ButtonComponent` and `IconComponent`; nothing else.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-text-field inputId="name" name="name" label="Name">` in the studio editor, when it renders, then the host has the class `field` and contains `label.field__label[for="name"]` reading "Name" followed by `input.input#name` with `type="text"`, `name="name"` and `autocomplete="off"`, and the input's accessible name is "Name". (L2-069)
- **AC-2** Given the sign-in "Email" with `type="email"`, `size="lg"`, `autocomplete="username"` and `spellcheck` false, when it renders at 360 px, then the input has the classes `input input--lg`, those three attributes, is 52 px tall and its value text is 18 px, so the page does not zoom on focus. (L2-049)
- **AC-3** Given the studio editor's "Hourly rate" with `prefix="$"`, `type="number"`, `inputmode="decimal"`, `min="0"` and `step="0.01"`, when it renders, then the input sits in `span.input-group` after `span.addon[aria-hidden="true"]` reading "$", and the input's accessible name is "Hourly rate" without "$". (L2-054)
- **AC-4** Given the "Hourly rate" bound to a form control, when the owner types "65.00", then the control's value is the string "65.00" after each keystroke, the value never contains "$", and clearing the input reports `''`, not `null`. (L2-054)
- **AC-5** Given "Prices last verified" with `type="date"` and `max="2026-10-13"`, when it renders, then the input has `type="date"` and `max="2026-10-13"`, and after the application sets the error "The date can't be in the future" the value "2026-11-02" is still shown. (L2-042)
- **AC-6** Given the spot editor's "Latitude" bound to the coordinates form, when the owner types "43.6846", then the value is reported on each keystroke, so the preview map can follow it without waiting for blur. (L2-055)
- **AC-7** Given the admin studio list's `type="search"` field labelled "Search by name or neighbourhood", when the owner types "junction", then the input is `input.input[type="search"]` inside `span.search` with a decorative `svg.icon[aria-hidden="true"]`, and the control's value is "junction". (L2-063)
- **AC-8** Given the optional "Backdrops" and the conditional "Provided by" with `optionalLabel` "(needed when discounted or comped)", when they render, then each label holds `span.optional` with that text and the accessible names are "Backdrops (optional)" and "Provided by (needed when discounted or comped)". (L2-069)

### Password toggle

- **AC-9** Given the sign-in "Password" with `type="password"` and `size="lg"`, when it renders, then the input is followed in `.input-group` by `button.btn.btn--lg.compare-toggle[type="button"]` with `aria-pressed="false"`, `aria-controls="password"` and the accessible name "Show password". (L2-069)
- **AC-10** Given focus on "Show password", when the owner presses Space and then Enter, then the input's `type` becomes `text` with `aria-pressed="true"` and then `password` with `aria-pressed="false"`, focus stays on the toggle, and the visible label stays "Show" throughout. (L2-067)
- **AC-11** Given no overrides, when the password field renders, then "Show", " password" and "(optional)" come from `$localize` strings with the IDs `st.textField.reveal`, `st.textField.revealContext` and `st.field.optional`, and with `revealLabel="Afficher"` and `revealContext="le mot de passe"` the toggle's name is "Afficher le mot de passe". (L2-070)

### States

- **AC-12** Given the owner saved an hourly rate of "-5" and the application sets `error` to "Enter an amount of 0 or more", when the field renders, then the input has `aria-invalid="true"`, keeps the value "-5", and `span.field__error` with that text follows the input group and is referenced by the input's `aria-describedby`. (L2-054)
- **AC-13** Given the spot editor's latitude 95 and the error "Enter a latitude from -90 to 90", when the error is cleared by setting `error` to `null`, then `aria-invalid` and the error's ID are removed and the `.field__error` element is gone. (L2-055)
- **AC-14** Given the "Booking link" with help "The studio's own booking page. Opens in a new tab for visitors." and the error "Enter a web address that starts with http:// or https://", when a screen reader reaches the input, then its description reads the error and then the help, matching their visual order. (L2-069)
- **AC-15** Given the footer signup's "Email address" submitted empty and the error "Enter your email address", when the field renders, then the input has `aria-invalid="true"` and `aria-describedby` naming the visible error under it. (L2-039)
- **AC-16** Given sign-in is submitting and both fields have `readonly` true, when the owner tabs through the form, then each input is a tab stop with the `readonly` attribute and the `--color-bg-surface-sunken` fill, the values "owner@shotthere.ca" and the dots stay visible, and "Show password" is natively disabled. (L2-067)
- **AC-17** Given "Provided by" whose form control is disabled while "I paid the full rate" is chosen, when the owner chooses "Discounted" and the application enables the control, then the input loses `disabled`, joins the tab order, and the `--color-bg-subtle` fill returns to `--color-bg-surface`. (L2-045)

### Keyboard and focus

- **AC-18** Given any text field in the studio editor, when a keyboard user tabs to it, then a 2 px `--color-focus-ring` outline is drawn flush with the edge (offset 0), the edge takes the same colour, and the ring has at least 3:1 against the editor surface; inside an input group the focused part's ring is not covered by its neighbour. (L2-067)

### Theming

- **AC-19** Given the default, invalid, read-only and prefixed fields in an editor section, the filters sheet and a fee row, when the contrast check runs in the light and the dark theme, then the value and "$" are at least 4.5:1 against their fills and the edge, invalid edge and focus ring are at least 3:1 against what surrounds them. (L2-068)

### Responsive

- **AC-20** Given the sign-in page at 320 px wide, when the large password with Show renders, then the input is at least 190 px wide, Show stays on the same line, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-21** Given an `inline` field labelled "Minimum booking (hours)" at 320 px wide, when it renders, then the input wraps under its label instead of overflowing, and nothing scrolls horizontally. (L2-064)
- **AC-22** Given the filters sheet at 360 px wide, when the "Minimum" and "Maximum" cost fields are measured, then each input is at least 44 px tall. (L2-065)
- **AC-23** Given the studio editor at 200 % zoom in a 1280 px viewport, when the owner reaches "Hourly rate" with its error, then the field, its "$" and the error are fully visible and editable with no horizontal page scroll. (L2-066)

### Screen readers

- **AC-24** Given `pages/sign-in/invalid` and the studio editor's invalid state, when axe-core scans them in light and dark, then no text field reports a label, name, `aria-describedby` or `autocomplete` violation. (L2-069)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the edge and invalid-shadow transitions take
0 ms and nothing shakes on error
([text-field.html](../../design-system/components/text-field.html), Accessibility › Motion).

### Performance

- **AC-25** Given the `text-field/performance` harness route with the studio editor's pricing and specification fields, when the owner types into "Hourly rate", then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/text-field/`:
  `text-field.component.ts` (`TextFieldComponent`, selector `st-text-field`,
  `providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: TextFieldComponent, multi: true }]`),
  `text-field.component.html`, `text-field.component.css` (port of `.field*`
  shared rules via the form-field contract, `.input*`, `.input-group`,
  `.addon`, `.search`, and the forced-colours rule for `.input`). Type
  `TextFieldType` (`'text' | 'email' | …`) in `src/lib/types/text-field-type.ts`.
- Host bindings: `class="field"` plus `field--inline` from a `computed`.
- Template: one `<input>` declared once inside an `<ng-template>` and placed in
  one of three wrappers (plain, `.input-group`, `.search`) by `@switch` on a
  `computed` layout, so the element and its listeners are defined once.
- Show toggle: `<button st-button type="button" [size]="size() === 'lg' ? 'lg' : 'md'" [pressed]="revealed()" [attr.aria-controls]="id()" [disabled]="disabled() || readonly()">`; `revealed` is a component signal, reset to `false` only by destruction; the rendered `type` is `revealed() ? 'text' : 'password'`.
- IDs: `inputId` or the hydration-safe generated ID, and the error and help
  IDs, come from the shared form-field helpers ([form-field.md](form-field.md)).
- ICD change (ICD-002 1.1.0, additive): §11.2 adds `.search` to the library
  component CSS row and §9.2 `TextFieldComponent` lists the `.search` block
  (D-5).
- Mock drift the component corrects: the editors' wrapping
  `<label class="field">` becomes `div.field` with a sibling label (DS);
  `style="flex: 1; min-width: 0;"` on the password is dropped; the hourly rate's
  `step="0.5"` and the fee amounts' missing `step` become `step="0.01"`; the
  price-changed "(required)" marker is not rendered.

## Decisions

- **D-1** *Which element carries `.field`?* The host `st-text-field`, as ICD-DOM-1 requires for a `div` block; label, input or group, error and help are its children in that order.
- **D-2** *Does the Show toggle tint when pressed? The DS button page says it keeps the secondary look.* It tints. ICD-002 D-9 and [button.md](button.md) D-4 give every `button[st-button]` with `pressed` true the `.compare-toggle` selected look, and the text field composes that button rather than restyling it.
- **D-3** *ICD-002 provides `concealLabel` ("Hide"), but the DS says Show keeps its name and `aria-pressed` carries the state.* The label stays `revealLabel` ("Show password") and `concealLabel` is accepted but not rendered. The DS rule follows the APG toggle-button pattern: a pressed "Hide password" would read as the opposite of its state. The product owner decided on 14 Oct 2026 to keep the input (ICD-002 D-15), so it stays, accepted and unrendered.
- **D-4** *What does the Show toggle do while the field is read-only or disabled?* It is natively disabled, and keeps its pressed state, as `pages/sign-in/submitting` draws it; the password cannot be revealed by someone who walks up while the request is in flight.
- **D-5** *ICD-002 §11.2 gives no owner to `.search`, which the admin search needs.* The text field owns it (additive §11.2 row entry); `type="search"` renders the wrapper and icon, because the application may not write library markup (ICD-DOM-4).
- **D-6** *The DS documents a unit suffix addon that no mock uses.* Not specified: the editors put the unit in the label, the DS says pick one per form, and ICD-002 has no suffix input.
- **D-7** *ICD-002 maps `size="sm"` to `.input--sm`, which the DS does not define.* The class is rendered and has no rule, so a small field looks medium (44 px, 16 px text). A shorter field would miss the 44 px phone target and a smaller font would make iOS zoom; no screen uses `sm`.
- **D-8** *`inline` exists in ICD-002 but no mock has an inline text field.* It renders `.field--inline` like the select's "Sort by", with the same wrapping rule; the DS says an inline field never shows an error, so the application does not pass one, and a message passed anyway goes on its own line ([form-field.md](form-field.md) D-7).
- **D-9** *Money fields in the mocks have `step="0.5"` or no step, which rejects cents.* Not the component's to decide (it renders `step` as given), but every money consumer passes `step="0.01"`, as the DS *Do and don't* requires; the filters' cost range keeps `step="10"` for its arrow keys.
- **D-10** *The filters' "All-in cost for 2 hours" puts two text fields in a `fieldset.filter-group`, and no ICD-002 component renders a filter group without options.* Out of this component's scope; reported to the ICD owner. The two text fields themselves are specified here.
- **D-11** *The signup mocks put the email error after the button row, outside the field; ICD-FORM-5 has the control render it in `.field__error`.* As [form-field.md](form-field.md) D-5 decides, the error renders inside the field, directly under the input, so the control owns `aria-invalid` and `aria-describedby`; keeping Subscribe aligned with the input is the application's `.signup__row` layout. Listed for the owner as a DS/ICD conflict.
- **D-12** *Is the generated `type` for a revealed password `text` even when the field is large?* Yes; size never changes the type, and `autocomplete="current-password"` stays on the input so password managers keep working.
