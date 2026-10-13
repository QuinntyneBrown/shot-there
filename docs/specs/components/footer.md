# Footer

| Field | Value |
|---|---|
| Selector | `st-site-footer` |
| Library path | `frontend/projects/components/src/lib/site-footer/` |
| Status | planned |
| Traces to | L2-039, L2-046, L2-048, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`footer.html`](../../design-system/components/footer.html) |
| Source mocks | [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studios/filtered`](../../mocks/pages/studios/filtered.html), [`pages/spots/default`](../../mocks/pages/spots/default.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/compare/default`](../../mocks/pages/compare/default.html), [`pages/guides/default`](../../mocks/pages/guides/default.html), [`pages/guide/default`](../../mocks/pages/guide/default.html), [`pages/editorial-policy/default`](../../mocks/pages/editorial-policy/default.html), [`pages/not-found/default`](../../mocks/pages/not-found/default.html), [`pages/server-error/default`](../../mocks/pages/server-error/default.html), [`notifications/public-toast/success`](../../mocks/notifications/public-toast/success.html) |
| Rendering | [`footer.html`](footer.html) |

## Purpose and scope

The footer closes every public page. It repeats the promise ("Nothing is
listed unless it has been shot there"), holds the compact email signup ("New
reviews by email"), links to Studios, Spots, Guides, the editorial policy and
the YouTube channel, and ends with the line that says nobody pays for
placement. It is quiet: canvas background, muted small text, no border, and a
large gap above it.

The signup inside it is the application's `EmailSignupComponent`
(subscribe-by-email design), projected into the `signup` slot; its fields and
states are specified by [text field](text-field.md), [button](button.md) and the
design system's [email signup](../../design-system/components/signup.html).
The header at the top of the page is [`st-site-header`](site-header.md).

Out of scope:

- The signup form, its validation, busy, done and rate-limited states, the
  honeypot and its live region (L2-039 to L2-041): the application's
  `EmailSignupComponent`, including its placement inside the footer row (D-1).
- Which pages have a footer (none in the admin, on the owner sign-in or on the
  map), which links it carries, their paths, `exact` flags and the YouTube URL:
  the application.
- The copy line's year and wording: the application formats the whole string.
- Room for the compare bar below the copy line (`.has-compare-bar` on `<body>`):
  the application and [`st-compare-bar`](compare-bar.md).

## Usage

Every `.site-footer` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks site-footer "footer|div|nav|p"`): 46 uses on 12 screens, one configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/home/*` (7 states), `pages/studio/*`, `pages/spot/*`, `pages/compare/*`, `pages/guide/default`, `pages/guides/*`, `pages/editorial-policy/default`, `pages/not-found/default`, `pages/server-error/default`, `notifications/public-toast/*` | `brand` "ShotThere", `tagline`, `navLabel` "Footer", five links (Studios, Spots, Guides, Editorial policy exact; YouTube channel external), `copy` | `signup`: the compact signup, always starting empty | no current link | canvas |
| `pages/studios/*` (8 states) | as above | as above | Studios current (D-4) | canvas |
| `pages/spots/*` (6 states) | as above | as above | Spots current | canvas |
| `pages/studios/selected`, `selected-one`, `pages/studio/in-compare` | as above, with the compare bar fixed below | as above | as above | canvas, above the compare bar |
| Admin screens, `pages/sign-in/*`, `pages/map/*` | not rendered | — | — | — |

Every row is buildable with the API below. The signup's own states
(invalid, submitting, success, error, rate-limited) change only the projected
content.

## Anatomy

1. **Content info** — `footer.site-footer`: a wrapping flex row inside
   `--layout-container-max`, `--space-24` above it, muted `--text-body-sm`.
2. **Brand** — `div.site-footer__brand`: `<strong>` with `brand` in `--text-h4`
   and `--color-fg-default`, then `<span>` with `tagline`; at most 22rem wide.
3. **Signup (slot)** — the application's `EmailSignupComponent`, a direct flex
   item of the footer row, after the brand.
4. **Footer links** — `nav.site-footer__links` named by `navLabel` around a
   `<ul>` of `<li><a>`: muted, no underline until hover, each 44 px tall; a
   column below 36rem, a wrapping row from 36rem.
5. **Copy line (optional)** — `p.site-footer__copy` with `copy`, full width, last.

Host: `st-site-footer` is `display: block` with no box styles of its own; the
`<footer>` inside is the content-info landmark (ICD-DOM-1, D-5).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `brand` | `string` | — | yes | The name in `.site-footer__brand strong`, "ShotThere". |
| `tagline` | `string \| null` | `null` | no | The promise in the brand's `<span>`; `null` renders no span. |
| `links` | `readonly NavLink[]` | — | yes | One `<li><a>` each, in order, tracked by `link`. Internal links use `RouterLink` and get `aria-current="page"` through `RouterLinkActive` (exact when `exact` is true). External links get `target="_blank"`, `rel="noopener"` and the hidden `externalHint`, and are never current (ICD-SEC-2, L2-048.1). |
| `navLabel` | `string` | — | yes | The nav's `aria-label`, "Footer". |
| `copy` | `string \| null` | `null` | no | `p.site-footer__copy`; `null` renders no paragraph. |
| `externalHint` | `string` | §12 `st.link.external` ("(opens in a new tab)") | no | Visually hidden suffix of every external link's name (D-2, ICD change). |

All strings except `brand` are product copy the application marks for
translation.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Links navigate; the signup is the application's and reports through its own component. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `signup` | The application's `EmailSignupComponent` (`form.signup` inside) | Projected between the brand and the footer links, as a direct item of the footer's flex row (D-1). |

The footer's only library string is `st.link.external` (ICD §12).

## Variants and sizes

One footer, identical on every public page; the only difference between pages
is which footer link, if any, is current. One size: padding `--space-10` top
and bottom (plus the bottom safe-area inset), `--layout-margin` at the sides,
width up to `--layout-container-max`, so it lines up with the content above it.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default link | — | `--color-fg-muted`, no underline | Link named by its label |
| Hover link | `:hover` | `--color-fg-default` and an underline (not colour alone) | — |
| Focus | `:focus-visible` | Shared ring: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset` | Focus on the link |
| Active link | `:active` | Same as hover; no pressed look | — |
| Current link | `aria-current="page"` from `RouterLinkActive` | `--color-fg-default`, `--font-weight-medium` | "current page" |
| External link | `NavLink.external` | Same look as the others, no icon | Name ends "(opens in a new tab)"; opens a new tab |
| No tagline / no copy | `tagline` or `copy` `null` | Part not rendered | — |
| Signup states | the application's signup | Change only the projected content | The signup's own live region |
| Disabled | — | Never: footer links are never disabled | — |

## Markup

```html
<!-- rendered: the spot list (Spots current), signup projected -->
<footer class="site-footer">
  <div class="site-footer__brand">
    <strong>ShotThere</strong>
    <span>Toronto photo studios and outdoor spots, reviewed first-hand. Nothing is listed unless it has been shot there.</span>
  </div>
  <st-email-signup><!-- application: form.signup … --></st-email-signup>
  <nav class="site-footer__links" aria-label="Footer">
    <ul>
      <li><a href="/studios">Studios</a></li>
      <li><a href="/spots" aria-current="page">Spots</a></li>
      <li><a href="/guides">Guides</a></li>
      <li><a href="/editorial-policy">Editorial policy</a></li>
      <li><a href="https://www.youtube.com/@ShotThere" target="_blank" rel="noopener">YouTube channel<span class="visually-hidden"> (opens in a new tab)</span></a></li>
    </ul>
  </nav>
  <p class="site-footer__copy">© 2026 ShotThere · No paid placement: order comes only from the sort you choose.</p>
</footer>
```

The `st-email-signup` element name above stands for whatever element the
application's signup component renders; it is not part of this contract.

```html
<!-- consumer: shell, public area -->
<st-site-footer brand="ShotThere"
  i18n-tagline tagline="Toronto photo studios and outdoor spots, reviewed first-hand. Nothing is listed unless it has been shot there."
  [links]="footerLinks" i18n-navLabel navLabel="Footer" [copy]="copyLine()">
  <st-email-signup slot="signup" class="footer-signup" variant="compact" />
</st-site-footer>
```

`footerLinks` (application, labels through `$localize`): Studios `/studios`,
Spots `/spots`, Guides `/guides`, Editorial policy `/editorial-policy`, each
`exact: true`; YouTube channel `https://www.youtube.com/@ShotThere`,
`external: true`. The `footer-signup` class is the application's own feature
CSS on its own element (D-1).

## Design

- Footer row: `display: flex`, `flex-wrap: wrap`, `gap: var(--space-4) var(--space-8)`, `justify-content: space-between`, `align-items: flex-start`; `max-width: var(--layout-container-max)`, `width: 100%`, `margin: var(--space-24) auto 0`; padding `--space-10` and `--layout-margin`, bottom `calc(var(--space-10) + env(safe-area-inset-bottom))`; `--color-fg-muted`, `--text-body-sm`; no background of its own.
- Brand: column, `gap: var(--space-1)`, `max-width: 22rem`; name in `--text-h4`, `--color-fg-default`.
- Links: `nav` column with `gap: var(--space-1)`; `ul` unstyled, a column below 36rem and a wrapping row from 36rem with `gap: 0 var(--space-6)`; each `a` `inline-flex`, `min-height: var(--target-comfortable)`, colour inherited, no underline; hover and current as in *States*.
- Copy line: `flex-basis: 100%`, no maximum width.
- Motion: none; link colours change instantly.

It declares no component tokens. The projected signup keeps its own colours:
the footer's link rules are encapsulated and never reach it (D-1).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Page behind | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Text, tagline, links, copy | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Name, hovered and current link | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Links, tagline and copy line |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Name, hovered and current link |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

The signup's field and Subscribe edges (`--color-border-strong` on
`--color-bg-canvas`, 3:1) belong to the signup. Forced colours: links take
`LinkText`; current keeps its weight and hover its underline.

## Responsive behaviour

- XS (below 36rem): one column. Brand, then the signup across the full width
  (its field and Subscribe stack, L2-039.5), then the links one per line, each a
  full 44 px row, then the copy line.
- From 36rem: the links run in one row with `--space-6` between them, wrapping
  when they run out of room.
- From 48rem: brand and signup sit side by side (the row wraps with
  `space-between`); the links and the copy line follow underneath.
- The bottom padding adds `env(safe-area-inset-bottom)`.
- Nothing scrolls sideways at 320 px; the tagline and copy wrap. At 200 % zoom
  the footer reflows to the XS or SM layout with nothing hidden.
- Text wraps; nothing truncates.

## Accessibility

### Role and pattern

`<footer>` outside any sectioning element is the content-info landmark; the
links are a `<nav>` named by `navLabel` around a `<ul>`, announced "Footer
navigation, list, 5 items".

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | The signup's email field and Subscribe, then each footer link in order. |
| <kbd>Enter</kbd> | Follows the focused link; the YouTube channel opens in a new tab. |

### Focus

The shared 2 px `--color-focus-ring` with the `--focus-ring-offset` offset on
`:focus-visible`. The footer never moves focus.

### Labelling

- Link names are their labels; the external link's name ends with the hidden
  `externalHint`: "YouTube channel (opens in a new tab)".
- The brand is text (`<strong>`), not a heading and not a link: the signup's
  "New reviews by email" is the footer's only heading, at the level the
  application gives it.

### Announcements

None of its own. Signup results are announced by the signup's live region.

### Motion

None. Link colour changes are instant
([footer.html](../../design-system/components/footer.html), Accessibility › Motion).

## Content and internationalisation

- Tagline, word for word: "Toronto photo studios and outdoor spots, reviewed
  first-hand. Nothing is listed unless it has been shot there."
- Links in this order: Studios, Spots, Guides, Editorial policy, YouTube
  channel. Map and Compare are in the header only.
- Copy line: "© 2026 ShotThere · No paid placement: order comes only from the
  sort you choose." The application builds the year.
- No social icons, partner logos or "Advertise with us".
- `brand` is a name and is not translated; `tagline`, `navLabel`, link labels
  and `copy` are product copy marked by the application; the hidden suffix is
  the library string `st.link.external`. Longer translations wrap.

## Performance

- Change detection: `OnPush`, signal inputs; links render with `@for` tracked by
  `link`; whether a link is external is read from the data, not computed per
  render in the template.
- Performance scenario: the `components-harness` route `footer/performance`
  renders the public footer with the cast's five links, the tagline, the copy
  line and a stand-in for the compact signup; it must load with no layout shift
  from the footer, within the L2-071 CLS budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the footer sits at the end of the page and adds no content
  after first render; the signup's state changes keep its own height (the
  application's).
- Weight: imports `@angular/core`, `@angular/router` (`RouterLink`,
  `RouterLinkActive`) and `@angular/localize`.

## Acceptance criteria

### Rendering

- **AC-1** Given the public footer on the home page, when it renders, then there is one content-info landmark with class `site-footer` containing `.site-footer__brand` with "ShotThere" in a `strong` and the tagline in a `span`, a navigation landmark named "Footer" listing Studios, Spots, Guides, Editorial policy and YouTube channel in that order, and `p.site-footer__copy` reading "© 2026 ShotThere · No paid placement: order comes only from the sort you choose.". (L2-069)
- **AC-2** Given the footer's YouTube channel link with `external` true, when it renders, then it is `<a href="https://www.youtube.com/@ShotThere" target="_blank" rel="noopener">` whose accessible name is "YouTube channel (opens in a new tab)" and which never has `aria-current`. (L2-048)
- **AC-3** Given the footer on The Junction Loft's page, when the visitor activates "Editorial policy", then the editorial policy page opens in the same tab. (L2-046)
- **AC-4** Given the footer on `/studios?costMax=150&sort=cost` with Studios marked `exact`, when it renders, then "Studios" has `aria-current="page"` at `--font-weight-medium` in `--color-fg-default`, and on `/studios/the-junction-loft` no footer link has `aria-current`. (L2-069)
- **AC-5** Given `tagline` and `copy` both `null`, when the footer renders, then the brand holds only the `strong` name and there is no `.site-footer__copy` element. (L2-069)
- **AC-6** Given the application's signup projected into `signup`, when a keyboard user tabs into the footer, then focus moves to the email field, then "Subscribe", then Studios, Spots, Guides, Editorial policy and YouTube channel. (L2-067)

### Keyboard and focus

- **AC-7** Given focus on any footer link, when it is focused with the keyboard, then a 2 px `--color-focus-ring` outline with at least 3:1 contrast against the canvas is visible around it. (L2-067)

### Screen readers

- **AC-8** Given the home page and the spot list with the footer, when axe-core scans them in light and dark at 360 px and 1280 px, then no violation is reported and the page has exactly one content-info landmark. (L2-069)

### Theming

- **AC-9** Given the footer on the spot list in the light and the dark theme, when the contrast check runs, then the links, tagline and copy line are at least 4.5:1 and the name and current link at least 4.5:1 against `--color-bg-canvas`. (L2-068)

### Responsive

- **AC-10** Given the footer at 320 px, when it renders, then the brand, the signup, the links (one per line) and the copy line are stacked in that order and `document.documentElement.scrollWidth` equals 320. (L2-064)
- **AC-11** Given the footer at 320 px with the application's signup projected, when it renders, then the signup's element spans the full width of the footer's content box. (L2-039)
- **AC-12** Given the footer at 576 px, when it renders, then the five links are on one row, `--space-6` (24 px) apart. (L2-064)
- **AC-13** Given the footer at 1280 px, when it renders, then the brand and the signup share the first row and the links and the copy line sit below them. (L2-064)
- **AC-14** Given the footer at 360 px, when each link is measured, then it is at least 44 CSS px tall. (L2-065)
- **AC-15** Given the studio list in a 1280 px window at 200 % zoom, when the visitor scrolls to the footer, then every footer link and the copy line are visible and there is no horizontal page scroll. (L2-066)

### Content

- **AC-16** Given `externalHint` "(s'ouvre dans un nouvel onglet)", when the footer renders, then the YouTube link's accessible name is "YouTube channel (s'ouvre dans un nouvel onglet)", and without it the hidden text is the library string `st.link.external`; the footer renders no other text of its own. (L2-070)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the footer
animates nothing
([footer.html](../../design-system/components/footer.html), Accessibility › Motion).

### Performance

- **AC-17** Given the `footer/performance` harness route, when it is measured with Lighthouse on the mobile profile, then the cumulative layout shift is at most 0.1 and the footer contributes no shift after first render. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/site-footer/`:
  `site-footer.component.ts` (`SiteFooterComponent`, selector `st-site-footer`),
  `.html`, `.css` (port of `.site-footer*` from `components.css`, minus the
  `[data-state]` documentation selectors and minus `.site-footer .signup` and
  `.site-footer .signup .btn`, which are application CSS, D-1).
  `:host { display: block; }`.
- Internal links: `<a [routerLink]="l.link" routerLinkActive ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: !!l.exact }">`.
  External links: `<a [href]="l.link" target="_blank" rel="noopener">{{ l.label }}<span class="visually-hidden"> {{ externalHint() }}</span></a>`.
- The default hint is the shared `$localize\`:@@st.link.external:(opens in a new tab)\``.
- ICD change (ICD-002 1.1.0, additive): `SiteFooterComponent` gains
  `externalHint` (input, `string`, default §12 `st.link.external`), and §12 adds
  it to the override inputs of `st.link.external` (D-2).
- Mock drift the component and the application correct: `pages/studios/default`
  does not mark Studios current while the other studio list states do (D-4);
  the 43 footer Subscribe buttons carry an inline `align-self: flex-end`, which
  the application's `.signup__row .btn` rule replaces.

## Decisions

- **D-1** *How does the projected signup take `flex: 1 1 20rem` in the footer row, when `.signup*` is application CSS (ICD §11.2), emulated encapsulation keeps the footer's rules off projected nodes, and the application may not target `.site-footer` (ICD-DOM-5)?* The footer adds no wrapper: the projected element is a direct flex item, and the application gives its own signup host `flex: 1 1 20rem` from its feature CSS. The design system's `.site-footer .signup .btn` colour override exists only because unscoped footer link rules reached the button; encapsulation removes that need, so it is not ported.
- **D-2** *The footer must name its external link "(opens in a new tab)" but ICD-002 gives it no override for the library string, which ICD-I18N-3 requires.* `st-site-footer` gains `externalHint` (ICD-002 1.1.0, additive), defaulting to the existing `st.link.external`, the same suffix `a[st-link]` uses.
- **D-3** *Does the footer's external link show the `external` icon, as `a[st-link][external]` does?* No. The design system's footer and all 46 mocks write the YouTube link as plain text with the hidden suffix; the footer is a quiet list of links and draws its own `<a>` elements rather than composing `a[st-link]`.
- **D-4** *When is a footer link current?* When `RouterLinkActive` matches it, honouring `NavLink.exact`. The application marks every internal footer link `exact`, so Studios is current on every studio list state (`/studios` with any query) and on no review, as the mocks show for reviews; this also marks Guides on the guide index and Editorial policy on its page, which the mocks leave unmarked, because `aria-current="page"` there is accurate and the design system's rule is one current link per page.
- **D-5** *Which element is the landmark?* The `<footer>` the component renders; the host is `display: block` with no box styles. The shell places the host after `<main>`, outside any sectioning element, so the `<footer>` maps to content info.
- **D-6** *Is the brand a heading?* No. The design system writes it as `<strong>`; a heading would add an outline entry on every page. The signup's "New reviews by email" heading is the application's, at the level it chooses.
- **D-7** *Who builds "© 2026"?* The application, as part of `copy`. Components hold no date logic (ICD-API-10).
