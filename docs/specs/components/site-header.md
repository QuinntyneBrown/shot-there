# Site header

| Field | Value |
|---|---|
| Selector | `st-site-header` |
| Library path | `frontend/projects/components/src/lib/site-header/` |
| Status | planned |
| Traces to | L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`site-header.html`](../../design-system/components/site-header.html) |
| Source mocks | [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/editorial-policy/default`](../../mocks/pages/editorial-policy/default.html), [`pages/not-found/default`](../../mocks/pages/not-found/default.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`dialogs/site-menu/default`](../../mocks/dialogs/site-menu/default.html), [`dialogs/site-menu/admin`](../../mocks/dialogs/site-menu/admin.html), [`dialogs/delete-content/default`](../../mocks/dialogs/delete-content/default.html) |
| Rendering | [`site-header.html`](site-header.html) |

## Purpose and scope

The site header is the first landmark on every ShotThere page and the quietest
thing on it: the wordmark with its area tag ("ShotThere Toronto", "ShotThere
Admin") and a few plain links. On public pages the links are Studios, Spots,
Map, Compare and Guides; in the admin they are Dashboard, Studios, Spots,
Guides and View site, followed by the application's Sign out. Below 48rem the
links fold behind one "Menu" button. The owner sign-in shows the wordmark only.
It scrolls away with the page; nothing in it is sticky.

The header only reports that Menu was pressed (`menuToggled`) and reflects the
state it is given (`menuExpanded`, ICD-002 D-8). The menu itself is the
application's site menu: an [`st-sheet`](sheet.md) holding
[`st-section-links`](list.md) rows. The skip link before it is
[`st-skip-link`](skip-link.md); the breadcrumb under it is
[`st-breadcrumb`](breadcrumb.md).

Out of scope:

- Opening, closing and focus handling of the site menu, and which links it
  lists: the application, through `DialogService` (focus starts on Close,
  Escape and Close return focus to Menu, ICD-A11Y-5).
- Which links each area shows, their paths (`APP_PATHS`) and `exact` flags;
  whether admin navigation appears at all (L2-052.4): the application.
- The Sign out form and its POST (L2-051.3): the application projects it into
  `actions`.
- Theme choice and the no-flash snippet: the application (ICD-STY-5).

## Usage

Every `.site-header` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks site-header "header"`, `wordmark "a|span"`, `site-nav "nav|a|button|form"`): 143 uses on all 33 screens.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studios/*`, `pages/studio/*` | public: `brandTag` "Toronto", `homeLink` "/", `navLabel` "Primary", five links | none | Studios current (list and every review), Menu below 48rem | canvas |
| `pages/spots/*`, `pages/spot/*`, `pages/map/*`, `pages/compare/*`, `pages/guides/*`, `pages/guide/*` | public, as above | none | Spots, Map, Compare or Guides current | canvas |
| `pages/home/*`, `pages/editorial-policy/default`, `pages/not-found/default`, `pages/server-error/default`, `notifications/public-toast/*` | public, as above | none | nothing current | canvas |
| `pages/admin-dashboard/*`, `pages/admin-studios/*`, `pages/admin-spots/*`, `pages/admin-guides/*`, `notifications/admin-toast/*` | admin: `brandTag` "Admin", `homeLink` "/admin", `navLabel` "Administration", five links (Dashboard `exact`, View site `exact`) | `actions`: Sign out ghost button in a POST form | Dashboard or Studios / Spots / Guides current | canvas |
| `pages/studio-editor/*`, `pages/spot-editor/*`, `pages/guide-editor/*` | admin, as above | `actions`: Sign out | the list the editor belongs to is current | canvas |
| `pages/sign-in/*` (8 states) | wordmark only: `brandTag` `null`, `homeLink` "/", `links` `[]` | none | — | canvas |
| `dialogs/site-menu/default`, `dialogs/site-menu/admin` | public or admin, behind the open sheet | as the page | Menu `aria-expanded="true"`; page inert | canvas, behind the backdrop |
| Every other `dialogs/*/*` | the page's header behind a dialog | as the page | inert | canvas, behind the backdrop |

Every row is buildable with the API below: area, tag, links and their `exact`
flags are inputs; Sign out is projected; the open state is `menuExpanded`.

## Anatomy

1. **Banner** — `header.site-header`: flex row on the canvas, `min-height:
   var(--layout-topbar-height)`, side padding `--layout-margin`, top padding
   `env(safe-area-inset-top)`, centred within `--layout-container-max`.
2. **Wordmark** — `a.wordmark` (RouterLink to `homeLink`): `brand` in
   `--text-wordmark`, at least `--target-comfortable` tall.
3. **Area tag (optional)** — `span.wordmark__tag` inside the wordmark: `brandTag`
   in `--text-label`, muted, hairline pill. Part of the wordmark's name. Hidden
   below 24rem.
4. **Navigation** — `nav.site-nav` named by `navLabel`, pushed to the right.
   Rendered only when `links` is not empty (D-5).
5. **Nav link** — `a.site-nav__link.site-nav__extra` per `NavLink`: muted
   `--text-nav`, 44 px tall; `aria-current="page"` when active (ink, semibold).
6. **Actions (optional)** — `div.site-nav__extra` wrapping the `actions` slot,
   after the links (D-4). Hidden below 48rem.
7. **Menu button** — `button.btn.btn--ghost.site-nav__menu` (a composed
   [`button[st-button]`](button.md), variant `ghost`) with the `menu`
   [`st-icon`](icon.md) and `menuLabel`. Shown below 48rem only.

Host: `st-site-header` is `display: block` and has no box styles of its own;
the `<header>` inside is the banner landmark (ICD-DOM-1).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `brand` | `string` | — | yes | The wordmark text, "ShotThere". A name: the application passes it unmarked or marked as not translatable. |
| `brandTag` | `string \| null` | `null` | no | "Toronto" or "Admin" in `.wordmark__tag`; `null` renders no tag (sign-in). |
| `homeLink` | `string` | — | yes | The wordmark's `routerLink`: "/" (public, sign-in) or "/admin". |
| `links` | `readonly NavLink[]` | — | yes | One `a.site-nav__link.site-nav__extra` each, in order, tracked by `link`. `aria-current="page"` through `RouterLinkActive`, matching exactly when `exact` is true, as a prefix otherwise. An empty array renders no `nav` and no Menu button (D-5). External links per ICD-SEC-2 (D-7). |
| `navLabel` | `string` | — | yes | The `nav` `aria-label`: "Primary" or "Administration". |
| `menuLabel` | `string` | §12 `st.siteHeader.menu` ("Menu") | no | Visible text and accessible name of the Menu button. |
| `menuExpanded` | `boolean` | `false` | no | `aria-expanded` on the Menu button. The header never changes it itself (D-3). |
| `menuControls` | `string \| null` | `null` | no | `aria-controls` on the Menu button; `null` renders none. |
| `externalHint` | `string` | §12 `st.link.external` ("(opens in a new tab)") | no | Visually hidden suffix of an external link's name (D-7, ICD change). |

`menuExpanded` uses `booleanAttribute`. Every string except `brand` is product
copy the application marks for translation (`i18n-navLabel`, `NavLink.label`
through `$localize`).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `menuToggled` | `void` | The Menu button is activated (click, Enter or Space). Emitted once per activation, whether the menu is open or closed; the application decides what to do (ICD-002 D-8). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `actions` | The admin "Sign out": `<form method="post">` with a ghost `button[st-button]` | Rendered inside the nav after the links, inside `div.site-nav__extra`, so it is hidden below 48rem with the links (D-4). |

The header's only library strings are `st.siteHeader.menu` and
`st.link.external` (ICD §12).

## Variants and sizes

| Variant | Configuration | Use for |
|---|---|---|
| Public | `brandTag` "Toronto", `navLabel` "Primary", Studios, Spots, Map, Compare, Guides | Every public page, the editorial policy and the error pages. |
| Admin | `brandTag` "Admin", `homeLink` "/admin", `navLabel` "Administration", Dashboard, Studios, Spots, Guides, View site; Sign out in `actions` | Every admin screen. |
| Wordmark only | `brandTag` `null`, `links` `[]` | The eight owner sign-in states. |

One size; the height and side padding follow the breakpoint:

| Breakpoint | Minimum height (`--layout-topbar-height`) | Side padding (`--layout-margin`) | Links |
|---|---|---|---|
| XS, SM (below 48rem) | 4rem | `--space-4` | Menu button |
| MD (48rem) | 5rem | `--space-8` | Inline, link padding `--space-2` |
| LG (62rem) | 6rem | `--space-12` | Inline, link padding `--space-3` |
| XL (75rem and up) | 6rem | `--space-20`, within `--layout-container-max` | Inline |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default link | — | `--color-fg-muted` | Link named by its label |
| Hover link | `:hover` | `--color-fg-default` | — |
| Focus | `:focus-visible` on wordmark, link, Menu or Sign out | Shared ring: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset` | Focus on the element |
| Current link | `aria-current="page"` from `RouterLinkActive` | `--color-fg-default`, `--font-weight-semibold` (weight, not colour alone) | "current page" |
| Wordmark hover, active | `:hover`, `:active` | No change: it stays ink | — |
| Menu, default / hover / active | ghost button states | Transparent; `--btn-bg-hover`; `--btn-bg-active` | "Menu, button, collapsed, has popup dialog" |
| Menu, expanded | `menuExpanded` → `aria-expanded="true"` | No change of look; the page behind is inert while the sheet is open | "expanded" |
| Sign out | ghost button states (application's) | As [button](button.md) | Button "Sign out" |
| Narrow (below 24rem) | viewport | Tag hidden | Wordmark name is `brand` alone ("ShotThere") |
| Phone (below 48rem) | viewport | Links and actions hidden, Menu shown | Hidden links leave the tab order |
| Inert | page behind a dialog | Unchanged | Hidden by `inert` |
| Print | `@media print` | Not printed | — |

Nothing in the header is ever disabled.

## Markup

```html
<!-- rendered: public, a studio review (Studios current), desktop -->
<header class="site-header">
  <a class="wordmark" href="/">ShotThere <span class="wordmark__tag">Toronto</span></a>
  <nav class="site-nav" aria-label="Primary">
    <a class="site-nav__link site-nav__extra" href="/studios" aria-current="page">Studios</a>
    <a class="site-nav__link site-nav__extra" href="/spots">Spots</a>
    <a class="site-nav__link site-nav__extra" href="/map">Map</a>
    <a class="site-nav__link site-nav__extra" href="/compare">Compare</a>
    <a class="site-nav__link site-nav__extra" href="/guides">Guides</a>
    <button class="btn btn--ghost site-nav__menu" type="button" aria-haspopup="dialog" aria-expanded="false">
      <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>Menu
    </button>
  </nav>
</header>
```

```html
<!-- rendered: admin, studio editor (Studios current), Sign out projected -->
<header class="site-header">
  <a class="wordmark" href="/admin">ShotThere <span class="wordmark__tag">Admin</span></a>
  <nav class="site-nav" aria-label="Administration">
    <a class="site-nav__link site-nav__extra" href="/admin">Dashboard</a>
    <a class="site-nav__link site-nav__extra" href="/admin/studios" aria-current="page">Studios</a>
    <a class="site-nav__link site-nav__extra" href="/admin/spots">Spots</a>
    <a class="site-nav__link site-nav__extra" href="/admin/guides">Guides</a>
    <a class="site-nav__link site-nav__extra" href="/">View site</a>
    <div class="site-nav__extra">
      <form action="/admin/sign-out" method="post"><button class="btn btn--ghost" type="submit">Sign out</button></form>
    </div>
    <button class="btn btn--ghost site-nav__menu" type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="site-menu">
      <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>Menu
    </button>
  </nav>
</header>
```

```html
<!-- rendered: sign-in, wordmark only -->
<header class="site-header">
  <a class="wordmark" href="/">ShotThere</a>
</header>
```

```html
<!-- rendered: an external NavLink (no product screen uses one in the header) -->
<a class="site-nav__link site-nav__extra" href="https://www.youtube.com/@ShotThere" target="_blank" rel="noopener">YouTube<span class="visually-hidden"> (opens in a new tab)</span></a>
```

```html
<!-- consumer: shell, admin area -->
<st-site-header brand="ShotThere" i18n-brandTag brandTag="Admin" [homeLink]="paths.admin"
                [links]="adminLinks" i18n-navLabel navLabel="Administration"
                [menuExpanded]="menuOpen()" (menuToggled)="openMenu()">
  <form slot="actions" [action]="paths.signOut" method="post" (submit)="signOut($event)">
    <button st-button variant="ghost" type="submit" i18n>Sign out</button>
  </form>
</st-site-header>

<!-- consumer: sign-in page shell -->
<st-site-header brand="ShotThere" [homeLink]="paths.home" [links]="[]" i18n-navLabel navLabel="Primary" />
```

The e2e component object finds the header by the banner role, the nav by its
name and links by role and name; the classes above are the contract for
styling assertions. `_ngcontent-*` attributes are not part of it (ICD-DOM-3).

## Design

- Banner: `display: flex`, `align-items: center`, `gap: var(--space-2)`; `min-height: var(--layout-topbar-height)`; `padding-inline: var(--layout-margin)`; `padding-top: env(safe-area-inset-top)`; `max-width: var(--layout-container-max)`, centred, `width: 100%`; background `--color-bg-canvas`; no border, no shadow.
- Wordmark: `--text-wordmark` with `--letter-spacing-tight`, `--color-fg-default`, no underline, one line, `gap: var(--space-2)` before the tag, `min-height: var(--target-comfortable)`.
- Tag: `--text-label`, `--color-fg-muted`, padding `0 var(--space-2)`, `--border-width-hairline` in `--color-border-default`, `--radius-full`; `display: none` below 24rem.
- Nav: `margin-left: auto`; `gap: var(--space-1)`, `--space-2` below 48rem.
- Nav link: `--text-nav`, `min-height: var(--target-comfortable)`, `padding-inline: var(--space-3)` (`--space-2` from 48rem to 62rem), `--radius-full`, one line; colour transition `--duration-fast` with `--ease-standard`.
- Visibility: `.site-nav__extra` hidden below 48rem and `inline-flex` from 48rem; `.site-nav__menu` shown below 48rem only; `.site-nav__extra:empty` is never displayed (D-4).
- Menu button: the ghost [button](button.md) at md size (`--control-height-md`), `menu` icon then label.
- Print: the banner is not printed.

It declares no component tokens; Menu and Sign out theme with the button.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Background | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Wordmark, hovered and current link | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Nav links, area tag | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Tag edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Menu button hover fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Wordmark, current and hovered link |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Nav links, area tag |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Menu and Sign out label on hover |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

The tag's hairline is decorative (the text names the area), so it has no
contrast minimum. Forced colours: links take `LinkText`, the current link keeps
its semibold weight, and Menu keeps the button's `CanvasText` border.

## Responsive behaviour

- Below 48rem (XS, SM): every `.site-nav__extra` (links and the actions
  wrapper) is hidden and the Menu button shows; targets sit `--space-2` apart
  and are 44 px tall (L2-065.3). Sign out moves to the site menu sheet's footer
  (the application's).
- From 48rem: links inline, Menu hidden. Between 48rem and 62rem the link
  padding narrows to `--space-2`, so the admin header with Sign out fits 768 px.
  Nothing collapses in between and the header never wraps onto two lines.
- Below 24rem the tag is hidden, so the public header fits 320 px without
  horizontal scroll; the wordmark's name becomes "ShotThere".
- At XL the header's content is at most `--layout-container-max` (1280 px) wide
  and centred.
- At 200 % zoom in a 1280 px window the layout is 640 px wide and the Menu
  button takes over, as on a phone.
- In landscape at SM the header stays 4rem tall plus the top safe-area inset,
  within 25 % of the viewport height (L2-066.2).
- `padding-top: env(safe-area-inset-top)` keeps the wordmark clear of the notch.
- Nothing wraps or truncates: the wordmark and links are one line each; a
  translated link that would not fit at 48rem is shortened in the catalogue.

## Accessibility

### Role and pattern

`<header>` is the banner landmark; the links sit in a `<nav>` named by
`navLabel`. The Menu button is a native `<button type="button">` with
`aria-haspopup="dialog"`, `aria-expanded` and optional `aria-controls`; the
dialog it opens follows the [APG Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (D-2).
The current link uses `aria-current="page"`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Skip link, wordmark, then each nav link and Sign out (from 48rem) or the Menu button (below 48rem). |
| <kbd>Enter</kbd> | Follows a link; on Menu emits `menuToggled`. |
| <kbd>Space</kbd> | On Menu emits `menuToggled`; on Sign out submits. |
| <kbd>Esc</kbd> (menu open) | Handled by the sheet: closes it and returns focus to Menu. |

### Focus

The shared 2 px `--color-focus-ring` with the `--focus-ring-offset` offset on
`:focus-visible`. The header never moves focus; returning focus to Menu after
the sheet closes is `DialogService`'s (the invoking element).

### Labelling

- The wordmark's name includes the tag: "ShotThere Toronto", "ShotThere Admin";
  below 24rem it is "ShotThere".
- Nav links are single visible words with no `aria-label`.
- Menu's name is the visible `menuLabel`; the icon is `aria-hidden="true"`.
- An external link's name ends with the hidden `externalHint`.

### Announcements

None. Expanded state is conveyed by `aria-expanded`.

### Motion

Link colour changes over `--duration-fast`, which the tokens set to 0 under
`prefers-reduced-motion: reduce`. The sheet's own slide-in belongs to
[sheet](sheet.md) ([site-header.html](../../design-system/components/site-header.html), Accessibility › Motion).

## Content and internationalisation

- Public links, in this order: Studios, Spots, Map, Compare, Guides. Admin
  links: Dashboard, Studios, Spots, Guides, View site, then Sign out. One word
  or two; "Sign out", not "Log out".
- Tags: "Toronto" and "Admin". No strapline.
- "Menu" is the library string `st.siteHeader.menu`; the button always shows
  the word next to the icon.
- `brand` "ShotThere" is a name and is not translated. `brandTag`, `navLabel`
  and each `NavLink.label` are product copy the application marks for
  translation. Longer translations keep one line per link; the phone layout
  shows only the wordmark and Menu, so only the 48rem layout is at risk, and a
  label that would not fit there is shortened in the catalogue.

## Performance

- Change detection: `OnPush`, signal inputs; whether the nav renders is a
  `computed` of `links().length`; links render with `@for` tracked by `link`.
- `RouterLinkActive` is the only router dependency (ICD-DEP-1); the header
  never reads the URL itself (ICD-API-11).
- Performance scenario: the `components-harness` route `site-header/performance`
  renders the public header on the studio list (Studios current) and the admin
  header with Sign out; pressing Menu at 360 px must stay within the L2-071 INP
  budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the header's height comes from `--layout-topbar-height` and
  does not change when the current link changes or the menu opens.
- Weight: imports `@angular/core`, `@angular/router` (`RouterLink`,
  `RouterLinkActive`), `@angular/localize`, and the library's button and icon.

## Acceptance criteria

### Rendering

- **AC-1** Given the public header on the studio list, when it renders at 1280 px, then there is one banner landmark with class `site-header`, a link "ShotThere Toronto" with class `wordmark` to "/", and a navigation landmark named "Primary" holding the links Studios, Spots, Map, Compare and Guides in that order, each with the classes `site-nav__link site-nav__extra`. (L2-069)
- **AC-2** Given the public header on `/studios/the-junction-loft`, when it renders, then only "Studios" has `aria-current="page"` and is drawn at `--font-weight-semibold` in `--color-fg-default`, and the other four links have no `aria-current`. (L2-069)
- **AC-3** Given the admin header on `/admin/studios/corktown-garage-studio` with Dashboard and View site marked `exact`, when it renders, then the wordmark "ShotThere Admin" links to "/admin", the navigation is named "Administration", "Studios" has `aria-current="page"`, and neither "Dashboard" nor "View site" does. (L2-069)
- **AC-4** Given the admin header on `/admin`, when it renders, then "Dashboard" has `aria-current="page"` and "Studios", "Spots", "Guides" and "View site" do not. (L2-069)
- **AC-5** Given the sign-in page's header with `brandTag` `null` and `links` `[]`, when it renders, then it contains only a link named "ShotThere" to "/", with no `.wordmark__tag`, no navigation landmark and no Menu button. (L2-069)
- **AC-6** Given the admin header with a Sign out form projected into `actions`, when a keyboard user tabs through it at 1280 px, then focus moves wordmark, Dashboard, Studios, Spots, Guides, View site, then "Sign out", and the Sign out form sits inside the navigation in a `div.site-nav__extra`. (L2-067)

### Menu

- **AC-7** Given the public header at 360 px, when it renders, then the five links are not displayed, and a `button.btn.btn--ghost.site-nav__menu` with `type="button"`, `aria-haspopup="dialog"`, `aria-expanded="false"`, a hidden icon and the accessible name "Menu" is displayed. (L2-064)
- **AC-8** Given the public header at 768 px, when it renders, then the five links are displayed inline in one row and the Menu button is not displayed. (L2-064)
- **AC-9** Given the Menu button at 360 px, when the visitor clicks it, then presses Enter on it, then presses Space on it, then `menuToggled` is emitted exactly three times and `aria-expanded` is unchanged until the application sets `menuExpanded`. (L2-064)
- **AC-10** Given `menuExpanded` true and `menuControls` "site-menu", when the header renders, then the Menu button has `aria-expanded="true"` and `aria-controls="site-menu"`; with `menuControls` `null` it has no `aria-controls`. (L2-069)
- **AC-11** Given the admin header at 360 px with Sign out projected, when it renders, then Sign out is not displayed and cannot be reached with Tab, and the Tab order is wordmark then Menu. (L2-064)

### Keyboard and focus

- **AC-12** Given the public header at 1280 px, when a keyboard user tabs from the skip link, then focus moves wordmark, Studios, Spots, Map, Compare, Guides, and each shows a 2 px `--color-focus-ring` outline with at least 3:1 contrast against the canvas. (L2-067)

### Screen readers

- **AC-13** Given the public, admin and sign-in headers, when axe-core scans them in light and dark at 360 px and 1280 px, then no violation is reported, the Menu icon is hidden from the accessibility tree, and no nav link has an `aria-label`. (L2-069)

### Theming

- **AC-14** Given the public header with Studios current, in the light and the dark theme, when the contrast check runs, then the wordmark and current link are at least 4.5:1 and the other links and the "Toronto" tag at least 4.5:1 against `--color-bg-canvas`. (L2-068)

### Responsive

- **AC-15** Given the public header at 320 px, when it renders, then the "Toronto" tag is not displayed, the wordmark's accessible name is "ShotThere", and `document.documentElement.scrollWidth` equals 320. (L2-064)
- **AC-16** Given the admin header with Sign out at exactly 768 px, when it renders, then all five links and Sign out are on one row and `document.documentElement.scrollWidth` equals 768. (L2-064)
- **AC-17** Given the public header at 1440 px, when it renders, then the wordmark's left edge and the last link's right edge lie within a centred box at most 1280 px wide. (L2-064)
- **AC-18** Given the public header at 360 px, when the wordmark and the Menu button are measured, then each is at least 44 CSS px tall and they are at least 8 px apart. (L2-065)
- **AC-19** Given the public header in a 1280 px window at 200 % zoom, when it renders, then the Menu button is displayed, the links are not, and there is no horizontal page scroll. (L2-066)
- **AC-20** Given the public header in a 640 × 360 px landscape viewport, when it renders, then the header is at most 90 px tall (25 % of the viewport height). (L2-066)

### Content

- **AC-21** Given the components-harness extracted messages, when the library's translation source is inspected, then "Menu" is the message `st.siteHeader.menu`, and with `menuLabel` "Menu du site" the button's visible text and accessible name are "Menu du site". (L2-070)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` link colour changes are instant
([site-header.html](../../design-system/components/site-header.html), Accessibility › Motion).

### Performance

- **AC-22** Given the `site-header/performance` harness route at 360 px, when the Menu button is pressed, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile and the cumulative layout shift stays 0. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/site-header/`:
  `site-header.component.ts` (`SiteHeaderComponent`, selector
  `st-site-header`), `.html`, `.css` (port of `.site-header`, `.wordmark*` and
  `.site-nav*` from `components.css`, minus the `[data-state]`
  documentation selectors, plus `.site-nav__extra:empty { display: none !important; }`
  and the print rule). `:host { display: block; }`.
- Composes `button[st-button]` (variant `ghost`, `type="button"`,
  `aria-haspopup="dialog"`, class `site-nav__menu`) and `st-icon name="menu"`.
  The header's encapsulated CSS reaches the button host because the host is in
  the header's own template.
- Internal links: `<a [routerLink]="l.link" routerLinkActive ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: !!l.exact }">`
  (`RouterLinkActive` with an empty class list). External links: plain
  `<a [href]>` with `target="_blank"`, `rel="noopener"` and the hidden
  `externalHint`, no `RouterLinkActive`.
- Library strings: `$localize\`:@@st.siteHeader.menu:Menu\`` and the shared
  `$localize\`:@@st.link.external:(opens in a new tab)\`` as input defaults.
- ICD change (ICD-002 1.1.0, additive): `SiteHeaderComponent` gains
  `externalHint` (input, `string`, default §12 `st.link.external`), and §12 adds
  it to the override inputs of `st.link.external` (D-7).
- Mock drift the component corrects: the mocks' Menu trigger is an
  `<a href="…/site-menu/…">`; the product renders a `<button>` (D-1). The admin
  dialog mocks draw the inert header with a `span.wordmark` and `span` links and
  leave out Menu and Sign out; behind a dialog the product shows the page's
  header unchanged (D-9).

## Decisions

- **D-1** *The mocks draw Menu as a link to the open-menu mock; what is it in the product?* A native `<button type="button">` composed from `button[st-button]` variant `ghost`, as the design system specifies. A link that navigates cannot be "expanded"; the mocks link only because static files cannot open a sheet.
- **D-2** *Does Menu open a disclosure, as L2-064.2 first said, or the modal sheet every mock and the design system draw (`dialogs/site-menu`)?* The modal sheet, so Menu carries `aria-haspopup="dialog"`. The product owner decided this on 14 Oct 2026; L2-064.2 now reads "opens an accessible modal menu sheet" and ICD-002 D-8 records the choice.
- **D-3** *Who sets `aria-expanded`?* Only the application, through `menuExpanded`. The header emits `menuToggled` and keeps no open state of its own (ICD-002 D-8), so the attribute always matches the real sheet.
- **D-4** *How does projected Sign out hide below 48rem, when emulated encapsulation cannot style projected nodes and the application may not use library classes (ICD-DOM-5)?* The header wraps the `actions` slot in its own `div.site-nav__extra`, which its CSS hides below 48rem; `.site-nav__extra:empty` is never displayed, so a header without actions adds no gap. The design system's `form.site-nav__extra` becomes `div.site-nav__extra > form`.
- **D-5** *ICD-002 makes `links` and `navLabel` required, but the sign-in header has no navigation.* The sign-in page passes `links` `[]`; an empty list renders no `nav` and no Menu button, so there is no empty navigation landmark and no Menu with nothing behind it. `navLabel` is then unused.
- **D-6** *How is the current section marked on a review and kept off Dashboard and View site?* `RouterLinkActive` with `ariaCurrentWhenActive="page"`, prefix matching by default, so `/studios` is current on every review under it, and exact matching when `NavLink.exact` is true. The admin shell sets `exact` on Dashboard ("/admin") and View site ("/"), which would otherwise match every admin path.
- **D-7** *ICD-SEC-2 requires external `NavLink`s to get `target="_blank"` and `rel="noopener"`, but the header has no way to say so in the name without a library string, and ICD-I18N-3 requires an override input for each library string.* The header renders external links with `target`, `rel` and a visually hidden suffix from `st.link.external`, overridable through a new `externalHint` input (ICD-002 1.1.0, additive), the same input the footer gains. No product header link is external today.
- **D-8** *Which element is the host's box?* `st-site-header` is `display: block` with no padding, margin or border; the `<header>` inside carries every style, so the application may only place the host (ICD-DOM-5).
- **D-9** *The admin dialog mocks show the inert header as plain text without Menu or Sign out.* The product renders the page's real header behind every dialog; the page is inert, so its links are neither focusable nor read. The plain-text copies are a mock shortcut.
- **D-10** *What is the wordmark's accessible name?* `brand` plus a space plus `brandTag` ("ShotThere Toronto"), from the link's own text. Below 24rem the tag is `display: none`, so the name becomes "ShotThere", which is still correct on every page.
