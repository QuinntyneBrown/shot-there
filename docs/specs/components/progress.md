# Progress

| Field | Value |
|---|---|
| Selector | `st-progress` |
| Library path | `frontend/projects/components/src/lib/progress/` |
| Status | planned |
| Traces to | L2-057, L2-064, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`progress.html`](../../design-system/components/progress.html), [`feedback-and-loading.html`](../../design-system/patterns/feedback-and-loading.html) |
| Source mocks | [`pages/studio-editor/uploading`](../../mocks/pages/studio-editor/uploading.html), [`pages/studio-editor/upload-failed`](../../mocks/pages/studio-editor/upload-failed.html), [`notifications/admin-toast/success`](../../mocks/notifications/admin-toast/success.html), [`notifications/public-toast/success`](../../mocks/notifications/public-toast/success.html) |
| Rendering | [`progress.html`](progress.html) |

## Purpose and scope

A progress bar shows how far a measurable wait has got. ShotThere has one:
the owner uploading test shots, gallery images and sample shots in the studio
and spot editors. Each file gets its own bar inside its image row, named after
the file ("Uploading gallery-02.jpg"), so the owner can see which file is slow
and cancel just that one (L2-057.6). The bar is ink (`--color-action`), never
the accent red, which on ShotThere marks selection.

Use the busy state of [`button[st-button]`](button.md) or a
[spinner](spinner.md) for a wait with no amount (signing in, deleting a draft,
searching the entry picker); a [skeleton](skeleton.md) while a known layout
loads; the review's [score components](score.md) for a rating that is not
progress. The 2 px timer line along the bottom of an auto-dismissing toast
(`.toast__progress`) is drawn by [`st-toast-region`](toast.md), not by this
component (D-1).

Out of scope:

- Measuring the upload and computing the percentage: the application's
  (`ImageUploadQueue` from `HttpEvent` progress, ICD-API-10).
- The file line ("2 of 3 · gallery-02.jpg · 6.4 MB") and the value text
  ("Uploading… 45%") around the bar: [`st-image-row`](image-manager.md)'s `meta`
  input and the application's caption.
- Cancel upload, Retry, the failed message and moving focus to the alt-text
  field when an upload finishes: the image row's and the application's.
- Disabling "Save changes" while uploads run: the application's, through the
  button.

## Usage

Every `.progress` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks progress "div"`), plus the states the upload flow passes through.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio-editor/uploading` gallery rows | determinate, neutral, in `st-image-row`'s default slot under the file line | `label` "Uploading gallery-02.jpg", `value` 45; "Uploading gallery-03.jpg", 80 | uploading, value changing | surface (editor section) |
| Every image row in the studio and spot editors (test shots, gallery, sample shots) at the start of an upload | determinate, neutral | `value` 0, `label` "Uploading headshot.jpg" | 0 % | surface |
| Same rows when every byte is sent and the server is inspecting the file and making variants | indeterminate (`value` null), neutral | same `label` | processing (D-3) | surface |
| Same rows at 100 % for the moment before the row swaps to its alt-text field | determinate, `value` 100 | same `label` | complete | surface |
| `pages/studio-editor/upload-failed` | no bar: the row shows `.field__error` "gallery-04.jpg didn't upload. Check your connection." and Retry | — | failed (bar removed) | surface |
| Not used by any screen today | `tone` success or danger | any | — (D-4) | surface |
| `notifications/admin-toast/success`, `public-toast/success` | the toast timer `.toast__progress` | — | counting down | inverse (toast) — owned by [toast.md](toast.md) (D-1) |

Every row that renders `st-progress` is buildable with `value`, `label` and
`tone`.

## Anatomy

1. **Track** — the host `st-progress`, carrying `.progress`,
   `role="progressbar"`, `aria-label`, `aria-valuemin="0"`,
   `aria-valuemax="100"` and, when determinate, `aria-valuenow`. Block, full
   width of its container, `--space-2` (8 px) high, `--radius-full`,
   `--color-bg-subtle-hover`, `overflow: hidden`.
2. **Fill** — `div.progress__bar`: height 100 %, width from the custom property
   `--value` (a percentage, default 0 %), ink `--color-action` (or the tone's
   solid colour), pill ends inherited from the track, width eased over
   `--duration-deliberate`. Indeterminate: a 40 % segment sliding across the
   track every `--duration-loop`.

Host: `st-progress` is the `.progress` box itself (ICD-DOM-1) with
`display: block`. The value text beside the bar is not part of the component.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `number \| null` | `null` | no | 0–100. A number renders `aria-valuenow` and sets `--value` on the fill; values below 0 or above 100 are clamped, and `aria-valuenow` is the clamped value rounded to a whole number (D-2). `null` is indeterminate: adds `.progress--indeterminate`, renders no `aria-valuenow`. |
| `label` | `string` | — | yes | `aria-label` on the host. Names the file: "Uploading gallery-02.jpg". Product copy. |
| `tone` | `'neutral' \| 'success' \| 'danger'` | `'neutral'` | no | `neutral` adds no class; `success` → `.progress--success`, `danger` → `.progress--danger` (D-4). |

Inputs are signal inputs; `value` uses `numberAttribute` only when bound to a
number; `null` stays `null`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The bar is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | No projection; the value text lives beside the component. |

The progress bar has no library strings (ICD §12).

## Variants and sizes

| Variant | Modifier / attribute | Use for |
|---|---|---|
| Determinate, neutral | `aria-valuenow` + `--value` | Every image upload: 0 % to 100 %. Ink fill. |
| Indeterminate | `.progress--indeterminate`, no `aria-valuenow` | All bytes sent and the server still working, or no first progress event yet (D-3). |
| Success tone | `.progress--success` | A finished operation shown in place; `--color-success-solid` fill. No screen today (D-4). |
| Danger tone | `.progress--danger` | A stopped operation shown in place; `--color-danger-solid` fill. No screen today; a failed upload replaces the bar instead (D-4). |

One size: `--space-2` (8 px) high. Width is 100 % of the container (the image
row's body column). The toast's timer line (2 px, `--border-width-thick`) is the
toast's (D-1).

## States

A progress bar is not interactive: hover, focus, active and disabled do not
apply. The states are values and outcomes, set with the real ARIA attributes.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| 0 % | `value` 0 | Track only | "Uploading headshot.jpg, progress bar, 0%" |
| Uploading | `value` 1–99 | Fill to that width; changes glide over `--duration-deliberate` | "Uploading gallery-02.jpg, progress bar, 45%" when reached; changes are not announced |
| Complete | `value` 100 | Full fill | "100%"; the application then removes the bar and moves focus to the alt-text field |
| Processing (indeterminate) | `value` null | 40 % segment sliding across, every `--duration-loop` | "Uploading gallery-02.jpg, progress bar" with no value (busy) |
| Success tone | `tone` success | `--color-success-solid` fill | Same as the value state; the tone is not announced, the text beside it says the outcome |
| Danger tone | `tone` danger | `--color-danger-solid` fill | Same; the outcome is in the row's text |
| Out of range | `value` < 0 or > 100 | Clamped to 0 or 100 | Clamped `aria-valuenow` |
| Failed (row) | the application removes the bar | — | The row's `role="alert"` error is read |

## Markup

```html
<!-- rendered: uploading at 45 % (studio editor) -->
<st-progress class="progress" role="progressbar" aria-label="Uploading gallery-02.jpg"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="45">
  <div class="progress__bar" style="--value: 45%;"></div>
</st-progress>
```

```html
<!-- rendered: processing (indeterminate) -->
<st-progress class="progress progress--indeterminate" role="progressbar" aria-label="Uploading gallery-02.jpg"
             aria-valuemin="0" aria-valuemax="100">
  <div class="progress__bar"></div>
</st-progress>
```

0 %, complete and the tones differ only in `aria-valuenow`, `--value` and the
`.progress--success` or `.progress--danger` modifier. The inline `style`
carrying `--value` is part of the contract (the DS reads it); Angular's
`_ngcontent-*` attributes are not (ICD-DOM-3).

```html
<!-- consumer: inside an uploading image row (studio editor) -->
<li st-image-row [thumbnailUrl]="item.previewUrl" [meta]="item.meta">
  <st-progress [value]="item.percent()" i18n-label label="Uploading {{ item.fileName }}" />
  <span class="image-row__meta" aria-hidden="true" i18n>Uploading… {{ item.percent() }}%</span>
  <button st-button size="sm" variant="ghost" type="button" slot="actions" (click)="cancel(item)">
    <ng-container i18n>Cancel upload</ng-container><span class="visually-hidden"> {{ item.fileName }}</span>
  </button>
</li>
```

## Design

- Track: `display: block`, `width: 100%`, height `--space-2`, `--radius-full`, `overflow: hidden`, fill `--color-bg-subtle-hover`.
- Fill: `height: 100%`, `width: var(--value, 0%)`, `border-radius: inherit`, `--color-action`; `transition: width` over `--duration-deliberate` with `--ease-standard`.
- Indeterminate fill: `width: 40%`, animated with `translate` from -100 % to 350 % over `--duration-loop` with `--ease-standard`, infinite (D-3).
- Tones: success fill `--color-success-solid`; danger fill `--color-danger-solid`.
- No elevation, no focus ring (not focusable), layer in flow.

There are no component tokens; `--value` is a per-instance custom property the
component sets on the fill, not a design token.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Track | `--color-bg-subtle-hover` | `--palette-stone-200` | `--palette-stone-700` |
| Fill (neutral) | `--color-action` | `--palette-stone-950` | `--palette-stone-100` |
| Fill (success) | `--color-success-solid` | `--palette-callaloo-700` | `--palette-callaloo-300` |
| Fill (danger) | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-action` | `--color-bg-subtle-hover` | 3:1 | Upload fill against its track |
| `--color-success-solid` | `--color-bg-subtle-hover` | 3:1 | Success fill against its track |
| `--color-danger-solid` | `--color-bg-subtle-hover` | 3:1 | Danger fill against its track |

The boundary between fill and track is the information, so the fill needs 3:1
against the track (WCAG 1.4.11); the track does not need 3:1 against the
section because the value is also in text. Forced colours: the track keeps a
1 px `CanvasText` border and the fill paints `Highlight`, so the amount stays
visible (D-5).

## Responsive behaviour

- The bar is always 100 % of its container; the image row decides the width.
  Below 48rem the row puts Cancel upload on its own line under the thumbnail and
  body, so the bar keeps the whole body column at 360 px; from 48rem Cancel
  upload moves to a third column and the bar does not grow past the body.
- The height never changes by breakpoint.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom the bar stays inside its row.
- Nothing to touch: the bar is not a target.

## Accessibility

### Role and pattern

`role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"` and
`aria-valuenow` (WAI-ARIA `progressbar`; the APG has no separate pattern, so
its range-property guidance applies). A plain percentage needs no
`aria-valuetext`. Indeterminate omits `aria-valuenow`, as ARIA specifies.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips the bar; it is not focusable. |
| Screen-reader browse keys | Read "Uploading gallery-02.jpg, progress bar, 45%" where the bar sits in the row. |

### Focus

The bar never takes focus. When an upload finishes the application removes the
bar and moves focus to that image's alt-text field (L2-057.1).

### Labelling

- Every bar is named after its file with `label` ("Uploading gallery-02.jpg"),
  so three bars in one list are three names, never "Upload progress" three
  times.
- The visible "Uploading… 45%" beside the bar is the consumer's and is
  `aria-hidden="true"`, so the value is not heard twice.

### Announcements

The component announces nothing and has no live region: value changes are not
announced (a percentage every few hundred milliseconds would drown the
editor). The failure is announced by the row's `role="alert"` error and the
finish by the focus move to the alt-text field.

### Motion

The design-system rule: width changes read `--duration-deliberate`, which
reduced motion sets to 0.01 ms, so the fill jumps to each new value. Under
`prefers-reduced-motion: reduce` the indeterminate segment stops sliding and
the fill shows full width at 60 % opacity (D-3).

## Content and internationalisation

- Name the file: "Uploading gallery-02.jpg" in `label`, never "Upload progress".
- The consumer's value text is "Uploading… 45%": present participle, the
  ellipsis character, numerals, no space before %.
- Outcome words are plain and live in the row: "gallery-04.jpg didn't upload.
  Check your connection." No "Oops" and no "Success!".
- Translatable: `label` (the application's `i18n-label`, with the file name as
  data). The percentage is a number the application formats for `en-CA`.
- Long file names do not affect the bar; the name only appears in the
  accessible name and the row's file line, which wraps.

## Performance

- Change detection: `OnPush`, signal inputs; the clamped value, the `--value`
  string and the host class list come from `computed`s. Value changes touch one
  style property and one attribute.
- The fill animates `width` inside a fixed-size track, so neighbours never
  move; indeterminate animates `translate` on the compositor.
- Performance scenario: the `components-harness` route `progress/performance`
  renders the studio editor's three gallery rows for Corktown Garage Studio
  ("gallery-01.jpg" to "gallery-03.jpg") with bars advancing every 100 ms from
  0 to 100; updating must add no layout shift and stay within the L2-071 INP
  budget for an interaction made meanwhile ("Cancel upload gallery-02.jpg").
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the track's height is fixed (`--space-2`) at every value and
  state.
- Weight: imports only `@angular/core`.

## Acceptance criteria

### Rendering

- **AC-1** Given an image row uploading gallery-02.jpg at 45 %, when `<st-progress [value]="45" label="Uploading gallery-02.jpg">` renders, then the host has the class `progress`, `role="progressbar"`, `aria-label="Uploading gallery-02.jpg"`, `aria-valuemin="0"`, `aria-valuemax="100"` and `aria-valuenow="45"`, and the fill's width is 45 % of the track. (L2-057)
- **AC-2** Given an upload that has just started, when `value` is 0, then `aria-valuenow="0"`, the fill has no width and the track is visible. (L2-057)
- **AC-3** Given gallery-03.jpg at 45 %, when `value` changes to 80, then `aria-valuenow` becomes "80" and the fill reaches 80 % after a transition of `--duration-deliberate`. (L2-057)
- **AC-4** Given an upload whose bytes are all sent, when `value` is 100, then `aria-valuenow="100"` and the fill spans the track. (L2-057)
- **AC-5** Given the server is still processing gallery-02.jpg, when `value` is `null`, then the host has `progress progress--indeterminate`, no `aria-valuenow`, and a 40 % segment moves across the track. (L2-057)
- **AC-6** Given `value` 120 and then -5, when each renders, then `aria-valuenow` is "100" and "0" and the fill is full and empty respectively. (L2-057)
- **AC-7** Given `tone="success"` and `tone="danger"`, when each renders at 100 %, then the host carries `.progress--success` or `.progress--danger` and the fill is `--color-success-solid` or `--color-danger-solid`; with no tone neither class is present. (L2-068)

### Keyboard and screen readers

- **AC-8** Given the studio editor with two uploading rows, when a keyboard user tabs through them, then focus moves from "Cancel upload gallery-02.jpg" to the next control without stopping on either bar. (L2-067)
- **AC-9** Given bars for gallery-02.jpg and gallery-03.jpg in one list, when a screen reader lists them, then their accessible names are "Uploading gallery-02.jpg" and "Uploading gallery-03.jpg". (L2-069)
- **AC-10** Given the `progress` harness routes in light and dark, when axe-core scans them, then no violations are reported and every progressbar has an accessible name. (L2-069)

### Theming

- **AC-11** Given the neutral, success and danger fills, when the contrast check runs in light and dark, then each fill is at least 3:1 against the `--color-bg-subtle-hover` track. (L2-068)

### Responsive

- **AC-12** Given the uploading studio editor at 360 px and at 320 px, when the rows render, then each bar spans its row's body column, nothing overflows the row, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the fill jumps to each new value and the
indeterminate segment stops, showing a still full-width fill at 60 % opacity
([progress.html](../../design-system/components/progress.html), Accessibility › Motion).

### Performance

- **AC-13** Given the `progress/performance` harness route with three bars advancing every 100 ms, when the owner activates "Cancel upload gallery-02.jpg" meanwhile, then the interaction-to-next-paint is at most 200 ms and the bars cause no layout shift. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/progress/`:
  `progress.component.ts` (`ProgressComponent`, selector `st-progress`),
  `progress.component.html` (`<div class="progress__bar" [style.--value]="width()"></div>`),
  `progress.component.css` (port of `.progress` and `.progress__bar` written
  against `:host`, plus the restored `.progress--indeterminate`,
  `.progress--success`, `.progress--danger` rules, the `indeterminate`
  keyframes, the reduced-motion rule and the forced-colours rule, D-5).
- Host bindings: `class` from a `computed` (`progress`, plus the tone and
  indeterminate modifiers), `role="progressbar"`, `[attr.aria-label]`,
  `aria-valuemin="0"`, `aria-valuemax="100"`, `[attr.aria-valuenow]`
  (`null` when indeterminate).
- Used by the application inside [`li[st-image-row]`](image-manager.md)'s
  default slot; composes nothing.
- The DS stylesheet today has only the neutral determinate bar; the other rules
  are restored from the design system's history (D-3, D-4).

## Decisions

- **D-1** *The DS progress page documents the toast's timer line as a second variant; is it `st-progress`?* No. `.toast__progress` belongs to the `.toast*` block that `st-toast-region` owns (ICD §11.2), is decorative and `aria-hidden`, and pauses with its toast; it is specified in [toast.md](toast.md). This component is only the named, determinate-or-indeterminate `progressbar`.
- **D-2** *What happens to values outside 0–100 or with decimals?* They are clamped to the range, and `aria-valuenow` is rounded to a whole number, so the bar can never overflow its track or report a value outside its own range. Clamping is rendering, not a business rule: the application still computes the percentage.
- **D-3** *ICD-002 makes `value: null` indeterminate, but the DS removed the indeterminate bar because no mock used it (DS README).* The indeterminate look is the pre-removal DS rule (git `ee40038^`): a 40 % segment sliding across every `--duration-loop`, which under reduced motion stops and shows a full fill at 60 % opacity. The application uses it while the server inspects an upload and makes its variants, after the last byte is sent, so the bar never sits at 100 % looking stuck. The rendering shows it as a specimen until the DS restores it.
- **D-4** *ICD-002 has `tone` success and danger; the DS removed them for lack of a screen and says a failed upload replaces its bar.* They keep the pre-removal DS fills (`--color-success-solid`, `--color-danger-solid`, both at least 3:1 on the track) so the input is buildable; no ShotThere screen uses them today, and a failed upload still replaces the bar with its error and Retry.
- **D-5** *The DS has no forced-colours rule for the bar, and in forced colours both the track and the fill backgrounds are replaced, so the amount disappears.* Under `forced-colors: active` the track gets a 1 px `CanvasText` border and the fill opts out of adjustment and paints `Highlight`. The amount is the information (WCAG 1.4.11), and this matches how the DS keeps other fills visible (the primary button and the selected suggestion paint `Highlight`).
