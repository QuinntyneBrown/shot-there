# Location card

| Field | Value |
|---|---|
| Selector | `st-location-card`, `st-location-card-skeleton`, `ul[st-location-grid]` |
| Library path | `frontend/projects/components/src/lib/location-card/` |
| Status | planned |
| Traces to | L2-021, L2-024, L2-026, L2-030, L2-034, L2-043, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072, L2-074, L2-086 |
| Design system | [`location-card.html`](../../design-system/components/location-card.html) |
| Source mocks | [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studios/filtered`](../../mocks/pages/studios/filtered.html), [`pages/studios/selected`](../../mocks/pages/studios/selected.html), [`pages/studios/selected-one`](../../mocks/pages/studios/selected-one.html), [`pages/studios/loading`](../../mocks/pages/studios/loading.html), [`pages/spots/default`](../../mocks/pages/spots/default.html), [`pages/spots/filtered`](../../mocks/pages/spots/filtered.html), [`pages/spots/loading`](../../mocks/pages/spots/loading.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/guides/default`](../../mocks/pages/guides/default.html), [`pages/guide/default`](../../mocks/pages/guide/default.html), [`dialogs/studio-filters/default`](../../mocks/dialogs/studio-filters/default.html), [`dialogs/spot-filters/default`](../../mocks/dialogs/spot-filters/default.html), [`dialogs/site-menu/default`](../../mocks/dialogs/site-menu/default.html), [`notifications/public-toast/warning`](../../mocks/notifications/public-toast/warning.html) |
| Rendering | [`location-card.html`](location-card.html) |

## Purpose and scope

A location card is one reviewed studio or outdoor spot in a list: its photo,
its name, where it is, and the numbers that decide a booking. Every list of
places on ShotThere is a grid of these cards, so a visitor can scan a row of
studios shot with the same test setup and compare them without opening
anything. The name is the card's one link and it covers the whole card; a
studio card in the studio list also carries the compare toggle. The same card
sits inside each guide entry, with the guide's rank beside the name, and
represents each guide on the guides page.

This CRD covers three ICD components that ship together: `st-location-card`
(the card), `st-location-card-skeleton` (its loading placeholder) and
`ul[st-location-grid]` (the 1/2/3-column list they sit in). Use a list row
(`.list__item`) for the rain-backup studios on a spot page, a stacked table in
the administration area, and [`st-compare-bar`](compare-bar.md) and the
comparison table once studios are picked. The guide entry that wraps a card is
the application's [`st-guide-entry`](guide-entry.md).

Out of scope:

- The compare toggle itself: [`button[st-button]`](button.md) with `pressed`,
  projected into the `actions` slot. The card only places it above the link.
- Which studios are selected, the four-studio limit, the compare bar and its
  announcements: application and [`st-compare-bar`](compare-bar.md).
- Staleness, all-in cost, score and date formatting: computed by the server and
  formatted by the application (ICD-API-10, ICD-I18N-4). The card shows the
  strings and badges it is given.
- The result count, the "Results" heading, the region's `aria-busy`, the number
  of skeletons and when they show: the application and
  `st-result-count`.
- The best-use tags: [`st-tag-list`](tag.md), projected into the default slot.
- The compact item in the list beside the map (`.map-list-item`) and the map
  page's list: application-owned (ICD-002 §11.2), not this component (D-3).
- The guide entry's data points, note and review link, and the guide index
  grid (`.guide-index`): [`st-guide-entry`](guide-entry.md).

## Usage

Every `.location-card` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks location-card "li|div|article"` and grep),
grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studios/default`, `filtered`, `selected`, `selected-one`; behind `dialogs/studio-filters/*`, `dialogs/site-menu/default`, `notifications/public-toast/*` | Studio card, `headingLevel` 3, `meta` "Kensington Market · Reviewed 3 Oct 2026", `facts` All-in 2 h / Score (`srSuffix` " out of 5"), `priority` on the first card | `actions`: small compare toggle "Compare" / "Remove" + hidden name | default, hover, focus, stale (Ossington Blackbox: fact `badge` "Prices may be out of date"), toggle pressed | canvas, in `ul[st-location-grid]` beside the filter sidebar |
| `pages/home/default` "Latest reviews" | Studio card without actions | none | default | canvas, standalone grid |
| `pages/spots/default`, `filtered`; behind `dialogs/spot-filters/*`; `pages/home/default` "Outdoor spots" | Spot card, `meta` "Don Valley · Park", `secondaryMeta` "Portraits: no permit needed · Commercial: permit required" | default slot: `st-tag-list` "Best uses" (Engagement, Family, Portrait, Brand) | default, stale (Distillery District: `badge` "Permit rules may be out of date") | canvas |
| `pages/studios/loading`, `pages/spots/loading` | Six `st-location-card-skeleton` in `ul[st-location-grid]` with `aria-hidden="true"`, region `aria-busy="true"` | none | loading | canvas |
| `pages/guide/default` | Card inside `st-guide-entry`: `rank` 1–3, `headingLevel` 2, `meta`, no facts, no actions; `priority` on the first entry | none | default, hover, focus, image failed (DS) | canvas, left column of the entry |
| `pages/guides/default` | Guide as a card: `headingLevel` 2, `name` "Best natural light", `secondaryMeta` "3 studios · Updated 3 Oct 2026", image of the first entry | default slot: summary `<p>` | default | canvas, in `.guide-index` |
| `pages/map/*`, `dialogs/map-popup/*` | `.map-list-item` (compact) | — | — | Not this component (D-3) |
| `pages/spot/default` "Rain backup" | `.list__item` rows | — | — | Not this component (D-17) |

Every row above is buildable with the API below: the studio, spot, guide-entry
and guide-index cards differ only in which inputs and slots they fill. Rows for
spots and guides need the three additions D-2 specifies (`secondaryMeta`,
`badge`, the default slot).

## Anatomy

1. **Card** — the host `st-location-card` with the class `location-card`: a
   flex column, `--space-2` between parts, `position: relative` for the
   stretched link, `min-width: 0`. The application places it inside an `<li>`
   of `ul[st-location-grid]` or `.guide-index`, or inside `st-guide-entry`.
2. **Media** — `.location-card__media`: 3:2 frame, `--radius-lg` corners,
   `--color-bg-photo` behind, `overflow: hidden`, `--space-2` extra space below.
   Holds [`st-responsive-image`](responsive-image.md) with `decorative` (so
   `alt=""`), or nothing when `image` is `null`.
3. **Rank (optional)** — `.guide-entry__rank`, `aria-hidden="true"`: a
   `--space-10` disc in `--color-bg-subtle` with the number in `--text-h4`
   tabular figures. When present, rank and name sit in a `.cluster` row that
   never wraps (D-8).
4. **Name** — `.location-card__name`, a heading at `headingLevel` (`h3` by
   default) holding the only link (`<a routerLink>`). The link's `::after`
   covers the card (`inset: 0`, `--radius-lg`).
5. **Meta** — `.location-card__meta`, `--text-body-sm` in `--color-fg-muted`.
6. **Facts (optional)** — `.location-card__facts`, a `<dl>` of
   `<div><dt><dd>` pairs in a wrapping row; values in `--text-label` at
   `--font-size-md`, `--color-fg-default`, tabular figures; an optional
   visually hidden `srSuffix` after the value.
7. **Body (optional)** — the default slot, projected as is: a
   [`st-tag-list`](tag.md) of best uses, or one summary `<p>`.
8. **Secondary meta (optional)** — a second `.location-card__meta` line.
9. **Stale badges (optional)** — one `<p>` per badge holding
   [`st-badge`](badge.md) with `tone="warning"` (`.badge.badge--warning`).
10. **Actions (optional)** — `.location-card__actions`: the `actions` slot in a
    row raised above the stretched link with `--z-raised`, as wide as its
    content (D-5), hidden when empty (D-7).

The skeleton host `st-location-card-skeleton` carries
`location-card location-card--skeleton` and `aria-hidden="true"`: a media frame
holding a `rect` [`st-skeleton`](skeleton.md), then `title`, `text` and `text`
skeletons. The grid host is the `<ul>` itself (`ul[st-location-grid]`, class
`location-grid`); the component adds no wrapper.

## API

### `st-location-card`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `name` | `string` | — | yes | The location's or guide's published name; the link text and the link's whole accessible name. Never truncated. |
| `link` | `string` | — | yes | Router path to the review or guide (from `APP_PATHS`), bound with `RouterLink` on the name's `<a>`. |
| `image` | `ResponsiveImage \| null` | `null` | no | Rendered by `st-responsive-image` with `decorative` (forces `alt=""`), `sizes` = `imageSizes`, `priority` = `priority`. `null` leaves the empty `--color-bg-photo` frame. |
| `imageSizes` | `string` | `'(min-width: 62rem) 33vw, (min-width: 36rem) 50vw, 100vw'` | no | Passed through as `sizes`. Guide entries pass `'(min-width: 48rem) 18rem, 100vw'`. |
| `priority` | `boolean` | `false` | no | Passed through: `loading="eager"` and `fetchpriority="high"`. The application sets it on exactly the first above-the-fold card of a page (ICD-MEDIA-2). |
| `headingLevel` | `HeadingLevel` | `3` | no | Element of `.location-card__name`: `h3` in lists under the visually hidden "Results" `h2` or a section `h2`; `2` in guide entries and on the guides page. |
| `meta` | `string \| null` | `null` | no | First `.location-card__meta` line; not rendered when `null`. "Kensington Market · Reviewed 3 Oct 2026", "Don Valley · Park". |
| `facts` | `readonly Fact[]` | `[]` | no | `.location-card__facts`, not rendered when empty; tracked by `term`. `srSuffix` becomes a visually hidden span after `detail`; `numeric` has no effect (all values are tabular, D-16); `badge` adds a warning badge (L2-043, D-11). |
| `rank` | `number \| null` | `null` | no | Guide rank: renders `.guide-entry__rank` with `aria-hidden="true"` before the name, in a `.cluster` row. The application passes the list position, so ranks never skip. |
| `secondaryMeta` | `string \| null` | `null` | no | **ICD change (D-2).** Second `.location-card__meta` line after the body: "Portraits: no permit needed · Commercial: permit required", "3 studios · Updated 3 Oct 2026". Not rendered when `null`. |
| `badge` | `string \| null` | `null` | no | **ICD change (D-2).** A warning badge for stale data that belongs to no fact: "Permit rules may be out of date" on a spot card. Not rendered when `null`. |

Inputs are signal inputs; `priority` uses `booleanAttribute` and `rank` uses
`numberAttribute`. The card computes nothing: it never decides staleness, never
formats a number or a date, and never chooses its own heading level.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Opening the review is the native link's job; the compare toggle is the consumer's button and reports through its own `click`. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `actions` | The compare toggle: `button[st-button]` with `size="sm"` and `pressed`, hidden studio name | Rendered inside `.location-card__actions`, above the stretched link (`--z-raised`). Only on studio cards in the studio list. Empty: the row is not displayed (D-7). |
| default | **ICD change (D-2).** Non-interactive body content: one `st-tag-list` of best uses (`label` "Best uses"), or one summary `<p>` | Projected between the facts and `secondaryMeta`. It sits under the stretched link, so it must hold no link or control (D-6). |

The card has no library strings (ICD-002 §12); every word comes from the
consumer.

### `st-location-card-skeleton`

No inputs, outputs or slots. Renders the loading placeholder described under
*Anatomy*, with `aria-hidden="true"` on the host. The application renders six
inside `ul[st-location-grid]` while a list loads (mocks assumption 6) and owns
the busy region around them (D-15).

### `ul[st-location-grid]`

No inputs, outputs or slots of its own; the children are the application's
`<li>` elements, each holding one card or skeleton. Host class `location-grid`.
Columns: 1 below 36rem, 2 from 36rem, 3 from 62rem, at every place it is used
(L2-021.4, D-4). Native attributes on the host (`aria-hidden`, `aria-label`)
belong to the consumer.

## Variants and sizes

| Variant | Inputs and slots | Use for |
|---|---|---|
| Studio, with compare | `meta`, `facts` (All-in 2 h, Score), `actions` toggle | Studio list (L2-021, L2-030) |
| Studio, no actions | `meta`, `facts` | Home "Latest reviews": the compare bar lives on the studio list |
| Spot | `meta` (neighbourhood · type), default slot `st-tag-list`, `secondaryMeta` (permit summary) | Spot list and home "Outdoor spots" (L2-024) |
| In a guide entry | `rank`, `headingLevel` 2, `meta`; no facts, no actions | Guide page, through `st-guide-entry` (L2-034) |
| Guide | `headingLevel` 2, default slot summary `<p>`, `secondaryMeta` count and date | Guides page index (L2-035) |
| Stale | fact `badge` "Prices may be out of date" (studio) or `badge` "Permit rules may be out of date" (spot) | Any card whose data the server flags (L2-021.3, L2-043) |
| Skeleton | `st-location-card-skeleton` | Studio and spot lists while loading (L2-026.1) |

One size. The card fills its grid cell (`min-width: 0`) and its photo keeps 3:2
at any width; the grid or the guide entry decides the width. The compact
`.map-list-item` size on the DS page is the application's (D-3).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Photo, name in `--color-fg-default`, meta muted, facts | Heading with a link named by `name`; meta, facts and badges read after it |
| Hover | `:hover` on the card | Photo scales to 1.04 inside its frame over `--duration-slow`; name underlined. Nothing outside the frame moves | — |
| Focus | name link `:focus-visible` | The link's own outline removed; a `--focus-ring-width` ring in `--color-focus-ring` around the whole card, `--space-2` out, `--radius-lg` corners (`:has()`) | Focus on the name link |
| Active | `:active` | Same as hover; the review opens on release | — |
| Toggle focused | compare toggle `:focus-visible` | Only the toggle is ringed | Focus on the toggle |
| Selected for comparison | toggle `pressed` true | The toggle's look (button CRD); the card does not change | Toggle "pressed" |
| Stale | fact `badge` or `badge` set | `.badge.badge--warning` paragraph after the content | Badge text read in order |
| Image loading | `image` set, not yet decoded | `--color-bg-photo` frame at the final 3:2 size | — |
| Image failed | the image errors | `st-responsive-image` (decorative) fills the slot with `.media-fallback`: `--color-bg-photo` and the crossed-out image icon in `--color-fg-subtle`, no text; same size (D-12) | Nothing announced: the photo is decorative |
| No image | `image` `null` | Empty 3:2 `--color-bg-photo` frame | — |
| Loading | `st-location-card-skeleton` | Shimmering media, title and two text bars at the card's size | Hidden (`aria-hidden="true"`); the region is busy and the result count says "Loading studios…" |
| Disabled | — | Never: a location that cannot be opened is not listed | — |
| In a guide entry | `rank` set | Rank disc before the name, name row does not wrap | Rank hidden; the `<ol>` position is the rank |
| Reduced motion | `prefers-reduced-motion: reduce` | No photo zoom (`scale: none`); skeleton shimmer stops | — |

## Markup

```html
<!-- rendered: studio card with compare toggle, first in the list -->
<ul class="location-grid">
  <li>
    <st-location-card class="location-card">
      <div class="location-card__media">
        <st-responsive-image><picture><source type="image/avif" srcset="…"><source type="image/webp" srcset="…">
          <img src="…/kensington-window-room-1200.jpg" srcset="…" sizes="(min-width: 62rem) 33vw, (min-width: 36rem) 50vw, 100vw" alt="" width="1200" height="800" loading="eager" fetchpriority="high"></picture></st-responsive-image>
      </div>
      <h3 class="location-card__name"><a href="/studios/kensington-window-room">Kensington Window Room</a></h3>
      <p class="location-card__meta">Kensington Market · Reviewed 3 Oct 2026</p>
      <dl class="location-card__facts">
        <div><dt>All-in 2 h</dt><dd>$80.00</dd></div>
        <div><dt>Score</dt><dd>3.2<span class="visually-hidden"> out of 5</span></dd></div>
      </dl>
      <div class="location-card__actions">
        <button class="btn btn--sm compare-toggle" type="button" aria-pressed="false">Compare<span class="visually-hidden"> Kensington Window Room</span></button>
      </div>
    </st-location-card>
  </li>
</ul>
```

```html
<!-- rendered: stale studio (fact badge), no actions -->
<st-location-card class="location-card">
  <div class="location-card__media">…<img alt="" width="1200" height="800" loading="lazy" …>…</div>
  <h3 class="location-card__name"><a href="/studios/ossington-blackbox">Ossington Blackbox</a></h3>
  <p class="location-card__meta">Ossington · Reviewed 6 Mar 2026</p>
  <dl class="location-card__facts">
    <div><dt>All-in 2 h</dt><dd>$270.00</dd></div>
    <div><dt>Score</dt><dd>3.8<span class="visually-hidden"> out of 5</span></dd></div>
  </dl>
  <p><st-badge class="badge badge--warning">Prices may be out of date</st-badge></p>
  <div class="location-card__actions"></div><!-- empty: display none -->
</st-location-card>
```

```html
<!-- rendered: spot card, stale permit rules -->
<st-location-card class="location-card">
  <div class="location-card__media">…</div>
  <h3 class="location-card__name"><a href="/spots/distillery-district">Distillery District</a></h3>
  <p class="location-card__meta">Distillery District · Architecture</p>
  <st-tag-list><ul class="tags" aria-label="Best uses"><li class="tag">Engagement</li><li class="tag">Brand</li><li class="tag">Portrait</li></ul></st-tag-list>
  <p class="location-card__meta">Portraits: permit required · Commercial: permit required</p>
  <p><st-badge class="badge badge--warning">Permit rules may be out of date</st-badge></p>
  <div class="location-card__actions"></div>
</st-location-card>
```

```html
<!-- rendered: inside a guide entry (rank 1, h2) -->
<st-location-card class="location-card">
  <div class="location-card__media">…</div>
  <div class="cluster">
    <span class="guide-entry__rank" aria-hidden="true">1</span>
    <h2 class="location-card__name"><a href="/studios/kensington-window-room">Kensington Window Room</a></h2>
  </div>
  <p class="location-card__meta">Kensington Market · Reviewed 3 Oct 2026</p>
  <div class="location-card__actions"></div>
</st-location-card>
```

```html
<!-- rendered: image failed (st-responsive-image, decorative) -->
<div class="location-card__media">
  <st-responsive-image><span class="media-fallback"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/></svg></span></st-responsive-image>
</div>
```

```html
<!-- rendered: loading, inside the application's busy region -->
<section class="browse__results" aria-labelledby="results-title" aria-busy="true">
  <h2 class="visually-hidden" id="results-title">Results</h2>
  <p class="result-count" role="status" aria-live="polite">Loading studios…</p>
  <ul class="location-grid" aria-hidden="true">
    <li>
      <st-location-card-skeleton class="location-card location-card--skeleton" aria-hidden="true">
        <div class="location-card__media"><st-skeleton class="skeleton skeleton--rect" aria-hidden="true"></st-skeleton></div>
        <st-skeleton class="skeleton skeleton--title" aria-hidden="true"></st-skeleton>
        <st-skeleton class="skeleton skeleton--text" aria-hidden="true"></st-skeleton>
        <st-skeleton class="skeleton skeleton--text" aria-hidden="true"></st-skeleton>
      </st-location-card-skeleton>
    </li>
    <!-- … six in all -->
  </ul>
</section>
```

The DS page writes the class on the `<li>` (`li.location-card`); here the
application writes a bare `<li>` and the host carries `location-card` (ICD-002
§9.5, D-1). Element names of hosts and Angular's `_ngcontent-*` attributes are
not part of the contract (ICD-DOM-3).

```html
<!-- consumer: studio list (application) -->
<ul st-location-grid>
  @for (card of cards(); track card.slug; let first = $first) {
    <li>
      <st-location-card [name]="card.name" [link]="card.link" [image]="card.image"
                        [priority]="first" [meta]="card.meta" [facts]="card.facts">
        <button st-button size="sm" slot="actions" type="button"
                [pressed]="isSelected(card.slug)" (click)="toggleCompare(card.slug)">
          @if (isSelected(card.slug)) { <ng-container i18n>Remove</ng-container> }
          @else { <ng-container i18n>Compare</ng-container> }
          <span class="visually-hidden"> {{ card.name }}</span>
        </button>
      </st-location-card>
    </li>
  }
</ul>

<!-- consumer: spot card -->
<st-location-card [name]="spot.name" [link]="spot.link" [image]="spot.image"
                  [meta]="spot.meta" [secondaryMeta]="spot.permitSummary" [badge]="spot.permitBadge">
  <st-tag-list [items]="spot.bestUses" i18n-label label="Best uses" />
</st-location-card>

<!-- consumer: loading -->
<ul st-location-grid aria-hidden="true">
  @for (n of skeletons; track n) { <li><st-location-card-skeleton /></li> }
</ul>
```

## Design

- Card: flex column, `gap` `--space-2`, `position: relative`, `min-width: 0`.
- Media: `aspect-ratio: 3 / 2`, `--radius-lg`, `overflow: hidden`,
  `--color-bg-photo`, `margin-bottom` `--space-2`. The `st-responsive-image`
  host is a block filling the frame; its image covers the frame
  (`object-fit: cover`).
- Name: `--text-card-title`, `overflow-wrap: anywhere`; link in
  `--color-fg-default`, no underline until hover; `::after` stretched with
  `inset: 0` and `--radius-lg`.
- Meta and facts: `--text-body-sm` in `--color-fg-muted`; facts row
  `gap` `--space-1` `--space-4`, pair `gap` `--space-1`, values `--text-label`
  at `--font-size-md` in `--color-fg-default`, tabular figures.
- Rank row: `.cluster` with `gap` `--space-3`, `flex-wrap: nowrap`, items
  centred; disc `--space-10` square, `--radius-full`, `--color-bg-subtle`,
  `--text-h4`, tabular figures, never shrinks (D-8).
- Badge: [`st-badge`](badge.md) warning in a plain `<p>`.
- Actions: flex row, `gap` `--space-2`, `margin-top` `--space-1`,
  `align-self: flex-start`, `position: relative`, `z-index: --z-raised`;
  `display: none` when empty (D-5, D-7).
- Focus: `outline` `--focus-ring-width` `--color-focus-ring`, offset
  `--space-2`, `--radius-lg`, on the card through
  `:host:has(.location-card__name a:focus-visible)`.
- Motion: the image host scales to 1.04 over `--duration-slow` with
  `--ease-standard` on card hover (D-13); none under reduced motion.
- Grid: `list-style: none`, no padding, `display: grid`; columns
  `minmax(0, 1fr)`, `repeat(2, minmax(0, 1fr))` from 36rem,
  `repeat(3, minmax(0, 1fr))` from 62rem; gap `--space-10` `--space-6`,
  `--space-12` `--space-8` from 62rem.
- Skeleton: media frame without fill; `rect` fills it (`width` and `height`
  100 %, `border-radius: inherit`); title 70 % wide, text 50 %.

The card declares no component tokens; it reads semantic tokens only, so a
theme or a scoped override of `--text-card-title` re-skins it (DS *Theming*).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Photo frame, failed-image fill | `--color-bg-photo` | `--palette-stone-100` | `--palette-stone-800` |
| Name, fact values, rank number | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Meta, fact labels, tag text | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Failed-image icon | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Rank disc | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Tag outline (decorative) | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Stale badge fill | `--color-warning-bg` | `--palette-mango-50` | `--palette-mango-950` |
| Stale badge text | `--color-warning-fg` | `--palette-mango-700` | `--palette-mango-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Page behind | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Name and fact values |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Meta, fact labels, tag text |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Stale badge |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Rank on its disc |
| `--color-fg-subtle` | `--color-bg-photo` | 3:1 | Failed-image icon (graphic) |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Pressed compare toggle edge (button CRD) |

The tag outline is decorative: the tag text carries the meaning. Photos are
content and keep their colours in both themes. Forced colours: the focus ring
is an `outline`, so it stays visible as `Highlight`; the photo frame and rank
disc fall back to `Canvas`, and the rank stays readable as text.

## Responsive behaviour

| Viewport | `ul[st-location-grid]` columns | Gap (row / column) |
|---|---|---|
| XS, below 36rem | 1 | `--space-10` / `--space-6` |
| SM, MD (36rem to 61.99rem) | 2 | `--space-10` / `--space-6` |
| LG, XL (62rem and up) | 3, also beside the 15rem filter sidebar (D-4) | `--space-12` / `--space-8` |

- Below 62rem the studio and spot filters move into a dialog, so the grid has
  the full content width.
- The card is fluid; the photo keeps 3:2. Names wrap (`overflow-wrap: anywhere`)
  and never truncate; facts wrap onto a second line rather than shrinking; the
  badge keeps one line ("Permit rules may be out of date" fits a 288 px card).
- The compare toggle (`.btn--sm`) is 44 px tall below 48rem and 36 px from
  48rem (button CRD); the card itself is one target far above 44 × 44 px.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything
  stays available; every target is at least 24 × 24 CSS px everywhere.
- In a guide entry the card is the full entry width below 48rem and at most
  18rem from 48rem ([guide-entry.md](guide-entry.md)).

## Accessibility

### Role and pattern

A `<ul>` of `<li>`, so screen readers announce "list, 7 items". Each card is
the "card with a stretched link" pattern: one native `<a href>` inside the name
heading, its `::after` covering the card. No ARIA widget role; the card is
never wrapped in an `<a>`, which would nest the compare button in a link.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Name link, then the compare toggle when there is one, then the next card. One or two stops per card, in reading order. Photo, facts, tags and badges are not focusable. |
| <kbd>Enter</kbd> | On the name: opens the review. On the toggle: adds or removes the studio. |
| <kbd>Space</kbd> | On the toggle: adds or removes the studio. On the name it scrolls the page, as on any link. |

### Focus

The name link's own outline is removed and the shared ring is drawn around the
whole card, so the ring outlines what a click opens. Focusing the toggle rings
only the toggle. The card never moves focus. Entries have no `overflow: hidden`
on the card, so the ring is never clipped.

### Labelling

- The link's accessible name is `name` only; meta, facts and badges are read
  after it in DOM order, never folded into the link.
- The photo is `alt=""` (`decorative`), because the name says the same thing.
- Facts are a `<dl>`: "All-in 2 h, $80.00; Score, 3.2 out of 5" (the "out of 5"
  is the visually hidden `srSuffix`).
- Best-use tags are a list labelled "Best uses" (the consumer's `st-tag-list`
  `label`).
- The compare toggle carries the studio name in a visually hidden span:
  "Compare Kensington Window Room".
- The rank disc is `aria-hidden`; the `<ol role="list">` of the guide gives the
  position.
- Skeletons are `aria-hidden="true"`; the result count (`role="status"`)
  announces "7 studios" when the cards arrive.

### Announcements

The card has no live region. List counts belong to
`st-result-count`; compare counts to
[`st-compare-bar`](compare-bar.md).

### Motion

The photo zoom runs over `--duration-slow` with `--ease-standard`; under
`prefers-reduced-motion: reduce` the photo does not zoom at all (`scale: none`),
and the skeleton shimmer stops. The underline still marks hover.

## Content and internationalisation

- Name: the published name exactly ("The Junction Loft", "Leslieville Daylight
  Studio"); data, not translated.
- Studio meta: "Neighbourhood · Reviewed 3 Oct 2026". Spot meta:
  "Neighbourhood · Type", then the permit summary "Portraits: no permit needed ·
  Commercial: permit required". Guide card: summary sentence, then
  "3 studios · Updated 3 Oct 2026". Dates are formatted by the application for
  `en-CA` (L2-070.3).
- Facts: "All-in 2 h" with the price to the cent ("$145.00") and "Score" with
  one decimal ("3.8") plus the hidden " out of 5".
- Tags: best uses in sentence case, in the review's order, at most four.
- Stale: "Prices may be out of date" (studios) and "Permit rules may be out of
  date" (spots); no dates in the badge (D-10).
- Translatable content: every label and template string inside `meta`,
  `secondaryMeta`, `badge`, fact `term` and `srSuffix`, the tag-list `label`
  and the toggle's slot text; the application marks them. Data: names, prices,
  dates, scores.
- Longer translations wrap; nothing truncates. A badge that would exceed a
  288 px card in translation is shortened in the catalogue.
- Order comes only from the visitor's sort; a card never says "featured" or
  "sponsored".

## Performance

- Change detection: `OnPush`, signal inputs; the facts list, the badge list and
  the heading element come from `computed` signals; `@for` over facts tracks
  `term`.
- The heading is one `@switch` on `headingLevel` sharing one `<ng-template>`
  for the link, so the slots are declared once (ICD-API-9).
- Performance scenario: the `components-harness` route
  `location-card/performance` renders the studio list's seven cards in
  `ul[st-location-grid]` (Kensington Window Room … Ossington Blackbox, Ossington
  stale, compare toggles in the slot, `priority` on the first) after six
  skeletons; it must meet the L2-071 budgets (LCP ≤ 2.5 s, CLS ≤ 0.1,
  INP ≤ 200 ms on a toggle press) on the Lighthouse mobile profile.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: width and height on every image, the 3:2 frame reserved
  before the photo arrives, the failed image keeps the slot, and the skeleton
  uses the same frame, gaps and columns as the card.
- Weight: imports `@angular/core`, `RouterLink`, and the library's
  `ResponsiveImageComponent`, `BadgeComponent` and `SkeletonComponent`; no CDK.

## Acceptance criteria

### Rendering

- **AC-1** Given the studio list with Kensington Window Room's card (`meta` "Kensington Market · Reviewed 3 Oct 2026", facts "All-in 2 h" "$80.00" and "Score" "3.2" with `srSuffix` " out of 5"), when it renders, then the host has the class `location-card`, the name is an `h3.location-card__name` holding the only link with `href="/studios/kensington-window-room"`, and the meta and the `dl.location-card__facts` follow it in that order. (L2-021)
- **AC-2** Given Kensington Window Room's card in the studio list, when the visitor clicks its photo, its meta or the space beside its compare toggle, then the studio page `/studios/kensington-window-room` opens. (L2-021)
- **AC-3** Given Ossington Blackbox's card whose "All-in 2 h" fact carries `badge` "Prices may be out of date", when it renders, then a `p` holding `.badge.badge--warning` with that text follows the facts and comes before the actions row, and Kensington Window Room's card, whose facts have no badge, has no `.badge`. (L2-021)
- **AC-4** Given Evergreen Brick Works' spot card with `meta` "Don Valley · Park", an `st-tag-list` labelled "Best uses" (Engagement, Family, Portrait, Brand) in the default slot and `secondaryMeta` "Portraits: no permit needed · Commercial: permit required", when it renders, then the name, meta, the `ul.tags` and the second `.location-card__meta` appear in that order with no `dl` and no actions row shown. (L2-024)
- **AC-5** Given Distillery District's spot card with `badge` "Permit rules may be out of date", when it renders, then a `.badge.badge--warning` paragraph with that text follows the permit summary, and the card shows no badge when `badge` is `null`. (L2-043)
- **AC-6** Given Kensington Window Room's card inside a guide entry with `rank` 1 and `headingLevel` 2, when it renders, then a `.guide-entry__rank` with the text "1" and `aria-hidden="true"` comes before an `h2.location-card__name` in a row that does not wrap, and the card renders no facts and no actions. (L2-034)

### Compare toggle

- **AC-7** Given The Junction Loft's card with a small compare toggle in the `actions` slot, when the visitor clicks the toggle, then the toggle's handler runs, `aria-pressed` becomes "true", and the page does not navigate. (L2-030)
- **AC-8** Given the home page's "Latest reviews" cards with nothing in the `actions` slot, when they render, then no `.location-card__actions` row is displayed and the card ends after its facts with no extra space. (L2-021)

### Images

- **AC-9** Given the studio list with seven cards and `priority` on the first, when it renders, then the first card's `img` has `loading="eager"` and `fetchpriority="high"`, the other six have `loading="lazy"`, and every card `img` has `alt=""`, `width`, `height`, `srcset` and `sizes="(min-width: 62rem) 33vw, (min-width: 36rem) 50vw, 100vw"`. (L2-072)
- **AC-10** Given Leslieville Daylight Studio's card whose image URL returns HTTP 404, when the page renders, then the media frame keeps its 3:2 size, shows `.media-fallback` with the crossed-out image icon and no text, and the card's other parts do not move. (L2-086)

### Loading

- **AC-11** Given the studio list while data is loading, when it renders six `st-location-card-skeleton` in `ul[st-location-grid]` with `aria-hidden="true"` inside the section marked `aria-busy="true"`, then each skeleton has the classes `location-card location-card--skeleton` and `aria-hidden="true"`, and the accessibility tree contains no list items from the grid. (L2-026)
- **AC-12** Given six skeletons at 1280 px wide, when they are replaced by the seven studio cards, then the first row of media frames keeps the same position and size and the layout shift measured for the swap is at most 0.1. (L2-071)
- **AC-13** Given the studio list route fetched with JavaScript disabled, when the HTML arrives, then it contains the seven `.location-card` elements with their names, links, meta and facts. (L2-074)

### Keyboard and focus

- **AC-14** Given the studio list, when a keyboard user tabs from Kensington Window Room's name, then focus goes to "Compare Kensington Window Room", then to "The Junction Loft" name link, two stops per card in reading order. (L2-067)
- **AC-15** Given focus on The Junction Loft's name link from the keyboard, when the card is inspected, then the link has no outline of its own and the card has a `--focus-ring-width` (2 px) outline in `--color-focus-ring`, `--space-2` (8 px) outside it, with at least 3:1 contrast against the page; a mouse click draws no ring. (L2-067)

### Screen readers

- **AC-16** Given the studio list, when a screen reader reads Kensington Window Room's card, then the link is named "Kensington Window Room" only, the photo is not announced, and the facts read "All-in 2 h, $80.00" and "Score, 3.2 out of 5". (L2-069)
- **AC-17** Given the studio, spot, home and guides cards, when axe-core scans them at 320 px and 1280 px in light and dark, then no violation is reported and every card image has `alt=""`. (L2-068)
- **AC-18** Given a card with `headingLevel` 2 on the guides page and the default on the studio list, when the heading outline is inspected, then the guides page shows `h1` "Guides" then `h2` names and the studio list shows `h2` "Results" then `h3` names, with no skipped level. (L2-069)

### Theming

- **AC-19** Given Ossington Blackbox's stale card and a ranked guide card, when the contrast check runs in the light and the dark theme, then the name, facts and meta are at least 4.5:1 on the page, the badge text is at least 4.5:1 on its fill, the rank is at least 4.5:1 on its disc, and the focus ring is at least 3:1 against the page. (L2-068)

### Responsive

- **AC-20** Given the studio list's seven cards, when the viewport is 360, 600 and 1000 px wide, then `ul[st-location-grid]` shows 1, 2 and 3 columns respectively, including at 1000 px beside the filter sidebar. (L2-021)
- **AC-21** Given the spot list at 360 px wide, when it renders, then the cards are one column and Allan Gardens Conservatory's name wraps without truncation. (L2-024)
- **AC-22** Given the studio list at 320 px wide, when it renders, then `document.documentElement.scrollWidth` equals the viewport width and no card part is clipped. (L2-064)
- **AC-23** Given the studio list at 360 px wide, when the targets are measured, then each card's link target is the whole card and the compare toggle is at least 44 × 44 CSS px. (L2-065)
- **AC-24** Given the studio list at 200 % zoom in a 1280 px viewport, when the visitor reaches Ossington Blackbox's card, then its name, facts, badge and toggle are visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the photo does not zoom on hover and the
skeleton shimmer stops, while the underline still marks hover
([location-card.html](../../design-system/components/location-card.html),
Accessibility › Motion).

### Performance

- **AC-25** Given the `location-card/performance` harness route with seven studio cards, when it is measured with Lighthouse in mobile mode, then LCP is at most 2.5 s, CLS at most 0.1, and pressing a compare toggle has an interaction-to-next-paint of at most 200 ms. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/location-card/`:
  `location-card.component.ts|html|css` (`LocationCardComponent`, selector
  `st-location-card`), `location-card-skeleton.component.ts|html|css`
  (`LocationCardSkeletonComponent`, selector `st-location-card-skeleton`),
  `location-grid.component.ts|html|css` (`LocationGridComponent`, selector
  `ul[st-location-grid]`, template `<ng-content />`). Types `Fact`,
  `HeadingLevel`, `ResponsiveImage` from `src/lib/types/`.
- Host bindings: `class="location-card"` on the card;
  `class="location-card location-card--skeleton"` and `aria-hidden="true"` on
  the skeleton; `class="location-grid"` on the grid.
- Composes `ResponsiveImageComponent` (`decorative`, `sizes`, `priority`),
  `BadgeComponent` (`tone="warning"`), `SkeletonComponent` and `RouterLink`.
  It relies on `st-responsive-image` filling its host box and covering it
  (responsive-image CRD); the card sets the host to `display: block`,
  `width` and `height` 100 % through a class in its own template.
- CSS: port `.location-card*` (except the `.map-list-item` selectors),
  `.location-grid` (except the `.browse__results` and `.map-page__list`
  overrides, D-3, D-4) and the `.guide-entry__rank` rule (D-8) into the three
  component stylesheets, written against `:host`. The hover zoom targets the
  image host, not the inner `img` (D-13). Replace the pointer-events rules with
  D-5 and D-6.
- ICD change (ICD-002 1.1.0, additive) on `LocationCardComponent`: input
  `secondaryMeta: string | null = null`, input `badge: string | null = null`,
  and a default slot (D-2).
- Mock drift the component corrects: eager loading on the second and third
  studio cards (D-9); "Permit info may be out of date" on spot cards (D-10);
  `.location-card` on the `<li>` (D-1); the inline name style on the guide
  entry's rank row (D-8).

## Decisions

- **D-1** *The DS writes `<li class="location-card">`; ICD-002 makes the card an element component inside application-written `<li>` items. Where does the class go?* On the `st-location-card` host, inside a bare `<li>`. ICD §9.5 and the §13 integration example fix that structure, the list semantics are unchanged, and page objects select `.location-card` either way.
- **D-2** *Spot cards (best-use tags, the permit summary, the permit stale badge) and guide cards (summary, count and date) cannot be built with the ICD 1.0.0 inputs, and the application may not write `.location-card__meta` or `.badge` itself (ICD-DOM-4).* Three additive changes (ICD-002 1.1.0): a default slot for non-interactive body content (`st-tag-list` or one summary `<p>`), `secondaryMeta: string | null = null` for the second meta line, and `badge: string | null = null` for a stale flag that belongs to no fact. Existing configurations are unaffected. Fact badges stay for studio prices, because the same `Fact` carries the flag on the summary panel and in the comparison.
- **D-3** *Is the compact item beside the map (`.map-list-item`) this component?* No. ICD-002 §11.2 assigns `.map-list-item*` and `.map-page*` to application CSS and §9.5 does not list the map among the card's users; its layout (88 px thumbnail beside three lines, no facts, badges, rank or actions) is a different component. The map page's list is also not `ul[st-location-grid]`, whose columns are fixed by L2-021.4 (D-4) while the map pane needs one column at LG. The application's map list item renders its own markup and styles it in feature CSS; it reuses `st-responsive-image` for the thumbnail.
- **D-4** *Columns at LG beside the 15rem filter sidebar: L2-021.4 asks for three "at LG and above"; the DS draws two from 62rem and three from 75rem (`.browse__results .location-grid`) and recorded the question.* Three columns from 62rem everywhere, following L2; the `.browse__results` override is not ported. It would also have been application CSS styling a library block (ICD-DOM-5). Listed as a conflict for the owner: amending L2-021.4 would bring back two columns at LG through an additive grid input.
- **D-5** *The DS lets taps beside the toggle reach the stretched link with `pointer-events: none` on the actions row and `auto` on its children, but the card's encapsulated CSS cannot select projected children.* The actions row shrink-wraps its content (`align-self: flex-start`) and keeps normal pointer events, so the empty width beside the toggle is the stretched link and the toggle is clickable. Same look, same hit areas.
- **D-6** *Should the tag list be raised above the stretched link, as `.location-card .tags` is in the DS?* No. Card tags are plain `li.tag` (DS do and don't), so raising them only created the dead zone the DS then patched; under the link, a tap on a tag opens the card. The default slot must therefore never hold a link or control.
- **D-7** *A card without actions (home, guides) must not show an empty row, but the component may not query projected content (ICD-API-9).* `.location-card__actions:empty { display: none; }`: Angular projects nothing into an unused slot and strips template whitespace, so the row is empty and takes no space.
- **D-8** *The rank disc `.guide-entry__rank` is application CSS per ICD §11.2, but the card renders it (ICD §9.5) inside its encapsulated template; and the mock styles the rank row inline.* The card's stylesheet owns the `.guide-entry__rank` rule and styles its `.cluster` rank row (`gap: --space-3`, `flex-wrap: nowrap`) without inline styles. Reported as an ICD §11.2 clarification (patch).
- **D-9** *The studio list mock gives the second and third cards `loading="eager"` too.* Only the first card is eager with `fetchpriority="high"` (ICD-MEDIA-2, L2-072.2); the rest are lazy.
- **D-10** *Spot cards say "Permit info may be out of date"; the spot page and the DS badge page say "Permit rules may be out of date".* "Permit rules may be out of date", as the DS badge page decided; the copy is the application's.
- **D-11** *Where do badges go and in what order when a card has several?* After the facts, the body and the secondary meta, before the actions: one `<p>` per fact with a `badge`, in fact order, then `badge`. That is where the DS puts the studio badge and the spot badge.
- **D-12** *What does a card show with no image or a failed one?* No image: the empty 3:2 `--color-bg-photo` frame. Failed: `st-responsive-image` with `decorative` shows `.media-fallback` with the icon only, since the photo carries no information (DS States, L2-086.1).
- **D-13** *The DS zooms the `img`, which lives inside `st-responsive-image`'s template where the card's CSS cannot reach.* The card scales the `st-responsive-image` host inside the clipped frame; the result is the same zoom.
- **D-14** *The guides mock wraps the update date in `<time datetime>`; ICD `meta` is a string.* Card meta lines are plain text. No L2 requirement needs machine-readable dates on cards, and a composed line ("3 studios · Updated 3 Oct 2026") would need a new type.
- **D-15** *ICD §13 sets `aria-busy` on the grid; the mocks and the feedback pattern set `aria-busy` on the results region and `aria-hidden="true"` on the skeleton grid.* The mocks' structure: the application marks the region busy and hides the grid; each skeleton host is also `aria-hidden="true"` so a grid left unhidden never announces six empty items.
- **D-16** *What does `Fact.numeric` do on a card?* Nothing: every fact value on a card is already in tabular figures.
- **D-17** *ICD §9.5 lists "rain backup" among the card's users.* The rain-backup studios are `.list__item` rows (DS location-card *Overview* and the spot mock); the card is not used there.
