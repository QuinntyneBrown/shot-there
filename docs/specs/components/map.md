# Map

| Field | Value |
|---|---|
| Selector | Library: `st-map-legend`, `st-map-unavailable`; global classes `.map-marker`, `.map-marker--studio`, `.map-marker--spot`, `.map-legend__key--studio`, `.map-legend__key--spot`. Application: `st-locations-map`, `st-spot-map`, `li[st-map-location-card]`, the map page layout (`MapPageComponent`) |
| Library path | `frontend/projects/components/src/lib/map-legend/`, `frontend/projects/components/src/lib/map-unavailable/`, `frontend/projects/components/styles/utilities.css` (markers); application `frontend/projects/shot-there/src/app/features/map/` (`map-page/`, `locations-map/`, `map-location-card/`) and `frontend/projects/shot-there/src/app/core/map/spot-map/` (D-9) |
| Status | planned |
| Traces to | L2-014, L2-026, L2-027, L2-028, L2-029, L2-055, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071, L2-086 |
| Design system | [`map.html`](../../design-system/components/map.html), [`popover.html`](../../design-system/components/popover.html) |
| Source mocks | [`pages/map/default`](../../mocks/pages/map/default.html), [`pages/map/list`](../../mocks/pages/map/list.html), [`pages/map/loading`](../../mocks/pages/map/loading.html), [`pages/map/empty`](../../mocks/pages/map/empty.html), [`pages/map/error`](../../mocks/pages/map/error.html), [`pages/map/studios-only`](../../mocks/pages/map/studios-only.html), [`pages/map/tiles-failed`](../../mocks/pages/map/tiles-failed.html), [`dialogs/map-popup/default`](../../mocks/dialogs/map-popup/default.html), [`dialogs/map-popup/spot`](../../mocks/dialogs/map-popup/spot.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/map-failed`](../../mocks/pages/spot/map-failed.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/new`](../../mocks/pages/spot-editor/new.html), [`pages/spot-editor/invalid`](../../mocks/pages/spot-editor/invalid.html) |
| Rendering | [`map.html`](map.html) |

## Purpose and scope

Where a location is matters as much as what it costs. The map shows every
reviewed studio and outdoor spot in Toronto, tells the two apart by shape (ink
squares for studios, ringed circles for spots), and opens a short popup that
leads to the review. One map frame, `.static-map`, appears in three places: the
locations map on the map page (L2-027 to L2-029), the spot map on an outdoor spot
review (L2-014), and the preview map in the spot editor (L2-055). When the tile
service fails, `st-map-unavailable` takes the frame's place at the same size
and the page carries on (L2-086.2).

The map engine is the application's and is out of scope (ICD-002 D-6). This CRD
specifies what crosses the boundary and what every map must render whatever
engine is chosen: the library's legend and tiles-failed message, the global
marker classes the engine's marker elements carry, and the application's map
parts: the frame, the marker DOM contract, the map page layout, the spot and
preview maps and the list rows. The popup is [`st-map-popup`](popover.md).
Use a [location card grid](location-card.md) for a list of locations to choose
from, and a list for distances to rain-backup studios.

Out of scope:

- The map engine, tile provider, projection, zoom and pan, clustering, and how
  latitude and longitude become `left` and `top` (ICD-002 D-6).
- The popup's markup, close button, Escape handling and docking:
  [`st-map-popup`](popover.md). This CRD specifies when it opens, what it is
  given and where focus goes around it.
- The type filter and view toggle controls: [`st-segmented`](button-group.md);
  the count: `st-result-count`; the empty and error panels:
  [`st-empty-state`](empty-state.md); skeletons: [`st-skeleton`](skeleton.md).
- Loading `MapLocation`s, filtering by type, URL state (`?type=`, `?view=`),
  formatting the key fact: `MapPageComponent` and plain TypeScript beside it.
- The editor's coordinate fields and their validation messages
  ([`st-text-field`](text-field.md)); the preview only reads valid coordinates.

## Usage

Every `.static-map`, `.map-marker`, `.map-legend`, `.map-unavailable`,
`.map-page` and `.map-list-item` in `docs/mocks/` (inventory from
`usage_inventory.py` for each block, plus grep).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/map/default` | `.map-page[data-view="map"]`; bar with h1 "Map", filter "Show" (Both, Studios, Spots), toggle "View as" (Map, List), hidden status "12 locations"; list column; `.static-map` with tiles, 12 marker buttons, `st-map-legend` overlay | Markers "Evergreen Brick Works, outdoor spot" … "Humber Bay Arch Bridge, outdoor spot"; legend "Studio", "Outdoor spot" | default, hover, focus | full-bleed frame on canvas |
| `dialogs/map-popup/default`, `spot` | as default, one marker `aria-expanded="true"` with `aria-controls`; `st-map-popup` docked on phones | "Studio · The Junction Loft · All-in for 2 hours: $145.00 · View the review"; "Outdoor spot · Evergreen Brick Works · Portraits: no permit needed · View the spot" | selected, popup open | raised popup over tiles |
| `pages/map/studios-only` | filter "Studios" pressed; 7 studio markers; list shows the same 7 | status "7 locations" | filtered | frame |
| `pages/map/list` | `data-view="list"` (below LG the map is hidden) | 12 `.map-list-item` rows, alphabetical | list view | canvas |
| `pages/map/loading` | frame with a full-bleed skeleton, `aria-busy`; list `aria-busy` with 6 skeleton rows (`aria-hidden`) | status "Loading locations…" | loading | frame |
| `pages/map/empty` | tiles stay; raised panel over the map | `st-empty-state` compact "No locations on the map yet", action "Get new reviews by email"; list "No locations yet."; status "0 locations" | empty | raised panel over tiles |
| `pages/map/error` | tiles stay; raised panel, `role="alert"` | `st-empty-state` compact error "We couldn't load the locations", "Try again", "Browse studios"; list "Locations didn't load." | error | raised panel |
| `pages/map/tiles-failed` | `st-map-unavailable` fills the frame | "The map didn't load", "The list of locations still works.", `a[st-button]` "Show the list" with `.until-lg` | tiles failed | sunken panel |
| `pages/spot/default`, `no-video`, `no-rain-backup`, `stale-permit` | `.static-map.static-map--spot` 16:9, `role="region"` "Map centred on Evergreen Brick Works"; one `span.map-marker--spot[role="img"]` | coordinates line below ("43.6846, −79.3653 · in the Don Valley below Bayview Ave", the page's) | default | canvas |
| `pages/spot/map-failed` | `st-map-unavailable` in the 16:9 slot, `role="status"` | "The map didn't load", "43.6846, −79.3653", `a[st-link][external]` "Open in Google Maps" | tiles failed | sunken panel |
| `pages/spot-editor/default`, `published`, `submitting`, `success` | `.static-map.preview-map` 16:9, 12rem floor; marker `role="img"` "Preview position"; help "The preview moves as you type." | Scarborough Bluffs 43.7056, −79.2310 | default | editor section |
| `pages/spot-editor/new` | preview with no marker | help "Enter both coordinates to place the marker. The preview moves as you type." | no coordinates | editor section |
| `pages/spot-editor/invalid` | preview with no marker | help "The marker returns when the coordinates are in range." | out of range | editor section |

Every row above is buildable with the APIs below: the legend and tiles-failed
message are library inputs and slots; markers are elements the application's
map wrappers create with the global classes; the frame, page layout, spot and
preview maps and list rows are the application's parts specified here.

## Anatomy

1. **Frame** — `.static-map` (application CSS): `position: relative`, full
   width, `min-height: 15rem`, `--radius-lg`, `overflow: hidden`,
   `--color-bg-surface-sunken` ground, `isolation: isolate`.
   `.static-map--spot` is 16:9; `.preview-map` 16:9 with a 12rem floor; on the
   map page the frame fills `.map-page__map` with no radius.
2. **Tiles** — `img.static-map__tiles` (or the engine's tile layer) covering the
   frame behind everything (`z-index: -1`), `alt=""`.
3. **Marker** — `.map-marker` (global): a 44 × 44 transparent target
   (`--target-comfortable`) centred on its point (`translate: -50% -50%`), whose
   `::before` is the 24 px mark (`--space-6`) inside a 2 px `--color-bg-surface`
   halo (`--border-width-thick`) and `--shadow-2`.
   - `--studio`: an ink square, `--color-action`, `--radius-xs`.
   - `--spot`: a `--color-bg-surface` circle with a 4 px (`--space-1`)
     `--color-fg-default` ring.
4. **Legend** — `st-map-legend` → `ul.map-legend` of two `li`s, each a 16 px key
   (`.map-legend__key--studio|--spot`, `aria-hidden`) and its word;
   `--overlay` pins it bottom-left on a raised surface.
5. **Popup** — [`st-map-popup`](popover.md), floated 32 px above the selected
   marker, docked along the bottom of the frame below 48rem.
6. **Overlay** — `.static-map__overlay` (application): fills the frame and
   centres a `.static-map__panel` (D-6) holding the empty or error state.
7. **Tiles failed** — `st-map-unavailable` → host `.map-unavailable`: fills the
   frame on the sunken ground; map-pin icon, title, text, actions.
8. **Map page** — `.map-page` (application) with `__bar`, `__toggle`, `__list`
   and `__map`; `data-view="map|list"` picks the view below LG.
9. **List row** — `li.map-list-item` (application): 5.5rem 3:2 thumbnail
   (`.location-card__media`), name (`.location-card__name`, a stretched link),
   kind and neighbourhood, key fact (`.location-card__meta` × 2).

Hosts: `st-map-legend` has `display: contents` and renders the `ul` (the list
must be a native `ul`). `st-map-unavailable`'s host carries the block class
`.map-unavailable` and `role="status"` (ICD-DOM-1). Markers have no Angular
host: the map wrappers create them for the engine.

## API

### `st-map-legend`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `studioLabel` | `string` | — | yes | The studio key's word: "Studio". |
| `spotLabel` | `string` | — | yes | The spot key's word: "Outdoor spot". |
| `overlay` | `boolean` | `false` | no | Adds `.map-legend--overlay`: pinned bottom-left inside the nearest positioned frame on `--color-bg-surface-raised` with `--shadow-2`. The map page uses it; without it the legend is muted text for use beside a map. |
| `label` | `string` | §12 `st.mapLegend.label` "Legend" | no | The `ul`'s `aria-label`. ICD change (ICD-002 1.1.0, additive), D-1. |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The legend is not interactive. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | The two keys are fixed; the words are inputs. |

### `st-map-unavailable`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | `<strong>`: "The map didn't load". |
| `text` | `string \| null` | `null` | no | `<p class="num">` after the title: the coordinates "43.6846, −79.3653" on a spot review, "The list of locations still works." on the map page. `null` renders no paragraph (D-2). |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The actions are the consumer's links and buttons. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `actions` | `a[st-link][external]` "Open in Google Maps"; `a[st-button]` "Show the list" with `.until-lg` | Projected after the text, centred. |

The icon is `st-icon name="map-pin"`, decorative. The component renders no
other text (ICD-I18N-3).

### Global marker classes

Shipped in the library's global stylesheet (ICD-002 §11.1) because the engine
creates marker elements outside Angular templates. The application's map
wrappers create them with exactly these classes and attributes:

| Class / attribute | On | Rule |
|---|---|---|
| `.map-marker` | `button type="button"` (locations map) or `span role="img"` (spot and preview maps) | 44 × 44 target centred on `left` / `top` (set inline by the wrapper from the engine's projection). |
| `.map-marker--studio` / `--spot` | the same element | The mark's shape: square or ringed circle. Exactly one. |
| `aria-label` | every marker | Locations map: "The Junction Loft, studio", "Evergreen Brick Works, outdoor spot". Spot map: "Evergreen Brick Works". Preview: "Preview position". |
| `aria-haspopup="dialog"`, `aria-expanded="false\|true"` | marker buttons | `true` while that marker's popup is open: the selected look. |
| `aria-controls` | marker buttons, while open | The popup's ID. Removed when it closes. |
| `[role="img"]` | static markers | No pointer cursor and no hover scale (D-3). |
| `.map-legend__key--studio`, `--spot` | legend keys | Global per ICD-002 §11.1; the legend's own keys use them. |

### `st-locations-map` (application, `LocationsMapComponent`)

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `locations` | `readonly MapLocationView[]` | — | yes | The visible locations, already filtered by type. One marker each, tracked by `slug`, in reading order (D-4). |
| `loading` | `boolean` | `false` | no | Replaces tiles and markers with a full-bleed `st-skeleton` and sets `aria-busy="true"` on the frame. |

| Output | Payload | Emitted when |
|---|---|---|
| None | | Popups open and close inside the component; "Show the list" is a router link to `?view=list`. |

| Slot | Accepts | Rule |
|---|---|---|
| `overlay` | one `st-empty-state` (compact; error tone with `role="alert"`) | Rendered in `.static-map__overlay > .static-map__panel` over the tiles when present (D-6). |

`MapLocationView` (application type, one file): `{ slug: string; kind: 'studio' | 'spot'; name: string; markerLabel: string; kindLabel: string; area: string; fact: string; link: string; linkText: string; image: ResponsiveImage | null; latitude: number; longitude: number }`, built from the `MapLocation` DTO by the page's view model ("Studio", "Outdoor spot", "All-in for 2 hours: $145.00", "Portraits: no permit needed", "View the review", "View the spot"). `area` and `image` are not in today's DTO (D-10).

The component renders the frame, tiles, markers, the `st-map-legend` overlay
(labels `i18n` in its template), at most one `st-map-popup`, the overlay slot,
and, when the engine reports a tile failure, `st-map-unavailable` with "The map
didn't load", "The list of locations still works." and an `a[st-button]` "Show
the list" with `.until-lg`.

### `st-spot-map` (application, `SpotMapComponent`)

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `name` | `string` | — | yes | The spot marker's name and the region's "Map centred on {name}". |
| `latitude` | `number \| null` | `null` | no | With `longitude`, centres the map and places the one marker. Either `null` removes the marker (D-5). |
| `longitude` | `number \| null` | `null` | no | As above. |
| `preview` | `boolean` | `false` | no | Editor preview: `.preview-map`, `role="group"`, `aria-label` "Map preview", marker "Preview position". Otherwise `.static-map--spot` with `role="region"`. |
| `describedBy` | `string \| null` | `null` | no | ID of the help text under the preview; set as `aria-describedby`. |

No outputs, no slots. On a tile failure it renders `st-map-unavailable` with
"The map didn't load", the coordinates "43.6846, −79.3653" (four decimals, true
minus sign) and an `a[st-link][external]` "Open in Google Maps" to
`https://www.google.com/maps/search/?api=1&query=43.6846,-79.3653`.

### `li[st-map-location-card]` (application, `MapLocationCardComponent`)

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `location` | `MapLocationView` | — | yes | Renders the thumbnail, name link, "{kindLabel} · {area}" and the key fact. |
| `headingLevel` | `HeadingLevel` | `3` | no | The name's heading level under the list's `h2`. |

The host is the `li` and carries `.map-list-item`. Loading rows are not this
component: the page writes them as `li.map-list-item` holding skeletons (D-7).

### Map page layout (application, `MapPageComponent`)

Routed page in `features/map/map-page/`. Its host carries `.map-page` and
`data-view` (`'map' | 'list'`, from `MapViewQuery.view`). Template: `.map-page__bar`
(h1 "Map", `st-segmented` "Show", `st-segmented.map-page__toggle` "View as",
`st-result-count.visually-hidden`), `section.map-page__list` (hidden h2
"Locations", `ul.map-page__items` of `li[st-map-location-card]`, D-8), and
`.map-page__map` holding `st-locations-map`.

## Variants and sizes

| Variant | Classes | Use for |
|---|---|---|
| Locations map | `.static-map` in `.map-page__map` | Every published location; interactive markers; legend overlay; popup. |
| Spot map | `.static-map.static-map--spot` | One spot on its review; a picture, nothing focusable. |
| Preview map | `.static-map.preview-map` | The spot editor; follows valid coordinates. |
| Legend, overlay | `.map-legend.map-legend--overlay` | The map page. |
| Legend, inline | `.map-legend` | Beside a map (no screen today). |
| Studio marker | `.map-marker--studio` | Ink square. |
| Spot marker | `.map-marker--spot` | Ringed circle. |
| Tiles failed | `.map-unavailable` | Any frame whose tiles failed. |

| Part | Size | Token |
|---|---|---|
| Marker target | 44 × 44 | `--target-comfortable` |
| Marker mark | 24 px; hover 1.15×; selected 1.2× | `--space-6` |
| Halo / spot ring | 2 px / 4 px | `--border-width-thick` / `--space-1` |
| Legend key | 16 px | `--space-4` |
| `.static-map` | full width, at least 15rem (240 px) | — |
| `.static-map--spot` | 16:9, never below 240 px | — |
| `.preview-map` | 16:9, at least 12rem | — |
| Map page map, below LG | `100dvh − --layout-topbar-height − 7rem`, at least 18rem | `--layout-topbar-height` |
| Map page, LG and up | full viewport below the header; list column 24rem | `--layout-topbar-height` |
| List thumbnail | 5.5rem, 3:2, `--radius-md` | `--radius-md` |

## States

### Markers

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Mark at 1×, halo and shadow | Button "The Junction Loft, studio", collapsed |
| Hover | `:hover` | Mark scales to 1.15 over `--duration-fast`; nothing else is revealed | — |
| Focus | `:focus-visible` | Shared ring (`--focus-ring-width`, `--color-focus-ring`, `--focus-ring-offset`) round the 44 px target, `border-radius: full` | Focus on the marker |
| Active | `:active` | No style of its own: the hover scale shows until the popup opens | — |
| Selected | `aria-expanded="true"` | Mark 1.2× plus a second `--color-accent` ring outside the halo | "expanded"; `aria-controls` names the popup |
| Disabled | — | Never: unpublished locations get no marker | — |
| Static | `role="img"` | Default look; no hover scale; default cursor (D-3) | Image "Evergreen Brick Works" |

### Maps

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Loading | `loading` (locations map) | Full-bleed skeleton in the frame; list rows are skeletons | Frame and list `aria-busy="true"`; status "Loading locations…" |
| Ready | locations loaded | Tiles, markers in reading order, legend | Status "12 locations" |
| Filtered | type "Studios" or "Spots" | Only that kind's markers; the list matches | Status "7 locations" |
| Popup open | marker activated | Selected marker; popup above it (docked below 48rem) | Focus in the popup; Escape returns it to the marker |
| Empty | no locations | Tiles stay; raised panel with the empty state | Status "0 locations" |
| Error | locations request failed | Tiles stay; raised panel, error tone, "Try again" | Panel `role="alert"`; status "Locations didn't load" |
| Tiles failed | engine reports tile failure | `st-map-unavailable` fills the frame at its size | `role="status"`, announced politely |
| No marker (preview) | coordinate missing or out of range | Tiles stay at the last valid centre (Toronto for a new spot); no marker | Help text explains (the page's) |
| List view | `data-view="list"` below LG | Map hidden, list shown | — |

## Markup

```html
<!-- rendered: st-map-legend overlay -->
<ul class="map-legend map-legend--overlay" aria-label="Legend">
  <li><span class="map-legend__key map-legend__key--studio" aria-hidden="true"></span>Studio</li>
  <li><span class="map-legend__key map-legend__key--spot" aria-hidden="true"></span>Outdoor spot</li>
</ul>
```

```html
<!-- rendered: st-map-unavailable on a spot review -->
<st-map-unavailable class="map-unavailable" role="status">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
  <strong>The map didn't load</strong>
  <p class="num">43.6846, −79.3653</p>
  <a class="link--external" href="https://www.google.com/maps/search/?api=1&amp;query=43.6846,-79.3653" target="_blank" rel="noopener">Open in Google Maps<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg><span class="visually-hidden"> (opens in a new tab)</span></a>
</st-map-unavailable>
```

```html
<!-- rendered: st-locations-map, popup open on The Junction Loft -->
<div class="static-map">
  <img class="static-map__tiles" src="…" alt="" width="1600" height="1000">
  <button class="map-marker map-marker--spot" type="button" style="left: 61%; top: 31%;"
          aria-label="Evergreen Brick Works, outdoor spot" aria-haspopup="dialog" aria-expanded="false"></button>
  <button class="map-marker map-marker--studio" type="button" style="left: 20%; top: 40%;"
          aria-label="The Junction Loft, studio" aria-haspopup="dialog" aria-expanded="true" aria-controls="map-popup"></button>
  …
  <ul class="map-legend map-legend--overlay" aria-label="Legend">…</ul>
  <st-map-popup …><!-- popover.md: .popover.map-popup#map-popup role="dialog" --></st-map-popup>
</div>
```

```html
<!-- rendered: loading, empty / error overlay -->
<div class="static-map" aria-busy="true"><st-skeleton class="skeleton" …></st-skeleton></div>

<div class="static-map">
  <img class="static-map__tiles" src="…" alt="">
  <div class="static-map__overlay"><div class="static-map__panel">
    <st-empty-state class="empty empty--compact empty--error" role="alert">…We couldn't load the locations…</st-empty-state>
  </div></div>
</div>
```

```html
<!-- rendered: st-spot-map, review and preview -->
<div class="static-map static-map--spot" role="region" aria-label="Map centred on Evergreen Brick Works">
  <img class="static-map__tiles" src="…" alt="" width="1200" height="675">
  <span class="map-marker map-marker--spot" role="img" aria-label="Evergreen Brick Works" style="left: 50%; top: 50%;"></span>
</div>

<div class="static-map preview-map" role="group" aria-label="Map preview" aria-describedby="map-help">
  <img class="static-map__tiles" src="…" alt="" width="1200" height="675">
  <span class="map-marker map-marker--spot" role="img" aria-label="Preview position" style="left: 50%; top: 50%;"></span>
</div>
```

```html
<!-- rendered: map page with one list row -->
<st-map-page class="map-page" data-view="map">
  <div class="map-page__bar">
    <h1>Map</h1>
    <div class="segmented" role="group" aria-label="Show">…Both, Studios, Spots…</div>
    <div class="segmented map-page__toggle" role="group" aria-label="View as">…Map, List…</div>
    <p class="result-count visually-hidden" role="status" aria-live="polite">12 locations</p>
  </div>
  <section class="map-page__list" aria-labelledby="list-title">
    <h2 class="visually-hidden" id="list-title">Locations</h2>
    <ul class="map-page__items">
      <li class="map-list-item">
        <div class="location-card__media"><picture>…<img src="…" alt="" width="1200" height="800" loading="lazy"></picture></div>
        <h3 class="location-card__name"><a href="/studios/the-junction-loft">The Junction Loft</a></h3>
        <p class="location-card__meta">Studio · Junction</p>
        <p class="location-card__meta">All-in for 2 hours: $145.00</p>
      </li>
    </ul>
  </section>
  <div class="map-page__map"><st-locations-map …></st-locations-map></div>
</st-map-page>
```

```html
<!-- consumer: library parts inside LocationsMapComponent and SpotMapComponent -->
<st-map-legend overlay i18n-studioLabel studioLabel="Studio" i18n-spotLabel spotLabel="Outdoor spot" />

<st-map-unavailable i18n-title title="The map didn't load" [text]="coordinatesText()">
  <a st-link external slot="actions" [href]="externalMapUrl()" i18n>Open in Google Maps</a>
</st-map-unavailable>

<st-map-unavailable i18n-title title="The map didn't load" i18n-text text="The list of locations still works.">
  <a st-button slot="actions" class="until-lg" [routerLink]="[]" [queryParams]="{ view: 'list' }" queryParamsHandling="merge" i18n>Show the list</a>
</st-map-unavailable>
```

## Design

- Marker: target `--target-comfortable`, `padding: 0`, no border or background,
  `cursor: pointer`; mark `--space-6`, halo `0 0 0 var(--border-width-thick) var(--color-bg-surface)` plus `--shadow-2`;
  studio fill `--color-action` at `--radius-xs`; spot fill `--color-bg-surface`
  with a `--space-1` `--color-fg-default` border, `--radius-full`; hover
  `scale: 1.15`; selected `scale: 1.2` and a second ring of
  `calc(var(--border-width-thick) * 2)` in `--color-accent`; focus ring rounds
  with `border-radius: var(--radius-full)`. Transition `scale` over
  `--duration-fast` with `--ease-standard`.
- Legend: flex, wrapping, gap `--space-2` × `--space-5`, `--text-body-sm` in
  `--color-fg-muted`; keys `--space-4`, studio `--color-action` square at
  `--radius-xs`, spot `--border-width-thick` `--color-fg-default` ring. Overlay:
  `position: absolute`, `left` and `bottom` `--space-3`, padding `--space-2` ×
  `--space-3`, `--color-bg-surface-raised`, `--color-fg-default`, `--radius-md`,
  `--shadow-2`.
- Tiles failed: `position: absolute; inset: 0`, grid centred, gap `--space-2`,
  padding `--space-6`, centred text, `--color-bg-surface-sunken`,
  `--color-fg-muted`; title `--text-label` at `--font-size-md` in
  `--color-fg-default`; text at most 32ch.
- Frame: `--radius-lg`; overlay `inset: 0`, padding `--space-4`, grid centred;
  panel `--color-bg-surface-raised`, `--radius-lg`, `--shadow-3`, at most 24rem
  wide (D-6).
- Map page: bar wraps, gap `--space-1` × `--space-4`, padding `--space-2` ×
  `--layout-margin`, h1 at `--text-h3`; list padding `--space-4` ×
  `--layout-margin` × `--space-8`; items one column, gap `--space-6`; two columns
  from 36rem to 62rem; from 62rem a `24rem` list column with a hairline
  `--color-border-default` divider and the map filling the rest.
- List row: grid `5.5rem minmax(0, 1fr)`, gap `--space-1` × `--space-3`; name
  `--text-label` at `--font-size-md`; meta `--text-body-sm` in `--color-fg-muted`;
  focus ring round the whole row (`outline-offset: var(--space-2)`,
  `--radius-md`).
- Layers: popup `--z-popover`; legend and markers within the isolated frame.
- No component tokens: a re-skin overrides semantic tokens on the frame.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Studio mark, studio key | `--color-action` | `--palette-stone-950` | `--palette-stone-100` |
| Halo, spot fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Spot ring, spot key | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Selected ring | `--color-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Legend overlay, empty panel | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Frame ground, tiles-failed panel | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Legend text, failed text, list meta | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| List column divider | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-action` | `--color-bg-surface` | 3:1 | Studio mark inside its halo |
| `--color-fg-default` | `--color-bg-surface` | 3:1 | Spot ring on its fill and halo |
| `--color-accent` | `--color-bg-surface` | 3:1 | Selected ring against the halo |
| `--color-action` | `--color-bg-surface-raised` | 3:1 | Legend studio key on the overlay |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Legend overlay text, spot key |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Inline legend text |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | "The map didn't load" |
| `--color-fg-muted` | `--color-bg-surface-sunken` | 4.5:1 | Tiles-failed text |
| `--color-fg-link` | `--color-bg-surface-sunken` | 4.5:1 | "Open in Google Maps" |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | List row meta |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring round a marker (on its halo) |
| `--color-focus-ring` | `--color-bg-surface-sunken` | 3:1 | Focus ring on the tiles-failed link |

Tiles are content: no token controls them, so every mark carries its own
surface halo and shadow. Forced colours: markers and legend keys set
`forced-color-adjust: none` and draw the studio mark in `CanvasText`, the spot
as a `Canvas` circle with a `CanvasText` ring, the halo in `Canvas` and the
selected ring in `Highlight` (D-11).

## Responsive behaviour

- XS to MD (below 62rem): the map page shows one view at a time;
  `data-view="map|list"` hides the other; the toggle sits in the bar; the map
  fills the viewport below the header and bar (`100dvh − --layout-topbar-height − 7rem`,
  at least 18rem) (L2-029.1). List: one column at XS, two from 36rem.
- LG and up (62rem): a 24rem scrolling list column beside the map, both filling
  the viewport below the header; the toggle is hidden (L2-029.3).
- Popup: floats above its marker from 48rem; docked across the bottom of the
  frame below 48rem ([popover.md](popover.md)).
- Spot and preview maps are full content width at every size; the spot map is
  never under 240 px (L2-014.4), so at 320 px it is taller than 16:9.
- "Show the list" in the tiles-failed message is shown below LG only
  (`.until-lg`), where the list is behind the toggle.
- Nothing scrolls sideways: the frame clips tiles and markers; the bar wraps.
- Landscape at SM (640 × 360): the 18rem floor keeps the map usable and the
  page scrolls vertically to reach it; the bar and toggle stay operable (L2-066.2).
- Every marker target is 44 × 44 at every size; the legend, popup close and
  links meet 24 × 24 at least.

## Accessibility

### Role and pattern

- Locations-map markers are native `<button type="button">` with
  `aria-haspopup="dialog"`, `aria-expanded` and, while open, `aria-controls`
  ([APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)). The popup is
  a non-modal `role="dialog"` ([popover.md](popover.md)).
- Spot map: `role="region"` named "Map centred on Evergreen Brick Works", holding
  one `role="img"` marker named "Evergreen Brick Works"; nothing focusable.
- Preview map: `role="group"` named "Map preview", described by the help text.
- Legend: a `ul` named "Legend"; keys `aria-hidden`, words carry the meaning.
- Tiles failed: `role="status"`, so the change after load is announced politely.
- Tiles images: `alt=""`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Map page: type filter, view toggle (below LG), list rows (from LG, or in list view), then each marker in reading order (L2-028.3). Spot review: one Tab passes the whole map (L2-014.3). |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | On a marker: opens its popup, marks it selected and moves focus into the popup (to its heading's dialog, then the link). |
| <kbd>Tab</kbd> in the popup | "View the review" (or "View the spot"), then Close, then on to the next marker. |
| <kbd>Esc</kbd> | Closes the popup and returns focus to its marker (L2-028.2). Close does the same. |

### Focus

- The ring draws round the 44 px target, outside the halo, so it shows on any
  tile. Focus never lands on the tiles, the legend or a static marker.
- Opening a marker's popup closes any other; closing returns focus to the
  marker that opened it (`st-map-popup` emits `closed`; `LocationsMapComponent`
  focuses the marker).
- In the list, `.map-list-item` draws the ring round the whole row when its name
  link has `:focus-visible`.
- Switching to list view or back keeps focus on the toggle button pressed.

### Labelling

- Marker names say the location and its kind, because the shape that tells them
  apart is visual: "The Junction Loft, studio", "Evergreen Brick Works, outdoor spot".
- The legend's words "Studio" and "Outdoor spot" match the popup's kind line and
  the list meta.
- "Open in Google Maps" carries the hidden "(opens in a new tab)" from `a[st-link][external]`.
- List thumbnails are decorative (`alt=""`); the name link names the row.

### Announcements

- The count ("12 locations", "7 locations", "Loading locations…", "0 locations",
  "Locations didn't load") is `st-result-count`'s polite live region; the page
  does not also use `AnnouncerService` (ICD-A11Y-4).
- The tiles-failed message announces itself (`role="status"`); the error panel
  is `role="alert"`.

### Motion

Marks scale on hover and selection over `--duration-fast`; the popup scales in
(popover.md). Under `prefers-reduced-motion: reduce` the tokens zero both
durations, so the change still happens instantly, and the loading skeleton's
shimmer stops (design-system rule, no AC).

## Content and internationalisation

- Kinds: "Studio" and "Outdoor spot" in the popup, the legend and the list meta
  ("Studio · Junction", "Outdoor spot · Don Valley").
- Key fact: "All-in for 2 hours: $145.00" for a studio, "Portraits: no permit
  needed" or "Portraits: permit required" for a spot, the same wording in the
  popup and the list (D-12).
- Popup link: "View the review" for a studio, "View the spot" for a spot, the
  name as hidden context.
- Filter "Both", "Studios", "Spots"; toggle "Map", "List"; count "12 locations".
- Tiles failed: "The map didn't load", then what still works: "The list of
  locations still works." on the map page; the coordinates "43.6846, −79.3653"
  and "Open in Google Maps" on a spot review.
- Empty: "No locations on the map yet" / "The first studio and spot reviews are
  being shot now. Each appears here once it is published." Error: "We couldn't
  load the locations" / "The map is here, but the studio and spot data didn't
  arrive. Try again in a moment." with "Try again" and "Browse studios".
- Coordinates: four decimals, a true minus sign (U+2212) in display text and an
  ASCII hyphen in URLs.
- Translatable: every word above, including the legend labels, the marker kind
  suffix (", studio", ", outdoor spot" via `$localize` placeholders) and the
  library's "Legend". Data: location names, neighbourhoods, prices.
- Longer translations: the legend wraps onto two lines; the overlay keeps its
  corner. Tiles-failed text wraps at 32ch.

## Performance

- Change detection: `OnPush` everywhere; the legend and unavailable components
  have only signal inputs and no logic; `LocationsMapComponent` derives marker
  positions in one `computed` from `locations` and the engine's projection.
- Markers: one element per location, created once per `locations` change and
  tracked by `slug`; a filter change removes and adds elements rather than
  rebuilding the map.
- Browser-only: the engine and tiles load in `afterNextRender` (ICD-SSR-1); the
  server renders the frame (with its reserved size), the list and the legend, so
  the list works without JavaScript and nothing shifts when the map arrives.
- Performance scenario: the `components-harness` route `map/performance` renders
  a 1280 × 640 `.static-map` with the cast's twelve markers (seven studios, five
  spots) as global-class buttons, the `st-map-legend` overlay, and
  `st-map-unavailable`; pressing a marker toggles its `aria-expanded` and must
  stay within the L2-071 INP budget. The map page itself is measured by the
  application's suite against L2-071.2.
- Regression rule: a change to the legend, unavailable component or marker CSS
  is measured on that route against the base branch before it is pushed.
- Layout stability: the frame's size is fixed by CSS (min-height, aspect ratio,
  viewport height) before tiles load; `st-map-unavailable` fills exactly that
  box (L2-086.2).
- Weight: the library parts import only `@angular/core` and `st-icon`; the
  engine is lazy-loaded with the map page and never enters the library.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-map-legend overlay studioLabel="Studio" spotLabel="Outdoor spot" />` inside the map frame, when it renders, then a `ul.map-legend.map-legend--overlay` named "Legend" sits in the frame's bottom-left corner with a square studio key before "Studio" and a ringed spot key before "Outdoor spot", both keys `aria-hidden`. (L2-027)
- **AC-2** Given `<st-map-legend studioLabel="Studio" spotLabel="Outdoor spot" />` without `overlay`, when it renders, then the `ul` has the class `map-legend` only and its text is `--color-fg-muted` at `--text-body-sm`. (L2-027)
- **AC-3** Given `<st-map-legend label="Map key" …>`, when it renders, then the list's accessible name is "Map key". (L2-069)
- **AC-4** Given the map page with the cast's seven studios and five spots, when it loads at 1280 px, then twelve marker buttons are shown, seven with `.map-marker--studio` named like "The Junction Loft, studio" and five with `.map-marker--spot` named like "Evergreen Brick Works, outdoor spot", each with `aria-haspopup="dialog"` and `aria-expanded="false"`. (L2-027)
- **AC-5** Given the map page, when the visitor presses "Studios" in the "Show" filter, then only the seven studio markers remain, the list shows the same seven, and the status reads "7 locations". (L2-027)
- **AC-6** Given Corktown Garage Studio is a draft, when the map page loads, then no marker and no list row is named "Corktown Garage Studio". (L2-027)

### Popup and markers

- **AC-7** Given focus on "The Junction Loft, studio", when the visitor presses Enter, then the marker gets `aria-expanded="true"` and `aria-controls` naming the popup, and the popup shows "Studio", "The Junction Loft", "All-in for 2 hours: $145.00" and a link "View the review: The Junction Loft" to `/studios/the-junction-loft`. (L2-028)
- **AC-8** Given The Junction Loft's popup is open, when the visitor presses Escape, then the popup closes, the marker's `aria-expanded` is "false" and focus is on "The Junction Loft, studio". (L2-028)
- **AC-9** Given The Junction Loft's popup is open, when the visitor activates "Evergreen Brick Works, outdoor spot", then The Junction Loft's popup is closed and only Evergreen Brick Works' marker is expanded. (L2-028)
- **AC-10** Given the map page at 1280 px, when a keyboard user tabs past the filter and the list, then focus visits all twelve markers in top-to-bottom reading order, starting with "Evergreen Brick Works, outdoor spot". (L2-028)
- **AC-11** Given a selected studio marker in the light and the dark theme, when the contrast check runs, then the studio mark, the spot ring and the accent selected ring are each at least 3:1 against the surface halo, and the selected mark is still a square. (L2-068)
- **AC-12** Given a marker with keyboard focus, when it is inspected, then a 2 px `--color-focus-ring` ring surrounds its 44 px target with at least 3:1 contrast against the halo. (L2-067)
- **AC-13** Given the map page at 360 px, when each marker and the popup's Close button are measured, then each target is at least 44 × 44 CSS px. (L2-065)
- **AC-14** Given the pointer over "Bloordale Sun Studio, studio", when the mark scales to 1.15, then no text, link or control appears that was not there before. (L2-065)

### Spot and preview maps

- **AC-15** Given Evergreen Brick Works' page, when it renders, then a region named "Map centred on Evergreen Brick Works" holds exactly one marker, a `role="img"` named "Evergreen Brick Works" at the centre of the frame. (L2-014)
- **AC-16** Given Evergreen Brick Works' page, when a keyboard user tabs into the "Location and map" section, then one Tab moves focus from before the map to the first focusable element after it, and nothing inside the map receives focus. (L2-014)
- **AC-17** Given Evergreen Brick Works' page at 320 px, when the map is measured, then it is at least 240 px tall and as wide as the content column. (L2-014)
- **AC-18** Given the spot editor for Scarborough Bluffs, when the owner changes the coordinates to 43.7056 and −79.2310, then the preview named "Map preview" re-centres on them and shows one "Preview position" marker. (L2-055)
- **AC-19** Given the spot editor, when the owner enters a latitude of 95, then the preview shows no marker and keeps its tiles, and its description reads "The marker returns when the coordinates are in range.". (L2-055)

### Tiles failed

- **AC-20** Given the tile service is unreachable, when Evergreen Brick Works' page renders, then the map's slot keeps its size and shows "The map didn't load", "43.6846, −79.3653" and a link "Open in Google Maps (opens in a new tab)" with `target="_blank"` and `rel="noopener"`, and the "How to get there" section renders unchanged. (L2-086)
- **AC-21** Given the tile service fails after the spot page loads, when `st-map-unavailable` appears, then its host has `role="status"` and a screen reader announces "The map didn't load". (L2-069)
- **AC-22** Given the tile service fails on the map page at 360 px, when the visitor activates "Show the list", then the list view shows the twelve locations; and at 1280 px the "Show the list" link is not displayed. (L2-029)

### Loading, empty and error

- **AC-23** Given the locations are loading, when the map page renders, then the frame shows a full-bleed skeleton with `aria-busy="true"`, the list region is busy with six skeleton rows, and the status reads "Loading locations…". (L2-026)
- **AC-24** Given the locations request fails, when the map page renders, then a raised panel over the tiles with `role="alert"` reads "We couldn't load the locations" with "Try again" and "Browse studios", and activating "Try again" requests the locations again. (L2-026)
- **AC-25** Given no published locations, when the map page renders, then the tiles stay, a raised panel reads "No locations on the map yet" with "Get new reviews by email", and the status reads "0 locations". (L2-069)

### Map page layout

- **AC-26** Given the map page at 360 px, when it loads, then "Map" and "List" toggle buttons are shown, the map fills the viewport below the header and bar (at least 18rem), and `document.documentElement.scrollWidth` equals 360. (L2-029)
- **AC-27** Given the map page at 360 px, when the visitor presses "List", then the map is hidden, the twelve locations are shown as rows in alphabetical order from "Allan Gardens Conservatory", "List" is pressed and the URL has `view=list`. (L2-029)
- **AC-28** Given the map page at 1280 px, when it loads, then the 24rem list and the map are shown side by side and no "Map" / "List" toggle is displayed. (L2-029)
- **AC-29** Given the map page at 640 × 360 (SM landscape), when it loads, then the filter and toggle are operable and the map, reached by scrolling, is at least 18rem tall. (L2-066)
- **AC-30** Given the map page and Evergreen Brick Works' page at 320 px, when they render, then `document.documentElement.scrollWidth` equals 320. (L2-064)
- **AC-31** Given the list view, when a keyboard user tabs to "The Junction Loft", then a 2 px focus ring surrounds the whole row, and the row shows "Studio · Junction" and "All-in for 2 hours: $145.00". (L2-067)

### Screen readers and theming

- **AC-32** Given the map page in its default, popup-open, list and tiles-failed states and Evergreen Brick Works' page, when axe-core scans them in the light and the dark theme at 320 px and 1280 px, then no violation is reported. (L2-069)
- **AC-33** Given the legend overlay and the tiles-failed panel in the light and the dark theme, when the contrast check runs, then the legend words are at least 4.5:1 on the raised surface, the studio key at least 3:1, and the tiles-failed title, text and link at least 4.5:1 on the sunken panel. (L2-068)

### Motion

The design-system rule (no AC; L2 has no motion requirement): marker scale and
the popup's entrance take 0 ms under `prefers-reduced-motion: reduce`, and the
loading shimmer stops ([map.html](../../design-system/components/map.html),
Accessibility › Motion).

### Performance

- **AC-34** Given the `map/performance` harness route with twelve markers and the legend, when a marker is pressed, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Library `map-legend/`: `map-legend.component.ts` (`MapLegendComponent`,
  `st-map-legend`, host `display: contents`), `.html` (the `ul`), `.css`
  (`.map-legend`, `--overlay`, `li`, `.map-legend__key` base).
- Library `map-unavailable/`: `map-unavailable.component.ts`
  (`MapUnavailableComponent`, `st-map-unavailable`; host class `map-unavailable`,
  `role="status"`), `.html` (`st-icon name="map-pin"`, `<strong>`, `@if (text())`
  `<p class="num">`, `<ng-content select="[slot=actions]" />`), `.css`
  (`:host` rules from `.map-unavailable*`).
- Library global (`styles/utilities.css`): `.map-marker`, `--studio`, `--spot`,
  hover, `aria-expanded`, focus radius, the `[role="img"]` rule (D-3), the
  forced-colour rules (D-11), `.map-legend__key--studio`, `--spot`.
- ICD change (ICD-002 1.1.0, additive): `MapLegendComponent` gains `label`,
  input, `string`, default §12 `st.mapLegend.label`; §12 gains
  `st.mapLegend.label` "Legend", override `st-map-legend` `label` (D-1).
  ICD §9.6 marks `st-map-unavailable` "(live)" (patch: it renders
  `role="status"`, ICD-A11Y-4).
- Application: `features/map/map-page/` (`MapPageComponent`, `.map-page*`),
  `features/map/locations-map/` (`LocationsMapComponent`, `.static-map*`,
  marker creation, popup handling), `features/map/map-location-card/`
  (`MapLocationCardComponent`, `.map-list-item*`), `core/map/spot-map/`
  (`SpotMapComponent`, `.static-map--spot`, `.preview-map`), `MapLocationView`
  in its own file beside the page view model.
- Mocks drift the application corrects: markers and Close as `<a href>` become
  `<button type="button">`; inline overlay and panel styles become
  `.static-map__overlay` and `.static-map__panel`; the list rows' inline heading
  font goes; "All-in 2 h: $145.00" in list rows becomes "All-in for 2 hours:
  $145.00"; the preview's `aria-describedby` on a plain `div` gains
  `role="group"` and its name; the map page's tiles-failed message gains
  `role="status"`; the map-page tiles image gets `width="1600" height="1000"`.

## Decisions

- **D-1** *The legend's `ul` is named "Legend" in every mock, but ICD-002 gives
  `st-map-legend` no input for it and the library may render no static text.*
  A new optional input `label` with the library string `st.mapLegend.label`
  "Legend" (additive ICD change), as every other library-named control has.
- **D-2** *The spot review's text is `p.num` (coordinates); the map page's is a
  plain `p`.* The component always renders `<p class="num">`: tabular figures
  change only digits, so the sentence is unaffected and no input is needed.
- **D-3** *`.map-marker` sets a pointer cursor and a hover scale, which on a
  static `role="img"` marker suggest a control that does nothing.*
  `.map-marker[role="img"]` gets `cursor: default` and no hover scale.
- **D-4** *What is "reading order" for markers?* North to south by latitude,
  west to east for equal latitude, so DOM and Tab order follow the map from the
  top; the engine wrapper sorts before creating elements.
- **D-5** *What does the preview show with a missing or out-of-range
  coordinate?* Tiles stay at the last valid centre, Toronto's city centre for a
  new spot; the marker is removed; the help text is the editor's. The preview
  never guesses a position.
- **D-6** *The design system gives the empty or error panel its raised look with
  `.static-map__overlay > .empty`, which targets a library class (ICD-DOM-5).*
  The application wraps `st-empty-state` in `div.static-map__panel` (raised
  surface, `--radius-lg`, `--shadow-3`, at most 24rem), and the skeleton is
  placed with `position: absolute; inset: 0` on its host, read as placement.
- **D-7** *How are list loading rows built?* By the page: six
  `li.map-list-item` rows with a `--rect` skeleton in `.location-card__media`
  and title and two text skeletons, in an `aria-hidden` list inside the busy
  section, as the loading mock does.
- **D-8** *The mock's list is `ul.location-grid`, but the map page needs one
  column (two from 36rem to 62rem), and the application may not restyle
  `ul[st-location-grid]`'s grid (ICD-DOM-5).* The page uses its own
  `ul.map-page__items` with those columns and gap `--space-6`; the rows keep
  their `.map-list-item` contract. The design-system page catches up.
- **D-9** *The detailed designs put `SpotMapComponent` in `features/spots/` and
  reuse it in the spot editor, but features never import other features.* It
  lives in `core/map/spot-map/`, shared by the spot page and the spot editor.
- **D-10** *List rows show a thumbnail and a neighbourhood that the `MapLocation`
  DTO does not carry.* `MapLocationView` has `image` and `area`; `image: null`
  shows the sunken placeholder. The DTO needs `neighbourhood` and `image`
  (ICD-001, additive); until then rows show no thumbnail and no area.
- **D-11** *How do markers survive forced colours, where backgrounds are
  replaced and the studio square would vanish?* Markers and legend keys opt out
  (`forced-color-adjust: none`) and use system colours: studio `CanvasText`,
  spot `Canvas` with a `CanvasText` ring, halo `Canvas`, selected ring
  `Highlight`, matching the `.pips` approach.
- **D-12** *The popup says "All-in for 2 hours: $145.00", the list rows "All-in
  2 h: $145.00".* The popup's wording everywhere, as the design system decided.
- **D-13** *Markers are `<a href>` in the mocks.* `<button type="button">`: a
  marker opens a popup in place, as the design system decided.
