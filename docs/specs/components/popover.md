# Popover

| Field | Value |
|---|---|
| Selector | `st-map-popup` (`MapPopupComponent`) |
| Library path | `frontend/projects/components/src/lib/map-popup/` |
| Status | planned |
| Traces to | L2-028, L2-029, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`popover.html`](../../design-system/components/popover.html), [`map.html`](../../design-system/components/map.html), [`dialogs-and-overlays.html`](../../design-system/patterns/dialogs-and-overlays.html) |
| Source mocks | [`dialogs/map-popup/default`](../../mocks/dialogs/map-popup/default.html), [`dialogs/map-popup/spot`](../../mocks/dialogs/map-popup/spot.html), [`pages/map/default`](../../mocks/pages/map/default.html), [`pages/map/list`](../../mocks/pages/map/list.html) |
| Rendering | [`popover.html`](popover.html) |

## Purpose and scope

A popover is a small raised panel that opens from a trigger, stays beside it
and leaves the page usable. ShotThere has exactly one: the map marker popup.
Activating a marker on the map page opens a card with the location's kind,
name, key fact (the all-in cost for a studio, the portrait permit for a spot)
and a link to its review (L2-028). From 48rem it floats 32 px above its
marker; below 48rem it docks as a card along the bottom of the map, so it
never slides off a narrow screen.

`st-map-popup` renders that card. It is a non-modal `role="dialog"`, not opened
through `DialogService`: the page is not inert and focus is not trapped. Use
[`st-dialog`](dialog.md) for anything that needs a decision or input, and the
location card on the list for more than three short lines.

Out of scope:

- The map engine, the tiles, the markers and their `aria-expanded` /
  `aria-controls`, opening a popup when a marker is activated, keeping one
  popup at a time, closing on a pointer press outside, placing the popup at
  its marker, and returning focus to the marker after `closed`: the
  application's `LocationsMapComponent` (ICD D-6, §14).
- Formatting the key fact ("All-in for 2 hours: $145.00") and building the link
  path: the application.
- The marker and legend styles: global map-marker utilities (ICD §11.1) and
  [`st-map-legend`](map.md).

## Usage

Every `.popover` in `docs/mocks/` (the map-popup mocks are its only use).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/map-popup/default` over `pages/map/default`, opened by the studio marker "The Junction Loft, studio" | `kind="Studio"`, `name="The Junction Loft"`, `fact="All-in for 2 hours: $145.00"`, `link="/studios/the-junction-loft"`, `linkText="View the review"`, `dock`, `headingLevel` 2 | no slots | open (floating from 48rem, docked below) | raised panel over map tiles |
| `dialogs/map-popup/spot`, opened by "Evergreen Brick Works, outdoor spot" | `kind="Outdoor spot"`, `name="Evergreen Brick Works"`, `fact="Portraits: no permit needed"`, `link="/spots/evergreen-brick-works"`, `linkText="View the spot"`, `dock` | no slots | open | raised panel over map tiles |
| `pages/map/default`, `list` (all twelve markers) | Any of the seven studios and five spots, e.g. "Leslieville Daylight Studio", "All-in for 2 hours: $91.00"; "Distillery District", "Portraits: permit required" | no slots | open, closed | raised panel over map tiles |

Every row is buildable with the ICD inputs; no ICD change is needed.

## Anatomy

1. **Panel** — the host: `st-map-popup` with the classes `popover map-popup`
   (and `map-popup--dock`), `role="dialog"`, `aria-labelledby` on the name, no
   `aria-modal`. `--color-bg-surface-raised`, `--border-width-hairline`
   `--color-border-default` edge, `--radius-md`, `--shadow-3`, `--space-4`
   padding; flex column with `--space-1` between lines; absolutely positioned
   at `--z-popover`.
2. **Kind** — `p.map-popup__kind`: "Studio" or "Outdoor spot", `--text-overline`,
   uppercase by CSS, `--color-fg-muted`.
3. **Name** — `h2.map-popup__name` (level from `headingLevel`), `--text-h4`,
   `--space-10` right padding so it never runs under Close. It labels the dialog.
4. **Key fact (optional)** — `p.map-popup__fact`, `--text-body-sm`, muted.
   Absent when `fact` is `null`.
5. **Link** — a plain `<a>` with `routerLink`, text `linkText`, then
   `<span class="visually-hidden">: The Junction Loft</span>`.
6. **Close** — `button[st-icon-button] icon="close"` (`.icon-btn`), 44 px,
   pinned `--space-1` from the top-right corner, named by `closeLabel`.

Host: the host element is the panel (ICD-DOM-1), so the component adds no
wrapper. The application positions the host (D-2).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `kind` | `string` | — | yes | Text of `.map-popup__kind`: "Studio", "Outdoor spot". |
| `name` | `string` | — | yes | Text of the heading; its generated ID is the host's `aria-labelledby`; appended to the link as hidden context. |
| `fact` | `string \| null` | `null` | no | `.map-popup__fact`; not rendered when `null`. Formatted by the application. |
| `link` | `string` | — | yes | Router path for the link (`routerLink`), from `APP_PATHS`. |
| `linkText` | `string` | — | yes | Visible link text: "View the review", "View the spot". |
| `headingLevel` | `HeadingLevel` (`2 \| 3 \| 4`) | `2` | no | Element of the name: `h2`, `h3` or `h4`. |
| `dock` | `boolean` | `false` | no | `.map-popup--dock`: below 48rem the popup docks along the bottom of its containing map frame. No effect from 48rem. |
| `closeLabel` | `string` | §12 `st.dialog.close` ("Close") | no | `aria-label` of Close. |

`dock` uses `booleanAttribute`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `closed` | `void` | Close is activated, or Escape is pressed while focus is inside the popup. Emitted once per activation. The component does not remove itself or move focus: the application stops rendering it, sets its marker's `aria-expanded="false"` and focuses the marker. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | The popup's content is fixed by the DS ("one link, plus Close"); every word arrives through inputs. |

## Variants and sizes

| Variant | Inputs | Key fact |
|---|---|---|
| Studio | `kind="Studio"`, `linkText="View the review"` | All-in cost for 2 hours: "All-in for 2 hours: $145.00" |
| Outdoor spot | `kind="Outdoor spot"`, `linkText="View the spot"` | Portrait permit: "Portraits: no permit needed", "Portraits: permit required" |
| Floating | from 48rem, or `dock` false | Centred above the application's anchor point, 32 px (`--space-8`) above it |
| Docked | `dock` below 48rem | Full width of the map frame less `--space-3` each side, `--space-3` from its bottom |

One size: `min(17rem, 100vw − 2 × --layout-margin)` wide when floating; the
map frame's width less `--space-3` on each side when docked. Height follows the
three lines of content.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Open | The application renders the component | Scales in from 96 % over `--duration-fast` with `--ease-enter` | Focus moves to the link; "View the review: The Junction Loft, link", inside "The Junction Loft, dialog" |
| Floating | 48rem and wider | Above the anchor point, centred on it | — |
| Docked | `dock` below 48rem | Card along the bottom of the map, no translate | — |
| No key fact | `fact` null | Kind, name and link only | — |
| Close hover, focus, active | `:hover`, `:focus-visible`, `:active` on Close | `--color-bg-subtle` / `--color-bg-subtle-hover` fill; focus ring | — |
| Link hover, focus | native | Link underline thickens; focus ring | — |
| Closed | `closed` handled by the application | Removed (no exit animation) | Focus on the marker (application) |

The popup has no disabled, busy or error state: it shows data the map already
has.

## Markup

```html
<!-- rendered: studio, docked on phones (the application sets left and top) -->
<st-map-popup class="popover map-popup map-popup--dock" role="dialog" aria-labelledby="st-map-popup-1-name" style="left: 20%; top: 40%;">
  <p class="map-popup__kind">Studio</p>
  <h2 class="map-popup__name" id="st-map-popup-1-name">The Junction Loft</h2>
  <p class="map-popup__fact">All-in for 2 hours: $145.00</p>
  <a href="/studios/the-junction-loft">View the review<span class="visually-hidden">: The Junction Loft</span></a>
  <button class="icon-btn" type="button" aria-label="Close"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
</st-map-popup>
```

```html
<!-- rendered: outdoor spot, h3, no dock -->
<st-map-popup class="popover map-popup" role="dialog" aria-labelledby="st-map-popup-2-name">
  <p class="map-popup__kind">Outdoor spot</p>
  <h3 class="map-popup__name" id="st-map-popup-2-name">Evergreen Brick Works</h3>
  <p class="map-popup__fact">Portraits: no permit needed</p>
  <a href="/spots/evergreen-brick-works">View the spot<span class="visually-hidden">: Evergreen Brick Works</span></a>
  <button class="icon-btn" type="button" aria-label="Close">…</button>
</st-map-popup>
```

Without `fact` the `.map-popup__fact` paragraph is absent. The generated ID
and the host's element name are not part of the contract (ICD-DOM-3).

```html
<!-- consumer: LocationsMapComponent, right after the open marker inside the map frame -->
@if (openLocation(); as loc) {
  <st-map-popup [id]="popupId" dock [kind]="loc.kindLabel" [name]="loc.name" [fact]="loc.keyFact"
                [link]="loc.link" [linkText]="loc.linkText"
                [style.left]="loc.anchor.left" [style.top]="loc.anchor.top"
                (closed)="closePopup(loc)" />
}
```

## Design

- Panel (`.popover`): `--color-bg-surface-raised`, `--border-width-hairline` solid `--color-border-default`, `--radius-md`, `--shadow-3`, padding `--space-4`, `position: absolute`, `--z-popover`; animation `scale-in` over `--duration-fast` with `--ease-enter`.
- Map popup (`.map-popup`): `translate: -50% calc(-100% - var(--space-8))`, width `min(17rem, calc(100vw - 2 * var(--layout-margin)))`, no max width, flex column, gap `--space-1`.
- Docked (`.map-popup--dock`, below 48rem): left and right `--space-3`, bottom `--space-3`, top `auto`, no translate, width `auto`; `left` and `top` are overridden with `!important`, so the application's inline position never fights the dock.
- Kind `--text-overline`, `--letter-spacing-wide`, uppercase, `--color-fg-muted`; name `--text-h4` with `--space-10` right padding; fact `--text-body-sm`, `--color-fg-muted`.
- Close: `.icon-btn`, `--target-comfortable` square, `position: absolute`, top and right `--space-1`.
- Layer `--z-popover`, inside the map frame's own stacking context (`.static-map` isolates), so the popup never covers the header or an open sheet.

The popup declares no component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Panel | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Name, Close glyph | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Kind, key fact | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Link | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |
| Close hover fill | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Name, Close glyph |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Kind and key fact |
| `--color-fg-link` | `--color-bg-surface-raised` | 4.5:1 | "View the review" |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Close glyph, hover |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring on the panel |

The hairline edge is decorative: the shadow and the surface step carry the
edge. In dark the raised surface is a step lighter than the canvas and the
shadow deepens, so the panel reads as lifted over dark tiles. Forced colours:
the border is drawn in `CanvasText`.

## Responsive behaviour

| Width | Behaviour |
|---|---|
| Below 48rem with `dock` | Docks along the bottom of the map frame: `--space-3` from its left, right and bottom edges; ignores the application's `left` and `top`. The map above stays in view. |
| 48rem and wider, or no `dock` | Floats centred above the anchor, 32 px above it, `min(17rem, 100vw − 2 × --layout-margin)` wide. |

- The docked card is as wide as the map frame allows, so a long name ("Leslieville
  Daylight Studio") wraps under the reserved Close space instead of
  overflowing; the page never scrolls sideways at 320 px.
- Close and every marker are 44 × 44 CSS px at every width.
- At 200 % zoom the docked card keeps all three lines and the link reachable;
  the map below 62rem fills the viewport under the header (L2-029).

## Accessibility

### Role and pattern

A non-modal dialog: the host is `role="dialog"` with `aria-labelledby` on the
name and no `aria-modal`, because the map and list stay usable. The page is
not inert. The trigger (the application's marker) is a `<button>` with
`aria-haspopup="dialog"`, `aria-expanded` and, while open, `aria-controls`
pointing at the host's `id`, following the [APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
labelling rules and the disclosure-style trigger state.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the link and Close, then on to whatever follows the popup in the DOM (the next marker); focus is not trapped. |
| <kbd>Esc</kbd> | Inside the popup: emits `closed`. On the marker: the application closes it. |
| <kbd>Enter</kbd> | Follows the link; activates Close (native). |

### Focus

On open the component moves focus to the link ("View the review: The Junction
Loft") after its first render. On `closed` the application focuses the marker
(L2-028.2). The application renders the popup right after its marker in the DOM,
so Tab from Close lands on the next marker. Controls show the shared 2 px
`--color-focus-ring`.

### Labelling

The name labels the dialog ("The Junction Loft"). The link's name is
`linkText` plus ": " plus the name ("View the review: The Junction Loft"), so
twelve markers never give twelve identical links. Close is named by
`closeLabel`.

### Announcements

None. Opening moves focus into the popup, which announces the dialog's name and
the link.

### Motion

The design-system rule (no AC; L2 has no motion requirement): the panel scales
in from 96 % over `--duration-fast`; under `prefers-reduced-motion: reduce` the
duration is zeroed and the panel simply appears ([popover.html](../../design-system/components/popover.html), Accessibility › Motion).

## Content and internationalisation

- Kind: "Studio" or "Outdoor spot", as the map legend says.
- Name: the published name, from data ("The Junction Loft", "Evergreen Brick
  Works").
- Key fact: one line, the same fact the location card shows: "All-in for 2
  hours: $145.00", "Portraits: no permit needed". Money formatted by the
  application for `en-CA`.
- Link: a verb phrase naming the destination: "View the review", "View the
  spot". Never "More" or "Details".
- No paragraphs, lists or images; three short lines at most.
- Translatable: `kind`, `fact` (its template), `linkText`, `closeLabel`, marked
  by the application. The ": " before the hidden name is punctuation the
  component adds (D-5).
- Library string: `st.dialog.close` "Close" (ICD §12), replaced through
  `closeLabel`.

## Performance

- Change detection: `OnPush`, signal inputs; the host classes come from one
  `computed`, the hidden link context from another.
- Weight: imports `RouterLink`, `IconButtonComponent` and `IconComponent`; no
  CDK overlay, no map library (ICD-DEP-2).
- Performance scenario: the `components-harness` route `map-popup/performance`
  renders a map frame with the twelve markers of the cast (seven studios, five
  spots) and opens The Junction Loft's popup when its marker is activated;
  opening it must stay within the L2-071 INP budget.
- Regression rule: a change to the template, inputs or styles is measured on
  that route against the base branch before it is pushed.
- Layout stability: the popup is absolutely positioned inside the map frame,
  so opening and closing it shifts nothing.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-map-popup kind="Studio" name="The Junction Loft" fact="All-in for 2 hours: $145.00" link="/studios/the-junction-loft" linkText="View the review" dock>`, when it renders, then the host has the classes `popover map-popup map-popup--dock`, `role="dialog"`, no `aria-modal`, the accessible name "The Junction Loft", and shows "Studio", an `h2` "The Junction Loft" and "All-in for 2 hours: $145.00". (L2-028)
- **AC-2** Given the studio popup for The Junction Loft, when the visitor activates its link, then the router navigates to `/studios/the-junction-loft` and the link's accessible name is "View the review: The Junction Loft". (L2-028)
- **AC-3** Given `<st-map-popup kind="Outdoor spot" name="Evergreen Brick Works" fact="Portraits: no permit needed" link="/spots/evergreen-brick-works" linkText="View the spot">`, when it renders, then it shows "Outdoor spot", "Evergreen Brick Works" and "Portraits: no permit needed", and the link is named "View the spot: Evergreen Brick Works". (L2-028)
- **AC-4** Given a popup with `fact` null, when it renders, then no `.map-popup__fact` element exists and the kind, name and link still render. (L2-028)
- **AC-5** Given a popup with `headingLevel` 3, when it renders, then the name is an `h3.map-popup__name` and the dialog's `aria-labelledby` points at it. (L2-069)

### Keyboard and focus

- **AC-6** Given the map page and the marker "The Junction Loft, studio", when a keyboard user presses Enter on the marker and the application renders the popup, then focus is on "View the review: The Junction Loft". (L2-067)
- **AC-7** Given the open popup with focus on its link, when the visitor presses Escape, then `closed` is emitted exactly once and the component does not move focus itself, so the application's handler can return focus to the marker. (L2-028)
- **AC-8** Given the open popup, when the visitor activates Close, then `closed` is emitted exactly once. (L2-028)
- **AC-9** Given the popup rendered right after its marker in the DOM, when the visitor presses Tab from Close, then focus moves to the next marker and the popup stays open. (L2-067)

### Screen readers

- **AC-10** Given the studio and the spot popups in the light and dark themes, when axe-core scans the map page with a popup open, then it reports no violations, the dialog is named by its location name, and Close is named "Close". (L2-069)

### Theming

- **AC-11** Given the studio popup in the light and dark themes, when the contrast check runs, then the name and link are at least 4.5:1, the kind and key fact at least 4.5:1 against `--color-bg-surface-raised`, and the focus ring on Close at least 3:1 against it. (L2-068)

### Responsive

- **AC-12** Given the map view at 360 px with The Junction Loft's popup open and `dock` set, when it renders, then the popup sits `--space-3` from the map frame's left, right and bottom edges regardless of the application's `left` and `top`, and the map above it stays visible with no horizontal scroll. (L2-029)
- **AC-13** Given the map view at 768 px with The Junction Loft's popup open, when it renders, then the popup is centred horizontally on its anchor point and its bottom edge is 32 px above that point. (L2-028)
- **AC-14** Given the map view at 320 px with Leslieville Daylight Studio's popup docked, when it renders, then the name wraps without running under Close and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-15** Given an open popup at 360 px, when its Close button is measured, then it is at least 44 × 44 CSS px. (L2-065)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the scale-in takes 0 ms ([popover.html](../../design-system/components/popover.html), Accessibility › Motion).

### Performance

- **AC-16** Given the `map-popup/performance` harness route with twelve markers, when The Junction Loft's marker is activated and its popup opens, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/map-popup/`:
  `map-popup.component.ts` (`MapPopupComponent`, selector `st-map-popup`),
  `map-popup.component.html`, `map-popup.component.css` (port of `.popover`,
  `.map-popup*` and the `.map-popup--dock` media rule, written against
  `:host`, `:host(.map-popup--dock)`).
- Host bindings: `class` (`popover map-popup` plus `map-popup--dock` from
  `dock`), `role="dialog"`, `[attr.aria-labelledby]` (the generated name ID),
  and a `keydown.escape` listener that emits `closed`.
- Template: `<p class="map-popup__kind">`, the heading through `@switch
  (headingLevel())`, `@if (fact())`, `<a [routerLink]="link()">{{ linkText() }}<span class="visually-hidden">{{ linkContext() }}</span></a>`,
  `<button st-icon-button type="button" icon="close" [label]="closeLabel()" (click)="closed.emit()"></button>`.
- Initial focus: `afterNextRender` focuses the link (browser only, ICD-SSR-1).
- IDs: a library counter (`st-map-popup-<n>-name`); the map renders in the
  browser only, so no hydration mismatch can arise.
- ICD patch (no API change): ICD-DOM-5 lists the inline `left` and `top` the
  application writes on `st-map-popup` as allowed positioning, as D-6 and §14
  already assign popup placement to the application (D-2).
- Mocks drift the component corrects: the marker and Close drawn as `<a>` are
  `<button type="button">`; the popup follows its marker in the DOM rather than
  coming after all twelve markers and the legend.

## Decisions

- **D-1** *The design system documents `.popover` as a primitive, but ICD-002 has no popover component.* This CRD (slug `popover`) specifies `st-map-popup`, the only popover the product has, with the `.popover` rules ported into it. A second popover would get its own component and an ICD entry.
- **D-2** *ICD D-6 and §14 give popup positioning to the application, but ICD-DOM-5 allows the application only margin, grid and flex placement and width on a library host.* The application positions the host with inline `left` and `top` inside the map frame, as the mocks do; `.map-popup--dock` overrides both with `!important` below 48rem. No input can know the map engine's projection, so positioning must stay with the application. The host must be a child of the map frame itself (not of a marker-anchored wrapper), so the dock measures against the frame. ICD-DOM-5 needs the matching patch.
- **D-3** *The DS closes the popover on a pointer press outside it "without moving focus", but `closed` is documented for Close and Escape, after which the application returns focus to the marker.* An outside press is the application's: the map engine's click handler closes the popup (or opens another marker's). `closed` keeps one meaning (focus goes back to the marker), so the application never has to guess why it fired.
- **D-4** *Who moves focus into the popup on open?* The component, after its first render, to the link: "keyboard behaviour and focus inside a component" is the library's (ICD §14). The DS and the overlays pattern both name the link as the start point.
- **D-5** *The hidden context after the link is ": " plus the name; ICD-I18N-3 forbids static text in library templates.* The component builds the string in TypeScript (a `computed`), so the template has no literal text. The colon is punctuation rather than a phrase, and a screen reader reads "View the review: The Junction Loft" the same in any locale the product ships.
- **D-6** *Close: the dialogs' `button[st-button] variant="ghost" iconOnly`, or `.icon-btn`?* `button[st-icon-button] icon="close"` (`.icon-btn`), as the mocks and the DS code render it; `.map-popup > .icon-btn` pins it to the corner.
- **D-7** *Does the popup cover an open site-menu sheet on the map page (`--z-popover` is above `--z-modal`)?* No: `.static-map` sets `isolation: isolate`, so the popup's layer only orders it within the map. No extra rule is needed.
