# Episode poster

| Field | Value |
|---|---|
| Selector | `st-video-poster` |
| Library path | `frontend/projects/components/src/lib/video-poster/` |
| Status | planned |
| Traces to | L2-013, L2-020, L2-047, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-086 |
| Design system | [`video-poster.html`](../../design-system/components/video-poster.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/playing`](../../mocks/pages/studio/playing.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/studio/minimal`](../../mocks/pages/studio/minimal.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html) |
| Rendering | [`video-poster.html`](video-poster.html) |

## Purpose and scope

Every review with a companion episode has a "Watch the episode" section: a
16:9 still from the shoot with a solid "Play episode" pill. Nothing from
YouTube loads until the visitor asks for it (L2-047.1). The poster is a real
link to the episode on YouTube, so it works without JavaScript (L2-047.3); with
JavaScript, activating it swaps in a privacy-enhanced `youtube-nocookie.com`
player in the same slot, with no autoplay, and moves focus to it (L2-047.2).
Studios (L2-013) and spots (L2-020) use it identically.

Use [`st-shot-grid`](shot-grid.md) for photos of the location; the poster is
only for a ShotThere episode about the location on the page.

Out of scope:

- Whether the section exists: when a review has no video ID the application
  renders no section, no heading and no poster (L2-013.2, L2-020.1). The
  component has no empty or placeholder state (D-9).
- The "Watch the episode" heading, the `section aria-labelledby`, and the
  `.episode__links` row with the episode line ("Episode 4: The Junction Loft —
  big north light, tiny elevator · 14:32") and the "Watch on YouTube" link
  (`a[st-link][external]`, L2-048.2): the application's.
- Building and trusting URLs: the application builds the watch and embed URLs
  and passes the embed URL as `SafeResourceUrl` (ICD-MEDIA-4); the library never
  builds a URL or calls `bypassSecurityTrust*`.
- Choosing the still: the poster image source and its variants are the
  application's data.

## Usage

Every `.video-poster` and `.video-frame` in `docs/mocks/` (plus grep).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/default`, `in-compare` | The Junction Loft: still `episode-the-junction-loft`, watch URL for `Jx7Lq2pT9aE`, `title` "Episode 4: The Junction Loft — big north light, tiny elevator", `playContext` ": Episode 4, The Junction Loft" | default `playLabel` "Play episode" | poster (default, hover, focus) | canvas, main column |
| `pages/studio/playing` | same | — | playing: `iframe.video-frame` from youtube-nocookie.com, focused | canvas |
| `pages/studio/media-failed` | same; the still fails | fallback title, pill at the bottom | poster failed | inverse slot |
| `pages/spot/default`, `stale-permit` | Evergreen Brick Works: `Ev7Bw3kGh2Q`, `title` "Episode 7: Evergreen Brick Works at golden hour", `playContext` ": Episode 7, Evergreen Brick Works" | default label | poster | canvas |
| `pages/studio/minimal`, `pages/spot/no-video` | Bloordale Sun Studio, Trinity Bellwoods Park: no video ID | — | not rendered | — |

Every row is buildable with the API below.

## Anatomy

1. **Wrapper** — the host `st-video-poster` (`display: block`, no styles), holding either the poster link or the player (D-8).
2. **Poster** — `a.video-poster` with `href` = `watchUrl`: full width, `aspect-ratio: 16 / 9`, `--radius-lg`, overflow hidden, `--color-bg-inverse` ground, no underline.
3. **Still** — [`st-responsive-image`](responsive-image.md) with `decorative` (`alt=""`), `loading="lazy"`, covering the slot (`object-fit: cover`).
4. **Play pill** — `span.video-poster__play`: centred, `--control-height-lg` tall, `--space-6` side padding, `--radius-full`, `--color-action` fill, `--color-fg-on-action` label, `--shadow-3`, never wraps.
5. **Play glyph** — [`st-icon`](icon.md) `play` (the only filled icon), `aria-hidden="true"`.
6. **Play label** — `playLabel` ("Play episode"), then `span.visually-hidden` with `playContext` (": Episode 4, The Junction Loft") when set.
7. **Failed fallback** — `span.media-fallback` with `aria-hidden="true"` as a direct child of the link, replacing the still: image-failed glyph and the episode `title` on `--color-bg-inverse` in `--color-fg-inverse`, text at the top; the pill moves to the bottom (`.video-poster:has(> .media-fallback)`).
8. **Player** — `iframe.video-frame` in the same 16:9 slot, `--radius-lg`, `--color-bg-inverse` ground, replacing the link after activation.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `poster` | `ResponsiveImage \| null` | `null` | no | The still. Always decorative (`alt=""`, the play label names the link). `null`, or a still that fails to load, shows the fallback and keeps the play control usable (L2-086.3, D-2). |
| `watchUrl` | `string` | — | yes | `https://www.youtube.com/watch?v=Jx7Lq2pT9aE`. The poster's `href`, so it works without JavaScript (L2-047.3). |
| `embedUrl` | `SafeResourceUrl` | — | yes | `https://www.youtube-nocookie.com/embed/Jx7Lq2pT9aE`, no autoplay parameter, built and trusted by the application (ICD-MEDIA-4). Bound to the iframe `src` only after activation. |
| `title` | `string` | — | yes | The full episode title: the iframe `title` ("Episode 4: The Junction Loft — big north light, tiny elevator") and the failed-poster text (D-1). |
| `playLabel` | `string` | §12 `st.video.play` ("Play episode") | no | The visible pill label. Override only for a translation. |
| `playContext` | `string \| null` | `null` | no | Visually hidden text after the label (": Episode 7, Evergreen Brick Works"), so the link's name is unique on the page and starts with the visible words. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `played` | `void` | Once, after the iframe has replaced the poster and received focus. Not emitted when a modified click lets the browser follow the link (D-3). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Everything comes from inputs. |

Library strings (ICD-002 §12): `st.video.play` "Play episode", overridable
through `playLabel`.

## Variants and sizes

| Variant | Example | What differs |
|---|---|---|
| Studio episode | The Junction Loft, Episode 4 | Only data: video ID, still, title, context. |
| Spot episode | Evergreen Brick Works, Episode 7 | Same markup. |
| Poster (phase) | on load | `a.video-poster`, no iframe anywhere. |
| Player (phase) | after activation | `iframe.video-frame` in the same slot. |

One size, fluid: poster and player fill the review's main column at 16:9 at
every width (L2-013.3, L2-020.2), so the slot height is known before the still
or the player arrives. The pill is fixed at `--control-height-lg` and does not
scale with the poster.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (poster) | — | Still covers the slot; ink pill centred | Link "Play episode: Episode 4, The Junction Loft" |
| Hover | `:hover` | Pill fill `--color-action-hover`, no transition | — |
| Focus | `:focus-visible` | Shared ring around the whole poster following `--radius-lg` | Focus on the link |
| Active | `:active` | Pill fill `--color-action-active` | — |
| Loading | still not yet loaded | Slot already sized, `--color-bg-inverse` ground, pill visible; no skeleton | As default |
| Poster failed | still `error`, or `poster` null | `.media-fallback` on the inverse ground with glyph and `title` (two lines at most) at the top; pill at the bottom | Link name unchanged; the fallback is `aria-hidden` |
| Playing | activation | `iframe.video-frame` replaces the link; YouTube's own player waits for the visitor to press play; no way back to the poster | Focus on the iframe, named by `title` |
| Without JavaScript | no client script | The poster is a plain link; activation opens YouTube | Link |
| No video | no video ID | Not rendered (application) | — |
| Disabled | never | — | — |

## Markup

```html
<!-- rendered: poster on load (The Junction Loft) -->
<st-video-poster>
  <a class="video-poster" href="https://www.youtube.com/watch?v=Jx7Lq2pT9aE">
    <picture>…<img src="…" srcset="…" sizes="(min-width: 62rem) 45rem, 100vw" alt="" width="1280" height="720" loading="lazy"></picture>
    <span class="video-poster__play"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/></svg>Play episode<span class="visually-hidden">: Episode 4, The Junction Loft</span></span>
  </a>
</st-video-poster>
```

```html
<!-- rendered: poster failed or no still -->
<a class="video-poster" href="https://www.youtube.com/watch?v=Jx7Lq2pT9aE">
  <span class="media-fallback" aria-hidden="true"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/></svg><span>Episode 4: The Junction Loft — big north light, tiny elevator</span></span>
  <span class="video-poster__play">…Play episode<span class="visually-hidden">: Episode 4, The Junction Loft</span></span>
</a>
```

```html
<!-- rendered: playing (focus is on the iframe) -->
<st-video-poster>
  <iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/Jx7Lq2pT9aE"
          title="Episode 4: The Junction Loft — big north light, tiny elevator"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"></iframe>
</st-video-poster>
```

The `<picture>` is `st-responsive-image`'s; its host between the link and the
picture is not part of the contract (ICD-DOM-3). Page objects select the link
by its name, `.video-poster__play`, `.media-fallback` and `iframe.video-frame`.

```html
<!-- consumer: EpisodePlayerComponent (application) -->
<section class="review-section" aria-labelledby="episode">
  <h2 id="episode" i18n>Watch the episode</h2>
  <st-video-poster [poster]="episode().poster" [watchUrl]="watchUrl()" [embedUrl]="embedUrl()"
                   [title]="episode().title" [playContext]="playContext()" />
  <div class="episode__links">
    <p class="text-muted">{{ episode().title }} · {{ episode().runningTime }}</p>
    <a st-link external [href]="watchUrl()" i18n>Watch on YouTube</a>
  </div>
</section>
```

## Design

- Poster: `position: relative`, block, full width, `aspect-ratio: 16 / 9`, no padding or border, `--radius-lg`, overflow hidden, `--color-bg-inverse`, `cursor: pointer`, no text decoration.
- Still: width and height 100 %, `object-fit: cover`.
- Pill: absolutely centred (`left: 50%`, `top: 50%`, `translate: -50% -50%`), inline-flex, gap `--space-2`, `min-height: --control-height-lg`, padding `0 --space-6`, `--radius-full`, `--color-action` / `--color-fg-on-action`, `--text-label` at `--font-size-md`, `--shadow-3`, `white-space: nowrap`. Hover `--color-action-hover`, active `--color-action-active`, no transition.
- Failed: `.media-fallback` on `--color-bg-inverse` in `--color-fg-inverse`, `align-content: start`, `padding-top: --space-6`; its text is clamped to two lines with an ellipsis (D-1); the pill moves to `bottom: --space-4`, `translate: -50% 0`.
- Focus: the shared ring (`--focus-ring-width`, `--color-focus-ring`, `--focus-ring-offset`) with `--radius-lg`.
- Player: block, full width, `aspect-ratio: 16 / 9`, no border, `--radius-lg`, `--color-bg-inverse`.

No component tokens. To re-skin the pill, a wrapper overrides the action
tokens (DS *Theming*).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Slot ground (poster, player, failed) | `--color-bg-inverse` | `--palette-stone-950` | `--palette-stone-50` |
| Failed-poster text | `--color-fg-inverse` | `--palette-white` | `--palette-stone-950` |
| Pill fill | `--color-action` | `--palette-stone-950` | `--palette-stone-100` |
| Pill fill, hover | `--color-action-hover` | `--palette-stone-800` | `--palette-white` |
| Pill fill, pressed | `--color-action-active` | `--palette-stone-700` | `--palette-stone-200` |
| Pill label and glyph | `--color-fg-on-action` | `--palette-white` | `--palette-stone-950` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-on-action` | `--color-action` | 4.5:1 | Play label |
| `--color-fg-on-action` | `--color-action-hover` | 4.5:1 | Play label, hover |
| `--color-fg-on-action` | `--color-action-active` | 4.5:1 | Play label, pressed |
| `--color-fg-inverse` | `--color-bg-inverse` | 4.5:1 | Failed-poster text |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring around the poster |

The pill sits on a photo, which no token can guarantee; its solid fill carries
the label's contrast and `--shadow-3` separates it from light and dark stills.
Forced colours: the pill keeps its text and glyph in `ButtonText`; the focus
ring becomes the system highlight.

## Responsive behaviour

- Poster and player are always the full width of the review's main column at
  16:9; from LG the column sits beside the summary panel. No full-bleed video.
- The pill never wraps; "Play episode" with its glyph (about 170 px) fits the
  288 px poster of a 320 px phone.
- The whole poster is the target: 288 × 162 px at 320 px, far above 44 × 44.
- The still's `sizes` is `(min-width: 62rem) 45rem, 100vw` (D-6).
- At 320 px nothing scrolls horizontally; at 200 % zoom the poster scales with
  the column and stays operable.

## Accessibility

### Role and pattern

The poster is a native link (APG Link), which is what makes it work without
JavaScript. With JavaScript an unmodified activation is intercepted:
navigation is prevented and the iframe is inserted. The player is a native
`<iframe>` named by `title`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves to the poster, then on to the application's "Watch on YouTube". |
| <kbd>Enter</kbd> | On the poster: swaps in the player and moves focus to it. Without JavaScript: opens the episode on YouTube. |
| Inside the player | YouTube's own keys. <kbd>Tab</kbd> leaves the iframe; there is no trap. |

### Focus

The ring draws around the whole poster. After activation focus moves to the
iframe, so a keyboard or screen-reader user lands in the player rather than on
`<body>` where the poster was.

### Labelling

- The link's name is `playLabel` + `playContext`: "Play episode: Episode 4, The
  Junction Loft", unique on the page and starting with the visible words
  (2.5.3 Label in Name).
- The still is `alt=""`; the failed fallback is `aria-hidden="true"` because the
  link's name already carries the episode.
- The iframe's `title` is the full episode title.

### Announcements

None. The focus move to the player is the feedback.

### Motion

Nothing moves: the hover fill changes without a transition and the player
never autoplays (L2-047.2).

## Content and internationalisation

- Control: "Play episode", exactly (L2-047.1); never "Watch now" or a bare "Play".
- Hidden context: ": Episode 4, The Junction Loft" (episode number and location only).
- iframe title: the full episode title as published.
- Failed poster: the episode title, no error wording.
- Translatable: `playLabel` (library string `st.video.play`), `playContext` and
  `title` (application). The pill grows with a longer translation and never
  wraps; a translation too long for 288 px is shortened in the catalogue.

## Performance

- Change detection: `OnPush`, signal inputs; one `playing` signal and one
  `failed` signal switch the template.
- No YouTube iframe, script, request or cookie before activation; the still is
  lazy-loaded and never `priority` (it sits below the fold on every review).
- Performance scenario: the `components-harness` route `video-poster/performance`
  renders The Junction Loft's and Evergreen Brick Works' posters and activates
  the first, within the L2-071 budgets.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the 16:9 slot is reserved before the still loads and the
  player takes the exact slot, so neither loading nor activation shifts the page.
- Weight: imports `@angular/core`, `@angular/platform-browser` (`SafeResourceUrl`
  type only), `st-responsive-image` and `st-icon`; no video library (ICD-DEP-2).

## Acceptance criteria

### Rendering

- **AC-1** Given The Junction Loft's episode inputs, when the page first loads, then `a.video-poster` has `href="https://www.youtube.com/watch?v=Jx7Lq2pT9aE"`, contains the still with `alt=""` and `loading="lazy"` and a `.video-poster__play` with the play glyph and "Play episode", and the document contains no `iframe`. (L2-047)
- **AC-2** Given that page, when it has loaded and before any activation, then the network log contains no request to `youtube.com`, `youtube-nocookie.com` or `ytimg.com`. (L2-047)
- **AC-3** Given the poster, when the visitor clicks it or presses Enter on it, then the page does not navigate, the link is replaced by `iframe.video-frame` with `src` on the `youtube-nocookie.com` origin for `Jx7Lq2pT9aE`, `title` "Episode 4: The Junction Loft — big north light, tiny elevator", `allowfullscreen`, and no `autoplay` parameter. (L2-047)
- **AC-4** Given the page loaded with JavaScript disabled, when the visitor activates the poster, then the browser follows the link to `https://www.youtube.com/watch?v=Jx7Lq2pT9aE`. (L2-047)
- **AC-5** Given The Junction Loft's section "Watch the episode", when the poster has been activated, then the section contains the embedded player for that video, filling the poster's 16:9 slot. (L2-013)
- **AC-6** Given Evergreen Brick Works' episode 7, when its poster and then its player render, then both are 16:9 boxes filling the main column. (L2-020)
- **AC-7** Given the harness route for a review without a video ID (Trinity Bellwoods Park), when it renders, then no `.video-poster`, `.video-frame` or placeholder exists, because the component has no empty state and the application leaves it out. (L2-020)

### States

- **AC-8** Given The Junction Loft's still returns HTTP 404, when the page renders, then the still is replaced by a `.media-fallback` with `aria-hidden="true"` showing "Episode 4: The Junction Loft — big north light, tiny elevator" in at most two lines that never run under the pill (at 320 px too), the pill sits at the bottom of the slot, the slot keeps its size, and activating "Play episode" still inserts the player. (L2-086)
- **AC-9** Given `poster` is `null`, when the component renders, then it shows the same fallback and a working "Play episode" link. (L2-086)

### Keyboard and focus

- **AC-10** Given focus on the poster, when the visitor presses Enter, then focus moves to the inserted iframe and `played` emits once. (L2-067)
- **AC-11** Given a keyboard user tabs to the poster, when it is focused, then a focus ring of `--focus-ring-width` (2 px) in `--color-focus-ring` surrounds the whole poster with at least 3:1 contrast against `--color-bg-canvas`. (L2-067)

### Screen readers

- **AC-12** Given The Junction Loft's poster with `playContext` ": Episode 4, The Junction Loft", when the accessibility tree is read, then the link's name is "Play episode: Episode 4, The Junction Loft", the still and glyph add nothing, and axe-core reports no violations for the poster and the player in either theme. (L2-069)
- **AC-13** Given no `playLabel` input, when the poster renders, then the label comes from the library string `st.video.play` ("Play episode"), and with `playLabel` set it shows that text instead. (L2-070)

### Theming

- **AC-14** Given the poster and the failed poster in the light and the dark theme, when the contrast check runs, then the play label is at least 4.5:1 against `--color-action`, `--color-action-hover` and `--color-action-active`, and the fallback text at least 4.5:1 against `--color-bg-inverse`. (L2-068)
- **AC-15** Given the poster, when it is inspected, then the still has `alt=""` because the link's name already says what it is. (L2-068)

### Responsive

- **AC-16** Given The Junction Loft's poster at 320 px wide, when it renders, then it is 16:9 across the content width, the pill fits on one line inside it, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-17** Given the poster at 320 px wide, when its target is measured, then the link is at least 44 × 44 CSS px (it is the whole 16:9 poster). (L2-065)
- **AC-18** Given The Junction Loft's page at 200 % zoom in a 1280 px viewport, when the visitor reaches the episode, then the poster is visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the pill's hover
fill changes without a transition and the player never autoplays, so
`prefers-reduced-motion` changes nothing
([video-poster.html](../../design-system/components/video-poster.html), Accessibility › Motion).

### Performance

- **AC-19** Given the `video-poster/performance` harness route, when it is measured with Lighthouse in mobile mode, then Cumulative Layout Shift is at most 0.1 including the activation, and activating the poster has an interaction-to-next-paint of at most 200 ms. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/video-poster/`:
  `video-poster.component.ts` (`VideoPosterComponent`, selector
  `st-video-poster`), `.html`, `.css` (port of `.video-poster*` and
  `.video-frame`; the still's `st-responsive-image` host is made to fill the
  slot, `display: block; width: 100%; height: 100%`).
- State: `playing = signal(false)`, `failed = signal(false)`. Template:
  `@if (playing()) { <iframe class="video-frame" #frame [src]="embedUrl()" [title]="title()" … /> }`
  `@else { <a class="video-poster" [href]="watchUrl()" (click)="activate($event)" (error.capture)…> … </a> }`.
- `activate(event: MouseEvent)`: return without action when `event.button !== 0`
  or any of `ctrlKey`, `metaKey`, `shiftKey`, `altKey` is set; otherwise
  `preventDefault()`, set `playing`, then in `afterNextRender` focus the iframe
  and emit `played`.
- Failure: a capture-phase `error` listener on the link sets `failed` (the
  image's `error` event does not bubble, but it does pass the capture phase);
  an `afterNextRender` check also sets it when the server-rendered still had
  already failed before hydration (`img.complete && img.naturalWidth === 0`).
  `poster() === null || failed()` renders the fallback instead of
  `st-responsive-image`.
- The image-failed glyph is the same library-internal drawing
  `st-responsive-image` uses for its fallback; `IconName` is unchanged.
- Composes [`st-responsive-image`](responsive-image.md) (`decorative`) and
  [`st-icon`](icon.md) (`play`).
- Mock drift the component corrects: the studio mocks point the poster at
  `playing.html` (the product uses the watch URL); the mocks' stills are
  1200 × 800 and the product passes the still's real dimensions; the mocks'
  `allow="accelerated-sensor; …"` is not a permission name (D-4).
- No ICD change.

## Decisions

- **D-1** *The DS shows the short title ("Episode 4: The Junction Loft") on a failed poster, but ICD-002 has no short-title input.* The fallback shows `title`, the full episode title, clamped to two lines with an ellipsis. Every episode title starts with "Episode n: Location", so the clamped text still names the episode; at 288 px a third line would run under the bottom-docked pill, which the rendering showed. No API change is needed; the DS page catches up.
- **D-2** *How does the poster detect a failed still when `st-responsive-image` draws its own text-free fallback for decorative images?* The poster listens for the image's `error` in the capture phase (plus a post-hydration check) and, when it fails or `poster` is `null`, removes `st-responsive-image` and renders its own `.media-fallback` as a direct child of the link, so `.video-poster:has(> .media-fallback)` moves the pill and the title shows.
- **D-3** *Does every click start the player?* Only an unmodified primary-button click or Enter. Ctrl, Cmd, Shift, Alt or middle clicks fall through to the link, so "open in a new tab" keeps working; the poster then stays a poster and `played` is not emitted.
- **D-4** *Which iframe attributes?* `allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"`, `allowfullscreen` and `referrerpolicy="strict-origin-when-cross-origin"`, and no `autoplay` permission. The mocks' "accelerated-sensor" is not a real permission, YouTube's embed needs the referrer, and leaving out `autoplay` keeps the player waiting for the visitor (L2-047.2).
- **D-5** *Can the visitor get back to the poster?* No, as the DS says: once playing, the component stays a player for its lifetime, and `played` emits once.
- **D-6** *Which `sizes` does the still use?* `(min-width: 62rem) 45rem, 100vw`: the main column is the full width below LG and at most about 45rem beside the summary panel (1280 px container, `--layout-panel-width` 22rem). ICD-002 gives the poster no `sizes` input, so the component fixes it.
- **D-7** *Is the still ever `priority`?* No. The episode section is near the end of every review; the hero photo is the page's priority image.
- **D-8** *What is the host?* A plain `display: block` wrapper, because it holds the link or the iframe in turn and neither can be the host.
- **D-9** *What if there is no video?* The application does not render the component (L2-013.2, L2-020.1). Every URL and the title are required inputs, so the component has no empty, placeholder or "coming soon" state.
