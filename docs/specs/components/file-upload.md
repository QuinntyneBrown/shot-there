# File upload

| Field | Value |
|---|---|
| Selector | `st-file-upload` |
| Library path | `frontend/projects/components/src/lib/file-upload/` |
| Status | planned |
| Traces to | L2-057, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`file-upload.html`](../../design-system/components/file-upload.html) |
| Source mocks | [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/studio-editor/uploading`](../../mocks/pages/studio-editor/uploading.html), [`pages/studio-editor/upload-failed`](../../mocks/pages/studio-editor/upload-failed.html), [`pages/studio-editor/invalid`](../../mocks/pages/studio-editor/invalid.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/new`](../../mocks/pages/spot-editor/new.html), [`pages/spot-editor/published`](../../mocks/pages/spot-editor/published.html) |
| Rendering | [`file-upload.html`](file-upload.html) |

## Purpose and scope

The file upload is how the owner adds test shots, gallery images and sample
shots in the studio and spot editors. A real `<input type="file">` does the
work; it is visually hidden and labelled by a small button-styled `<label>`,
and both sit in a dashed `.upload-drop` box with the accepted types. The
component reports the chosen files and shows the refusal lines the
application gives it. Each accepted file then becomes a row in the
[image manager](image-manager.md).

Use the [image manager](image-manager.md) for the rows, progress, Retry and
Cancel upload; this component only takes files in. The public site has no
uploads.

Out of scope:

- Checking type and size ("JPEG, PNG, WebP or AVIF, up to 20 MB each"): the
  application checks before uploading and the server checks again (L2-057.2,
  L2-057.3). The component emits every chosen file.
- Uploading, progress, Retry and Cancel upload: the application's
  `ImageUploadQueue` and the image rows.
- The group around it (`fieldset`, `legend`, the "No gallery images yet"
  line): the application's image set, see [image-manager.md](image-manager.md).
- Disabling Save changes while files upload: the editor (L2-057.6).

## Usage

Every `.upload-drop` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks upload-drop "div"`): 24 instances on 15 editor
mocks, three configurations.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Studio editor › Images › Standard test shots (`studio-editor/default`, `new`, `published`, `uploading`, `upload-failed`, `invalid`, `submitting`, `success`, `price-changed`) | `buttonLabel` "Add test shots", `hint`, `accept` "image/jpeg,image/png,image/webp,image/avif", `multiple` | none | default, focus | editor section (`--color-bg-surface`) |
| Studio editor › Images › Gallery (same mocks) | `buttonLabel` "Add gallery images", same hint, accept and multiple | none | default; refused ("studio-floorplan.svg isn't a supported image. Use JPEG, PNG, WebP or AVIF.", "raw-export.tif is 25 MB. The limit is 20 MB.") in `upload-failed` | editor section |
| Spot editor › Sample shots (`spot-editor/default`, `new`, `published`, `invalid`, `submitting`, `success`) | `buttonLabel` "Add sample shots", same hint, accept and multiple | none | default; refused "bluffs-pano.heic isn't a supported image. Use JPEG, PNG, WebP or AVIF." (design system) | editor section |

Every row is buildable with the API below: the label, hint, accept list and
`multiple` are inputs, the refusals are the new `errors` input, and the files
arrive through `filesSelected`. No mock disables the control; `disabled`
exists for the application's choice (ICD-002 §9.2).

## Anatomy

1. **Box** — the host `st-file-upload` carries `.upload-drop`: a wrapping flex
   row, `--border-width-thick` dashed `--color-border-strong` edge,
   `--radius-md`, padding `--space-4`, gap `--space-3`, `--text-body-sm` in
   `--color-fg-muted`. It frames the way in and accepts dropped files (D-2).
2. **Input** — `input.file-input.visually-hidden[type=file]`, first child. It
   keeps focus and keyboard access; never `display: none`.
3. **Trigger** — `label.btn.btn--sm[for]` right after the input: the visible
   control, drawn as a small secondary button. Its text is the input's
   accessible name. It shows the focus ring and the disabled look of the input.
4. **Accepted types** — `span` with the hint, tied to the input with
   `aria-describedby`. Rendered only when `hint` is set.
5. **Refusals** — `div.stack.stack--sm[role=alert]`, one `p.field__error` per
   refused file, on its own full-width line (`flex-basis: 100%`). Rendered only
   when `errors` is non-empty.

Host: `st-file-upload` is the `.upload-drop` box (ICD-DOM-1). The application
places it with margin or width only.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `buttonLabel` | `string` | — | yes | Trigger text and the input's accessible name: "Add test shots", "Add gallery images", "Add sample shots". |
| `hint` | `string \| null` | `null` | no | Accepted-types line, "JPEG, PNG, WebP or AVIF, up to 20 MB each."; its ID goes on the input's `aria-describedby`. |
| `accept` | `string` | `''` | no | Native `accept` on the input; `''` renders no attribute. The picker filter is a convenience only. |
| `multiple` | `boolean` | `false` | no | Native `multiple`; a drop of several files emits only the first when `false` (D-3). |
| `disabled` | `boolean` | `false` | no | Native `disabled` on the input; the trigger dims; drops are ignored. |
| `errors` | `readonly string[]` | `[]` | no | **ICD change (additive).** Refusal lines from the application, one per refused file, in order. A new array re-renders the alert group so it is announced again (D-4). |

Inputs are signal inputs; `multiple` and `disabled` use `booleanAttribute`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `filesSelected` | `File[]` (in the order the picker or the drop gives them, never empty) | Once per pick in the system picker that chose at least one file, and once per drop of at least one file on the box while not disabled. Cancelling the picker emits nothing. |

After each emission the component clears the input's value, so choosing the
same file again emits again (D-5). The component is not a form control
(ICD-002 §9.2): it has no value and no `ControlValueAccessor`.

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Every string is an input. |

The component has no library strings (ICD-002 §12).

## Variants and sizes

| Variant | Trigger | Use for |
|---|---|---|
| After a list of images | the image set has rows | The usual case: the box closes the set, new files join the end. |
| Empty set | the set has no rows | The box is the only control under the application's "No gallery images yet. Publishing needs at least one." line. Same component, same look. |
| With refusals | `errors` non-empty | The box adds a full-width alert group under the trigger and hint. |

| Size | Trigger height | Padding | Type |
|---|---|---|---|
| One size | `--control-height-sm` (36 px) from 48rem; `--target-comfortable` (44 px) below | box `--space-4`; trigger side padding `--space-3` | box `--text-body-sm`; trigger `--text-label` at `--font-size-sm` |

The box takes the width of its container (the editor section body).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Dashed box; secondary small trigger; muted hint | Input named "Add gallery images", described by the hint |
| Trigger hover | `:hover` on the label | Trigger fill `--color-bg-subtle` (button secondary hover) | — |
| Focus | `:focus-visible` on the input | Focus ring on the label (`.file-input:focus-visible + .btn`): `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset` | Focus on the input |
| Active | `:active` on the label | Trigger fill `--color-bg-subtle-hover`, 1 px down | — |
| Disabled | `disabled` input → native `disabled` | Trigger at 50 % opacity, `not-allowed` cursor; box unchanged | Input out of the tab order; announced unavailable |
| Refused | `errors` non-empty | One `.field__error` line per file in `--color-danger-fg`, full width under the trigger and hint; trigger unchanged | `role="alert"` group announced when it appears; focus does not move |
| Picking | system picker open | Browser's own picker | Focus returns to the input when it closes |

The box itself has no hover, focus, active or disabled look; only its trigger
changes. Uploading, failed in transit and done are states of each image row
([image-manager.md](image-manager.md)). There is no drag-over look (D-2).

## Markup

```html
<!-- rendered: default (gallery) -->
<st-file-upload class="upload-drop">
  <input class="file-input visually-hidden" id="gallery-upload" type="file"
         accept="image/jpeg,image/png,image/webp,image/avif" multiple aria-describedby="gallery-upload-hint">
  <label class="btn btn--sm" for="gallery-upload">Add gallery images</label>
  <span id="gallery-upload-hint">JPEG, PNG, WebP or AVIF, up to 20 MB each.</span>
</st-file-upload>
```

```html
<!-- rendered: with refusals -->
<st-file-upload class="upload-drop">
  <input class="file-input visually-hidden" id="gallery-upload" type="file" … aria-describedby="gallery-upload-hint">
  <label class="btn btn--sm" for="gallery-upload">Add gallery images</label>
  <span id="gallery-upload-hint">JPEG, PNG, WebP or AVIF, up to 20 MB each.</span>
  <div class="stack stack--sm" role="alert">
    <p class="field__error">studio-floorplan.svg isn't a supported image. Use JPEG, PNG, WebP or AVIF.</p>
    <p class="field__error">raw-export.tif is 25 MB. The limit is 20 MB.</p>
  </div>
</st-file-upload>
```

```html
<!-- rendered: disabled -->
<input class="file-input visually-hidden" id="test-upload" type="file" … disabled>
<label class="btn btn--sm" for="test-upload">Add test shots</label>
```

The input's ID is generated by the library's SSR-stable ID generator; only the
`for` and `aria-describedby` relationships are contract. The host element name
is not contract (ICD-DOM-3); page objects find the box by `.upload-drop` and
the input by its accessible name.

```html
<!-- consumer: the application's image set (gallery) -->
<st-file-upload
  i18n-buttonLabel buttonLabel="Add gallery images"
  i18n-hint hint="JPEG, PNG, WebP or AVIF, up to 20 MB each."
  accept="image/jpeg,image/png,image/webp,image/avif" multiple
  [errors]="refusals()"
  (filesSelected)="queue.add('gallery', $event)" />
```

## Design

- Box: `display: flex; flex-wrap: wrap; align-items: center`, gap `--space-3`,
  padding `--space-4`, `--border-width-thick` dashed `--color-border-strong`,
  `--radius-md`, `--text-body-sm`, `--color-fg-muted`. No fill: it shows the
  section's `--color-bg-surface`.
- Trigger: the secondary small button look (from [button.md](button.md)):
  `--btn-bg` `--color-bg-surface`, `--btn-fg` `--color-fg-default`,
  `--btn-border` `--color-border-strong`, `--radius-full`,
  `--border-width-hairline`, height `--control-height-sm` (from 48rem) or
  `--target-comfortable` (below), side padding `--space-3`, `--text-label` at
  `--font-size-sm`, `white-space: nowrap`.
- Focus ring on the trigger: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset`.
- Refusals: `flex-basis: 100%`, `.stack--sm` gap `--space-2`; each line
  `--text-body-sm` in `--color-danger-fg` with the shared warning glyph before
  it (`.field__error::before`), `overflow-wrap: anywhere`.
- Motion: only the trigger's colour change over `--duration-fast` with `--ease-standard`.

The component declares no tokens of its own; the trigger reads the button's
`--btn-*` tokens, so a re-skin of the secondary button changes the trigger too.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Box edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Box text (hint) | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Behind the box | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Trigger label | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Trigger hover fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Refusal text | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Accepted types on the editor surface |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Dashed box and trigger edge |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Refusal text |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Trigger label |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Trigger label, hover |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring |

Forced colours: the dashed edge and the trigger's border use `CanvasText`
through the system colours; the focus ring stays an outline, which forced
colours keep.

## Responsive behaviour

- The box is a wrapping row: when wide enough the trigger and hint share a
  line; on narrow phones the hint drops under the trigger.
- Refusal lines always take the full width and wrap; a long file name breaks
  anywhere ("raw-export-final-final-v3.tif").
- Below 48rem the trigger grows to `--target-comfortable` (44 px); from 48rem
  it is `--control-height-sm` (36 px), as every editor row action is.
- On a phone the native picker offers the camera roll and files; the component adds nothing.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom the trigger, hint and refusals stay visible.

## Accessibility

### Role and pattern

The native `<input type="file">` (with `multiple` when set), hidden with
`.visually-hidden` and labelled by the `<label for>`. The application's
`fieldset` and `legend` ("Standard test shots", "Gallery", "Sample shots")
give the context. Refusals are a `role="alert"` group.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Focuses the hidden input; the ring shows on its label. Skipped when disabled. |
| <kbd>Space</kbd>, <kbd>Enter</kbd> | Opens the system file picker. |
| <kbd>Esc</kbd> (in the picker) | Closes it without choosing; focus is back on the input; nothing is emitted. |

### Focus

Focus stays on the input after choosing files and when refusals appear. When
an upload finishes, the application moves focus to that image's alt-text
field (L2-057.1); the component never moves focus.

### Labelling

- Name: `buttonLabel` through the `<label for>` ("Add gallery images").
- Description: the hint through `aria-describedby`, so the 20 MB limit is heard
  before the picker opens (design-system drift fix: no mock tied it).
- Disabled: native `disabled`, announced as unavailable.

### Announcements

The refusal group is `role="alert"` and is rendered only when there are
refusals, so its insertion is announced. A new `errors` array re-creates the
group, so refusing the same file twice is announced twice (D-4).

### Motion

Only the trigger's colour transition over `--duration-fast`, which
`prefers-reduced-motion: reduce` sets to 0
([file-upload.html](../../design-system/components/file-upload.html), Accessibility › Motion).

## Content and internationalisation

- Trigger: "Add" plus what the group holds, plural: "Add test shots", "Add
  gallery images", "Add sample shots". Never "Upload", "Browse" or "Choose files".
- Hint, exactly: "JPEG, PNG, WebP or AVIF, up to 20 MB each."
- Refusals name the file and the rule, one line per file: "studio-floorplan.svg
  isn't a supported image. Use JPEG, PNG, WebP or AVIF.", "raw-export.tif is 25
  MB. The limit is 20 MB." (size rounded to whole megabytes by the application).
- Translatable inputs: `buttonLabel`, `hint`, `errors` (built by the
  application from `$localize` templates with the file name as data).
- Longer translations: the trigger never wraps or truncates; the hint and
  refusals wrap. A trigger label that cannot fit at 320 px is shortened in the catalogue.

## Performance

- Change detection: `OnPush`, signal inputs; the `describedBy` ID and the
  error-group key are `computed`.
- Listeners: `change` on the input; `dragover` and `drop` on the host. No
  document listeners; no `window` access during server rendering (ICD-SSR-1).
- Performance scenario: the `components-harness` route
  `file-upload/performance` renders the studio editor's two boxes ("Add test
  shots", "Add gallery images") and the spot editor's "Add sample shots", then
  sets the two Corktown Garage Studio refusals; setting the refusals must stay
  within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: refusals push content below the box down; that is the
  intended layout. Nothing above the box moves.
- Weight: `@angular/core` only.

## Acceptance criteria

### Rendering

- **AC-1** Given `buttonLabel` "Add gallery images", `hint` "JPEG, PNG, WebP or AVIF, up to 20 MB each.", `accept` "image/jpeg,image/png,image/webp,image/avif" and `multiple`, when it renders, then the host has the class `upload-drop` and holds, in order, an `input.file-input.visually-hidden[type=file]` with that `accept` and `multiple`, a `label.btn.btn--sm` whose `for` is the input's ID, and the hint `span`; the input's accessible name is "Add gallery images" and its description is the hint. (L2-069)
- **AC-2** Given the same box with `hint` `null`, when it renders, then there is no hint `span` and the input has no `aria-describedby`. (L2-069)
- **AC-3** Given the box in the studio editor, when its styles are inspected, then the input is not `display: none` or `visibility: hidden` and is in the tab order. (L2-067)

### Picking and dropping

- **AC-4** Given the gallery box with `multiple`, when the owner picks gallery-05.jpg and gallery-06.jpg in the system picker, then `filesSelected` emits once with both `File` objects in that order. (L2-057)
- **AC-5** Given gallery-05.jpg was just emitted, when the owner picks gallery-05.jpg again, then `filesSelected` emits again with that file. (L2-057)
- **AC-6** Given the picker is open, when the owner cancels it, then nothing is emitted and focus is on the input. (L2-067)
- **AC-7** Given the gallery box with `multiple`, when the owner drops gallery-05.jpg and gallery-06.jpg on the box, then `filesSelected` emits once with both files, and the browser does not open the files. (L2-057)
- **AC-8** Given a box without `multiple`, when the owner drops two files on it, then `filesSelected` emits once with only the first. (L2-057)

### States

- **AC-9** Given `disabled` true, when it renders and the owner tabs through the section and drops a file on the box, then the input has native `disabled`, is skipped by Tab and exposed as unavailable, the trigger is at 50 % opacity, and nothing is emitted. (L2-069)
- **AC-10** Given `errors` ["studio-floorplan.svg isn't a supported image. Use JPEG, PNG, WebP or AVIF.", "raw-export.tif is 25 MB. The limit is 20 MB."], when it renders, then a `div.stack.stack--sm[role=alert]` after the hint holds one `p.field__error` per message in that order, on its own full-width line, and the trigger and hint are unchanged. (L2-057)
- **AC-11** Given `errors` is empty, when it renders, then there is no `role="alert"` element in the box and no empty line under the trigger. (L2-057)
- **AC-12** Given the refusal "raw-export.tif is 25 MB. The limit is 20 MB." is shown, when the application sets a new array with the same message after the owner picks raw-export.tif again, then the alert group is re-created and the message is announced again. (L2-069)
- **AC-13** Given focus is on the input, when refusals appear, then focus stays on the input. (L2-067)

### Keyboard and focus

- **AC-14** Given the "Add test shots" box, when a keyboard user tabs to the input, then a `--focus-ring-width` (2 px) ring in `--color-focus-ring` is drawn `--focus-ring-offset` outside the label with at least 3:1 contrast against `--color-bg-surface`, and pressing Space opens the system picker. (L2-067)

### Screen readers

- **AC-15** Given the studio editor's `default`, `new` and `upload-failed` states, when axe-core scans the image section in light and dark, then it reports no violations. (L2-069)

### Theming

- **AC-16** Given the box with refusals in the light and the dark theme, when the contrast check runs, then the hint and the trigger label are at least 4.5:1 on `--color-bg-surface`, the refusal text is at least 4.5:1, and the dashed edge and focus ring are at least 3:1. (L2-068)

### Responsive

- **AC-17** Given the gallery box with both refusals at 320 px, when it renders, then the hint wraps under the trigger, the refusal lines wrap inside the box, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-18** Given the box at 360 px, when the trigger is measured, then it is at least 44 × 44 CSS px; and given 1280 px, then it is 36 px tall and at least 24 × 24 CSS px. (L2-065)
- **AC-19** Given the spot editor at 200 % zoom in a 1280 px viewport, when the owner reaches "Add sample shots", then the trigger, hint and refusals are fully visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the trigger's colour transition takes 0 ms
([file-upload.html](../../design-system/components/file-upload.html), Accessibility › Motion).

### Performance

- **AC-20** Given the `file-upload/performance` harness route with three boxes, when the two refusals are set on the gallery box, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/file-upload/`:
  `file-upload.component.ts` (`FileUploadComponent`, selector
  `st-file-upload`, host class `upload-drop`), `file-upload.component.html`,
  `file-upload.component.css`: port of `.upload-drop`,
  `.upload-drop > [role="alert"]`, `.file-input:focus-visible + .btn`,
  `.file-input:disabled + .btn`, and the subset of `.btn`, `.btn--sm` and
  `.field__error` the label and the refusal lines need (D-6).
- `.visually-hidden` and `.stack`/`.stack--sm` are global utilities (ICD-002 §11.1).
- `change` handler: copy `input.files` into an array, emit when non-empty,
  then set `input.value = ''`.
- `dragover`: `preventDefault()` and `dataTransfer.dropEffect = 'copy'` when
  not disabled. `drop`: `preventDefault()`; take `dataTransfer.files`, keep the
  first only when `multiple` is false; emit when non-empty.
- Refusal group: `@for (group of [errors()]; track group)` wrapping
  `@if (group.length)`, so each new array reference re-creates the
  `role="alert"` element (D-4).
- ICD change (ICD-002 1.1.0, additive): `FileUploadComponent` gains `errors`.
- Mocks drift the component corrects: no mock ties the hint to the input (the
  component adds the ID and `aria-describedby`); the upload-failed mock sets
  `flex-basis: 100%` inline on the refusal group (the ported rule does it).

## Decisions

- **D-1** *How do the refusal lines get into the box, when the design system draws them as `.field__error` inside `.upload-drop` and the application may not write library classes (ICD-DOM-4, ICD-DOM-5)?* A new optional input `errors: readonly string[]` (additive, ICD-002 1.1.0). The application decides the messages, as it does for every control's `error` (ICD-FORM-5); the component renders them. A slot would force the application to write `.field__error` markup.
- **D-2** *ICD-002 says `filesSelected` comes "from the picker or a drop"; the design system says the box "is not a drop target" and shows no drag state. Which?* The box accepts dropped files and emits them exactly as a pick, with no drag-over look and no change to the design. ICD-002 fixes the output's sources; the picker stays the documented, accessible way in, and a drop is an equivalent shortcut for pointer users that costs no new UI. Listed for the owner to confirm.
- **D-3** *What does a drop of several files do when `multiple` is false?* Emits the first file only, matching what the native picker allows in that mode.
- **D-4** *How is the same refusal announced twice?* A new `errors` array re-creates the `role="alert"` group. The application sets a new array for every pick, so a second identical refusal is not silent; an unchanged array reference changes nothing.
- **D-5** *Can the owner pick the same file twice (for example after removing a failed row)?* Yes: the component clears the input's value after each emission, so the browser fires `change` again.
- **D-6** *The label must look like a small secondary button, but the `.btn` rules live encapsulated in `ButtonComponent`.* The file upload's own CSS carries the subset of `.btn` and `.btn--sm` its label needs. A `<label>` cannot be a `button[st-button]` host, and the label is what makes the hidden input operable; the subset follows [button.md](button.md) and changes with it.
- **D-7** *Does the trigger's height follow L2-065.3's 44 px for submit buttons on phones?* Yes, below 48rem it is `--target-comfortable`, as every small button is; from 48rem it is 36 px with at least `--space-3` to the hint.
