# Shot grid

| Field | Value |
|---|---|
| Selector | `st-shot-grid` |
| Library path | `frontend/projects/components/src/lib/shot-grid/` |
| Status | planned |
| Traces to | L2-009, L2-010, L2-016, L2-064, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072, L2-074, L2-086 |
| Design system | [`shot-grid.html`](../../design-system/components/shot-grid.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/studio/minimal`](../../mocks/pages/studio/minimal.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/studio/playing`](../../mocks/pages/studio/playing.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spot/no-rain-backup`](../../mocks/pages/spot/no-rain-backup.html), [`pages/spot/map-failed`](../../mocks/pages/spot/map-failed.html), [`dialogs/lightbox/default`](../../mocks/dialogs/lightbox/default.html), [`dialogs/lightbox/sample-shot`](../../mocks/dialogs/lightbox/sample-shot.html), [`dialogs/lightbox/image-failed`](../../mocks/dialogs/lightbox/image-failed.html) |
| Rendering | [`shot-grid.html`](shot-grid.html) |

## Purpose and scope

The shot grid is the photo evidence on every review: a studio's three standard
test shots under one setup line (L2-009), its gallery "From a real shoot"
(L2-010), and a spot's sample shots captioned with focal length and position
(L2-016). Every thumbnail is a button that opens the lightbox on that photo, so
a visitor can scan the set and then look closely.

Use [`st-responsive-image`](responsive-image.md) alone for a photo that does not
open (the review hero), [`st-location-card`](location-card.md) for card media,
and [`ol[st-image-list]`](image-manager.md) for the owner's image rows. Test
shots in the comparison table sit in table cells, not here.

Out of scope:

- Opening the viewer: the grid reports `shotActivated` with the index; the
  application opens [`LightboxComponent`](lightbox.md) through `DialogService`,
  which traps focus, closes on Escape and returns focus to the thumbnail
  (L2-010.2, L2-067.3).
- The section heading ("Standard test shots", "From a real shoot", "Sample
  shots"), the photo count ("8 photos") and the `.section-head` row: the application's.
- Choosing image variants and alt text: `srcset` comes from the API's variants
  and alt text from the stored data (L2-009.3); the grid passes both through.

## Usage

Every `.shot-grid` and `.shot` in `docs/mocks/` (`usage_inventory.py docs/mocks shot-grid "ul|p"`
and `shot "a|button"`): 21 grids, 83 thumbnails.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/default`, `minimal`, `stale`, `in-compare`, `playing`, `media-failed` "Standard test shots" | `setup` "Same setup in every studio: one Godox AD600 in a 120 cm octabox at 45°, 1.5 m from the subject · f/8 · 1/160 s · ISO 100 · 85 mm."; three shots with `title` "1 · Headshot", "2 · Full length", "3 · Product on table" | figure + caption in `<strong>` | default, hover, focus | canvas |
| `pages/studio/default` (and the same pages) "From a real shoot" | `setup` null; eight shots, no `title` | no caption | default, hover (photo 2), focus | canvas |
| `pages/studio/media-failed` gallery | same; photos 2 and 5 fail | `.media-fallback` with the alt text | failed | photo-grey slot |
| `pages/spot/default`, `no-video`, `stale-permit`, `no-rain-backup`, `map-failed` "Sample shots" | five shots with `title` "85 mm" … "135 mm" and `caption` "85 mm · Shoot north from the lower steps" … | figure + `<strong>` focal length + " · note" | default, hover, focus | canvas |
| `dialogs/lightbox/*` | the gallery grid behind the open viewer | — | inert behind the dialog | canvas |

Every row is buildable with the API below: shots, setup line and sizes are
inputs; the lightbox is opened by the application on `shotActivated`.

## Anatomy

1. **Wrapper** — the host `st-shot-grid` (`display: block`), holding the optional setup line and the list (D-5).
2. **Setup line (optional)** — `p.shot-grid__setup` when `setup` is not null: `--text-body-sm`, `--color-fg-muted`, `--space-4` above the grid.
3. **Grid** — `ul.shot-grid`: 2 / 3 / 4 equal columns at XS / MD / LG, `--space-4` gap, no bullets.
4. **Item** — `li`, one per shot, in input order.
5. **Figure (captioned shots)** — `figure` stacking shot and caption `--space-2` apart; only when the shot has a `title` (D-1).
6. **Shot** — `button.shot` `type="button"`: a 4:5 slot, `--radius-md`, overflow hidden, `--color-bg-photo` ground while loading, `cursor: zoom-in`. Its accessible name is the image's alt text.
7. **Image** — [`st-responsive-image`](responsive-image.md) inside the button: `<picture>` with AVIF, WebP and JPEG sources and an `<img>` with `srcset`, `sizes`, `width`, `height`, `loading="lazy"`, covering the slot.
8. **Failed fallback** — `.media-fallback` drawn by `st-responsive-image` in the same slot: image-failed glyph and the alt text on `--color-bg-photo`.
9. **Caption (captioned shots)** — `figcaption`: `--text-body-sm`, `--color-fg-muted`; `<strong>` holds the `title` in `--color-fg-default` and `--font-weight-semibold`.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `shots` | `readonly Shot[]` | — | yes | One `li` per shot, in order, tracked by index. `image` goes to `st-responsive-image` (not decorative: its alt names the button). `title` makes a captioned shot (D-1). `caption` is the lightbox caption; the thumbnail repeats the part after `title` when `caption` begins with `title`. |
| `setup` | `string \| null` | `null` | no | The standard setup line above the grid (`p.shot-grid__setup`). `null` renders nothing. Product copy from the application. |
| `sizes` | `string` | `'(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw'` | no | Passed to every thumbnail's `st-responsive-image`, so no XS thumbnail requests a variant wider than 960 px (L2-072.4). |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `shotActivated` | `number` | The visitor activates a thumbnail (click, <kbd>Enter</kbd> or <kbd>Space</kbd>): the shot's index in `shots`. Emitted once per activation, also for a failed image. The application opens `LightboxComponent` with `startIndex` = index; `DialogService` returns focus to this button on close. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Everything comes from `shots` and `setup`. |

`Shot` is ICD-002 §8's `{ image: ResponsiveImage; caption: string; title?: string }`.
The grid renders no text of its own (ICD-002 §12 has no shot-grid string).

## Variants and sizes

| Variant | Configuration | Caption |
|---|---|---|
| Standard test shots | `setup` set; three shots with `title` "1 · Headshot", "2 · Full length", "3 · Product on table" | Whole caption in `<strong>`. Always three, in this order, under the setup line. |
| Gallery | `setup` null; about eight shots with no `title` | None: no `figure`, the alt text describes each photo. |
| Sample shots (spots) | `setup` null; `title` "85 mm", `caption` "85 mm · Shoot north from the lower steps" | `<strong>85 mm</strong> · Shoot north from the lower steps`. |

One size. The column count sets each shot's width and the slot is always 4:5, so
a slow or failed image never changes the layout.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Photo covers the 4:5 slot | Button named by the alt text |
| Hover | `:hover` | Photo scales to 1.04 inside the clipped slot over `--duration-slow`, `--ease-standard`; the slot does not move | — |
| Focus | `:focus-visible` | `--focus-ring-width` ring in `--color-focus-ring` at `--focus-ring-offset`, following `--radius-md` | Focus on the button |
| Active | `:active` | As hover; the lightbox opens on release | — |
| Disabled | never | — | — |
| Loading | image not yet loaded | Empty slot in `--color-bg-photo` at its final size; `loading="lazy"` | Name already present (alt) |
| Failed | image `error` (HTTP 404, network) | Slot kept; `.media-fallback` with glyph and alt text on `--color-bg-photo`, the text in `--text-caption` and clamped with an ellipsis to the lines the slot holds (D-7); no layout shift | Name unchanged (the fallback prints the alt); still opens the lightbox |
| Behind the lightbox | dialog open | Unchanged, inert | Hidden from AT by the dialog |
| Reduced motion | `prefers-reduced-motion: reduce` | No hover zoom (`scale: none`) | — |

## Markup

```html
<!-- rendered: standard test shots (The Junction Loft) -->
<st-shot-grid>
  <p class="shot-grid__setup">Same setup in every studio: one Godox AD600 in a 120 cm octabox at 45°, 1.5 m from the subject · f/8 · 1/160 s · ISO 100 · 85 mm.</p>
  <ul class="shot-grid">
    <li><figure>
      <button class="shot" type="button"><picture>
        <source type="image/avif" srcset="… 480w, … 960w, … 1440w, … 2048w" sizes="(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw">
        <source type="image/webp" srcset="…" sizes="…">
        <img src="…" srcset="…" sizes="(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw" alt="Test shot 1, headshot: even falloff from the octabox, grey seamless, soft shadow under the chin." width="800" height="1000" loading="lazy">
      </picture></button>
      <figcaption><strong>1 · Headshot</strong></figcaption>
    </figure></li>
    <!-- 2 · Full length, 3 · Product on table -->
  </ul>
</st-shot-grid>
```

```html
<!-- rendered: gallery shot, no caption -->
<li><button class="shot" type="button"><picture>…<img … alt="Portrait in window light, subject turned three-quarters toward the north windows." width="800" height="1000" loading="lazy"></picture></button></li>
```

```html
<!-- rendered: sample shot -->
<li><figure>
  <button class="shot" type="button"><picture>…<img … alt="Couple on the lower steps with the brick kiln wall soft behind them." width="1200" height="800" loading="lazy"></picture></button>
  <figcaption><strong>85 mm</strong> · Shoot north from the lower steps</figcaption>
</figure></li>
```

```html
<!-- rendered: failed image, same button and slot -->
<li><button class="shot" type="button"><span class="media-fallback"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/></svg><span>Close portrait against the brick wall with the octabox as fill.</span></span></button></li>
```

The `<picture>` and fallback markup is `st-responsive-image`'s (its host sits
between the button and the picture and is not part of the contract). Page
objects select `.shot-grid__setup`, `.shot-grid > li`, `button.shot` by its
name, `figcaption` and `.media-fallback`.

```html
<!-- consumer: StudioGalleryComponent -->
<div class="section-head"><h2 id="gallery" i18n>From a real shoot</h2><span class="text-caption">{{ countText() }}</span></div>
<st-shot-grid [shots]="gallery()" (shotActivated)="openLightbox($event)" />

<!-- consumer: StudioTestShotsComponent -->
<st-shot-grid [shots]="testShots()" [setup]="setupLine()" (shotActivated)="openLightbox($event)" />
```

```ts
// application, beside the page
openLightbox(index: number) {
  this.dialog.open(LightboxComponent, { kind: 'viewer', data: { title: this.viewerTitle(), shots: this.gallery(), startIndex: index } });
}
```

## Design

- Grid: `display: grid`, `repeat(2, minmax(0, 1fr))`; 3 columns from 48rem; 4 from 62rem; gap `--space-4`; no list style.
- Figure: flex column, gap `--space-2`.
- Caption: `--text-body-sm`, `--color-fg-muted`; `strong` `--color-fg-default`, `--font-weight-semibold`.
- Setup line: `--text-body-sm`, `--color-fg-muted`, `margin-bottom: --space-4`.
- Shot: block, full width, `aspect-ratio: 4 / 5`, no padding or border, `--radius-md`, overflow hidden, `--color-bg-photo`, `cursor: zoom-in`.
- Image: covers the slot (`object-fit: cover`, width and height 100 %), `transition: scale --duration-slow --ease-standard`; hover `scale: 1.04`.
- Focus: the shared ring (`--focus-ring-width`, `--color-focus-ring`, `--focus-ring-offset`) keeps `--radius-md`.
- Failed: `.media-fallback` fills the slot on `--color-bg-photo`, `--color-fg-muted` text, `--color-fg-subtle` glyph, `overflow-wrap: anywhere`; inside `.shot` the text is `--text-caption`, clamped to six lines with an ellipsis (D-7).

No component tokens; photos keep their own colours in both themes.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Slot while loading, failed slot | `--color-bg-photo` | `--palette-stone-100` | `--palette-stone-800` |
| Caption, setup line, fallback text | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Caption strong part | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Fallback glyph | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Page | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Caption and setup line |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Caption strong part |
| `--color-fg-muted` | `--color-bg-photo` | 4.5:1 | Fallback alt text |
| `--color-fg-subtle` | `--color-bg-photo` | 4.5:1 | Fallback glyph |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

Forced colours: images still show, the focus ring becomes the system
highlight, and the fallback is real text.

## Responsive behaviour

| Width | Columns | Eight gallery photos | Three test shots | Five sample shots |
|---|---|---|---|---|
| XS, SM (below 48rem) | 2 | 4 rows of 2 | 2 + 1 | 2 + 2 + 1 |
| MD (48rem) | 3 | 3 + 3 + 2 | 1 row | 3 + 2 |
| LG and up (62rem) | 4 | 2 rows of 4 | 1 row, last column empty | 4 + 1 |

- Columns are `minmax(0, 1fr)`, so long captions wrap under their shot and never widen the grid. At 320 px each shot is about 136 px wide.
- The gap stays `--space-4`; the grid sits in the review column, which carries the page margins.
- Each shot is far above 44 × 44 px (at least 136 × 170 px at 320 px), so no extra target padding is needed.
- At 200 % zoom the grid behaves as at the equivalent narrower width; nothing scrolls sideways.

## Accessibility

### Role and pattern

A native `<ul>` of native `<button type="button">`s that open a modal dialog
(APG Dialog (Modal) pattern, through `DialogService`). Captioned shots use
`<figure>` and `<figcaption>`. It is not a `grid` or `listbox` widget: every
shot is its own tab stop.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the shots in reading order: left to right, then down. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates the shot: `shotActivated` emits its index and the application opens the lightbox on it. |
| <kbd>Esc</kbd> (in the lightbox) | Closes it; focus returns to this shot (`DialogService`). |

### Focus

The ring follows the slot's corners and shows on `:focus-visible` only. The grid
never moves focus; after the lightbox closes, focus is back on the shot that
opened it, even after paging, because the buttons are tracked by index and are
never re-created while the dialog is open.

### Labelling

- The button's name is the image's alt text, non-empty for every test shot,
  gallery photo and sample shot (L2-009.3, L2-010, L2-016). A failed image keeps
  that name because the fallback prints the alt.
- Captions follow the button inside the figure. The setup line is read once,
  before the list. The application's section heading names the region.

### Announcements

None. The lightbox announces "Photo n of total" itself.

### Motion

The hover zoom is the only motion; under `prefers-reduced-motion: reduce` the
photo does not zoom (`scale: none`). Nothing moves on its own.

## Content and internationalisation

- Setup line: starts "Same setup in every studio:", then light, modifier, angle,
  distance and exposure separated by " · ": "f/8 · 1/160 s · ISO 100 · 85 mm". Metric first.
- Test-shot titles: "number · name" ("1 · Headshot"). Sample-shot captions:
  "focal length · position note", note capitalised, no full stop ("135 mm ·
  Compress the valley from the top of the Beltline").
- Alt text: what the photo shows and what it proves, one sentence ("Test shot
  2, full length on the cyc: the scuffs show as faint marks behind the feet.").
  Never "Image 2" or a file name.
- Translatable: `setup`, each `title` and `caption` (application catalogue or
  stored data) and each `image.alt` (stored data). Long translations wrap under
  the shot.

## Performance

- Change detection: `OnPush`, signal inputs; the caption remainder per shot is
  a `computed` array; `@for` tracks by index (ICD-PERF-2).
- Images: every thumbnail lazy-loads (`priority` is never set: the grids sit
  below the fold on every review), with width and height reserved (L2-072).
- Performance scenario: the `components-harness` route `shot-grid/performance`
  renders The Junction Loft's three test shots and eight-photo gallery and
  Evergreen Brick Works' five sample shots, and opens the lightbox from gallery
  photo 3; it must stay within the L2-071 budgets.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Weight: imports `@angular/core` and `st-responsive-image`; no CDK (the
  lightbox is the application's call).

## Acceptance criteria

### Rendering

- **AC-1** Given The Junction Loft's three test shots with `setup` "Same setup in every studio: one Godox AD600 in a 120 cm octabox at 45°, 1.5 m from the subject · f/8 · 1/160 s · ISO 100 · 85 mm." and titles "1 · Headshot", "2 · Full length", "3 · Product on table", when the grid renders, then `p.shot-grid__setup` with that text precedes a `ul.shot-grid` of three `li > figure` items, in that order, each with a `button.shot[type="button"]` and a `figcaption > strong` holding its title. (L2-009)
- **AC-2** Given those test shots, when the buttons are inspected, then each `img` has its stored non-empty alt ("Test shot 1, headshot: even falloff from the octabox, grey seamless, soft shadow under the chin.") and each button's accessible name equals that alt. (L2-009)
- **AC-3** Given The Junction Loft's eight gallery photos with no `title` and `setup` null, when the grid renders, then it shows eight `li > button.shot` with no `figure`, no `figcaption` and no setup line. (L2-010)
- **AC-4** Given Evergreen Brick Works' five sample shots with `title` "85 mm" and `caption` "85 mm · Shoot north from the lower steps" (and the four others), when the grid renders, then each `figcaption` reads "85 mm · Shoot north from the lower steps" with only "85 mm" inside `<strong>`. (L2-016)

### Interaction

- **AC-5** Given focus on gallery photo 3, when the visitor presses Enter, presses Space or clicks it, then `shotActivated` emits `2` once per activation and the page does not navigate. (L2-010)
- **AC-6** Given the application opens the lightbox on `shotActivated`, when the visitor pages to photo 5 and presses Escape, then focus is back on gallery photo 3's button. (L2-010)
- **AC-7** Given Evergreen Brick Works' first sample shot, when it is activated, then `shotActivated` emits `0` and that shot's `caption` "85 mm · Shoot north from the lower steps" is the one the application hands to the lightbox. (L2-016)

### Keyboard and focus

- **AC-8** Given the gallery at 1280 px, when a keyboard user tabs from the first shot, then focus visits the eight shots left to right, then down, each as its own tab stop. (L2-067)
- **AC-9** Given a focused shot, when it is measured, then a focus ring of `--focus-ring-width` (2 px) in `--color-focus-ring` follows the slot's `--radius-md` corners with at least 3:1 contrast against `--color-bg-canvas`, and no ring shows when the shot is clicked with a mouse. (L2-067)

### States

- **AC-10** Given The Junction Loft's gallery while its images are still loading, when the grid renders, then every slot already has its final 4:5 size on `--color-bg-photo`, each `img` has `width`, `height`, `srcset`, the default `sizes` and `loading="lazy"`. (L2-072)
- **AC-11** Given the gallery at a 360 px viewport with a device pixel ratio of 3, when the thumbnails load, then no request is made for a variant wider than 960 px. (L2-072)
- **AC-12** Given gallery photos 2 and 5 return HTTP 404 (pages/studio/media-failed), when the grid renders, then each keeps its slot and shows `.media-fallback` with the image-failed glyph and its alt text ("Close portrait against the brick wall with the octabox as fill."), the text stays inside the slot (clamped with an ellipsis at 320 px), the grid's layout shift is 0, and the button keeps its full alt as its name and still emits `shotActivated`. (L2-086)

### Screen readers

- **AC-13** Given the test shots, the gallery and the sample shots, when axe-core scans them in the light and the dark theme, then it reports no violations and every button has a non-empty name. (L2-069)

### Theming

- **AC-14** Given the sample shots and a failed gallery photo in the light and the dark theme, when the contrast check runs, then captions and the setup line are at least 4.5:1 against `--color-bg-canvas`, the strong part at least 4.5:1, and the fallback text at least 4.5:1 against `--color-bg-photo`. (L2-068)

### Responsive

- **AC-15** Given the eight-photo gallery, when it renders at 360 px, 768 px and 1280 px wide, then it shows 2, 3 and 4 columns respectively. (L2-010)
- **AC-16** Given the five sample shots, when they render at 360 px and 1280 px wide, then they show 2 and 4 columns respectively. (L2-016)
- **AC-17** Given the sample shots at 320 px wide, when they render, then each shot is at least 136 px wide, captions wrap under their shot, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-18** Given The Junction Loft's page at 200 % zoom in a 1280 px viewport, when the visitor reaches the test shots and the gallery, then every shot and caption is visible and operable with no horizontal page scroll. (L2-066)

### Server rendering

- **AC-19** Given The Junction Loft's page fetched with JavaScript disabled, when the HTML is inspected, then it contains the setup line, the three test-shot and eight gallery `img` elements with their alt text, `srcset` and dimensions. (L2-074)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the hover zoom is removed (`scale: none`)
([shot-grid.html](../../design-system/components/shot-grid.html), Accessibility › Motion).

### Performance

- **AC-20** Given the `shot-grid/performance` harness route with the test shots, the gallery and the sample shots, when it is measured with Lighthouse in mobile mode, then Cumulative Layout Shift is at most 0.1 and activating gallery photo 3 has an interaction-to-next-paint of at most 200 ms. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/shot-grid/`:
  `shot-grid.component.ts` (`ShotGridComponent`, selector `st-shot-grid`),
  `shot-grid.component.html`, `shot-grid.component.css` (port of
  `.shot-grid*`, `.shot`, `.shot img` and the reduced-motion rule; `.shot img`
  is written so it reaches the `img` inside `st-responsive-image`, which the
  responsive-image component styles to fill its container).
- Template: `@if (setup()) { <p class="shot-grid__setup">{{ setup() }}</p> }`,
  then `<ul class="shot-grid">` with `@for (shot of shots(); track $index)`;
  inside, a captioned shot renders `<figure>` + `<figcaption><strong>{{ shot.title }}</strong>{{ rest()[$index] }}</figcaption>`;
  the button is `<button class="shot" type="button" (click)="shotActivated.emit($index)">`
  with `<st-responsive-image [image]="shot.image" [sizes]="sizes()" />`.
- `rest = computed(() => shots().map(s => s.title && s.caption.startsWith(s.title) ? s.caption.slice(s.title.length) : ''))`.
- Composes [`st-responsive-image`](responsive-image.md), which owns lazy
  loading, `<picture>` and the failed fallback (ICD-MEDIA-1, ICD-MEDIA-3).
- Types `Shot` and `ResponsiveImage` from `src/lib/types/` (ICD §8).
- Mock drift the component corrects: thumbnails are `<a href>` to the lightbox
  mock in the mocks and `<button type="button">` here; the spot mocks declare
  1200 × 800 sample images as 800 × 1000, while the product passes the true
  dimensions from the data.
- No ICD change.

## Decisions

- **D-1** *How do `Shot.title` and `Shot.caption` map onto the thumbnail and the lightbox?* `caption` is the full caption the lightbox shows ("85 mm · Shoot north from the lower steps"; for gallery photos the alt text). `title` marks a captioned thumbnail and is its `<strong>` lead ("85 mm", "1 · Headshot"); when `caption` begins with `title`, the thumbnail adds the rest of the caption after the `<strong>`. A shot without `title` has no thumbnail caption. This reproduces all three DS variants and L2-016.2's matching wording, with no separator text rendered by the library (ICD-I18N-3) and no extra input. The lightbox shows `caption` unchanged (ICD-002 §9.4).
- **D-2** *Button or link?* `<button type="button">`, as the DS fixes: the mocks link to static lightbox files only so they can be clicked through, and the thumbnail acts in place by opening a dialog.
- **D-3** *Who handles a failed image?* `st-responsive-image`, inside the button (ICD-MEDIA-3). The grid adds nothing: the slot, the alt text and the button's name survive, and activation still emits, so the lightbox opens on the same fallback.
- **D-4** *Is the gallery count or the section heading part of the grid?* No. ICD-002 gives the grid no heading input; the application's `.section-head` holds the heading and the count, so the heading outline stays the application's (ICD-A11Y-3).
- **D-5** *What is the host?* `st-shot-grid` is a plain block wrapper around two siblings, the optional setup line and the `ul`, so it cannot itself be the list; it has `display: block` and no styles of its own.
- **D-6** *Does any thumbnail get `priority`?* Never. Every grid sits below the review hero, which the application marks as the page's one priority image (ICD-MEDIA-2).
- **D-7** *A long alt text ("Test shot 1, headshot: even falloff from the octabox, grey seamless, soft shadow under the chin.") does not fit a failed 136 × 170 px slot at 320 px, and `.shot` clips its overflow.* Inside a shot slot the fallback text uses `--text-caption` and is clamped to six lines with an ellipsis. The slot keeps its size (L2-086.1), the visible text still starts with the alt, the button's accessible name stays the whole alt, and the lightbox shows the whole alt in its fallback. The rule is the grid's (`.shot .media-fallback`), so other fallbacks are unchanged; the DS page catches up.
