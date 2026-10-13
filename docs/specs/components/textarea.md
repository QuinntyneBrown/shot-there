# Textarea

| Field | Value |
|---|---|
| Selector | `st-textarea` |
| Library path | `frontend/projects/components/src/lib/textarea/` |
| Status | planned |
| Traces to | L2-054, L2-055, L2-060, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`textarea.html`](../../design-system/components/textarea.html) |
| Source mocks | [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/studio-editor/submitting`](../../mocks/pages/studio-editor/submitting.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/published`](../../mocks/pages/spot-editor/published.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html), [`pages/guide-editor/published`](../../mocks/pages/guide-editor/published.html), [`pages/guide-editor/new`](../../mocks/pages/guide-editor/new.html) |
| Rendering | [`textarea.html`](textarea.html) |

## Purpose and scope

The textarea is room to write a few sentences that visitors will read on the
public page: who a studio is for and who should skip it, a guide's
introduction, the editor's note on each guide entry, how to get to a spot. Only
the owner writes in ShotThere, so every textarea is in an editor. It shares the
text field's look and grows by rows, not by size modifiers. With `maxlength`
it shows a character counter and an over-limit state.

A short phrase that fits on one line ("Shared, down the hall", "Bench for 3")
is an [`st-text-field`](text-field.md). The label, help, error, warning,
optional marker, hidden label suffix, generated ID, `aria-describedby`,
`aria-invalid` and forms-API behaviour are the shared
[form-field](form-field.md) contract; this CRD specifies only what is the
textarea's own: the native `textarea`, `rows`, and the `maxlength` counter.

Out of scope:

- Every shared input and the field markup: [form-field](form-field.md).
- Whether text over the limit is refused, and the error that says so: the
  application and the server (ICD-FORM-5, L2-078). The textarea shows the count
  and the over-limit state; it never truncates and never decides validity.
- Auto-growing height: not offered; the owner drags the box taller.

## Usage

Every `.textarea` in `docs/mocks/` (grep `class="textarea`), grouped by
configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio-editor/*` Verdict | `rows` 3, `inputId` "verdictFor", "verdictSkip" | "Who it's for": "Portrait and fashion shooters who want big north light and a usable cyc on a mid-range budget."; "Who should skip it": "Video crews and anyone hauling heavy cases." | empty (`new`), filled, editable while saving (`submitting`) | surface (editor section) |
| `pages/guide-editor/*` Basics | `rows` 4 (default), `inputId` "intro" | "Introduction": "Every studio here costs less than $120.00 all-in for two hours, fees included." | empty (`new`), filled | surface |
| `pages/guide-editor/*` Entries | `rows` 2, `labelSuffix` per entry, `name` "entries[n].note" | "Editor's note" + hidden "for Leslieville Daylight Studio": "East windows give clean morning light for a whole headshot day." | filled | surface (entry row) |
| `pages/spot-editor/*` How to get there | `rows` 2, `inputId` "transit", "driving", "walking" | "Transit": "TTC 28A shuttle from Davisville or Broadview station."; "Driving": "Via Bayview Ave. Paid lot on site."; "Walking": "20 minutes down the Beltline from Moore Park." | filled | surface |

No mock sets a character limit, an error, a disabled or a read-only textarea.
The counter and over-limit state exist because ICD-002 gives the textarea a
`maxlength` input; the error and disabled states follow the shared field
contract and the text field's look.

## Anatomy

1. **Field** — the host `st-textarea` carries `.field` (see [form-field](form-field.md)).
2. **Label** — `label.field__label` for the textarea, with the optional hidden
   suffix and marker.
3. **Text area** — native `textarea.textarea`: `--text-body` (16 px) in
   `--field-fg`; padding `--space-2` `--space-3`; `--radius-md`;
   `--border-width-hairline` edge in `--field-border`; at least
   `--control-height-md` tall; `rows` sets the starting height; full width.
4. **Resize handle** — `resize: vertical`: taller, never wider than the column.
5. **Message slot** — `.field__error` or `.field__warning` (shared).
6. **Help** — `.field__help` (shared).
7. **Counter (with `maxlength`)** — `span.field__counter`, last in the field:
   "120 of 300 characters". `.field__counter--over` when the count passes the
   limit. A visually hidden polite live region beside it carries the throttled
   announcement.

## API

### Inputs

Shared inputs `label` (required), `inputId`, `name`, `help`, `error`,
`warning`, `optional`, `optionalLabel`, `labelSuffix`: see
[form-field › Shared inputs](form-field.md#shared-inputs). Own inputs:

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `rows` | `number` | `4` | no | Native `rows`; `numberAttribute`. The starting height. The editors use 2, 3 and 4. |
| `maxlength` | `number \| null` | `null` | no | `numberAttribute`. With a value, renders the counter `st.textarea.counter` ("{$count} of {$max} characters"), its polite throttled live region, and the over-limit state when the count exceeds it. Not written as the native `maxlength` attribute (D-1). `null` renders no counter. |

Value: `string` (ICD-FORM-2): `writeValue(null)` shows `''`. The value is
reported on every `input` event and the control is touched on `blur`
(ICD-FORM-4). Disabled only through `setDisabledState` (ICD-FORM-3). The count
is the value's `length` in UTF-16 code units, the same unit the server and the
HTML `maxlength` rule use (D-3).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The value reaches the application through the forms API. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Every string arrives through inputs. |

Library strings (ICD §12): `st.textarea.counter` "{$count} of {$max} characters"
(placeholders, no override input), and `st.field.optional` from the shared field.

## Variants and sizes

There is one textarea. What changes from use to use is `rows`, `labelSuffix`
and whether `maxlength` is set.

| Use | Rows | Limit |
|---|---|---|
| Introduction (guide) | 4 (default) | none |
| Who it's for, Who should skip it (studio) | 3 | none |
| Editor's note (guide entry) | 2 | none |
| Transit, Driving, Walking (spot) | 2 | none |

No size modifiers. Height starts at `rows` lines over a `--control-height-md`
(44 px) minimum, so rows 2, 3 and 4 each open at their own height; text is
16 px at every width.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (empty, filled) | — | `--field-bg` fill, `--field-border` edge | Multi-line textbox, name from the label |
| Hover | `:hover` | Edge `--color-fg-muted` | — |
| Focus | `:focus-visible` | Edge and 2 px ring in `--color-focus-ring`, offset 0, flush with the edge | Focus in the box |
| Invalid | `error` non-empty | Double edge in `--color-danger-solid` (hairline border plus hairline inset shadow); `.field__error` under the box | `aria-invalid="true"`; description: error, help, counter |
| Warning | `warning` non-empty | Field well and warning line (shared); edge unchanged | Description starts with the warning |
| Disabled | `setDisabledState(true)` | `--color-bg-subtle` fill, `--color-fg-disabled` text, `--color-border-default` edge, `not-allowed` cursor; counter stays | Out of the tab order, "dimmed" |
| Counting | `maxlength` set, count ≤ limit | `.field__counter` in `--color-fg-muted` | Counter in the description; live region updated after typing pauses |
| Over limit | count > `maxlength` | `.field__counter--over`: `--color-danger-fg` with the "⚠" glyph; the box is unchanged unless `error` is set | The counter text says the count; announced after the pause; not invalid by itself |
| While saving | the editor's Save is busy | No change: textareas stay editable | — |

## Markup

```html
<!-- rendered: verdict (studio editor) -->
<st-textarea class="field">
  <label class="field__label" for="verdictFor">Who it's for</label>
  <textarea class="textarea" id="verdictFor" name="verdictFor" rows="3"></textarea>
</st-textarea>
```

```html
<!-- rendered: editor's note with hidden suffix (guide editor) -->
<st-textarea class="field">
  <label class="field__label" for="note-1">Editor's note<span class="visually-hidden"> for Kensington Window Room</span></label>
  <textarea class="textarea" id="note-1" name="entries[1].note" rows="2"></textarea>
</st-textarea>
```

```html
<!-- rendered: invalid, error then help -->
<st-textarea class="field">
  <label class="field__label" for="verdictFor">Who it's for</label>
  <textarea class="textarea" id="verdictFor" name="verdictFor" rows="3"
            aria-invalid="true" aria-describedby="verdictFor-error verdictFor-help"></textarea>
  <span class="field__error" id="verdictFor-error">Write who this studio is for</span>
  <span class="field__help" id="verdictFor-help">Visitors read this first on the studio's page.</span>
</st-textarea>
```

```html
<!-- rendered: with maxlength 300, within and over the limit -->
<st-textarea class="field">
  <label class="field__label" for="intro">Introduction</label>
  <textarea class="textarea" id="intro" name="introduction" rows="4" aria-describedby="intro-counter"></textarea>
  <span class="field__counter" id="intro-counter">120 of 300 characters</span>
  <span class="visually-hidden" aria-live="polite">120 of 300 characters</span>
</st-textarea>

<span class="field__counter field__counter--over" id="intro-counter">312 of 300 characters</span>
```

The counter is the last part of the field and the last ID in
`aria-describedby` (after the message and the help). The live region is
present, empty, from first render whenever `maxlength` is set, so later text is
announced.

```html
<!-- consumer -->
<st-textarea i18n-label label="Who it's for" inputId="verdictFor" name="verdictFor" [rows]="3"
             formControlName="verdictFor" [error]="errors().verdictFor ?? null" />

<st-textarea i18n-label label="Editor's note" [labelSuffix]="entry.noteSuffix" [inputId]="'note-' + $index"
             [name]="'entries[' + $index + '].note'" [rows]="2" [formControl]="entry.controls.note" />

<st-textarea i18n-label label="Introduction" inputId="intro" name="introduction" [maxlength]="300"
             formControlName="introduction" />
```

## Design

- Box: full width, `min-height: --control-height-md`, padding `--space-2`
  `--space-3`, `--text-body`, `--radius-md`, `--border-width-hairline` edge,
  `resize: vertical`. Placeholder (never used in ShotThere) `--color-fg-subtle`.
- Focus: `outline: --focus-ring-width solid --color-focus-ring`,
  `outline-offset: 0`, edge `--color-focus-ring`.
- Invalid: edge `--color-danger-solid` plus an inset hairline shadow in the same
  colour.
- Edge and shadow transition over `--duration-fast` with `--ease-standard`.
- Counter: `--text-body-sm`, `--color-fg-muted`, tabular figures; over limit
  `--color-danger-fg` with the "⚠" glyph `--space-1` before the words, as on
  `.field__error` (D-2).

Component tokens (declared on `.textarea`, shared with the text field; every
state overrides them instead of setting colours):

| Token | Aliases | Overridden by |
|---|---|---|
| `--field-bg` | `--color-bg-surface` | disabled `--color-bg-subtle` |
| `--field-border` | `--color-border-strong` | hover `--color-fg-muted`; focus `--color-focus-ring`; invalid `--color-danger-solid`; disabled `--color-border-default` |
| `--field-fg` | `--color-fg-default` | disabled `--color-fg-disabled` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Text | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Hover edge | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Focus edge and ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Invalid edge | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Disabled fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Disabled text | `--color-fg-disabled` | `--palette-stone-300` | `--palette-stone-700` |
| Counter | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Counter over limit | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Text in the box |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Edge in an editor section |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Edge on the page |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Counter |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Counter over limit, error |

Disabled text is exempt from contrast minimums (WCAG 1.4.3). Forced colours:
the box keeps a `CanvasText` edge and opts out of forced-colour adjustment, as
the other field controls do.

## Responsive behaviour

- Full width of its column at every breakpoint; in the guide editor's entry row
  the note takes the row's remaining width beside the rank and move buttons.
  Nothing changes by breakpoint.
- Long text wraps inside the box; there is never a horizontal scrollbar. The
  owner can drag the box taller and the page grows with it.
- 16 px text at every width, so phones do not zoom on focus.
- Even at two rows the box is taller than 44 px, and tapping the label focuses
  it.
- At 320 px nothing scrolls horizontally; at 200 % zoom the box, its label,
  messages and counter stay visible and usable.

## Accessibility

### Role and pattern

Native `textarea` (a multi-line textbox) with a `label for`; descriptions and
`aria-invalid` from the shared field ([form-field](form-field.md)). The counter
pattern follows the GOV.UK character count: a visible count referenced as a
description, and a separate polite region that speaks only after typing pauses.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves into and out of the textarea; Tab never inserts a tab character. |
| <kbd>Enter</kbd> | Inserts a new line. It never submits the editor; Save changes does. |
| Arrow keys, <kbd>Home</kbd>, <kbd>End</kbd> | Move the caret (browser behaviour). |

### Focus

The ring sits flush on the edge (offset 0) and the edge turns to the ring
colour: 2 px at 3:1 or more. The component never moves focus; the error
summary's link moves focus into the textarea by its `inputId`.

### Labelling

A visible label always. Repeated labels take `labelSuffix` ("Editor's note for
Leslieville Daylight Studio") so each accessible name is unique and starts with
the visible words (WCAG 2.5.3). The description is the message, the help, then
the counter.

### Announcements

With `maxlength`, the live region (`aria-live="polite"`) receives the counter
text 1000 ms after the last `input` event, so a typist hears "120 of 300
characters" once per pause, never per keystroke. Without `maxlength` there is
no live region.

### Motion

Edge colour transitions over `--duration-fast`, which the tokens set to 0 under
`prefers-reduced-motion: reduce`. Resizing is direct, never animated.

## Content and internationalisation

- The verdict names people, not features: "Portrait and fashion shooters who
  want…", "Video crews and anyone hauling heavy cases."
- Editor's notes give the reason for the rank in one or two sentences, with the
  number that matters: "$80.00 all-in. The cheapest good window in the city;
  book mornings."
- Directions start with the route, then the walk: "TTC 28A shuttle from
  Davisville or Broadview station."
- Canadian spelling, metric first, prices with cents ($120.00): the owner's
  text, not the component's.
- Error wording follows the editors: a verb, then what is missing: "Write who
  this studio is for".
- Counter: the library string `st.textarea.counter` with `{$count}` and
  `{$max}` placeholders (ICD-I18N-5), never concatenated. The numbers are plain
  integers; the library formats nothing (ICD-I18N-4, D-4).
- Translatable inputs: the shared ones. Data: studio and spot names in
  `labelSuffix`; the value is the owner's text.

## Performance

- Change detection: `OnPush`; the count, over-limit flag and counter text are
  `computed` from a value signal updated on `input`; the live-region text is a
  separate signal set by a 1000 ms debounce timer that is cleared on each
  `input` and on destroy.
- No layout reads on input; resizing is the browser's.
- Performance scenario: the `components-harness` route `textarea/performance`
  renders the three "Best for headshots" editor's notes and the guide
  Introduction with `maxlength` 300, then types the Introduction "Every studio
  here costs less than $120.00 all-in for two hours, fees included." one key at
  a time; each keystroke's interaction must stay within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the counter line is rendered from first paint when
  `maxlength` is set, so starting to type moves nothing.
- Weight: `@angular/core`, `@angular/forms` (accessor), `@angular/localize`.

## Acceptance criteria

### Rendering

- **AC-1** Given `st-textarea` with label "Who it's for", `inputId` "verdictFor", `name` "verdictFor" and `rows` 3, when it renders in the studio editor, then the host has the class `field`, the label's `for` is "verdictFor", and the field holds a native `textarea.textarea` with `id="verdictFor"`, `name="verdictFor"` and `rows="3"`. (L2-054)
- **AC-2** Given the guide Introduction with no `rows` input, when it renders, then the textarea has `rows="4"` and is taller than a `rows="2"` editor's note beside it. (L2-060)
- **AC-3** Given three editor's notes with label "Editor's note" and `labelSuffix` "for Leslieville Daylight Studio", "for Kensington Window Room" and "for Riverside Rooftop Studio", when a screen reader lists the form fields, then the names are "Editor's note for Leslieville Daylight Studio", "Editor's note for Kensington Window Room" and "Editor's note for Riverside Rooftop Studio". (L2-060)
- **AC-4** Given Evergreen Brick Works' "Transit", "Driving" and "Walking" textareas with `rows` 2, when the spot editor renders them, then each shows its saved directions ("TTC 28A shuttle from Davisville or Broadview station.") in a box at least 44 px tall. (L2-055)

### Value and forms API

- **AC-5** Given "Who should skip it" bound with `formControlName` and patched with `null`, when the owner types "Video crews", then the box first shows "", the form value is updated on each keystroke, it ends as "Video crews", and the control is touched only after focus leaves. (L2-054)
- **AC-6** Given "Who it's for" disabled through the forms API, when a keyboard user tabs through the Verdict section, then the textarea has native `disabled`, the `--color-bg-subtle` fill, and is skipped. (L2-054)

### Keyboard and focus

- **AC-7** Given focus in "Who it's for" inside the editor form, when the owner presses Enter, then a new line is inserted and the form is not submitted. (L2-067)
- **AC-8** Given focus in the Transit textarea, when the owner presses Tab, then focus moves to the Driving textarea and no tab character is inserted. (L2-067)
- **AC-9** Given a keyboard user tabs into the Introduction, when it receives focus, then a 2 px `--color-focus-ring` ring is drawn flush with the edge at 3:1 or more against `--color-bg-surface`. (L2-067)

### Messages

- **AC-10** Given "Who it's for" with error "Write who this studio is for" and help "Visitors read this first on the studio's page.", when it renders, then the textarea has `aria-invalid="true"`, the `--color-danger-solid` double edge, and `aria-describedby` lists the error then the help. (L2-069)

### Counter

- **AC-11** Given the Introduction with `maxlength` `null`, when it renders, then there is no `.field__counter`, no live region, and `aria-describedby` is absent. (L2-069)
- **AC-12** Given the Introduction with `maxlength` 300 and a 120-character value, when it renders, then `span.field__counter` reads "120 of 300 characters", it is the last ID in the textarea's `aria-describedby`, and the textarea has no native `maxlength` attribute. (L2-069)
- **AC-13** Given focus in that Introduction, when the owner types five characters quickly and then stops, then the visible counter reads "125 of 300 characters" after the fifth key, and the polite live region changes once, about 1 s after the last key, to "125 of 300 characters". (L2-069)
- **AC-14** Given the Introduction with `maxlength` 300, when the owner pastes text that brings it to 312 characters, then all 312 characters are kept, the counter reads "312 of 300 characters" with the class `field__counter--over`, `--color-danger-fg` and the "⚠" glyph, and the textarea has no `aria-invalid` until the application sets an error. (L2-068)
- **AC-15** Given the application's `ng extract-i18n`, when the messages file is inspected, then the counter is the single message `st.textarea.counter` "{$count} of {$max} characters" with two placeholders. (L2-070)

### Theming

- **AC-16** Given a filled, a focused, an invalid and an over-limit textarea in an editor section, when the contrast check runs in light and dark, then text and counter are at least 4.5:1 on `--color-bg-surface` and the edge, invalid edge and focus ring are at least 3:1. (L2-068)

### Responsive

- **AC-17** Given the guide editor at 320 px with Kensington Window Room's note "$80.00 all-in. The cheapest good window in the city; book mornings.", when it renders, then the text wraps inside the box, the box has no horizontal scrollbar, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-18** Given the Introduction, when the owner drags its resize handle down and to the right, then it grows taller only, and its width stays the column's. (L2-064)
- **AC-19** Given the spot editor at 360 px, when a `rows="2"` Transit textarea is measured, then it is at least 44 px tall and its label is part of the tap target. (L2-065)
- **AC-20** Given the guide editor at 200 % zoom in a 1280 px viewport, when the owner edits the Introduction, then its label, box and counter are visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the edge
transition takes 0 ms under `prefers-reduced-motion: reduce`, and resizing is
never animated ([textarea.html](../../design-system/components/textarea.html), Accessibility › Motion).

### Performance

- **AC-21** Given the `textarea/performance` harness route with the Introduction limited to 300 characters, when the owner types its 78-character sentence one key at a time, then every keystroke's interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/textarea/`: `textarea.component.ts`
  (`TextareaComponent`, selector `st-textarea`, extends the shared `FieldControl`
  from [form-field](form-field.md), provides `NG_VALUE_ACCESSOR`),
  `textarea.component.html` (label, `textarea`, message, help, counter, live
  region), `textarea.component.css` (`@import` of `form-field.css`, the
  `.textarea` rules and `.input, .select, .textarea` shared rules from
  `components.css`, the forced-colours rule, and the counter rules).
- Counter text: `$localize\`:@@st.textarea.counter:${count}:count: of ${max}:max: characters\``.
- The `.field__counter` and `.field__counter--over` classes are new DOM
  contract in the library-owned `.field*` family (ICD §11.2); the design system
  page catches up with them at the next extraction (D-2). No ICD-002 change.
- Mock drift the component corrects: every editor textarea wrapped in
  `label.field` becomes a sibling `label for`; the verdict textareas gain IDs;
  the old 110 px minimum height is 44 px, so `rows` takes effect.

## Decisions

- **D-1** *Does `maxlength` set the native attribute?* No. Native `maxlength` stops typing and silently cuts pasted text, which loses the owner's words and makes the ICD's over-limit state unreachable. The counter shows the overrun, and the application's validation refuses it on save.
- **D-2** *The DS has no counter (no ShotThere textarea has a limit), but ICD-002 gives `maxlength` a counter and over-limit state. How do they look?* `span.field__counter` in the help style (`--text-body-sm`, `--color-fg-muted`), last in the field; over the limit it takes `.field__counter--over`: the error colour and the "⚠" glyph, so it is not colour alone. This reuses the field's message language rather than inventing a new look.
- **D-3** *What is a character?* A UTF-16 code unit (`value.length`), the unit of the HTML `maxlength` rule and of JavaScript string length on the server, so the counter and the server agree on where the limit is.
- **D-4** *ICD-I18N-4 forbids the library to format numbers; does the counter show "1,200"?* No, plain integers ("1200 of 2000 characters"). Limits in ShotThere are a few hundred characters, and L2-070.3 asks for locale formatting of dates and money only.
- **D-5** *"Polite, throttled": how often is the count announced?* Once per pause: the live region is written 1000 ms after the last input. Announcing on every keystroke interrupts typing; a fixed interval still talks while the owner types.
- **D-6** *Does over the limit set `aria-invalid`?* No. Validity is the application's (ICD-FORM-5, ICD-API-10); the counter's words and colour say the count, and the field becomes invalid only when the application passes an `error`.
- **D-7** *Is there a read-only textarea?* No. ICD-002 gives `st-textarea` no `readonly` input and no screen needs one: the editors keep every textarea editable while saving.
