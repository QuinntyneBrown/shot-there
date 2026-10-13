# Dialog

| Field | Value |
|---|---|
| Selector | `st-dialog` (`DialogComponent`), and the service `DialogService` (no selector) |
| Library path | `frontend/projects/components/src/lib/dialog/` |
| Status | planned |
| Traces to | L2-056, L2-058, L2-060, L2-061, L2-062, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`dialog.html`](../../design-system/components/dialog.html), [`dialogs-and-overlays.html`](../../design-system/patterns/dialogs-and-overlays.html) |
| Source mocks | [`dialogs/delete-content/default`](../../mocks/dialogs/delete-content/default.html), [`dialogs/delete-content/busy`](../../mocks/dialogs/delete-content/busy.html), [`dialogs/delete-content/failed`](../../mocks/dialogs/delete-content/failed.html), [`dialogs/unpublish/default`](../../mocks/dialogs/unpublish/default.html), [`dialogs/unpublish/busy`](../../mocks/dialogs/unpublish/busy.html), [`dialogs/unpublish/failed`](../../mocks/dialogs/unpublish/failed.html), [`dialogs/discard-changes/default`](../../mocks/dialogs/discard-changes/default.html), [`dialogs/missing-fields/default`](../../mocks/dialogs/missing-fields/default.html), [`dialogs/missing-fields/spot`](../../mocks/dialogs/missing-fields/spot.html), [`dialogs/remove-image/default`](../../mocks/dialogs/remove-image/default.html), [`dialogs/remove-image/refused`](../../mocks/dialogs/remove-image/refused.html), [`dialogs/guide-entry-picker/default`](../../mocks/dialogs/guide-entry-picker/default.html), [`dialogs/guide-entry-picker/results`](../../mocks/dialogs/guide-entry-picker/results.html), [`dialogs/guide-entry-picker/busy`](../../mocks/dialogs/guide-entry-picker/busy.html), [`dialogs/guide-entry-picker/invalid`](../../mocks/dialogs/guide-entry-picker/invalid.html), [`dialogs/guide-entry-picker/no-matches`](../../mocks/dialogs/guide-entry-picker/no-matches.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html) |
| Rendering | [`dialog.html`](dialog.html) |

## Purpose and scope

A dialog stops the owner for one decision: delete a draft, unpublish a
studio, discard edits, remove a test shot, acknowledge a refusal ("Can't
publish yet"), or pick one guide entry. Every ShotThere dialog belongs to the
administration area; the visitor side never interrupts. On phones the panel
docks to the bottom of the screen; from 36rem it is centred over a dimmed,
inert page.

This CRD specifies two library parts that only work together:

- `st-dialog` (`DialogComponent`), the panel an application dialog component
  uses as its template root: title, description, Close, body and footer.
- `DialogService`, the only way the application opens any overlay: dialogs,
  sheets ([`st-sheet`](sheet.md)) and the photo viewer
  ([`LightboxComponent`](lightbox.md)). Its rules (backdrop, inert page,
  scroll lock, focus trap, initial focus, Escape, focus return, no stacking)
  are specified once here and the sheet and lightbox CRDs refer to them.

Use [`st-sheet`](sheet.md) for the site menu and the studio and spot filters
(full-height, a side sheet from 48rem), the [lightbox](lightbox.md) to page
through photos, [`st-map-popup`](popover.md) for a marker's non-modal card,
and a toast (`ToastService`) when nothing needs deciding.

Out of scope:

- The dialog content components (`DeleteContentDialogComponent`,
  `UnpublishDialogComponent`, `DiscardChangesDialogComponent`,
  `MissingFieldsDialogComponent`, `RemoveImageDialogComponent`,
  `GuideEntryPickerDialogComponent`): application components in their
  feature folders. They supply the copy, the footer buttons, the busy status
  line, the failed alert and the result passed to `DialogRef.close`.
- Which button is safe and gets initial focus, the button order, the busy
  request, the failure message and what happens after close (navigate to the
  studio list, raise a toast, focus a field): application logic.
- The buttons, alerts, image row and search field inside a dialog: their own
  CRDs ([button](button.md), [alert](alert.md), [image manager](image-manager.md),
  [combobox](combobox.md)).
- Positioning the map popup: [`popover.md`](popover.md) (it is non-modal and
  not opened through `DialogService`).

## Usage

Every `.dialog` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks dialog "div"`: 16 screens in 6 dialogs), with the control that opens it.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/delete-content/*`, opened by the editors' ghost-danger "Delete studio" / "Delete spot" / "Delete guide" (`pages/studio-editor/default`, `spot-editor/default`, `guide-editor/default`) | `size="sm"`, title "Delete Corktown Garage Studio?", description "This deletes the draft and its 2 images. It can't be undone." | body: none, or a danger `st-alert` with `role="alert"` "We couldn't delete it. Try again." (failed); footer: secondary "Cancel" (`cdkFocusInitial`), danger "Delete studio"; busy status line "Deleting Corktown Garage Studio…" | default, busy, failed | raised panel over the inert editor |
| `dialogs/unpublish/*`, opened by "Unpublish" in the editors' status panel (`pages/studio-editor/published`) | `size="sm"`, title "Unpublish The Junction Loft?", description "It goes back to draft. Its page, its map marker and its place in lists, comparisons and guides disappear within a minute. You can publish it again any time." | footer: "Cancel" (`cdkFocusInitial`), primary "Unpublish"; failed alert "We couldn't unpublish it. Nothing changed. Try again."; status "Unpublishing The Junction Loft…" | default, busy, failed | raised panel |
| `dialogs/discard-changes/default`, opened by the editors' "Cancel" and any in-app link while there are unsaved changes | `size="sm"`, title "Discard changes?", description "You changed 3 fields in Corktown Garage Studio since the last save." | no body; footer: "Stay" (`cdkFocusInitial`), danger "Discard" | default | raised panel |
| `dialogs/missing-fields/default`, `spot`, opened by "Publish" on an incomplete draft (studio, spot, guide) | `size="sm"`, title "Can't publish yet", description "Add these and publish again:" | body: a list of links "Ceiling height", "At least one gallery image" / "Permit source link", "At least one best use"; footer: primary "Got it" (`cdkFocusInitial`) | default | raised panel |
| `dialogs/remove-image/default`, opened by "Remove test shot 2" / "Remove sample shot 1" / "Remove gallery image 4" in the editors' image rows | `size="sm"`, title "Remove test shot 2?", description "It's removed when you save the studio. Test shot 1 stays." | body: the image row (decorative thumbnail, "full-length.jpg · alt text", alt text); footer: "Cancel" (`cdkFocusInitial`), danger "Remove test shot" | default | raised panel |
| `dialogs/remove-image/refused` | `size="sm"`, title "Can't remove this test shot", `description` null, `describedBy` the warning alert | body: warning `st-alert` "A published studio needs at least one standard test shot. Add another before removing this one."; footer: primary "Got it" (`cdkFocusInitial`) | refused | raised panel |
| `dialogs/guide-entry-picker/*`, opened by "Add entry" (`aria-haspopup="dialog"`) in `pages/guide-editor/*` | `size="form"`, title "Add an entry", description "Search published studios and spots. The entry goes to the end of the list; move it after adding." | body: `st-search-field` "Studio or spot" (`cdkFocusInitial` on its host) with listbox, "Searching…" status, "No published studios or spots match “parkdale”", field error "This studio is already in the guide"; footer: "Cancel", primary "Add entry" (disabled until a valid pick) | default, results, busy (searching), no matches, invalid | raised panel, wider |
| No mock | `size="md"` (32rem) and `size="lg"` (48rem) | any | any | raised panel |
| No mock after D-11 | `fullScreenBelowSm` | any | any | full-screen raised panel below 36rem |

`DialogService` opens every overlay in the product: the dialogs above (`kind:
'dialog'`), the site menu and the studio and spot filters (`kind: 'sheet'`,
[sheet.md](sheet.md)) and the photo viewer from every shot grid (`kind:
'viewer'`, [lightbox.md](lightbox.md)).

Every row above is buildable with the API below: copy and size are inputs,
the body and footer are slots, the safe action takes initial focus through
`cdkFocusInitial`, the busy status line goes in the footer slot (D-4), and
the refusal's description comes from `describedBy` (D-2).

## Anatomy

1. **Backdrop** — `.backdrop`, created by the service behind the panel: fixed,
   full viewport, `--color-bg-backdrop` at `--z-overlay`. Clicking it does
   nothing (D-1).
2. **Positioner** — `.dialog`, the element with `role="dialog"`,
   `aria-modal="true"`, `aria-labelledby` and `aria-describedby`. Fixed, full
   viewport at `--z-modal`; docks the panel to the bottom below 36rem and
   centres it from 36rem. Rendered by the service (the CDK dialog container),
   not by `st-dialog` (D-3).
3. **Panel** — `.dialog__panel` with its size modifier: the `st-dialog` host.
   `--color-bg-surface-raised`, `--shadow-4`, `--radius-lg` (top corners
   `--radius-xl` and square bottom when docked), flex column, at most
   `100dvh` minus `--space-12` tall; beyond that it scrolls and the footer
   stays pinned.
4. **Header** — `.dialog__header`: `.dialog__heading` (title and description)
   and Close in one row, Close top-aligned.
5. **Title** — `h2.dialog__title`, `--text-h3`, the question naming the item.
   Always an `h2`: a modal dialog is a top-level region of its own.
6. **Description (optional)** — `p.dialog__desc`, muted, `--space-1` under the
   title. Rendered only when `description` is set.
7. **Close** — `button[st-button] variant="ghost" iconOnly` (`.btn.btn--ghost.btn--icon`)
   with an `st-icon name="close"` and `aria-label` from `closeLabel`. Same as
   the safe action; natively disabled while `busy`.
8. **Body** — `.dialog__body`, the default slot: a list, an alert, an image row
   or one field. It takes no space when nothing is projected (D-4).
9. **Footer** — `.dialog__footer`, the `footer` slot: right-aligned, wrapping,
   sticky to the panel bottom, safe action first and the consequence last.

Host: `st-dialog` is the panel itself (`<st-dialog class="dialog__panel dialog__panel--sm">`),
so it is a block box and adds no wrapper (ICD-DOM-1). The application dialog
component's own host, which sits between the positioner and `st-dialog`, is
given `display: contents` by the service, so the panel lays out as a direct
child of `.dialog` (D-3).

## API

### `st-dialog`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | Text of `h2.dialog__title`. Its generated ID becomes the positioner's `aria-labelledby`. Product copy, marked by the consumer (`i18n-title`). |
| `description` | `string \| null` | `null` | no | When a string, renders `p.dialog__desc` and its generated ID becomes `aria-describedby`. When `null`, no paragraph renders. |
| `describedBy` | `string \| null` | `null` | no | ICD change (D-2). The ID of an element inside the projected body that describes the dialog ("Can't remove this test shot": the warning alert). Used as `aria-describedby` only when `description` is `null`; ignored otherwise. |
| `size` | `DialogSize` (`'sm' \| 'md' \| 'form' \| 'lg'`) | `'md'` | no | `sm` → `.dialog__panel--sm` (24rem), `md` adds no modifier (`--layout-dialog-width`, 32rem), `form` → `.dialog__panel--form` (40rem), `lg` → `.dialog__panel--lg` (48rem) (D-5). |
| `fullScreenBelowSm` | `boolean` | `false` | no | Adds `.dialog__panel--fullscreen`: below 36rem the panel fills the whole viewport instead of docking (D-11). No effect from 36rem. |
| `busy` | `boolean` | `false` | no | Close gets native `disabled`; Escape does nothing. The backdrop does nothing in every state (D-1). The footer buttons are the consumer's to disable or mark busy. |
| `closeLabel` | `string` | §12 `st.dialog.close` ("Close") | no | `aria-label` of the Close button. |

Inputs are signal inputs; `fullScreenBelowSm` and `busy` use `booleanAttribute`.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Close and Escape call `DialogRef.close()` (result `undefined`) on the `DialogRef` the component injects. The consumer's own buttons call `inject(DialogRef).close(result)` (ICD-OVL-3), so the opener reads every outcome from `DialogRef.closed`. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Body content: a list of links, `st-alert`, an image row, one form field | Rendered in `.dialog__body`. Nothing projected: the body takes no space. Lists and their spacing are styled by the consumer (D-7). |
| `footer` | `button[st-button]` elements, safe first and consequence last; optionally one `<p class="visually-hidden" role="status">` busy line | Rendered in `.dialog__footer`. The status line is visually hidden and takes no space (D-4). |

### `DialogService`

`providedIn: 'root'`, wraps CDK `Dialog` (ICD §10.1).

```ts
open<R = unknown, D = unknown, C = unknown>(component: Type<C>, options?: DialogOptions<D>): DialogRef<R, C>;
```

| Option | Type | Default | Rule |
|---|---|---|---|
| `kind` | `DialogKind` (`'dialog' \| 'sheet' \| 'viewer'`) | `'dialog'` | Picks the positioner class: `dialog`, `sheet`, or `viewer lightbox`; and the backdrop (dialog and sheet only) (D-6). |
| `data` | `D` | `undefined` | Delivered to the content with `inject(DIALOG_DATA)`. The lightbox takes `LightboxData`. |
| `returnFocusTo` | `HTMLElement \| string` | the element focused when `open` was called | Where focus goes after close: an element, or a CSS selector resolved at close time. |

Guarantees for every kind:

| Rule | Behaviour |
|---|---|
| Role | The positioner has `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (the content's title) and `aria-describedby` (its description, when it has one). |
| Backdrop | `.backdrop` behind `dialog` and `sheet`; none behind `viewer`, which is opaque. Clicking it does nothing (D-1). |
| Inert page | While open, every other child of `body` gets `inert` and `aria-hidden="true"`; both are removed on close. |
| Scroll | Page scroll is blocked while open and the position is kept; only the overlay's own body scrolls. |
| Initial focus | The element marked `cdkFocusInitial` (or the first focusable element inside a marked non-focusable host, such as `st-search-field`); otherwise the first focusable element, which for `st-dialog` and `st-sheet` is Close. |
| Focus trap | Tab and Shift+Tab cycle inside the overlay and never reach the page. |
| Escape | Closes with result `undefined` (the lightbox closes with its current index), unless the content's `st-dialog` is `busy`. |
| Focus return | On close, focus goes to `returnFocusTo`, else to the element that had focus when `open` was called (L2-067.3). A consumer that moves focus elsewhere in its `closed` handler (the "Can't publish yet" links) wins, because `closed` emits after focus is restored. |
| No stacking | While an overlay opened by the service is open, a second `open` throws an `Error` and changes nothing (ICD-OVL-4, D-8). |
| Server | `open` called during server rendering throws nothing and opens nothing; it returns a `DialogRef` whose `closed` completes at once with `undefined`. |

The service opens content lazily: the application passes a component type it
loaded with dynamic `import()` when the dialog is not on the first view
(ICD-PERF-3).

## Variants and sizes

| Variant | What decides it | Use for |
|---|---|---|
| Destructive confirmation | Consumer footer: secondary safe action + `danger` confirm | Loss: "Delete Corktown Garage Studio?", "Discard changes?", "Remove test shot 2?" |
| Reversible confirmation | Secondary safe action + `primary` confirm | "Unpublish The Junction Loft?" |
| Acknowledgement | One `primary` "Got it" | "Can't publish yet", "Can't remove this test shot" |
| Form dialog | `size="form"`, one field in the body | "Add an entry" |

The panel itself has one look; the variants differ only in what the consumer
projects.

| Size | Modifier | Max width | Used for |
|---|---|---|---|
| `sm` | `.dialog__panel--sm` | 24rem | Every confirmation and acknowledgement |
| `md` (default) | none | `--layout-dialog-width` (32rem) | A confirmation with a longer body (no mock yet) |
| `form` | `.dialog__panel--form` | 40rem | The guide-entry picker |
| `lg` | `.dialog__panel--lg` | 48rem | A dialog with a wide body (no mock yet; D-5) |

Every size is 100 % of the viewport width below 36rem (docked) and at most its
max width from 36rem. Height follows the content up to `100dvh` minus
`--space-12`. Padding `--space-6` round the panel, `--space-4` between header,
body and footer.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Open (default) | `DialogService.open` | Backdrop fades in over `--duration-base`; panel slides up (docked) or scales in (centred) over `--duration-slow` | "Delete Corktown Garage Studio?, dialog", then the description; focus on the safe action |
| Busy | `busy` true | Close natively disabled at 50 % opacity; the consumer's confirm shows the button busy look and Cancel is disabled | The footer's hidden status line announces "Deleting Corktown Garage Studio…"; Escape does nothing |
| Failed | Consumer projects a danger `st-alert` with `role="alert"` in the body, `busy` back to false | Body appears with the alert above the footer; Close enabled again | The alert is announced at once; focus stays on the confirm, which retries |
| Refused | `description` null, `describedBy` on the warning alert | Title row has no description; warning alert in the body; one "Got it" | Described by the alert text |
| Invalid (form dialog) | The consumer's field shows its error | Field error and `aria-invalid`; "Add entry" disabled (consumer) | Error read with the field (field CRD) |
| Searching, results, no matches | The consumer's `st-search-field` | Spinner and "Searching", listbox, "No published studios or spots match “parkdale”" | Combobox CRD |
| Empty body | Nothing projected in the default slot | Body takes no space; footer follows header | — |
| Long content | Content taller than `100dvh` minus `--space-12` | Panel scrolls; footer stays pinned with the raised background | — |
| Full screen below 36rem | `fullScreenBelowSm` | Panel fills the viewport, square corners, top and bottom safe-area padding | — |
| Closed | `DialogRef.close`, Close, Escape | Removed at once (no exit animation) | Focus back on the opener |

The panel has no hover, focus or active state of its own; its buttons do
([button.md](button.md)).

## Markup

```html
<!-- rendered: delete, default (positioner and backdrop come from DialogService) -->
<div class="backdrop"></div>
<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="st-dialog-1-title" aria-describedby="st-dialog-1-desc">
  <app-delete-content-dialog style="display: contents">
    <st-dialog class="dialog__panel dialog__panel--sm">
      <div class="dialog__header">
        <div class="dialog__heading">
          <h2 class="dialog__title" id="st-dialog-1-title">Delete Corktown Garage Studio?</h2>
          <p class="dialog__desc" id="st-dialog-1-desc">This deletes the draft and its 2 images. It can't be undone.</p>
        </div>
        <button class="btn btn--ghost btn--icon" type="button" aria-label="Close"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>
      <div class="dialog__body"></div>
      <div class="dialog__footer">
        <button class="btn" type="button" cdkfocusinitial>Cancel</button>
        <button class="btn btn--danger" type="button">Delete studio</button>
      </div>
    </st-dialog>
  </app-delete-content-dialog>
</div>
```

```html
<!-- rendered: delete, busy -->
<button class="btn btn--ghost btn--icon" type="button" aria-label="Close" disabled>…</button>
…
<div class="dialog__footer">
  <p class="visually-hidden" role="status">Deleting Corktown Garage Studio…</p>
  <button class="btn" type="button" disabled>Cancel</button>
  <button class="btn btn--danger" type="button" aria-busy="true" aria-disabled="true">Delete studio</button>
</div>
```

```html
<!-- rendered: unpublish, failed -->
<div class="dialog__body">
  <div class="alert alert--danger" role="alert"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg><div class="alert__body">We couldn't unpublish it. Nothing changed. Try again.</div></div>
</div>
```

```html
<!-- rendered: remove image, refused (no description; described by the alert) -->
<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="st-dialog-4-title" aria-describedby="refused-rule">
  <st-dialog class="dialog__panel dialog__panel--sm">
    <div class="dialog__header"><div class="dialog__heading"><h2 class="dialog__title" id="st-dialog-4-title">Can't remove this test shot</h2></div><button class="btn btn--ghost btn--icon" type="button" aria-label="Close">…</button></div>
    <div class="dialog__body"><st-alert id="refused-rule" tone="warning">…A published studio needs at least one standard test shot. Add another before removing this one.…</st-alert></div>
    <div class="dialog__footer"><button class="btn btn--primary" type="button" cdkfocusinitial>Got it</button></div>
  </st-dialog>
</div>
```

```html
<!-- rendered: guide-entry picker, form size -->
<st-dialog class="dialog__panel dialog__panel--form">…<div class="dialog__body"><st-search-field cdkfocusinitial>…</st-search-field></div>…</st-dialog>
```

`md` adds no modifier; `lg` adds `.dialog__panel--lg`; `fullScreenBelowSm`
adds `.dialog__panel--fullscreen`. The `st-dialog-<n>-title` and `-desc` IDs
are generated and not part of the contract; the attributes that point at them
are. `app-*` host elements, `st-*` host names and the inline `display:
contents` are not part of the contract (ICD-DOM-3).

```html
<!-- consumer: DeleteContentDialogComponent template -->
<st-dialog size="sm" [title]="title()" [description]="consequence()" [busy]="deleting()">
  @if (failed()) {
    <st-alert tone="danger" role="alert" i18n>We couldn't delete it. Try again.</st-alert>
  }
  <ng-container slot="footer">
    <p class="visually-hidden" role="status">{{ deleting() ? deletingText() : '' }}</p>
    <button st-button type="button" cdkFocusInitial [disabled]="deleting()" (click)="ref.close()" i18n>Cancel</button>
    <button st-button variant="danger" type="button" [busy]="deleting()" (click)="confirm()">{{ confirmLabel() }}</button>
  </ng-container>
</st-dialog>
```

```ts
// consumer: the editor opens it and reads the outcome
const ref = this.dialog.open<'deleted', DeleteContentData>(DeleteContentDialogComponent, {
  data: { kind: 'studio', name: 'Corktown Garage Studio', imageCount: 2 },
});
ref.closed.subscribe((result) => { if (result === 'deleted') this.router.navigateByUrl(APP_PATHS.adminStudios); });
```

## Design

- Positioner `.dialog`: fixed, inset 0, `--z-modal`, grid; `place-items: end center` and no padding below 36rem; `place-items: center` and `--space-6` padding from 36rem.
- Backdrop `.backdrop`: fixed, inset 0, `--color-bg-backdrop`, `--z-overlay`.
- Panel: width 100 %, max width from the size, max height `100dvh` minus `--space-12`, `overflow: auto`, flex column, `--color-bg-surface-raised`, `--color-fg-default`, `--shadow-4`; radius `--radius-xl` top corners and square bottom below 36rem, `--radius-lg` from 36rem; bottom padding `env(safe-area-inset-bottom)`.
- Full screen below 36rem (`.dialog__panel--fullscreen`): height and max height `100dvh`, no max width, radius 0, top padding `env(safe-area-inset-top)` (D-11).
- Header: flex, `align-items: flex-start`, gap `--space-4`, padding `--space-6` `--space-6` 0. Heading block `flex: 1; min-width: 0`.
- Title `--text-h3`; description `--color-fg-muted`, `--space-1` above it.
- Body: padding `--space-4` `--space-6`, `flex: 1`; `display: none` when empty (D-4).
- Footer: flex, wrap, gap `--space-3`, `justify-content: flex-end`, padding `--space-4` `--space-6` `--space-6`, `position: sticky; bottom: 0`, `--color-bg-surface-raised` background; hidden when empty.
- Close: 44 × 44 px (`--control-height-md`) icon-only ghost button.
- Motion: backdrop `fade-in` over `--duration-base` with `--ease-enter`; panel `slide-up` below 36rem and `scale-in` from 36rem over `--duration-slow` with `--ease-enter`. No exit animation.
- Layers: `--z-overlay` (backdrop) under `--z-modal` (positioner). Toasts (`--z-toast`) sit above an open dialog.

The dialog declares no component tokens; surfaces re-skin it through the
semantic roles above.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Panel | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Title, body text, Close glyph | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Description | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Backdrop | `--color-bg-backdrop` | near-black at 50 % opacity | black at 66 % opacity |
| Link in the body ("Ceiling height") | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Title, body text, Close glyph |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Description |
| `--color-fg-link` | `--color-bg-surface-raised` | 4.5:1 | Missing-field links |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Field error in the picker |
| `--color-warning-fg` | `--color-bg-surface-raised` | 4.5:1 | Refusal text |
| `--color-action` | `--color-bg-surface-raised` | 3:1 | Primary button edge on the panel |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Secondary button and field edges |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring on the panel |

In dark the raised surface is lighter than the canvas and the backdrop darker,
so the panel reads as on top without the shadow. Forced colours: shadow and
backdrop vanish and the panel keeps a 1 px `CanvasText` outline.

## Responsive behaviour

| Width | Behaviour |
|---|---|
| XS (below 36rem) | Panel docked to the bottom edge at full width, `--radius-xl` top corners, square bottom, `env(safe-area-inset-bottom)` padding so the footer clears the home indicator; rises in. With `fullScreenBelowSm` it fills the viewport instead. |
| SM and up (36rem+) | Centred with `--space-6` around it, `--radius-lg` corners, scales in; width up to the size's maximum. |

- The footer wraps when its buttons do not fit and stays pinned while the body
  scrolls; buttons keep 44 px height on phones.
- Titles and descriptions wrap; nothing truncates. At 320 px the longest copy
  ("Unpublish The Junction Loft?" and its three-sentence description) wraps
  inside the panel with no horizontal scroll.
- At 200 % zoom the panel is capped at `100dvh` minus `--space-12`, so a long
  dialog scrolls inside the panel and the footer stays reachable.
- Close and the footer buttons are 44 × 44 CSS px at every width.

## Accessibility

### Role and pattern

[APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/):
the positioner has `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on
the title and `aria-describedby` on the description or, when refused, on the
alert. The page behind is `inert` and `aria-hidden="true"`. The control that
opens a dialog carries the consumer's `aria-haspopup="dialog"`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Cycles Close, the body's links or field, then the footer; never leaves the dialog. |
| <kbd>Esc</kbd> | Same as Cancel, Stay or Got it: closes with result `undefined`. Does nothing while `busy`. In the picker the search field's listbox takes the first Escape (combobox CRD) and stops it from reaching the dialog. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activate the focused button (native). |

### Focus

- On open, focus goes to the consumer's `cdkFocusInitial`: Cancel or Stay in
  confirmations, Got it in acknowledgements, the search field in the picker.
  Never to Delete studio, Discard or Remove test shot. Without a mark it goes
  to Close.
- On close, focus returns to the opener ("Delete studio", "Unpublish",
  "Remove test shot 2", "Add entry") or to `returnFocusTo`. A "Can't publish
  yet" link closes the dialog with the field's key and the consumer then
  focuses that field (L2-056.3). After a successful delete the editor is gone;
  the application's route change moves focus to the new page's `main`.
- The shared ring (`--focus-ring-width` in `--color-focus-ring`) is 3:1
  against the raised surface.

### Labelling

The title names the item, so the dialog is announced with what is at stake.
Close is named by `closeLabel` ("Close"). A busy dialog reports progress through
the footer's status line ("Deleting Corktown Garage Studio…"), never by
changing the confirm's label.

### Announcements

`st-dialog` has no live region of its own. Opening is announced by the dialog
role, name and description. Progress is the consumer's hidden `role="status"`
line in the footer; failure is the consumer's `role="alert"` alert.

### Motion

The design-system rule (no AC; L2 has no motion requirement): the backdrop
fades in over `--duration-base` and the panel slides up or scales in over
`--duration-slow`; under `prefers-reduced-motion: reduce` the tokens zero both
durations, so the dialog simply appears. The busy spinner in the confirm
button keeps turning ([dialog.html](../../design-system/components/dialog.html), Accessibility › Motion).

## Content and internationalisation

- Title: the question naming the item ("Delete Corktown Garage Studio?",
  "Unpublish The Junction Loft?", "Remove test shot 2?"); refusals state the
  fact ("Can't publish yet", "Can't remove this test shot").
- Description: what happens and whether it can be undone ("It can't be
  undone.", "You can publish it again any time.", "It's removed when you save
  the studio.").
- Buttons (consumer): the confirm repeats verb and object ("Delete studio",
  "Remove test shot", "Unpublish", "Add entry"); the safe action is "Cancel",
  or "Stay" when leaving is the question; an acknowledgement's only button is
  "Got it", never "OK" (the missing-fields mock's "OK" is drift).
- Failure copy says nothing changed and what to do: "We couldn't unpublish it.
  Nothing changed. Try again."
- Translatable: `title`, `description`, `closeLabel` and both slots, all marked
  by the consumer. Data inside copy: studio, spot, guide and file names, counts
  ("its 2 images", "3 fields") formatted by the application for `en-CA`.
- Library string: `st.dialog.close` "Close" (ICD §12), replaced through `closeLabel`.
- French runs about 30 % longer: titles and descriptions wrap, and footer
  buttons wrap onto a second row rather than shrink.

## Performance

- Change detection: `OnPush`, signal inputs; the panel classes come from one
  `computed` of `size` and `fullScreenBelowSm`.
- Weight: imports `@angular/cdk/dialog`, `@angular/cdk/overlay` and
  `@angular/cdk/a11y` only from the service and its container; `st-dialog`
  itself imports only `ButtonComponent` and `IconComponent`. Dialog content
  components are lazy-loaded by the application (ICD-PERF-3), so no dialog
  code is in a public page's first-load bundle.
- Performance scenario: the `components-harness` route `dialog/performance`
  renders the studio editor's ghost-danger "Delete studio" button and opens
  the delete dialog for Corktown Garage Studio through `DialogService`;
  opening it must stay within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles, the service or
  the container is measured on that route against the base branch before it
  is pushed.
- Layout stability: the dialog is an overlay above the page, so opening it
  shifts nothing; the busy status line is visually hidden and the busy
  confirm keeps its width ([button.md](button.md) AC-7).

## Acceptance criteria

### Rendering

- **AC-1** Given the studio editor for Corktown Garage Studio, when the owner activates "Delete studio" and the application opens `DeleteContentDialogComponent` with `<st-dialog size="sm" title="Delete Corktown Garage Studio?" description="This deletes the draft and its 2 images. It can't be undone.">`, then one element with `role="dialog"`, `aria-modal="true"` and the class `dialog` is shown, its accessible name is "Delete Corktown Garage Studio?" and its description "This deletes the draft and its 2 images. It can't be undone.", and it contains `.dialog__panel.dialog__panel--sm` with `h2.dialog__title`. (L2-061)
- **AC-2** Given dialogs with `size` `sm`, `md`, `form` and `lg` in a 1280 px viewport, when they render, then their panels carry `dialog__panel--sm`, no size modifier, `dialog__panel--form` and `dialog__panel--lg`, and are 24rem, 32rem, 40rem and 48rem wide at most. (L2-064)
- **AC-3** Given the "Discard changes?" dialog with nothing in the default slot, when it renders, then `.dialog__body` takes no space, the footer shows "Stay" then "Discard", and pressing Escape closes it with result `undefined` so the editor keeps its 3 changed fields. (L2-062)
- **AC-4** Given the refused remove-image dialog with `description` null and `describedBy="refused-rule"` on its warning alert, when it renders, then no `.dialog__desc` exists and the dialog's accessible description is "A published studio needs at least one standard test shot. Add another before removing this one.". (L2-058)
- **AC-5** Given the "Can't publish yet" dialog listing "Ceiling height" and "At least one gallery image", when the owner activates "Ceiling height" and the application closes the dialog with `'ceilingHeight'` and focuses that field in its `closed` handler, then the dialog is gone and focus is on the Ceiling height input, not on "Publish". (L2-056)

### States

- **AC-6** Given the delete dialog with `busy` true, when the owner presses Escape or clicks the backdrop, then the dialog stays open, its Close button has the `disabled` attribute, and the footer's status line reads "Deleting Corktown Garage Studio…". (L2-061)
- **AC-7** Given the delete dialog in any state, when the owner clicks the backdrop, then the dialog stays open, `DialogRef.closed` has not emitted and nothing is deleted. (L2-061)
- **AC-8** Given the unpublish dialog after a failed request (`busy` false, a danger alert projected), when it renders, then the body shows "We couldn't unpublish it. Nothing changed. Try again." above the footer, Close is enabled, and Escape closes the dialog with result `undefined`. (L2-056)
- **AC-9** Given the guide-entry picker opened with `size="form"` and `cdkFocusInitial` on its `st-search-field`, when it opens, then focus is in the "Studio or spot" input, so the owner can type "studio" and choose "Leslieville Daylight Studio" without a pointer. (L2-060)

### Keyboard and focus

- **AC-10** Given the delete dialog whose "Cancel" carries `cdkFocusInitial`, when it opens, then focus is on "Cancel" and not on "Delete studio". (L2-067)
- **AC-11** Given a dialog whose content marks nothing with `cdkFocusInitial`, when it opens, then focus is on its Close button. (L2-067)
- **AC-12** Given the "Can't publish yet" dialog is open over the studio editor, when the owner presses Tab and Shift+Tab repeatedly, then focus cycles through Close, "Ceiling height", "At least one gallery image" and "Got it" only, and every other child of `body` has `inert` and `aria-hidden="true"` until the dialog closes. (L2-067)
- **AC-13** Given the unpublish dialog opened from "Unpublish" in The Junction Loft's status panel, when the owner presses Escape, then the dialog closes and focus is on "Unpublish" again. (L2-067)
- **AC-14** Given a dialog opened with `returnFocusTo: '#publish'`, when it closes by Close, then focus is on the element `#publish` rather than the element focused when it opened. (L2-067)
- **AC-15** Given the discard-changes dialog is open, when the application calls `DialogService.open` again, then the call throws, no second `role="dialog"` element exists, and focus is where it was. (L2-067)

### Screen readers

- **AC-16** Given each dialog mock state (delete default, busy and failed; unpublish default, busy and failed; discard changes; missing fields; remove image default and refused; picker default, results, invalid and no matches) rendered by `st-dialog`, when axe-core scans it in the light and dark themes, then it reports no violations and the Close button's name is "Close". (L2-069)
- **AC-17** Given the delete dialog, when `busy` becomes true and the consumer writes "Deleting Corktown Garage Studio…" into the footer's `role="status"` line, then a screen reader announces it once and the confirm's accessible name stays "Delete studio". (L2-069)

### Theming

- **AC-18** Given the unpublish dialog in the light and the dark theme, when the contrast check runs, then the title is at least 4.5:1 and the description at least 4.5:1 against `--color-bg-surface-raised`, and the focus ring on Cancel is at least 3:1 against it. (L2-068)

### Responsive

- **AC-19** Given the delete dialog at 360 px wide on a device with a bottom safe-area inset, when it renders, then the panel spans the full width, sits on the bottom edge with `--radius-xl` top corners and square bottom corners, its bottom padding includes `env(safe-area-inset-bottom)`, and Close, "Cancel" and "Delete studio" are each at least 44 × 44 CSS px. (L2-065)
- **AC-20** Given the unpublish dialog at 320 px wide, when it renders, then the title and the three-sentence description wrap inside the panel, the footer buttons are fully visible, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-21** Given the delete dialog at 768 px wide, when it renders, then the panel is 24rem wide, centred horizontally and vertically, with `--radius-lg` corners on all four sides. (L2-064)
- **AC-22** Given the unpublish dialog in a 1280 px viewport at 200 % zoom with the failed alert shown, when the owner scrolls inside the panel, then the panel is no taller than the viewport minus `--space-12`, its content scrolls, and "Cancel" and "Unpublish" stay visible at the bottom. (L2-066)
- **AC-23** Given a dialog with `fullScreenBelowSm` at 360 px wide on a device with safe-area insets, when it renders, then the panel fills the viewport with square corners and its top and bottom padding include the top and bottom safe-area insets; at 768 px it is centred like any other dialog. (L2-065)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the backdrop fade and the panel's slide-up or
scale-in take 0 ms ([dialog.html](../../design-system/components/dialog.html), Accessibility › Motion).

### Performance

- **AC-24** Given the `dialog/performance` harness route, when "Delete studio" is activated and the delete dialog for Corktown Garage Studio opens, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/dialog/`:
  `dialog.component.ts` (`DialogComponent`, selector `st-dialog`,
  `dialog.component.html`, `dialog.component.css` with the `.dialog__*` rules
  written against `:host` and `:host(.dialog__panel--sm)` …),
  `dialog.service.ts` (`DialogService`), and the library-internal
  `overlay-container.component.ts` (`OverlayContainerComponent`, extends CDK
  `CdkDialogContainer`, not exported from `public-api.ts`) whose CSS holds
  the `.dialog`, `.sheet` and `.viewer` positioner rules. Types `DialogKind`,
  `DialogSize` and `DialogOptions` live in `src/lib/types/`.
- `DialogService.open` calls CDK `Dialog.open` with: `container:
  OverlayContainerComponent`; `role: 'dialog'`; `ariaModal: true`;
  `hasBackdrop: kind !== 'viewer'`; `backdropClass: 'backdrop'`;
  `disableClose: true` (the content roots handle Escape, the backdrop does
  nothing); `autoFocus: 'first-tabbable'` (which honours `cdkFocusInitial`);
  `restoreFocus: returnFocusTo ?? true`; `scrollStrategy: block()`; a global
  position strategy with the pane at 100 % width and height, so the DS
  positioner rules place the panel; `data`.
- The container gets its kind's classes (`dialog`, `sheet`, `viewer lightbox`)
  as host classes, sets `display: contents` on the attached content
  component's host, and exposes `setLabelledBy(id)` and `setDescribedBy(id)`,
  which `st-dialog`, `st-sheet` and `LightboxComponent` call through
  `inject(DialogRef).containerInstance`.
- Inert page: on the first open the service sets `inert` on every child of
  `document.body` except the CDK overlay container, and removes it on close.
  CDK's own `aria-hidden` handling stays on.
- No stacking: the service keeps the open `DialogRef`; `open` throws
  `Error('DialogService: an overlay is already open')` while it is set.
- Escape: `st-dialog` subscribes to `DialogRef.keydownEvents` and calls
  `close()` on Escape when not `busy` and the event was not already
  default-prevented (the search field's listbox prevents the Escape it uses).
- `st-dialog` template: `.dialog__header` (heading, description, Close as
  `<button st-button variant="ghost" iconOnly type="button" [attr.aria-label]="closeLabel()" [disabled]="busy()"><st-icon name="close" /></button>`),
  `<div class="dialog__body"><ng-content /></div>`,
  `<div class="dialog__footer"><ng-content select="[slot=footer]" /></div>`.
  Body and footer hide with `:empty` (D-4).
- IDs: a library counter (`st-dialog-<n>-title`, `-desc`). Overlays never
  render on the server, so the counter cannot cause a hydration mismatch.
- ICD change (ICD-002 1.1.0, additive): `DialogComponent` gains `describedBy`
  (input, `string | null`, default `null`): the ID of an element in the
  projected body that describes the dialog, used only when `description` is
  `null` (D-2).
- ICD change (ICD-002 1.1.0, additive): §11.1 *Foundations* gains the Angular
  CDK overlay structural rules (`.cdk-overlay-container` at `--z-overlay`,
  `.cdk-global-overlay-wrapper`, `.cdk-overlay-pane`, `.cdk-overlay-backdrop`,
  `.cdk-global-scrollblock`, as `@angular/cdk/overlay-prebuilt.css` defines
  them), and `.backdrop` moves from §11.2 *Library component CSS* to *Library
  global*, because CDK creates the backdrop, pane and scroll block outside
  every component's encapsulation (D-6).
- Design-system additions the component CSS carries: `.dialog__panel--lg`
  (D-5), `.dialog__panel--fullscreen` (D-11), and `:empty` in place of the
  `:has()` collapse rule on `.dialog__body` (D-4).
- Mocks drift the component corrects: Close, Cancel and the confirm drawn as
  `<a>` are `<button type="button">`; the busy confirm uses `aria-busy` with
  `aria-disabled`, not `disabled` ([button.md](button.md) D-1); the busy status
  line moves from the body to the footer (D-4); missing-fields' "OK" is "Got
  it" and its inline list style is the consumer's CSS (D-7);
  `data-dismiss-on-escape` is mock-only.

## Decisions

- **D-1** *ICD §10.1 says "Escape and the backdrop close it"; the dialog design-system page says clicking the backdrop does nothing.* The backdrop does nothing for every kind; Escape, Close and the safe action close. L2 is silent, and the design system's reason holds for the owner on a phone: a stray tap beside a docked panel must never cancel or confirm a deletion. Recorded as a conflict for the owner; ICD §10.1's wording needs the matching patch.
- **D-2** *The refused remove-image dialog is described by its warning alert, but `st-dialog` can only describe itself with `description`.* `st-dialog` (and `st-sheet`) gain `describedBy` (additive, ICD-002 1.1.0): the ID of an element in the projected content. The consumer puts the ID on the `st-alert` host. No existing input could carry an ID reference to projected content.
- **D-3** *The design system puts `role="dialog"` on the `.dialog` positioner, which CDK renders as its container, while `st-dialog` is the content.* The CDK container is the positioner and carries the role, `aria-modal`, the labels and the kind's class; `st-dialog`'s host is `.dialog__panel`. The application component's host in between gets `display: contents` from the container, so the DS grid places the panel. This keeps the DS DOM (role on `.dialog`, panel as its grid child) with CDK's focus trap.
- **D-4** *The DS collapses a body that holds only the hidden status line with `display: none`, which also hides the live region, so "Deleting Corktown Garage Studio…" would never be announced; and `:has()` cannot match projected content under emulated encapsulation.* The busy status line goes in the footer slot (visually hidden and absolutely positioned, so it takes no space), and `.dialog__body` and `.dialog__footer` hide only when `:empty`. The live region stays in the accessibility tree for the whole life of the dialog.
- **D-5** *`DialogSize` has `md` and `lg`, but the DS has CSS only for the default, `--sm` and `--form`.* `md` adds no modifier (the default `.dialog__panel`, `--layout-dialog-width`, 32rem), as the button's `md` adds none; `lg` adds `.dialog__panel--lg` at 48rem, the MD breakpoint, the next step after `form`. The DS page catches up at the next extraction.
- **D-6** *Where do the backdrop and the CDK structural styles live, when `.backdrop` is library component CSS but CDK creates it outside any component?* In the global stylesheet: the CDK overlay structural rules and `.backdrop` join §11.1 (additive ICD change). Kind `viewer` has no backdrop, because the viewer is opaque; kind `sheet` has one, so the page beside a 28rem side sheet looks as inert as it is (the sheet mocks omit it, recorded as drift on the sheet DS page).
- **D-7** *The DS styles a body list with `.dialog__body ul`, but `st-dialog`'s encapsulated CSS cannot reach a list the consumer projects.* The list belongs to the consumer: `MissingFieldsDialogComponent` gives its own `<ul>` `padding-left: var(--space-5)` and an 8 px (`--space-2`) grid gap in its own CSS, which ICD-DOM-5 allows because the list is application markup.
- **D-8** *What does `open` do while an overlay is already open?* It throws and changes nothing. ICD-OVL-4 forbids stacking; failing loudly makes a violation show in the first test that hits it, and no product flow needs to replace one overlay with another (a "Can't publish yet" link closes the dialog before the application acts).
- **D-9** *How does initial focus reach the safe action or the picker's input, which the service cannot know?* The consumer marks it with `cdkFocusInitial` (on the button, or on the `st-search-field` host, whose first focusable descendant then gets focus). Unmarked content falls back to Close, which is always safe. `cdkFocusInitial` is an attribute, so the application needs no CDK import.
- **D-10** *Does a closing dialog animate out?* No. The DS defines entrance motion only, and removing the panel at once returns focus to the opener without a frame in which the page is still inert.
- **D-11** *ICD §9.4 lists the studio and spot filters as `st-dialog` users with `fullScreenBelowSm`, but the DS and every filters mock render them as `.sheet`.* The filters use `st-sheet` ([sheet.md](sheet.md) D-1). `fullScreenBelowSm` stays, because removing it would be a breaking change: it adds `.dialog__panel--fullscreen`, which below 36rem fills the viewport (height `100dvh`, square corners, top and bottom safe-area padding) instead of docking. No mock uses it today; ICD §9.4's "Used by" line needs the matching patch.
