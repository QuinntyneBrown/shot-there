# Lightbox

| Field | Value |
|---|---|
| Selector | None — opened through `DialogService` with `kind: 'viewer'`; component class `LightboxComponent` |
| Library path | `frontend/projects/components/src/lib/lightbox/` |
| Status | planned |
| Traces to | L2-010, L2-016, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072, L2-086 |
| Design system | [`lightbox.html`](../../design-system/components/lightbox.html), [`dialogs-and-overlays.html`](../../design-system/patterns/dialogs-and-overlays.html) |
| Source mocks | [`dialogs/lightbox/default`](../../mocks/dialogs/lightbox/default.html), [`dialogs/lightbox/last`](../../mocks/dialogs/lightbox/last.html), [`dialogs/lightbox/image-failed`](../../mocks/dialogs/lightbox/image-failed.html), [`dialogs/lightbox/sample-shot`](../../mocks/dialogs/lightbox/sample-shot.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/spot/default`](../../mocks/pages/spot/default.html) |
| Rendering | [`lightbox.html`](lightbox.html) |

## Purpose and scope

The lightbox is the full-screen photo viewer that opens from any shot grid
thumbnail: a studio's standard test shots and its gallery "From a real shoot"
(L2-009, L2-010), and a spot's sample shots (L2-016). It shows one photo at
full size, uncropped, with its caption and "Photo 3 of 8"; Previous and Next
step through the set and wrap at either end; Close and Escape return to the
thumbnail that opened it. It is the only full-screen overlay on the public
site, and it is a modal dialog.

`LightboxComponent` is the library's own dialog content. The application opens
it with `dialog.open(LightboxComponent, { kind: 'viewer', data })` where `data`
is a `LightboxData`; it has no selector and is never placed in a template.
Use [`st-dialog`](dialog.md) for decisions, and the
[video poster](video-poster.md) for the episode, which plays in place.

Out of scope:

- The thumbnails and which index was activated: [`st-shot-grid`](shot-grid.md)
  (`shotActivated`).
- Opening the viewer, the focus trap, the inert page and returning focus to
  the thumbnail: [`DialogService`](dialog.md).
- The shot data, the alt text, the captions and the dialog's name ("Photo
  viewer: The Junction Loft"): the application maps its DTOs to
  `LightboxData`.
- Responsive image variants and the failed-image placeholder's markup:
  [`st-responsive-image`](responsive-image.md), which the frame renders.

## Usage

Every `.lightbox` in `docs/mocks/` (4 screens), with what opens it.

| Where | Configuration | Content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/lightbox/default`, opened by gallery thumbnail 3 on `pages/studio/default` (and `in-compare`, `stale`, `minimal`, `playing`, `media-failed`) | `title` "Photo viewer: The Junction Loft", 8 gallery shots, `startIndex` 2 | "Photo 3 of 8"; caption = alt text "Full-length fashion frame on the cyc, warm afternoon light from the left." | open, paging, first, middle | full-screen canvas |
| `dialogs/lightbox/last`, opened by gallery thumbnail 8 | as above, `startIndex` 7 | "Photo 8 of 8"; Next wraps to photo 1 | last | canvas |
| `dialogs/lightbox/image-failed` | as above, the full image returns 404 | Alt text in the frame's placeholder; controls keep working | image failed | canvas |
| `pages/studio/default` standard test shots | `title` "Photo viewer: The Junction Loft", 3 test shots | `title` "1 · Headshot", caption the alt text | open | canvas |
| `dialogs/lightbox/sample-shot`, opened by sample shot 1 on `pages/spot/default` (and `map-failed`, `no-rain-backup`, `no-video`, `stale-permit`) | `title` "Photo viewer: Evergreen Brick Works", 5 sample shots, `startIndex` 0 | "Photo 1 of 5"; caption **85 mm** · Shoot north from the lower steps | open | canvas |

Every row is buildable from `LightboxData` (`title`, `shots`, `startIndex`)
and `Shot` (`image`, `caption`, `title?`) as ICD §8 defines them. Two new
library strings are needed for the phone pager (D-3).

## Anatomy

1. **Viewer** — `.viewer.lightbox`, the element with `role="dialog"`,
   `aria-modal="true"`, `aria-labelledby` (the hidden heading) and
   `aria-describedby` (the caption). Fixed, full viewport, `--color-bg-canvas`,
   `--z-modal`, a column of bar, stage, caption and pager. Rendered by
   `DialogService` as the CDK container for `kind: 'viewer'` ([dialog.md](dialog.md) D-3); no backdrop.
2. **Heading** — `h2.visually-hidden`: `LightboxData.title`, "Photo viewer: The Junction Loft".
3. **Bar** — `.viewer__bar`: the count and Close; top padding plus
   `env(safe-area-inset-top)`.
4. **Count** — `p.viewer__count` with `aria-live="polite"`: "Photo 3 of 8"
   (§12 `st.lightbox.count`), `--text-label` at `--font-size-md`, muted.
5. **Close** — `button[st-icon-button] icon="close" outline`, 44 px, named
   "Close" (§12 `st.lightbox.close`).
6. **Stage** — `.viewer__stage`: Previous arrow, frame, Next arrow in a
   three-column grid; one column below 48rem with the arrows hidden.
7. **Previous / Next arrows** — `button[st-icon-button] outline` with
   `chevron-left` / `chevron-right`, named "Previous photo" / "Next photo"
   (§12). Never disabled.
8. **Frame** — `.lightbox__frame`: centres the photo at its own ratio, never
   cropped, `--radius-md` corners. Holds `st-responsive-image` (`sizes="100vw"`).
9. **Failed placeholder** — `.media-fallback` (rendered by
   `st-responsive-image`): the image-off icon and the alt text in the photo's
   own slot.
10. **Caption** — `.viewer__caption` (with an ID for `aria-describedby`): a
    `<p>` holding `Shot.caption` verbatim; when the shot has a `title` and
    `caption` begins with it, that lead is wrapped in `<strong>` (D-6).
11. **Pager (phones)** — `.lightbox__pager`: secondary `button[st-button]`
    "Previous" and "Next" with chevrons, below 48rem only; bottom padding plus
    `env(safe-area-inset-bottom)`.

Host: `LightboxComponent`'s host has `display: contents`, so its parts are the
flex children of the `.viewer` container.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| None | | | | The component takes no inputs; it reads `LightboxData` with `inject(DIALOG_DATA)`. |

`LightboxData` (ICD §8):

| Field | Type | Rule |
|---|---|---|
| `title` | `string` | The dialog's accessible name, complete: "Photo viewer: The Junction Loft". Marked for translation by the application (`$localize`), with the location name interpolated (D-4). |
| `shots` | `readonly Shot[]` | At least one. Shown in order. Each `Shot` has `image` (`ResponsiveImage`: alt, width, height, sources, fallback URL), `caption` (the full caption the lightbox shows: the alt text for gallery photos, "85 mm · Shoot north from the lower steps" for sample shots) and optional `title` (the thumbnail's bold lead, "85 mm" or "1 · Headshot") ([shot-grid.md](shot-grid.md) D-1). |
| `startIndex` | `number` | Index of the shot shown first, `0` to `shots.length − 1`; the `shotActivated` index from `st-shot-grid`. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `DialogRef.closed` | `number \| undefined` | The CDK dialog ref the application got from `open` emits the index shown last when Close or Escape closes the viewer (so a grid could scroll its thumbnail into view). It emits `undefined` only if the application closes the ref itself. |

The application types the call as `dialog.open<number, LightboxData>(LightboxComponent, …)`.

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Everything comes from `LightboxData` and the library strings. |

### Library strings

| ID | Default (en-CA) | Used for |
|---|---|---|
| `st.lightbox.close` | Close | Close's name |
| `st.lightbox.previous` | Previous photo | The arrow's name; the pager button's accessible name |
| `st.lightbox.next` | Next photo | The arrow's name; the pager button's accessible name |
| `st.lightbox.count` | Photo {$current} of {$total} | The live count |
| `st.lightbox.pagerPrevious` | Previous | ICD change (D-3): the pager button's visible text |
| `st.lightbox.pagerNext` | Next | ICD change (D-3): the pager button's visible text |

The lightbox has no override inputs for its strings (ICD §12: "—"); the
application translates them through the extracted IDs.

## Variants and sizes

| Variant | What decides it | Caption |
|---|---|---|
| Gallery photo | `Shot` without `title` | The alt text: "Full-length fashion frame on the cyc, warm afternoon light from the left." |
| Test shot | `title` "1 · Headshot", `caption` as the application writes it | `caption` verbatim; **1 · Headshot** in bold when `caption` begins with it |
| Sample shot | `title` "85 mm", `caption` "85 mm · Shoot north from the lower steps" | **85 mm** · Shoot north from the lower steps |
| Single photo | `shots.length` 1 | Arrows and pager are not rendered; "Photo 1 of 1" (D-2) |

One size: the viewer always covers the viewport. The photo scales to the stage
width and to at most `100dvh` minus 13rem tall, at its own ratio.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Open | `DialogService.open(LightboxComponent, { kind: 'viewer', data })` | Fades in over `--duration-base` | "Photo viewer: The Junction Loft, dialog", then the caption; focus on Close |
| First, middle, last | Index 0, between, `total − 1` | Count changes; arrows unchanged and never disabled | "Photo 1 of 8" … "Photo 8 of 8" |
| Paging | Next, Previous, ← or → | Photo, count and caption swap in place, no slide | Count announced politely; focus stays on the pressed control |
| Wrap | Next on the last, Previous on the first | Shows photo 1, or the last photo | "Photo 1 of 8" |
| Image loading | The full image is still downloading | The frame keeps the photo's box (`width` and `height` reserved) on the canvas | — |
| Image failed | The full image errors | `.media-fallback` with the image-off icon and the alt text in the photo's own box; count, caption and every control keep working | The alt text is visible text |
| Single photo | One shot | No arrows, no pager; arrow keys do nothing | "Photo 1 of 1" |
| Control hover, focus, active | On Close, arrows, pager | Icon buttons fill `--color-bg-subtle` / `--color-bg-subtle-hover`; focus ring | — |
| Closed | Close or Escape | Removed at once | Focus on the thumbnail that opened it |

No control is ever disabled: navigation wraps and Close always works.

## Markup

```html
<!-- rendered: The Junction Loft gallery, photo 3 of 8 (viewer element from DialogService) -->
<div class="viewer lightbox" role="dialog" aria-modal="true" aria-labelledby="st-lightbox-1-title" aria-describedby="st-lightbox-1-caption">
  <h2 class="visually-hidden" id="st-lightbox-1-title">Photo viewer: The Junction Loft</h2>
  <div class="viewer__bar">
    <p class="viewer__count" aria-live="polite">Photo 3 of 8</p>
    <button class="icon-btn icon-btn--outline" type="button" aria-label="Close"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  </div>
  <div class="viewer__stage">
    <button class="icon-btn icon-btn--outline" type="button" aria-label="Previous photo"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg></button>
    <div class="lightbox__frame">
      <st-responsive-image><picture>…<img src="…/gallery-3-1440.jpg" srcset="…" sizes="100vw" alt="Full-length fashion frame on the cyc, warm afternoon light from the left." width="800" height="1000" loading="eager" fetchpriority="high"></picture></st-responsive-image>
    </div>
    <button class="icon-btn icon-btn--outline" type="button" aria-label="Next photo"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>
  </div>
  <div class="viewer__caption" id="st-lightbox-1-caption"><p>Full-length fashion frame on the cyc, warm afternoon light from the left.</p></div>
  <div class="lightbox__pager">
    <button class="btn" type="button" aria-label="Previous photo"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>Previous</button>
    <button class="btn" type="button" aria-label="Next photo">Next<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>
  </div>
</div>
```

```html
<!-- rendered: sample shot caption -->
<div class="viewer__caption" id="st-lightbox-2-caption"><p><strong>85 mm</strong> · Shoot north from the lower steps</p></div>
```

```html
<!-- rendered: image failed (inside the frame, from st-responsive-image) -->
<div class="lightbox__frame">
  <st-responsive-image><div class="media-fallback"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg><span>Full-length fashion frame on the cyc, warm afternoon light from the left.</span></div></st-responsive-image>
</div>
```

With one shot the two arrows and `.lightbox__pager` are absent. The
`.icon-btn--outline` class comes from the icon button's `outline` input and
draws the hairline the DS writes as `.viewer .icon-btn` ([icon-button.md](icon-button.md)).
Generated IDs, the `LightboxComponent` host and `st-responsive-image` are not
part of the contract (ICD-DOM-3).

```ts
// consumer: the studio page opens it from the gallery grid
onShotActivated(index: number): void {
  const data: LightboxData = {
    title: $localize`Photo viewer: ${this.studio().name}`,
    shots: this.galleryShots(),   // Shot[] mapped from ImageDto: caption = alt
    startIndex: index,
  };
  this.dialog.open<number, LightboxData>(LightboxComponent, { kind: 'viewer', data });
}
```

## Design

- Viewer (`.viewer`): fixed, inset 0, `--z-modal`, flex column, `--color-bg-canvas`; animation `fade-in` over `--duration-base` with `--ease-enter`.
- Bar: flex, centred, gap `--space-4`, padding `--space-4` `--layout-margin`, top padding `--space-4` plus `env(safe-area-inset-top)`. Count `flex: 1`, `--text-label` at `--font-size-md`, `--color-fg-muted`.
- Stage: `flex: 1`, grid `auto minmax(0, 1fr) auto`, centred, gap `--space-2`, padding `--space-2`, `min-height: 0`; from 48rem gap `--space-8` and side padding `--layout-margin`.
- Frame: centred grid, width 100 %, at least 12rem tall. The photo is at most 100 % of the stage width and `100dvh` minus 13rem tall, `object-fit: contain`, `--radius-md` corners (D-5).
- Caption (`.lightbox .viewer__caption`): centred flex column, gap `--space-1`, `--text-body`, padding `--space-4` `--layout-margin` `--space-8` plus `env(safe-area-inset-bottom)`; below 48rem bottom padding `--space-4`.
- Pager: flex, centred, gap `--space-4`, side padding `--layout-margin`; below 48rem bottom padding `--space-8` plus `env(safe-area-inset-bottom)`; hidden from 48rem.
- Controls: icon buttons `--target-comfortable` square with a `--border-width-hairline` `--color-border-default` edge; pager buttons are md secondary buttons (44 px).
- Failed placeholder: `--color-bg-photo` ground, `--color-fg-muted` text, `--color-fg-subtle` icon, `--radius-md`.
- Layer `--z-modal`; no backdrop.

The viewer declares no component tokens; it re-themes through the semantic
roles.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Viewer background | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Caption, control glyphs | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Count | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Arrow and Close hairline | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Control hover fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Control pressed fill | `--color-bg-subtle-hover` | `--palette-stone-200` | `--palette-stone-700` |
| Pager button edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Failed slot | `--color-bg-photo` | `--palette-stone-100` | `--palette-stone-800` |
| Failed icon | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Caption and control glyphs |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Count |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Glyph on a hovered control |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | Glyph on a pressed control |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Pager button edge |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the viewer |
| `--color-fg-muted` | `--color-bg-photo` | 4.5:1 | Failed alt text |
| `--color-fg-subtle` | `--color-bg-photo` | 3:1 | Failed icon |

The arrows' hairline is decorative; the glyph identifies the control. The
viewer is the page canvas, not a dark scrim: white in light, near-black in dark,
so photos are judged on the same ground as the review page. Forced colours: the
canvas becomes `Canvas`, controls keep their glyphs and the system ring.

## Responsive behaviour

| Width | Behaviour |
|---|---|
| XS, SM (below 48rem) | Stage is one column; the side arrows are hidden and the photo gets the full width less 8 px. "Previous" and "Next" are 44 px pager buttons, 16 px apart, under the caption; the bottom safe-area inset moves from the caption to the pager. |
| MD and up (48rem+) | Arrows sit either side of the photo with 32 px gaps and the page margin; the pager is hidden. |

- The photo is never wider than the stage and never taller than `100dvh`
  minus 13rem, so the count, Close and caption stay on screen.
- Long captions wrap and stay centred; the viewer never scrolls sideways at
  320 px.
- At 200 % zoom the same limits hold: the photo shrinks, controls stay
  reachable.
- Pinch zoom on the photo is never blocked; nothing depends on a swipe.

## Accessibility

### Role and pattern

[APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/):
`role="dialog"`, `aria-modal="true"`, named by the visually hidden heading and
described by the caption. The page behind is `inert`. Close, the arrows and the
pager are native `<button>`s; the count is `<p aria-live="polite">`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves among Close, Previous and Next (the arrows from 48rem, the pager below) and wraps; focus never reaches the page. |
| <kbd>←</kbd> / <kbd>→</kbd> | Previous or next photo from anywhere in the viewer, wrapping at either end. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activate the focused control. |
| <kbd>Esc</kbd> | Closes the viewer; `DialogRef.closed` emits the current index. |

### Focus

Focus moves to Close when the viewer opens (`cdkFocusInitial`). When the
visitor pages, focus stays on the pressed arrow or pager button, so repeated
Next presses work. On close, by Close or Escape, the service returns focus to
the thumbnail that opened the viewer, even after paging. The shared ring shows
on `:focus-visible`.

### Labelling

- Dialog name: `LightboxData.title` ("Photo viewer: The Junction Loft");
  description: the caption.
- The photo's `alt` is the stored alt text.
- Arrows "Previous photo" and "Next photo"; pager buttons show "Previous" and
  "Next" and are named "Previous photo" and "Next photo" through `aria-label`,
  which starts with the visible word (WCAG 2.5.3) (D-3).
- Close is "Close".

### Announcements

The count is a polite live region and the lightbox's built-in announcer
(ICD-A11Y-4): each step announces "Photo 4 of 8" once. The application does not
also announce it.

### Motion

The design-system rule (no AC; L2 has no motion requirement): the viewer fades
in over `--duration-base`; photos swap without a slide or crossfade; under
`prefers-reduced-motion: reduce` the duration is zeroed and the viewer appears
at once; nothing auto-advances ([lightbox.html](../../design-system/components/lightbox.html), Accessibility › Motion).

## Content and internationalisation

- Count: "Photo 3 of 8" for galleries, test shots and sample shots alike,
  through `st.lightbox.count` with `$localize` placeholders, never
  concatenation (ICD-I18N-5). The numbers are plain integers; the library
  passes them as the placeholders' values.
- Dialog name: "Photo viewer: " plus the studio or spot name, written whole by
  the application.
- Gallery caption: the alt text, one sentence ending in a full stop. Sample
  shot: `caption` "85 mm · Shoot north from the lower steps" with `title` "85 mm", the
  same wording as the thumbnail caption (L2-016.2); focal lengths are formatted
  by the application.
- Control names: "Close", "Previous photo", "Next photo"; never "Back",
  "Forward" or "X". No download, share or zoom buttons.
- Translatable: everything in `LightboxData` (the application's) and the six
  library strings. The lightbox adds no text to the caption: " · " is part of
  `caption` (D-6).
- Long captions (French about 30 % longer) wrap under the photo.

## Performance

- Change detection: `OnPush`; the current index is a `signal`; the shown shot,
  the count text and the caption are `computed`s.
- Images: only the shown photo is rendered (one `st-responsive-image`), with
  `sizes="100vw"` and `priority` (eager, high fetch priority), because the
  visitor asked to see it now (D-5). Nothing preloads neighbours.
- Weight: imports `IconButtonComponent`, `ButtonComponent`, `IconComponent`
  and `ResponsiveImageComponent`. The application loads `LightboxComponent`
  with dynamic `import()` when a thumbnail is first activated (ICD-PERF-3), so
  it is not in a review page's first-load bundle.
- Performance scenario: the `components-harness` route `lightbox/performance`
  opens The Junction Loft's 8-photo gallery at photo 3 and presses Next; each
  step must stay within the L2-071 INP budget.
- Regression rule: a change to the template, styles, paging logic or image
  rendering is measured on that route against the base branch before it is
  pushed.
- Layout stability: the frame reserves the photo's box from `width` and
  `height`, so a loading or failed image shifts nothing; the count, caption
  and controls keep their places as the visitor pages.

## Acceptance criteria

### Rendering

- **AC-1** Given The Junction Loft's gallery of 8 photos, when the visitor activates thumbnail 3 and the application opens `LightboxComponent` with `kind: 'viewer'`, `title` "Photo viewer: The Junction Loft" and `startIndex` 2, then an element with `role="dialog"`, `aria-modal="true"` and the classes `viewer lightbox` is shown, named "Photo viewer: The Junction Loft", showing "Photo 3 of 8" and the full image with the alt "Full-length fashion frame on the cyc, warm afternoon light from the left.". (L2-010)
- **AC-2** Given the open viewer on a gallery photo without a `title`, when it renders, then `.viewer__caption` reads "Full-length fashion frame on the cyc, warm afternoon light from the left." and is the dialog's accessible description. (L2-010)
- **AC-3** Given Evergreen Brick Works' sample shot 1 with `caption` "85 mm · Shoot north from the lower steps" and `title` "85 mm", when the viewer opens on it, then the caption's text is exactly "85 mm · Shoot north from the lower steps" with "85 mm" in `<strong>`, and the count reads "Photo 1 of 5". (L2-016)
- **AC-4** Given the viewer at 360 px on photo 3, when the image element is inspected, then it has a `srcset`, `sizes="100vw"`, `width="800"`, `height="1000"`, `loading="eager"` and `fetchpriority="high"`. (L2-072)

### Paging

- **AC-5** Given the viewer on photo 3 of 8 with focus on Next, when the visitor activates Next, then the count reads "Photo 4 of 8", the photo and caption are those of gallery image 4 ("Low-key portrait with a black seamless and a single strobe."), and focus is still on Next. (L2-010)
- **AC-6** Given the viewer on photo 8 of 8, when the visitor activates Next, then photo 1 is shown and the count reads "Photo 1 of 8"; Next was never disabled. (L2-010)
- **AC-7** Given the viewer on photo 1 of 8, when the visitor activates Previous, then photo 8 is shown and the count reads "Photo 8 of 8". (L2-010)
- **AC-8** Given the viewer on photo 3 of 8 with focus on Close, when the visitor presses → and then ← twice, then the viewer shows photo 4, then 3, then 2, and focus stays on Close. (L2-067)
- **AC-9** Given a lightbox opened with a single shot, when it renders, then no Previous or Next control exists in the stage or the pager, the count reads "Photo 1 of 1", and ← and → change nothing. (L2-010)

### Keyboard and focus

- **AC-10** Given the studio page, when the visitor activates gallery thumbnail 3, then focus moves to the viewer's Close button. (L2-010)
- **AC-11** Given the open viewer at 1280 px, when a screen reader user presses Tab repeatedly, then focus moves among Close, Previous photo and Next photo only and never reaches the studio page behind. (L2-010)
- **AC-12** Given the viewer opened from thumbnail 3 and paged to photo 6, when the visitor presses Escape, then the viewer closes, `DialogRef.closed` emits 5, and focus is on thumbnail 3. (L2-010)
- **AC-13** Given the viewer opened from sample shot 2 on Evergreen Brick Works' page, when the visitor activates Close, then the viewer closes, `DialogRef.closed` emits 1, and focus is on sample shot 2. (L2-067)

### Screen readers

- **AC-14** Given the viewer on photo 3 of 8, when the visitor activates Next, then the polite live region announces "Photo 4 of 8" exactly once. (L2-069)
- **AC-15** Given the viewer at 360 px and at 1280 px, when axe-core scans it in the light and dark themes, then it reports no violations, Close is named "Close", the arrows "Previous photo" and "Next photo", and the pager buttons show "Previous" and "Next" and are named "Previous photo" and "Next photo". (L2-069)

### States

- **AC-16** Given gallery image 3 whose full-size URL returns HTTP 404, when the viewer shows it, then the frame shows the alt text "Full-length fashion frame on the cyc, warm afternoon light from the left." with the image-off icon in the photo's reserved box, nothing below the frame moves, and Next, Previous and Close still work. (L2-086)

### Theming

- **AC-17** Given the viewer in the light and dark themes, when the contrast check runs, then the caption is at least 4.5:1 and the count at least 4.5:1 against `--color-bg-canvas`, the pager button edge and the focus ring at least 3:1, and the failed alt text at least 4.5:1 against `--color-bg-photo`. (L2-068)

### Responsive

- **AC-18** Given the viewer at 360 px on a device with top and bottom safe-area insets, when it renders, then the side arrows are hidden, "Previous" and "Next" sit under the caption and are each at least 44 × 44 CSS px, `.viewer__bar`'s top padding includes the top inset and `.lightbox__pager`'s bottom padding includes the bottom inset. (L2-065)
- **AC-19** Given the viewer at 320 px on photo 8 with its long caption, when it renders, then the photo fills the stage width less 8 px, the caption wraps centred, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-20** Given the viewer at 768 px, when it renders, then Previous and Next arrows sit either side of the photo and `.lightbox__pager` is not displayed. (L2-064)
- **AC-21** Given the viewer in a 1280 px viewport at 200 % zoom, when it renders, then the count, Close, both arrows and the caption are all on screen and the photo is no taller than the viewport minus 13rem. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the fade-in takes 0 ms and photos never
animate between steps ([lightbox.html](../../design-system/components/lightbox.html), Accessibility › Motion).

### Performance

- **AC-22** Given the `lightbox/performance` harness route with The Junction Loft's 8 gallery photos open at photo 3, when Next is activated, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/lightbox/`:
  `lightbox.component.ts` (`LightboxComponent`, no selector used in
  templates; Angular requires one, so it is `st-lightbox`, which no template
  may use), `lightbox.component.html`, `lightbox.component.css` (`:host {
  display: contents }`, every `.viewer__*` and `.lightbox__*` rule, the
  `.lightbox .viewer__…` overrides written without the ancestor). The
  `.viewer` and `.viewer.lightbox` block rules live in the overlay
  container's CSS ([dialog.md](dialog.md) Implementation notes), which renders
  `.viewer lightbox` for `kind: 'viewer'`.
- Data: `inject(DIALOG_DATA) as LightboxData`; `index = signal(startIndex)`;
  `next()` sets `(i + 1) % n`, `previous()` sets `(i − 1 + n) % n`. This wrap
  rule is the library's (ICD §9.4), superseding `gallery-lightbox.view-model.ts`
  in the studio test-shots design.
- Close: `inject(DialogRef).close(index())` from Close and from Escape
  (`DialogRef.keydownEvents`); ← and → from the same stream call `previous()`
  and `next()` when `n > 1`.
- Registers its heading ID and caption ID with the container (`setLabelledBy`,
  `setDescribedBy`), like `st-dialog`. Close carries `cdkFocusInitial`.
- Strings: `$localize` with `@@st.lightbox.close`, `.previous`, `.next`,
  `.count` (`Photo ${current}:current: of ${total}:total:`), `.pagerPrevious`,
  `.pagerNext`.
- Caption: a `computed` splits `caption` into `lead` (the `title`, when
  `caption` starts with it) and `rest`; the template renders
  `@if (lead()) { <strong>{{ lead() }}</strong> }{{ rest() }}`, so the text is
  always `caption` exactly, as in [shot-grid.md](shot-grid.md).
- Frame: `<st-responsive-image [image]="shot().image" sizes="100vw" priority />`,
  keyed by index so a new image element replaces the old one on each step.
  The host is sized in the lightbox CSS (D-5).
- ICD change (ICD-002 1.1.0, additive): §12 gains `st.lightbox.pagerPrevious`
  ("Previous", override —) and `st.lightbox.pagerNext` ("Next", override —)
  (D-3).
- Mocks drift the component corrects: Close as `<a href>` is a button; the
  pager's hidden " photo" span becomes `aria-label` (D-3); the sample-shot
  mock's `width="800" height="1000"` on a landscape file is the file's true
  size.

## Decisions

- **D-1** *ICD §9.4 lists `.viewer` and `.lightbox` as the lightbox's blocks; which element carries them, given CDK renders the dialog container?* The container for `kind: 'viewer'` is `.viewer.lightbox` with the dialog role, exactly as the DS markup puts both classes on the dialog element; `LightboxComponent`'s host is `display: contents`. `kind: 'viewer'` exists only for the lightbox, so the service can name both classes.
- **D-2** *What do Previous and Next do with one photo?* They are not rendered, the count reads "Photo 1 of 1", and ← → do nothing. A studio needs only one gallery image to publish (L2-002), and a control that leaves the screen unchanged would read as broken; with two or more photos both controls are always present and never disabled (L2-010.3).
- **D-3** *The pager shows "Previous" with a hidden " photo", but §12 has only "Previous photo", and splitting a sentence into translatable fragments breaks in other languages.* The pager buttons render a new visible string ("Previous", "Next"; additive ICD change) and take the full `st.lightbox.previous` / `.next` as `aria-label`. The accessible name is unchanged and starts with the visible word, as WCAG 2.5.3 asks.
- **D-4** *Is `LightboxData.title` the location name or the full dialog name?* The full name ("Photo viewer: The Junction Loft"), written by the application with `$localize`, so no new library string or placeholder is needed and the ICD type stays as it is.
- **D-5** *The DS sizes the photo with `.lightbox__frame img`, but the image is inside `st-responsive-image`, whose internals the lightbox's encapsulated CSS cannot reach.* The lightbox sizes the `st-responsive-image` host instead: `width: min(100%, calc((100dvh - 13rem) * w / h))` from the shot's `width` and `height` (bound as a style), `--radius-md` with `overflow: hidden`. The photo then fits the same box the DS describes, and a failed image keeps that box, so the placeholder takes the photo's own size and ratio rather than switching to the DS's fixed 22rem 4:5 slot; nothing shifts (L2-086.1), and the lightbox needs no error event from `st-responsive-image`.
- **D-6** *Which `Shot` field is the lightbox caption, and how does the mocks' `<strong>85 mm</strong> · Shoot north from the lower steps` arise without library text (ICD-I18N-3)?* The lightbox shows `Shot.caption` unchanged, as [shot-grid.md](shot-grid.md) D-1 defines the fields: `caption` is the full caption ("85 mm · Shoot north from the lower steps"; the alt text for gallery photos), and `title` is only the thumbnail's bold lead. When `caption` begins with `title`, the lightbox wraps that lead in `<strong>`, exactly as the grid does, so both captions match word for word (L2-016.2) and the library renders no separator.
- **D-7** *Which index does `DialogRef.closed` emit when the application closes the ref itself?* Whatever the application passes; the lightbox only guarantees the current index for Close and Escape. Nothing in the product closes the viewer from outside.
