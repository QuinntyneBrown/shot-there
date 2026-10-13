# Editor layout

| Field | Value |
|---|---|
| Selector | `st-editor-section`; application layout classes `.editor-layout`, `.editor-aside`, `.editor-aside__meta`, `.editor-form`, `.fee-row` |
| Library path | `frontend/projects/components/src/lib/editor-section/` (library); `frontend/projects/shot-there/src/app/features/admin/studio-editor/`, `…/admin/spot-editor/`, `…/admin/guide-editor/` (application: `StudioEditorPageComponent`, `SpotEditorPageComponent`, `GuideEditorPageComponent`) |
| Status | planned |
| Traces to | L2-042, L2-054, L2-056, L2-057, L2-061, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`editor-layout.html`](../../design-system/components/editor-layout.html), [`form-layout.html`](../../design-system/components/form-layout.html), [`forms.html`](../../design-system/patterns/forms.html) |
| Source mocks | [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/invalid`](../../mocks/pages/studio-editor/invalid.html), [`pages/studio-editor/submitting`](../../mocks/pages/studio-editor/submitting.html), [`pages/studio-editor/success`](../../mocks/pages/studio-editor/success.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/studio-editor/price-changed`](../../mocks/pages/studio-editor/price-changed.html), [`pages/studio-editor/uploading`](../../mocks/pages/studio-editor/uploading.html), [`pages/studio-editor/upload-failed`](../../mocks/pages/studio-editor/upload-failed.html), [`pages/studio-editor/loading`](../../mocks/pages/studio-editor/loading.html), [`pages/studio-editor/error`](../../mocks/pages/studio-editor/error.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/invalid`](../../mocks/pages/spot-editor/invalid.html), [`pages/spot-editor/published`](../../mocks/pages/spot-editor/published.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html), [`pages/guide-editor/invalid`](../../mocks/pages/guide-editor/invalid.html), [`dialogs/unpublish/default`](../../mocks/dialogs/unpublish/default.html), [`dialogs/discard-changes/default`](../../mocks/dialogs/discard-changes/default.html), [`dialogs/missing-fields/default`](../../mocks/dialogs/missing-fields/default.html) |
| Rendering | [`editor-layout.html`](editor-layout.html) |

## Purpose and scope

The editor layout is the owner's one long form for a studio, a spot or a guide:
a status panel that says whether the location is a draft or published and holds
Publish or Unpublish and Delete, beside a form split into collapsible sections,
with the save bar pinned to the bottom of the screen. Sections fold away so the
owner can work on one part at a time without losing values (L2-054.6).

It has two owners (ICD-002 §11.2). The collapsible **section** is the library
component `st-editor-section` (`<details>` with `<summary><hN>`). The
**layout** (`.editor-layout`, the `.editor-aside` status panel, `.editor-form`
and the `.fee-row` repeating rows) is application feature CSS in the three
editor pages. Both are specified here because they are built and tested
together, through every editor screen state.

Use [`form-layout`](form-layout.md) on its own for short forms (sign-in), a
[`dialog`](dialog.md) for a confirmation, and the [`review-layout`](review-layout.md)
for anything public.

Out of scope:

- The fields inside the sections ([`form-field`](form-field.md),
  [`text-field`](text-field.md), [`select`](select.md), [`textarea`](textarea.md),
  [`checkbox`](checkbox.md), [`radio-group`](radio-group.md)), including the
  price-changed warning well on the "Prices last verified" field.
- The error summary, save bar and save status
  ([`form-layout`](form-layout.md)), the image manager in Images and Sample
  shots ([`image-manager`](image-manager.md), [`file-upload`](file-upload.md),
  [`progress`](progress.md)), the success alert ([`alert`](alert.md)), the
  error empty state ([`empty-state`](empty-state.md)), the status label
  ([`status-label`](status-label.md)) and the dialogs the panel opens
  (unpublish, delete, missing fields, discard changes).
- Validation, which sections open after a refused save, publishability, slugs
  and the price rule: application and server logic.

## Usage

Every `.editor-section`, `.editor-aside` and `.fee-row` in `docs/mocks/`: the
studio editor (11 states), spot editor (8), guide editor (8), and the editor
drawn behind 16 dialog and toast mocks.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio-editor/*` sections | `st-editor-section` `headingLevel` 2: "Basics", "Pricing and fees", "Measured specifications", "Gear", "Logistics", "Images", "Rubric scores", "Verdict", "Disclosure", "Episode video" | fields, field rows, fieldsets, fee rows, image lists | open; closed (Gear, Logistics, Verdict, Episode video on default; all but Basics on published); invalid (5 sections on invalid) | surface on canvas |
| `pages/spot-editor/*` sections | "Basics", "Location", "How to get there", "Best light", "Practical conditions", "Permits", "Best uses", "Sample shots", "Disclosure", "Episode video" | fields, preview map, image list | open, closed (published), invalid (4) | surface |
| `pages/guide-editor/*` sections | "Basics", "Entries" | fields; entry rows and "Add entry" | open, invalid ("Entries" refused: no entries) | surface |
| `pages/*-editor/loading` | `st-editor-section` `loading` × 4 | none | loading | surface |
| Status panel, new | `aside.editor-aside` "Status"; "Visibility" "Not saved yet"; "Public address" "Made from the name when you create the studio" (spot and guide: a caption "The spot is saved as a draft when you create it. …") | no buttons | new, submitting (new) | canvas |
| Status panel, draft | "Draft · not on the public site"; "Public address once published" `/studios/corktown-garage-studio` | secondary "Publish" (`aria-haspopup="dialog"`); ghost-danger "Delete studio" / "Delete spot" / "Delete guide"; spot caption "Needed before publishing: a permit source link and at least one best use." | default, invalid, submitting, success, price changed, uploading, upload failed | canvas |
| Status panel, published | "Published · on the public site"; "Public address" link `/studios/the-junction-loft` | secondary "Unpublish" (`aria-haspopup="dialog"`); disabled "Delete studio" described by "Unpublish before deleting." | published | canvas |
| `pages/studio-editor/*` Pricing and fees, Gear | `.fee-row` in a `fieldset.stack.stack--sm`: Fees (name, amount `$`, type, Remove), Included in the hourly rate (category, item, quantity, Remove), Costs extra (empty: "Nothing yet. Visitors will see "Nothing costs extra".") | `st-text-field`, `st-select`, ghost "Remove" with hidden " Cleaning fee"; secondary sm "Add fee", "Add included item", "Add extra" | default, invalid (amount error) | sunken row on surface |
| Every editor | `.editor-layout` with `.editor-aside` first and `form.editor-form` second; `st-form-actions sticky` with "Save changes" / "Create studio", ghost "Cancel", `st-save-status` | — | all | canvas |
| `pages/studio-editor/error` | No layout: error empty state "We couldn't open this studio", "Back to studios", "Try again" | — | error | canvas |

Every row is buildable: the section takes `title`, `headingLevel`, `open`,
`errorText` and `loading` (D-1, D-2), with fields in its default slot; the panel,
form and rows are application markup composing library controls.

## Anatomy

`st-editor-section` (library):

1. **Section** — native `details.editor-section`; `open` attribute while open;
   `data-invalid` while it holds a refused field. Hairline
   `--color-border-default` edge, `--radius-lg`, `--color-bg-surface`.
2. **Heading row** — `summary`: 52 px (`--control-height-lg`) row, `--space-3`
   × `--space-5` padding, holding the `hN` (`--text-h4`) and a CSS chevron on
   the right that turns when open. No native marker.
3. **Error count (invalid only)** — `span.editor-section__errors` at the end of
   the summary, `--text-body-sm`, `--color-danger-fg` ("1 error").
4. **Body** — `div.editor-section__body`: the default slot, fields `--space-5`
   apart, padded `--space-2` `--space-5` `--space-6`. Stays in the DOM when the
   section closes.
5. **Skeleton row (loading only)** — `div.editor-section.editor-section--skeleton`
   holding a title skeleton, the same 52 px tall.

Host: the block must be a native `<details>`, so the component renders it and
the host `st-editor-section` adds no box (`display: contents`, ICD-DOM-1); the
`details` is a flex item of `.editor-form`.

Layout (application):

1. **Grid** — `div.editor-layout`: status panel first in the source, then the form.
2. **Status panel** — `aside.editor-aside` labelled by its `h2` "Status"
   (`--text-h4`), hairline edge, `--radius-lg`, `--space-5` padding, `--space-4`
   between parts; `dl.editor-aside__meta`; then the actions and their hint.
3. **Form** — `form.editor-form` labelled by a visually hidden `h2` ("Studio
   details"): the error summary when present, the sections `--space-4` apart,
   then the sticky save bar.
4. **Repeating row** — `div.fee-row`: a sunken well holding the row's fields
   and its Remove button.

## API

### `st-editor-section`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | Text of the summary heading ("Pricing and fees"). Product copy. |
| `headingLevel` | `HeadingLevel` | `2` | no | Renders `h2`, `h3` or `h4` inside the `summary` (ICD-API-13). |
| `open` | `boolean` (model) | `true` | no | Two-way: sets the native `open` attribute, and updates (emitting `openChange`) when the owner toggles the section or the browser opens it (find in page). |
| `errorText` | `string \| null` | `null` | no | ICD change (D-1). When non-empty: the `details` gets `data-invalid` and the summary ends with `<span class="editor-section__errors">{errorText}</span>` ("1 error", "2 errors"), formatted by the application. |
| `loading` | `boolean` | `false` | no | ICD change (D-2). Renders only the skeleton row (`div.editor-section.editor-section--skeleton`, `aria-hidden="true"`) with a title skeleton as wide as `title` in `ch`; no `details`, no body. |

`loading` uses `booleanAttribute`.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `openChange` | `boolean` (the new open state) | The model's change event: the owner opened or closed the section, or the browser opened it. Not emitted when the consumer sets `open`. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Fields, `.field-row`s, fieldsets, `.fee-row`s, image lists, help text | Projected in `.editor-section__body`. Kept in the DOM while closed, so values and form state survive. |

Library strings: none.

### Application layout

| Class | Element | Rule |
|---|---|---|
| `.editor-layout` | `div` | One column, `gap: --space-8`; from 62rem `grid-template-columns: minmax(0, 1fr) 18rem`, `gap: --space-12`. |
| `.editor-aside` | `aside[aria-labelledby]` | Flex column, `gap: --space-4`, `padding: --space-5`, hairline `--color-border-default`, `--radius-lg`, `align-self: start`; its `h2` takes `--text-h4`. From 62rem `position: sticky; top: --space-8; order: 2`. Buttons are direct children and stretch to its width (D-4). |
| `.editor-aside__meta` | `dl` | Flex column, `gap: --space-1`, `--text-body-sm`, `dt` in `--color-fg-muted`; `dd` in `--color-fg-default`, `--space-2` below, `overflow-wrap: anywhere`. |
| `.editor-form` | `form[aria-labelledby]` | Flex column, `gap: --space-4`, `min-width: 0`; `method="post"`, `novalidate`. |
| `.fee-row` | `div` | Grid, one column, `gap: --space-3`, `padding: --space-4`, `--color-bg-surface-sunken`, `--radius-md`. Its parent (`fieldset`) is an inline-size container; when the row has 34rem of its own width it becomes `minmax(0, 2fr) minmax(7rem, 1fr) minmax(0, 1.4fr) auto`, `align-items: end`. |

## Variants and sizes

| Variant | Status panel | Primary in the save bar | Sections |
|---|---|---|---|
| New | "Not saved yet"; address "Made from the name when you create the studio" (spot, guide: a caption); no actions | "Create studio" / "Create spot" / "Create guide" | Every section open and empty; Name focused |
| Draft | `st-status` "Draft" · "not on the public site"; "Public address once published" in `<code>`; "Publish"; ghost-danger "Delete studio" | "Save changes" | Long sections closed (Gear, Logistics, Verdict, Episode video) |
| Published | `st-status` "Published" · "on the public site"; "Public address" as a link; "Unpublish"; "Delete studio" disabled + hint | "Save changes" | Only Basics open |

| Editor | Sections |
|---|---|
| Studio | Basics, Pricing and fees, Measured specifications, Gear, Logistics, Images, Rubric scores, Verdict, Disclosure, Episode video |
| Spot | Basics, Location, How to get there, Best light, Practical conditions, Permits, Best uses, Sample shots, Disclosure, Episode video |
| Guide | Basics, Entries |

One size. The form column takes the remaining width; the status panel is 18rem
from 62rem.

| Part | Measure | Token or value |
|---|---|---|
| Status panel width (62rem+) | 18rem | literal in `.editor-layout` |
| Gap between panel and form | 32 px below 62rem, 48 px from 62rem | `--space-8` / `--space-12` |
| Panel padding / inner gap | 20 px / 16 px | `--space-5` / `--space-4` |
| Sticky offset (62rem+) | 32 px | `--space-8` |
| Section heading row | 52 px, 12 × 20 px padding | `--control-height-lg`, `--space-3` × `--space-5` |
| Gap between sections | 16 px | `--space-4` |
| Section body | 20 px between fields; 8 / 20 / 24 px padding | `--space-5`; `--space-2`, `--space-5`, `--space-6` |
| Repeating row | 16 px padding, 12 px between fields | `--space-4`, `--space-3` |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Section closed | `open` false | Heading row only; chevron points down (45°) | Summary is a button, "collapsed"; body fields leave the tab order |
| Section hover | `:hover` on the summary | Pointer cursor; no fill change | — |
| Section focus | `:focus-visible` on the summary | `--focus-ring-width` ring in `--color-focus-ring`, `--radius-lg` corners | — |
| Section active | Press | No pressed style; activation toggles | — |
| Section disabled | Never | Sections never disable; fields stay editable while saving (D-5) | — |
| Section open | `open` true | Body shown; chevron turned up (225°) | "expanded" |
| Section invalid | `errorText` "1 error" (with `open` true from the application) | `--color-danger-border` edge; "1 error" in `--color-danger-fg` before the chevron | The count is part of the summary's name ("Rubric scores 1 error") |
| Section loading | `loading` | Skeleton row, 52 px | `aria-hidden` |
| New | Create path | Panel "Not saved yet", no actions; all sections open; Name focused; "Create studio" | Focus on Name |
| Default (unsaved) | Draft with edits | Panel with Publish and Delete; "Unsaved changes" | Save status polite |
| Invalid | Refused save | `st-error-summary` "Fix 6 things before saving" above the first section, focused; each section holding an error open and invalid; "Not saved. Fix the 6 things listed above." | Summary `role="alert"`; links focus fields |
| Submitting | Save pending | Every field visible and editable; "Save changes" busy; "Saving…" | "Saving…" announced |
| Success | Create or save done | Success alert "Studio created as a draft" with the final address above the layout; "Saved 13 Oct 2026, 10:02 am" | Alert `role="status"` |
| Published | Published record | Panel Published, Unpublish, Delete disabled with "Unpublish before deleting."; only Basics open | Delete described by its hint |
| Price changed | Hourly rate or a fee changed | "Prices last verified" emptied, required, warning well, focused: "You changed a price. Confirm the date you verified it." | Focus on the date field |
| Uploading | Upload in progress | Per-file progress in Images; "Save changes" disabled, described by "Wait for uploads to finish" | Save status polite |
| Upload failed | An upload failed | The failed file shows its error and Retry inside the open Images section; Save stays available | Error `role="alert"` (image manager) |
| Loading | Record loading | Page header loading; panel of skeleton bars; four skeleton section rows; the layout is `aria-hidden`, `main` `aria-busy="true"`; "Loading studio…" | Status region announces |
| Error | Unknown id or failed load | No layout: error empty state "We couldn't open this studio", "Back to studios", "Try again" | One `h1` (D-6) |

## Markup

```html
<!-- rendered: st-editor-section, open -->
<st-editor-section>
  <details class="editor-section" open>
    <summary><h2>Basics</h2></summary>
    <div class="editor-section__body">…fields…</div>
  </details>
</st-editor-section>
```

```html
<!-- rendered: invalid -->
<details class="editor-section" open data-invalid>
  <summary><h2>Rubric scores</h2><span class="editor-section__errors">1 error</span></summary>
  <div class="editor-section__body">…</div>
</details>
```

```html
<!-- rendered: closed; loading -->
<details class="editor-section"><summary><h2>Gear</h2></summary><div class="editor-section__body">…</div></details>
<div class="editor-section editor-section--skeleton" aria-hidden="true"><st-skeleton class="skeleton skeleton--title" style="width: 16ch"></st-skeleton></div>
```

```html
<!-- consumer: one section -->
<st-editor-section i18n-title title="Rubric scores" [(open)]="sections.scores" [errorText]="sectionErrors().scores">
  <p class="text-caption" i18n>Whole numbers from 1 to 5. The overall score is calculated by the server.</p>
  <div class="field-row field-row--fit-sm">
    <st-text-field i18n-label label="Light" inputId="scores-light" type="number" inputmode="numeric" min="1" max="5"
                   formControlName="light" [error]="errors().scoresLight" />
    …
  </div>
</st-editor-section>
```

```html
<!-- application: the layout (studio editor, published) -->
<div class="editor-layout">
  <aside class="editor-aside" aria-labelledby="status-title">
    <h2 id="status-title" i18n>Status</h2>
    <dl class="editor-aside__meta">
      <dt i18n>Visibility</dt><dd><st-status status="published" i18n>Published</st-status> · <ng-container i18n>on the public site</ng-container></dd>
      <dt i18n>Public address</dt><dd><a [routerLink]="vm().publicPath"><code>/studios/the-junction-loft</code></a></dd>
    </dl>
    <button st-button type="button" aria-haspopup="dialog" (click)="openUnpublish()" i18n>Unpublish</button>
    <button st-button variant="ghost-danger" type="button" disabled aria-describedby="delete-hint" i18n>Delete studio</button>
    <p class="text-caption" id="delete-hint" i18n>Unpublish before deleting.</p>
  </aside>
  <form class="editor-form" [formGroup]="form" (ngSubmit)="save()" novalidate aria-labelledby="form-title">
    <h2 class="visually-hidden" id="form-title" i18n>Studio details</h2>
    <st-editor-section i18n-title title="Basics">…</st-editor-section>
    <st-editor-section i18n-title title="Pricing and fees" [open]="false">
      …
      <fieldset class="stack stack--sm">
        <legend i18n>Fees</legend>
        @for (fee of fees.controls; track fee; let i = $index) {
          <div class="fee-row" [formGroup]="fee">
            <st-text-field i18n-label label="Fee name" formControlName="name" />
            <st-text-field i18n-label label="Amount" type="number" inputmode="decimal" min="0" prefix="$" formControlName="amount" />
            <st-select i18n-label label="Type" [options]="feeTypes" formControlName="mandatory" />
            <button st-button variant="ghost" type="button" (click)="removeFee(i)"><ng-container i18n>Remove</ng-container><span class="visually-hidden"> {{ fee.value.name }} <ng-container i18n>fee</ng-container></span></button>
          </div>
        }
        <div><button st-button size="sm" type="button" (click)="addFee()"><st-icon name="plus" /><ng-container i18n>Add fee</ng-container></button></div>
      </fieldset>
    </st-editor-section>
    …
    <st-form-actions sticky>
      <button st-button variant="primary" type="submit" [busy]="saving()" [disabled]="uploading()" [attr.aria-describedby]="uploading() ? 'save-hint' : null" i18n>Save changes</button>
      <a st-button variant="ghost" [routerLink]="paths.adminStudios" i18n>Cancel</a>
      <st-save-status id="save-hint" [state]="saveState()" [text]="saveText()" />
    </st-form-actions>
  </form>
</div>
```

The section's `summary`, `hN`, `.editor-section__errors` and `.editor-section__body`
are the contract page objects use; the chevron is CSS and not in the DOM.

## Design

- Section: `border: --border-width-hairline solid --color-border-default`,
  `--radius-lg`, `--color-bg-surface`; invalid `border-color:
  --color-danger-border`.
- Summary: flex row, `align-items: center`, `gap: --space-3`, `min-height:
  --control-height-lg`, `padding: --space-3 --space-5`, `cursor: pointer`,
  `list-style: none`, no `::-webkit-details-marker`, `--radius-lg`; heading
  `--text-h4`. Chevron `::after`: `--space-2` square of `--border-width-thick`
  right and bottom borders in `currentColor`, `margin-left: auto`, `rotate:
  45deg`, `225deg` when open, `transition: rotate --duration-fast
  --ease-standard`. With the error count, the count takes `margin-left: auto`
  and the chevron follows it.
- Error count `--text-body-sm`, `--color-danger-fg`.
- Body flex column, `gap: --space-5`, padding `--space-2 --space-5 --space-6`.
- Skeleton row: flex, centred, `min-height: --control-height-lg`, padding
  `--space-3 --space-5`, same edge and radius.
- Layout as in the application table; repeating row `--color-bg-surface-sunken`,
  `--radius-md`.
- No component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Section and panel edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Section background | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Repeating row | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Invalid section edge | `--color-danger-border` | `--palette-sorrel-300` | `--palette-sorrel-700` |
| Error count | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Heading, values | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Status details terms | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Section heading, labels |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Error count in the summary |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Status details |
| `--color-danger-fg` | `--color-bg-canvas` | 4.5:1 | "Delete studio" label |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Labels in a repeating row |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a section heading |

The section and panel edges and the invalid edge are decorative: grouping is
carried by the headings and errors by text (the count, the error summary, the
field messages). Forced colours: edges become `CanvasText`; the invalid state is
still read from the count.

## Responsive behaviour

- Below 48rem (XS, SM): one column. The status panel comes first, above the
  form; sections are full width; repeating rows stack name, amount, type and
  Remove; every control is at least 44 px tall; the save bar pins to the bottom
  with `env(safe-area-inset-bottom)` padding.
- 48–62rem (MD): still one column; repeating rows go onto one line once they
  have 34rem; `.field-row`s sit side by side from 36rem.
- From 62rem (LG+): two columns, the form then the 18rem status panel 48 px
  apart; the panel moves right with `order: 2` and sticks 32 px from the top.
  Between 62rem and 75rem the repeating row stays stacked because it measures
  its own width (container query), and the amount column never drops below 7rem.
- The heading row is the whole 52 px × full-width target. Long headings and
  addresses wrap (the address breaks anywhere).
- At 320 px nothing scrolls horizontally; at 200 % zoom the one-column layout
  takes over.

## Accessibility

### Role and pattern

Each section is a native `details`/`summary`, the browser's built-in
[APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): the
summary is announced as a button with its expanded state; no ARIA is added. The
`hN` inside keeps the section in the heading outline (some screen readers
announce only the summary text; the name is the same). The status panel is an
`aside` named by "Status"; the form is named by its visually hidden `h2`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Status panel, then each section heading and the fields of open sections, then the save bar. Fields in closed sections are skipped. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | On a section heading: opens or closes it. |
| <kbd>Enter</kbd> in a text field | Submits the form ("Save changes" or "Create studio"). |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>F</kbd> | Find in page opens a closed section holding the match, where the browser supports it; `open` updates. |

### Focus

The shared 2 px ring shows on the summary. The component never moves focus. The
application focuses Name on a new record, the error summary after a refused save
(its links focus fields in already-open sections), "Prices last verified" after
a price change, and an uploaded image's alt text. The status panel is first in
the DOM, so on phones it reads first and from 62rem it is still first in the tab
order although it sits on the right: status, then content, then save.

### Labelling

- Section names are the summary headings; the error count joins the summary's
  name ("Rubric scores 1 error"), so the invalid state never relies on the edge
  colour (WCAG 1.4.1).
- Remove buttons name their row with hidden text ("Remove Cleaning fee",
  "Remove Godox AD600 strobe").
- The disabled "Delete studio" is described by "Unpublish before deleting."; a
  disabled "Save changes" by the save status "Wait for uploads to finish".
- Field errors use `aria-invalid` and `aria-describedby` (the controls' CRDs).

### Announcements

The section announces nothing. The save status (`role="status"`), the error
summary (`role="alert"`) and the success alert are the announcers.

### Motion

Only the chevron moves: it turns over `--duration-fast` with `--ease-standard`,
and reduced motion zeroes the duration. Sections open instantly. A
design-system rule with no acceptance criterion (L2 has no motion requirement).

## Content and internationalisation

- Section headings are short nouns in sentence case and follow the public
  review's order: "Basics", "Pricing and fees", "Measured specifications", …
- The panel heading is "Status". Terms "Visibility" and "Public address"
  ("Public address once published" on a draft). Values say what visitors see:
  "Draft · not on the public site", "Published · on the public site", "Not saved
  yet".
- Actions name the object: "Publish", "Unpublish", "Delete studio", "Create
  studio", "Save changes". When blocked, say what to do: "Unpublish before
  deleting."
- The error count is "1 error" / "2 errors", built by the application with an
  ICU plural.
- Save status: "Unsaved changes", "Saving…", "Saved 13 Oct 2026, 10:02 am", "Not
  saved. Fix the 6 things listed above.", "Wait for uploads to finish".
- Empty lists say what visitors will see: "Nothing yet. Visitors will see
  "Nothing costs extra"."
- Translatable: `title`, `errorText`, every projected label and help text. Data:
  names, slugs, file names.

## Performance

- Change detection: `OnPush`; signal inputs and the `open` model; the errors
  span and `data-invalid` come from one `computed`.
- The body stays rendered while closed (the browser hides it), so toggling
  creates and destroys nothing.
- Performance scenario: the `components-harness` route
  `editor-layout/performance` renders the studio editor's ten sections for
  Corktown Garage Studio (six open, four closed) inside `.editor-layout` with
  the draft status panel, and toggles "Gear"; held to the L2-071 interaction
  budget.
- Regression rule: a change to the section's template, inputs or styles, or to
  the layout CSS, is measured on that route against the base branch before it is
  pushed.
- Layout stability: the loading skeleton rows are the closed section's height,
  so nothing shifts when sections arrive closed.
- Weight: imports `@angular/core` and `st-skeleton` only.

## Acceptance criteria

### Section

- **AC-1** Given `<st-editor-section title="Basics">` with the Name field projected, when it renders, then it is a `details.editor-section` with `open`, whose `summary` holds an `h2` "Basics", whose `.editor-section__body` holds the field, and the host adds no box of its own. (L2-054)
- **AC-2** Given the "Gear" section with `[open]="false"` holding "Profoto D2 strobe" × 3, when the owner opens and closes it, then the body fields are skipped by Tab while closed and still hold "Profoto D2 strobe" and 3 after it reopens. (L2-054)
- **AC-3** Given focus on the closed "Logistics" heading, when the owner presses Enter and then Space, then the section opens and then closes, and `openChange` emits `true` and then `false`. (L2-067)
- **AC-4** Given a section heading, when a keyboard user tabs to it, then a `--focus-ring-width` ring in `--color-focus-ring` with at least 3:1 against `--color-bg-surface` follows its rounded corners. (L2-067)
- **AC-5** Given the "Rubric scores" section with `errorText` "1 error", when a screen reader reaches its heading, then it is announced as an expanded button whose name includes "Rubric scores" and "1 error". (L2-069)
- **AC-6** Given that section in the light and the dark theme, when it renders, then the `details` has `data-invalid`, "1 error" sits at the end of the summary before the chevron in `--color-danger-fg`, and its contrast against `--color-bg-surface` is at least 4.5:1. (L2-068)
- **AC-7** Given `headingLevel` 3, when the section renders, then its summary holds an `h3`. (L2-069)
- **AC-8** Given `loading` with the title "Pricing and fees", when it renders, then it is a 52 px `div.editor-section.editor-section--skeleton` with `aria-hidden="true"`, no `details`, and no projected content. (L2-069)
- **AC-9** Given the studio editor at 360 px, when a section heading is measured, then its target is the full section width and at least 44 px tall. (L2-065)

### Screens

- **AC-10** Given the studio editor at 320 px, when it renders, then the form is one column of sections with collapsible headings, every control is at least 24 px tall, and `document.documentElement.scrollWidth` equals 320. (L2-054)
- **AC-11** Given a new studio, when the editor opens, then the status panel says "Not saved yet" and "Made from the name when you create the studio" with no Publish or Delete, every section is open, focus is on Name, and the save bar's primary is "Create studio". (L2-054)
- **AC-12** Given "Corktown Garage Studio" was just created, when the editor shows it, then a success alert "Studio created as a draft" with "Its address will be /studios/corktown-garage-studio" sits above the layout and the save status reads "Saved 13 Oct 2026, 10:02 am". (L2-054)
- **AC-13** Given the draft Corktown Garage Studio, when the status panel renders, then it shows "Draft · not on the public site", a secondary "Publish" with `aria-haspopup="dialog"` and a ghost-danger "Delete studio", and "Save changes" is the only primary on the screen. (L2-056)
- **AC-14** Given the published The Junction Loft, when the status panel renders, then it shows "Published · on the public site", the link `/studios/the-junction-loft`, "Unpublish", and a disabled "Delete studio" described by "Unpublish before deleting.", and only "Basics" is open. (L2-061)
- **AC-15** Given a save refused with six errors, when the editor re-renders, then "Fix 6 things before saving" is focused above the first section, "Basics", "Pricing and fees", "Images", "Rubric scores" and "Disclosure" are open with `data-invalid` and their counts, and the save status reads "Not saved. Fix the 6 things listed above.". (L2-054)
- **AC-16** Given that error summary, when the owner activates "Light score: Enter a whole number from 1 to 5", then focus moves to the Light field inside the open "Rubric scores" section. (L2-054)
- **AC-17** Given "Save changes" is pending, when the editor renders, then every section and field stays visible and editable, "Save changes" is busy, and "Saving…" is announced once by the save status. (L2-069)
- **AC-18** Given the owner changed the hourly rate from $65.00 to $70.00, when the editor reacts, then "Prices last verified" is emptied, marked required, shows "You changed a price. Confirm the date you verified it." and has focus, inside the open "Pricing and fees" section. (L2-042)
- **AC-19** Given two gallery images uploading, when the save bar renders, then "Save changes" is disabled and described by "Wait for uploads to finish". (L2-057)
- **AC-20** Given gallery-04.jpg failed to upload, when the editor renders, then "Images" is open and shows the failure with a retry for that file, and every other section and field keeps its value. (L2-057)
- **AC-21** Given the studio record is loading, when the editor renders, then `main` has `aria-busy="true"`, the layout is `aria-hidden`, four skeleton section rows and a skeleton status panel show, and "Loading studio…" is in a status region. (L2-069)
- **AC-22** Given an unknown studio id, when the editor route renders, then there is no layout, the page has exactly one `h1`, and the error state "We couldn't open this studio" offers "Back to studios" and "Try again". (L2-069)

### Layout and rows

- **AC-23** Given the studio editor at 360 px and at 1280 px, when it renders, then at 360 px the status panel is full width above the first section, and at 1280 px it is an 18rem column on the right that stays 32 px from the top while the form scrolls. (L2-064)
- **AC-24** Given the draft studio editor at 360 px and at 1280 px, when a keyboard user tabs from the breadcrumb, then focus reaches "Publish" and "Delete studio" before the first section heading, and the save bar after the last field. (L2-067)
- **AC-25** Given the "Cleaning" fee row, when it renders, then it holds "Fee name", "Amount" with a `$` addon, "Type" (Mandatory / Optional) and a "Remove" button named "Remove Cleaning fee"; it stacks when the row is narrower than 34rem and is one line when wider. (L2-054)
- **AC-26** Given the studio editor at 360 px on a device with a 34 px bottom safe-area inset, when the save bar is pinned, then its bottom padding includes the inset and "Save changes" is at least 44 px tall. (L2-065)
- **AC-27** Given the published editor in the light and the dark theme, when the contrast check runs, then the status details, the "Delete studio" label and the labels in a repeating row are at least 4.5:1 against their backgrounds. (L2-068)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the chevron turns instantly; sections never
animate their height ([editor-layout.html](../../design-system/components/editor-layout.html),
Accessibility › Motion).

### Performance

- **AC-28** Given the `editor-layout/performance` harness route with ten sections, when the owner toggles "Gear", then the interaction-to-next-paint is at most 200 ms. (L2-071)

## Implementation notes

- Library folder `frontend/projects/components/src/lib/editor-section/`:
  `editor-section.component.ts` (`EditorSectionComponent`, selector
  `st-editor-section`, `:host { display: contents }`), `.html`, `.css` (port of
  `.editor-section*`). The template renders either the skeleton row or the
  `details`; the default slot is declared once inside an `<ng-template>` used
  by the `details` branch (ICD-API-9). `open` is `model(true)`; a `(toggle)`
  listener on the `details` sets it from `details.open`. Uses
  `SkeletonComponent`.
- ICD change (ICD-002 1.1.0, additive): `EditorSectionComponent` gains input
  `errorText`, `string | null`, default `null`, and input `loading`, `boolean`,
  default `false`.
- Application: the three editor pages render `.editor-layout`, `.editor-aside`,
  `.editor-form` and `.fee-row` in their own templates and carry the rules in
  their stylesheets. The detailed designs place the pages in
  `frontend/src/app/features/admin/…`, which is
  `frontend/projects/shot-there/src/app/features/admin/…` (ICD-002 D-1).
- Mocks drift the application corrects: the inline `style="font: var(--text-h4)"`
  on "Status" (now `.editor-aside > h2`); the inline danger colour on "Delete
  studio" (now `variant="ghost-danger"`, [button](button.md) D-2); "Publish",
  "Unpublish" and "Delete" drawn as links to dialog mocks (buttons with
  `aria-haspopup="dialog"`); invalid sections without a count (now
  `errorText`); loading rows and the price warning drawn with inline styles
  (now `loading` and the date field's warning); the editor stand-ins behind
  dialog mocks drawn as `div.editor-section` (now real sections); help text
  drawn with `.field__help` outside a field (now `.text-caption`, D-3);
  `id="entries"` on the guide's section `details` (the error summary targets
  the "Add entry" button instead, D-7).

## Decisions

- **D-1** *How does a section show it holds a refused field, when ICD-002 gives `st-editor-section` no input for it and the `details` is rendered by the library?* A new optional input `errorText` (ICD-002 1.1.0, additive). The DS requires `data-invalid` plus the count in words ("1 error") because the edge alone is below 3:1 and silent; the application formats the count and decides which sections open.
- **D-2** *How does the loading screen show skeleton section rows, when `.editor-section--skeleton` is library-owned and the application may not write it?* A new optional input `loading` (ICD-002 1.1.0, additive) that renders the 52 px skeleton row with a title skeleton as wide as the title. The application passes the real section titles, which it knows before the record arrives.
- **D-3** *The mocks draw section-level help ("Whole numbers from 1 to 5…", "Nothing yet. Visitors will see …") with `.field__help` outside any field, a library-owned class.* The application uses the global `.text-caption` for text that belongs to a section or fieldset rather than to one control.
- **D-4** *The DS widens the panel's buttons with `.editor-aside .btn { width: 100% }`, an application rule on a library class (ICD-DOM-5).* The panel is a flex column, so its direct-child buttons stretch to its width without the rule.
- **D-5** *Do sections or fields disable while saving?* No. Submitting never hides or disables fields; only the primary is busy (DS). Sections have no disabled state.
- **D-6** *The editor error mock renders the empty state's title as an `h1`, but `st-empty-state` takes `headingLevel` 2–4 and only two library components may render an `h1` (ICD-A11Y-3).* The application renders a visually hidden `h1` naming the screen ("Studio editor") and `st-empty-state` with `headingLevel` 2 and the title "We couldn't open this studio"; the page keeps one `h1` and looks as the mock does.
- **D-7** *The guide's error summary links "Add at least one entry before publishing" to `#entries`, the section's `details`, which is not focusable and is rendered by the library.* The link targets the "Add entry" button inside the open "Entries" section (`targetId` of that button), so activating it focuses a control, as ICD-FORM-7 requires.
- **D-8** *Does an invalid section force itself open?* No. The application sets `open` true for every section the server's errors touch (the component holds no rules, ICD-API-10); the owner may still close it, and the error summary links reopen nothing because they only target open sections.
