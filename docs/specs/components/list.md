# List rows

| Field | Value |
|---|---|
| Selector | `st-section-links` (library); application parts: the `.list` rows of `RainBackupComponent` and the `.admin-list` rows of `AdminDashboardPageComponent` |
| Library path | `frontend/projects/components/src/lib/section-links/`; application parts in `frontend/projects/shot-there/src/app/features/spots/rain-backup/` and `frontend/projects/shot-there/src/app/features/admin/dashboard/` |
| Status | planned |
| Traces to | L2-026, L2-037, L2-044, L2-053, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`list.html`](../../design-system/components/list.html) |
| Source mocks | [`dialogs/site-menu/default`](../../mocks/dialogs/site-menu/default.html), [`dialogs/site-menu/admin`](../../mocks/dialogs/site-menu/admin.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html), [`pages/spot/map-failed`](../../mocks/pages/spot/map-failed.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-dashboard/loading`](../../mocks/pages/admin-dashboard/loading.html), [`pages/admin-dashboard/up-to-date`](../../mocks/pages/admin-dashboard/up-to-date.html), [`pages/admin-dashboard/partial`](../../mocks/pages/admin-dashboard/partial.html) |
| Rendering | [`list.html`](list.html) |

## Purpose and scope

List rows stack short, same-shaped items: a title over one line of detail,
with at most a trailing value or action. The design system has three row
families. Only one is a library component:

- **Section links** (`st-section-links`, library): the rows of the site menu
  sheet below 48rem. Each whole row is one link, tall enough for a thumb:
  "Studios · 7 rental studios, measured the same way"; in the admin
  "Dashboard · 2 items need re-verifying". The current screen's row is marked.
- **List rows** (`.list`, application): the spot page's rain backup, three
  reviewed studios with neighbourhood, all-in cost and distance. Only the name
  is a link.
- **Admin rows** (`.admin-list`, application): the dashboard's "Needs
  re-verification" and "Due soon" groups, with a status badge in the title and
  an Edit action.

ICD-002 §11.2 gives `.admin-list` and `.admin-row*` to the application's
feature CSS, and §9.3 gives the library only `st-section-links`. This CRD
therefore specifies section links as a library component and the other two
families as application parts, so the whole design-system page is covered
once. The application parts compose library pieces specified elsewhere:
[`a[st-button]`](button.md) for Edit, [`st-badge`](badge.md) for "Stale" and
"Due soon", [`st-skeleton`](skeleton.md) for loading rows, and
[`st-empty-state`](empty-state.md) for "Everything is up to date".

Use a [table](table.md) when items share three or more comparable columns (the
admin studio, spot and guide lists), [location cards](location-card.md) when the
photo matters, and a [description list](description-list.md) for label and
value pairs about one thing.

Out of scope:

- The site menu sheet itself (title "Menu", Close, Sign out in its footer,
  focus trap, Escape) and closing it after a row is activated: the application,
  with [`st-sheet`](sheet.md) and `DialogService` (D-10).
- Which sections the menu lists, their descriptions and counts ("7 published,
  2 draft"), and when the Dashboard row needs attention: the application.
- Choosing, ordering and formatting the rain backup studios (L2-037) and the
  re-verification entries (L2-044): the server and the application's view
  models.

## Usage

Inventory from `usage_inventory.py docs/mocks section-link "a"`, `section-list "ul"`, `list "ul|li|a|span"`, `admin-list "ul"` and `admin-row "li|div|span"`.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/site-menu/default` | `st-section-links`, `navLabel` "Primary", five items | Studios "7 rental studios, measured the same way"; Spots "5 outdoor locations with permit notes"; Map "Every studio and spot on one map"; Compare "Up to 4 studios side by side"; Guides "Short lists, like the best studios under $120" | default, current (the section the visitor is in, D-6) | `--color-bg-surface-raised` (sheet) |
| `dialogs/site-menu/default` | second `st-section-links`, `navLabel` "About ShotThere", one item | Editorial policy "How reviews are made, paid for and corrected" | default, current on the policy page | sheet |
| `dialogs/site-menu/admin` | `st-section-links`, `navLabel` "Administration", five items, Dashboard and View site `exact` | Dashboard "2 items need re-verifying"; Studios "7 published, 2 draft"; Spots "5 published, 1 draft"; Guides "3 published, 1 draft"; View site "The public home page" | current (Dashboard), attention on Dashboard (D-3) | sheet |
| `pages/spot/default`, `stale-permit`, `no-video`, `map-failed` | application `.list` in `RainBackupComponent` | Riverside Rooftop Studio "Riverside · All-in $100.00 for 2 hours" 3.1 km; Leslieville Daylight Studio "Leslieville · All-in $91.00 for 2 hours" 4.0 km; Kensington Window Room "Kensington Market · All-in $80.00 for 2 hours" 5.6 km | default; title link hover and focus | canvas |
| `pages/spot/no-rain-backup` | no list: the sentence and link replace it (L2-038) | — | — | canvas |
| `pages/admin-dashboard/default` | application `.admin-list` × 2 in `AdminDashboardPageComponent` | Needs re-verification: Ossington Blackbox "Stale", "Studio · Prices verified 2 Mar 2026 (225 days ago)"; Distillery District "Stale", "Outdoor spot · Permits verified 20 Mar 2026 (207 days ago)". Due soon: Liberty Cyc House "Due soon", "Studio · Prices verified 28 Apr 2026 (168 days ago)". Edit + hidden object | default; Edit hover and focus | canvas |
| `pages/admin-dashboard/loading` | three `.admin-row--skeleton` rows | — | loading (`aria-busy` region) | canvas |
| `pages/admin-dashboard/up-to-date`, `partial` | no rows: "Everything is up to date" empty state, or an alert in the list's place | — | — | canvas |

Every row is buildable: section links with the library API below (plus the two
additive `SectionLink` members), the other two families with the application
markup in *Markup*.

## Anatomy

### `st-section-links`

1. **Landmark** — `nav` named by `navLabel`.
2. **List** — `ul.section-list`: unstyled, a `--border-width-hairline` rule in
   `--color-border-default` on top.
3. **Row** — `li > a.section-link` (RouterLink): flex row, `gap: var(--space-4)`,
   `min-height: 4.5rem`, padding `--space-3` `--space-1`, a hairline under it;
   the whole row is the target.
4. **Body** — `span.section-link__body`: column, shrinks (`min-width: 0`).
5. **Title** — `span.section-link__title`: `--text-body-lg`, `--font-weight-medium`.
6. **Meta (optional)** — `span.section-link__meta`: `--text-body-sm` in
   `--color-fg-muted`, `--color-danger-fg` when the item needs attention.

Host: `st-section-links` is `display: block` with no box styles; the `nav` is
the landmark.

### List row (application, `RainBackupComponent`)

1. `ul.list` — column, no list style.
2. `li.list__item` — flex row, `gap: var(--space-3)`, padding `--space-3`
   `--space-4`, hairline under every row but the last.
3. `div.list__body` — shrinks; holds `a.list__title` (the studio name, the only
   link, `--text-label` at `--font-size-md`) and `span.list__meta`
   (`--text-body-sm`, muted).
4. `span.num` — the trailing distance, tabular figures, never wraps.

### Admin row (application, `AdminDashboardPageComponent`)

1. `ul.admin-list` — hairline on top.
2. `li.admin-row` — wrapping flex row, `gap: var(--space-3) var(--space-4)`,
   padding `--space-4` `--space-2`, hairline under it.
3. `div.admin-row__body` — `flex: 1 1 var(--space-32)`; holds
   `span.admin-row__title` (name plus an `st-badge`, `--text-body-lg` medium,
   wraps anywhere) and `span.admin-row__meta` (with `<time datetime>`).
4. `div.admin-row__actions` — pushed right, wraps below the body when there is
   no room; holds a small `a[st-button]` "Edit" with hidden object text.
5. Loading: `li.admin-row.admin-row--skeleton` with title and text skeletons
   and a button-sized rectangle.

## API

### `st-section-links`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `items` | `readonly SectionLink[]` | — | yes | One `li > a.section-link` each, in order, tracked by `link`. `aria-current="page"` through `RouterLinkActive`, exact when `exact` is true, prefix otherwise. `meta` renders `.section-link__meta`; without it there is none. `attention` renders `data-highlight` on the link (D-3). |
| `navLabel` | `string` | — | yes | The `nav`'s `aria-label`: "Primary", "About ShotThere", "Administration". |

`SectionLink` gains two optional members (ICD-002 1.1.0, additive; `SectionLink`
is used only as an input):

```ts
export interface SectionLink {
  label: string;
  meta?: string;
  link: string;
  exact?: boolean;      // new: match the path exactly for aria-current (D-2)
  attention?: boolean;  // new: meta in --color-danger-fg (data-highlight) (D-3)
}
```

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Rows are links. The application closes the sheet when the router navigates (D-10). |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | A section link never holds a second control (D-7). |

The component has no library strings.

### Application parts

The rain backup rows and the admin rows have no library API; they are markup
and feature CSS of the named application components (ICD-002 §11.2), built
from the rules in *Markup* and *Design*. Their data comes from view models
beside the page: name, link (`APP_PATHS`), meta and distance strings formatted
for `en-CA`; badge tone and label, `DisplayDate`, age text and the editor link.

## Variants and sizes

| Family | Owner | Use for | Density |
|---|---|---|---|
| Section link | library `st-section-links` | Site menu sheet, public and admin | Padding `--space-3` × `--space-1`, title `--text-body-lg` medium, at least 4.5rem tall |
| Section link with attention | library, `attention` true | A section that needs the owner: the admin menu's Dashboard while anything needs re-verifying | As above; meta in `--color-danger-fg` |
| List row | application `.list` | Rain backup on a spot page | Padding `--space-3` × `--space-4`, title `--text-label` at `--font-size-md`, height from content |
| Admin row | application `.admin-list` | Dashboard re-verification and due-soon groups | Padding `--space-4` × `--space-2`, title `--text-body-lg` medium; the 36 px Edit (44 px on phones) sets the floor |
| Admin row, loading | application `.admin-row--skeleton` | Dashboard while loading | Same size as a real row |

Density comes with the family; there are no size modifiers.

## States

| Family | State | Trigger | Visual | Assistive technology |
|---|---|---|---|---|
| Section link | Default | — | Title `--color-fg-default`, meta muted, hairlines | Link named "title meta" |
| Section link | Hover, active | `:hover`, `:active` | Fill `--color-bg-surface-sunken` | — |
| Section link | Focus | `:focus-visible` | `--focus-ring-width` ring in `--color-focus-ring`, drawn inside the row (`outline-offset: calc(-1 * var(--focus-ring-width))`, D-4) | Focus on the row |
| Section link | Current | `aria-current="page"` | `--border-width-thick` accent bar on the left edge (inset shadow in `--color-accent`), title in `--color-fg-accent` | "current page" |
| Section link | Attention | `data-highlight` | Meta in `--color-danger-fg` | The words carry the meaning |
| Section link | No meta | `meta` absent | Title only, still 4.5rem tall | Name is the title |
| Section link | Disabled | — | Not used: a section the owner cannot open is not listed | — |
| List row | Default; title hover, focus | link states | Title link underlined in `--color-fg-link`, thicker underline on hover; shared ring | One stop per row (the name) |
| List row | Selected, disabled | — | Not used: rows are not selectable, unavailable studios are left out | — |
| Admin row | Default; Edit hover, focus, active | button states | Edit is a small secondary button | "Edit Ossington Blackbox prices" |
| Admin row | Loading | `.admin-row--skeleton` in an `aria-busy="true"` region | Title bar 40 %, meta bar 25 %, block `--space-20` wide and `--target-comfortable` (phone) or `--control-height-sm` (from 48rem) tall; shimmer | Skeletons hidden; the region is busy and a hidden status says "Loading the dashboard" |
| Admin row | Empty | no entries | Not drawn: "Everything is up to date" replaces the list | The empty state's text |

## Markup

```html
<!-- rendered: st-section-links, admin menu on /admin (Dashboard current, needs attention) -->
<nav aria-label="Administration">
  <ul class="section-list">
    <li><a class="section-link" href="/admin" aria-current="page" data-highlight>
      <span class="section-link__body">
        <span class="section-link__title">Dashboard</span>
        <span class="section-link__meta">2 items need re-verifying</span>
      </span>
    </a></li>
    <li><a class="section-link" href="/admin/studios">
      <span class="section-link__body">
        <span class="section-link__title">Studios</span>
        <span class="section-link__meta">7 published, 2 draft</span>
      </span>
    </a></li>
    …
  </ul>
</nav>
```

```html
<!-- consumer: the application's site menu sheet (public) -->
<st-sheet i18n-title title="Menu" i18n-description description="Site navigation">
  <st-section-links i18n-navLabel navLabel="Primary" [items]="primarySections" />
  <st-section-links i18n-navLabel navLabel="About ShotThere" [items]="aboutSections" />
</st-sheet>
```

```html
<!-- application: rain backup rows (RainBackupComponent) -->
<ul class="list">
  <li class="list__item">
    <div class="list__body">
      <a class="list__title" href="/studios/riverside-rooftop-studio">Riverside Rooftop Studio</a>
      <span class="list__meta">Riverside · All-in $100.00 for 2 hours</span>
    </div>
    <span class="num">3.1 km</span>
  </li>
  …
</ul>
```

```html
<!-- application: re-verification row and loading row (AdminDashboardPageComponent) -->
<ul class="admin-list">
  <li class="admin-row">
    <div class="admin-row__body">
      <span class="admin-row__title">Ossington Blackbox <st-badge tone="warning">Stale</st-badge></span>
      <span class="admin-row__meta">Studio · Prices verified <time datetime="2026-03-02">2 Mar 2026</time> (225 days ago)</span>
    </div>
    <div class="admin-row__actions">
      <a st-button size="sm" [routerLink]="row.editLink"><ng-container i18n>Edit</ng-container><span class="visually-hidden"> Ossington Blackbox prices</span></a>
    </div>
  </li>
</ul>

<div aria-busy="true">
  <p class="visually-hidden" role="status">Loading the dashboard</p>
  <ul class="admin-list">
    <li class="admin-row admin-row--skeleton">
      <div class="admin-row__body"><st-skeleton shape="title" /><st-skeleton shape="text" /></div>
      <st-skeleton shape="rect" />
    </li>
  </ul>
</div>
```

The badge and skeleton render the classes their own CRDs specify
(`.badge.badge--warning`, `.skeleton.skeleton--title`); host element names are
not part of any contract (ICD-DOM-3).

## Design

Section links (library CSS):

- `ul.section-list`: no list style, padding or margin; top rule `--border-width-hairline` in `--color-border-default`.
- `a.section-link`: `display: flex`, `align-items: center`, `gap: var(--space-4)`, `min-height: 4.5rem`, padding `--space-3` `--space-1`, bottom rule as above, colour inherited, no underline.
- Body: `flex: 1`, `min-width: 0`, column. Title `--text-body-lg` at `--font-weight-medium`; meta `--text-body-sm` in `--color-fg-muted`.
- Hover and active: background `--color-bg-surface-sunken`.
- Focus: `outline: var(--focus-ring-width) solid var(--color-focus-ring)` with `outline-offset: calc(-1 * var(--focus-ring-width))` on `:focus-visible` (D-4).
- Current: `box-shadow: inset var(--border-width-thick) 0 0 var(--color-accent)`; title `--color-fg-accent`.
- Attention: `[data-highlight] .section-link__meta` in `--color-danger-fg`.
- Motion: none; the hover fill changes instantly.

Application parts (feature CSS, ported from `components.css` by the application):

- `.list`, `.list__item`, `.list__body`, `.list__title`, `.list__meta` as in *Anatomy*; the title link keeps the global link style (`--color-fg-link`, underlined); `.num` keeps tabular figures and `white-space: nowrap`.
- `.admin-list`, `.admin-row`, `.admin-row__body` (`flex: 1 1 var(--space-32)`, gap `--space-0-5`), `.admin-row__title` (`overflow-wrap: anywhere`, gap `--space-2`), `.admin-row__meta`, `.admin-row__actions` (`margin-left: auto`, gap `--space-2`), and `.admin-row--skeleton` sizing (title 40 %, text 25 %, rectangle `--space-20` by `--target-comfortable`, `--control-height-sm` from 48rem). These selectors target only application elements; the skeleton widths are set on the application's own `st-skeleton` hosts with the `width`/`height` placement ICD-DOM-5 allows.

None of the families declares component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Sheet surface behind section links | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Page behind list and admin rows | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Titles | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Meta | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Hairlines | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Section link hover | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Current bar | `--color-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Current title | `--color-fg-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Attention meta | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| List row title link | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Section title in the sheet |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Section meta in the sheet |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Hovered section title |
| `--color-fg-muted` | `--color-bg-surface-sunken` | 4.5:1 | Hovered section meta |
| `--color-fg-accent` | `--color-bg-surface-raised` | 4.5:1 | Current section title |
| `--color-fg-accent` | `--color-bg-surface-sunken` | 4.5:1 | Current section title, hovered |
| `--color-accent` | `--color-bg-surface-raised` | 3:1 | Current bar |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Attention meta |
| `--color-danger-fg` | `--color-bg-surface-sunken` | 4.5:1 | Attention meta, hovered |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in the sheet |
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Rain backup studio name |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Row meta on the page |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Admin row title |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |

Hairlines mark no control and are decorative under WCAG 1.4.11. Forced
colours: the current bar is a box shadow, which forced colours removes, so the
current row also keeps its `aria-current` announcement and the title stays a
distinct `LinkText` row; the attention meta keeps its words.

## Responsive behaviour

- Section links appear only in the menu sheet below 48rem, across the full sheet
  width, each at least 4.5rem (72 px) tall; from 48rem the header shows the same
  sections inline. Titles and meta wrap; nothing truncates.
- List rows: the body shrinks (`min-width: 0`) and the meta wraps; the distance
  never wraps under the title. Nothing scrolls sideways at 320 px.
- Admin rows wrap: when the title, badge and meta need more than the space beside
  Edit, the actions drop below and stay right-aligned. Titles wrap anywhere and
  the badge follows the name. The list never scrolls sideways at 320 px
  (L2-053.3). Below 48rem the small Edit grows to 44 px.
- At 200 % zoom every family reflows the same way as on a phone.

## Accessibility

### Role and pattern

Native lists (`ul`/`li`) of native links; no ARIA widget. Section lists sit in
a labelled `nav`. Listbox semantics and `aria-selected` are never used here,
because no row is an option to choose.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | One stop per section link, per rain backup studio name, per admin Edit, in reading order. |
| <kbd>Enter</kbd> | Follows the focused link. |
| <kbd>Esc</kbd> (in the sheet) | Handled by the sheet: closes it and returns focus to Menu. |

### Focus

Section links draw the shared ring inside the row (D-4), so the sheet body's
edges never clip it; list and admin rows use the shared ring around the title
link or the Edit button. In the menu sheet focus starts on Close and Tab moves
down the section links.

### Labelling

- A section link's name is its title and meta together ("Studios 7 rental
  studios, measured the same way"); keep the meta short.
- Repeated Edit actions carry their object in hidden text: "Edit Ossington
  Blackbox prices", "Edit Distillery District permits".
- Badges are text ("Stale", "Due soon"); attention meta states its reason in
  words; dates are `<time datetime>`.

### Announcements

None in the rows. The dashboard's hidden status "Loading the dashboard" is the
application's.

### Motion

Nothing animates except the admin skeleton rows' shimmer, which stops under
`prefers-reduced-motion` ([list.html](../../design-system/components/list.html), Accessibility › Motion).

## Content and internationalisation

- Titles: the section name ("Studios", "Editorial policy") or the location's
  published name ("Liberty Cyc House"). No articles, no verbs.
- Section meta says what is behind the link in under eight words: "Every studio
  and spot on one map", "How reviews are made, paid for and corrected"; admin
  counts follow the dashboard: "7 published, 2 draft" (D-5).
- Row meta: type or neighbourhood first, then the fact the list is about, joined
  by " · ": "Studio · Prices verified 2 Mar 2026 (225 days ago)", "Riverside ·
  All-in $100.00 for 2 hours". Dates "2 Mar 2026", money "$100.00", distance
  "3.1 km" (one decimal), formatted by the application for `en-CA`.
- Actions: one verb with a hidden object, "Edit" + " Ossington Blackbox prices".
- Section labels, meta, `navLabel` and every row string are application copy,
  marked for translation; names are data. Longer translations wrap.

## Performance

- `st-section-links`: `OnPush`, signal inputs, `@for` tracked by `link`; no
  computed work per row beyond `RouterLinkActive`.
- Performance scenario: the `components-harness` route `list/performance`
  renders the admin menu's five section links (Dashboard current, with
  attention) inside a static sheet; activating "Studios" must stay within the
  L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: section links render with the sheet, never after it; the
  admin skeleton rows match a real row's height so the dashboard does not shift
  when entries arrive.
- Weight: `st-section-links` imports `@angular/core` and `@angular/router`
  (`RouterLink`, `RouterLinkActive`) only.

## Acceptance criteria

### Section links: rendering

- **AC-1** Given the public site menu at 360 px with `navLabel` "Primary" and the five public sections, when it renders, then a navigation landmark named "Primary" holds `ul.section-list` with five `a.section-link` rows in the order Studios, Spots, Map, Compare, Guides, each with `.section-link__title` and `.section-link__meta`. (L2-064)
- **AC-2** Given the Studios row with meta "7 rental studios, measured the same way", when a screen reader reaches it, then its accessible name is "Studios 7 rental studios, measured the same way" and its role is link. (L2-069)
- **AC-3** Given the admin menu on `/admin` with Dashboard marked `exact`, when it renders, then the Dashboard row has `aria-current="page"`, a `--border-width-thick` inset bar in `--color-accent` on its left edge and its title in `--color-fg-accent`, and no other row has `aria-current`. (L2-069)
- **AC-4** Given the public menu opened on `/studios/the-junction-loft`, when it renders, then the Studios row has `aria-current="page"`. (L2-069)
- **AC-5** Given the admin menu opened on `/admin/studios` with View site "/" marked `exact`, when it renders, then Studios is current and View site is not. (L2-069)
- **AC-6** Given the Dashboard item with `attention` true and meta "2 items need re-verifying", when it renders in the light and the dark theme, then the link has `data-highlight`, the meta is drawn in `--color-danger-fg` with at least 4.5:1 contrast against the sheet surface, and the meta text is unchanged. (L2-068)
- **AC-7** Given an item with no `meta`, when it renders, then the row holds only `.section-link__title` and is still at least 72 px tall. (L2-065)

### Section links: keyboard and focus

- **AC-8** Given the admin menu sheet open, when the owner presses Tab from Close, then focus moves Dashboard, Studios, Spots, Guides, View site in order, and each focused row shows a 2 px `--color-focus-ring` outline inside its edges with at least 3:1 contrast against `--color-bg-surface-raised`. (L2-067)

### Section links: screen readers and theming

- **AC-9** Given `dialogs/site-menu/default` and `dialogs/site-menu/admin` rebuilt in the harness, when axe-core scans them in light and dark, then no violation is reported and the public sheet holds two navigation landmarks, "Primary" and "About ShotThere". (L2-069)
- **AC-10** Given the section links in the light and the dark theme, when the contrast check runs on the sheet surface and on the hover fill, then every title and meta is at least 4.5:1 and the current bar at least 3:1. (L2-068)

### Section links: responsive

- **AC-11** Given the public menu at 360 px, when each row is measured, then it is at least 72 CSS px tall and spans the sheet body's full width. (L2-065)
- **AC-12** Given the public menu at 320 px, when it renders, then the Guides meta "Short lists, like the best studios under $120" wraps inside the row without truncation and nothing scrolls horizontally. (L2-064)

### Rain backup rows (application)

- **AC-13** Given Evergreen Brick Works' page, when the rain backup renders, then `ul.list` holds three `li.list__item` rows in the order Riverside Rooftop Studio, Leslieville Daylight Studio, Kensington Window Room, each with the name as `a.list__title` linking to the studio page, the meta "Riverside · All-in $100.00 for 2 hours" (and so on), and the distance in `span.num` ("3.1 km", "4.0 km", "5.6 km"). (L2-037)
- **AC-14** Given the rain backup, when a keyboard user tabs through it, then each row is one stop, on the studio name, and the distance is not focusable. (L2-067)
- **AC-15** Given the rain backup at 320 px, when it renders, then each distance stays on the same line as its row's body, the meta wraps instead, and `document.documentElement.scrollWidth` equals 320. (L2-064)

### Admin rows (application)

- **AC-16** Given the dashboard on Monday 13 October 2026, when the "Needs re-verification" list renders, then its first row reads "Ossington Blackbox" with a warning badge "Stale", the meta "Studio · Prices verified 2 Mar 2026 (225 days ago)" with `<time datetime="2026-03-02">`, and a small "Edit" button-link whose accessible name is "Edit Ossington Blackbox prices". (L2-044)
- **AC-17** Given the "Due soon" group, when it renders, then Liberty Cyc House shows an info badge "Due soon" and the meta "Studio · Prices verified 28 Apr 2026 (168 days ago)". (L2-044)
- **AC-18** Given the row for Distillery District, when the owner activates "Edit Distillery District permits", then the spot editor for Distillery District opens. (L2-044)
- **AC-19** Given the dashboard at 320 px, when the re-verification list renders, then each row's title, badge and meta wrap inside the row, each Edit stays right-aligned within its row, nothing is truncated, and `document.documentElement.scrollWidth` equals 320. (L2-053)
- **AC-20** Given the dashboard at 360 px, when each Edit is measured, then it is at least 44 CSS px tall. (L2-065)
- **AC-21** Given the dashboard while loading, when it renders, then the list region has `aria-busy="true"`, a visually hidden status "Loading the dashboard", and three `li.admin-row.admin-row--skeleton` rows whose skeletons are hidden from assistive technology. (L2-026)
- **AC-22** Given the rain backup and the re-verification list in the light and the dark theme, when the contrast check runs, then studio names, titles and meta are at least 4.5:1 against `--color-bg-canvas`. (L2-068)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the section-link
hover fill is instant and the admin skeleton shimmer stops under
`prefers-reduced-motion: reduce`
([list.html](../../design-system/components/list.html), Accessibility › Motion).

### Performance

- **AC-23** Given the `list/performance` harness route with the admin menu's five section links, when "Studios" is activated, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Library folder `frontend/projects/components/src/lib/section-links/`:
  `section-links.component.ts` (`SectionLinksComponent`, selector
  `st-section-links`), `.html`, `.css` (port of `.section-list` and
  `.section-link*` from `components.css`; the `[data-state="focus"]` inset ring
  becomes the `:focus-visible` rule, D-4; other `[data-state]` selectors are
  dropped). `:host { display: block; }`.
- Rows: `<a class="section-link" [routerLink]="item.link" routerLinkActive ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: !!item.exact }" [attr.data-highlight]="item.attention ? '' : null">`.
- ICD change (ICD-002 1.1.0, additive): `SectionLink` gains `exact?: boolean`
  (D-2) and `attention?: boolean` (D-3), both used only as input.
- ICD change (ICD-002 1.1.0, additive): §11.2 adds `.list`, `.list__*` to the
  application feature CSS row (D-1). Today no owner lists them.
- Application: `RainBackupComponent` (`features/spots/rain-backup/`) ports
  `.list*`; `AdminDashboardPageComponent` (`features/admin/dashboard/`) ports
  `.admin-list` and `.admin-row*` and composes `a[st-button]`, `st-badge` and
  `st-skeleton`.
- Mock drift: the admin menu writes counts as "7 published · 2 drafts"; the
  product uses the dashboard wording "7 published, 2 draft" (D-5). The public
  menu mock marks no row current (D-6).

## Decisions

- **D-1** *ICD-002 §9.3 gives the library only `st-section-links`, §11.2 gives `.admin-list` and `.admin-row*` to the application, and `.list*` has no owner.* The CRD keeps the library API to `st-section-links` and specifies the rain backup rows and the admin rows as application parts of `RainBackupComponent` and `AdminDashboardPageComponent`, the names the detailed designs use. `.list*` joins the application row of §11.2 (ICD-002 1.1.0, additive), because its only use is the rain backup.
- **D-2** *How are Dashboard ("/admin") and View site ("/") kept from being current on every admin screen, while Studios stays current on every studio editor?* `SectionLink` gains `exact?: boolean` (additive), mirroring `NavLink.exact`; prefix matching stays the default.
- **D-3** *The design system defines attention meta (`.section-link[data-highlight]`) but `SectionLink` cannot express it.* `SectionLink` gains `attention?: boolean` (additive), rendered as the design system's `data-highlight` attribute. The design system's own example is the admin menu's "Dashboard · 2 items need re-verifying", so the application sets it on that row whenever at least one entry needs re-verifying; the words, not the colour, carry the meaning.
- **D-4** *Where is the section link's focus ring drawn?* Inside the row (`outline-offset: calc(-1 * var(--focus-ring-width))`) on `:focus-visible`, as the design system's focus specimen draws it. Rows span the sheet body edge to edge, where an outside ring would be clipped. Today's stylesheet applies the inset only to the documentation `data-state`, so the rendering shows it as a specimen.
- **D-5** *The admin menu mock writes "7 published · 2 drafts"; the dashboard and L2-053.1 say "7 published, 2 draft".* The product uses the dashboard wording, as the design system's navigation pattern does. It is application copy; the component is unaffected.
- **D-6** *The public menu mock marks no row current, while the admin menu marks Dashboard.* Both mark the current section, as the design system decided, through the same `RouterLinkActive` rule as the header.
- **D-7** *May a section link hold a button or a second link?* No. The whole row is one link; the component has no slot, so nothing interactive can be nested.
- **D-8** *Why two components in the public sheet?* Each `st-section-links` is one labelled `nav`; the public sheet has "Primary" and "About ShotThere", as the mock does.
- **D-9** *Which element is the host's box?* `st-section-links` is `display: block` with no box styles; the `nav` inside is the landmark.
- **D-10** *Who closes the sheet after a row is activated?* The application, when the router finishes navigating; the component emits nothing, because ICD-002 gives it no output and a duplicate of the native click is not wanted (ICD-API-3).
- **D-11** *Are list rows selectable, as the design system's selected state suggests?* No. `aria-selected` belongs only to listbox options and no ShotThere list is one; the rain backup and admin rows stay read-only rows of links.
