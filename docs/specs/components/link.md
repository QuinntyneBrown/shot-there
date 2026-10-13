# Link

| Field | Value |
|---|---|
| Selector | `a[st-link]` |
| Library path | `frontend/projects/components/src/lib/link/` |
| Status | planned |
| Traces to | L2-018, L2-034, L2-048, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-086 |
| Design system | [`link.html`](../../design-system/components/link.html) |
| Source mocks | [`pages/editorial-policy/default`](../../mocks/pages/editorial-policy/default.html), [`pages/server-error/default`](../../mocks/pages/server-error/default.html), [`pages/guide/default`](../../mocks/pages/guide/default.html), [`pages/compare/default`](../../mocks/pages/compare/default.html), [`pages/compare/four`](../../mocks/pages/compare/four.html), [`pages/compare/over-limit`](../../mocks/pages/compare/over-limit.html), [`pages/compare/unknown-slug`](../../mocks/pages/compare/unknown-slug.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/playing`](../../mocks/pages/studio/playing.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/map-failed`](../../mocks/pages/spot/map-failed.html), [`pages/spot/no-rain-backup`](../../mocks/pages/spot/no-rain-backup.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`notifications/public-toast/success`](../../mocks/notifications/public-toast/success.html), [`dialogs/map-popup/default`](../../mocks/dialogs/map-popup/default.html) |
| Rendering | [`link.html`](link.html) |

## Purpose and scope

Links take people somewhere: to a full review, back to the studio picker, to the
episode on YouTube, to the park's permit rules. They are ink and underlined and
turn accent red on hover. `a[st-link]` is every link the application writes
itself: inline in a sentence, standalone on its own line as the way on from a
block, and external when it leaves ShotThere, where the component adds the new
tab, `rel="noopener"`, the arrow and the hidden "(opens in a new tab)".

Use [`a[st-button]`](button.md) when a link is the page's main call to action
("Book on the studio's site", "Browse studios"), and
[`button[st-button]`](button.md) with `variant="link"` when something looks like
a link but acts in place ("Clear all" after the active filters). Links inside a
location card, the comparison table header, the breadcrumb, the site header and
the site footer belong to those components ([`location-card`](location-card.md),
[`breadcrumb`](breadcrumb.md), [`site-header`](site-header.md),
[`footer`](footer.md)).

Out of scope:

- Paths and URLs: the application supplies `href` or `routerLink` from
  `APP_PATHS` or the data (ICD-API-11); the component builds none.
- Whether a link is current, and the rule not to link to the current page: the
  application renders plain text instead.
- `overflow-wrap: anywhere` on the container of a long email address or URL: the
  container's (the application's prose or the page layout).

## Usage

Every `.link--standalone` and `.link--external` in `docs/mocks/` (inventory from
`usage_inventory.py docs/mocks link--standalone "a|button"` and `… link--external
"a|button"`), plus every bare `<a>` the application writes outside another
component (grep of `<a href` in pages, dialogs and notifications), grouped by
configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/editorial-policy/default` | inline, `href="mailto:corrections@shotthere.ca"` | "corrections@shotthere.ca" in a sentence | default, hover, focus | canvas (prose) |
| `pages/server-error/default` | inline, `href="mailto:hello@shotthere.ca"` | "hello@shotthere.ca" in a sentence | default | canvas |
| `pages/guide/default` entries | `standalone`, `routerLink` to the studio | "Read the full review" + hidden " of Kensington Window Room" / "Leslieville Daylight Studio" / "Riverside Rooftop Studio" | default, hover, focus | surface (guide entry) |
| `pages/compare/default`, `four`, `over-limit`, `unknown-slug`; the same page behind `notifications/public-toast/success`, `danger` | `standalone`, `routerLink` `/studios?compare=…` | "Change studios" | default | canvas, beside "Copy link" |
| `pages/home/default` and its states, section heads | `standalone` (D-6), `routerLink` | "All studios", "All guides", "All spots" | default | canvas |
| `pages/studio/default`, `playing`, `in-compare`, `media-failed`; `pages/spot/default`, `map-failed`, `no-rain-backup` | `external`, `href` the episode on YouTube | "Watch on YouTube" (arrow added, D-2) | default, hover, focus | canvas (`.episode__links`) |
| `pages/spot/default`, `map-failed`, `no-rain-backup`, `no-video`, `stale-permit` permit line | `external`, inline in the verified sentence | "Evergreen: photography and filming", "City of Toronto: filming and photography in parks", "Distillery District: filming and photography" | default | canvas (`.price-block__verified`, small muted text) |
| `pages/studio/default` and its states, `pages/spot/default` and its states, inside `st-disclosure`'s default slot | inline, `routerLink` to the editorial policy | "Editorial policy" after the statement | default | sunken panel (`.disclosure`) |
| `pages/spot/map-failed` inside `st-map-unavailable`'s `actions` slot | `external` | "Open in Google Maps" | default | sunken panel |
| `dialogs/map-popup/default`, `spot` | rendered by `st-map-popup` from `link` and `linkText`; the DS asks for `standalone` there | "View the review" + hidden ": The Junction Loft" | default | raised surface |

Not this component: the site footer's "YouTube channel" (an external `NavLink`
rendered by `st-site-footer`, ICD-SEC-2), card name links, breadcrumb links, the
header navigation, and every `a.btn` (button CRD).

Every row is buildable with the API below: `standalone`, `external` and
`externalHint` are inputs; `href`, `routerLink`, `queryParams` and
`aria-describedby` are native attributes or directives the consumer writes on the
host; the label and hidden context are projected.

## Anatomy

1. **Link** — the host element itself, `<a>`, with `.link--standalone` and/or
   `.link--external`, or no class when inline. Ink (`--color-fg-link`) and
   underlined; the underline is always present.
2. **Label** — projected text, optionally followed by projected
   `<span class="visually-hidden">` context ("of Kensington Window Room"). It is
   the accessible name.
3. **External arrow (external only)** — an [`st-icon`](icon.md) `external`
   (`svg.icon`, `aria-hidden="true"`) the component renders right after the label,
   0.9em square, `--space-1` after the last word, on the text baseline.
4. **Hidden suffix (external only)** — `<span class="visually-hidden">` holding a
   space and `externalHint` (" (opens in a new tab)"), after the arrow.

Host: an attribute selector on the native `<a>` (`a[st-link]`), so the host **is**
the link and the component adds no wrapper; `href`, `routerLink`, browser "open
in new tab" and server rendering without JavaScript keep working (ICD-SSR-3).
The template is the default slot followed, when `external`, by the arrow and the
suffix, with no whitespace between the three (D-3).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `standalone` | `boolean` | `false` | no | Adds `.link--standalone`: label weight, `inline-flex`, at least 44 px tall. For a link on its own line as the way on from a block. |
| `external` | `boolean` | `false` | no | Adds `.link--external`, `target="_blank"`, `rel="noopener"`, the trailing `external` arrow and the hidden suffix. The consumer never writes `target` or `rel` itself (D-5). |
| `externalHint` | `string` | §12 `st.link.external` ("(opens in a new tab)") | no | Text of the hidden suffix; the component puts one space before it (D-4). Only rendered when `external`. |

`standalone` and `external` use `booleanAttribute` and combine freely.

Native attributes and directives stay on the host and belong to the consumer:
`href` (external URLs, `mailto:`), `routerLink` and `queryParams` (application
paths from `APP_PATHS`), `aria-describedby`, `hreflang`, `download`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Navigation is the browser's or the router's; the consumer may listen to the native `click` (ICD-API-3). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text, optionally `<span class="visually-hidden">` context after it | The link text, marked `i18n` by the consumer; with the hidden context it is the accessible name. No icons: the external arrow is the component's. |

Library string (ICD §12): `st.link.external`, default "(opens in a new tab)",
replaced through `externalHint`.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Inline | none (`<a>`) | A link inside a sentence: "corrections@shotthere.ca". Takes the sentence's type and line height. |
| Standalone | `.link--standalone` | A link on its own line as the way on from a block: "Read the full review", "Change studios", "All studios". |
| External | `.link--external` | Leaves ShotThere: "Watch on YouTube", a permit source, "Open in Google Maps". Inline or standalone. |
| Standalone external | `.link--standalone.link--external` | An external link on its own line; no Phase 1 mock needs it, the classes combine. |

| Size | Modifier | Type | Height |
|---|---|---|---|
| Inline | — | The surrounding text (`--text-body`, `--text-body-sm` in a verified line) | Line height; exempt from target size inside a sentence (WCAG 2.5.8) |
| Standalone | `.link--standalone` | `--text-label` at `--font-size-md` | At least `--target-comfortable` (44 px) |
| External arrow | `.link--external .icon` | 0.9em of the link's own size | — |

Width is the text's; links wrap with their text and never truncate.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--color-fg-link`, `--border-width-hairline` underline at 0.15em offset | Role link, name from the text |
| Hover | `:hover` | `--color-fg-link-hover`, underline `--border-width-thick` | — |
| Focus | `:focus-visible` | `--focus-ring-width` ring in `--color-focus-ring`, offset `--focus-ring-offset`, small radius so it hugs a wrapped link | Focus on the link |
| Active | `:active` | As hover; navigation follows at once | — |
| Visited | `:visited` | Not styled (D-7) | — |
| Disabled | — | Does not exist: a link that cannot go anywhere is plain text, rendered by the application | — |
| External | `external` | Trailing arrow; hover and focus as above | Name ends "(opens in a new tab)" |
| On a surface | inside a card, popup or sunken panel | Same tokens; contrast held on each surface | — |
| Inherited colour | inside an alert, a toast or the footer | Takes the container's colour and keeps the underline | — |

## Markup

```html
<!-- rendered: inline -->
<p>If a price, a measurement or an address is wrong, tell us at <a href="mailto:corrections@shotthere.ca">corrections@shotthere.ca</a> and we'll check it and fix it.</p>
```

```html
<!-- rendered: standalone, with hidden context -->
<a class="link--standalone" href="/studios/kensington-window-room">Read the full review<span class="visually-hidden"> of Kensington Window Room</span></a>
<a class="link--standalone" href="/studios?compare=the-junction-loft,leslieville-daylight-studio">Change studios</a>
```

```html
<!-- rendered: external (no whitespace between label, arrow and suffix) -->
<a class="link--external" href="https://www.youtube.com/watch?v=Jx7Lq2pT9aE" target="_blank" rel="noopener">Watch on YouTube<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg><span class="visually-hidden"> (opens in a new tab)</span></a>
```

```html
<!-- rendered: external, inline in the permit line -->
<p class="price-block__verified">Permit rules verified <time datetime="2026-09-01">1 September 2026</time> · Source: <a class="link--external" href="https://www.evergreen.ca/" target="_blank" rel="noopener">Evergreen: photography and filming<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg><span class="visually-hidden"> (opens in a new tab)</span></a></p>
```

The `svg` sits inside the `st-icon` element the component renders; that element
and Angular's `_ngcontent-*` attributes are not part of the contract (ICD-DOM-3).

```html
<!-- consumer: guide entry -->
<a st-link standalone [routerLink]="entry.reviewPath">
  <ng-container i18n>Read the full review</ng-container><span class="visually-hidden" i18n> of {{ entry.name }}</span>
</a>

<!-- consumer: episode link -->
<a st-link external [href]="episode.watchUrl" i18n>Watch on YouTube</a>

<!-- consumer: inline -->
<p i18n>If a price, a measurement or an address is wrong, tell us at <a st-link href="mailto:corrections@shotthere.ca">corrections&#64;shotthere.ca</a> and we'll check it and fix it.</p>
```

## Design

- Inline: inherits the sentence's font and line height; `--color-fg-link`; underline `--border-width-hairline` at 0.15em offset, `--border-width-thick` on hover.
- Standalone: `inline-flex`, `align-items: center`, `gap` `--space-1`, `min-height` `--target-comfortable`, `--text-label` at `--font-size-md`.
- External arrow: `inline-block`, 0.9em square, `vertical-align: -0.1em`, `margin-inline-start` `--space-1`; it sits after the last word and wraps with it.
- Focus ring: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset`.
- Motion: none; colour and underline change instantly on hover.
- No elevation, no layer, no component tokens: links read `--color-fg-link` and `--color-fg-link-hover` directly.

The base `a` rule (colour, underline, hover) is a foundation in
`styles/foundations.css` (ICD §11.1); the component's CSS ports only
`.link--standalone` and `.link--external .icon`.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Link | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |
| Link, hover | `--color-fg-link-hover` | `--palette-pepper-600` | `--palette-pepper-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Link on the page |
| `--color-fg-link` | `--color-bg-surface` | 4.5:1 | Link on a card or guide entry |
| `--color-fg-link` | `--color-bg-surface-raised` | 4.5:1 | Link in the map popup |
| `--color-fg-link` | `--color-bg-surface-sunken` | 4.5:1 | "Editorial policy" in the disclosure and "Open in Google Maps" on the failed map |
| `--color-fg-link-hover` | `--color-bg-canvas` | 4.5:1 | Hovered link on the page |
| `--color-fg-link-hover` | `--color-bg-surface` | 4.5:1 | Hovered link on a card |
| `--color-fg-link-hover` | `--color-bg-surface-sunken` | 4.5:1 | Hovered link on a sunken panel |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |
| `--color-focus-ring` | `--color-bg-surface-sunken` | 3:1 | Focus ring on a sunken panel |

Links are told from body text by the underline, not by colour alone (WCAG 1.4.1):
`--color-fg-link` equals `--color-fg-default` in both themes. Forced colours: the
system's `LinkText` replaces the tokens and the underline stays.

## Responsive behaviour

- Inline links wrap with their sentence. An external link's arrow stays on the
  line of the last word, because label, arrow and suffix have no whitespace
  between them (D-3).
- Standalone links keep their 44 px box at every width and wrap their label onto
  a second line when the column is narrower than the label.
- Nothing changes by breakpoint in the component itself; the rendering still
  shows 320, 360 and 768 px frames because wrapping is where the arrow rule shows.
- At 320 px no link causes horizontal scroll (a long email address relies on its
  container's `overflow-wrap: anywhere`); at 200 % zoom every link stays reachable.
- Standalone links are at least 44 px tall (L2-065.3); inline links are exempt
  from target size inside a sentence, with at least one word between two of them.

## Accessibility

### Role and pattern

Native `<a href>` following the [APG Link pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/).
Never a `<span>` with a click handler and never `role="link"` on a button.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the link in DOM order. |
| <kbd>Enter</kbd> | Follows the link; an external link opens a new tab. |

### Focus

The shared ring on `:focus-visible`, with a small radius so it hugs a wrapped
inline link. The component never moves focus.

### Labelling

- The text is the name and makes sense out of context: repeated links carry
  their target in hidden text ("Read the full review of Kensington Window Room").
- External links end their name with the hidden " (opens in a new tab)", because
  the arrow is `aria-hidden="true"`.
- A label never reads "Click here", "More" or a bare URL.

### Announcements

None.

### Motion

None: colour and underline change instantly, so `prefers-reduced-motion` changes
nothing.

## Content and internationalisation

- Say where it goes, in sentence case: "Read the full review", "Change studios",
  "Watch on YouTube", "Open in Google Maps", "All studios".
- Name an external source by its owner and topic: "Evergreen: photography and
  filming", "City of Toronto: filming and photography in parks", "Distillery
  District: filming and photography".
- Show an email address in full as its own text: "corrections@shotthere.ca".
- Translatable content: the default slot (label and hidden context) and
  `externalHint`; the default suffix is the library string `@@st.link.external`.
  Data inside labels: studio, spot and source names.
- Longer translations wrap; the arrow wraps with the last word, and a standalone
  link grows in height rather than truncating.

## Performance

- Change detection: `OnPush`, signal inputs; host classes, `target` and `rel`
  come from one `computed` each.
- The component adds no listeners and imports no router code: `routerLink` is the
  consumer's directive on the host.
- Performance scenario: the `components-harness` route `link/performance` renders
  the guide "Best studios under $120 for 2 hours" with its three standalone "Read
  the full review" links and Evergreen Brick Works' four external links ("Watch on
  YouTube", the permit source, "Open in Google Maps", the editorial email inline);
  it must render and hydrate within the L2-071 budgets with no layout shift.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the arrow is part of the server HTML with a fixed 0.9em box,
  so nothing moves when the page hydrates.
- Weight: imports `@angular/core`, `@angular/localize` and the library's
  `IconComponent` only.

## Acceptance criteria

### Rendering

- **AC-1** Given `<a st-link href="mailto:corrections@shotthere.ca">` inside the editorial policy's sentence, when it renders, then it is a native `a` with no class, no `target`, no `rel`, `--color-fg-link` text with a hairline underline, and the accessible name "corrections@shotthere.ca". (L2-069)
- **AC-2** Given a guide entry's `<a st-link standalone>` with "Read the full review" and the hidden " of Kensington Window Room", when the guide "Best studios under $120 for 2 hours" renders, then the link has the class `link--standalone`, points to Kensington Window Room's page, and its accessible name is "Read the full review of Kensington Window Room". (L2-034)
- **AC-3** Given `<a st-link external href="https://www.youtube.com/watch?v=Jx7Lq2pT9aE">Watch on YouTube</a>` in The Junction Loft's video section, when it renders, then it has the class `link--external`, `target="_blank"`, `rel="noopener"`, an `svg.icon` with `aria-hidden="true"` directly after the text, and the accessible name "Watch on YouTube (opens in a new tab)". (L2-048)
- **AC-4** Given Evergreen Brick Works' permit line with the external source "Evergreen: photography and filming", when the visitor activates it, then evergreen.ca opens in a new tab and the opener is not exposed to it (`rel="noopener"`). (L2-018)
- **AC-5** Given the spot page for Evergreen Brick Works with the map tile service unreachable, when the map area shows "The map didn't load", then its "Open in Google Maps" link is an external `a[st-link]` to `https://www.google.com/maps/search/?api=1&query=43.6846,-79.3653` that opens in a new tab. (L2-086)
- **AC-6** Given an external link with `externalHint` set to "(s'ouvre dans un nouvel onglet)", when it renders, then the hidden suffix reads " (s'ouvre dans un nouvel onglet)"; and given no `externalHint`, the suffix is the `@@st.link.external` translation "(opens in a new tab)". (L2-070)

### States

- **AC-7** Given "Change studios" on the comparison page, when the pointer rests on it, then its colour becomes `--color-fg-link-hover` and its underline `--border-width-thick`, with at least 4.5:1 against the page. (L2-068)

### Keyboard and focus

- **AC-8** Given the guide page, when a keyboard user tabs to "Read the full review of Leslieville Daylight Studio" and presses Enter, then a `--focus-ring-width` (2 px) ring in `--color-focus-ring` with at least 3:1 is visible while it has focus, and Enter opens Leslieville Daylight Studio's page. (L2-067)

### Screen readers

- **AC-9** Given the editorial policy, the guide and Evergreen Brick Works' page in light and dark, when axe-core scans them, then no link has an empty name and no `link-in-text-block` violation is reported, because every inline link keeps its underline. (L2-069)

### Theming

- **AC-10** Given inline, standalone and external links on the page, on a guide entry, in the map popup and on the sunken disclosure panel, when the contrast check runs in the light and the dark theme, then every link and hovered link is at least 4.5:1 against its surface and every focus ring at least 3:1. (L2-068)

### Responsive

- **AC-11** Given "Change studios" and the three "Read the full review" links at 360 px wide, when each is measured, then it is at least 44 CSS px tall. (L2-065)
- **AC-12** Given Evergreen Brick Works' permit line at 320 px wide, when "Evergreen: photography and filming" wraps, then the arrow sits on the same line as "filming", no line holds the arrow alone, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-13** Given The Junction Loft's page at 200 % zoom in a 1280 px viewport, when the visitor reaches "Watch on YouTube", then the link and its arrow are fully visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): links have no
transition, so reduced motion changes nothing
([link.html](../../design-system/components/link.html), Accessibility › Motion).

### Performance

- **AC-14** Given the `link/performance` harness route, when it is measured with Lighthouse on the mobile profile, then cumulative layout shift is at most 0.1 and no link or arrow moves between the server render and hydration. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/link/`: `link.component.ts`
  (`LinkComponent`, selector `a[st-link]`), `link.component.html`
  (`<ng-content />@if (external()) {<st-icon name="external" /><span class="visually-hidden"> {{ externalHint() }}</span>}`
  written on one line, so no whitespace text node separates label, arrow and suffix),
  `link.component.css` (port of `.link--standalone` and `.link--external .icon`).
- Host bindings: `class` (`link--standalone`, `link--external` as set),
  `[attr.target]` `'_blank'` and `[attr.rel]` `'noopener'` when `external`, else
  `null`.
- `externalHint` defaults to the `$localize` string with the custom ID
  `@@st.link.external` and the text "(opens in a new tab)" (ICD-I18N-3).
- The arrow's 0.9em inline box must render exactly as `.link--external .icon`;
  with emulated encapsulation the rule reaches the `svg` through the `st-icon`
  element in this component's template.
- Composes [`st-icon`](icon.md) (`external`).
- Mock drift the component corrects: seven review mocks show "Watch on YouTube"
  without the arrow (D-2); the comparison page drawn behind the public toasts and
  the home page's section heads use bare `<a>` where `standalone` applies (D-6).

## Decisions

- **D-1** *Do inline links use `a[st-link]` or a plain `<a>`?* `a[st-link]` with no inputs, which adds no class and renders exactly the foundations' `<a>`. One component for every application-written link means one component object in the tests and external behaviour that is never hand-written.
- **D-2** *Seven review mocks drop the arrow on "Watch on YouTube".* Every external link shows the arrow (DS link, Do and don't and Sources): the component renders it whenever `external` is set, so it cannot be left out.
- **D-3** *Where does the arrow wrap?* With the last word. The component renders label, arrow and hidden suffix with no whitespace between them, and the arrow is an inline box (DS link, Responsive).
- **D-4** *The library string is "(opens in a new tab)" but the name must read "Watch on YouTube (opens in a new tab)".* The component writes one space before `externalHint` inside the hidden span, so translators never manage leading whitespace.
- **D-5** *May the consumer write `target` or `rel` on an external link?* No. `external` owns both (`target="_blank"`, `rel="noopener"`, ICD-SEC-2, L2-018.2); a non-external link never opens a new tab.
- **D-6** *The home page's "All studios", "All guides" and "All spots" and the toast mocks' "Change studios" are bare `<a>` on their own.* They are `standalone`: each stands alone as the way on from a block, which is the DS definition, and the 44 px box keeps them clear of the 24 px minimum without relying on the in-sentence exemption.
- **D-7** *Visited, active and disabled looks?* None, as the DS decides: a returning visitor reopens the same reviews, and a link that goes nowhere is plain text.
