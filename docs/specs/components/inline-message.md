# Inline message

| Field | Value |
|---|---|
| Selector | `p[st-inline-message]` (ICD-002 1.1.0, additive). Messages inside a field are rendered by the §9.2 controls through [form-field](form-field.md); the save status by `st-save-status` ([form-layout](form-layout.md)) |
| Library path | `frontend/projects/components/src/lib/inline-message/` |
| Status | planned |
| Traces to | L2-039, L2-049, L2-054, L2-055, L2-057, L2-064, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`inline-message.html`](../../design-system/components/inline-message.html) |
| Source mocks | [`pages/studio-editor/invalid`](../../mocks/pages/studio-editor/invalid.html), [`pages/studio-editor/price-changed`](../../mocks/pages/studio-editor/price-changed.html), [`pages/studio-editor/upload-failed`](../../mocks/pages/studio-editor/upload-failed.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/invalid`](../../mocks/pages/spot-editor/invalid.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html), [`pages/guide-editor/invalid`](../../mocks/pages/guide-editor/invalid.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/sign-in/incorrect`](../../mocks/pages/sign-in/incorrect.html), [`pages/home/invalid`](../../mocks/pages/home/invalid.html), [`pages/home/error`](../../mocks/pages/home/error.html), [`dialogs/studio-filters/invalid`](../../mocks/dialogs/studio-filters/invalid.html), [`dialogs/guide-entry-picker/invalid`](../../mocks/dialogs/guide-entry-picker/invalid.html) |
| Rendering | [`inline-message.html`](inline-message.html) |

## Purpose and scope

Inline messages are the one-line notes that sit right where the problem is:
help under a field, the error once a value is refused, the warning after a price
edit, an upload that failed, and the save status beside Save changes. This CRD
fixes how each kind looks and reads, which component renders it, and the one
library part that renders a message with no field of its own:
`p[st-inline-message]`.

Which component renders each message:

| Message | Example | Rendered by | Specified in |
|---|---|---|---|
| Help under a control | "The studio's own booking page. Opens in a new tab for visitors." | the control's `help` input | [form-field](form-field.md) |
| Error under a control | "Enter an amount of 0 or more" | the control's `error` input | [form-field](form-field.md) |
| Warning under a control | "You changed a price. Confirm the date you verified it." | the control's `warning` input | [form-field](form-field.md) |
| Error or help for a whole group of choices | "Choose at least one best use" | `st-checkbox-group` / `st-radio-group` `error`, `help` | [form-field](form-field.md) |
| Error without a field | "gallery-04.jpg didn't upload. Check your connection.", "raw-export.tif is 25 MB. The limit is 20 MB.", "Add at least one entry before publishing" | `p[st-inline-message] tone="error"` | this CRD |
| Help without a field | "Whole numbers from 1 to 5. The overall score is calculated by the server.", "No fees yet.", "The preview moves as you type." | `p[st-inline-message]` (tone `help`) | this CRD |
| Save status | "Unsaved changes", "Saving…", "Saved 13 Oct 2026, 10:02 am" | `st-save-status` | [form-layout](form-layout.md) |
| A refused or failed request about the whole form | "Email or password is incorrect", "We couldn't subscribe you just now." | [`st-alert`](alert.md) | alert |
| Every refused save, summarised | "Fix 6 things before saving" | `st-error-summary` | [form-layout](form-layout.md) |

Out of scope:

- The structure and ARIA wiring of a field (IDs, `aria-describedby`,
  `aria-invalid`): [`form-field.md`](form-field.md).
- `st-save-status` itself: [`form-layout.md`](form-layout.md) is its only home.
- When a message appears, clears or is announced by focus: the application and
  the error summary. The message renders what it is given.
- Where the refused-files stack sits inside the drop area:
  [`st-file-upload`](file-upload.md); where the failed-upload line sits in a
  row: [`st-image-row`](image-manager.md). This CRD fixes the lines themselves.

## Usage

Every `.field__help`, `.field__error`, `.field__warning` and `.save-status` in
`docs/mocks/` (grep), grouped by the component that renders it.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Studio, spot and guide editors; sign-in; signup; filters; entry picker | control `help` / `error` (see [form-field](form-field.md) Usage) | "Enter an amount of 0 or more", "The date can't be in the future", "Describe this image", "Enter a latitude from -90 to 90", "Enter a title", "Enter your email address", "The minimum must be lower than the maximum", "This studio is already in the guide" | help; error | surface, canvas, sheet, dialog |
| `pages/studio-editor/price-changed` | control `warning` | "You changed a price. Confirm the date you verified it." | warning | warning well |
| `pages/studio-editor/upload-failed` failed image row | `p[st-inline-message] tone="error" role="alert"` in the row's default slot | "gallery-04.jpg didn't upload. Check your connection." | error, announced | surface (row) |
| `pages/studio-editor/upload-failed` drop area | two `p[st-inline-message] tone="error"` in a `div.stack.stack--sm[role=alert]` | "studio-floorplan.svg isn't a supported image. Use JPEG, PNG, WebP or AVIF.", "raw-export.tif is 25 MB. The limit is 20 MB." | error, announced | surface |
| `pages/guide-editor/invalid` Entries section | `p[st-inline-message] tone="error"` with `id="entries-error"` | "Add at least one entry before publishing" | error | surface |
| `pages/studio-editor/*` Fees, Costs extra, Rubric scores; `pages/spot-editor/*` Sample shots, Best for, map preview; `pages/guide-editor/*` Entries | `p[st-inline-message]` (help), `id` where something references it ("map-help") | "No fees yet.", "Nothing yet. Visitors will see "Nothing costs extra".", "Whole numbers from 1 to 5. The overall score is calculated by the server.", "Each shot keeps its focal length and where you stood, so visitors can repeat it.", "The preview moves as you type.", "Visitors see entries in this order. Move up and Move down change the rank." | help | surface |
| Editors' sticky actions | `st-save-status` ([form-layout](form-layout.md)) | "Not saved yet", "Unsaved changes", "Saving…", "Saved 13 Oct 2026, 10:02 am", "All changes saved", "Not saved. Fix the 6 things listed above.", "Wait for uploads to finish" | idle, dirty, saving, saved, error | canvas (sticky bar) |
| `pages/sign-in/incorrect`, `pages/home/error` | [`st-alert`](alert.md) `tone="danger" role="alert"` | "Email or password is incorrect", "We couldn't subscribe you just now." | — | canvas |

Every row is buildable: field messages with the shared inputs, field-less ones
with `p[st-inline-message]` and its `tone`, the save status with `st-save-status`.

## Anatomy

1. **Message** — the host element itself, `p.field__help` or `p.field__error`.
   `--text-body-sm`; one sentence; wraps and breaks long words.
2. **Glyph** — error only: a CSS `::before` "⚠" with empty alternative text,
   `--space-1` before the words, in `currentColor`. A field warning (rendered by
   the control) uses a ringed "!", `--space-2` before the words.
3. **Words** — the projected text. They carry the meaning; colour and glyph
   repeat it.

Host: `p[st-inline-message]` is an attribute selector on a native `p`, so the
host **is** the paragraph and the component adds no wrapper. `id` and `role` are
the consumer's native attributes on the host.

## API

### `p[st-inline-message]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `'help' \| 'error'` | `'help'` | no | `help` → class `field__help`; `error` → class `field__error` with the glyph. |

Native attributes on the host belong to the consumer: `id` (when a control,
fieldset or preview references the message with `aria-describedby`) and
`role="alert"` (when an error appears without a submit and must be announced
at once). Put `role="alert"` on the host for one line, or on a wrapping element
for a stack of lines, never on both.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | A message is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text, optionally with inline `strong` or `code` | Product copy, marked `i18n` by the consumer. File names in it are data. |

The component has no library strings (ICD §12). It renders nothing visible when
its content is empty (`:empty` hides it), so a conditional message leaves no gap.

## Variants and sizes

| Variant | Class | Rendered by | Use for |
|---|---|---|---|
| Help | `.field__help` | control `help`; `p[st-inline-message]` | What to enter or what happens: "Visitors see a warning after 183 days." |
| Error | `.field__error` | control `error`; `p[st-inline-message] tone="error"` | A refused value, a failed upload, a refused file, a list that needs an entry. |
| Warning | `.field__warning` (+ `.field--warning` on the field) | control `warning` | A value that is allowed but needs a second look. Only "Prices last verified" after a price edit. |
| Save status | `.save-status`, `--saved`, `--error` | `st-save-status` | The editor's state beside Save changes ([form-layout](form-layout.md)). |

One size: `--text-body-sm` at every width and next to every control size,
including the large sign-in fields.

## States

A message does not react to the pointer and is never focusable; the control it
describes does and is.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Help | always present | `--color-fg-muted` | Read as the control's description, after any message |
| Error after a submit | control `error` | `--color-danger-fg` with "⚠" | Announced through the focused error summary; read with "invalid entry" when the control is focused |
| Error without a submit | `p[st-inline-message] tone="error"` with `role="alert"` (host or wrapper) | Same look | Announced assertively when inserted |
| Error with no announcement | `p[st-inline-message] tone="error"` without a role ("Add at least one entry before publishing") | Same look | Read in reading order or through the `id` a control or section references |
| Warning | control `warning` | `--color-warning-fg` with ringed "!", tinted well | Read as the description, first; not invalid |
| Error replaces warning | both set on one control | Only the error | As error |
| Cleared | text removed | Message gone, help stays | — |

## Markup

```html
<!-- rendered: error without a field, announced (failed image row) -->
<p class="field__error" role="alert">gallery-04.jpg didn't upload. Check your connection.</p>
```

```html
<!-- rendered: refused files under the drop area, one alert for the stack -->
<div class="stack stack--sm" role="alert">
  <p class="field__error">studio-floorplan.svg isn't a supported image. Use JPEG, PNG, WebP or AVIF.</p>
  <p class="field__error">raw-export.tif is 25 MB. The limit is 20 MB.</p>
</div>
```

```html
<!-- rendered: help without a field, referenced by the preview map -->
<p class="field__help" id="map-help">The preview moves as you type.</p>
```

```html
<!-- rendered: messages inside a field (by the control, see form-field.md) -->
<span class="field__error" id="hourlyRate-error">Enter an amount of 0 or more</span>
<span class="field__warning" id="priceVerifiedAt-warning">You changed a price. Confirm the date you verified it.</span>
<span class="field__help" id="priceVerifiedAt-help">Previously 11 Oct 2026. Visitors see a warning after 183 days.</span>
```

```html
<!-- consumer: failed upload in an image row -->
<li st-image-row [thumbnailUrl]="row.thumb" [meta]="row.meta">
  <p st-inline-message tone="error" role="alert" i18n>{{ row.fileName }} didn't upload. Check your connection.</p>
  …
</li>

<!-- consumer: section help and a referenced help -->
<p st-inline-message i18n>Whole numbers from 1 to 5. The overall score is calculated by the server.</p>
<p st-inline-message id="map-help" i18n>The preview moves as you type.</p>
```

## Design

- Type `--text-body-sm` for help, errors, warnings and the save status.
- Error: `display: flex`, `align-items: flex-start`, `gap: --space-1`; glyph
  "⚠" (text presentation) before the words, `flex: none`.
- Warning: `gap: --space-2`; glyph is a 1.125rem ringed "!" drawn with a
  `--border-width-thick` `currentColor` circle, `--text-caption` at
  `--font-weight-bold`, nudged down `--space-0-5`.
- Words break anywhere (`overflow-wrap: anywhere`) so long file names wrap.
- No margins: the field's or the container's gap spaces the message.
- No animation.

The message declares no component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Help, neutral save status | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Error text and glyph | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Invalid control edge | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Warning text and glyph | `--color-warning-fg` | `--palette-mango-700` | `--palette-mango-300` |
| Warning well | `--color-warning-bg` | `--palette-mango-50` | `--palette-mango-950` |
| Saved status | `--color-success-fg` | `--palette-callaloo-700` | `--palette-callaloo-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-danger-fg` | `--color-bg-canvas` | 4.5:1 | Error on the page (signup, filters sidebar) |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Error in an editor section or image row |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Error in the filters sheet and the entry picker |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Warning in its well |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Help on the page |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Help in an editor section |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Help in dialogs |
| `--color-fg-muted` | `--color-warning-bg` | 4.5:1 | Help in the warning well |
| `--color-success-fg` | `--color-bg-canvas` | 4.5:1 | Saved status |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge |

The glyphs use `currentColor`, so each follows its words. Forced colours: text
becomes `CanvasText`; the glyphs keep the shape difference between error and
warning.

## Responsive behaviour

- A message takes the width of its field or container and wraps; nothing in it
  changes by breakpoint. Long file names ("studio-floorplan.svg") break anywhere
  instead of widening the form at 320 px.
- In a two-up field row each message stays under its own field.
- At 320 px nothing scrolls horizontally; at 200 % zoom every message stays
  readable next to what it describes.
- Messages have no targets of their own; Retry and Remove beside an upload error
  are buttons with their own 44 px phone targets.

## Accessibility

### Role and pattern

Help, errors and warnings in a field are plain text tied to the control with
`aria-describedby` (WCAG 3.3.1, 3.3.3). A field-less error that appears without
a submit is announced with `role="alert"` (WCAG 4.1.3); errors from a submit are
announced once, through the focused error summary, never line by line. The save
status is a polite `role="status"` region ([form-layout](form-layout.md)).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Messages are not focusable; focus moves to the control, which reads its label, value, "invalid entry" and then the message. |

### Focus

A message never takes or moves focus. A refused file does not move focus; the
alert announces it.

### Labelling

- The glyph's generated content has empty alternative text (`content: "⚠" / ""`),
  so it is never read.
- A field-less error names its object so it makes sense alone: "gallery-04.jpg
  didn't upload. Check your connection."
- A message referenced by something else carries the `id` the consumer gives it.

### Announcements

`role="alert"` goes on the host for a single line or on the wrapper for a stack,
once. A message with no role is not announced when it appears.

### Motion

None. Messages appear and disappear without animation.

## Content and internationalisation

- Errors say what to do, in the imperative, with no full stop and no "please":
  "Enter a whole number from 1 to 5", "Describe this image", "Enter who provided
  the session". Field-less errors that explain a refusal are full sentences:
  "raw-export.tif is 25 MB. The limit is 20 MB."
- Name the limit, not the rule: "The limit is 20 MB.", "Enter a latitude from
  -90 to 90".
- Never blame and never prefix: "isn't a supported image", not "invalid file";
  no "Error:"; the glyph and colour already say it.
- Warnings say what changed and what to do: "You changed a price. Confirm the
  date you verified it."
- Help is a full sentence that adds what the label does not: "Visitors see a
  warning after 183 days."
- Email errors: "Enter your email address", "Enter a valid email address, like
  name@example.com". Sign-in never says which field was wrong once both are
  filled: "Email or password is incorrect" is an alert, not a field error
  (L2-049.2).
- Save status wording, dates ("13 Oct 2026") and times ("10:02 am"):
  [form-layout](form-layout.md). Formatting is the application's (ICD-I18N-4).
- Translatable content: every message is product copy marked by the consumer.
  File names and studio names inside it are data.
- French runs about 30 % longer: messages wrap downward; nothing truncates.

## Performance

- Change detection: `OnPush`; the host class is one `computed` from `tone`.
- Performance scenario: the `components-harness` route
  `inline-message/performance` renders the studio editor's Images section with
  a failed row and a stack of ten refused files ("studio-floorplan.svg isn't a
  supported image. Use JPEG, PNG, WebP or AVIF." …) inserted in one update; that
  update must stay within the L2-071 INP budget.
- Regression rule: a change to the template, inputs or styles is measured on
  that route against the base branch before it is pushed.
- Layout stability: a message pushes the content below it down by its height
  after the user's own action (submit, file choice), which CLS excludes; an
  empty `p[st-inline-message]` takes no space.
- Weight: `@angular/core` only.

## Acceptance criteria

### Rendering

- **AC-1** Given the failed gallery row of Corktown Garage Studio, when the application inserts `<p st-inline-message tone="error" role="alert">gallery-04.jpg didn't upload. Check your connection.</p>`, then the rendered element is a `p` with the class `field__error`, `role="alert"`, no wrapper, and a screen reader announces "gallery-04.jpg didn't upload. Check your connection." without focus moving. (L2-057)
- **AC-2** Given the owner chose `studio-floorplan.svg` and a 25 MB `raw-export.tif`, when the application renders two error messages inside one `role="alert"` stack, then each is a `p.field__error`, they read "studio-floorplan.svg isn't a supported image. Use JPEG, PNG, WebP or AVIF." and "raw-export.tif is 25 MB. The limit is 20 MB.", and the stack is announced once. (L2-057)
- **AC-3** Given `<p st-inline-message>Whole numbers from 1 to 5. The overall score is calculated by the server.</p>` in the Rubric scores section, when it renders, then it is a `p.field__help` in `--text-body-sm` and `--color-fg-muted`, with no role and no glyph. (L2-054)
- **AC-4** Given Evergreen Brick Works' coordinates with `<p st-inline-message id="map-help">The preview moves as you type.</p>` and the preview map's `aria-describedby="map-help"`, when a screen reader reaches the preview, then its description is "The preview moves as you type.". (L2-055)

### Message rules

- **AC-5** Given the hourly rate field with error "Enter an amount of 0 or more", when it renders in light and dark, then the error line is `--color-danger-fg` in `--text-body-sm`, starts with the "⚠" glyph `--space-1` before the words, and its accessible text is exactly "Enter an amount of 0 or more". (L2-068)
- **AC-6** Given "Prices last verified" with the price-changed warning, when it renders, then the warning line is `--color-warning-fg` with the ringed "!" glyph `--space-2` before the words inside the `--color-warning-bg` well, and its accessible text is exactly "You changed a price. Confirm the date you verified it.". (L2-068)
- **AC-7** Given the signup submitted with "not-an-email", when the application sets the field's error, then "Enter a valid email address, like name@example.com" appears under the "Email address" input as a field error, not as an alert. (L2-039)
- **AC-8** Given the sign-in form submitted with `owner@shotthere.ca` and a wrong password, when the server refuses it, then "Email or password is incorrect" is an `st-alert` above the form and neither the email nor the password input has `aria-invalid` or a `.field__error`. (L2-049)

### Keyboard and focus

- **AC-9** Given `pages/studio-editor/upload-failed` with the failed-row error and the refused-files stack, when a keyboard user tabs through the Images section, then focus goes to "Retry gallery-04.jpg" and "Remove gallery-04.jpg" and never to a message, and inserting the messages did not move focus. (L2-067)

### Screen readers

- **AC-10** Given `pages/studio-editor/upload-failed` and `pages/guide-editor/invalid`, when axe-core scans them in light and dark, then no violations are reported for the messages and no message has both its own `role="alert"` and an alert ancestor. (L2-069)

### Theming

- **AC-11** Given help, an error, a warning and the saved status on the page, in an editor section, in the filters sheet, in the entry picker and in the warning well, when the contrast check runs in light and dark, then every pair in the Colour table meets its minimum. (L2-068)

### Responsive

- **AC-12** Given the drop area at 320 px with the refused-file line for "a-very-long-export-name-from-the-camera-roll-2026-10-13.tif", when it renders, then the file name breaks inside the column and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): messages appear
and disappear without animation, in every motion setting
([inline-message.html](../../design-system/components/inline-message.html), Accessibility › Motion).

### Performance

- **AC-13** Given the `inline-message/performance` harness route, when the failed row's error and ten refused-file lines are inserted in one update, then the next paint follows within 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/inline-message/`:
  `inline-message.component.ts` (`InlineMessageComponent`, selector
  `p[st-inline-message]`), `inline-message.component.html` (`<ng-content />`),
  `inline-message.component.css` (the `.field__help`, `.field__error` and glyph
  rules from `components.css`, written against `:host(.field__help)` and
  `:host(.field__error)`, plus `:host(:empty) { display: none; }`).
- Host binding: `[class]` from a `computed` of `tone`.
- ICD change (ICD-002 1.1.0, additive): new component `InlineMessageComponent`,
  `p[st-inline-message]`, in §9.7 Feedback, with input `tone`
  (`'help' | 'error'`, default `'help'`) and a default slot (D-1). The
  `st-image-row` default slot's accepted content gains `p[st-inline-message]`.
- The field messages and the warning are rendered by the controls from the
  shared `form-field.css` ([form-field](form-field.md)); `st-save-status` is in
  [form-layout](form-layout.md).
- Mock drift the component corrects: the price-changed mock's inline tint is
  `.field--warning`; the spot editor's "help, then error" order is "error, then
  help"; the spot and guide editors' refused-save status wording follows
  [form-layout](form-layout.md).

## Decisions

- **D-1** *ICD-002 1.0.0 has no component that renders a `.field__error` or `.field__help` line outside a field, and `.field*` is library-owned CSS (ICD §11.2), so the application may not write it.* A new attribute component `p[st-inline-message]` with a `tone` input (ICD-002 1.1.0, additive). Twelve editor screens need field-less help lines and three need field-less errors, and the DS alert page says a failed upload is an inline message, not an alert. Its selector follows ICD-API-4 (the DS slug) and the attribute form keeps the native `p`.
- **D-2** *ICD-002 lists `st-alert` in `st-image-row`'s slot for the failed upload; the DS draws it as an error line.* The error line, through `p[st-inline-message]`: the DS decides how it looks (ICD §4 precedence), and `st-alert` stays for conditions about a form or page.
- **D-3** *Does `p[st-inline-message]` take a warning tone?* No. The only warning in ShotThere belongs to one field and is rendered by its control's `warning` input; no mock has a field-less warning.
- **D-4** *Should the component set `role="alert"` itself for errors?* No. Errors from a submit must not announce (the summary does), and a stack of refused files announces once from its wrapper; only the consumer knows which case it is, so `role` stays a native attribute it writes.
- **D-5** *Where is `st-save-status` specified?* Only in [form-layout](form-layout.md), beside the form actions it lives in; this CRD gives its place in the message family and its content rules defer there.
- **D-6** *The refused-save status reads "Not saved. Fix the 6 things listed above.", "Not saved" or "Not published" across the editors.* One string per state, the studio editor's, as the DS inline-message and form-layout pages decide; the application supplies it.
