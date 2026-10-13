# Icon button

| Field | Value |
|---|---|
| Selector | `button[st-icon-button]`, `a[st-icon-button]` |
| Library path | `frontend/projects/components/src/lib/icon-button/` |
| Status | planned |
| Traces to | L2-010, L2-028, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`icon-button.html`](../../design-system/components/icon-button.html) |
| Source mocks | [`dialogs/lightbox/default`](../../mocks/dialogs/lightbox/default.html), [`dialogs/lightbox/last`](../../mocks/dialogs/lightbox/last.html), [`dialogs/lightbox/sample-shot`](../../mocks/dialogs/lightbox/sample-shot.html), [`dialogs/lightbox/image-failed`](../../mocks/dialogs/lightbox/image-failed.html), [`dialogs/map-popup/default`](../../mocks/dialogs/map-popup/default.html), [`dialogs/map-popup/spot`](../../mocks/dialogs/map-popup/spot.html) |
| Rendering | [`icon-button.html`](icon-button.html) |

## Purpose and scope

The icon button is a 44 px round control that holds one outline glyph and no
visible text. ShotThere uses it only where a glyph is universally understood and
space is tight: over a photo and on a map. It closes the photo lightbox and the
map marker popup, and steps to the previous or next photo in the lightbox.

Use [`button[st-button]`](button.md) everywhere else, including the icon-only
"Close" in dialog and sheet headers (`.btn--ghost.btn--icon`, so it lines up with
the dialog's other buttons) and the site header's "Menu", which keeps its word.
The × on an active filter is the chip's own remove button
([`st-active-filters`](chip.md)); the dismiss × on a toast and an alert is the
`.close` button those components render ([`toast`](toast.md),
[`alert`](alert.md)); the play control on an episode poster belongs to
[`st-video-poster`](video-poster.md).

Out of scope:

- What the button does (close the overlay, step the gallery, wrap from the last
  photo to the first), focus trapping, Escape and focus return: the lightbox and
  `st-map-popup` own them (L2-010, L2-028).
- Where the button sits (the viewer bar, the stage, the popup's top-right corner)
  and when the arrows hide below 48rem: the containing component's CSS.
- The live "Photo 8 of 8" count: the lightbox's.

## Usage

Every `.icon-btn` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks icon-btn "a|button"`), grouped by configuration. All uses are inside library components; the application does not place an icon button on any screen in Phase 1.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/lightbox/default`, `last`, `sample-shot`, `image-failed` viewer bar | `button`, `outline`, `icon="close"`, `label` "Close" (§12 `st.lightbox.close`) | glyph only | default, hover, focus (autofocus on open), active | canvas (`.viewer`) |
| Same mocks, viewer stage | `button`, `outline`, `icon="chevron-left"` / `"chevron-right"`, `label` "Previous photo" / "Next photo" (§12 `st.lightbox.previous`, `st.lightbox.next`) | glyph only | default, hover, focus, active; never disabled (arrows wrap, L2-010.3); hidden below 48rem by the lightbox | canvas (`.viewer`), beside the photo |
| `dialogs/map-popup/default`, `spot` | `button`, ghost (no `outline`), `icon="close"`, `label` "Close" (`st-map-popup` `closeLabel`, §12 `st.dialog.close`) | glyph only | default, hover, focus | raised surface (`.popover.map-popup`), pinned top-right, last in DOM |

The mocks draw both Close controls as `<a href>` because a static mock can only
link back to the page; in the product they are `<button type="button">` (D-2).
ICD-002 lists toasts under *Used by*; the toast's dismiss is its own `.close`
button on the DS toast page and in every toast mock, so it is not this component
(D-4).

Every row is buildable with the API below: `icon`, `label`, `outline` and
`pressed` are inputs; `type`, `disabled`, `href`, `routerLink`, `autofocus`,
`aria-expanded`, `aria-controls`, `aria-haspopup` and `aria-current` are native
attributes the consumer writes on the host.

## Anatomy

1. **Container** — the host element itself, `button.icon-btn` or `a.icon-btn`. A
   44 px circle (`--target-comfortable`, `--radius-full`), transparent at rest.
   Its accessible name is its `aria-label`.
2. **Icon** — an [`st-icon`](icon.md) the component renders from `icon`:
   `svg.icon`, `aria-hidden="true"`, `viewBox="0 0 24 24"`, 20 px
   (`--icon-size-md`), `--icon-stroke`, `currentColor`.
3. **Ring (outline only)** — `.icon-btn--outline`: a 1 px `--color-border-default`
   edge, used inside the lightbox so the target reads against a large photo.
   Decorative: the 44 px hit area and the hover fill do the work (D-1).

Host: an attribute selector on the native element (`button[st-icon-button]`,
`a[st-icon-button]`), so the host **is** the `<button>` or `<a>` and the
component adds no wrapper. The class list and ARIA go on the host through host
bindings; the template is the single `st-icon`.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `icon` | `IconName` | — | yes | The glyph, rendered by `st-icon` at size `md`. ShotThere uses `close`, `chevron-left`, `chevron-right`. |
| `label` | `string` | — | yes | Rendered as the host's `aria-label`. Names the action, and the object when the button repeats in a list ("Remove test shot 2"). Product copy or a library string, translated by whoever supplies it. |
| `outline` | `boolean` | `false` | no | Adds `.icon-btn--outline`, the hairline ring (D-1). The lightbox sets it on Close, Previous and Next; the map popup does not. |
| `pressed` | `boolean \| undefined` | `undefined` | no | As `ButtonComponent`: when defined renders `aria-pressed="true\|false"`; `true` keeps the hover fill on and turns the glyph `--color-fg-accent`. When `undefined`, no `aria-pressed` is rendered. No Phase 1 use (D-5). |

`outline` uses `booleanAttribute`. `pressed` keeps `undefined` as "not a toggle",
so it does not use `booleanAttribute`.

Native attributes stay on the host and belong to the consumer: `type` (always
written on a `<button>`, `button` in every ShotThere use), `disabled`, `href`,
`routerLink`, `target`, `rel`, `autofocus`, `aria-expanded`, `aria-controls`,
`aria-haspopup`, `aria-current`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The consumer listens to the native `click` on the host (ICD-API-3). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | The component renders its own glyph from `icon` and takes no projected content; the name comes from `label`. |

The icon button has no library strings of its own (ICD §12). Its consumers pass
theirs: the lightbox `st.lightbox.close`, `st.lightbox.previous`,
`st.lightbox.next`; the map popup `closeLabel` (default `st.dialog.close`).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Ghost | `.icon-btn` | Close in the map marker popup. No border, no fill at rest. |
| Outline | `.icon-btn.icon-btn--outline` | Close, Previous photo and Next photo in the lightbox: the hairline ring reads against the photo and the viewer canvas. |
| Link | `a.icon-btn` | An icon that only navigates, with the consumer's `aria-current="page"` when it is the current page. No Phase 1 use; kept for the ICD selector (D-2). |
| Toggle | `.icon-btn[aria-pressed]` | A two-state icon control. No Phase 1 use (D-5). |

| Size | Modifier | Box | Glyph |
|---|---|---|---|
| One size | — | `--target-comfortable` (44 px) square, at every breakpoint | `--icon-size-md` (20 px), 12 px clear space round it |

There is no small icon button. It never shrinks with the viewport; a bar that
cannot fit its icon buttons wraps.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Transparent fill, glyph `--color-fg-default`; outline adds the `--color-border-default` ring | Role button (or link), name from `aria-label` |
| Hover | `:hover` | Fill `--color-bg-subtle` | — |
| Focus | `:focus-visible` | `--focus-ring-width` ring in `--color-focus-ring`, offset `--focus-ring-offset`, round the circle; none on mouse focus | Focus on the button |
| Active | `:active` | Fill `--color-bg-subtle-hover` | — |
| Disabled | native `disabled` (or consumer `aria-disabled="true"`) | 50 % opacity, `not-allowed` cursor, no hover fill | Native `disabled` leaves the tab order; announced unavailable |
| Pressed | `pressed` true → `aria-pressed="true"` | Hover fill kept, glyph `--color-fg-accent` | "toggle button, pressed" |
| Expanded | consumer `aria-expanded="true"` | Hover fill kept | "expanded" |
| Current | consumer `aria-current="page"` on `a[st-icon-button]` | Glyph `--color-fg-accent`; hover does not reset it | "current page" |
| On the viewer canvas | inside the lightbox (`outline`) | Ring on `--color-bg-canvas`; dark canvas in dark | — |
| On a raised surface | inside `st-map-popup` | Same tokens on `--color-bg-surface-raised` | — |

Busy is not an icon-button state: an action that waits on the server is a
[`button[st-button]`](button.md) with `busy`. No ShotThere icon button is ever
disabled: the lightbox arrows wrap (L2-010.3), and the delete dialog's busy Close
is the dialog's `.btn--icon`.

## Markup

```html
<!-- rendered: ghost Close in the map popup -->
<button class="icon-btn" type="button" aria-label="Close"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
```

```html
<!-- rendered: outline Close, Previous photo and Next photo in the lightbox -->
<button class="icon-btn icon-btn--outline" type="button" aria-label="Close" autofocus><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
<button class="icon-btn icon-btn--outline" type="button" aria-label="Previous photo"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg></button>
<button class="icon-btn icon-btn--outline" type="button" aria-label="Next photo"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button>
```

```html
<!-- rendered: toggle, pressed; link, current -->
<button class="icon-btn" type="button" aria-label="Show the list" aria-pressed="true"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg></button>
<a class="icon-btn" href="/" aria-label="Home" aria-current="page"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg></a>
```

The `svg` sits inside the `st-icon` element the component renders; the `st-icon`
element and Angular's `_ngcontent-*` attributes are not part of the contract
(ICD-DOM-3). Path data comes from `st-icon` and matches the DS icon sheet.

```html
<!-- consumer: inside the lightbox template -->
<button st-icon-button outline type="button" icon="close" [label]="closeLabel" autofocus (click)="close()"></button>
<button st-icon-button outline type="button" icon="chevron-left" [label]="previousLabel" (click)="previous()"></button>
<button st-icon-button outline type="button" icon="chevron-right" [label]="nextLabel" (click)="next()"></button>

<!-- consumer: inside st-map-popup, last in its DOM -->
<button st-icon-button type="button" icon="close" [label]="closeLabel()" (click)="closed.emit()"></button>
```

## Design

- Layout: `inline-grid`, glyph centred (`place-items: center`), `flex: none`, no padding, no border (outline adds one).
- Box `--target-comfortable` × `--target-comfortable`; shape `--radius-full`.
- Glyph `--icon-size-md` with `--icon-stroke`, `currentColor`.
- Outline ring `--border-width-hairline` in `--color-border-default` (D-1).
- Elevation: none.
- Focus ring: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset` (the shared `:focus-visible` rule).
- Motion: only the fill transitions, `background-color` over `--duration-fast` with `--ease-standard`.
- Layer: none of its own; it sits in the lightbox (`--z-modal`) or the popup (`--z-popover`).

The icon button declares no component tokens; it reads semantic tokens directly.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Glyph | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Hover fill; pressed and expanded fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Active fill | `--color-bg-subtle-hover` | `--palette-stone-200` | `--palette-stone-700` |
| Outline ring | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Pressed or current glyph | `--color-fg-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Lightbox canvas | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Map popup surface | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 3:1 | Glyph in the lightbox |
| `--color-fg-default` | `--color-bg-surface-raised` | 3:1 | Glyph in the map popup |
| `--color-fg-default` | `--color-bg-subtle` | 3:1 | Glyph on the hover fill |
| `--color-fg-default` | `--color-bg-subtle-hover` | 3:1 | Glyph on the active fill |
| `--color-fg-accent` | `--color-bg-subtle` | 3:1 | Pressed or current glyph on its fill |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring in the lightbox |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in the map popup |
| `--color-border-default` | `--color-bg-canvas` | 1:1 | Outline ring (decorative, exempt) |

The glyph is the only thing that identifies the control, so it is held to the
3:1 non-text minimum (WCAG 1.4.11); every pair above meets 4.5:1 in practice.

Forced colours: pressed, expanded and current icon buttons get a
`--border-width-thick` `Highlight` border, so the state survives the loss of
`--color-fg-accent` (DS icon-button D-6).

## Responsive behaviour

- One size at every breakpoint: 44 × 44 CSS px, which meets the 44 px phone target
  (L2-065.3) and the 24 px minimum everywhere.
- The component itself does not change by breakpoint, so the rendering shows no
  width frames for layout. Its containers do: below 48rem the lightbox hides the
  stage arrows (`.lightbox .viewer__stage > .icon-btn`) and shows text "Previous"
  and "Next" buttons; Close stays. The map popup docks to the bottom of the map
  and keeps Close in its top-right corner.
- At 320 px the viewer bar and the docked popup keep every icon button whole
  with no horizontal scroll; at 200 % zoom the buttons keep their size and stay
  operable.

## Accessibility

### Role and pattern

Native `<button type="button">` following the
[APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/); with
`pressed` defined it is the APG toggle button. `a[st-icon-button]` keeps the
native link role. In the lightbox the button sits inside a modal dialog; in the
map popup inside a non-modal dialog.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves to and from the button in DOM order (inside the lightbox the trap keeps focus among Close, Previous and Next, L2-010.4). |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates a `<button>`. |
| <kbd>Enter</kbd> | Follows an `a[st-icon-button]`. |
| <kbd>Esc</kbd> | Not the button's: the lightbox and popup close on Escape, the same as Close. |

### Focus

The shared ring shows on `:focus-visible` only and draws round the circle. The
component never moves focus; the lightbox puts initial focus on Close (the
consumer's `autofocus`) and returns it to the thumbnail, the popup returns it to
the marker.

### Labelling

- The accessible name is `label`, rendered as `aria-label`: "Close", "Previous
  photo", "Next photo". The glyph is `aria-hidden="true"` and adds nothing.
- No `title` tooltip: a glyph that needs one needs a word, so it is a
  [`button[st-button]`](button.md) with a visible label (D-7).
- Position is not repeated in the arrows' names; the lightbox's polite "Photo 8
  of 8" carries it.

### Announcements

None. Pressed and expanded changes are conveyed by state attributes; results
are announced by the containing component (the lightbox count).

### Motion

Only the fill transitions, over `--duration-fast`, which the tokens set to 0
under `prefers-reduced-motion: reduce`.

## Content and internationalisation

- Names are short verb phrases in sentence case: "Close", "Previous photo",
  "Next photo". In a list the name includes its object ("Remove test shot 2").
- One glyph, one meaning: × closes, chevrons step, the external arrow leaves
  ShotThere. × never means "remove" outside a chip.
- Translatable content: `label` only. In Phase 1 every label is a library
  string with an override (§12), so a translation reaches the button through its
  container's `closeLabel` or the lightbox catalogue entries.
- Longer translations change only the `aria-label`; the box never grows.

## Performance

- Change detection: `OnPush`, signal inputs; the host class list is one
  `computed` of `outline`, and `aria-pressed` is `null` while `pressed` is
  `undefined`.
- Performance scenario: the `components-harness` route `icon-button/performance`
  renders The Junction Loft's lightbox bar and stage controls (outline "Close",
  "Previous photo", "Next photo") and the map popup's ghost "Close"; pressing
  "Next photo" eight times must keep each interaction within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the box is a fixed 44 px square, so a late icon or label
  change never moves anything.
- Weight: imports `@angular/core` and the library's `IconComponent` only.

## Acceptance criteria

### Rendering

- **AC-1** Given `<button st-icon-button type="button" icon="close" label="Close">` in the map popup for The Junction Loft, when it renders, then the element is a native `button` with the class `icon-btn` only, `aria-label="Close"`, one `svg.icon` with `aria-hidden="true"`, no text content and no wrapper element. (L2-028)
- **AC-2** Given the lightbox open on "Photo 8 of 8" of The Junction Loft, when its Close, Previous and Next render with `outline`, then each carries `icon-btn icon-btn--outline`, a 1 px `--color-border-default` ring, and the names "Close", "Previous photo" and "Next photo". (L2-010)
- **AC-3** Given an icon button without a `pressed` input, when it renders, then it has no `aria-pressed` attribute. (L2-069)
- **AC-4** Given an icon button with `pressed` true, when it renders, then it has `aria-pressed="true"`, keeps the `--color-bg-subtle` fill and draws its glyph in `--color-fg-accent`; with `pressed` false it has `aria-pressed="false"` and the default look. (L2-069)
- **AC-5** Given `<a st-icon-button href="/" icon="home" label="Home" aria-current="page">`, when it renders, then it is a link with the class `icon-btn`, keeps its `href`, is named "Home", and its glyph is `--color-fg-accent` at rest and on hover. (L2-069)

### States

- **AC-6** Given the map popup's Close, when the pointer rests on it and then presses it, then the fill is `--color-bg-subtle` on hover and `--color-bg-subtle-hover` while pressed, and the glyph stays `--color-fg-default`. (L2-068)
- **AC-7** Given an icon button with native `disabled`, when a keyboard user tabs past it and a screen reader reads it, then Tab skips it, it renders at 50 % opacity with no hover fill, and it is exposed as unavailable. (L2-069)

### Keyboard and focus

- **AC-8** Given the lightbox opened on The Junction Loft's gallery, when a keyboard user presses Tab from Close, then focus moves to "Previous photo" and then "Next photo", and Enter or Space on "Next photo" activates it once without moving focus off it. (L2-067)
- **AC-9** Given any icon button in the lightbox or the map popup, when it receives keyboard focus, then a `--focus-ring-width` (2 px) ring in `--color-focus-ring` is drawn round the circle at `--focus-ring-offset` with at least 3:1 against the surface, and no ring appears on mouse click. (L2-067)

### Screen readers

- **AC-10** Given the lightbox and the map popup in light and dark, when axe-core scans them, then every icon button has an accessible name, its glyph is hidden from the accessibility tree, and no violation is reported. (L2-069)
- **AC-11** Given "Next photo" on photo 8 of 8, when a screen reader user reaches it, then it is announced as "Next photo, button" with no position text in its name. (L2-010)

### Theming

- **AC-12** Given the ghost Close on the map popup's raised surface and the outline Close on the lightbox canvas, when the contrast check runs in the light and the dark theme, then the glyph is at least 3:1 against its surface at rest, on hover and while pressed, and the focus ring is at least 3:1. (L2-068)

### Responsive

- **AC-13** Given the lightbox at 1280 px and the docked map popup at 360 px, when each icon button is measured, then it is 44 × 44 CSS px. (L2-065)
- **AC-14** Given the docked map popup for "Leslieville Daylight Studio" at 320 px wide, when it renders, then Close is fully visible in the popup's top-right corner and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the fill change takes 0 ms
([icon-button.html](../../design-system/components/icon-button.html), Accessibility › Motion).

### Performance

- **AC-15** Given the `icon-button/performance` harness route, when "Next photo" is pressed, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/icon-button/`:
  `icon-button.component.ts` (`IconButtonComponent`, selector
  `button[st-icon-button], a[st-icon-button]`), `icon-button.component.html`
  (`<st-icon [name]="icon()" />`), `icon-button.component.css` (port of the
  `.icon-btn*` rules from `components.css`, written against `:host`, plus the
  new `:host(.icon-btn--outline)` ring and the forced-colours rule).
- Host bindings: `class` (`icon-btn`, plus `icon-btn--outline` when `outline`),
  `[attr.aria-label]` from `label`, `[attr.aria-pressed]` (`null` when `pressed`
  is `undefined`).
- Composes [`st-icon`](icon.md) at its default size `md`.
- Consumers: `LightboxComponent` (Close, Previous, Next with `outline`) and
  `MapPopupComponent` (Close). The DS's container rule `.viewer .icon-btn` is not
  ported; the lightbox sets `outline` instead (D-1).
- Not ported: the DS `[data-state]` hooks (documentation only, ICD-DOM-2).

## Decisions

- **D-1** *ICD-002 gives the icon button an `outline` input that adds `.icon-btn--outline`, but the design system has no such class and draws the lightbox ring from its container (`.viewer .icon-btn`).* The ICD stands: `outline` adds `.icon-btn--outline`, the icon button's own CSS draws the ring, and the lightbox sets `outline` on its three buttons. With encapsulated styles one owner should style `.icon-btn`; a container rule reaching into it would put icon-button styling in the lightbox. The rendering marks the ring as a specimen; the DS page catches up at the next extraction.
- **D-2** *The mocks draw Close as `<a href>`; does the product keep a link?* No. Close is `<button type="button">`, because it acts in place and must return focus to the opener (DS icon-button, Accessibility); the mocks link only so the static set can be navigated. `a[st-icon-button]` stays in the ICD for an icon that navigates, with the DS's `aria-current` look; Phase 1 does not use it.
- **D-3** *Does the component default `type="button"`?* No. As with `button[st-button]`, the consumer writes `type` on the host; every ShotThere use writes `type="button"`.
- **D-4** *ICD-002 lists toasts under the icon button's users.* The toast's dismiss stays the toast's own `.close` button, as the DS toast page and every toast mock draw it; it is the toast region's markup, not this component.
- **D-5** *The DS styles pressed, expanded and current icon buttons that no mock uses.* They are supported (`pressed` input, consumer `aria-expanded` and `aria-current`) with the DS look, because the ICD fixes `pressed` and the CSS costs nothing; use them only for a real toggle or the trigger of an open popover.
- **D-6** *Should the icon button get a soft-disabled state like `button[st-button]`?* No. ICD-002 gives it none and the DS says no ShotThere icon button is ever disabled; native `disabled` (and a consumer-written `aria-disabled`) keep the DS look if one ever is.
- **D-7** *Should an icon-only button show a `title` tooltip?* No. The DS rule is that a glyph needing a tooltip needs a visible word, and `title` duplicates the name for screen readers.
