# Image manager

| Field | Value |
|---|---|
| Selector | `ol[st-image-list]`, `li[st-image-row]` |
| Library path | `frontend/projects/components/src/lib/image-list/` |
| Status | planned |
| Traces to | L2-057, L2-058, L2-060, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`image-manager.html`](../../design-system/components/image-manager.html) |
| Source mocks | [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/studio-editor/uploading`](../../mocks/pages/studio-editor/uploading.html), [`pages/studio-editor/upload-failed`](../../mocks/pages/studio-editor/upload-failed.html), [`pages/studio-editor/invalid`](../../mocks/pages/studio-editor/invalid.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/published`](../../mocks/pages/spot-editor/published.html), [`pages/spot-editor/invalid`](../../mocks/pages/spot-editor/invalid.html), [`dialogs/remove-image/default`](../../mocks/dialogs/remove-image/default.html), [`dialogs/remove-image/refused`](../../mocks/dialogs/remove-image/refused.html) |
| Rendering | [`image-manager.html`](image-manager.html) |

## Purpose and scope

The image manager is how the owner builds a location's standard test shots,
gallery and sample shots: an ordered list of rows, each with its thumbnail, its
file line, its alt text and buttons to move or remove it, followed by an upload
area. Order is changed with Move up and Move down, not by dragging, so it works
with a keyboard, a switch or one finger (WCAG 2.5.7, L2-058.3).

The library provides two parts. `ol[st-image-list]` is the ordered list.
`li[st-image-row]` is one row: thumbnail, file line, a body slot and an actions
slot, in the ready, uploading and failed states. The application composes them
into an **image set** with [`st-file-upload`](file-upload.md),
[`st-progress`](progress.md), the alt-text [`st-text-field`](text-field.md),
[`button[st-button]`](button.md) and [`st-alert`](alert.md); this CRD specifies
that composition too, so every editor state in the mocks is covered.

Use [`st-shot-grid`](shot-grid.md) and the lightbox to show photos to
visitors; the image manager is for the editors only.

Out of scope:

- Upload, progress tracking, Retry and Cancel: the application's
  `ImageUploadQueue` and `ImageService` (upload-and-arrange-images design).
- Type and size checks, the refusal messages and the "No gallery images yet"
  line: the application (refusals render through [`st-file-upload`](file-upload.md) `errors`).
- Reordering, staging removals, the published-studio rule (L2-058.4) and
  announcing the new position: the application (ICD-002 §9.5: "The application
  announces the new position").
- The remove-image dialog: the application's `RemoveImageDialogComponent` on
  [`st-dialog`](dialog.md).
- The guide editor's entries themselves (picker, duplicate refusal, order
  saved with the guide): the application's `GuideEditorPageComponent`
  (L2-060). This CRD specifies only the entry row it renders (D-9).

## Usage

Every `.image-list` and `.image-row` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks image-row "li|div"` and `… image-list "ol"`):
46 image rows on 11 studio and spot editor mocks, one preview row in a dialog.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Studio editor › Standard test shots (`default`, `published`, `uploading`, `upload-failed`, `invalid`, `submitting`, `success`, `price-changed`) | `meta` "1 of 3 · headshot.jpg · 4.2 MB", `thumbnailUrl` variant URL | default: alt-text `st-text-field` "Alt text"; actions: Move up / Move down (`softDisabled` at the ends), ghost Remove (`aria-haspopup="dialog"`) | ready; ends | editor section (`--color-bg-surface`) |
| Studio editor › Gallery (same mocks; eight rows on `published`) | `meta` "2 of 8 · gallery-02.jpg · 6.1 MB" | as above | ready; only image (both moves soft-disabled); invalid alt text "Describe this image" (`invalid`) | editor section |
| `studio-editor/uploading` gallery | `state="uploading"`, `statusText` "Uploading… 45%", object-URL thumbnail | default: `st-progress` "Uploading gallery-02.jpg" value 45; actions: ghost "Cancel upload gallery-02.jpg" | uploading; just-finished row with focused alt text and help | editor section |
| `studio-editor/upload-failed` gallery | `state="failed"`, `statusText` "gallery-04.jpg didn't upload. Check your connection." | default: empty; actions: secondary "Retry gallery-04.jpg", ghost "Remove gallery-04.jpg" | failed; plus refusals in the upload area | editor section |
| Spot editor › Sample shots (`default`, `published`, `invalid`, `submitting`, `success`) | `meta` "1 of 2 · sunrise-cliffs.jpg · 5.2 MB", landscape thumbnails | default: alt text plus a `.field-row` with "Focal length (mm)" (number) and "Angle note"; actions as above | ready; invalid alt text on "beach-low.jpg" | editor section |
| Studio and spot editors, empty set (`studio-editor/new`, `default` gallery; `spot-editor/new`) | no list | application's muted line and `st-file-upload` | empty | editor section |
| `dialogs/remove-image/default` | one-row list, `meta` "full-length.jpg · alt text" | default: the alt text as a paragraph; no actions | preview | dialog body |
| `dialogs/remove-image/refused` | no row; warning `st-alert` | — | refused | dialog body |
| `pages/guide-editor/*` entry rows | `rank` 1, 2…, no `thumbnailUrl`, `meta` "Studio · Leslieville" | default: `h3` "Leslieville Daylight Studio" with hidden "Entry 1: ", `st-textarea` "Editor's note" + hidden " for Leslieville Daylight Studio", rows 2; actions: Move up / Move down (`softDisabled` at the ends), ghost Remove + hidden name | ready; ends | editor section |

Every row above is buildable with the API below: the new `state` and
`statusText` inputs carry the uploading and failed looks (D-1, D-2), the new
`rank` input and the optional `thumbnailUrl` carry the guide editor's entry
rows (D-9), the body slot holds whatever heading, fields or progress the row
needs, and the actions slot holds the buttons.

## Anatomy

**List** (`ol[st-image-list]`):

1. **List** — the host `ol` with `.image-list` and `role="list"` (D-8):
   unstyled ordered column, `--space-3` between rows. Its items are
   `li[st-image-row]`.

**Row** (`li[st-image-row]`):

2. **Container** — the host `li` with `.image-row`: a grid of thumbnail and
   body (plus an actions column from 48rem), `--border-width-hairline`
   `--color-border-default`, `--radius-md`, padding `--space-3`.
   `.image-row--uploading` or `.image-row--failed` by state (D-1).
3. **Rank (entry rows)** — `span.guide-entry__rank` with `aria-hidden="true"`
   in place of the thumbnail when `rank` is set; the host adds
   `.image-row--entry` (two columns, three from 48rem). Styled exactly as the
   rank disc on a guide's card ([location-card.md](location-card.md) D-8).
3. **Thumbnail** — `div.image-row__thumb`: 4:5 cover crop, `--radius-sm`,
   `--color-bg-photo` behind. Holds `img[alt=""]` (decorative: the alt-text
   field beside it is the description); in the failed state a
   `div.media-fallback` with an image glyph instead.
4. **Body** — `div.image-row__body`: column, `--space-2` gaps, `min-width: 0`.
5. **File line** — `span.image-row__meta` from `meta`: position, file name and
   size, `--text-body-sm`, `--color-fg-muted`, wraps anywhere.
6. **Body slot** — default `ng-content`: the alt-text field (and sample-shot
   fields), or the progress bar while uploading.
7. **Status line** — from `statusText`, after the body slot: while uploading a
   second `span.image-row__meta` with `aria-hidden="true"` ("Uploading… 45%");
   when failed a `p.field__error` with `role="alert"`.
8. **Actions** — `div.image-row__actions` with the `actions` slot: a wrapping
   row across the bottom on phones, a stretched column from 48rem; dims
   `[aria-disabled="true"]` children. Hidden when nothing is projected (D-7).

**Image set** (the application's composition): a `fieldset.stack` whose
`legend` names the set ("Standard test shots", "Gallery", "Sample shots"),
optional help, the list (or, when empty, a `p.text-muted` line), then
`st-file-upload`.

## API

### `ol[st-image-list]`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| None | | | | Native attributes on the host are the consumer's (`aria-label`, `aria-labelledby`). |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | `li[st-image-row]` elements, in display order | Order is the consumer's `@for`; the list never sorts. |

### `li[st-image-row]`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `thumbnailUrl` | `string \| null` | `null` | no | **ICD change (additive: widened and made optional).** `src` of the decorative thumbnail: an object URL for a new file, the 480 px variant URL for a saved image. Ignored in the failed state and when `rank` is set. Every image row passes it; only entry rows leave it out (D-9). |
| `rank` | `number \| null` | `null` | no | **ICD change (additive).** When set, the row is a guide entry row: adds `.image-row--entry` and renders `span.guide-entry__rank[aria-hidden=true]` with the number instead of the thumbnail. The application passes the list position, so ranks never skip (D-9). |
| `meta` | `string` | — | yes | File line, formatted by the application: "1 of 3 · headshot.jpg · 4.2 MB" (position, file name, size in MB to one decimal). |
| `state` | `ImageRowState` (`'ready' \| 'uploading' \| 'failed'`) | `'ready'` | no | **ICD change (additive).** `uploading` adds `.image-row--uploading` (thumbnail at 50 %); `failed` adds `.image-row--failed` (danger edge) and swaps the thumbnail for the placeholder (D-1). |
| `statusText` | `string \| null` | `null` | no | **ICD change (additive).** Rendered only when `state` is not `ready`: uploading → `span.image-row__meta[aria-hidden=true]` ("Uploading… 45%"); failed → `p.field__error[role=alert]` ("gallery-04.jpg didn't upload. Check your connection.") (D-2). |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Every action is a projected `button[st-button]`; the consumer listens to its `click`. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Ready: alt-text `st-text-field`, plus a `div.field-row` of sample-shot fields; uploading: `st-progress`; failed: nothing; preview: a `p`; entry row: the entry's heading at the level the application chooses (`h3` under the section's `h2`) and the "Editor's note" `st-textarea` | Rendered in `.image-row__body` after the file line and before the status line. |
| `actions` | `button[st-button]` with `slot="actions"`: Move up, Move down, Remove; Cancel upload; Retry, Remove | Rendered in `.image-row__actions`. Repeated buttons carry their object in visually hidden text. |

Types: `ImageRowState` is a new shared type in
`frontend/projects/components/src/lib/types/image-row-state.ts` (ICD-002 §8,
additive). The parts have no library strings.

### The image set (application composition)

| Part | Configuration |
|---|---|
| Group | `fieldset.stack` + `legend` ("Standard test shots", "Gallery"; the spot editor's "Sample shots" legend is visually hidden because the section heading says it) |
| Help (sample shots) | "Each shot keeps its focal length and where you stood, so visitors can repeat it." as `p.text-muted` above the list (the mocks' `p.field__help` is a library class the application may not write) |
| Empty | `p.text-muted` "No gallery images yet. Publishing needs at least one." (also test shots, sample shots); no `ol` |
| Ready row | `[state]="'ready'"`; body: `st-text-field` label "Alt text", `inputId` "gallery-0-alt", `name` "gallery[0].alt", `error` "Describe this image" after a refused save, `help` "Describe what the photo shows for someone who can't see it." on a just-uploaded image; actions: `button[st-button] size="sm"` "Move up" + hidden ": gallery image 1" with `[softDisabled]="first"`, "Move down" with `[softDisabled]="last"`, ghost "Remove" + hidden " gallery image 1" with `aria-haspopup="dialog"` |
| Sample-shot row | as ready, plus `div.field-row` with `st-text-field type="number" inputmode="numeric" min="1" step="1"` "Focal length (mm)" and `st-text-field` "Angle note" |
| Uploading row | `[state]="'uploading'"`, `statusText` "Uploading… 45%"; body: `st-progress [value]="45" label="Uploading gallery-02.jpg"`; actions: ghost sm "Cancel upload" + hidden " gallery-02.jpg" |
| Failed row | `[state]="'failed'"`, `statusText` "gallery-04.jpg didn't upload. Check your connection."; actions: sm "Retry" + hidden " gallery-04.jpg", ghost sm "Remove" + hidden " gallery-04.jpg" (no dialog: nothing was saved) |
| Upload | `st-file-upload` "Add gallery images", hint "JPEG, PNG, WebP or AVIF, up to 20 MB each.", `accept`, `multiple`, `errors` |
| Save | the editor's "Save changes" natively `disabled` with `aria-describedby` "Wait for uploads to finish" while any row uploads (L2-057.6) |
| Moves | announced through `AnnouncerService`: "Test shot 3, now 2 of 3" |

## Variants and sizes

| Variant | Trigger | Use for |
|---|---|---|
| Image set, rows | the set has images | Standard test shots, gallery, sample shots. |
| Empty set | no images | No list; the muted line and the upload area. |
| Sample-shot row | body slot holds the extra `.field-row` | Outdoor spots: focal length and angle note under the alt text. Landscape files crop to the 4:5 thumbnail. |
| Preview row | one-row list, no actions | The remove-image dialog shows the image and its alt text (D-6). |
| Entry row | `rank` set, no thumbnail | The guide editor's ordered entries: rank disc, heading, kind and neighbourhood line, editor's note, Move up / Move down / Remove (D-9). |

| Size | Thumbnail column | Row padding | Buttons |
|---|---|---|---|
| One size | 5rem below 48rem, 6rem from 48rem; 4:5 | `--space-3`; column gap `--space-4` | always `size="sm"` (44 px below 48rem, 36 px from 48rem) |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Ready | `state` `ready` | Thumbnail, file line, alt text, three actions | List item "n of total" by the `ol`; buttons named with their object |
| At the ends | consumer `softDisabled` on Move up (first) and Move down (last) | Button at 50 % opacity (`.image-row__actions [aria-disabled="true"]`) | `aria-disabled="true"`; stays in the tab order and keeps focus after the last move |
| Only image | one row | Both moves soft-disabled | As above |
| Uploading | `state` `uploading` | `.image-row--uploading`: thumbnail at 50 %; progress bar; "Uploading… 45%"; only Cancel upload | Progress bar "Uploading gallery-02.jpg, 45%"; the value text is `aria-hidden` |
| Upload finished | application switches the row to `ready` | Alt text field with help appears | Focus moves to the alt text field (L2-057.1) |
| Failed | `state` `failed` | `.image-row--failed`: `--color-danger-border` edge; placeholder glyph on `--color-bg-photo`; error line; Retry and Remove | Error in `role="alert"`, announced when it appears |
| Invalid alt text | application sets the field's `error` after a refused save | Danger edge on the alt text; "Describe this image" | `aria-invalid="true"`, error in `aria-describedby`; the form summary links to the field's `inputId` |
| Refused files | `st-file-upload` `errors` | Lines in the upload area; no row created | `role="alert"` in the upload area |
| Empty | no images | No list; muted line; upload area | — |
| Control hover, focus, active, disabled | the composed parts | From [button.md](button.md), [text-field.md](text-field.md) and [file-upload.md](file-upload.md) | — |

Remove is never disabled; the dialog refuses instead (L2-058.4). No mock
disables the upload or the alt text.

## Markup

```html
<!-- rendered: guide editor entry row (first of two) -->
<ol class="image-list" role="list" aria-label="Entries in rank order">
  <li class="image-row image-row--entry">
    <span class="guide-entry__rank" aria-hidden="true">1</span>
    <div class="image-row__body">
      <span class="image-row__meta">Studio · Leslieville</span>
      <h3 class="…"><span class="visually-hidden">Entry 1: </span>Leslieville Daylight Studio</h3>
      <st-textarea …><div class="field"><label class="field__label" for="entries-0-note">Editor's note<span class="visually-hidden"> for Leslieville Daylight Studio</span></label><textarea class="textarea" id="entries-0-note" name="entries[0].note" rows="2">East windows give clean morning light for a whole headshot day.</textarea></div></st-textarea>
    </div>
    <div class="image-row__actions">
      <button class="btn btn--sm" type="button" aria-disabled="true">Move up<span class="visually-hidden">: Leslieville Daylight Studio</span></button>
      <button class="btn btn--sm" type="button">Move down<span class="visually-hidden">: Leslieville Daylight Studio</span></button>
      <button class="btn btn--ghost btn--sm" type="button">Remove<span class="visually-hidden"> Leslieville Daylight Studio</span></button>
    </div>
  </li>
</ol>
```

The file line renders before the projected body, so in an entry row the
"Studio · Leslieville" line sits above the heading; the mock puts it below.
The heading's look is the application's (`--text-h4`, set on its own class,
never inline).

```html
<!-- rendered: ready row (first of three) -->
<ol class="image-list" role="list">
  <li class="image-row">
    <div class="image-row__thumb"><img src="…/headshot-480.webp" alt="" width="800" height="1000" loading="lazy" decoding="async"></div>
    <div class="image-row__body">
      <span class="image-row__meta">1 of 3 · headshot.jpg · 4.2 MB</span>
      <st-text-field …><div class="field"><label class="field__label" for="testShots-0-alt">Alt text</label><input class="input" id="testShots-0-alt" name="testShots[0].alt" value="Test shot 1, headshot: soft octabox light from 45 degrees, gentle shadow side, true skin tones."></div></st-text-field>
    </div>
    <div class="image-row__actions">
      <button class="btn btn--sm" type="button" aria-disabled="true">Move up<span class="visually-hidden">: test shot 1</span></button>
      <button class="btn btn--sm" type="button">Move down<span class="visually-hidden">: test shot 1</span></button>
      <button class="btn btn--ghost btn--sm" type="button" aria-haspopup="dialog">Remove<span class="visually-hidden"> test shot 1</span></button>
    </div>
  </li>
</ol>
```

```html
<!-- rendered: uploading row -->
<li class="image-row image-row--uploading">
  <div class="image-row__thumb"><img src="blob:…" alt="" width="800" height="1000" loading="lazy" decoding="async"></div>
  <div class="image-row__body">
    <span class="image-row__meta">2 of 3 · gallery-02.jpg · 6.4 MB</span>
    <st-progress …><div class="progress" role="progressbar" aria-label="Uploading gallery-02.jpg" aria-valuemin="0" aria-valuemax="100" aria-valuenow="45"><div class="progress__bar" style="--value: 45%;"></div></div></st-progress>
    <span class="image-row__meta" aria-hidden="true">Uploading… 45%</span>
  </div>
  <div class="image-row__actions">
    <button class="btn btn--ghost btn--sm" type="button">Cancel upload<span class="visually-hidden"> gallery-02.jpg</span></button>
  </div>
</li>
```

```html
<!-- rendered: failed row -->
<li class="image-row image-row--failed">
  <div class="image-row__thumb"><div class="media-fallback"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/></svg></div></div>
  <div class="image-row__body">
    <span class="image-row__meta">4 of 4 · gallery-04.jpg · 7.1 MB</span>
    <p class="field__error" role="alert">gallery-04.jpg didn't upload. Check your connection.</p>
  </div>
  <div class="image-row__actions">
    <button class="btn btn--sm" type="button">Retry<span class="visually-hidden"> gallery-04.jpg</span></button>
    <button class="btn btn--ghost btn--sm" type="button">Remove<span class="visually-hidden"> gallery-04.jpg</span></button>
  </div>
</li>
```

```html
<!-- rendered: preview row in the remove-image dialog (no actions; the actions box is not shown) -->
<ol class="image-list" role="list">
  <li class="image-row">
    <div class="image-row__thumb"><img src="…/full-length-480.webp" alt="" width="800" height="1000" loading="lazy" decoding="async"></div>
    <div class="image-row__body"><span class="image-row__meta">full-length.jpg · alt text</span><p>Test shot 2, full length on the cyc with an even floor sweep.</p></div>
    <div class="image-row__actions"></div>
  </li>
</ol>
```

The inner markup of `st-text-field`, `st-progress` and `button[st-button]` is
theirs. The `width`/`height` attributes only state the 4:5 ratio; the box is
reserved by `aspect-ratio`. Page objects find rows by `.image-row` and the
state classes, never by host names (ICD-DOM-3).

```html
<!-- consumer: the application's image set (gallery), abridged -->
<fieldset class="stack">
  <legend i18n>Gallery</legend>
  @if (rows().length === 0) {
    <p class="text-muted" i18n>No gallery images yet. Publishing needs at least one.</p>
  } @else {
    <ol st-image-list>
      @for (row of rows(); track row.key; let i = $index, first = $first, last = $last) {
        <li st-image-row [thumbnailUrl]="row.thumbnailUrl" [meta]="row.meta" [state]="row.state" [statusText]="row.statusText">
          @switch (row.state) {
            @case ('ready') {
              <st-text-field [formControl]="row.alt" [inputId]="'gallery-' + i + '-alt'" [name]="'gallery[' + i + '].alt'"
                             i18n-label label="Alt text" [help]="row.altHelp" [error]="row.altError" />
              <button st-button size="sm" slot="actions" type="button" [softDisabled]="first" (click)="move(i, -1)">
                <ng-container i18n>Move up</ng-container><span class="visually-hidden">: {{ row.label }}</span></button>
              <button st-button size="sm" slot="actions" type="button" [softDisabled]="last" (click)="move(i, 1)">
                <ng-container i18n>Move down</ng-container><span class="visually-hidden">: {{ row.label }}</span></button>
              <button st-button variant="ghost" size="sm" slot="actions" type="button" aria-haspopup="dialog" (click)="confirmRemove(i, $event)">
                <ng-container i18n>Remove</ng-container><span class="visually-hidden"> {{ row.label }}</span></button>
            }
            @case ('uploading') {
              <st-progress [value]="row.progress" [label]="row.progressLabel" />
              <button st-button variant="ghost" size="sm" slot="actions" type="button" (click)="cancel(row)">
                <ng-container i18n>Cancel upload</ng-container><span class="visually-hidden"> {{ row.fileName }}</span></button>
            }
            @case ('failed') {
              <button st-button size="sm" slot="actions" type="button" (click)="retry(row)">
                <ng-container i18n>Retry</ng-container><span class="visually-hidden"> {{ row.fileName }}</span></button>
              <button st-button variant="ghost" size="sm" slot="actions" type="button" (click)="drop(row)">
                <ng-container i18n>Remove</ng-container><span class="visually-hidden"> {{ row.fileName }}</span></button>
            }
          }
        </li>
      }
    </ol>
  }
  <st-file-upload i18n-buttonLabel buttonLabel="Add gallery images" i18n-hint hint="JPEG, PNG, WebP or AVIF, up to 20 MB each."
                  accept="image/jpeg,image/png,image/webp,image/avif" multiple [errors]="refusals()" (filesSelected)="add($event)" />
</fieldset>
```

## Design

- List: `list-style: none`, no padding or margin, flex column, gap `--space-3`.
- Row: grid `5rem minmax(0, 1fr)` below 48rem and `6rem minmax(0, 1fr) auto`
  from 48rem; gap `--space-3` `--space-4`; `align-items: start`; padding
  `--space-3`; `--border-width-hairline` `--color-border-default`; `--radius-md`.
- Thumbnail: `aspect-ratio: 4 / 5`, `--radius-sm`, `overflow: hidden`,
  `--color-bg-photo`; `img` 100 % cover. Uploading: `img` at 50 % opacity.
  Failed: `.media-fallback` (global utility) with the glyph at `--icon-size-md`
  in `--color-fg-subtle`.
- Body: flex column, gap `--space-2`, `min-width: 0`.
- File line and uploading status: `--text-body-sm`, `--color-fg-muted`, `overflow-wrap: anywhere`.
- Failed status: `.field__error` (`--text-body-sm`, `--color-danger-fg`, warning glyph before).
- Failed edge: `--color-danger-border`.
- Actions: `grid-column: 1 / -1`, wrapping flex row, gap `--space-2` below
  48rem; from 48rem `grid-column: auto`, column, `align-items: stretch`.
  `[aria-disabled="true"]` children at 50 % opacity, `not-allowed`. Empty
  actions box: `display: none` (D-7).
- Progress (in the slot): `--space-2` high, `--radius-full`, fill `--color-action`
  on `--color-bg-subtle-hover`, width eases over `--duration-deliberate` with `--ease-standard`.
- Motion: none in the list or row; moves re-render without animation.

The parts declare no component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Row edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Failed row edge | `--color-danger-border` | `--palette-sorrel-300` | `--palette-sorrel-700` |
| Behind the rows | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Thumbnail well, placeholder | `--color-bg-photo` | `--palette-stone-100` | `--palette-stone-800` |
| Placeholder glyph | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| File line, uploading status | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Failed status, field error | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Progress fill / track | `--color-action` / `--color-bg-subtle-hover` | `--palette-stone-950` / `--palette-stone-200` | `--palette-stone-100` / `--palette-stone-700` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | File line and uploading status |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Failed status and "Describe this image" |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid alt-text edge |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Alt-text edge, button edges |
| `--color-action` | `--color-bg-subtle-hover` | 3:1 | Progress fill on its track |
| `--color-fg-subtle` | `--color-bg-photo` | 4.5:1 | Placeholder glyph on the failed thumbnail |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the editor surface |

Row edges are decorative; the failed edge (`--color-danger-border`, 1:1 in
contrast-pairs.json) only adds emphasis: the glyph, the error sentence and
Retry carry the state. Forced colours: the row edge becomes `CanvasText`; the
failed state is still told by its text.

## Responsive behaviour

- Below 48rem: two columns, a 5rem thumbnail and the body; the actions wrap in
  a row along the bottom across the full width; small buttons grow to 44 px
  with `--space-2` between them (L2-065).
- From 48rem: three columns, a 6rem thumbnail, the body, and the actions as a
  column of equal-width buttons on the right.
- The body never pushes the row wider than the screen: `min-width: 0` and the
  file line wraps anywhere ("raw-export-final-final-v3.jpg").
- The sample-shot `.field-row` is one column below 36rem and two from 36rem.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom every field and button stays reachable.

## Accessibility

### Role and pattern

Native elements, no ARIA widget: `fieldset` and `legend` name the set; an
ordered list (`ol` with `role="list"`) carries the order ("list, 3 items");
buttons move and remove; the upload is a real file input. Remove opens a
confirmation dialog (`aria-haspopup="dialog"`). Uploads use
`role="progressbar"`; a failed upload's error uses `role="alert"`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Through each row in order: alt text (and sample-shot fields), Move up, Move down, Remove; then the upload. Soft-disabled moves stay in the order. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Move up / Move down: moves the row one place; focus stays on the same button in its new position; the new position is announced. Remove: opens the dialog. Retry: re-sends that file. Cancel upload: removes the row. |
| <kbd>Esc</kbd> | In the remove dialog: closes it, like Cancel; focus returns to that row's Remove. |

### Focus

- After a move, the application keeps focus on the button that was pressed,
  now in the row's new place (re-focusing it after the DOM move). At an end
  that button becomes `aria-disabled` and keeps focus.
- When an upload finishes, focus moves to that image's alt-text field (L2-057.1).
- The remove dialog opens on Cancel (or "Got it" when refused); on close focus
  returns to Remove, or, when the row is gone, to the next row's Remove, the
  previous row's Remove, or the upload when it was the only row.
- A failed row's error does not move focus; it is announced.

### Labelling

- Repeated buttons carry their object: "Move up: test shot 1", "Remove gallery
  image 2", "Retry gallery-04.jpg", "Cancel upload gallery-02.jpg".
- The progress bar is named "Uploading gallery-02.jpg" and carries the value;
  "Uploading… 45%" is `aria-hidden`.
- Thumbnails are `alt=""`: the alt-text field is the description, and reading both would repeat it.

### Announcements

Moves are announced politely by the application's `AnnouncerService`: "Test
shot 3, now 2 of 3", "Gallery image 1, now 2 of 8" (L2-058.3). The row's failed
error is its own `role="alert"`. Progress is read from the progress bar on demand.

### Motion

The progress bar's width transition uses `--duration-deliberate`, which
`prefers-reduced-motion: reduce` sets to 0, so it jumps to each value. Moves
never animate ([image-manager.html](../../design-system/components/image-manager.html), Accessibility › Motion).

## Content and internationalisation

- Legends name the set: "Standard test shots", "Gallery", "Sample shots".
- File line: "{position} of {total} · {file name} · {size in MB, one decimal}",
  formatted by the application for `en-CA`; position is 1-based and updates after every move.
- Alt text says what the photo shows: "Test shot 1, headshot: soft octabox
  light from 45 degrees, gentle shadow side, true skin tones." Required message: "Describe this image".
- Uploading: "Uploading… 45%". Failed: "gallery-04.jpg didn't upload. Check your connection."
- Empty: "No gallery images yet. Publishing needs at least one." (also test shots, sample shots).
- Remove dialog: "Remove test shot 2?", "It's removed when you save the studio.
  Test shot 1 stays.", "Remove test shot"; refused: "Can't remove this test
  shot", "A published studio needs at least one standard test shot. Add another
  before removing this one.", "Got it".
- Translatable: every input and slot text above; data: file names, sizes, alt text.
- Long file names and translations wrap; nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs; the host class list and the
  status-line kind are `computed`.
- The consumer renders rows with `@for (row of rows(); track row.key)`, so a
  move re-orders DOM nodes instead of re-creating them.
- Thumbnails: `loading="lazy"`, `decoding="async"`; the 4:5 box is reserved by
  `aspect-ratio`, so nothing shifts when a thumbnail loads or fails.
- Performance scenario: the `components-harness` route
  `image-manager/performance` renders The Junction Loft's published editor
  sets: three standard test shots and eight gallery rows with alt text, one
  gallery row uploading at 45 %; pressing "Move up: gallery image 8" must stay
  within the L2-071 INP budget.
- Regression rule: a change to the templates, inputs, styles or change
  detection is measured on that route against the base branch before it is pushed.
- Weight: `@angular/core` only; the row composes nothing itself (the slots hold the other parts).

## Acceptance criteria

### Rendering

- **AC-1** Given The Junction Loft's three standard test shots, when the set renders, then it is an `ol.image-list[role=list]` with three `li.image-row`, each holding a thumbnail `img` with `alt=""`, a file line such as "1 of 3 · headshot.jpg · 4.2 MB", an "Alt text" field and an actions box, and a screen reader announces "list, 3 items". (L2-069)
- **AC-2** Given the same rows, when the accessibility tree is inspected, then no thumbnail is exposed, and each row's alt-text field is named "Alt text" and holds the description. (L2-068)
- **AC-3** Given the first test-shot row, when its actions render, then the buttons are named "Move up: test shot 1", "Move down: test shot 1" and "Remove test shot 1", and Remove has `aria-haspopup="dialog"`. (L2-069)

### Ordering

- **AC-4** Given the three test shots, when they render, then "Move up: test shot 1" and "Move down: test shot 3" have `aria-disabled="true"`, are focusable, and activating either changes nothing. (L2-058)
- **AC-5** Given a gallery with one image, when it renders, then both "Move up: gallery image 1" and "Move down: gallery image 1" have `aria-disabled="true"`. (L2-058)
- **AC-6** Given a gallery of three images, when a keyboard user activates "Move up: gallery image 3" twice, then the row shows "1 of 3 · gallery-03.jpg …" first, the other file lines read "2 of 3" and "3 of 3", focus is on that row's Move up after each move, and after the second move that button has `aria-disabled="true"` and still has focus. (L2-058)
- **AC-7** Given the same move, when the row reaches position 2, then "Gallery image 3, now 2 of 3" is announced once by a polite live region. (L2-058)
- **AC-8** Given the studio editor's image section, when a keyboard user tabs through a ready row, then focus visits the alt-text field, Move up, Move down and Remove in that order, then the next row, then "Add gallery images". (L2-067)
- **AC-28** Given the guide "Best natural light" in the guide editor with entries Leslieville Daylight Studio and Kensington Window Room, when the entry rows render with `rank` 1 and 2 and no `thumbnailUrl`, then each `li` has `image-row image-row--entry`, shows a `.guide-entry__rank` disc "1" or "2" with `aria-hidden="true"` and no thumbnail, and the first row's "Move up: Leslieville Daylight Studio" has `aria-disabled="true"`. (L2-060)

### Uploads

- **AC-9** Given gallery-02.jpg uploading at 45 %, when its row renders, then it has `.image-row--uploading`, its thumbnail is at 50 % opacity, its body holds a `role="progressbar"` named "Uploading gallery-02.jpg" with `aria-valuenow="45"` followed by "Uploading… 45%" with `aria-hidden="true"`, and its only action is "Cancel upload gallery-02.jpg". (L2-057)
- **AC-10** Given any row is uploading, when the editor renders, then "Save changes" is natively disabled and described by "Wait for uploads to finish". (L2-057)
- **AC-11** Given gallery-02.jpg finishes uploading, when the row switches to `ready`, then it shows the "Alt text" field with the help "Describe what the photo shows for someone who can't see it." and that field has focus. (L2-057)
- **AC-12** Given gallery-04.jpg failed in transit, when its row renders, then it has `.image-row--failed`, a `--color-danger-border` edge, a `.media-fallback` placeholder instead of the image, `p.field__error[role=alert]` "gallery-04.jpg didn't upload. Check your connection.", and the actions "Retry gallery-04.jpg" and "Remove gallery-04.jpg". (L2-057)
- **AC-13** Given gallery-04.jpg failed and gallery-02.jpg and gallery-03.jpg are uploading, when the owner activates "Retry gallery-04.jpg", then only gallery-04.jpg is sent again, its row turns `uploading`, and the other rows are unchanged. (L2-057)
- **AC-14** Given the failed gallery-04.jpg row, when the owner activates "Remove gallery-04.jpg", then the row is removed at once with no dialog and focus moves to the next control in the set. (L2-058)
- **AC-15** Given the owner picks studio-floorplan.svg, raw-export.tif and gallery-05.jpg for the gallery, when the selection is handled, then no row is created for the two refused files, the upload area shows their two refusal lines, and a row for gallery-05.jpg appears uploading. (L2-057)
- **AC-16** Given a new studio with no gallery images, when the Gallery set renders, then there is no `ol`, the line "No gallery images yet. Publishing needs at least one." is shown, and "Add gallery images" follows it. (L2-057)

### Invalid alt text

- **AC-17** Given Corktown Garage Studio's only gallery image has no alt text, when the save is refused, then its field `gallery-0-alt` has `aria-invalid="true"` and the error "Describe this image", and activating the form summary link "Gallery image 1 alt text: Describe this image" moves focus to it. (L2-057)

### Remove

- **AC-18** Given test shot 2's "Remove test shot 2", when the owner activates it, then the remove-image dialog "Remove test shot 2?" opens with focus on Cancel, shows a one-row list with the thumbnail and "Test shot 2, full length on the cyc with an even floor sweep.", and Escape closes it with focus back on "Remove test shot 2". (L2-067)
- **AC-19** Given that dialog, when the owner confirms "Remove test shot", then the row is gone from the set, the remaining file lines renumber ("1 of 2", "2 of 2"), and focus is on the next row's Remove. (L2-058)
- **AC-20** Given a published studio whose only remaining standard test shot is test shot 1, when the owner activates its Remove, then the dialog "Can't remove this test shot" opens with "Got it" and the row stays. (L2-058)

### Screen readers

- **AC-21** Given the studio editor's `published`, `uploading`, `upload-failed` and `invalid` states and the spot editor's `default`, when axe-core scans the image sections in light and dark, then it reports no violations. (L2-069)

### Theming

- **AC-22** Given ready, uploading and failed rows in the light and the dark theme, when the contrast check runs, then the file lines and the error text are at least 4.5:1 on `--color-bg-surface`, the progress fill is at least 3:1 on its track, the placeholder glyph is at least 4.5:1 on `--color-bg-photo`, and the focus ring is at least 3:1. (L2-068)

### Responsive

- **AC-23** Given a ready row at 360 px, when it renders and its buttons are measured, then the row has two columns, the actions wrap along the bottom across the full width, and each button is at least 44 × 44 CSS px. (L2-065)
- **AC-24** Given a row with the file line "1 of 1 · raw-export-final-final-v3.jpg · 18.4 MB" at 320 px, when it renders, then the file line wraps inside the body and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-25** Given a ready row at 768 px, when it renders, then the row has three columns, a 6rem thumbnail, and the actions form a column of equal-width buttons on the right. (L2-064)
- **AC-26** Given the spot editor's sample shots at 200 % zoom in a 1280 px viewport, when the owner tabs through "Alt text", "Focal length (mm)", "Angle note" and the actions, then every control is fully visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): moves never
animate, and under `prefers-reduced-motion: reduce` the progress bar jumps to
each value instead of easing
([image-manager.html](../../design-system/components/image-manager.html), Accessibility › Motion).

### Performance

- **AC-27** Given the `image-manager/performance` harness route with eleven ready rows and one uploading row, when "Move up: gallery image 8" is activated, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/image-list/`:
  `image-list.component.ts` (`ImageListComponent`, selector `ol[st-image-list]`,
  host class `image-list`, host `role="list"`, template `<ng-content />`),
  `image-list.component.css`; `image-row.component.ts` (`ImageRowComponent`,
  selector `li[st-image-row]`, host classes from a `computed`),
  `image-row.component.html`, `image-row.component.css` (port of `.image-row*`,
  the `data-state` rules rewritten as `:host(.image-row--uploading)` and
  `:host(.image-row--failed)`, `.image-row__actions:empty`, and the
  `.field__error` and `.icon` subset the status line and the placeholder glyph need).
  `ImageRowState` in `src/lib/types/image-row-state.ts`.
- The placeholder glyph is inline SVG in the row template (the image glyph is
  not an `IconName`); `.media-fallback` is a global utility (ICD-002 §11.1).
- ICD change (ICD-002 1.1.0, additive): `ImageRowComponent` gains `state`
  (`ImageRowState`, default `'ready'`) and `statusText` (`string | null`,
  default `null`); §8 gains `ImageRowState`; the rendered modifier classes
  `.image-row--uploading` and `.image-row--failed` join the DOM contract.
- Application: the detailed design's `ImageListComponent` in
  `features/admin/images/` is the image set; it is named `ImageSetComponent`
  (`features/admin/images/image-set/`) to avoid two `ImageListComponent`
  classes (D-5). It owns `ImageUploadQueue`, the refusal messages, the move
  announcements and the remove dialog.
- Mocks drift the composition corrects: Remove drawn as `<a href>` to the
  dialog's mock page becomes `button[st-button]` with `aria-haspopup="dialog"`;
  `data-state="uploading|failed"` becomes the modifier classes; the
  `flex-basis: 100%` inline style on refusals is in the file upload's CSS; the
  mocks announce no image moves, the product does (L2-058.3).

## Decisions

- **D-1** *The design system marks uploading and failed rows with `data-state`, which ICD-DOM-2 says the library never renders, and ICD-002 §9.5 gives the row no state input.* A new optional input `state: ImageRowState` (additive, ICD-002 1.1.0) renders the modifier classes `.image-row--uploading` and `.image-row--failed`, which carry the design system's two rules unchanged. The design-system page and the mocks catch up at the next extraction.
- **D-2** *The design system shows "Uploading… 45%" as a second `.image-row__meta` and the failure as `p.field__error[role=alert]` in the row body; the application may not write those library classes (ICD-DOM-4), and `st-alert` in the body slot (as ICD-002 §9.5 lists) would draw a boxed banner the design does not show.* A new optional input `statusText` (additive) renders the line in the form the state needs. The body slot still accepts any library part, but no image-set state puts `st-alert` in a row.
- **D-3** *Does the row ignore `thumbnailUrl` when failed?* Yes. A failed row shows the placeholder glyph whatever the URL, as the design system draws it; the object URL of a file that never uploaded is not evidence of anything the server holds.
- **D-4** *Who keeps focus on a moved button, given Angular moves the DOM node and browsers drop focus from moved nodes?* The application re-focuses the same button in its new position after render. The row and list hold no focus logic (ICD-002 §14: focus after page-level changes is the application's).
- **D-5** *The upload-and-arrange-images design names its application component `ImageListComponent`, the same as the library's list.* The application's component is `ImageSetComponent`; the design's name refers to it. Two classes with one name in one build invite the wrong import.
- **D-6** *The remove-image dialog draws a `div.image-row` preview, which `li[st-image-row]` cannot be.* The dialog renders a one-row `ol[st-image-list]`. Screen readers say "list, 1 item" once, which costs little and keeps the preview identical to the row in the editor without a new selector.
- **D-7** *A row with nothing in the `actions` slot (the dialog preview) would leave an empty grid row and gap below 48rem.* The actions box is `display: none` when empty (`.image-row__actions:empty`). The row does not query its projected content (ICD-API-9); CSS decides.
- **D-8** *Does an `ol` with `list-style: none` keep its list semantics?* The host adds `role="list"`, because WebKit with VoiceOver drops list semantics from unstyled lists, and the order is the point of this list (the guide-entry page makes the same call).
- **D-9** *The guide editor's entry rows reuse `.image-row` with `.image-row--entry`, a rank disc instead of a thumbnail, a heading and a note textarea. How does `li[st-image-row]` build them?* With two additive ICD changes (ICD-002 1.1.0): `thumbnailUrl` widens to `string | null` and becomes optional (relaxing an input is additive under ICD §15), and a new `rank` input renders the disc and `.image-row--entry`. The heading and the note go in the default slot, because the application owns headings and the note is an ordinary `st-textarea`. The rank disc is styled by the library as on the card (location-card D-8). Without this the guide editor would hand-write `.image-row` markup, which ICD-DOM-4 forbids.
- **D-10** *The upload-and-arrange-images design says removal "deletes at once after confirmation"; the design system and the remove-image mock say it is staged until Save ("It's removed when you save the studio.").* The rows follow the design system and the mock: confirming removes the row from the set; Save makes it permanent. This is the application's behaviour, not the row's, and it is listed for the owner to confirm.
