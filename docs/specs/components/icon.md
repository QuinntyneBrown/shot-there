# Icon

| Field | Value |
|---|---|
| Selector | `st-icon` |
| Library path | `frontend/projects/components/src/lib/icon/` |
| Status | planned |
| Traces to | L2-067, L2-068, L2-069, L2-071, L2-074 |
| Design system | [`foundations/iconography.html`](../../design-system/foundations/iconography.html) |
| Source mocks | [`pages/studios/error`](../../mocks/pages/studios/error.html), [`pages/studios/empty`](../../mocks/pages/studios/empty.html), [`pages/studios/no-results`](../../mocks/pages/studios/no-results.html), [`pages/spots/empty`](../../mocks/pages/spots/empty.html), [`pages/guides/empty`](../../mocks/pages/guides/empty.html), [`pages/compare/empty`](../../mocks/pages/compare/empty.html), [`pages/compare/default`](../../mocks/pages/compare/default.html), [`pages/compare/unknown-slug`](../../mocks/pages/compare/unknown-slug.html), [`pages/map/empty`](../../mocks/pages/map/empty.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-dashboard/up-to-date`](../../mocks/pages/admin-dashboard/up-to-date.html), [`pages/admin-studios/empty`](../../mocks/pages/admin-studios/empty.html), [`pages/admin-studios/no-results`](../../mocks/pages/admin-studios/no-results.html), [`pages/studio-editor/upload-failed`](../../mocks/pages/studio-editor/upload-failed.html), [`dialogs/lightbox/default`](../../mocks/dialogs/lightbox/default.html), [`dialogs/studio-filters/default`](../../mocks/dialogs/studio-filters/default.html), [`dialogs/site-menu/default`](../../mocks/dialogs/site-menu/default.html), [`notifications/admin-toast/danger`](../../mocks/notifications/admin-toast/danger.html), [`notifications/public-toast/success`](../../mocks/notifications/public-toast/success.html), [`notifications/public-toast/warning`](../../mocks/notifications/public-toast/warning.html) |
| Rendering | [`icon.html`](icon.html) |

## Purpose and scope

The icon is a small plain outline that supports a word: the cross on "Close",
the sliders on "Filters", the arrow after "Book on the studio's site", the
circle on "We couldn't load the studios". ShotThere uses few icons, all drawn
on one 24-unit grid with a 2-unit round stroke in the colour of the text beside
them. `st-icon` renders one of them as inline SVG, so there is no icon font and
no sprite to load. Icons are always decorative: the words beside them, or the
parent control's accessible name, carry the meaning.

The icon is documented on the iconography foundation page, not on a component
page. Use [`st-icon-button`](icon-button.md) or
[`button[st-button]`](button.md) with `iconOnly` when a glyph is the only
visible label of a control; that control takes the name, never the icon. Use
[`st-light-rating`](score.md) and [`st-score-list`](score.md) for light levels
and scores, which are pips beside words and not icons, and the map marker
classes for markers.

Out of scope:

- The accessible name of a control that holds an icon: the control's
  (`aria-label` on an icon-only button, the visible label otherwise).
- Choosing which icon a screen shows and whether a button has one: the
  application and the composing component, following the iconography page's
  usage rules.
- Status colour: the parent sets `color` (the alert's `--alert-icon`, the
  empty state's tinted circle) and the icon inherits it.
- Spinners ([`st-spinner`](spinner.md)) and pips: not icons.

## Usage

Every `svg.icon` in `docs/mocks/` (143 mocks, 32 distinct drawings for 23
glyphs; inventory by script over every inline `<svg class="icon">`), grouped by
glyph. The variant drawings the mocks also use are replaced by the sheet's
drawing (D-3).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Every page header below 48rem, `dialogs/site-menu/*` | `menu`, md, inside the "Menu" button | — | default | canvas |
| Every dialog, sheet, lightbox and map popup; every toast | `close`, md in dialogs (`btn--icon`, `icon-btn`); sm on the toast "Dismiss" and the filter chip remove | — | default | dialog surface, toast (inverse) |
| `dialogs/studio-filters/*`, `dialogs/spot-filters/*`, `pages/studios/*`, `pages/spots/*` | `filters`, md, leading in "Filters" | — | default | canvas |
| Admin list searches, `dialogs/guide-entry-picker/*`; `pages/*/no-results` | `search`, md in the search field; xl in the "No studios match “parkdale”" circle | — | default | surface; empty circle |
| `dialogs/lightbox/*` | `chevron-left`, `chevron-right`, md, in "Previous photo" / "Next photo" | — | default | canvas |
| Admin dashboard and lists, editors | `plus`, md, leading in "New studio", "Add fee", "Add entry" | — | default | canvas, surface |
| `pages/compare/*` | `copy`, md, leading in "Copy link" | — | default | canvas |
| `pages/studio/*`, `pages/spot/*`, footers | `external`, 0.9em, trailing in "Book on the studio's site", "Watch on YouTube", "Open in Google Maps" | — | default | canvas, surface |
| `pages/studio/*`, `pages/spot/*` | `play`, md, filled, in "Play episode" | — | default | poster pill |
| `pages/studios/error`, `spots/error`, `map/error`, admin errors | `refresh`, md, leading in "Try again" | — | default | canvas, map card |
| Toasts, `pages/admin-dashboard/up-to-date`, `pages/home/success` | `success`, md; xl in the empty-state circle | — | default | toast, `--color-success-bg` circle |
| Info alerts, the disclosure, `pages/compare/unknown-slug`, `pages/sign-in/session-expired` | `info`, md | — | default | `--color-info-bg`, sunken panel |
| `pages/studio/stale`, `pages/spot/stale-permit`, `pages/sign-in/rate-limited`, warning toasts | `warning`, md | — | default | `--color-warning-bg`, toast |
| Danger toasts and alerts, failed dialogs, every load error | `danger`, md; xl in the error empty-state circle | — | default | toast, `--color-danger-bg` |
| `pages/studios/empty`, `pages/home/empty`, `pages/admin-dashboard/empty` | `camera`, xl | — | default | empty circle |
| `pages/admin-studios/empty`, `admin-spots/empty`, `admin-guides/empty` | `list`, xl | — | default | empty circle |
| `pages/spots/empty` | `tree`, xl | — | default | empty circle |
| `pages/compare/empty` | `compare`, xl | — | default | empty circle |
| `pages/guides/empty` | `guide`, xl | — | default | empty circle |
| `pages/map/empty`, `pages/map/tiles-failed`, `pages/spot/map-failed` | `map-pin`, xl in the empty circle; md in the unavailable map | — | default | empty circle, sunken map |
| `pages/studio/media-failed`, `dialogs/lightbox/image-failed` | `image-failed`, md, inside `.media-fallback` ([`st-responsive-image`](responsive-image.md)) | — | default | `--color-bg-photo` |
| `pages/studio-editor/upload-failed` | `image`, md, in a failed upload row's thumbnail | — | default | `--color-bg-photo` |

Every row is buildable with `name` and `size`. The 0.9em external arrow and the
1.25em button icon are context sizes (*Design*), not `size` values. Fourteen
`IconName` members have no use in the mocks or the design system; they are
specified under *Variants and sizes* so the type stays complete (D-2).

## Anatomy

1. **Host** — `st-icon`, `display: contents`: it adds no box, so the SVG is
   the laid-out element inside its parent's flex or grid row.
2. **Drawing** — `svg.icon`, `aria-hidden="true"`, `viewBox="0 0 24 24"`.
   Width and height from the size; `fill: none`, `stroke: currentColor`,
   `stroke-width: var(--icon-stroke)`, round caps and joins, `flex: none`.
3. **Paths** — the shapes from the drawing table, copied exactly: `path`,
   `circle` and `rect` elements with geometry attributes only. No `style`,
   `stroke`, `class`, `width`, `height` or `<title>`; the one exception is the
   `play` triangle, which carries `fill="currentColor" stroke="none"`.

The host is `st-icon`; the component renders the `svg.icon` inside it, and the
host has no box of its own (ICD-DOM-1).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `name` | `IconName` | — | yes | Selects the drawing from the table under *Variants and sizes*. A change of `name` swaps the paths in place. |
| `size` | `IconSize` (`'sm' \| 'md' \| 'lg' \| 'xl'`) | `'md'` | no | `sm` → `.icon--sm` (16 px), `lg` → `.icon--lg` (24 px), `xl` → `.icon--xl` (28 px); `md` adds no modifier (20 px). |

Both are signal inputs. `IconName` gains seven members (ICD-002 1.1.0,
additive, D-1): `'copy' | 'image' | 'image-failed' | 'tree' | 'compare' |
'guide' | 'list'`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The icon is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | The drawing comes from `name`. |

The icon has no library strings (ICD §12) and renders no text.

## Variants and sizes

The drawing table is the icon sheet. Every name renders
`<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">` plus these
children, exactly:

| Name | Children | Source | Means |
|---|---|---|---|
| `search` | `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>` | DS sheet | Search fields; "No studios match “parkdale”" |
| `menu` | `<path d="M4 7h16M4 12h16M4 17h16"/>` | DS sheet | "Menu" in the header below 48rem |
| `close` | `<path d="M6 6l12 12M18 6 6 18"/>` | DS sheet | Close a dialog, sheet, lightbox or popup; Dismiss a toast; remove a filter chip |
| `chevron-left` | `<path d="m15 6-6 6 6 6"/>` | DS sheet | "Previous photo" |
| `chevron-right` | `<path d="m9 6 6 6-6 6"/>` | DS sheet | "Next photo" |
| `chevron-down` | `<path d="m6 9 6 6 6-6"/>` | drawn here (D-2) | Opens downward |
| `filters` | `<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>` | DS sheet | "Filters" |
| `map-pin` | `<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>` | DS sheet | "No locations on the map yet"; "The map didn't load" |
| `check` | `<path d="m5 12 5 5 9-10"/>` | drawn here (D-2) | Done, without a status circle |
| `mail` | `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>` | drawn here (D-2) | Email |
| `lock` | `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>` | drawn here (D-2) | Owner only |
| `sign-out` | `<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>` | drawn here (D-2) | "Sign out" |
| `home` | `<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/>` | drawn here (D-2) | The home page |
| `plus` | `<path d="M12 5v14M5 12h14"/>` | DS sheet | "New studio", "Add fee", "Add entry" |
| `edit` | `<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>` | drawn here (D-2) | Edit |
| `trash` | `<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>` | drawn here (D-2) | Delete |
| `arrow-up` | `<path d="M12 19V5m-6 6 6-6 6 6"/>` | DS iconography *Usage* | Up |
| `arrow-down` | `<path d="M12 5v14m-6-6 6 6 6-6"/>` | DS iconography *Usage* | Down |
| `camera` | `<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>` | DS sheet | "No studio reviews yet", "Nothing published yet" |
| `upload` | `<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>` | DS `foundations/shape.html` | Upload |
| `eye` | `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>` | drawn here (D-2) | Show |
| `clock` | `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>` | drawn here (D-2) | Time |
| `refresh` | `<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>` | DS sheet | "Try again" |
| `offline` | `<path d="M3 3l18 18"/><path d="M5 12.5a10 10 0 0 1 4.5-2.7M14.5 9.8A10 10 0 0 1 19 12.5M8.5 16a5 5 0 0 1 7 0M12 20h.01"/>` | drawn here (D-2) | No connection |
| `info` | `<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>` | DS sheet | Info alerts and toasts, the disclosure |
| `success` | `<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>` | DS sheet | Success toasts, "Everything is up to date" |
| `warning` | `<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>` | DS sheet | "Prices may be out of date", rate limits |
| `danger` | `<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/>` | DS sheet | Failed actions and loads |
| `external` | `<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>` | DS sheet | A link that leaves ShotThere |
| `play` | `<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>` | DS sheet | "Play episode" |
| `copy` | `<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>` | DS sheet (ICD 1.1.0) | "Copy link" |
| `image` | `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/>` | DS sheet (ICD 1.1.0) | A file row whose upload failed |
| `image-failed` | `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/>` | DS sheet (ICD 1.1.0) | A photo or poster that did not load |
| `tree` | `<path d="M12 3 6 12h4l-4 6h12l-4-6h4z"/><path d="M12 18v3"/>` | DS sheet (ICD 1.1.0) | "No outdoor spots yet" |
| `compare` | `<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>` | DS sheet (ICD 1.1.0) | "Pick at least two studios to compare" |
| `guide` | `<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>` | DS sheet (ICD 1.1.0) | "No guides yet" |
| `list` | `<path d="M9 6h11M9 12h11M9 18h11M4 6h.5M4 12h.5M4 18h.5"/>` | DS sheet (ICD 1.1.0) | "No studios yet", "No spots yet", "No guides yet" |

One glyph means one thing everywhere (WCAG 3.2.4). The table is the only
place drawings live; a new glyph is added to the iconography page first, then
here, then to `IconName`.

| Size | Modifier | Width and height | Where |
|---|---|---|---|
| sm | `.icon--sm` | `--icon-size-sm` (16 px) | Toast "Dismiss", filter chip remove |
| md (default) | — | `--icon-size-md` (20 px) | Buttons, icon buttons, alerts, toasts, the disclosure, image fallbacks |
| lg | `.icon--lg` | `--icon-size-lg` (24 px) | Reserved; no ShotThere screen uses it |
| xl | `.icon--xl` | `--icon-size-xl` (28 px) | The empty-state circle |

`--icon-size-xs` (inside a tag) and `--icon-size-2xl` have no `IconSize`
member; tags carry words only and image fallbacks use md, as the iconography
page says.

## States

The icon has no interactive or data states; it is never focusable and never
receives events. It takes on the state of its parent through `currentColor`:

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Stroke in the parent's text colour | Hidden (`aria-hidden="true"`) |
| In a disabled control | parent `disabled` / `aria-disabled` | Inherits the control's 50 % opacity and colour | Hidden |
| In a pressed or current control | parent `aria-pressed="true"` / `aria-current` | Inherits `--color-fg-accent` from the control | Hidden |
| Status tone | parent alert, toast or empty circle | Inherits `--alert-icon`, the toast text colour or the circle's icon token | Hidden; the title says the tone in words |
| Forced colours | `forced-colors: active` | `currentColor` becomes the system text colour | Hidden |

## Markup

```html
<!-- rendered: default size -->
<st-icon><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg></st-icon>
```

```html
<!-- rendered: sizes -->
<svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>
<svg class="icon icon--xl" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
```

```html
<!-- rendered: the one filled glyph -->
<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/></svg>
```

The `st-icon` host element is not part of the contract (ICD-DOM-3); page
objects never select it or the SVG, because an icon has no role or name.

```html
<!-- consumer: leading icon in a button -->
<button st-button type="button" (click)="retry()"><st-icon name="refresh" /><ng-container i18n>Try again</ng-container></button>

<!-- consumer: trailing external arrow -->
<a st-button variant="primary" [href]="bookingUrl()" target="_blank" rel="noopener">
  <ng-container i18n>Book on the studio's site</ng-container><st-icon name="external" />
  <span class="visually-hidden" i18n> (opens in a new tab)</span>
</a>

<!-- library composition: the empty-state circle -->
<div class="empty__icon" aria-hidden="true"><st-icon [name]="icon()!" size="xl" /></div>
```

## Design

- Grid: `viewBox="0 0 24 24"` with about 2 units of padding; shapes on whole or half units.
- Stroke: `--icon-stroke` (2 units), round caps and joins, `fill: none`, `stroke: currentColor`; it scales with the icon (2 px at 24 px, 1.67 px at 20 px).
- Size: `--icon-size-md` by default; `--icon-size-sm`, `--icon-size-lg`, `--icon-size-xl` through the modifiers; `flex: none` so a flex row never squashes it.
- Colour: none of its own. The parent's `color` reaches the stroke through `currentColor`.
- Motion: none.

**Context rules.** The design system sizes, colours or places an icon by the
block around it. Component styles are encapsulated (ICD-STY-3), so a parent's
stylesheet cannot reach the `svg` inside `st-icon`; the icon's own stylesheet
therefore carries every design-system rule whose selector ends in `.icon`,
written as `:host-context(<context>) .icon` with the same declarations
(D-4). Without `data-state` selectors (documentation only), they are:

| Context | Declarations |
|---|---|
| `.btn` | 1.25em square, `flex: none` |
| `.link--external` | 0.9em square, `display: inline-block`, `vertical-align: -0.1em`, `margin-inline-start: var(--space-1)` |
| `.search` | absolutely placed `--space-3` from the left, vertically centred, `--icon-size-md`, `--color-fg-subtle`, `pointer-events: none` |
| `.search-field` | absolutely placed `--space-4` from the left, centred on `--control-height-lg`, `--color-fg-subtle`, `pointer-events: none` |
| `.tag` | `--icon-size-xs` square |
| `.alert` | `--icon-size-md`, `flex: none`, `color: var(--alert-icon)`, 0.1rem top margin |
| `.toast` | `--icon-size-md`, `flex: none`, 0.1rem top margin, `color: currentColor` |
| `.empty__icon` | `--icon-size-xl` square |
| `.media-fallback` | `--color-fg-subtle` |
| `.disclosure` | `flex: none`, `--space-0-5` top margin, `--color-fg-muted` |
| `.signup__done` | `--color-success-icon`, `flex: none`, `--space-0-5` top margin |

A context rule wins over the `size` modifier, as it does in the design
system. When a block's CSS changes on its design-system page, its row here
changes in the same pull request.

## Colour

The icon has no colour tokens of its own. The colours it shows are its
parents':

| Part | Token | Light | Dark |
|---|---|---|---|
| Glyph beside body text | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Glyph in muted text, the disclosure | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Search field, image fallback | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Info icon | `--color-info-icon` | `--palette-stone-700` | `--palette-stone-350` |
| Success icon | `--color-success-icon` | `--palette-callaloo-500` | `--palette-callaloo-300` |
| Warning icon | `--color-warning-icon` | `--palette-mango-500` | `--palette-mango-300` |
| Danger icon | `--color-danger-icon` | `--palette-sorrel-500` | `--palette-sorrel-300` |
| Toast glyph (inverse surface) | `--color-fg-inverse` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-info-icon` | `--color-info-bg` | 3:1 | Info alert icon |
| `--color-success-icon` | `--color-success-bg` | 3:1 | Success alert icon and empty-state circle |
| `--color-warning-icon` | `--color-warning-bg` | 3:1 | Warning alert icon ("Prices may be out of date") |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | Danger alert icon and error empty-state circle |
| `--color-success-icon` | `--color-bg-canvas` | 3:1 | Signup success tick |
| `--color-fg-inverse` | `--color-bg-inverse` | 4.5:1 | Toast icon (it shares the text colour) |
| `--color-fg-subtle` | `--color-bg-photo` | 4.5:1 | Image-failed glyph on the photo ground |

Decorative icons beside text inherit the text colour, which already passes
4.5:1. Forced colours: the stroke is `currentColor`, so Windows High Contrast
draws icons in the surrounding system text colour; the filled `play` triangle
uses `currentColor` too.

## Responsive behaviour

The icon does not change by breakpoint. Its size is in `rem` (or `em` inside a
button or external link), so it scales with text at 200 % zoom. It never sets
a target size: a 20 px cross sits in a 44 px button. At 320 px it adds nothing
that could overflow, because it is never wider than 28 px.

## Accessibility

### Role and pattern

None. The SVG is presentation, hidden with `aria-hidden="true"`, with no
`role`, no `<title>`, no `aria-label` and no `focusable` attribute
(Chromium does not focus inline SVG). No APG pattern applies.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Never stops on an icon; focus goes to the control that holds it. |

### Focus

The icon never takes focus and never moves it.

### Labelling

- An icon adds nothing to any accessible name: "Try again", not "refresh Try
  again".
- Icon-only controls (Close, Dismiss, Previous photo, Next photo) take their
  name from their own `aria-label`; the SVG inside is still hidden.
- Status icons never stand alone: the alert title, toast title or empty-state
  title says the same thing in words (WCAG 1.4.1).
- An external arrow is always followed by visually hidden "(opens in a new
  tab)" from the link; the arrow only repeats it for sighted people.

### Announcements

None.

### Motion

None. Icons do not animate; the spinner is a separate component.

## Content and internationalisation

- Text first: an icon sits beside a visible label, or inside one of the four
  icon-only controls (Close, Dismiss, Previous photo, Next photo).
- One icon per button: leading for "Try again", "Copy link", "New studio",
  "Filters"; trailing only for the external arrow, which points where the link
  goes.
- No icons in headings, body copy, the specification lists or as bullets; never
  a score, light level, permit status or stale flag drawn as an icon alone.
- If no icon on the sheet matches, the label goes without an icon rather than
  borrowing a near miss.
- The icon renders no text and has nothing to translate. The chevrons, arrows
  and external arrow are not mirrored: ShotThere ships `en-CA` only
  (L2-070.1), and no right-to-left locale is planned.

## Performance

- Change detection: `OnPush`; `name` and `size` are signal inputs; the drawing
  is chosen by a `computed` over a constant map from name to the template
  branch, so no string parsing happens per render.
- The drawings are template markup (an `@switch` on the name), not
  `innerHTML`, so nothing is sanitised and nothing is fetched (ICD-SEC-1).
- Performance scenario: the `components-harness` route `icon/performance`
  renders the studio list's chrome icons (`menu`, `filters`, `close` on four
  filter chips) plus seven cards' worth of `external` and `plus` glyphs, 60
  icons in all; first render on the Lighthouse mobile profile stays within the
  L2-071 budgets.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the SVG has its final width and height from CSS before
  paint and inline paths, so nothing shifts.
- Weight: imports only `@angular/core`. All 37 drawings together are about
  4 KB of template before compression.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-icon name="refresh" />` inside the studio list's "Try again" button, when it renders, then the DOM holds exactly `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg>` with no `role`, no `<title>` and no `aria-label`. (L2-068)
- **AC-2** Given `<st-icon name="play" />` on The Junction Loft's episode poster, when it renders, then its only child is `<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>` and it is hidden from the accessibility tree. (L2-068)
- **AC-3** Given The Junction Loft's page fetched with JavaScript disabled, when the HTML is inspected, then the "Book on the studio's site" link contains the `external` drawing as inline `svg.icon`, and no request for an icon font or sprite is made. (L2-074)

### Screen readers

- **AC-4** Given a "Try again" button holding `st-icon name="refresh"` and the text "Try again", when the accessibility tree is read, then the button's name is exactly "Try again". (L2-069)
- **AC-5** Given the filters sheet's icon-only Close button with `aria-label="Close"` holding `st-icon name="close"`, when the accessibility tree is read, then the button is named "Close" and the SVG contributes no node. (L2-069)
- **AC-6** Given the studio list with icons in the header, the Filters button and four filter chips, when axe-core scans it in light and dark, then no violation concerns an SVG. (L2-069)

### Keyboard and focus

- **AC-7** Given the studio list's "Filters" button holding the `filters` icon, when a keyboard user tabs through the page, then focus lands on the button once and never on the SVG. (L2-067)

### Theming

- **AC-8** Given the "Prices may be out of date" warning alert on Ossington Blackbox's page and the "We couldn't load the studios" error circle, when the contrast check runs in light and dark, then the warning glyph is at least 3:1 against `--color-warning-bg` and the danger glyph at least 3:1 against `--color-danger-bg`. (L2-068)
- **AC-9** Given the "Link copied" success toast, when it renders in light and dark, then the `success` glyph's stroke is `--color-fg-inverse`, at least 4.5:1 against `--color-bg-inverse`. (L2-068)

### Motion

The design-system rule (no AC; L2 has no motion requirement): icons never
animate, so `prefers-reduced-motion` changes nothing
([iconography.html](../../design-system/foundations/iconography.html)).

### Sizes and drawings

The design-system rules (no AC; no L2 requirement governs a glyph's drawing or
size): each `name` renders exactly the children in the drawing table; `sm`,
`md`, `lg` and `xl` render 16, 20, 24 and 28 px; the context rules size the
icon at 1.25em in a button and 0.9em after an external link. Review checks them
against the `icon` harness route, which renders the whole sheet at every size.

### Performance

- **AC-10** Given the `icon/performance` harness route with 60 icons, when it loads on the Lighthouse mobile profile, then Largest Contentful Paint is at most 2.5 s and Cumulative Layout Shift is 0. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/icon/`: `icon.component.ts`
  (`IconComponent`, selector `st-icon`), `icon.component.html` (one `svg.icon`
  with `[class.icon--sm]`, `[class.icon--lg]`, `[class.icon--xl]` and an
  `@switch (name())` holding each drawing's children), `icon.component.css`
  (`:host { display: contents }`, the `.icon` and `.icon--*` rules, and the
  context rules under *Design*). Types `IconName` and `IconSize` in
  `src/lib/types/icon-name.ts` and `icon-size.ts`.
- Port `.icon` and `.icon--sm` from `components.css`; add `.icon--lg`
  (`--icon-size-lg`) and `.icon--xl` (`--icon-size-xl`), which the ICD names
  but `components.css` does not yet define.
- ICD change (ICD-002 1.1.0, additive): `IconName` gains `'copy'`, `'image'`,
  `'image-failed'`, `'tree'`, `'compare'`, `'guide'` and `'list'`. `IconName`
  is used only by inputs (`st-icon` `name`, `st-empty-state` `icon`), so a new
  member is additive (ICD §15).
- Mocks drift the component corrects: the nine variant drawings (warning B, C,
  D; info B, C; danger B; refresh B; map pin B; search B) render as the sheet's
  drawing; the empty-state icon is hidden on its wrapper, not only on the SVG.
- Composed by: [`button`](button.md), [`icon-button`](icon-button.md),
  [`link`](link.md) (external), [`alert`](alert.md), [`toast`](toast.md),
  [`empty-state`](empty-state.md), [`responsive-image`](responsive-image.md),
  `st-search-field`, [`chip`](chip.md),
  [`lightbox`](lightbox.md), [`video-poster`](video-poster.md),
  [`disclosure`](disclosure.md), [`map-unavailable`](map.md).

## Decisions

- **D-1** *The mocks and the icon sheet use seven glyphs that `IconName` lacks (`copy`, `image`, `image-failed`, `tree`, `compare`, `guide`, `list`).* `IconName` gains all seven (ICD-002 1.1.0, additive). "Copy link", the failed-image placeholder (L2-086.1), the failed upload row and five empty states need them; without them those screens would hand-write SVG, which ICD-DOM-4 forbids.
- **D-2** *Eleven `IconName` members (`chevron-down`, `check`, `mail`, `lock`, `sign-out`, `home`, `edit`, `trash`, `eye`, `clock`, `offline`) have no drawing in the design system or the mocks.* The CRD draws them by the iconography page's rules (24-unit grid, 2-unit round stroke, at most four strokes, `h.01` dots, no fills) and records the paths in the drawing table, because the ICD fixes the names and the component must render something for every member. `arrow-up` and `arrow-down` take the drawings already on the iconography page's *Usage* examples, and `upload` the one on `foundations/shape.html`. No ShotThere screen uses these fourteen today; the iconography page adds them to its sheet at the next extraction.
- **D-3** *The mocks draw nine glyphs two to four ways.* The component renders only the sheet's drawing for each name (the most used, with `h.01` dots), as the iconography page's *Variants found in the mocks* decides.
- **D-4** *How does a button's 1.25em, an external link's 0.9em or an alert's tone colour reach an SVG that encapsulation hides from the parent's stylesheet?* The icon's stylesheet carries every design-system rule ending in `.icon` as a `:host-context(<context>)` rule. One mechanical rule keeps every context exactly as the design system draws it, for projected icons (button, link) and composed ones (alert, toast, empty state) alike, without new inputs, global rules or `::ng-deep` (ICD-STY-3). It includes `.signup__done`, an application block, because the SVG is the library's and ICD-DOM-5 forbids the application from styling it.
- **D-5** *`IconSize` has no `xs` or `2xl`, which the iconography page lists.* None is added. `xs` exists only for an icon inside a tag, which no screen has, and is reached through the `.tag` context rule; `2xl` is reserved and unused.
- **D-6** *Does the host take part in layout?* No: `:host { display: contents }`, so the SVG is the flex or grid item and the design system's `flex: none` and gap rules apply to it directly, as in the mocks.
