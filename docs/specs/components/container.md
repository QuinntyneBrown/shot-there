# Container

| Field | Value |
|---|---|
| Selector | `st-page-header`; global utility classes (`.container`, `.container--narrow`, `.stack`, `.stack--sm`, `.stack--lg`, `.cluster`, `.cluster--between`, `.cluster--end`, `.grid`, `.grid--auto`, `.section-gap`, `.section-head`, `.prose`, `.subtitle`, `.text-muted`, `.text-caption`, `.has-compare-bar`, `.visually-hidden`, `.until-lg`) |
| Library path | `frontend/projects/components/src/lib/page-header/`; utilities in `frontend/projects/components/styles/utilities.css` |
| Status | planned |
| Traces to | L2-022, L2-030, L2-064, L2-065, L2-066, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`container.html`](../../design-system/components/container.html), [`responsive.html`](../../design-system/foundations/responsive.html), [`layout.html`](../../design-system/foundations/layout.html) |
| Source mocks | [`pages/admin-studios/default`](../../mocks/pages/admin-studios/default.html), [`pages/admin-studios/loading`](../../mocks/pages/admin-studios/loading.html), [`pages/admin-studios/empty`](../../mocks/pages/admin-studios/empty.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/compare/default`](../../mocks/pages/compare/default.html), [`pages/compare/empty`](../../mocks/pages/compare/empty.html), [`pages/editorial-policy/default`](../../mocks/pages/editorial-policy/default.html), [`pages/guides/default`](../../mocks/pages/guides/default.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/loading`](../../mocks/pages/studio-editor/loading.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/guide-editor/published`](../../mocks/pages/guide-editor/published.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studios/error`](../../mocks/pages/studios/error.html), [`pages/studios/selected`](../../mocks/pages/studios/selected.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html) |
| Rendering | [`container.html`](container.html) |

## Purpose and scope

The container is the layout every ShotThere screen is built from: one centred
`.container` around the header, `main` and footer; `.stack` and `.cluster` for
rhythm; `.section-gap` and `.section-head` for the big blocks of a page; `.prose`
for long reading; and the visibility utilities `.visually-hidden` and
`.until-lg`. These are global classes in the library's `utilities.css` (ICD-002
§11.1): they carry no colour and no meaning, they only place things.

`st-page-header` is the title block of every page that is not a list, the home
page or a review: the dashboard ("Dashboard"), the admin lists ("Studios"), the
editors ("Corktown Garage Studio"), the comparison ("Compare 3 studios"), the
guide index and the editorial policy. It is one of the two library components
that render an `h1` (the other is [`st-error-page`](error-page.md)), with an
optional muted subtitle line and an optional action at the end of the row
("New studio").

The page layouts built from these classes are application CSS (ICD-002 §11.2)
and are specified with their screens, not here: `.browse` (studio and spot
lists, specified with the list pages and [`filter`](filter.md)), `.home-hero`
(home page), `.auth` (owner sign-in), [`review-layout`](review-layout.md)
(studio and spot reviews), [`editor-layout`](editor-layout.md) (admin editors)
and `.map-page` ([`map`](map.md)).

Out of scope:

- The page layouts listed above, and where each page puts its `h1` when it is
  not in `st-page-header` (`.browse__title`, `.home-hero`, `.auth__head`,
  `.review-head`).
- Foundations (`foundations.css`: reset, heading sizes, `p` measure, the global
  `:focus-visible` ring, `main[tabindex="-1"]`), the other text utilities
  (`.num` is in [`description-list`](description-list.md); `.read-only-value`
  in [`text-field`](text-field.md)), `.field-row` ([`form-layout`](form-layout.md)),
  `.table-wrap` ([`table`](table.md)), `.media-fallback`
  ([`responsive-image`](responsive-image.md)) and the map marker classes
  ([`map`](map.md)).
- The page's breadcrumb, alerts and error summary that sit above or below the
  page header; the compare bar that `.has-compare-bar` makes room for
  ([`compare-bar`](compare-bar.md)).
- Deciding the subtitle's facts and counts ("9 studios · 7 published · 2 draft"):
  application view models.

## Usage

Every `.page-header` in `docs/mocks/` (pages, plus the editor and admin pages
drawn behind 16 dialog and toast mocks), and every use of the utilities, grouped
by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-dashboard/*` | `st-page-header` title "Dashboard" | subtitle "Signed in as owner@shotthere.ca" | default | canvas |
| `pages/admin-studios/*`, `admin-spots/*`, `admin-guides/*` | title "Studios", "Outdoor spots", "Guides" | subtitle "9 studios · 7 published · 2 draft", "0 studios", "All studios, published and draft"; actions `a[st-button]` primary with `plus` icon "New studio" / "New spot" / "New guide" | default, empty (no action), error, loading (subtitle skeleton + hidden "Loading"), no results | canvas |
| `pages/studio-editor/*`, `spot-editor/*`, `guide-editor/*` | title = location or guide name ("Corktown Garage Studio", "Scarborough Bluffs", "Best studios under $120 for 2 hours") | subtitle `st-status` "Draft" / "Published" + " · Last saved 11 Oct 2026, 4:12 pm" | default, published, success ("Last saved 13 Oct 2026, 10:02 am") | canvas |
| `pages/studio-editor/new`, `spot-editor/new`, `guide-editor/new`, `*/submitting` | title "New studio", "New outdoor spot", "New guide" | subtitle "New studios are saved as drafts. Nothing appears on the public site until you publish." | default | canvas |
| `pages/studio-editor/loading`, `spot-editor/loading`, `guide-editor/loading` | `loading`, title "Loading studio" / "Loading spot" / "Loading guide" (hidden) | subtitle skeleton (`aria-hidden`) | loading | canvas |
| `pages/compare/default`, `four`, `over-limit`, `unknown-slug` | title "Compare 3 studios" | subtitle sentence naming the studios; actions `div.cluster` with `a[st-button]` "Copy link" (copy icon) and `a[st-link]` "Change studios" | default | canvas |
| `pages/compare/empty`, `pages/guides/empty` | title only "Compare studios", "Guides" | none | empty | canvas |
| `pages/guides/default`, `pages/editorial-policy/default` | title "Guides", "Editorial policy" | subtitle "Shortlists built from the same measurements…", "Last updated `<time>`1 October 2026`</time>`" | default | canvas |
| Every page | `main.container`, `header .container`, `footer .container` | — | — | canvas |
| `pages/editorial-policy/default` | `.container--narrow` + `.prose` | policy text with `h2` headings | — | canvas |
| `pages/guide/default` | `.prose` on the intro (drift: on one `p` with inline width) | intro paragraph | — | canvas |
| `pages/home/*` | `section.section-gap` + `.section-head` | `h2` "Latest reviews" + link "All studios"; `.stack--sm` guide items | default, empty | canvas |
| `pages/studio/*`, `pages/spot/*` | `.section-head` inside a review section | `h2` "From a real shoot" + `.text-caption` "8 photos" | — | canvas |
| `pages/studios/*`, `pages/spots/*` | `.cluster.cluster--between` (count beside Filters and Sort); `.cluster.cluster--end` (error: Filters alone) | `st-result-count`, filter trigger, sort | default, error | canvas |
| `pages/sign-in/*`, filter forms, editors | `.stack`, `.stack--sm`, `.stack--lg` | form fields, fieldsets | — | surface, canvas |
| `pages/studios/selected`, `selected-one` | `body.has-compare-bar` | — | compare bar showing | canvas |
| `pages/studio/in-compare` | `.has-compare-bar` on `main` (drift, D-6) | — | compare bar showing | canvas |
| `pages/studios/*`, `spots/*`, `map/*`, filter dialogs | `.until-lg` on the Filters trigger and "Show the list" | — | below / from 62rem | canvas |
| 116 mocks | `.visually-hidden` | "Results" `h2`, "(opens in a new tab)", " out of 5", "Loading" | — | any |

Every row is buildable: `st-page-header` takes `title`, `loading`, a `subtitle`
slot and an `actions` slot (D-1, D-2), and every other row uses a global class
the application writes directly (ICD-DOM-4 allows the §11.1 utilities).

## Anatomy

`st-page-header`:

1. **Container** — the host element `st-page-header` with the class
   `page-header`: a wrapping flex row, title block first, actions at the end,
   aligned to the bottom; `--space-6` above and below.
2. **Title block** — `div` (structure free) holding the title and subtitle in a
   column `--space-1` apart; `min-width: 0` so long names wrap.
3. **Title** — `h1`, the page's only level-one heading, `--text-h1` from the
   foundations.
4. **Subtitle (optional)** — the consumer's `<p class="subtitle" slot="subtitle">`,
   one muted line (`--color-fg-muted`).
5. **Actions (optional)** — the consumer's `slot="actions"` content: one button
   or link drawn as a button, or a `div.cluster` of them.
6. **Title skeleton (loading only)** — `st-skeleton shape="title"` inside the
   `h1` after a visually hidden title, `min(100%, 22rem)` wide.

Host: the host carries the `.page-header` block class (ICD-DOM-1); the library
adds no wrapper outside it.

Global utilities (no host; classes on application elements):

1. **`.container`** — centred box, `max-width: --layout-container-max`, side
   padding `--layout-margin`.
2. **`.stack`, `.cluster`, `.grid`** — gap-based flex and grid primitives.
3. **`.section-gap`, `.section-head`** — vertical separation of big blocks and
   a heading-plus-link row.
4. **`.prose`, `.subtitle`, `.text-muted`, `.text-caption`** — text settings.
5. **`.has-compare-bar`, `.visually-hidden`, `.until-lg`** — room for the fixed
   bar, hidden-but-read text, hidden-from-62rem.

## API

### `st-page-header`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | Text of the `h1`. Product copy, marked `i18n-title` or set from a view model ("Corktown Garage Studio"). |
| `loading` | `boolean` | `false` | no | ICD change (D-1). The `h1` holds `<span class="visually-hidden">{title}</span>` followed by `st-skeleton shape="title"`; the title text is not visible. The consumer passes a loading title ("Loading studio"). |

`loading` uses `booleanAttribute`.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The page header reports nothing; its actions are the consumer's buttons and links. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `subtitle` | One `<p class="subtitle">` (text, `st-status`, `<time>`, or an `st-skeleton` while loading) | Projected inside the title block, after the `h1`. When nothing is projected, nothing renders below the title (D-2). |
| `actions` | One `button[st-button]` / `a[st-button]`, or one `div.cluster` of buttons and links | Projected at the end of the row. At most one primary (D-3). |

Library strings: none (ICD §12). Every word comes from the consumer.

### Global utility classes

The classes are public API (ICD-002 §11.1); their names and the behaviour below
are the contract. They are written by the application directly on its own
elements, never on a library component's internals.

| Class | Behaviour |
|---|---|
| `.container` | `width: 100%`, `max-width: --layout-container-max`, `margin-inline: auto`, `padding-inline: --layout-margin`. |
| `.container--narrow` | With `.container`: `max-width: 42rem`. Reading pages (editorial policy). |
| `.stack` | Flex column, `gap: --space-4`. |
| `.stack--sm` / `.stack--lg` | With `.stack`: gap `--space-2` / `--space-8`. |
| `.cluster` | Wrapping flex row, `gap: --space-3`, items centred vertically. |
| `.cluster--between` / `.cluster--end` | With `.cluster`: `justify-content: space-between` / `flex-end`. |
| `.grid` | Grid on the layout grid: `--layout-columns` equal columns (`minmax(0, 1fr)`), `gap: --layout-gutter` (D-4). Children span with their own `grid-column`. |
| `.grid--auto` | With `.grid`: as many columns as fit, each at least `min(100%, 16rem)` (`repeat(auto-fill, minmax(min(100%, 16rem), 1fr))`) (D-4). |
| `.section-gap` | `margin-top: --layout-section-gap`. |
| `.section-head` | Wrapping flex row, baseline aligned, `space-between`, `gap: --space-3`, `margin-bottom: --space-6`. |
| `.prose` | `font: --text-body-lg`, `--color-fg-default`; `--space-4` between paragraphs and lists, `h2` at `--text-h3` with `--space-10` above and `--space-3` below; lists indented `--space-5`. |
| `.subtitle` | `color: --color-fg-muted`. |
| `.text-muted` | `color: --color-fg-muted`. |
| `.text-caption` | `font: --text-caption`, `color: --color-fg-muted`. |
| `.has-compare-bar` | On `body`: `padding-bottom: calc(--space-24 + env(safe-area-inset-bottom))`, and `calc(--space-32 + --space-8 + env(safe-area-inset-bottom))` below 36rem; `scroll-padding-bottom` on `html` to match; the toast region rises above the bar (D-6). |
| `.visually-hidden` | Removed from view, kept in the accessibility tree: absolute, 1 × 1 px, clipped, no overflow, `white-space: nowrap`. |
| `.until-lg` | `display: none` from 62rem. |

## Variants and sizes

`st-page-header` variants come from its slots:

| Variant | Content | Use for |
|---|---|---|
| Title only | `title` | "Compare studios" (empty), "Guides" (empty) |
| Title and subtitle | `title` + `subtitle` | Dashboard, editors, guides, editorial policy |
| With action | + `actions` | Admin lists ("New studio"), comparison ("Copy link", "Change studios") |
| Loading | `loading` + subtitle skeleton | Editors while the record loads |

The page header has one size. Its width is the container's.

| Container | Max width | Used for |
|---|---|---|
| `.container` | `--layout-container-max` (90rem including margins: 1280 px of content at XL) | Every page's `main`, the site header and footer |
| `.container--narrow` | 42rem | Editorial policy |

| Stack | Gap |
|---|---|
| `.stack--sm` | `--space-2` |
| `.stack` | `--space-4` |
| `.stack--lg` | `--space-8` |

## States

The utilities have no interaction states; their structural states are set by
content or by a class on `body`.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Page header, default | `title` + optional slots | Title, muted subtitle, action at the end | One `h1` |
| Page header, no subtitle or action | Nothing projected | Title alone | One `h1` |
| Page header, loading | `loading` | Title skeleton (`--color-bg-subtle` shimmer) in the `h1`; subtitle skeleton from the consumer | `h1` named "Loading studio"; skeletons `aria-hidden`; the consumer marks `main` `aria-busy="true"` |
| Page header, action wraps | Not enough room on the row | Actions move under the title block, left-aligned | Order unchanged |
| Compare bar showing | `body.has-compare-bar` | Page end padded by the bar's height plus the safe-area inset | Focus never lands under the bar |
| Below / from 62rem | `.until-lg` | Shown below 62rem, `display: none` from 62rem | Hidden element leaves the accessibility tree |
| Hidden text | `.visually-hidden` | Not visible | Read in place |

## Markup

```html
<!-- rendered: title, subtitle and action (admin studios) -->
<st-page-header class="page-header">
  <div>
    <h1>Studios</h1>
    <p class="subtitle">9 studios · 7 published · 2 draft</p>
  </div>
  <a class="btn btn--primary" href="/admin/studios/new"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg>New studio</a>
</st-page-header>
```

```html
<!-- rendered: title only (compare, empty) -->
<st-page-header class="page-header">
  <div><h1>Compare studios</h1></div>
</st-page-header>
```

```html
<!-- rendered: loading (studio editor) -->
<st-page-header class="page-header">
  <div>
    <h1><span class="visually-hidden">Loading studio</span><st-skeleton class="skeleton skeleton--title" aria-hidden="true"></st-skeleton></h1>
    <p class="subtitle" aria-hidden="true"><st-skeleton class="skeleton skeleton--text" aria-hidden="true"></st-skeleton></p>
  </div>
</st-page-header>
```

```html
<!-- consumer: editor, draft -->
<st-page-header [title]="vm().name">
  <p class="subtitle" slot="subtitle">
    <st-status status="draft" i18n>Draft</st-status> · {{ vm().lastSaved }}
  </p>
</st-page-header>

<!-- consumer: admin list with its one primary -->
<st-page-header i18n-title title="Studios">
  <p class="subtitle" slot="subtitle">{{ countText() }}</p>
  <a st-button variant="primary" slot="actions" [routerLink]="paths.newStudio"><st-icon name="plus" /><ng-container i18n>New studio</ng-container></a>
</st-page-header>

<!-- consumer: comparison with two actions -->
<st-page-header [title]="title()">
  <p class="subtitle" slot="subtitle">{{ subtitle() }}</p>
  <div class="cluster" slot="actions">
    <button st-button type="button" (click)="copyLink()" i18n>Copy link</button>
    <a st-link standalone [routerLink]="paths.studios" i18n>Change studios</a>
  </div>
</st-page-header>

<!-- consumer: editor loading -->
<st-page-header loading i18n-title title="Loading studio">
  <p class="subtitle" slot="subtitle" aria-hidden="true"><st-skeleton /></p>
</st-page-header>
```

```html
<!-- utilities in the application shell and pages -->
<body class="has-compare-bar">
  <header class="site-header"><div class="container">…</div></header>
  <main id="main" class="container" tabindex="-1">
    <section class="section-gap" aria-labelledby="latest-title">
      <div class="section-head"><h2 id="latest-title">Latest reviews</h2><a href="/studios">All studios</a></div>
      …
    </section>
    <div class="cluster cluster--between"><st-result-count …/><div class="cluster">…</div></div>
    <h2 class="visually-hidden" id="results-title">Results</h2>
  </main>
</body>
```

The title block `div` is free to change; the `.page-header` class, the `h1`
and the projected `.subtitle` are the contract page objects use. The comparison
mock's copy icon on "Copy link" is the comparison screen's concern (its glyph
is not in `IconName`).

## Design

- `.page-header`: `display: flex; flex-wrap: wrap; align-items: flex-end;
  justify-content: space-between; gap: --space-4; margin-block: --space-6`.
- Title block: flex column, `gap: --space-1` (replaces the DS's
  `.page-header .subtitle` margin, which cannot reach projected content,
  D-2); `min-width: 0`; `overflow-wrap: anywhere` on the `h1` and subtitle (D-5).
  While `loading`, the title block takes `flex: 1` so the skeleton has width.
- Title skeleton `min(100%, 22rem)` wide, `--radius-sm`, `--duration-loop`
  shimmer (from `st-skeleton`).
- `h1` type `--text-h1` with `--letter-spacing-tight` (foundations).
- Container: `--layout-container-max`, `--layout-margin` (16 / 32 / 48 / 80 px).
  Layout grid: `--layout-columns` (4 / 8 / 12), `--layout-gutter`
  (24 / 32 / 40 px). Section gap `--layout-section-gap` (64 px, 96 px from 62rem).
- Prose: `--text-body-lg`; `--space-4`, `--space-10`, `--space-3`, `--space-5`.
- Compare-bar room `--space-24` (`--space-32` plus `--space-8` below 36rem).
- No component tokens; no elevation; no motion of their own.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Page canvas (from `body`) | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Title, prose | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Subtitle, `.text-muted`, `.text-caption` | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Title skeleton | `--color-bg-subtle` to `--color-bg-subtle-hover` | `--palette-stone-100` / `--palette-stone-200` | `--palette-stone-800` / `--palette-stone-700` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Title, prose |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Subtitle, captions, result count |
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Section-head link ("All studios") |

Forced colours: the utilities draw nothing; text takes `CanvasText`.

## Responsive behaviour

- `--layout-margin` is 16 px below 48rem, 32 px from 48rem, 48 px from 62rem
  and 80 px from 75rem; the container stops at 90rem, which leaves 1280 px of
  content centred at XL (L2-064.3).
- `.page-header`: below 36rem the action wraps under the title; from 36rem it
  sits beside the title, bottom-aligned, when it fits. The DS breakpoints do not
  change it otherwise.
- `.section-head`: the link wraps under the heading when it does not fit.
- `.cluster`: items wrap; nothing scrolls sideways.
- `.grid`: 4, 8 then 12 columns as `--layout-columns` changes.
- `.has-compare-bar`: always on while the bar shows (the bar is fixed at every
  width); the padding is larger below 36rem where the bar wraps to two rows.
- `.until-lg` shows below 62rem only.
- At 320 px nothing scrolls horizontally or clips (titles and subtitles wrap
  anywhere); at 200 % zoom on a 1280 px window the phone layout takes over and
  everything stays available. The page header has no targets of its own; its
  actions are 44 px tall below 48rem ([`button`](button.md)).

## Accessibility

### Role and pattern

`st-page-header` renders a native `h1` and no ARIA. The page around it uses
landmarks ([APG Landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)):
`header`, `main id="main" tabindex="-1"`, `footer`, named `section`s and
`aside`s. Exactly one `h1` per page.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the actions in source order, which is visual order at every width. The header has no focusable part of its own. |

### Focus

Layouts never clip focus rings: no utility sets `overflow: hidden` except
`.visually-hidden`. `.has-compare-bar` reserves room so the fixed bar never
covers the focused element (WCAG 2.4.11).

### Labelling

- The `h1` text is the page's name ("Corktown Garage Studio"); while loading it
  is the consumer's loading title ("Loading studio"), never empty.
- `.visually-hidden` text is read in place: "Results", "(opens in a new tab)",
  " out of 5".
- An element with `.until-lg` is removed from the accessibility tree from 62rem
  (`display: none`), so the visible control is the only one announced.

### Announcements

None. The loading-to-loaded change is announced by the consumer's own status
region ("Loading studio…"), not by the header.

### Motion

Layouts do not animate. The title skeleton's shimmer stops under
`prefers-reduced-motion: reduce` (DS [skeleton](../../design-system/components/skeleton.html));
smooth scrolling to anchors turns off (`scroll-behavior: auto`). This is a
design-system rule with no acceptance criterion (L2 has no motion requirement).

## Content and internationalisation

- The `h1` names the place or the task: "Studios", "Outdoor spots", "Compare 3
  studios", "Dashboard". A studio, spot or guide name is the `h1` in its editor.
- The subtitle is one muted line of fact: "9 studios · 7 published · 2 draft",
  "Signed in as owner@shotthere.ca", "Last updated 1 October 2026", "Draft · Last
  saved 11 Oct 2026, 4:12 pm". No welcome messages. Dates and counts are
  formatted by the application for `en-CA`.
- Section-head links say where they go: "All studios", "All guides", "All
  spots", never "See more".
- Prose stays within `--layout-measure` and uses Canadian English.
- Translatable content: `title` and both slots. Data values: location and guide
  names. Longer translations wrap; the title never truncates.

## Performance

- Change detection: `OnPush`; one signal input and one boolean; no computed
  work.
- Performance scenario: the `components-harness` route `container/performance`
  renders the studio editor's page header with `loading` true ("Loading studio"
  with a subtitle skeleton) and switches it to "Corktown Garage Studio" /
  "Draft · Last saved 11 Oct 2026, 4:12 pm", inside a `.container`; the switch is
  held to the L2-071 layout-shift budget.
- Regression rule: a change to the template, inputs, styles or `utilities.css`
  is measured on that route against the base branch before it is pushed.
- Layout stability: the title skeleton is 1.5em tall in the `h1`, so the header
  keeps its height when the title arrives.
- Weight: imports `@angular/core` and `st-skeleton` only. `utilities.css` is
  part of the one global stylesheet.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-page-header title="Studios">` with the subtitle "9 studios · 7 published · 2 draft" and the action "New studio", when it renders, then the host has the class `page-header`, holds one `h1` "Studios", the projected `p.subtitle` after it, and the "New studio" link at the end of the row. (L2-069)
- **AC-2** Given the admin studios page built with `st-page-header` and library components below it, when the heading outline is inspected, then the page has exactly one `h1`, it is "Studios", and the next heading level used is `h2`. (L2-069)
- **AC-3** Given `<st-page-header title="Compare studios">` with no slot content, when it renders, then the header contains only the `h1` "Compare studios" and no empty paragraph or action container. (L2-069)
- **AC-4** Given the studio editor's subtitle `<st-status status="draft">Draft</st-status> · Last saved 11 Oct 2026, 4:12 pm`, when a screen reader reads the header, then it reads "Corktown Garage Studio", heading level 1, followed by "Draft · Last saved 11 Oct 2026, 4:12 pm". (L2-069)
- **AC-5** Given `<st-page-header loading title="Loading studio">`, when it renders, then the `h1`'s accessible name is "Loading studio", the title text is not visible, and the title skeleton inside the `h1` is `aria-hidden="true"`. (L2-069)
- **AC-6** Given any page header, when its template is inspected, then it renders no text that did not arrive through `title` or a slot. (L2-070)

### Utilities

- **AC-7** Given the studio list at a 1600 px viewport, when `main.container` is measured, then its content box is 1280 px wide and centred, and the site header's and footer's `.container` edges line up with it. (L2-064)
- **AC-8** Given the studio list at 320 px, when `main.container` is measured, then it has 16 px of side padding, its content is 288 px wide, and `document.documentElement.scrollWidth` equals 320. (L2-064)
- **AC-9** Given the studio list results row `.cluster.cluster--between` with "7 studios", "Filters" and the sort select at 320 px, when it renders, then the items wrap onto a second line and nothing overflows the container. (L2-064)
- **AC-10** Given the home page "Latest reviews" `.section-head` with the link "All studios" at 320 px, when it renders, then the link wraps under the heading if it does not fit, and the page does not scroll sideways. (L2-064)
- **AC-11** Given `pages/studios/selected` with `body.has-compare-bar` and the compare bar showing, when the visitor scrolls to the end of the page, then the last card and the footer are fully above the compare bar. (L2-030)
- **AC-12** Given a device with a 34 px bottom safe-area inset and `body.has-compare-bar`, when the page bottom padding is measured, then it equals `--space-24` plus 34 px from 36rem, and `--space-32` plus `--space-8` plus 34 px below 36rem. (L2-065)
- **AC-13** Given the studio list's `<h2 class="visually-hidden" id="results-title">Results</h2>`, when it renders, then it occupies no visible space and the results `section` is exposed as a region named "Results". (L2-069)
- **AC-14** Given the "Filters" trigger with `.until-lg` on the studio list, when the viewport is 991 px and then 992 px wide, then it is shown at 991 px and has `display: none` and is absent from the accessibility tree at 992 px. (L2-022)

### Responsive

- **AC-15** Given the comparison page header with "Compare 3 studios", the long subtitle and the actions "Copy link" and "Change studios" at 320 px, when it renders, then the actions wrap under the title block, every word of the subtitle is visible, and `document.documentElement.scrollWidth` equals 320. (L2-064)
- **AC-16** Given the guide editor's header "Best studios under $120 for 2 hours" at 320 px, when it renders, then the title wraps over several lines inside the container and is not truncated. (L2-064)
- **AC-17** Given the admin studios header at 768 px, when it renders, then "New studio" sits on the same row as the title block, aligned to its bottom edge. (L2-064)
- **AC-18** Given the admin studios page at 200 % zoom in a 1280 px window, when it renders, then the header, subtitle and "New studio" are all visible and operable and the page does not scroll sideways. (L2-066)

### Theming

- **AC-19** Given the editor page header and a `.text-caption` line in the light and the dark theme, when the contrast check runs, then the title is at least 4.5:1 and the subtitle and caption (`--color-fg-muted`) are at least 4.5:1 against `--color-bg-canvas`. (L2-068)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the title skeleton's shimmer stops and anchor
scrolling is instant ([container.html](../../design-system/components/container.html),
Accessibility › Motion).

### Performance

- **AC-20** Given the `container/performance` harness route, when the page header switches from `loading` "Loading studio" to "Corktown Garage Studio", then the measured cumulative layout shift is at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/page-header/`:
  `page-header.component.ts` (`PageHeaderComponent`, selector `st-page-header`,
  host class `page-header`), `page-header.component.html`,
  `page-header.component.css` (port of `.page-header` and the title-block rules
  against `:host`). Uses `SkeletonComponent`.
- Template: `<div><h1>@if (loading()) {<span class="visually-hidden">{{ title() }}</span><st-skeleton shape="title" />} @else {{{ title() }}}</h1><ng-content select="[slot=subtitle]" /></div><ng-content select="[slot=actions]" />`.
- `styles/utilities.css`: port the `.container`, `.stack*`, `.cluster*`,
  `.section-gap`, `.section-head`, `.prose`, `.has-compare-bar` (with the
  `html:has(body.has-compare-bar)` scroll padding and the toast-region offset),
  `.visually-hidden` and `.until-lg` rules from `components.css`, plus `.subtitle`,
  `.text-muted` and `.text-caption` from its base section, and the new `.grid`
  and `.grid--auto` (D-4). The page-header margin rule
  `.page-header .subtitle` is replaced by the title block's gap (D-2).
- ICD change (ICD-002 1.1.0, additive): `PageHeaderComponent` gains input
  `loading`, `boolean`, default `false`.
- Mocks drift the application corrects: the loading mocks set
  `style="flex: 1"` and skeleton widths inline (now the component's rule);
  `pages/studio/in-compare` puts `.has-compare-bar` on `main` (D-6);
  `pages/guide/default` puts `.prose` on one `p` with an inline width (the
  intro uses `.prose` on its wrapper).

## Decisions

- **D-1** *How does the editor show a title skeleton inside the `h1` while the record loads, when `title` is a plain string and no slot sits inside the `h1`?* With a new optional input `loading` (ICD-002 1.1.0, additive). The three editor loading mocks put a hidden "Loading studio" and a title skeleton inside the `h1`; without the input the application would hand-write `.page-header` markup, which ICD-DOM-4 forbids.
- **D-2** *Does the component render the `.subtitle` paragraph around the slot, or does the consumer project it?* The consumer projects `<p class="subtitle" slot="subtitle">` (`.subtitle` is a global utility, ICD §11.1). The component cannot tell whether a slot is empty without querying projected content (ICD-API-9), and `compare/empty` must render no subtitle line. The title block's `gap: --space-1` replaces `.page-header .subtitle { margin-top }`, which encapsulated styles cannot apply to projected content.
- **D-3** *How many primary actions may the header hold?* At most one, and none on editors, whose one primary is "Save changes" in the save bar. The design system's container and editor-layout pages both state one primary per screen.
- **D-4** *ICD-002 §11.1 lists `.grid` and `.grid--auto`, but the design system defines no rule for them and says "the layout grid is a set of tokens, not a class"; no mock uses them.* They are public API, so they are specified on the layout tokens: `.grid` places children on `--layout-columns` equal columns with `--layout-gutter` gaps (the DS's live layout-grid demo), and `.grid--auto` fits as many 16rem-minimum columns as the row allows. Card grids keep their own classes (`.location-grid`, `.stat-grid`). Reported to the lead as an ICD/DS gap.
- **D-5** *Can a long title or subtitle overflow at 320 px?* No: the title block wraps anywhere (`overflow-wrap: anywhere`), as the DS's container D-13 note asks of every layout cell, so a long guide name or an e-mail address never widens the page.
- **D-6** *The DS container page and `pages/studios/selected` put `.has-compare-bar` on `body`; the review-layout page and `pages/studio/in-compare` put it on `main`.* On `body`, always. The scroll padding (`html:has(body.has-compare-bar)`) and the toast offset (`.has-compare-bar .toast-region`, the region sits outside `main`) only work there. The application shell toggles the class while the compare bar shows.
- **D-7** *Should the page header's actions be in a landmark or carry a label?* No. They are ordinary controls in reading order after the `h1`; a `nav` or `aside` around one button would add noise.
