# Review layout

| Field | Value |
|---|---|
| Selector | `st-summary-panel`; application layout classes `.review-layout`, `.review-main`, `.review-head`, `.review-head__meta`, `.review-hero`, `.review-section`, `.light-grid`, `.light-grid__item`, `.light-grid__time`, `.regions` |
| Library path | `frontend/projects/components/src/lib/summary-panel/` (library); `frontend/projects/shot-there/src/app/features/studios/` and `frontend/projects/shot-there/src/app/features/spots/` (application: `StudioPageComponent`, `SpotPageComponent` and their section components) |
| Status | planned |
| Traces to | L2-003, L2-006, L2-009, L2-011, L2-013, L2-019, L2-020, L2-030, L2-036, L2-038, L2-043, L2-064, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072, L2-086 |
| Design system | [`review-layout.html`](../../design-system/components/review-layout.html), [`description-list.html`](../../design-system/components/description-list.html) (summary row, regions) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/studio/minimal`](../../mocks/pages/studio/minimal.html), [`pages/studio/playing`](../../mocks/pages/studio/playing.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html), [`pages/spot/no-rain-backup`](../../mocks/pages/spot/no-rain-backup.html), [`pages/spot/map-failed`](../../mocks/pages/spot/map-failed.html), [`pages/guide/default`](../../mocks/pages/guide/default.html), [`dialogs/lightbox/default`](../../mocks/dialogs/lightbox/default.html) |
| Rendering | [`review-layout.html`](review-layout.html) |

## Purpose and scope

The review layout is the page skeleton every studio and spot review shares: a
head with the name and two or three basic facts, one hero photo, the review
sections in a fixed order, and a summary panel with the two facts a reader
decides on and the one action that leaves ShotThere ("Book on the studio's
site", "Open in Google Maps"). Because every review uses the same skeleton, two
locations read the same way and compare side by side.

It has two owners (ICD-002 §11.2). The **summary panel** is the library
component `st-summary-panel`. The **layout** (`.review-layout`, `.review-main`,
`.review-head*`, `.review-hero`, `.review-section`, `.light-grid*`, `.regions`)
is application feature CSS, written by `StudioPageComponent` and
`SpotPageComponent` and their section components; the guide page reuses
`.review-head` on its own. Both parts are specified here because they are
built and tested together.

Use [`container`](container.md) utilities and `st-page-header` for every other
page, [`editor-layout`](editor-layout.md) for the admin editors, the comparison
table for comparing, and [`description-list`](description-list.md) for the
key–value rows inside the sections.

Out of scope:

- The content of each section: the price block ([`price-block`](price-block.md)),
  score list and overall ([`score`](score.md)), light rating, shot grid and
  lightbox ([`shot-grid`](shot-grid.md)), episode poster
  ([`video-poster`](video-poster.md)), map ([`map`](map.md)), permit and light
  tables ([`table`](table.md)), tags ([`tag`](tag.md)), disclosure
  ([`disclosure`](disclosure.md)), rain-backup list ([`list`](list.md)) and its
  empty state ([`empty-state`](empty-state.md)).
- The breadcrumb above the head ([`breadcrumb`](breadcrumb.md)) and the compare
  bar ([`compare-bar`](compare-bar.md)).
- Staleness, the all-in cost, the overall score and the compare selection: the
  server and application logic decide them; the layout and the panel only show
  them.
- The buttons in the panel ([`button`](button.md)) and the badge
  ([`badge`](badge.md)).

## Usage

Every `.summary-panel` and `.review-*` use in `docs/mocks/`.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/default`, `media-failed`, `playing` | Panel facts "All-in, 2 hours" "$145.00", "Overall" "3.8" + " out of 5" | Primary `a[st-button]` "Book on the studio's site" (external); toggle "Add to compare"; caption "ShotThere doesn't take bookings or payments. Prices verified 22 Sep 2026." | default | canvas |
| `pages/studio/minimal` | Facts "$130.00", "4.0" (Bloordale Sun Studio) | as default | default | canvas |
| `pages/studio/stale` | Facts "$270.00", "3.8" (Ossington Blackbox) | `<p>` with warning badge "Prices may be out of date", then Book, toggle, caption "… Prices verified 2 Mar 2026." | stale | canvas |
| `pages/studio/in-compare` | as default | Book drawn **secondary**; toggle pressed "Remove from compare" | in compare | canvas |
| `pages/spot/default`, `no-video`, `no-rain-backup`, `map-failed` | Facts "Portrait permit" "Not required", "Best light" "Golden hour" | "Best for" caption + tags "Engagement", "Family", "Portrait", "Brand"; primary "Open in Google Maps" (external); caption "Permit rules verified 1 Sep 2026. Check the source before a paid shoot." | default | canvas |
| `pages/spot/stale-permit` | Facts "Required", "Golden hour" (Distillery District) | Warning badge "Permit rules may be out of date", tags, Open in Google Maps, caption "Permit rules verified 20 Mar 2026. …" | stale | canvas |
| `pages/studio/*` layout | Head (name, neighbourhood, cross streets with floor, "Reviewed `<time>`"), hero 3:2 / 16:7, sections Pricing → Measured specifications (with `.light-grid`) → Gear → Logistics → Standard test shots → From a real shoot → Verdict (with `.regions`) → Watch the episode → Featured in | — | default; stale (alert in Pricing); minimal (no episode, no Featured in); media failed (hero fallback); playing (player in place); in compare (`.has-compare-bar`) | canvas |
| `pages/spot/*` layout | Head (neighbourhood, type), hero, sections Location and map → How to get there → Best light → Sample shots → Practical conditions → Permits → Best uses → Watch the episode → Rain backup | — | default; stale permit; no video (no episode); no rain backup (empty state); map failed | canvas |
| `pages/guide/default` | `.review-head` alone: "Best studios under $120 for 2 hours", meta "3 studios", "Updated `<time>`3 October 2026`</time>`" | — | default | canvas |
| `dialogs/lightbox/default` | Studio review behind the viewer | — | — | canvas |

Every panel row is buildable: `label` and `facts` are inputs (each `Fact`
carries `term`, `detail`, optional `srSuffix` and `badge`), and the badge
paragraph, tag group, buttons and caption are projected in the default slot in
the order the consumer writes them. Every layout row is application markup with
the classes above.

## Anatomy

`st-summary-panel` (library):

1. **Panel** — `aside.summary-panel` named by `aria-label`, flex column,
   `--space-5` between parts, `--space-6` padding, hairline
   `--color-border-default` outline, `--radius-lg`, no fill.
2. **Facts** — `dl.summary-panel__row`, two equal columns; each fact is a
   `div` holding `dt` (label, `--text-label`, `--color-fg-subtle`) and `dd`
   (value, `--text-h3`, tabular figures).
3. **Hidden suffix (optional)** — `span.visually-hidden` after the value
   (" out of 5").
4. **Qualifier badge (optional)** — `st-badge` after the value when a fact has
   `badge`.
5. **Projected parts** — in source order: stale badge paragraph, best-for tag
   group, the one action, the compare toggle, the caption. Each fills the panel
   width (flex column stretch).

Host: the block must be a native `<aside>`, so the component renders it and the
host `st-summary-panel` adds no box (`display: contents`, ICD-DOM-1). The
`aside` is therefore the grid item of `.review-layout`.

Layout (application):

1. **Review head** — `div.review-head`: the `h1` name (`--text-display`,
   `--letter-spacing-tight`, wraps anywhere) and `ul.review-head__meta`, a
   wrapping list of facts in `--text-body-lg`, `--color-fg-muted`, separated by
   generated "·" with empty alternative text.
2. **Hero** — `div.review-hero`: one `st-responsive-image` with `priority`,
   3:2 then 16:7 from 48rem, `--radius-lg`, `--color-bg-photo` behind.
3. **Two-column grid** — `div.review-layout`: the summary panel first in the
   source, then `div.review-main` (D-1).
4. **Sections** — `section.review-section[aria-labelledby]` in `.review-main`,
   each opened by an `h2` (or a `.section-head` holding the `h2` and a count),
   `--space-16` apart.
5. **Light grid** — `ul.light-grid` of `li.light-grid__item` (sunken well,
   `--radius-md`) holding `span.light-grid__time` and an `st-light-rating`.
6. **Regions** — `dl.regions` of two `div` pairs ("Who it's for", "Who should
   skip it").

## API

### `st-summary-panel`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | `aria-label` of the `aside` ("Summary"). Product copy. |
| `facts` | `readonly Fact[]` | — | yes | One `div > dt + dd` per fact in `.summary-panel__row`, in order, tracked by `$index`. `detail` is the visible value; `srSuffix` follows it in `.visually-hidden`; `badge` renders `<st-badge>` (neutral) after the value; `numeric` adds nothing here because every summary value already uses tabular figures (D-4). |

The DS rule "exactly two facts" is the application's to keep; the component
renders what it is given (ICD-API-10).

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The panel's actions are the consumer's buttons and links. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | In this order when present: `<p><st-badge tone="warning">…</st-badge></p>`; a `div` with `<p class="text-caption">` and `st-tag-list`; one `a[st-button]` (primary, or secondary while the studio is in the comparison); one compare toggle `button[st-button]` with `pressed`; one `<p class="text-caption">` | Projected after the facts. Each direct child stretches to the panel width. |

Library strings: none.

### Application layout

The application writes this markup (no component wraps it, D-2):

| Class | Element | Rule |
|---|---|---|
| `.review-head` | `div` | Flex column, `--space-3` gap, `--space-8` above. Holds the page's only `h1`. |
| `.review-head__meta` | `ul` | Wrapping row, `--space-1` × `--space-3` gaps, no bullets; `li:not(:last-child)::after { content: "·" / "" }` in `--color-fg-subtle`. Dates in `<time datetime>`. |
| `.review-hero` | `div` | `aspect-ratio: 3 / 2`, `16 / 7` from 48rem; `--radius-lg`; `overflow: hidden`; `--color-bg-photo`; `--space-6` above; `display: grid` so the image host fills it. |
| `.review-layout` | `div` | One column, `gap: --space-10`, `margin-top: --space-8` below 62rem; from 62rem `grid-template-columns: minmax(0, 1fr) --layout-panel-width`, `gap: --space-16`, no top margin. |
| `.review-main` | `div` | `min-width: 0`; from 62rem `order: -1`, so it takes the first column (D-1). |
| `.review-section` | `section` | `margin-top: --space-16`; `scroll-margin-top: --space-8`; its `h2` or `.section-head` has `--space-6` below; an `h3` inside has `--space-8` above and `--space-3` below. Below 62rem the first section has `--space-4` above. |
| `.light-grid` | `ul` | One column, `gap: --space-3`; four equal columns from 48rem. |
| `.light-grid__item` / `.light-grid__time` | `li` / `span` | Sunken well (`--color-bg-surface-sunken`, `--radius-md`, `--space-4` padding, `--space-2` gap); time in `--text-label`, `--color-fg-subtle`. |
| `.regions` | `dl` | One column, `gap: --space-6`; two equal columns from 48rem; each pair in a `div`; `dt` `--text-label` `--color-fg-subtle`; `dd` `--text-body-lg`, `--space-1` above. |

Spacing between blocks inside a section (score list, regions, disclosure, the
rain-backup lead) comes from a wrapping `.stack` or `.stack--lg` (D-3), never
from inline margins.

## Variants and sizes

| Variant | Panel | Sections |
|---|---|---|
| Studio review | Facts "All-in, 2 hours", "Overall" (+ " out of 5"); Book; compare toggle; "ShotThere doesn't take bookings or payments. Prices verified …" | Pricing, Measured specifications, Gear, Logistics, Standard test shots, From a real shoot, Verdict, Watch the episode (only with a video ID), Featured in (only when in a guide) |
| Spot review | Facts "Portrait permit", "Best light"; "Best for" tags; Open in Google Maps; "Permit rules verified … Check the source before a paid shoot." No compare toggle. | Location and map, How to get there, Best light, Sample shots, Practical conditions, Permits, Best uses, Watch the episode (only with a video ID), Rain backup (always) |
| Head only | — | Guide page: `.review-head` with "3 studios · Updated 3 October 2026", no hero, columns or panel |

One size. The page sits in `.container`; from 62rem the panel is
`--layout-panel-width` (22rem) and the main column takes the rest. Below 62rem
everything is full width.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Head, hero, panel, sections | One `h1`; sections listed as regions; panel is a complementary landmark "Summary" |
| Action hover / focus / active | On the projected buttons | Button states ([`button`](button.md)) | — |
| Disabled | Never | The action always works: a studio cannot be published without a booking link or a spot without coordinates (L2-002); the toggle stays enabled at the four-studio limit and explains it in a toast | — |
| Stale | `priceStale` / `permitStale` from the API | Warning badge paragraph in the panel above the action; warning alert inside Pricing or Permits (owned by those sections) | Badge read in place; the section's alert is the status region |
| In compare | Studio in the selection | Book becomes secondary; toggle pressed "Remove from compare"; `body.has-compare-bar` pads the page end | "Remove from compare, toggle button, pressed" |
| Hero failed | Image error | `.media-fallback` with the alt text in the same 3:2 / 16:7 slot | Alt text read |
| Minimal | No video, no guides | "Watch the episode" and "Featured in" are absent, not empty; rows with "None" or "No" still render | Outline skips nothing |
| Playing | Visitor played the episode | The player replaces the poster in the same 16:9 slot | Focus moves to the player ([`video-poster`](video-poster.md)) |
| No video (spot) | No video ID | No "Watch the episode" section, no placeholder | — |
| No rain backup | No published studios | "Rain backup" stays and holds a compact empty state "Studio reviews are coming" with "Browse studios" | — |
| Map failed | Tiles unreachable | The map slot keeps its size and shows coordinates and Google Maps; nothing else moves | Status message in the map ([`map`](map.md)) |
| Below 62rem | Viewport | One column: head, hero, panel, sections | Panel reached right after the hero |
| From 62rem | Viewport | Main column and a sticky 22rem panel on the right | Panel still first in the tab order (D-1) |

## Markup

```html
<!-- rendered: st-summary-panel, studio default -->
<st-summary-panel>
  <aside class="summary-panel" aria-label="Summary">
    <dl class="summary-panel__row">
      <div><dt>All-in, 2 hours</dt><dd>$145.00</dd></div>
      <div><dt>Overall</dt><dd>3.8<span class="visually-hidden"> out of 5</span></dd></div>
    </dl>
    <a class="btn btn--primary" href="https://thejunctionloft.example/book" target="_blank" rel="noopener">Book on the studio's site<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg><span class="visually-hidden"> (opens in a new tab)</span></a>
    <button class="btn compare-toggle" type="button" aria-pressed="false">Add to compare</button>
    <p class="text-caption">ShotThere doesn't take bookings or payments. Prices verified 22 Sep 2026.</p>
  </aside>
</st-summary-panel>
```

```html
<!-- rendered: spot, stale permit -->
<aside class="summary-panel" aria-label="Summary">
  <dl class="summary-panel__row">
    <div><dt>Portrait permit</dt><dd>Required</dd></div>
    <div><dt>Best light</dt><dd>Golden hour</dd></div>
  </dl>
  <p><span class="badge badge--warning">Permit rules may be out of date</span></p>
  <div><p class="text-caption">Best for</p><ul class="tags">…</ul></div>
  <a class="btn btn--primary" href="https://www.google.com/maps/search/?api=1&amp;query=43.6503,-79.3596" target="_blank" rel="noopener">Open in Google Maps…</a>
  <p class="text-caption">Permit rules verified 20 Mar 2026. Check the source before a paid shoot.</p>
</aside>
```

```html
<!-- consumer: studio page -->
<st-summary-panel i18n-label label="Summary" [facts]="vm().summaryFacts">
  @if (vm().priceStale) {
    <p><st-badge tone="warning" i18n>Prices may be out of date</st-badge></p>
  }
  <a st-button [variant]="inCompare() ? 'secondary' : 'primary'" [href]="vm().bookingUrl" target="_blank" rel="noopener">
    <ng-container i18n>Book on the studio's site</ng-container><st-icon name="external" />
    <span class="visually-hidden" i18n> (opens in a new tab)</span>
  </a>
  <button st-button type="button" [pressed]="inCompare()" (click)="toggleCompare()">
    @if (inCompare()) { <ng-container i18n>Remove from compare</ng-container> } @else { <ng-container i18n>Add to compare</ng-container> }
  </button>
  <p class="text-caption">{{ vm().summaryCaption }}</p>
</st-summary-panel>
```

```html
<!-- application: the layout (studio) -->
<main id="main" class="container" tabindex="-1">
  <st-breadcrumb … />
  <div class="review-head">
    <h1>The Junction Loft</h1>
    <ul class="review-head__meta">
      <li>Junction</li>
      <li>Dundas St W at Pacific Ave, 2nd floor</li>
      <li>Reviewed <time datetime="2026-09-29">29 September 2026</time></li>
    </ul>
  </div>
  <div class="review-hero"><st-responsive-image [image]="vm().hero" sizes="(min-width: 90rem) 1280px, 100vw" priority /></div>
  <div class="review-layout">
    <st-summary-panel …>…</st-summary-panel>
    <div class="review-main">
      <section class="review-section" aria-labelledby="pricing"><h2 id="pricing">Pricing</h2>…</section>
      <section class="review-section" aria-labelledby="specs">
        <h2 id="specs">Measured specifications</h2>
        <st-description-list [items]="vm().specs" />
        <h3>Natural light by time of day</h3>
        <ul class="light-grid">
          <li class="light-grid__item"><span class="light-grid__time">Morning</span><st-light-rating level="medium" text="Medium" /></li>
          …
        </ul>
      </section>
      …
      <section class="review-section" aria-labelledby="verdict">
        <h2 id="verdict">Verdict</h2>
        <div class="stack stack--lg">
          <div class="stack"><st-score-overall … /><st-score-list … /></div>
          <dl class="regions">
            <div><dt>Who it's for</dt><dd>Portrait and fashion shooters who want big north light and a usable cyc on a mid-range budget.</dd></div>
            <div><dt>Who should skip it</dt><dd>Video crews, because of the streetcar, and anyone hauling heavy cases: the freight elevator is tiny.</dd></div>
          </dl>
          <st-disclosure … />
        </div>
      </section>
      @if (vm().episode) { <section class="review-section" aria-labelledby="episode">…</section> }
      @if (vm().guides.length) { <section class="review-section" aria-labelledby="featured">…</section> }
    </div>
  </div>
</main>
```

The section ids (`pricing`, `specs`, `gear`, `logistics`, `test-shots`,
`gallery`, `verdict`, `episode`, `featured`; `location`, `directions`, `light`,
`samples`, `conditions`, `permits`, `uses`, `rain`) are stable fragment
targets. The summary panel's `aside` comes **before** `.review-main` in the
source (D-1); the mocks place it after.

## Design

- Summary panel: `display: flex; flex-direction: column; gap: --space-5;
  padding: --space-6; border: --border-width-hairline solid
  --color-border-default; border-radius: --radius-lg`; no background, no shadow.
  From 62rem `position: sticky; top: --space-8; align-self: start;
  margin-top: --space-16` (lines up with the first section).
- Summary facts: `grid-template-columns: repeat(2, minmax(0, 1fr)); gap:
  --space-4`; `dt` `--text-label` in `--color-fg-subtle`; `dd` `--text-h3`,
  `font-variant-numeric: tabular-nums`, `--space-0-5` above.
- Head: `--text-display` name; `--space-8` above, `--space-3` to the meta line.
- Hero: `--radius-lg`, `--color-bg-photo`; 3:2, 16:7 from 48rem.
- Columns: `--space-10` gap below 62rem, `--space-16` from 62rem;
  `--layout-panel-width` panel.
- Sections: `--space-16` apart, `--space-6` under the heading, `--space-8`
  above an `h3`, `scroll-margin-top: --space-8`.
- Light grid well `--color-bg-surface-sunken`, `--radius-md`, `--space-4`
  padding.
- No component tokens; no motion of its own.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Page | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Name, values | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Meta line, captions | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Separators, summary labels, light-grid times, region terms | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Panel outline | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Hero placeholder | `--color-bg-photo` | `--palette-stone-100` | `--palette-stone-800` |
| Light-grid well | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Stale badge | `--color-warning-fg` on `--color-warning-bg` | `--palette-mango-700` on `--palette-mango-50` | `--palette-mango-300` on `--palette-mango-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Name, summary values, region text |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Meta line, captions |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Summary labels, region terms |
| `--color-fg-subtle` | `--color-bg-surface-sunken` | 4.5:1 | Light-grid times |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Stale badge |
| `--color-fg-muted` | `--color-bg-photo` | 4.5:1 | Hero alt-text fallback |

The panel's hairline is decorative: it groups, and every control inside has its
own 3:1 edge. Forced colours: the outline becomes `CanvasText`; nothing else
depends on colour.

## Responsive behaviour

| Breakpoint | Columns | Summary panel | Hero |
|---|---|---|---|
| XS, below 36rem | One, gap `--space-10` | Straight after the hero, `--space-8` below it; buttons full width | 3:2 |
| SM, 36rem | One | As XS | 3:2 |
| MD, 48rem | One | As XS | 16:7 |
| LG, 62rem | `minmax(0, 1fr)` and 22rem, gap `--space-16` | Right column, sticky `--space-8` from the top, `--space-16` down | 16:7 |
| XL, 75rem | As LG; the container stops at `--layout-container-max` | As LG | 16:7 |

- The head and hero sit above the two columns at every width.
- `.review-main` is `min-width: 0`, so wide content (tables, the light grid)
  wraps or scrolls in its own wrapper and never widens the page at 320 px.
- Long names and addresses wrap anywhere ("Leslieville Daylight Studio",
  "Ossington Ave at Dundas St W, ground floor"); the meta list wraps between
  items.
- The light grid is one column below 48rem and four from 48rem (L2-006.4); the
  regions are one column below 48rem and two from 48rem.
- At 320 px nothing scrolls horizontally; at 200 % zoom on a 1280 px window the
  one-column layout takes over and everything stays available. The panel's
  buttons are 44 px tall (`--control-height-md`).

## Accessibility

### Role and pattern

Native landmarks and headings, no ARIA widget ([APG Landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)):
`main`, the breadcrumb `nav`, the name as the only `h1` (L2-003.1), each section
a `section aria-labelledby` named by its `h2`, and the panel an `aside`
(complementary landmark) named "Summary". The meta line is a `ul`; its
separators are generated content with empty alternative text.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skip link, header, breadcrumb, then the panel's action and compare toggle, then each section's links and controls in reading order, then the footer. |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | The same, backwards. |
| <kbd>Enter</kbd> | On "Book on the studio's site" or "Open in Google Maps": opens the page in a new tab. |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | On the compare toggle: adds or removes the studio. |

### Focus

Nothing moves focus on load. The sticky panel has its own column from 62rem, so
it never covers a focused element (WCAG 2.4.11); `.has-compare-bar` keeps the
fixed bar off the last section. Because the panel is first in the source, the
reading and focus order match the visual order below 62rem (WCAG 1.3.2, 2.4.3;
D-1).

### Labelling

- The `aside` is named by `label` ("Summary"); each `section` by its heading.
- Scores carry the scale in hidden text: "3.8 out of 5".
- External actions end in visually hidden "(opens in a new tab)"; the arrow icon
  is `aria-hidden`.
- The hero has real alt text describing the space; the review date is a
  `<time datetime>`.

### Announcements

None. The stale warning's status region is the price block's or permit
section's alert; the compare count is the compare bar's.

### Motion

None of its own. Sticky positioning is not animation. In-page links scroll
smoothly, and `prefers-reduced-motion: reduce` turns that off. A design-system
rule with no acceptance criterion (L2 has no motion requirement).

## Content and internationalisation

- Head: the name exactly as the location writes it, then two or three facts.
  Studio: neighbourhood · cross streets with the floor · "Reviewed 29 September
  2026". Spot: neighbourhood · type ("Don Valley · Park"). Guide: "3 studios ·
  Updated 3 October 2026". Long dates in the head.
- Section titles are fixed and sentence case, as listed under *Variants*.
- Summary facts: two. Studio "All-in, 2 hours" and "Overall"; spot "Portrait
  permit" and "Best light".
- Summary action names where it goes: "Book on the studio's site", "Open in
  Google Maps". Never "Book now".
- Summary caption: what ShotThere doesn't do, then when the data was checked,
  in the short date form: "ShotThere doesn't take bookings or payments. Prices
  verified 22 Sep 2026."
- Money, scores and dates are formatted by the application for `en-CA`
  ("$145.00", "3.8", "22 Sep 2026"). Translatable: `label`, every `Fact.term`,
  `srSuffix`, `badge`, the projected copy. Data: names, addresses, values.
- Longer translations wrap; nothing truncates.

## Performance

- Change detection: `OnPush`; `facts` rendered with `@for … track $index`; no
  template work.
- Performance scenario: the `components-harness` route
  `review-layout/performance` renders The Junction Loft's head, hero (with
  `priority`), two-column layout and summary panel ($145.00, 3.8 out of 5, Book,
  Add to compare, caption), with the panel's toggle pressed and released; held
  to the L2-071 budgets.
- Regression rule: a change to the panel's template, inputs or styles, or to
  the layout CSS, is measured on that route against the base branch before it
  is pushed.
- Layout stability: the hero reserves its aspect ratio before the image loads;
  the panel's height does not depend on late data; a failed hero keeps its slot.
- Weight: the panel imports `@angular/core` and `st-badge` only.

## Acceptance criteria

### Summary panel

- **AC-1** Given `<st-summary-panel label="Summary">` with the facts "All-in, 2 hours" / "$145.00" and "Overall" / "3.8", when it renders, then it is one `aside.summary-panel` named "Summary" holding `dl.summary-panel__row` with two `div` pairs in that order, and the host adds no box of its own. (L2-069)
- **AC-2** Given the fact "Overall" / "3.8" with `srSuffix` " out of 5", when a screen reader reads the panel, then it hears "Overall 3.8 out of 5" while the page shows "3.8". (L2-011)
- **AC-3** Given The Junction Loft's panel with the projected "Book on the studio's site" link, when it renders, then the link fills the panel's width, has `target="_blank"` and `rel="noopener"`, and its accessible name is "Book on the studio's site (opens in a new tab)". (L2-003)
- **AC-4** Given Ossington Blackbox with stale prices, when its panel renders, then a warning badge "Prices may be out of date" sits after the facts and before "Book on the studio's site". (L2-043)
- **AC-5** Given Distillery District with stale permit rules, when its panel renders, then a warning badge "Permit rules may be out of date" sits after the facts and before the "Best for" tags. (L2-043)
- **AC-6** Given The Junction Loft is in the comparison, when its panel renders, then the toggle reads "Remove from compare" with `aria-pressed="true"` and "Book on the studio's site" is a secondary button. (L2-030)
- **AC-7** Given Evergreen Brick Works tagged engagement, family, portrait and brand, when its panel renders, then "Best for" lists exactly "Engagement", "Family", "Portrait" and "Brand", and the panel has no compare toggle. (L2-019)
- **AC-8** Given the studio and spot panels in the light and the dark theme, when the contrast check runs, then the labels (`--color-fg-subtle`) and values are at least 4.5:1 against the page and the stale badge text is at least 4.5:1 against its fill. (L2-068)

### Layout

- **AC-9** Given The Junction Loft's page, when it renders, then "The Junction Loft" is the only `h1`, and the meta list beneath it holds "Junction", "Dundas St W at Pacific Ave, 2nd floor" and "Reviewed 29 September 2026" with the date in `<time datetime="2026-09-29">`, read as a list of three items with no separators spoken. (L2-003)
- **AC-10** Given Leslieville Daylight Studio's page at 320 px, when the head renders, then the name and address wrap inside the container, the meta items wrap between items, and `document.documentElement.scrollWidth` equals 320. (L2-003)
- **AC-11** Given any studio page, when the hero is inspected, then its image has `loading="eager"`, `fetchpriority="high"` and explicit `width` and `height`, and no other image on the page is eager. (L2-072)
- **AC-12** Given `pages/studio/media-failed` where the hero returns HTTP 404, when the page renders, then the hero slot keeps its 3:2 (16:7 from 768 px) box, shows the alt text "The Junction Loft: two tall north windows over a brick wall, …", and nothing below it moves. (L2-086)
- **AC-13** Given The Junction Loft and Ossington Blackbox, when the heading outline of each page is listed, then "Standard test shots" is the fifth `h2` on both and the sections follow the fixed studio order. (L2-009)
- **AC-14** Given any review page, when its outline is inspected, then each section is a region named by its `h2`, `h3` headings appear only inside sections, and no level is skipped. (L2-069)
- **AC-15** Given Ossington Blackbox with no video ID, when its page renders, then there is no "Watch the episode" section and no placeholder, and "Verdict" is followed directly by "Featured in". (L2-013)
- **AC-16** Given Distillery District with no video ID, when its page renders, then there is no "Watch the episode" section and "Best uses" is followed by "Rain backup". (L2-020)
- **AC-17** Given Bloordale Sun Studio in no guide, when its page renders, then there is no "Featured in" section. (L2-036)
- **AC-18** Given no published studios, when Evergreen Brick Works' page renders, then the "Rain backup" section is present and holds "Studio reviews are coming" and a "Browse studios" link to the studio list. (L2-038)
- **AC-19** Given The Junction Loft's episode playing at 360 px, when the player replaces the poster, then the "Watch the episode" section keeps a 16:9 box the width of the content and the page does not scroll sideways. (L2-013)
- **AC-20** Given `pages/spot/map-failed`, when the page renders, then the "Location and map" section keeps the map's height and every other section and the panel render as on `pages/spot/default`. (L2-086)
- **AC-21** Given The Junction Loft's natural light grid, when it renders at 360 px and at 768 px, then the four times of day stack in one column at 360 px and sit in one row of four at 768 px. (L2-006)
- **AC-22** Given The Junction Loft's verdict, when it renders at 360 px and at 768 px, then "Who it's for" and "Who should skip it" each have text, stacked at 360 px and side by side at 768 px. (L2-011)

### Responsive and keyboard

- **AC-23** Given The Junction Loft's page at 360 px, when it renders, then the summary panel sits directly after the hero and before "Pricing", full width, with each button as wide as the panel. (L2-064)
- **AC-24** Given The Junction Loft's page at 1280 px, when the visitor scrolls from "Pricing" to "Featured in", then the panel stays in a 22rem right column 32 px from the top of the window and the main column takes the remaining width. (L2-064)
- **AC-25** Given The Junction Loft's page at 360 px and at 1280 px, when a keyboard user tabs past the breadcrumb, then the next two focus stops are "Book on the studio's site" and "Add to compare", before any link inside "Pricing". (L2-067)
- **AC-26** Given `pages/studio/in-compare` with the compare bar showing, when the visitor scrolls to the end, then the "Featured in" section and the footer are fully above the compare bar. (L2-030)
- **AC-27** Given The Junction Loft's page at 200 % zoom in a 1280 px window, when the visitor moves through it, then all content and controls are reachable and the page does not scroll sideways. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): in-page anchor
scrolling is instant under `prefers-reduced-motion: reduce`
([review-layout.html](../../design-system/components/review-layout.html),
Accessibility › Motion).

### Performance

- **AC-28** Given the `review-layout/performance` harness route, when the panel's compare toggle is pressed, then the interaction-to-next-paint is at most 200 ms and the cumulative layout shift of the route is at most 0.1. (L2-071)
- **AC-29** Given The Junction Loft's page with its full gallery, when Lighthouse runs in mobile mode, then the largest contentful paint (the hero) is at most 2.5 s. (L2-071)

## Implementation notes

- Library folder `frontend/projects/components/src/lib/summary-panel/`:
  `summary-panel.component.ts` (`SummaryPanelComponent`, selector
  `st-summary-panel`, `:host { display: contents }`),
  `summary-panel.component.html`, `summary-panel.component.css` (port of
  `.summary-panel` and `.summary-panel__row*`, without
  `.summary-panel .btn` and `.review-layout > .summary-panel`, D-1, D-5).
  Uses `BadgeComponent`. `Fact` from `src/lib/types/fact.ts`.
- Application: `StudioPageComponent` (`features/studios/`) and
  `SpotPageComponent` (`features/spots/`) render `.review-head`, `.review-hero`,
  `.review-layout`, `.review-main` and the sections; per the detailed designs
  the section components (`StudioBasicsComponent`, `StudioPricingComponent`, …)
  render their own parts. Each component's stylesheet carries the rules for the
  elements in its own template (encapsulated, ICD-STY-3); a section component
  that renders the whole `section` uses an attribute selector on it
  (`section[st-studio-pricing]`) so `.review-main > .review-section` holds.
  The guide page carries `.review-head` and `.review-head__meta`.
- The hero image fills `.review-hero` through `st-responsive-image`; the
  application never styles the `img` inside it (ICD-DOM-5). This needs the
  responsive image to fill a host that is stretched by its grid parent
  (dependency on [`responsive-image`](responsive-image.md)).
- Mocks drift the application corrects: the panel moves before `.review-main`
  (D-1); `.has-compare-bar` goes on `body`, not `main` ([container](container.md) D-6);
  the review date gets `<time datetime>` on every studio state; inline
  `margin-top` on `.regions`, `.disclosure` and the score list becomes `.stack`
  spacing (D-3); the "Featured in" and "Best uses" tags' inline font and height
  belong to the tag component.

## Decisions

- **D-1** *Below 62rem the DS moves the panel first with `order: -1` while it stays last in the source, so visual and Tab order differ (the DS records this as a known WCAG 1.3.2 / 2.4.3 gap and proposes the fix). And with the panel's host adding no box, an application rule cannot reach the `aside` to order it.* The panel goes **first** in the source, as the DS proposes; from 62rem the application gives `.review-main` `order: -1`, so the main column takes the first column and the panel the second. Below 62rem `.review-layout` takes the `--space-8` top margin the panel had. Reading, focus and visual order then agree on phones, every rule targets an application-owned element (ICD-DOM-5), and the editor layout already puts its status panel first the same way. This changes the mocks' DOM order (reported as a conflict).
- **D-2** *Should the layout be a component (`st-review-layout`) with slots?* No. ICD-002 §11.2 makes it application feature CSS, and the detailed designs already split the page into section components; a wrapper component would add an API nobody asked for.
- **D-3** *How are the score list, regions, disclosure and rain-backup lead spaced inside a section, when the mocks use inline `margin-top` and an application rule may not target library classes such as `.disclosure`?* The application wraps the section's blocks in `.stack--lg` (`--space-8`, as the DS's `.review-section > .disclosure` rule asks) and the score pair in `.stack` (`--space-4`), using the global utilities.
- **D-4** *What does `Fact.numeric` do in the summary panel?* Nothing extra: `.summary-panel__row dd` already uses tabular figures, so the value is rendered as the mocks write it (`<dd>$145.00</dd>`). `badge` renders a neutral `st-badge` after the value; the review pages put the stale badge in the slot instead, as the mocks do.
- **D-5** *The DS widens projected buttons with `.summary-panel .btn { width: 100% }`, which encapsulated styles cannot apply to projected content.* The panel's flex column stretches each projected child to its width, which gives the same full-width buttons with no rule reaching into the button.
- **D-6** *Can the "Book on the studio's site" or "Add to compare" ever be disabled?* No. The DS says so (a published studio always has a booking link; the compare limit is explained by a toast), so the panel has no disabled state.
