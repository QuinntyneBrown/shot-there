# Responsive image

| Field | Value |
|---|---|
| Selector | `st-responsive-image`, `img[stFallbackImage]` |
| Library path | `frontend/projects/components/src/lib/responsive-image/` |
| Status | planned |
| Traces to | L2-064, L2-068, L2-069, L2-071, L2-072, L2-074, L2-086 |
| Design system | [`patterns/empty-and-error-states.html`](../../design-system/patterns/empty-and-error-states.html) (*Map and media failures*), [`components/shot-grid.html`](../../design-system/components/shot-grid.html) (*States › Failed*), [`components/review-layout.html`](../../design-system/components/review-layout.html) (hero) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/spots/default`](../../mocks/pages/spots/default.html), [`pages/map/default`](../../mocks/pages/map/default.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/guide/default`](../../mocks/pages/guide/default.html), [`pages/compare/default`](../../mocks/pages/compare/default.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/upload-failed`](../../mocks/pages/studio-editor/upload-failed.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`dialogs/lightbox/default`](../../mocks/dialogs/lightbox/default.html), [`dialogs/lightbox/image-failed`](../../mocks/dialogs/lightbox/image-failed.html), [`dialogs/map-popup/default`](../../mocks/dialogs/map-popup/default.html) |
| Rendering | [`responsive-image.html`](responsive-image.html) |

## Purpose and scope

Photos carry ShotThere: the hero of The Junction Loft, its three standard test
shots, eight gallery photos, Evergreen Brick Works' sample shots, a 3:2 photo
on every card. `st-responsive-image` renders each one as a `picture` that lets
the browser pick the smallest variant in the best format it accepts (AVIF, then
WebP, then JPEG; widths 480, 960, 1440 and 2048), reserves its box from the
image's own width and height so nothing shifts, loads it lazily unless it is
the page's first image, and, when the image fails, keeps the box and shows the
alt text in a `.media-fallback` placeholder (L2-072, L2-086.1).
`img[stFallbackImage]` gives that same failed-image placeholder to a plain
`<img>` that has a single URL.

The slot around the image (the 3:2 card media box, the 4:5 shot, the 3:2 /
16:7 hero, the lightbox frame) belongs to the component that draws it:
[`st-location-card`](location-card.md), [`st-shot-grid`](shot-grid.md),
[`LightboxComponent`](lightbox.md), [`st-video-poster`](video-poster.md),
and the application's review hero and compare table. Map tiles that fail are
[`st-map-unavailable`](map.md), not an image fallback.

Out of scope:

- Generating variants, building `srcset` strings and choosing `fallbackUrl`:
  the API (`serve-responsive-images`); the component receives a
  `ResponsiveImage` that `ImageDto` satisfies.
- The `sizes` value and which image gets `priority` (exactly one per page,
  ICD-MEDIA-2): the application's or the composing component's.
- Writing alt text and deciding whether an image is decorative: the owner and
  the composing component (a card photo is decorative because the name
  follows it; a gallery photo is informative).
- The slot's aspect ratio, corners and `--color-bg-photo` loading ground: the
  slot's owner.
- The failed video poster's look (episode title on the inverse ground, Play
  pill moved down): [`st-video-poster`](video-poster.md)'s.

## Usage

Every content `img` in `docs/mocks/` (inventory by script over every `<img>`
with its parent and attributes, plus every `.media-fallback`), grouped by
configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/*`, `pages/spot/*` review hero (application `.review-hero`) | informative, `priority`, 3:2 (16:7 from 48rem) | "The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand." | loaded (eager, `fetchpriority="high"`); failed with alt text (`studio/media-failed`) | `--color-bg-photo` slot |
| Studio and spot cards on `pages/studios/*`, `pages/spots/*`, `pages/map/*`, `pages/home/*`, `pages/guide/*`, `pages/guides/*`, rain backup, `dialogs/map-popup/*` (via [`st-location-card`](location-card.md)) | `decorative`, 1200 × 800, `sizes` `(min-width: 62rem) 33vw, (min-width: 36rem) 50vw, 100vw`; the first card of a list has `priority` | — | loaded (lazy), hover zoom; failed with icon only | 3:2 card media box |
| Test shots, gallery, sample shots on `pages/studio/*`, `pages/spot/*` (via [`st-shot-grid`](shot-grid.md)) | informative, 800 × 1000, `sizes` `(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw` | "Test shot 1, headshot: even falloff from the octabox, grey seamless, soft shadow under the chin." | loaded (lazy), hover zoom; failed with alt text (`studio/media-failed`) | 4:5 `.shot` |
| `dialogs/lightbox/*` (via [`LightboxComponent`](lightbox.md)) | informative, `priority`, `sizes="100vw"`; the lightbox sizes the host to the photo's own ratio within 100dvh − 13rem ([lightbox](lightbox.md) D-5) | "Full-length fashion frame on the cyc, warm afternoon light from the left." | loaded; failed with alt text in the same box (`lightbox/image-failed`) | canvas |
| `pages/compare/*` column headers (via [`compare-table`](compare-table.md)) | `decorative`, in the application's 3:2 `span.compare-table__photo` with `--radius-md` | — | loaded (lazy); failed with icon only | table header |
| `pages/compare/*` test-shot rows (via [`compare-table`](compare-table.md)) | informative, in the application's 4:5 `span.compare-table__shot` with `--radius-sm` | "The Junction Loft, test shot 1, headshot: even falloff on grey seamless." | loaded (lazy); failed with alt text | table cell |
| Episode posters on `pages/studio/*`, `pages/spot/*` (via [`st-video-poster`](video-poster.md)) | `decorative`, 16:9 cover | — | loaded (lazy); on failure the poster removes this component and draws its own fallback ([video-poster](video-poster.md) D-2) | `--color-bg-inverse` |
| Image manager rows on the editors (via [`li[st-image-row]`](image-manager.md)) | plain `img` from `thumbnailUrl` with `stFallbackImage`, `alt=""`, 4:5 crop | — | loaded; uploading; failed with icon only | `--color-bg-photo` thumb |
| Static map preview image on `pages/spot/*`, `pages/spot-editor/*` where the application shows one | plain `img` with `stFallbackImage`, `alt=""` | — | loaded; failed with icon only | `.static-map` |

Every row is buildable with `image`, `sizes`, `priority` and `decorative`, or
with the directive on a plain `img`. The mocks give the second card of the
studio list `loading="eager"` too; only the first is eager (D-6).

## Anatomy

### `st-responsive-image`

1. **Host** — `st-responsive-image`, `display: block; width: 100%; height: 100%`:
   a box that fills its slot. The slot's owner may size, clip, round or scale
   the host from its own stylesheet (the host is an element of the owner's
   template), never the `img` inside it (D-1).
2. **Picture** — `picture`, `display: contents`.
3. **Sources** — one `source` per format present, in the order AVIF, WebP,
   JPEG, each with `type="image/{format}"`, its `srcset` and the `sizes`.
4. **Image** — `img` with `src` (`fallbackUrl`), `srcset` (the JPEG source's),
   `sizes`, `alt`, `width`, `height`, `loading` and, with `priority`,
   `fetchpriority="high"`. `display: block; width: 100%; height: 100%; object-fit: cover`: it
   fills the host box, while its `width` and `height` attributes still reserve
   the box where the slot has no fixed height (D-1, D-2).
5. **Fallback (failed state only)** — replaces the picture:
   `span.media-fallback` filling the same host box, holding an
   [`st-icon`](icon.md) `image-failed` (md, `--color-fg-subtle`) and, unless
   decorative, a `span` with the alt text.

### `img[stFallbackImage]`

1. **Host** — the application's or a library component's own `img`; the
   directive adds nothing while it loads.
2. **Fallback (failed state only)** — the image is hidden
   (`display: none`) and the same `span.media-fallback` is inserted right after
   it, with the alt text unless `alt` is empty.

## API

### `st-responsive-image`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `image` | `ResponsiveImage` | — | yes | `alt`, `width`, `height`, `sources` and `fallbackUrl`; `ImageDto` is assignable. `width` and `height` become the `img` attributes. A new value clears the failed state. |
| `sizes` | `string` | — | yes | Copied to every `source` and to the `img`. |
| `priority` | `boolean` | `false` | no | `loading="eager"` and `fetchpriority="high"`; otherwise `loading="lazy"` and no `fetchpriority`. |
| `decorative` | `boolean` | `false` | no | Forces `alt=""` whatever `image.alt` holds; the failed placeholder then shows the icon and no text. |

Signal inputs; `priority` and `decorative` use `booleanAttribute`.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Failure is handled inside the component; no consumer reacts to it. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | The image and its fallback come from the inputs. |

### `img[stFallbackImage]`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| None | | | | The alt text is the host's own `alt` attribute; the box comes from its `width` and `height` attributes. |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | A directive has no template. |

Neither part has library strings (ICD §12): the only text either renders is
the alt text the application supplied.

## Variants and sizes

| Variant | How | Use for |
|---|---|---|
| Informative | default | Hero, test shots, gallery, sample shots, the lightbox, compare test shots: `alt` is the stored alt text, never empty (L2-068.2). |
| Decorative | `decorative` | Card photos, compare headers, episode posters: `alt=""` because the name or play label beside them says the same thing. |
| Priority | `priority` | Exactly the first above-the-fold image on a page: the review hero, or the first card of a list. |
| Lazy | default | Every other image. |

| Format order | `type` | Chosen by |
|---|---|---|
| AVIF | `image/avif` | Browsers that accept AVIF (Chromium, Firefox, Safari 16.4+) |
| WebP | `image/webp` | Browsers that accept WebP but not AVIF |
| JPEG | `image/jpeg` | Everyone else; also the `img`'s own `srcset` and `src` |

One size: the image takes its slot's size. The slot decides the rendered
width; `sizes` tells the browser that width in advance, so it picks a variant
of at most twice the slot on a 2× screen (L2-072.4: a gallery thumbnail at
360 px never needs more than the 960 variant).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Loading | request in flight | The slot's `--color-bg-photo` shows in the reserved box | `img` with its `alt` |
| Lazy, not yet requested | `loading="lazy"` below the fold | Same reserved box | `img` with its `alt` |
| Loaded | `load` | The photo, cropped to the slot (`cover`), or uncropped in the lightbox (`contain`) | "image, The Junction Loft: two tall north windows…" or nothing when decorative |
| Hover (in a card or shot) | the slot's `:hover` | The slot's owner scales the host to 1.04 over `--duration-slow`; the image scales with it | — |
| Failed, informative | `error` on the `img`, or a broken image found after hydration (D-3) | `.media-fallback` in the same box: `--color-bg-photo` ground, `image-failed` icon, the alt text in `--color-fg-muted`, wrapping | The alt text as text; a shot's button keeps it as its name |
| Failed, decorative | same, with `decorative` or `alt=""` | `.media-fallback` with the icon only | Nothing (the icon is hidden) |
| Failed, in the lightbox | same, inside `.lightbox__frame` | The fallback fills the host box the lightbox sized for the photo, so it has the photo's own size and ratio | The alt text; the dialog's caption still describes it |
| Failed, in a shot | same, inside `.shot` | The alt text in `--text-caption`, clamped to six lines with an ellipsis ([shot-grid](shot-grid.md) D-7) | The whole alt text stays the button's name |
| Recovered | a new `image` value | The picture is rendered again | `img` with its `alt` |
| Reduced motion | `prefers-reduced-motion: reduce` | No hover zoom | — |
| Forced colours | `forced-colors: active` | Photos still show; the fallback's ground is removed by the system and its text and icon take system colours | Unchanged |

## Markup

```html
<!-- rendered: gallery photo, informative, lazy -->
<st-responsive-image>
  <picture>
    <source type="image/avif" srcset="https://images.shotthere.ca/9f2c41/480.avif 480w, https://images.shotthere.ca/9f2c41/960.avif 960w, https://images.shotthere.ca/9f2c41/1440.avif 1440w" sizes="(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw">
    <source type="image/webp" srcset="https://images.shotthere.ca/9f2c41/480.webp 480w, https://images.shotthere.ca/9f2c41/960.webp 960w, https://images.shotthere.ca/9f2c41/1440.webp 1440w" sizes="(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw">
    <source type="image/jpeg" srcset="https://images.shotthere.ca/9f2c41/480.jpeg 480w, https://images.shotthere.ca/9f2c41/960.jpeg 960w, https://images.shotthere.ca/9f2c41/1440.jpeg 1440w" sizes="(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw">
    <img src="https://images.shotthere.ca/9f2c41/960.jpeg" srcset="https://images.shotthere.ca/9f2c41/480.jpeg 480w, https://images.shotthere.ca/9f2c41/960.jpeg 960w, https://images.shotthere.ca/9f2c41/1440.jpeg 1440w" sizes="(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw" alt="Close portrait against the brick wall with the octabox as fill." width="1600" height="2000" loading="lazy">
  </picture>
</st-responsive-image>
```

```html
<!-- rendered: review hero, priority (sources as above) -->
<img src="…/960.jpeg" srcset="…" sizes="(min-width: 80rem) 1280px, 100vw" alt="The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand." width="3000" height="2000" loading="eager" fetchpriority="high">
```

```html
<!-- rendered: failed, informative (the picture is gone; the box is the same) -->
<st-responsive-image>
  <span class="media-fallback" style="aspect-ratio: 1600 / 2000"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/></svg><span>Close portrait against the brick wall with the octabox as fill.</span></span>
</st-responsive-image>
```

```html
<!-- rendered: failed, decorative card photo -->
<span class="media-fallback" style="aspect-ratio: 1200 / 800"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…image-failed…</svg></span>
```

```html
<!-- rendered: img[stFallbackImage] after it failed -->
<img class="static-map__tiles" src="…" alt="" width="1200" height="675" style="display: none;">
<span class="media-fallback" style="aspect-ratio: 1200 / 675"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…image-failed…</svg></span>
```

Host tag names and the `aspect-ratio` inline style are not part of the
contract (ICD-DOM-3); `picture`, `source[type]`, the `img` attributes and
`.media-fallback` are.

```html
<!-- consumer: the review hero (application) -->
<div class="review-hero"><st-responsive-image [image]="studio().hero" sizes="(min-width: 80rem) 1280px, 100vw" priority /></div>

<!-- library composition: a gallery shot in st-shot-grid -->
<button class="shot" type="button" (click)="open(i)"><st-responsive-image [image]="shot.image" [sizes]="sizes" /></button>

<!-- library composition: a card photo in st-location-card -->
<div class="location-card__media"><st-responsive-image [image]="image()!" [sizes]="imageSizes()" [priority]="priority()" decorative /></div>

<!-- consumer: a plain image with a single URL -->
<img stFallbackImage class="static-map__tiles" [src]="previewUrl()" alt="" width="1200" height="675">
```

## Design

- Host: `display: block; width: 100%; height: 100%`. It fills the slot box its owner draws (the 3:2 card frame, the 4:5 shot, the 3:2 / 16:7 hero, the lightbox frame, the compare table's clipping spans). Where the slot has no definite height, `height: 100%` resolves to `auto` and the box follows the image's own ratio.
- Picture: `display: contents`.
- Image: `display: block; width: 100%; height: 100%; object-fit: cover`; the `width` and `height` attributes are always present, so the browser reserves the box from the image's ratio before any byte arrives.
- Fallback: the global `.media-fallback` utility (ICD §11.1): `display: grid; place-items: center; align-content: center; gap: var(--space-2)`, `width: 100%; height: 100%`, padding `--space-3`, `--color-bg-photo` ground, `--color-fg-muted` text in `--text-body-sm`, centred, `overflow-wrap: anywhere`; icon `--color-fg-subtle` at `--icon-size-md`. It fills the same host box as the image did; the component adds `overflow: hidden` and an inline `aspect-ratio: {width} / {height}` from the image's dimensions, so it keeps the image's box even in a slot without a fixed height (D-2).
- Fallback in a shot: inside `.shot` the alt-text `span` takes `--text-caption` and is clamped to six lines with an ellipsis (`display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden`), written as `:host-context(.shot)` in this component's stylesheet because the grid's stylesheet cannot reach it ([shot-grid](shot-grid.md) D-7).
- Motion: none of its own. The hover zoom is the slot owner's, applied to the host (`scale: 1.04` over `--duration-slow` with `--ease-standard`, removed under reduced motion), as [location-card](location-card.md) D-13 does.

**Who styles what.** Component styles are encapsulated (ICD-STY-3): a slot's
stylesheet reaches the `st-responsive-image` host in its own template but not
the `img` or `.media-fallback` inside it. So the design system's
`<slot> img` rules are split: this component fills its host with the image or
the fallback; the slot's owner sizes, clips, rounds and zooms the host. The
owners' CRDs carry their half: the review hero ([review-layout](review-layout.md)),
the card frame ([location-card](location-card.md)), the shot
([shot-grid](shot-grid.md)), the lightbox frame ([lightbox](lightbox.md) D-5),
the compare table's spans ([compare-table](compare-table.md) D-5) and the
poster ([video-poster](video-poster.md)).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fallback ground (and the slot's loading ground) | `--color-bg-photo` | `--palette-stone-100` | `--palette-stone-800` |
| Fallback alt text | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Fallback icon | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-photo` | 4.5:1 | Alt text in the fallback |
| `--color-fg-subtle` | `--color-bg-photo` | 4.5:1 | The image-failed icon (meets the text minimum, above the 3:1 it needs) |

Photos are content and keep their own colours in both themes; only the empty
and failed grounds change. Forced colours: the fallback is real text, so it
stays readable.

## Responsive behaviour

- The image does not change by breakpoint; its slot does (the hero is 3:2 below
  48rem and 16:7 from 48rem; the card grid has one, two or three columns), and
  `sizes` tells the browser the slot's width at each breakpoint.
- The fallback fills the slot at every width; long alt text wraps (at any
  character if a word is too long) and never widens the slot. At 320 px
  nothing scrolls sideways; at 200 % zoom the text grows inside the same box.
- Neither part has a touch target of its own; a failed shot stays a full-size
  button because the shot's button keeps its box.

## Accessibility

### Role and pattern

A native `img` inside `picture`. Informative images carry the stored alt text,
never empty (L2-068.2); decorative ones `alt=""`. The fallback is plain text
inside a `span`, with the icon hidden, so the meaning survives as visible text
(WCAG 1.1.1) and a shot's button keeps its name (D-4). No APG pattern applies.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Never stops on an image or a fallback; it stops on the shot button or card link around it, loaded or failed. |

### Focus

Neither part takes or moves focus. When an image fails while its shot button
has focus, focus stays on the button.

### Labelling

- The alt text says what the photo shows and what it proves, in one sentence:
  "Test shot 2, full length on the cyc: the scuffs show as faint marks behind
  the feet." Never "Image 2" or a file name.
- A failed informative image prints the same alt text; a failed decorative
  image prints nothing, so a card's name is still read once.
- The icon is `aria-hidden`.

### Announcements

None. A failed image is not announced; its text is there when the reader
reaches it.

### Motion

The hover zoom in cards and shots is removed under `prefers-reduced-motion:
reduce` ([shot-grid.html](../../design-system/components/shot-grid.html),
Accessibility). Images never fade in.

## Content and internationalisation

- Alt text is data, stored with the image and written by the owner; it is
  translated with the content, not through the UI catalogue.
- Failed images never say "Image unavailable" or "Photo failed to load": the
  alt text is the message, as the design system's do/don't shows.
- The component has no strings; `sizes` values are CSS, not copy.
- French alt text runs about 30 % longer; the fallback wraps it inside the
  same box.

## Performance

- Change detection: `OnPush`, signal inputs. The ordered sources, the JPEG
  `srcset`, `alt`, `loading` and `fetchpriority` come from `computed` values;
  the failed state is one signal.
- Failure detection: one `error` listener on the `img`, and one check after
  hydration (`afterNextRender`) for an image that broke before the listener
  existed (D-3). No polling, no `IntersectionObserver` (the browser lazy-loads
  natively).
- Performance scenario: the `components-harness` route
  `responsive-image/performance` renders The Junction Loft's hero with
  `priority` and its eight gallery photos below it in a four-column shot grid,
  with the photo service throttled; Largest Contentful Paint and layout shift
  stay within the L2-071 budgets. A second route variant fails photos 2 and 5
  and must show no layout shift either.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: `width` and `height` on every `img` and the slot's own ratio
  reserve the box before any byte arrives; the fallback takes the same box
  (L2-072, L2-086.1, ICD-PERF-4).
- Weight: imports `@angular/core` (`afterNextRender`, `Renderer2`,
  `ViewContainerRef`) and the library's `IconComponent`. No image library.

## Acceptance criteria

### Rendering

- **AC-1** Given a gallery photo whose `image.sources` hold AVIF, WebP and JPEG and `sizes="(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw"`, when it renders, then a `picture` holds three `source` elements in the order `image/avif`, `image/webp`, `image/jpeg`, each with its format's `srcset` and that `sizes`. (L2-072)
- **AC-2** Given the same photo, when it renders, then the `img` has `src` equal to `fallbackUrl`, the JPEG `srcset`, the same `sizes`, `alt="Close portrait against the brick wall with the octabox as fill."`, `width` and `height` equal to the image's, `loading="lazy"` and no `fetchpriority`. (L2-072)
- **AC-3** Given `image.sources` supplied in the order JPEG, WebP, AVIF, when it renders, then the sources are still AVIF, WebP, JPEG; and given only WebP and JPEG, then exactly those two are rendered in that order. (L2-072)
- **AC-4** Given The Junction Loft's hero with `priority`, when it renders, then the `img` has `loading="eager"` and `fetchpriority="high"`. (L2-072)
- **AC-5** Given the gallery in Chromium, which accepts AVIF, when a photo loads, then its `currentSrc` is an AVIF variant. (L2-072)
- **AC-6** Given the studio page at 360 px with a device pixel ratio of 2, when the gallery thumbnails load, then no thumbnail's `currentSrc` is a variant wider than 960 px. (L2-072)
- **AC-7** Given a gallery photo whose request is held for 3 s, when the page renders, then its shot already has its final 4:5 box and nothing below it moves when the photo arrives. (L2-072)
- **AC-8** Given Kensington Window Room's card photo with `decorative` and an `image.alt` of "Kensington Window Room: tall windows over a wooden floor", when it renders, then the `img` has `alt=""`. (L2-068)
- **AC-9** Given an informative gallery photo, when it renders, then its `alt` equals `image.alt` and is not empty. (L2-068)
- **AC-10** Given The Junction Loft's page fetched with JavaScript disabled, when the HTML is inspected, then the hero and the eight gallery photos are present as `picture` markup with their `source` and `img` attributes. (L2-074)

### States

- **AC-11** Given gallery photo 2 whose URL returns HTTP 404, when the page renders, then its shot holds `span.media-fallback` with the `image-failed` icon and the text "Close portrait against the brick wall with the octabox as fill.", and no `picture` or `img`. (L2-086)
- **AC-12** Given that failure, when the shot's bounding box is measured before and after the error, then the box is identical and the page's layout-shift score does not increase. (L2-086)
- **AC-13** Given Kensington Window Room's decorative card photo returns HTTP 404, when the card renders, then the fallback shows the icon and no text, and the card's name is read once. (L2-086)
- **AC-14** Given The Junction Loft's hero returns HTTP 404 before the application has hydrated, when hydration completes, then the hero shows the fallback with its alt text. (L2-086)
- **AC-15** Given photo 3 of 8 fails in the lightbox, when the viewer shows it, then the fallback fills the box the lightbox sized for the photo with "Full-length fashion frame on the cyc, warm afternoon light from the left.", and "Previous photo" and "Next photo" still move to photos 2 and 4. (L2-086)
- **AC-16** Given a shot button whose photo failed, when the accessibility tree is read, then the button's name is still the photo's alt text. (L2-069)
- **AC-17** Given a failed photo, when the consumer passes a new `image` value, then the `picture` is rendered again and the fallback is gone. (L2-086)

### Fallback directive

- **AC-18** Given `<img stFallbackImage alt="Evergreen Brick Works: the kiln buildings from the Beltline" width="1200" height="675">` whose URL returns HTTP 404, when the error fires, then the `img` is hidden and a `span.media-fallback` with the icon and that alt text follows it in the same box. (L2-086)
- **AC-19** Given `<img stFallbackImage alt="">` that fails, when the error fires, then the fallback shows the icon and no text. (L2-086)

### Theming

- **AC-20** Given failed informative and decorative images in the light and the dark theme, when the contrast check runs, then the alt text is at least 4.5:1 and the icon at least 3:1 against `--color-bg-photo`. (L2-068)

### Responsive

- **AC-21** Given The Junction Loft's failed hero at 320 px, when it renders, then the alt text wraps inside the 3:2 slot and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Layout

- **AC-23** Given The Junction Loft's hero in a `.review-hero` box of 960 × 420 px (16:7) and Kensington Window Room's photo in a 3:2 card frame, when each loads and when each fails, then the `img`, and later the `.media-fallback`, has exactly its host's box, the host has exactly the slot's box, the `img` uses `object-fit: cover`, and the `img` still carries `width` and `height` attributes. (L2-072)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the component
never animates; the hover zoom of cards and shots is their owners' and stops
under `prefers-reduced-motion: reduce`
([shot-grid.html](../../design-system/components/shot-grid.html),
Accessibility).

### Performance

- **AC-22** Given the `responsive-image/performance` harness route with the hero and eight gallery photos on the Lighthouse mobile profile, when it loads, then Largest Contentful Paint is at most 2.5 s and Cumulative Layout Shift at most 0.1, with and without two failed photos. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/responsive-image/`:
  `responsive-image.component.ts` (`ResponsiveImageComponent`, selector
  `st-responsive-image`), `.html` (`@if (failed())` fallback, else `picture`
  with `@for` over the ordered sources, tracked by format), `.css`
  (`:host { display: block; width: 100%; height: 100% }`,
  `picture { display: contents }`, the `img` fill rule and the
  `:host-context(.shot)` fallback clamp);
  `fallback-image.directive.ts` (`FallbackImageDirective`, selector
  `img[stFallbackImage]`); `media-fallback.component.ts` with `.html` and
  `.css` (internal, not exported: selector `span[stMediaFallback]`, inputs
  `alt` and `ratio`, host class `media-fallback`, renders
  `<st-icon name="image-failed" />` and the alt-text `span`). Types
  `ResponsiveImage` and `ResponsiveImageSource` in `src/lib/types/`.
- The component and the directive both render the fallback through the
  internal component, so the markup is one. The directive creates it with
  `ViewContainerRef.createComponent` right after its host and hides the host
  with `Renderer2.setStyle(img, 'display', 'none')`.
- Failure detection in both: an `error` host listener, and in
  `afterNextRender` the check `img.complete && img.naturalWidth === 0` for an
  image with a `src` (D-3). Browser-only work stays in `afterNextRender`
  (ICD-SSR-1).
- `.media-fallback` is a global utility (ICD §11.1); its base rule and
  `.media-fallback .icon` come from `styles/utilities.css`, so the internal
  component adds only the inline `aspect-ratio`.
- Depends on the icon CRD's additive `IconName` member `'image-failed'`
  (ICD-002 1.1.0). No other ICD change.
- Composed by [`st-location-card`](location-card.md),
  [`st-shot-grid`](shot-grid.md), [`LightboxComponent`](lightbox.md) and
  [`st-video-poster`](video-poster.md); used directly by the application's
  review hero and compare table. `img[stFallbackImage]` is used by
  [`li[st-image-row]`](image-manager.md) and by application images with a
  single URL.
- Mocks drift the component corrects: the second studio card's
  `loading="eager"` (D-6); the hero and lightbox fallbacks are `div` in the
  mocks and `span` here (D-5).

## Decisions

- **D-1** *How do a slot's rules (cover crop, hover zoom, the lightbox's uncropped photo, the compare table's corners) work when the `img` sits inside this component, where the slot's encapsulated stylesheet cannot reach it?* The host is a block that fills its slot, and the image (or the fallback) fills the host with `object-fit: cover`. The slot's owner sizes, clips, rounds and zooms the host, which is an element of its own template. This keeps every owner's CSS in its own component, needs no `::ng-deep` (ICD-STY-3) and no new input, and matches what the review layout, location card, shot grid, lightbox, compare table and video poster CRDs rely on. The only rule this component carries for a parent is the shot's fallback clamp, because it styles text inside the fallback.
- **D-2** *How does the fallback keep the image's box in a slot with no fixed height (a compare cell, a plain image with only `width` and `height`)?* The fallback carries `aspect-ratio: {width} / {height}` from the image's dimensions. In a slot that already sets both dimensions (shot, card, hero) its `width: 100%; height: 100%` win and the ratio is ignored; elsewhere the ratio gives exactly the box the `img` reserved, so nothing shifts (L2-086.1).
- **D-3** *What if the image fails before Angular hydrates and attaches the `error` listener (a server-rendered hero with a broken URL)?* After hydration the component checks `complete && naturalWidth === 0` once and shows the fallback. Without it, server-rendered pages, which are every public page (L2-074), would keep a broken image.
- **D-4** *Should the fallback be `role="img"` with an `aria-label`, so it is still announced as an image?* No. The design system and mocks print the alt text as plain visible text, which keeps the meaning, gives a shot button its name and adds no ARIA to maintain.
- **D-5** *The mocks draw the hero and lightbox fallbacks as `div` and the shot's as `span`.* Always `span`, because the fallback often sits inside a `button` or `a`, where only phrasing content is valid; `.media-fallback` is `display: grid`, so the look is the same. Page objects locate it by the `.media-fallback` class, never by tag.
- **D-6** *The mocked studio list gives its first two cards `loading="eager"`, but only the first `fetchpriority="high"`.* Exactly one image per page is eager (`priority`), as ICD-MEDIA-2 and L2-072.1–2 say; every other card lazy-loads.
- **D-7** *Does the directive retry or restore the image?* No. A failed image stays failed until the application renders a new element or, for the component, a new `image` value; retrying a URL that just returned HTTP 404 would only shift the layout again.
