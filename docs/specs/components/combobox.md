# Combobox

| Field | Value |
|---|---|
| Selector | `st-search-field` |
| Library path | `frontend/projects/components/src/lib/search-field/` |
| Status | planned |
| Traces to | L2-060, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`combobox.html`](../../design-system/components/combobox.html) |
| Source mocks | [`dialogs/guide-entry-picker/default`](../../mocks/dialogs/guide-entry-picker/default.html), [`dialogs/guide-entry-picker/results`](../../mocks/dialogs/guide-entry-picker/results.html), [`dialogs/guide-entry-picker/no-matches`](../../mocks/dialogs/guide-entry-picker/no-matches.html), [`dialogs/guide-entry-picker/busy`](../../mocks/dialogs/guide-entry-picker/busy.html), [`dialogs/guide-entry-picker/invalid`](../../mocks/dialogs/guide-entry-picker/invalid.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html) |
| Rendering | [`combobox.html`](combobox.html) |

## Purpose and scope

The combobox lets the owner pick one published studio or spot by typing part
of its name. It lives in the guide editor's "Add an entry" dialog: the owner
types "studio", three matches appear under the field, the arrow keys move an
active option through them, and Enter picks one. DOM focus never leaves the
text box (APG Combobox, list autocomplete with automatic selection).

Use [`st-select`](select.md) when the options are few and fixed, and the plain
search input of [`st-text-field`](text-field.md) (`type="search"`) when typing
filters a table that is already on the page (the admin lists). Those have no
popup and are not comboboxes. The `.field` structure the combobox shares with
every control (label, error, help, `aria-describedby`) is specified in
[`form-field.md`](form-field.md); this CRD specifies only what is the
combobox's own.

Out of scope:

- Searching and filtering: the application queries the server, debounces
  typing (150 ms in the edit-guide design), and passes the matches as
  `options`. The component never filters, sorts or limits them (ICD-API-10).
- The 500 ms budget of L2-060.4 end to end: the application's debounce and
  request. The component's share is to render new options in the same frame.
- Which locations may be offered (published only) and the duplicate check
  ("This studio is already in the guide"): application rules, passed in as
  `options` and `error`.
- The dialog, its title, "Add entry" and "Cancel": [`st-dialog`](dialog.md) and
  [`button[st-button]`](button.md), owned by the application's
  `GuideEntryPickerDialogComponent`.

## Usage

Every `.search-field` and `.suggestions` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks search-field "div"` and `… suggestions "ul|div"`).
There is one product use, in five states.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/guide-entry-picker/default` | label "Studio or spot", help "Type part of a name", `listLabel` "Matching studios and spots", `options` `[]` | none | closed, empty field, focused on open | dialog body (`--color-bg-surface-raised`) |
| `dialogs/guide-entry-picker/results` | query "studio", three options with `meta` hints, `resultsText` "3 results" | none | expanded, first option active | dialog body |
| `dialogs/guide-entry-picker/no-matches` | query "parkdale", `options` `[]`, `noResultsText` "No published studios or spots match “parkdale”" | none | collapsed, message shown and announced | dialog body |
| `dialogs/guide-entry-picker/busy` | query "ju", `busy` true | none | spinner and "Searching…", field editable | dialog body |
| `dialogs/guide-entry-picker/invalid` | value "Leslieville Daylight Studio", `error` "This studio is already in the guide" | none | invalid, collapsed | dialog body |
| `pages/guide-editor/default` | (opener only) secondary sm "Add entry" with `aria-haspopup="dialog"` | — | — | — |

Every row is buildable with the API below: the query is the form value, the
matches are `options`, every visible or announced string is an input, and the
pick arrives through `optionSelected`.

## Anatomy

1. **Field** — `div.field`, the shared field column ([form-field.md](form-field.md)).
2. **Label** — `label.field__label` with `for` the text box. It names the combobox.
3. **Search box** — `div.search-field`, a positioning wrapper for the icon and the text box.
4. **Search icon** — [`st-icon`](icon.md) `name="search"` (`svg.icon`,
   `aria-hidden="true"`), `--icon-size-md`, `--color-fg-subtle`, centred on the
   52 px text box, `pointer-events: none`.
5. **Text box** — `input.input` with `role="combobox"`: full pill
   (`--radius-full`), at least `--control-height-lg` tall, left padding that
   clears the icon, 16 px body type.
6. **Error (when set)** — `span.field__error`, after the search box, before the help.
7. **Help (when set)** — `span.field__help` ("Type part of a name").
8. **Listbox** — `ul.suggestions` with `role="listbox"`, a sibling after the
   field. Raised surface, `--radius-lg`, `--shadow-3`; scrolls on its own after
   eight options. Always in the DOM; `hidden` when collapsed.
9. **Option** — `li.suggestion` with `role="option"`, at least
   `--target-comfortable` (44 px) tall. Holds the name (`span`, with the
   matched text in `mark`) and the hint (`span.suggestion__hint`, from `meta`).
10. **No-match box** — `div.suggestions` holding `p.suggestions__empty`, a
    sibling of the listbox, shown only when nothing matches.
11. **Busy line** — `div.cluster` with an `aria-hidden` small
    [`st-spinner`](spinner.md) and the busy text in `span.text-caption`.
12. **Status region** — `p.visually-hidden` with `role="status"`, always in the
    DOM, holding the one current announcement.

Host: `st-search-field` is `display: block` and carries no class. It wraps the
field, the listbox, the no-match box, the busy line and the status region,
which the design system draws as siblings (D-1).

## API

### Inputs

Shared form-control inputs (ICD-002 §9.2):

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | Visible `.field__label`; the combobox's accessible name ("Studio or spot"). |
| `inputId` | `string` | generated | no | `id` of the text box (ICD-FORM-6). The listbox, option, error, help and status IDs derive from it (D-11). |
| `name` | `string` | `''` | no | Native `name` on the text box. |
| `help` | `string \| null` | `null` | no | `.field__help`, joined to `aria-describedby` after the error. |
| `error` | `string \| null` | `null` | no | ICD-FORM-5: `.field__error`, `aria-invalid="true"`, error ID first in `aria-describedby` (D-9). |
| `optional` | `boolean` | `false` | no | Appends `optionalLabel` to the label. Not used by the picker. |
| `optionalLabel` | `string` | §12 `st.field.optional` | no | |
| `warning` | `string \| null` | `null` | no | **ICD change (additive, shared, [form-field.md](form-field.md) D-1).** Rendered and wired exactly as form-field.md specifies; not used by the picker. |
| `labelSuffix` | `string \| null` | `null` | no | **ICD change (additive, shared, [form-field.md](form-field.md) D-2).** Visually hidden text inside the label; not used by the picker. |

Combobox inputs:

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `options` | `readonly SuggestionOption[]` | `[]` | no | The listbox, in the given order, tracked by `value`. `label` is the option's name, `meta` its hint ("Studio · Leslieville"). The component never filters, sorts or trims the list. |
| `busy` | `boolean` | `false` | no | `aria-busy="true"` on the listbox, listbox collapsed, busy line shown, `busyLabel` announced. The text box stays editable and focused. |
| `listLabel` | `string` | — | yes | Listbox `aria-label` ("Matching studios and spots"). |
| `noResultsText` | `string \| null` | `null` | no | Shown in the no-match box and announced when the list is open, not busy, `options` is empty and the trimmed query is not. `null` shows and announces nothing (D-14). |
| `resultsText` | `string \| null` | `null` | no | **ICD change (additive).** Announced in the status region while the listbox is expanded ("3 results", "1 result"). The application formats the count (D-2). |
| `busyLabel` | `string` | §12 `st.searchField.busy` ("Searching…") | no | **ICD change (additive).** Busy line text and busy announcement (D-3). |

Inputs are signal inputs; `busy` and `optional` use `booleanAttribute`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `optionSelected` | `SuggestionOption` (the option object as given) | Enter on the active option while the listbox is expanded, or a click or tap on an option. Emitted once per pick, after the text box shows the option's `label` and the value has been reported (D-6). |

Value (ICD-FORM-1, ICD-FORM-2): the component is a `ControlValueAccessor` of
type `string`, the query. It reports every `input` event's text, and the picked
option's `label` on selection. It marks itself touched on blur. Disabled state
comes only from `setDisabledState` (ICD-FORM-3).

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Everything the combobox shows is an input. |

Library strings (ICD-002 §12): `st.field.optional` (shared) and, new,
`st.searchField.busy` "Searching…", overridden by `busyLabel`.

## Variants and sizes

| Variant | Trigger | Use for |
|---|---|---|
| Listbox with hints | `options` non-empty | The default: name plus "Kind · Neighbourhood" hint, so "… Studio" names stay distinct. |
| No-match message | `options` empty, query non-empty, `noResultsText` set | "No published studios or spots match “parkdale”". |

| Size | Field height | Option height | Type |
|---|---|---|---|
| One size | `--control-height-lg` (52 px) | at least `--target-comfortable` (44 px) | text box `--text-body` (16 px); hint `--text-caption`; no-match `--text-body-sm` |

Width is always 100 % of the container (the dialog body).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Closed, empty | no query, list not open | Field only; listbox `hidden` | `aria-expanded="false"`; `aria-controls` names the hidden listbox |
| Text box hover | `:hover` | `--field-border` to `--color-fg-muted` | — |
| Text box focus | `:focus-visible` | `--focus-ring-width` ring in `--color-focus-ring`, offset 0 | Focus in the text box for the whole interaction |
| Expanded | list open, not busy, `options` non-empty | Listbox shown under the field | `aria-expanded="true"`; `aria-activedescendant` names the active option; status reads `resultsText` |
| Active option | `aria-selected="true"` on one option | `--color-bg-subtle` fill, `--border-width-thick` inset bar in `--color-accent` on the left; forced colours `Highlight`/`HighlightText` | Read as the current option; other options carry `aria-selected="false"` |
| Option hover | `:hover` | `--color-bg-subtle` fill (no bar) | — (visual only, does not move the active option) |
| No matches | list open, not busy, `options` empty, query non-empty, `noResultsText` set | Listbox `hidden`; no-match box shown | `aria-expanded="false"`; status reads `noResultsText` |
| Busy | `busy` true | Listbox `hidden`; busy line with small spinner and "Searching…" | Listbox `aria-busy="true"`; `aria-expanded="false"`; status reads "Searching…"; text box editable |
| Invalid | `error` set | Danger edge on the text box; `.field__error` under it | `aria-invalid="true"`; error first in `aria-describedby` |
| Disabled | `setDisabledState(true)` | Text box sunken and faded (text-field disabled look); list closed | Native `disabled`; out of the tab order |
| Picked | Enter or click on an option | Text box shows the option's name; list closed | `aria-expanded="false"`; `optionSelected` emitted |

The text box has no active (pressed) state; options have no disabled or
invalid state (unpublished places are left out, and the error belongs to the
field). The open state is internal: input and ArrowDown open the list;
selection, Escape, Tab, blur and `writeValue` close it (D-5).

## Markup

```html
<!-- rendered: closed (dialog just opened) -->
<st-search-field>
  <div class="field">
    <label class="field__label" for="entry-search">Studio or spot</label>
    <div class="search-field">
      <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input class="input" id="entry-search" type="text" role="combobox" aria-expanded="false"
             aria-controls="entry-search-listbox" aria-autocomplete="list" autocomplete="off"
             aria-describedby="entry-search-help">
    </div>
    <span class="field__help" id="entry-search-help">Type part of a name</span>
  </div>
  <ul class="suggestions" id="entry-search-listbox" role="listbox" aria-label="Matching studios and spots" hidden></ul>
  <p class="visually-hidden" id="entry-search-status" role="status"></p>
</st-search-field>
```

```html
<!-- rendered: expanded, first option active (query "studio") -->
<input class="input" id="entry-search" type="text" role="combobox" aria-expanded="true"
       aria-controls="entry-search-listbox" aria-autocomplete="list" autocomplete="off"
       aria-activedescendant="entry-search-option-0" aria-describedby="entry-search-help">
…
<ul class="suggestions" id="entry-search-listbox" role="listbox" aria-label="Matching studios and spots">
  <li class="suggestion" id="entry-search-option-0" role="option" aria-selected="true"><span>Leslieville Daylight <mark>Studio</mark></span><span class="suggestion__hint">Studio · Leslieville</span></li>
  <li class="suggestion" id="entry-search-option-1" role="option" aria-selected="false"><span>Bloordale Sun <mark>Studio</mark></span><span class="suggestion__hint">Studio · Bloordale</span></li>
  <li class="suggestion" id="entry-search-option-2" role="option" aria-selected="false"><span>Riverside Rooftop <mark>Studio</mark></span><span class="suggestion__hint">Studio · Riverside</span></li>
</ul>
<p class="visually-hidden" id="entry-search-status" role="status">3 results</p>
```

```html
<!-- rendered: no matches (query "parkdale"); the listbox stays, hidden -->
<ul class="suggestions" id="entry-search-listbox" role="listbox" aria-label="Matching studios and spots" hidden></ul>
<div class="suggestions" aria-hidden="true"><p class="suggestions__empty">No published studios or spots match “parkdale”</p></div>
<p class="visually-hidden" id="entry-search-status" role="status">No published studios or spots match “parkdale”</p>
```

```html
<!-- rendered: busy (query "ju") -->
<ul class="suggestions" id="entry-search-listbox" role="listbox" aria-label="Matching studios and spots" aria-busy="true" hidden></ul>
<div class="cluster" aria-hidden="true"><span class="spinner spinner--sm"></span><span class="text-caption">Searching…</span></div>
<p class="visually-hidden" id="entry-search-status" role="status">Searching…</p>
```

```html
<!-- rendered: invalid (error first in aria-describedby) -->
<input class="input" id="entry-search" … aria-expanded="false" aria-invalid="true"
       aria-describedby="entry-search-error entry-search-help" value="Leslieville Daylight Studio">
</div>
<span class="field__error" id="entry-search-error">This studio is already in the guide</span>
<span class="field__help" id="entry-search-help">Type part of a name</span>
```

The busy line's spinner is the `st-spinner` host with `aria-hidden="true"`;
its inner markup is the spinner's. A `mark` appears only when the label
contains the trimmed query (D-7). ID values are generated from `inputId`; only
the relationships (`for`, `aria-controls`, `aria-activedescendant`,
`aria-describedby`) are contract.

```html
<!-- consumer: GuideEntryPickerDialogComponent -->
<st-dialog i18n-title title="Add an entry" size="form"
           i18n-description description="Search published studios and spots. The entry goes to the end of the list; move it after adding.">
  <st-search-field
    inputId="entry-search" [formControl]="query"
    i18n-label label="Studio or spot" i18n-help help="Type part of a name"
    i18n-listLabel listLabel="Matching studios and spots"
    [options]="matches()" [busy]="searching()" [error]="duplicateError()"
    [resultsText]="resultsText()" [noResultsText]="noResultsText()"
    (optionSelected)="pick($event)" />
  <ng-container slot="footer">
    <button st-button type="button" (click)="cancel()" i18n>Cancel</button>
    <button st-button variant="primary" type="button" [disabled]="!picked()" (click)="add()" i18n>Add entry</button>
  </ng-container>
</st-dialog>
```

## Design

- Field: `.field` column with `--space-1` between label, search box, error and help.
- Text box: `.input` from the text field (`--field-bg`, `--field-border`,
  `--field-fg`), `--radius-full`, min-height `--control-height-lg`, left padding
  `--space-4` + `--icon-size-md` + `--space-2`, `--text-body`.
- Icon: absolute at `--space-4` from the left, vertically centred on
  `--control-height-lg`, `--icon-size-md`, `--color-fg-subtle`.
- Listbox: margin-top `--space-2`, padding `--space-2`, `--color-bg-surface-raised`,
  `--border-width-hairline` `--color-border-default` edge, `--radius-lg`,
  `--shadow-3`, max-height eight options (`8 × --target-comfortable` plus padding), `overflow-y: auto`.
- Option: flex row that wraps, `--space-3` gap, min-height `--target-comfortable`,
  padding `--space-2` `--space-3`, `--radius-md`, `--color-fg-default`; name
  `overflow-wrap: anywhere`; `mark` bold (`--font-weight-bold`) with no fill.
- Hint: `--text-caption` in `--color-fg-subtle`.
- No-match: padding `--space-3`, `--text-body-sm` in `--color-fg-muted`, inside a `.suggestions` box.
- Busy line: `.cluster` with `--space-2` gap and `--space-3` above; spinner `st-spinner` small.
- Motion: only the text box border eases over `--duration-fast` with
  `--ease-standard`; the listbox appears and disappears without animation.
- Layer: the listbox is in the flow under the field, never floating, so the
  dialog body never clips it.

The combobox has no component tokens of its own; the text box re-skins through
the text field's `--field-*` tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Listbox surface | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Listbox edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Option text | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Active and hovered option fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Active option bar | `--color-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Hint, search icon | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| No-match message | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Text box edge | `--color-border-strong` (via `--field-border`) | `--palette-stone-500` | `--palette-stone-500` |
| Invalid edge | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Error text | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Option name on the listbox |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Option name on the active fill |
| `--color-fg-subtle` | `--color-bg-surface-raised` | 4.5:1 | Hint on the listbox |
| `--color-fg-subtle` | `--color-bg-subtle` | 4.5:1 | Hint on the active fill |
| `--color-accent` | `--color-bg-subtle` | 3:1 | Active-option bar |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | No-match message |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Text box edge in the dialog |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in the dialog |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Error text in the dialog |
| `--color-danger-solid` | `--color-bg-surface-raised` | 3:1 | Invalid edge in the dialog |

The search icon repeats the label's meaning and is decorative; it is checked
as `--color-fg-subtle` on `--color-bg-surface` (4.5:1) all the same.

Forced colours: the subtle fill and the inset bar disappear, so the active
option takes `Highlight` and `HighlightText` with `forced-color-adjust: none`
(design-system combobox D-9).

## Responsive behaviour

- The field and the listbox are 100 % of their container at every width. In
  the picker that is the dialog body: a bottom sheet below 36rem, a 40rem form
  panel above. The combobox has no breakpoint rules of its own.
- Options wrap: a long name breaks inside its span (`overflow-wrap: anywhere`)
  and the hint drops below the name instead of squeezing it.
- The text box uses 16 px type at every width, so iOS does not zoom on focus.
- Options are at least 44 px tall at every width, the whole row being the target.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom the listbox
  scrolls on its own after eight options and every option stays reachable.

## Accessibility

### Role and pattern

[APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), list
autocomplete with automatic selection: `input[type=text][role=combobox]` with
`aria-autocomplete="list"`, `aria-expanded`, `aria-controls` (always resolving,
because the listbox stays in the DOM, `hidden`) and `aria-activedescendant`;
`ul[role=listbox]` of `li[role=option]`. `autocomplete="off"` keeps the
browser's suggestions away.

### Keyboard

| Key | Action |
|---|---|
| Typing | Reports the query; opens the list. When options arrive, the first becomes active. |
| <kbd>↓</kbd> | Closed with options: opens the list, first option active. Open: next option, wrapping from last to first. |
| <kbd>↑</kbd> | Open: previous option, wrapping from first to last. Closed: nothing. |
| <kbd>Enter</kbd> | Open: picks the active option (D-6) and prevents the default action, so nothing is submitted. Closed: default behaviour. |
| <kbd>Esc</kbd> | Open (listbox or no-match box shown): closes it, keeps the text, stops propagation so the dialog stays open. Closed: not handled, so the dialog closes and returns focus to "Add entry" (D-8). |
| <kbd>←</kbd> <kbd>→</kbd> <kbd>Home</kbd> <kbd>End</kbd> | Move the caret in the text box; never the active option. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Closes the list without picking; focus moves on (to "Cancel"). |

### Focus

DOM focus stays in the text box throughout. The focus ring is on the text box
only; the active option shows by its fill and bar, never a second ring, and is
scrolled into view (`block: 'nearest'`) as it moves. Pressing an option keeps
focus in the text box (`mousedown` default prevented) and picks it on `click`.
The component never moves focus elsewhere; the dialog decides what happens
after a pick.

### Labelling

- Name: the visible label ("Studio or spot"). Description: the error (first,
  when set) then the help ("Type part of a name").
- Listbox name: `listLabel` ("Matching studios and spots").
- Option name: its text, name then hint ("Leslieville Daylight Studio Studio · Leslieville").
- Busy: `aria-busy="true"` on the listbox.

### Announcements

One persistent polite region (`p.visually-hidden[role=status]`) holds exactly
one of: `busyLabel` while busy; `resultsText` while expanded; `noResultsText`
when nothing matches; empty otherwise. The visible no-match box and busy line
are `aria-hidden`, so nothing is read twice (D-4). The text of the region
changes only when the state or the text changes, so each result count is
announced once.

### Motion

Only the text box border transition (`--duration-fast`, zeroed by
`prefers-reduced-motion: reduce`). The listbox never animates. The busy spinner
keeps turning under reduced motion because it reports status
([combobox.html](../../design-system/components/combobox.html), Accessibility › Motion).

## Content and internationalisation

- Label names what is picked, sentence case: "Studio or spot". No placeholder;
  the help says "Type part of a name".
- Options are the published name, never reworded; the typed text is bold.
  Hints are "Kind · Neighbourhood": "Studio · Leslieville", "Outdoor spot · Don Valley".
- Count: "1 result", "3 results", formatted and pluralised by the application.
- No match repeats the query in curly quotes: "No published studios or spots
  match “parkdale”". No apology, no exclamation mark.
- Busy: "Searching…" (library string `st.searchField.busy`).
- Errors say what is wrong with the pick: "This studio is already in the guide",
  "This spot is already in the guide".
- Translatable inputs: `label`, `help`, `error`, `listLabel`, `resultsText`,
  `noResultsText`, `busyLabel`, `optionalLabel`. Data: option `label` and `meta`.
- Longer translations wrap inside the field column and the option rows; nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs. `expanded`, `activeId`,
  `describedBy`, the status text and each option's split label (before, match,
  after) are `computed`; the template does no string work.
- Options render with `@for (option of options(); track option.value)`.
- One `keydown` and one `input` listener on the text box; no document listeners.
- Performance scenario: the `components-harness` route `combobox/performance`
  renders the picker with all twelve published locations as options (seven
  studios from Leslieville Daylight Studio to Ossington Blackbox, five spots
  from Evergreen Brick Works to Allan Gardens Conservatory) and moves the
  active option with ArrowDown; each keystroke must stay within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the listbox is in the flow under the field, so the dialog
  footer moves when it opens; that is the intended layout. Nothing shifts while
  typing within an open list.
- Weight: imports `@angular/core`, `@angular/forms` (accessor interfaces), and
  the library's `st-icon` and `st-spinner`. No CDK overlay, no listbox package.

## Acceptance criteria

### Rendering

- **AC-1** Given the "Add an entry" dialog opens with `label` "Studio or spot", `help` "Type part of a name" and `listLabel` "Matching studios and spots", when it renders, then the text box has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded="false"`, `autocomplete="off"`, the accessible name "Studio or spot" and description "Type part of a name", and its `aria-controls` names a `ul.suggestions[role=listbox]` that is in the DOM, `hidden`, and labelled "Matching studios and spots". (L2-069)
- **AC-2** Given the owner types "studio" and the application passes Leslieville Daylight Studio, Bloordale Sun Studio and Riverside Rooftop Studio, when the options render, then the text box has `aria-expanded="true"`, the listbox shows three `li.suggestion[role=option]`, the first has `aria-selected="true"` and is named by `aria-activedescendant`, and the other two have `aria-selected="false"`. (L2-060)
- **AC-3** Given the same three options with `meta` "Studio · Leslieville", "Studio · Bloordale" and "Studio · Riverside", when they render, then each name shows "Studio" inside a `mark` and each hint sits in `.suggestion__hint`, and the first option's accessible name is "Leslieville Daylight Studio Studio · Leslieville". (L2-069)
- **AC-4** Given `resultsText` "3 results", when the listbox expands, then the persistent `role="status"` region contains "3 results" and the text is announced once. (L2-069)

### States

- **AC-5** Given the query "parkdale", `options` empty and `noResultsText` "No published studios or spots match “parkdale”", when it renders, then the listbox is `hidden` and still named by `aria-controls`, `aria-expanded` is "false", the sentence shows in `.suggestions__empty`, and the status region announces it. (L2-069)
- **AC-6** Given the query "ju" and `busy` true, when it renders, then the listbox has `aria-busy="true"` and is `hidden`, a small spinner and "Searching…" show under the field, the status region announces "Searching…", and the text box keeps focus and accepts more typing. (L2-069)
- **AC-7** Given the application sets `error` "This studio is already in the guide" after Leslieville Daylight Studio is picked for "Best for headshots", when it renders, then the text box has `aria-invalid="true"`, `aria-describedby` lists the error ID before the help ID, and `.field__error` sits between the search box and the help. (L2-069)
- **AC-8** Given that duplicate error, when the owner reads the dialog, then the message "This studio is already in the guide" is visible under the field and the listbox stays collapsed. (L2-060)

### Keyboard and focus

- **AC-9** Given the three results with Leslieville Daylight Studio active, when the owner presses ArrowDown, then Bloordale Sun Studio becomes `aria-selected="true"` and is named by `aria-activedescendant`, Leslieville Daylight Studio becomes `aria-selected="false"`, and `document.activeElement` is still the text box. (L2-067)
- **AC-10** Given Riverside Rooftop Studio, the last option, is active, when the owner presses ArrowDown, then Leslieville Daylight Studio becomes active; and given it is active, when the owner presses ArrowUp, then Riverside Rooftop Studio becomes active. (L2-067)
- **AC-11** Given Bloordale Sun Studio is active, when the owner presses Enter, then `optionSelected` emits `{ value: 'bloordale-sun-studio', label: 'Bloordale Sun Studio', meta: 'Studio · Bloordale' }` once, the form value and the text box read "Bloordale Sun Studio", `aria-expanded` is "false", and the dialog is neither submitted nor closed. (L2-060)
- **AC-12** Given the listbox is expanded, when the owner presses Escape, then the listbox collapses, the text "studio" stays, and the dialog stays open; when the owner presses Escape again, then the event reaches the dialog, which closes. (L2-067)
- **AC-13** Given the list was closed with Escape and the options are still three, when the owner presses ArrowDown, then the listbox expands with Leslieville Daylight Studio active. (L2-067)
- **AC-14** Given the listbox is expanded, when the owner presses Tab, then the listbox collapses, `optionSelected` is not emitted, and focus moves to "Cancel". (L2-067)
- **AC-15** Given the listbox is expanded, when the owner presses Home, End, ArrowLeft or ArrowRight, then the caret moves in the text box and the active option does not change. (L2-067)
- **AC-16** Given the listbox is expanded, when the owner clicks Riverside Rooftop Studio, then `optionSelected` emits that option, the text box reads "Riverside Rooftop Studio", and focus is in the text box. (L2-060)
- **AC-17** Given focus enters the text box from the keyboard, when it renders in the dialog, then a `--focus-ring-width` (2 px) ring in `--color-focus-ring` surrounds the text box with at least 3:1 contrast against the dialog surface, and the active option shows only its `--color-bg-subtle` fill and `--color-accent` bar, with no second ring. (L2-067)

### Screen readers

- **AC-18** Given the picker in its closed, results, no-match, busy and invalid states, when axe-core scans each in light and dark, then it reports no violations. (L2-069)

### Theming

- **AC-19** Given the results state in the light and the dark theme, when the contrast check runs, then option names and hints are at least 4.5:1 on `--color-bg-surface-raised` and on `--color-bg-subtle`, the active bar and the text box edge are at least 3:1 against what surrounds them, and the error text is at least 4.5:1 on the dialog surface. (L2-068)

### Responsive

- **AC-20** Given the picker at 320 px wide (bottom sheet) with the option "Allan Gardens Conservatory" and hint "Outdoor spot · Garden District", when it renders, then the field and listbox fill the dialog body, the name wraps inside its row, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-21** Given the results at 360 px and at 1280 px, when each option and the text box are measured, then every option is at least 44 px tall and the text box is 52 px tall. (L2-065)
- **AC-22** Given twelve options at 200 % zoom in a 1280 px viewport, when the owner scrolls the listbox and moves through it with the arrow keys, then the listbox scrolls inside itself, the active option is scrolled into view, and every option is reachable with no horizontal page scroll. (L2-066)

### Content and internationalisation

- **AC-23** Given `busyLabel` is not set, when the busy state renders, then the text is the `$localize` string `@@st.searchField.busy` "Searching…"; and given `busyLabel` "Recherche…", then that text is shown and announced instead. (L2-070)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the listbox
appears and disappears without animation, the text box border transition is 0
ms under `prefers-reduced-motion: reduce`, and the busy spinner keeps turning
([combobox.html](../../design-system/components/combobox.html), Accessibility › Motion).

### Performance

- **AC-24** Given the `combobox/performance` harness route with twelve options, when the owner types "o" and presses ArrowDown five times, then each interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/search-field/`:
  `search-field.component.ts` (`SearchFieldComponent`, selector
  `st-search-field`, `NG_VALUE_ACCESSOR`), `search-field.component.html`,
  `search-field.component.css` (port of `.search-field`, `.suggestions`,
  `.suggestion*`, `.suggestions__empty` and the forced-colours rule; the shared
  `.field*` and `.input*` rules per [form-field.md](form-field.md) and
  [text-field.md](text-field.md)). `SuggestionOption` is in `src/lib/types/`.
- The icon is an `st-icon` host inside `.search-field`; the ported rule
  positions that host (`.search-field > st-icon`), because the `svg.icon` is
  inside the icon's own template.
- State signals: `value`, `open`, `activeIndex`, `disabled`. `expanded =
  open() && !busy() && options().length > 0`; `noMatches = open() && !busy() &&
  options().length === 0 && value().trim() !== '' && noResultsText() !== null`.
  An `effect` resets `activeIndex` to 0 whenever `options` changes.
- Highlight: a `computed` splits each label at the first case-insensitive
  occurrence of the trimmed query into before, match and after text; the
  template renders them as text with the match in `mark` (ICD-SEC-1, no `innerHTML`).
- `scrollIntoView({ block: 'nearest' })` on the active option runs in
  `afterRenderEffect`, so it never runs on the server (ICD-SSR-1).
- IDs: `inputId` or the library's SSR-stable generated ID; listbox
  `{id}-listbox`, options `{id}-option-{index}`, error `{id}-error`, help
  `{id}-help`, status `{id}-status`.
- ICD change (ICD-002 1.1.0, additive): `SearchFieldComponent` gains
  `resultsText` and `busyLabel`; §12 gains `st.searchField.busy` "Searching…"
  overridden by `st-search-field` `busyLabel`.
- Mocks drift the component corrects: the no-matches mock replaces the listbox
  with a `div` carrying its ID (the listbox now stays, hidden); the invalid mock
  lists help before error in `aria-describedby`; the mocks' `autofocus` is the
  dialog's initial focus, which the application sets by focusing the element
  with the `inputId` it chose once the dialog has opened (the component never
  autofocuses); "Cancel" and "Close" drawn as links are buttons in the product.

## Decisions

- **D-1** *What does the host carry, given the design system draws the field, listbox and messages as siblings?* The host `st-search-field` is a classless block that wraps all of them. ICD-DOM-1 puts the block class on the host only when the component is one block; here `.field` is one part among five, and putting `.field` on the host would pull the listbox inside the field's 4 px column.
- **D-2** *How does the count "3 results" reach the status region?* Through a new optional input `resultsText` (additive, ICD-002 1.1.0). The library never formats numbers or plurals (ICD-I18N-4, ICD-I18N-5), the design system requires the count to be announced, and no existing input carries it.
- **D-3** *Where does "Searching" come from, and is it shown as "Searching" or "Searching…"?* A new library string `st.searchField.busy` "Searching…" with an override input `busyLabel` (additive). One string serves the visible line and the announcement; the design system's visible "Searching" without the ellipsis would need a second string for no user benefit.
- **D-4** *The design system puts `role="status"` on the inserted no-match paragraph and on a hidden "Searching…" span; how are announcements made?* One persistent visually hidden `role="status"` region that is in the DOM from the first render and changes its text. Live regions inserted together with their text are not announced reliably by every screen reader. The visible no-match box and busy line are `aria-hidden` so their text is not read twice.
- **D-5** *When is the list "open"?* Open after an `input` event or ArrowDown; closed after a pick, Escape, Tab, blur or a value written by the form. Expanded only while open, not busy and with options; the design system's busy mock shows the listbox hidden while results load.
- **D-6** *What does a pick do to the text box?* It writes the option's `label` into the text box, reports it as the control value, closes the list, then emits `optionSelected`. The design system says "its name fills the text box"; doing it in the component keeps every consumer's pick identical.
- **D-7** *Is highlighting the match a business rule the library must not hold?* No. It is presentation of the query the component already holds: the first case-insensitive occurrence of the trimmed query in the label is wrapped in `mark`; when there is none, the label renders plain. The component still never filters (ICD-API-10).
- **D-8** *The results mock's note has Escape close the whole dialog while the list is open.* The first Escape closes the list and stops propagation; the second reaches the dialog. This follows APG, as the design system decided.
- **D-9** *The invalid mock lists the help before the error in `aria-describedby`.* The error comes first, as on every other field (design-system drift fix, ICD-FORM-5).
- **D-10** *Does hovering an option make it active?* No. Hover is a fill only; the active option moves by keyboard or by the application's new options. Pointer users pick by clicking, and a hover that moved `aria-activedescendant` would make screen readers announce options the pointer merely crosses.
- **D-11** *How are option IDs made?* From the text box ID and the index (`entry-search-option-0`). They only have to be unique and stable during hydration; the mocks' `opt-leslieville` style is not contract.
- **D-12** *Who meets L2-060.4's 500 ms?* The application: its 150 ms debounce plus the request. The component renders new options in the next frame, which AC-24 bounds through the INP budget.
- **D-13** *What does disabled look like, given no mock disables the picker?* The text field's disabled look with native `disabled` on the text box and the list closed, so the control behaves like every other ICD-002 §9.2 control.
- **D-14** *What shows when nothing matches and `noResultsText` is `null`?* Nothing: the listbox stays collapsed and nothing is announced. The picker always supplies the sentence; a consumer that does not is choosing silence.
