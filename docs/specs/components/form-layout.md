# Form layout

| Field | Value |
|---|---|
| Selector | `st-error-summary`, `st-form-actions`, `st-save-status`; global utilities `.field-row`, `.field-row--pair`, `.field-row--fit`, `.field-row--fit-sm` |
| Library path | `frontend/projects/components/src/lib/error-summary/`, `…/form-actions/`, `…/save-status/`; utilities in `frontend/projects/components/styles/utilities.css` |
| Status | planned |
| Traces to | L2-049, L2-054, L2-057, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`form-layout.html`](../../design-system/components/form-layout.html), [`patterns/forms.html`](../../design-system/patterns/forms.html) |
| Source mocks | [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/studio-editor/invalid`](../../mocks/pages/studio-editor/invalid.html), [`pages/studio-editor/submitting`](../../mocks/pages/studio-editor/submitting.html), [`pages/studio-editor/success`](../../mocks/pages/studio-editor/success.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/studio-editor/uploading`](../../mocks/pages/studio-editor/uploading.html), [`pages/spot-editor/invalid`](../../mocks/pages/spot-editor/invalid.html), [`pages/guide-editor/invalid`](../../mocks/pages/guide-editor/invalid.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`dialogs/studio-filters/invalid`](../../mocks/dialogs/studio-filters/invalid.html) |
| Rendering | [`form-layout.html`](form-layout.html) |

## Purpose and scope

Form layout is the set of parts that arrange fields into ShotThere's two kinds
of form: the long studio, spot and guide editors the owner fills in after a
shoot, and the short owner sign-in. The library owns three components and one
utility family:

- `st-error-summary` — after a refused save or sign-in, a box at the top of the
  form that counts the problems and links to each field.
- `st-form-actions` — the row of Save changes (or Create studio), Cancel and the
  save status; sticky at the bottom of the screen in the editors.
- `st-save-status` — the polite status line beside the actions: "Unsaved
  changes", "Saving…", "Saved 13 Oct 2026, 10:02 am". This is its only
  specification; [`inline-message.md`](inline-message.md) refers here.
- `.field-row` and its modifiers — global utilities that put two short fields
  side by side, or as many tiny ones as fit.

Each field inside is a control with the shared [form-field](form-field.md)
contract. Editor sections are [`st-editor-section`](editor-layout.md); the
editor's status panel and two-column layout are application CSS.

Out of scope:

- `.editor-form` (the editor's column of sections, `--space-4` apart) and
  `.auth`, `.auth__head` (the sign-in page's 28rem column): application feature
  CSS (ICD §11.2). They are described here only as the context the library
  parts sit in.
- `form` itself, `novalidate`, submitting, validation, which errors exist, the
  summary's title and item text, the save state and its text: the
  application's (ICD-API-10, ICD §14).
- `fieldset` and `legend` around groups of fields (Fees, Natural light): native
  elements styled by the global foundations (ICD §11.1).
- The buttons inside the actions: [`button[st-button]`](button.md).
- Opening invalid editor sections on a refused save: the application sets
  `open` on [`st-editor-section`](editor-layout.md) and its `data-invalid` state.

## Usage

Every `.form-summary`, `.form-actions`, `.save-status` and `.field-row` in
`docs/mocks/` (grep), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/sign-in/invalid` | `st-error-summary`, `headingLevel` 2, first in `main.auth` | title "Fix 2 things to sign in"; items "Enter your email address" → `#email`, "Enter your password" → `#password` | shown, focused | canvas |
| `pages/studio-editor/invalid` | `st-error-summary` first in `form.editor-form` | "Fix 6 things before saving"; "Booking link: Enter a web address that starts with http:// or https://" → `#bookingUrl`, "Hourly rate: Enter an amount of 0 or more" → `#hourlyRate`, "Prices last verified: The date can't be in the future", "Gallery image 1 alt text: Describe this image", "Light score: Enter a whole number from 1 to 5", "Provided by: Enter who provided the session" | shown, focused | canvas |
| `pages/spot-editor/invalid` | as above | "Fix 4 things before saving"; "Latitude: Enter a latitude from -90 to 90" → `#latitude` … | shown | canvas |
| `pages/guide-editor/invalid` | as above | "Fix 2 things before saving"; "Title: Enter a title" → `#title` | shown | canvas |
| Every editor state (`studio-editor/*`, `spot-editor/*`, `guide-editor/*`) | `st-form-actions sticky` last in the form | primary `button[st-button]` "Save changes" / "Create studio" / "Create spot" / "Create guide"; ghost `a[st-button]` "Cancel"; `st-save-status` | default; Save busy (`submitting`); Save disabled with hint (`uploading`) | canvas (sticky bar) |
| `studio-editor/new`, `spot-editor/new`, `guide-editor/new` | `st-save-status` `idle` | "Not saved yet" | idle | sticky bar |
| `*/default`, `price-changed`, `upload-failed` | `st-save-status` `dirty` | "Unsaved changes" | dirty | sticky bar |
| `studio-editor/uploading` | `st-save-status` `dirty`, `id="save-hint"` referenced by the disabled Save | "Wait for uploads to finish" | dirty | sticky bar |
| `*/submitting` | `st-save-status` `saving` | "Saving…" | saving | sticky bar |
| `*/success` | `st-save-status` `saved` | "Saved 13 Oct 2026, 10:02 am" | saved | sticky bar |
| `*/published` | `st-save-status` `idle` | "All changes saved" | idle | sticky bar |
| `*/invalid` | `st-save-status` `error` | "Not saved. Fix the 6 things listed above." | error | sticky bar |
| `studio-editor/*` Pricing, Specifications, Basics; `spot-editor/*` Location | `.field-row` | Hourly rate + Minimum booking (hours); Usable width (m) + Usable depth (m); Neighbourhood + Address or cross streets; Latitude + Longitude | stacked below 36rem, two-up from 36rem | surface |
| `pages/studios/*` sidebar, `dialogs/studio-filters/*` | `.field-row--pair` | "Minimum" + "Maximum" with `$` | always two-up; maximum invalid | canvas, sheet |
| `studio-editor/*` Natural light; Rubric scores | `.field-row--fit` (four times of day); `.field-row--fit-sm` (Value, Light, Space, Gear, Logistics, Condition) | selects; number fields | as many as fit | surface |

Every row is buildable with the API below. The editors' non-sticky case does
not occur; `sticky` defaults to `false` for a short form's actions.

## Anatomy

### `st-error-summary`

1. **Box** — the host, `.form-summary`, with `role="alert"`, `tabindex="-1"`,
   `aria-labelledby` naming the heading. `--color-danger-bg` fill,
   `--color-danger-fg` text, `--space-4` padding, `--radius-md`.
2. **Heading** — `h2` (or the `headingLevel`) with the `title`, `--text-label`
   at `--font-size-md`, with a generated `id`.
3. **List** — `ul` with one `li > a[href="#<targetId>"]` per item, text
   `message`; links inherit the danger colour and are underlined.

Host: `st-error-summary` carries `.form-summary` and its attributes only while
`items` is non-empty; with no items it renders nothing and has no class, role
or box (`display: none`).

### `st-form-actions`

1. **Bar** — the host, `.form-actions` (+ `.form-actions--sticky`): wrapping
   flex row, `--space-3` gap, `--space-4` above.
2. **Actions** — projected buttons and the save status, in the consumer's
   order: primary, ghost Cancel, `st-save-status`.

### `st-save-status`

1. **Status line** — the host, `.save-status` (+ `--saved` or `--error`),
   `role="status"`, `--target-comfortable` tall, `--text-body-sm`.
2. **Text** — the `text` input.

### `.field-row`

A grid of one column (`minmax(0, 1fr)`), two from 36rem, `--space-4` gap. The
`--pair` modifier is two columns at every width; `--fit` and `--fit-sm` fit as
many columns of at least 9rem or 7rem as the width allows.

## API

### `st-error-summary`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | The heading: "Fix 6 things before saving", "Fix 2 things to sign in". The application writes the count. |
| `items` | `readonly ErrorSummaryItem[]` | — | yes | One link per item, in order, tracked by `targetId`. Empty renders nothing. A change from empty to non-empty (including a first render with items) moves focus to the box (ICD-FORM-7). |
| `headingLevel` | `HeadingLevel` | `2` | no | Renders `h2`, `h3` or `h4`. |

`ErrorSummaryItem` is `{ targetId: string; message: string }` (§8). `message`
is the full link text, "Hourly rate: Enter an amount of 0 or more".

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Activating a link moves focus to the element with `id === targetId` itself (ICD-FORM-7). The component prevents the fragment navigation, opens every closed `details` ancestor of the target, then calls `focus()` on it (D-2). If no element has that `id`, nothing happens. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Title and items are inputs. |

### `st-form-actions`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `sticky` | `boolean` | `false` | no | Adds `.form-actions--sticky`: sticks to the viewport bottom on `--color-bg-canvas` with a hairline above and `env(safe-area-inset-bottom)` added to its bottom padding (ICD-STY-7). |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Submit and Cancel are the buttons' own (`type="submit"` in the application's `form`, ICD-FORM-8). |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | `button[st-button]`, `a[st-button]`, `st-save-status` | Order is the consumer's: primary first, then Cancel, then the status. |

### `st-save-status` (live)

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `state` | `SaveState` (`'idle' \| 'dirty' \| 'saving' \| 'saved' \| 'error'`) | `'idle'` | no | `saved` → `.save-status--saved`; `error` → `.save-status--error`; the others add no modifier. |
| `text` | `string` | `''` | no | The status, formatted by the application: "Unsaved changes", "Saved 13 Oct 2026, 10:02 am". |

The host always carries `role="status"`, from first render, so every change of
`text` is announced politely (ICD-A11Y-4: the application does not also
announce it). The consumer may set `id` on the host so a disabled Save can
reference it with `aria-describedby`.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | It reports nothing. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Text is the `text` input. |

### Global utilities

| Class | Effect |
|---|---|
| `.field-row` | One column; two equal columns from 36rem; `--space-4` gap; `minmax(0, 1fr)` so long content never widens it. |
| `.field-row--pair` | Two columns at every width (minimum and maximum all-in cost). ICD-002 1.1.0, additive. |
| `.field-row--fit` | `repeat(auto-fit, minmax(min(100%, 9rem), 1fr))` (natural light by time of day). ICD-002 1.1.0, additive. |
| `.field-row--fit-sm` | Same with 7rem (the six rubric scores). ICD-002 1.1.0, additive. |

None of the components has a library string (ICD §12).

## Variants and sizes

| Part | Variant | Use for |
|---|---|---|
| `st-error-summary` | `headingLevel` 2 | Sign-in (under the `h1`) and the editors (under the page `h1`, beside the form's hidden `h2`). |
| `st-error-summary` | `headingLevel` 3 or 4 | A summary inside a section already headed at level 2 or 3. |
| `st-form-actions` | default | A short form's actions in the flow. |
| `st-form-actions` | `sticky` | Every editor (studio, spot, guide). |
| `st-save-status` | neutral (`idle`, `dirty`, `saving`) | "Not saved yet", "All changes saved", "Unsaved changes", "Wait for uploads to finish", "Saving…". |
| `st-save-status` | `saved` | "Saved 13 Oct 2026, 10:02 am" in `--color-success-fg`. |
| `st-save-status` | `error` | "Not saved. Fix the 6 things listed above." in `--color-danger-fg`. |
| `.field-row` | default, `--pair`, `--fit`, `--fit-sm` | See the utilities table. |

Each has one size. The summary and actions take the width of the form; the
status is `--target-comfortable` (44 px) tall so it lines up with the buttons.

## States

| Part | State | Trigger | Visual | Assistive technology |
|---|---|---|---|---|
| Summary | Hidden | `items` empty | Nothing rendered | Nothing in the tree |
| Summary | Shown | `items` non-empty | Danger-tinted box, heading, links | `role="alert"` region named by its heading; announced |
| Summary | Focused | empty → non-empty | `:focus-visible` ring (`--color-focus-ring`, `--focus-ring-offset`) on the box | Focus on the box; the heading and items are read |
| Summary link | Hover, focus | `:hover`, `:focus-visible` | Underline thickens; shared focus ring | Link "Hourly rate: Enter an amount of 0 or more" |
| Summary link | Activated | click, Enter | — | Focus moves to the field, which reads its label, value, "invalid entry" and error |
| Actions | Default | — | Buttons and status in a row | — |
| Actions | Sticky | `sticky` | Pinned to the viewport bottom, canvas fill, top hairline, safe-area padding | Focused fields scroll clear of the bar |
| Actions | Saving | Save `busy` (button) + status `saving` | Spinner on Save, "Saving…" | "Saving…" announced once; Save busy |
| Actions | Uploading | Save native `disabled` + `aria-describedby` → status `id` | Save at 50 %, "Wait for uploads to finish" | Save unavailable, described by the status |
| Status | Idle | `state` `idle` | Muted | — |
| Status | Dirty | `dirty` | Muted | Announced politely when the text changes |
| Status | Saving | `saving` | Muted | Announced |
| Status | Saved | `saved` | `--color-success-fg` | Announced |
| Status | Error | `error` | `--color-danger-fg` | Announced |
| Field row | Stacked | below 36rem (default) | One column | Reading order unchanged |
| Field row | Two-up | from 36rem; `--pair` always | Two columns | Left to right, then down |

## Markup

```html
<!-- rendered: error summary (studio-editor/invalid), items shortened -->
<st-error-summary class="form-summary" role="alert" tabindex="-1" aria-labelledby="st-summary-0-title">
  <h2 id="st-summary-0-title">Fix 6 things before saving</h2>
  <ul>
    <li><a href="#bookingUrl">Booking link: Enter a web address that starts with http:// or https://</a></li>
    <li><a href="#hourlyRate">Hourly rate: Enter an amount of 0 or more</a></li>
    <li><a href="#priceVerifiedAt">Prices last verified: The date can't be in the future</a></li>
  </ul>
</st-error-summary>
```

```html
<!-- rendered: error summary with no items -->
<st-error-summary></st-error-summary>
```

```html
<!-- rendered: sticky actions while uploading -->
<st-form-actions class="form-actions form-actions--sticky">
  <button class="btn btn--primary" type="submit" disabled aria-describedby="save-hint">Save changes</button>
  <a class="btn btn--ghost" href="/admin/studios">Cancel</a>
  <st-save-status class="save-status" role="status" id="save-hint">Wait for uploads to finish</st-save-status>
</st-form-actions>
```

```html
<!-- rendered: save status, saved and refused -->
<st-save-status class="save-status save-status--saved" role="status">Saved 13 Oct 2026, 10:02 am</st-save-status>
<st-save-status class="save-status save-status--error" role="status">Not saved. Fix the 6 things listed above.</st-save-status>
```

```html
<!-- application markup using the utilities (no component) -->
<div class="field-row">
  <st-text-field … label="Hourly rate" prefix="$" />
  <st-text-field … label="Minimum booking (hours)" />
</div>
<div class="field-row field-row--pair">…Minimum, Maximum…</div>
<div class="field-row field-row--fit-sm">…six rubric scores…</div>
```

The heading's `id` is generated (`st-summary-<n>-title`, same scheme and
hydration rule as [form-field](form-field.md) D-3) and is not public API; the
classes, roles, `tabindex`, `aria-labelledby` and the `href="#<targetId>"` links
are.

```html
<!-- consumer: studio editor (application) -->
<form class="editor-form" novalidate aria-labelledby="form-title" (ngSubmit)="save()" [formGroup]="form">
  <h2 class="visually-hidden" id="form-title" i18n>Studio details</h2>
  <st-error-summary [title]="summaryTitle()" [items]="summaryItems()" />
  …sections…
  <st-form-actions sticky>
    <button st-button variant="primary" type="submit" [busy]="saving()" [disabled]="uploading()"
            [attr.aria-describedby]="uploading() ? 'save-hint' : null" i18n>Save changes</button>
    <a st-button variant="ghost" [routerLink]="paths.adminStudios" i18n>Cancel</a>
    <st-save-status id="save-hint" [state]="saveState()" [text]="saveText()" />
  </st-form-actions>
</form>

<!-- consumer: sign-in -->
<main id="main" class="auth" tabindex="-1">
  <div class="auth__head"><h1 i18n>Sign in</h1>…</div>
  <st-error-summary [title]="summaryTitle()" [items]="summaryItems()" />
  <form class="stack" novalidate>…</form>
</main>
```

## Design

- Summary: padding `--space-4`, `--radius-md`, `--color-danger-bg` fill,
  `--color-danger-fg` text; heading `--text-label` at `--font-size-md` for every
  heading level; list `--space-2` above, `--space-5` start padding; links
  `color: inherit`. No outer margin: the form's own gap spaces it (D-3).
- Summary focus: the shared `:focus-visible` ring, `--focus-ring-width` in
  `--color-focus-ring`, `--focus-ring-offset` outside the box.
- Actions: `display: flex`, `flex-wrap: wrap`, `gap: --space-3`,
  `padding-top: --space-4`, start-aligned.
- Sticky actions: `position: sticky; bottom: 0`, `--color-bg-canvas`, top
  `--border-width-hairline` in `--color-border-default`, padding
  `--space-4` above and `--space-4` + `env(safe-area-inset-bottom)` below,
  layer `--z-raised`.
- Sticky scroll padding: while a `.form-actions--sticky` is on the page,
  `html` gets a bottom `scroll-padding` of `--control-height-md` + 2 ×
  `--space-4` + the safe-area inset, so a focused field scrolls clear of the bar
  (WCAG 2.4.11). This rule lives in the global foundations (D-4).
- Save status: `inline-flex`, centred, `gap: --space-2`, `--text-body-sm`,
  min-height `--target-comfortable`, `--color-fg-muted`; `--saved`
  `--color-success-fg`; `--error` `--color-danger-fg`.
- Field row: `display: grid`, `--space-4` gap; columns as in the utilities table. The modifiers hold at every width; the default row's 36rem two-column rule never overrides them (D-8).

No component tokens are declared.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Summary fill | `--color-danger-bg` | `--palette-sorrel-50` | `--palette-sorrel-950` |
| Summary text and links | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Summary focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Sticky bar fill | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Sticky bar edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Status, neutral | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Status, saved | `--color-success-fg` | `--palette-callaloo-700` | `--palette-callaloo-300` |
| Status, refused | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Summary heading and links |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring round the summary and on its links |
| `--color-focus-ring` | `--color-danger-bg` | 3:1 | Focus ring on a link inside the summary |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Neutral status on the sticky bar |
| `--color-success-fg` | `--color-bg-canvas` | 4.5:1 | Saved status |
| `--color-danger-fg` | `--color-bg-canvas` | 4.5:1 | Refused status |

Forced colours: the summary's tint is lost, so it gets a
`--border-width-hairline` border in `CanvasText`; the sticky bar keeps its
hairline.

## Responsive behaviour

- XS (below 36rem): every `.field-row` stacks except `.field-row--pair`;
  `--fit` and `--fit-sm` fit as many 9rem or 7rem columns as the width allows
  (two rubric scores per row at 320 px). The editor form is one column of
  sections (L2-054.6).
- SM and up (36rem): `.field-row` goes two-up.
- The sticky bar spans the form's width at every breakpoint. "Save changes" and
  "Cancel" stay on one line; the save status wraps under them on narrow phones.
  The bar's bottom padding clears the home indicator (L2-065).
- Summary text and links wrap; long links ("Booking link: Enter a web address
  that starts with http:// or https://") never widen the form.
- At 320 px nothing scrolls horizontally; at 200 % zoom the sticky bar, the
  summary and every field stay reachable, and the bar never covers the focused
  field.
- Buttons in the bar are 44 px tall at every width (medium buttons). Summary
  links sit one per line in body text (`--line-height-normal`, 24 px at 16 px),
  so each link line is at least 24 px tall (L2-065.2).

## Accessibility

### Role and pattern

`st-error-summary` follows the GOV.UK error summary: `role="alert"`,
`tabindex="-1"`, named by its heading through `aria-labelledby`, focused after a
refused submit, each item a same-page link to its field. `st-save-status` is a
`role="status"` live region (WCAG 4.1.3). `st-form-actions` has no role; it is
part of the application's `form`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | From the focused summary: through its links in order, then into the form. In the bar: Save changes, Cancel; the status is not focusable. |
| <kbd>Enter</kbd> on a summary link | Opens the field's section if it is closed and moves focus into the field. |

### Focus

- When `items` changes from empty to non-empty, focus moves to the summary box
  after the render (browser only). It does not move again while `items` stays
  non-empty; the application empties `items` when a submit starts, so each
  refused submit focuses the summary again (D-1).
- A summary link moves focus to `#<targetId>` and the browser scrolls it into
  view, clear of the sticky bar and the header (`scroll-padding`).
- The bar and the status never move focus; Save keeps focus while busy
  ([button](button.md)).

### Labelling

The summary is named by its heading ("Fix 6 things before saving"). Each link's
name is its message, which repeats the field's label and its error, so it makes
sense in a links list. The status has no name; its text is the message.

### Announcements

- The summary announces once when it appears (alert role plus focus).
- The save status announces every change of `text` politely; the application
  never also announces a save through `AnnouncerService` (ICD-A11Y-4).

### Motion

None of its own. The sticky bar does not animate; Save's busy spinner is the
button's and keeps turning under `prefers-reduced-motion: reduce`.

## Content and internationalisation

- Summary title: "Fix n things before saving" in the editors, "Fix n things to
  sign in" on sign-in; the number as a numeral ("Fix 1 thing before saving").
  Never "problems", never "This guide can't be published yet" (a refused publish
  is the "Can't publish yet" dialog).
- Summary items: "Field label: the field's own message", the message exactly as
  it appears under the field, capital first letter kept: "Hourly rate: Enter an
  amount of 0 or more". Sign-in's two items are the messages alone ("Enter your
  email address").
- Save status, one string per state: "Not saved yet" (new), "Unsaved changes",
  "Wait for uploads to finish", "Saving…", "Saved 13 Oct 2026, 10:02 am",
  "All changes saved", "Not saved. Fix the 6 things listed above.". Dates and
  times are formatted by the application for en-CA (L2-070.3).
- Primary button: "Save changes" on an existing item, "Create studio", "Create
  spot", "Create guide" on a new one; Cancel is always "Cancel" (button CRD).
- Translatable inputs: `title`, each item's `message`, the status `text`. The
  counts and dates inside them are formatted by the application.
- French runs about 30 % longer: the summary wraps, and the status already
  drops to its own line on phones.

## Performance

- Change detection: `OnPush`; the summary's host attributes and visibility are
  `computed` from `items`; the focus move runs in an `effect` that compares the
  previous length and schedules `focus()` with `afterNextRender`.
- Lists use `@for` with `track item.targetId`.
- Performance scenario: the `components-harness` route
  `form-layout/performance` renders the studio editor's sticky actions with
  "Save changes", "Cancel" and the status, then applies the refused save of
  `pages/studio-editor/invalid` (six summary items and status "Not saved. Fix the
  6 things listed above.") in one update; the update, including the focus move,
  must stay within the L2-071 INP budget.
- Regression rule: a change to any of the three templates, their inputs, styles
  or change detection is measured on that route against the base branch before
  it is pushed.
- Layout stability: the status keeps its `--target-comfortable` height when its
  text is empty, so the bar does not change height between states; the summary
  appears only after the user's own submit.
- Weight: `@angular/core` and `@angular/common` only; no router dependency (the
  links are plain fragment `href`s handled by the component).

## Acceptance criteria

### Error summary

- **AC-1** Given `st-error-summary` with title "Fix 6 things before saving" and the six items of `pages/studio-editor/invalid`, when it renders, then the host has the class `form-summary`, `role="alert"`, `tabindex="-1"` and `aria-labelledby` naming an `h2` reading "Fix 6 things before saving", followed by a `ul` of six links, the first `href="#bookingUrl"` reading "Booking link: Enter a web address that starts with http:// or https://". (L2-054)
- **AC-2** Given `st-error-summary` with an empty `items` array, when it renders, then the host has no class, no role and no children, takes no space, and nothing is exposed to assistive technology. (L2-069)
- **AC-3** Given the studio editor with an empty summary and focus on "Save changes", when the refused save sets six items, then focus moves to the summary box and a screen reader announces "Fix 6 things before saving" with its list. (L2-067)
- **AC-4** Given the focused summary, when the owner presses Enter on "Hourly rate: Enter an amount of 0 or more", then focus moves to the input with `id="hourlyRate"`, it is scrolled into view clear of the sticky bar, and the page URL has no fragment. (L2-067)
- **AC-5** Given the item "Light score: Enter a whole number from 1 to 5" whose target sits in the closed Rubric scores section, when the owner activates it, then the section opens and focus lands on the Light score input. (L2-054)
- **AC-6** Given the summary showing six items with focus in the hourly rate field, when the application replaces the items with five, then focus stays in the hourly rate field. (L2-067)
- **AC-7** Given the sign-in page submitted with both fields empty, when the summary renders "Fix 2 things to sign in" with "Enter your email address" and "Enter your password", then the summary is focused and activating "Enter your password" focuses the password input. (L2-049)
- **AC-8** Given `headingLevel` 3, when the summary renders, then its heading is an `h3` styled exactly like the `h2` and the page's heading outline skips no level. (L2-069)

### Form actions

- **AC-9** Given The Junction Loft's editor with `st-form-actions sticky`, when the owner scrolls through Pricing and fees on a phone with a 34 px bottom safe-area inset, then the bar stays pinned to the viewport bottom with classes `form-actions form-actions--sticky` and its bottom padding is `--space-4` plus 34 px. (L2-065)
- **AC-10** Given the sticky bar at 1280 px, when a keyboard user tabs to the last field of the Disclosure section near the bottom of the viewport, then the focused field is scrolled fully above the bar. (L2-067)
- **AC-11** Given the sticky bar at 320 px with "Save changes", "Cancel" and "Not saved. Fix the 6 things listed above.", when it renders, then the two buttons share one line, the status wraps under them, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-12** Given the sticky bar at 360 px, when "Save changes" and "Cancel" are measured, then each is at least 44 px tall and they are `--space-3` apart. (L2-065)

### Save status

- **AC-13** Given `st-save-status` with `state` `dirty` and text "Unsaved changes", when it renders, then the host has the class `save-status` with no modifier, `role="status"`, and the text "Unsaved changes". (L2-069)
- **AC-14** Given the status present since the page loaded, when the owner saves and `state` becomes `saving` with "Saving…", then a screen reader announces "Saving…" once, politely, without focus moving. (L2-069)
- **AC-15** Given a save that succeeds, when `state` becomes `saved` with "Saved 13 Oct 2026, 10:02 am", then the host gains `save-status--saved` and the text is `--color-success-fg`. (L2-054)
- **AC-16** Given a refused save, when `state` becomes `error` with "Not saved. Fix the 6 things listed above.", then the host gains `save-status--error` and the text is `--color-danger-fg`. (L2-054)
- **AC-17** Given `pages/studio-editor/uploading` with `st-save-status id="save-hint"` reading "Wait for uploads to finish" and "Save changes" natively disabled with `aria-describedby="save-hint"`, when a screen reader reaches Save, then it is announced unavailable with the description "Wait for uploads to finish". (L2-057)
- **AC-18** Given a new studio with `state` `idle` and text "Not saved yet", when the text later becomes "", then the status keeps its 44 px height and the bar does not change height. (L2-065)

### Field rows

- **AC-19** Given the Pricing section's `.field-row` with "Hourly rate" and "Minimum booking (hours)", when it renders at 360 px and at 768 px, then the fields stack in one column at 360 px and sit side by side in two equal columns at 768 px. (L2-054)
- **AC-20** Given the filters sheet at 320 px with `.field-row--pair` holding "Minimum" and "Maximum" and the error "The minimum must be lower than the maximum" under Maximum, when it renders, then the two fields stay side by side, the error wraps under Maximum, and nothing scrolls sideways. (L2-064)
- **AC-21** Given the Rubric scores section with `.field-row--fit-sm`, when it renders at 320 px and at 1280 px, then no score field is narrower than 7rem or overflows, and all six sit in one row at 1280 px. (L2-064)

### Screen readers and theming

- **AC-22** Given `pages/studio-editor/invalid` and `pages/sign-in/invalid`, when axe-core scans them in light and dark, then the summary, actions and status report no violations. (L2-069)
- **AC-23** Given the summary, the focused summary and the three status colours, when the contrast check runs in light and dark, then the summary text and links are at least 4.5:1 on `--color-danger-bg`, each status text at least 4.5:1 on the canvas, and the focus ring at least 3:1. (L2-068)
- **AC-24** Given `pages/studio-editor/invalid` at 200 % zoom in a 1280 px viewport, when the owner activates each summary link in turn, then every target field and the sticky bar's buttons are visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): form layout adds
no animation; sections open instantly and the busy spinner on Save keeps
turning under `prefers-reduced-motion: reduce`
([form-layout.html](../../design-system/components/form-layout.html), Accessibility › Motion).

### Performance

- **AC-25** Given the `form-layout/performance` harness route, when the refused save sets six summary items and the error status in one update, then the next paint, including the focus move to the summary, follows within 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- `frontend/projects/components/src/lib/error-summary/`:
  `error-summary.component.ts` (`ErrorSummaryComponent`, selector
  `st-error-summary`), `.html`, `.css`. Host bindings for `class`, `role`,
  `tabindex`, `aria-labelledby` are `null` while `items` is empty, and
  `:host(:not(.form-summary)) { display: none; }`. A click listener on the
  links calls `preventDefault()`, walks `target.closest('details:not([open])')`
  upward setting `open = true`, then `target.focus()`. The document comes from
  `inject(DOCUMENT)` and focus runs only in the browser (ICD-SSR-1).
- `frontend/projects/components/src/lib/form-actions/`:
  `form-actions.component.ts` (`FormActionsComponent`, `st-form-actions`),
  `.html` (`<ng-content />`), `.css` (the `.form-actions*` rules against
  `:host` and `:host(.form-actions--sticky)`).
- `frontend/projects/components/src/lib/save-status/`:
  `save-status.component.ts` (`SaveStatusComponent`, `st-save-status`), `.html`
  (`{{ text() }}`), `.css`.
- `styles/foundations.css` gains `html:has(.form-actions--sticky) { scroll-padding-bottom: … }`
  from `components.css` (D-4). `styles/utilities.css` gains `.field-row--pair`,
  `.field-row--fit`, `.field-row--fit-sm` beside `.field-row`, written after
  the `@media (min-width: 36rem) { .field-row … }` rule so they win (D-8).
- ICD change (ICD-002 1.1.0, additive): §11.1 Layout utilities gain
  `.field-row--pair`, `.field-row--fit`, `.field-row--fit-sm` (D-5).
- `.editor-form`, `.auth` and `.auth__head` are ported by the application into
  feature CSS (ICD §11.2); `:is(.stack, .auth) > .form-summary { margin-bottom: 0 }`
  is not ported (D-3).
- Mock drift the components correct: the sign-in summary's `autofocus` and
  missing `aria-labelledby`; summary wording "problems" and lower-cased messages
  (spot editor) and "This guide can't be published yet" (guide editor); busy
  Save labels swapped to "Saving…" (spot and guide editors); `.save-status--saved`
  and `--error` unused in the mocks; inline `grid-template-columns` on 32 field
  rows.

## Decisions

- **D-1** *ICD-FORM-7 moves focus only when `items` goes from empty to non-empty; how does a second refused save focus the summary again?* The application sets `items` to `[]` when a submit starts, so the summary disappears while saving and reappears, focused, if the save is refused. Moving focus on every change would steal focus whenever the list updates while the owner is fixing fields.
- **D-2** *A summary link's target may sit in a collapsed editor section, which cannot take focus. Who opens it?* The summary opens every closed `details` ancestor of the target before focusing it; ICD-FORM-7 requires focus to land on the target, and the DS says each link opens its section. [`st-editor-section`](editor-layout.md) keeps its `open` model in step with the native `toggle` event.
- **D-3** *The DS gives `.form-summary` a `--space-6` bottom margin, removed inside `.stack` and `.auth`. Who owns that spacing?* The application: the summary has no outer margin, and the editor form or sign-in layout spaces it with its gap or a margin on the host (ICD-DOM-5). Spacing between a page's blocks is page layout (ICD §14), and a component cannot see its parent's class reliably.
- **D-4** *Where does the `html:has(.form-actions--sticky)` scroll padding live, given component CSS is encapsulated and cannot style `html`?* In the library's global `foundations.css`, like the compare bar's `html:has(body.has-compare-bar)` rule. It needs nothing from the application and keeps WCAG 2.4.11 met wherever the sticky bar appears.
- **D-5** *The DS adds `.field-row--pair`, `--fit` and `--fit-sm`; ICD §11.1 lists only `.field-row`.* The three modifiers become global utilities (ICD-002 1.1.0, additive). Thirty-two field rows in the mocks need them, and the application may not write inline grid styles for each.
- **D-6** *Which save state is "All changes saved" (an editor opened with nothing changed) and "Wait for uploads to finish"?* `idle` and `dirty`, both neutral. The DS reserves the success colour for "Saved …" after a save in this session and the danger colour for a refused save; uploading means there are unsaved changes.
- **D-7** *Does the summary style `h4`?* Yes, the same as `h2` and `h3` (`--text-label` at `--font-size-md`), because `headingLevel` allows 4 and the DS styles only `h2` and `h3`.
- **D-8** *In `components.css` the default row's `@media (min-width: 36rem) { .field-row { two columns } }` comes after the modifiers with the same specificity, so from 36rem `.field-row--fit` and `--fit-sm` collapse to two columns and the six rubric scores never share a row. Which wins?* The modifier, at every width: the utilities stylesheet orders the modifiers after the media query. The DS describes them as "as many columns as fit", which only holds that way; the DS stylesheet catches up at the next extraction.
