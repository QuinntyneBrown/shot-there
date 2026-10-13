# Sheet

| Field | Value |
|---|---|
| Selector | `st-sheet` (`SheetComponent`) |
| Library path | `frontend/projects/components/src/lib/sheet/` |
| Status | planned |
| Traces to | L2-022, L2-024, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`sheet.html`](../../design-system/components/sheet.html), [`dialogs-and-overlays.html`](../../design-system/patterns/dialogs-and-overlays.html) |
| Source mocks | [`dialogs/site-menu/default`](../../mocks/dialogs/site-menu/default.html), [`dialogs/site-menu/admin`](../../mocks/dialogs/site-menu/admin.html), [`dialogs/studio-filters/default`](../../mocks/dialogs/studio-filters/default.html), [`dialogs/studio-filters/selected`](../../mocks/dialogs/studio-filters/selected.html), [`dialogs/studio-filters/invalid`](../../mocks/dialogs/studio-filters/invalid.html), [`dialogs/spot-filters/default`](../../mocks/dialogs/spot-filters/default.html), [`dialogs/spot-filters/selected`](../../mocks/dialogs/spot-filters/selected.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/spots/default`](../../mocks/pages/spots/default.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html) |
| Rendering | [`sheet.html`](sheet.html) |

## Purpose and scope

A sheet is a full-height modal panel for content too long for a dialog: the
site menu on phones, and the studio and spot filters below 62rem. It fills the
phone screen, rising from the bottom, and from 48rem becomes a 28rem side
sheet against the right edge. It is a dialog with a different shape: same
role, same focus rules, same Escape, opened through the same
[`DialogService`](dialog.md) with `kind: 'sheet'`.

`st-sheet` is the template root of the application component that the service
opens: title, Close, a scrolling body and an optional footer. Use
[`st-dialog`](dialog.md) for one question, the [lightbox](lightbox.md) for
photos, and the page's own filter sidebar from 62rem, where there is room.

Out of scope:

- Opening, closing, focus trap, initial focus, inert page, backdrop, scroll
  lock and focus return: `DialogService` ([dialog.md](dialog.md), API ›
  `DialogService`).
- The menu's links and their current-page mark (`.section-list`,
  `.section-link`, [`st-section-links`](list.md)), the filter form, its fields, the live
  count in "Show 7 studios", the range validation and applying the filters to
  the URL: the application (`SiteMenuSheetComponent`,
  `StudioFiltersDialogComponent`, `SpotFiltersDialogComponent`, the names the detailed designs `browse/filter-and-sort-studios` and `list-and-filter-spots` use, whose root is `st-sheet`).
- When the header shows "Menu" and the list shows "Filters" (below 48rem and
  below 62rem): [`st-site-header`](site-header.md) and the page.
- Signing out: the application's click handler on the admin menu's "Sign out".

## Usage

Every `.sheet` in `docs/mocks/` (5 screens, 3 sheets), with the control that opens it.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/site-menu/default`, opened by "Menu" (`aria-haspopup="dialog"`) in the header of every public page below 48rem | title "Menu", `describedBy` on a hidden "Site navigation" line | body: hidden description, `nav "Primary"` (Studios, Spots, Map, Compare, Guides) and `nav "About ShotThere"` (Editorial policy) as `.section-link` rows; no footer | default | full-screen raised panel |
| `dialogs/site-menu/admin`, opened by "Menu" in every administration page's header below 48rem | title "Menu", `describedBy` on a hidden "Administration navigation" line | body: `nav "Administration"` (Dashboard with `aria-current="page"`, Studios, Spots, Guides, View site); footer: one secondary "Sign out" | default, current row | full-screen raised panel |
| `dialogs/studio-filters/*`, opened by "Filters" (`.filter-trigger.until-lg`) on `pages/studios/*` below 62rem | title "Filters", description "Choose what matters for this shoot. The list updates when you show the results." | body: the filter `<form id="studio-filters">` (sort, all-in cost range, neighbourhood, space and light, included gear, parking); footer: secondary "Clear all" (`type="reset"`), primary "Show 7 studios" (`type="submit" form="studio-filters"`) | default, selected ("Show 5 studios"), invalid ("Show studios" disabled, described by "The minimum must be lower than the maximum") | full screen below 48rem; side sheet 48–62rem |
| `dialogs/spot-filters/*`, opened by "Filters" on `pages/spots/*` below 62rem | title "Filters", description "Narrow the spots by type, the kind of shoot and permits. The list updates when you show the results." | body: `<form id="spot-filters">` (type, use case, permit); footer: "Clear all", "Show 5 spots" / "Show 2 spots" | default, selected | as above |

ICD §9.4 lists the filters under `st-dialog` with `fullScreenBelowSm`; this
CRD builds them with `st-sheet` (D-1). Every row is buildable with the API
below: title and description are inputs, the menu's hidden description comes
through `describedBy` (D-2), the form and the menu navs go in the default
slot, the footer buttons in the `footer` slot, and the footer buttons use the
native `form` attribute to submit the projected form.

## Anatomy

1. **Panel** — `.sheet`, the element with `role="dialog"`, `aria-modal="true"`,
   `aria-labelledby` and `aria-describedby`. Fixed, `--z-modal`, flex column,
   `--color-bg-surface-raised`. Full screen below 48rem; from 48rem
   `min(100%, --layout-sheet-width)` wide, full height, against the right edge
   with `--shadow-4`. Rendered by `DialogService` as the CDK container ([dialog.md](dialog.md) D-3).
2. **Backdrop** — `.backdrop` behind the panel (service); visible only beside
   the side sheet from 48rem. Clicking it does nothing (D-3).
3. **Header** — `.sheet__header`: title and Close in one row, a
   `--color-border-default` hairline below, top padding plus
   `env(safe-area-inset-top)`.
4. **Title** — `h2.sheet__title`, `--text-h4`, one word ("Menu", "Filters").
5. **Close** — `button[st-button] variant="ghost" iconOnly`
   (`.btn.btn--ghost.btn--icon`), 44 px, `st-icon name="close"`, named by
   `closeLabel`. The first focusable element, so focus starts on it.
6. **Body** — `.sheet__body`: scrolls on its own, `--space-8` between
   children. First child is the visible description (`p.subtitle`) when
   `description` is set; then the default slot.
7. **Footer (optional)** — `.sheet__footer`: a `--color-border-default`
   hairline above, buttons sharing the width equally, bottom padding plus
   `env(safe-area-inset-bottom)`. Not rendered when nothing is projected into
   it.

Host: `st-sheet` has `display: contents`, and so does the application
component's host (set by the service), so the header, body and footer are the
flex children of `.sheet`. The host adds no box and no class.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | Text of `h2.sheet__title`; its generated ID becomes the panel's `aria-labelledby`. |
| `description` | `string \| null` | `null` | no | When a string, renders `p.subtitle` as the body's first child; its generated ID becomes `aria-describedby`. |
| `describedBy` | `string \| null` | `null` | no | ICD change (D-2). The ID of an element in the projected body that describes the sheet (the menus' visually hidden "Site navigation"). Used only when `description` is `null`. |
| `closeLabel` | `string` | §12 `st.dialog.close` ("Close") | no | `aria-label` of Close. |

Inputs are signal inputs. The sheet has no `busy` input: applying filters only
changes the URL, and the list shows its own loading state (DS sheet page,
States).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Close and Escape call `DialogRef.close()` (result `undefined`, "nothing applied"). The consumer closes with a result from its own buttons: the filters component closes with the submitted filter values, the menu closes when a link is followed. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | `nav` landmarks of `.section-list` rows; one `<form>` of filter groups; a visually hidden description element | Rendered in `.sheet__body` after the description. A projected form spaces its own groups (`class="stack stack--lg"`, the global utility) (D-5). |
| `footer` | One or two `button[st-button]` | Rendered in `.sheet__footer`; buttons share the width equally (D-5). Nothing projected: no footer. |

## Variants and sizes

| Variant | What decides it | Use for |
|---|---|---|
| Navigation sheet | Body of `nav` rows, no footer (public) or "Sign out" footer (admin), hidden description | Site menu below 48rem |
| Filter sheet | Visible description, a form in the body, "Clear all" and "Show 7 studios" in the footer | Studio and spot filters below 62rem |

One size. Below 48rem the sheet fills the viewport (`position: fixed; inset:
0`, never `100vh`); from 48rem it is `min(100%, --layout-sheet-width)` (28rem)
wide and full height against the right edge. The content decides nothing about
the width.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Open | `DialogService.open(…, { kind: 'sheet' })` | Slides up below 48rem, in from the right from 48rem, over `--duration-slow` with `--ease-enter`; backdrop fades in | "Menu, dialog, Site navigation"; focus on Close |
| No footer | Nothing in the `footer` slot | Body runs to the bottom edge; bottom safe area still clear (body padding) | — |
| Selected (filters) | The consumer's controls are checked; its primary counts "Show 5 studios" | Chosen controls filled; nothing applies until the primary is pressed | — |
| Invalid (filters) | The consumer's field error and a disabled "Show studios" with `aria-describedby` | Field error under Maximum; primary at 50 % | Error read with the field; focus moved to it by the consumer |
| Current page (menu) | The consumer's `aria-current="page"` on a row | Accent bar and accent title (list CRD) | "current page" |
| Long content | Body taller than the viewport | Only the body scrolls; header and footer stay put | — |
| Closed | Close, Escape, or the consumer's `DialogRef.close(result)` | Removed at once | Focus back on "Menu" or "Filters" |

The sheet itself has no hover, focus or active state; its rows and buttons do.
Busy does not apply (no `busy` input).

## Markup

```html
<!-- rendered: site menu, public (panel and backdrop come from DialogService) -->
<div class="backdrop"></div>
<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="st-sheet-1-title" aria-describedby="menu-desc">
  <app-site-menu-sheet style="display: contents">
    <st-sheet style="display: contents">
      <div class="sheet__header">
        <h2 class="sheet__title" id="st-sheet-1-title">Menu</h2>
        <button class="btn btn--ghost btn--icon" type="button" aria-label="Close"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>
      <div class="sheet__body">
        <p class="visually-hidden" id="menu-desc">Site navigation</p>
        <nav aria-label="Primary"><ul class="section-list">
          <li><a class="section-link" href="/studios"><span class="section-link__body"><span class="section-link__title">Studios</span><span class="section-link__meta">7 rental studios, measured the same way</span></span></a></li>
          …
        </ul></nav>
        <nav aria-label="About ShotThere">…</nav>
      </div>
    </st-sheet>
  </app-site-menu-sheet>
</div>
```

```html
<!-- rendered: studio filters (visible description, form, footer) -->
<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="st-sheet-2-title" aria-describedby="st-sheet-2-desc">
  <div class="sheet__header"><h2 class="sheet__title" id="st-sheet-2-title">Filters</h2><button class="btn btn--ghost btn--icon" type="button" aria-label="Close">…</button></div>
  <div class="sheet__body">
    <p class="subtitle" id="st-sheet-2-desc">Choose what matters for this shoot. The list updates when you show the results.</p>
    <form class="stack stack--lg" id="studio-filters">
      <fieldset class="filter-group"><legend class="filter-group__title">Neighbourhood</legend>…</fieldset>
      …
    </form>
  </div>
  <div class="sheet__footer">
    <button class="btn" type="reset" form="studio-filters">Clear all</button>
    <button class="btn btn--primary" type="submit" form="studio-filters">Show 7 studios</button>
  </div>
</div>
```

```html
<!-- rendered: admin menu footer -->
<div class="sheet__footer"><button class="btn" type="button">Sign out</button></div>
```

The `st-sheet-<n>` IDs are generated and not part of the contract; host
elements and the inline `display: contents` are not part of it either
(ICD-DOM-3).

```html
<!-- consumer: StudioFiltersDialogComponent template -->
<st-sheet i18n-title title="Filters" [description]="intro()">
  <form class="stack stack--lg" id="studio-filters" [formGroup]="form" (ngSubmit)="apply()" (reset)="clear()">…</form>
  <ng-container slot="footer">
    <button st-button type="reset" form="studio-filters" i18n>Clear all</button>
    <button st-button variant="primary" type="submit" form="studio-filters"
            [disabled]="invalid()" [attr.aria-describedby]="invalid() ? 'f-cost-max-error' : null">{{ showLabel() }}</button>
  </ng-container>
</st-sheet>

<!-- consumer: SiteMenuSheetComponent template (public) -->
<st-sheet i18n-title title="Menu" describedBy="menu-desc">
  <p class="visually-hidden" id="menu-desc" i18n>Site navigation</p>
  <st-section-links [items]="primary()" i18n-navLabel navLabel="Primary" />
  <st-section-links [items]="about()" i18n-navLabel navLabel="About ShotThere" />
</st-sheet>
```

## Design

- Panel `.sheet`: fixed, inset 0, `--z-modal`, flex column, `--color-bg-surface-raised`; animation `slide-up` over `--duration-slow` with `--ease-enter`. From 48rem: inset 0 0 0 auto, width `min(100%, --layout-sheet-width)`, `--shadow-4`, animation `slide-in-right`.
- Header: flex, centred, gap `--space-4`, padding `--space-3` `--layout-margin` (`--space-6` from 48rem), top padding `--space-3` plus `env(safe-area-inset-top)`, `--border-width-hairline` `--color-border-default` bottom rule.
- Title `--text-h4`, `flex: 1`.
- Body: `flex: 1`, `overflow: auto`, padding `--space-6` `--layout-margin` (`--space-6` sides from 48rem), flex column, gap `--space-8`.
- Footer: equal-width grid of its buttons (D-5), gap `--space-3`, padding `--space-4` `--layout-margin` (`--space-6` sides from 48rem), bottom padding `--space-4` plus `env(safe-area-inset-bottom)`, hairline top rule; hidden when empty.
- Close: 44 × 44 px ghost icon-only button.
- Layer `--z-modal` over the `--z-overlay` backdrop.

The sheet declares no component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Panel | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Title, Close glyph | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Description, row meta | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Header and footer hairlines | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Backdrop beside the side sheet | `--color-bg-backdrop` | near-black at 50 % opacity | black at 66 % opacity |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Title, row titles, filter labels |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Filter intro, row meta |
| `--color-fg-accent` | `--color-bg-surface-raised` | 4.5:1 | Current menu row title |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Field and checkbox edges |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Range error |
| `--color-action` | `--color-bg-surface-raised` | 3:1 | "Show 7 studios" edge |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring on the sheet |

The hairlines are decorative and exempt from 1.4.11. Forced colours: the
shadow vanishes and a 1 px `CanvasText` edge marks the side sheet's inner side.

## Responsive behaviour

| Sheet | XS, SM (below 48rem) | MD (48–62rem) | LG, XL (62rem+) |
|---|---|---|---|
| Site menu | Full screen, rises from the bottom | Not opened: the header shows its links inline | Not opened |
| Studio and spot filters | Full screen, rises from the bottom | 28rem side sheet from the right over a dimmed page | Not opened: the filters sit in the `.browse` sidebar |

- Header and footer stay put; only the body scrolls. Both add the safe-area
  insets.
- Footer buttons share the width equally, so "Show 7 studios" is a full-width
  half at 320 px and never wraps under "Clear all"; the admin "Sign out" spans
  the whole width.
- `position: fixed; inset: 0`, never `100vh`, so mobile browser chrome cannot
  hide the footer.
- If the viewport grows past 62rem while the filters are open (rotation), the
  page closes the sheet with result `undefined`; the sheet itself does not
  watch the width (D-4).
- No horizontal scroll at 320 px; at 200 % zoom the body scrolls and Close and
  the footer stay reachable; Close and footer buttons are 44 × 44 CSS px;
  menu rows are at least 72 px tall (list CRD).

## Accessibility

### Role and pattern

[APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/):
`role="dialog"`, `aria-modal="true"`, `aria-labelledby` on the title and
`aria-describedby` on the intro line (visible in the filters, visually hidden
in the menus). The page behind is `inert` and `aria-hidden="true"`. Inside,
the menus are named `nav` landmarks ("Primary", "About ShotThere",
"Administration") and the filters a `<form>` of `<fieldset>` groups. The
"Menu" and "Filters" triggers carry `aria-haspopup="dialog"`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Cycles Close, the body's links or fields, then the footer; never leaves the sheet. |
| <kbd>Esc</kbd> | Closes without applying, like Close (result `undefined`). |
| <kbd>Space</kbd> / arrows | Toggle a checkbox, move in a radio group (native). |
| <kbd>Enter</kbd> | Follows a menu link; in the filters, submits the form like the primary (native). |

### Focus

On open, focus goes to Close in all four sheets, so the first Tab reaches the
content. On close it returns to "Menu" or "Filters". When the filters are
invalid, the consumer moves focus to the invalid field. The shared ring is 3:1
against the raised surface.

### Labelling

Title "Menu" or "Filters"; description "Site navigation", "Administration
navigation" or the filter intro; Close named by `closeLabel`. The primary names
the result ("Show 7 studios"), so the count is read with it.

### Announcements

The sheet has no live region. The filter count is part of the primary's name;
the list's `st-result-count` announces results after the sheet closes.

### Motion

The design-system rule (no AC; L2 has no motion requirement): the sheet slides
up below 48rem and in from the right from 48rem over `--duration-slow`; under
`prefers-reduced-motion: reduce` the duration is zeroed and the sheet simply
appears. There is no swipe to dismiss ([sheet.html](../../design-system/components/sheet.html), Accessibility › Motion and Touch).

## Content and internationalisation

- Titles are one word: "Menu", "Filters".
- Filter intro says when things change: "The list updates when you show the
  results."; the menus' hidden description is "Site navigation" or
  "Administration navigation".
- Footer (consumer): "Clear all" and "Show 7 studios" / "Show 2 spots" with the
  live count; "Show studios" when the filters are invalid; admin "Sign out".
  Never "Apply" or "Cancel".
- Translatable: `title`, `description`, `closeLabel`, both slots, marked by the
  consumer. Counts are formatted by the application.
- Library string: `st.dialog.close` "Close" (ICD §12), replaced through
  `closeLabel`.
- Longer translations wrap: the title row wraps before it pushes Close out;
  footer labels that cannot fit half of 320 px are shortened in the catalogue.

## Performance

- Change detection: `OnPush`, signal inputs, no template work beyond the
  description `@if`.
- Weight: `st-sheet` imports only `ButtonComponent` and `IconComponent`; the
  overlay machinery is `DialogService`'s. The filter and menu sheet components
  are lazy-loaded by the application (ICD-PERF-3).
- Performance scenario: the `components-harness` route `sheet/performance`
  opens the studio filters sheet (sort, cost range, seven neighbourhoods,
  space and light, four gear options, parking, "Show 7 studios") from its
  "Filters" button at 360 px; opening it must stay within the L2-071 INP
  budget.
- Regression rule: a change to the template, inputs or styles is measured on
  that route against the base branch before it is pushed.
- Layout stability: the sheet is an overlay, so it shifts nothing on the page;
  the footer's equal columns keep "Show 7 studios" the same width as the count
  changes.

## Acceptance criteria

### Rendering

- **AC-1** Given the public home page at 360 px, when the visitor activates "Menu" and the application opens `SiteMenuSheetComponent` with `<st-sheet title="Menu" describedBy="menu-desc">`, then one element with `role="dialog"`, `aria-modal="true"` and the class `sheet` fills the viewport, its name is "Menu" and its description "Site navigation", it contains the `nav` landmarks "Primary" and "About ShotThere", and no `.sheet__footer` is shown. (L2-064)
- **AC-2** Given the admin menu with a "Sign out" button in the `footer` slot, when it renders at 360 px, then `.sheet__footer` shows one button "Sign out" that spans the footer's full inner width. (L2-064)
- **AC-3** Given the studio list at 360 px, when the visitor activates "Filters" and the application opens `<st-sheet title="Filters" description="Choose what matters for this shoot. The list updates when you show the results.">` with the filter form and the footer "Clear all" and "Show 7 studios", then the sheet fills the viewport, the description is the visible first line of `.sheet__body`, and "Show 7 studios" and Close are both on screen without scrolling. (L2-022)
- **AC-4** Given the spot filters sheet with "Family" and "No permit needed for the selected use" chosen and the primary reading "Show 2 spots", when the visitor presses Escape, then the sheet closes with result `undefined` and the spot list still shows 5 spots. (L2-024)

### Keyboard and focus

- **AC-5** Given the site menu opened from the header's "Menu" button, when it opens, then focus is on the sheet's Close button. (L2-067)
- **AC-6** Given the studio filters sheet is open, when the visitor presses Tab and Shift+Tab repeatedly, then focus moves only among Close, the form's controls, "Clear all" and "Show 7 studios", and every other child of `body` has `inert` until the sheet closes. (L2-067)
- **AC-7** Given the studio filters sheet opened from "Filters", when the visitor activates Close, then the sheet closes with nothing applied and focus is on "Filters" again. (L2-067)
- **AC-8** Given the spot filters sheet at 768 px with "Family" checked, when the visitor clicks the dimmed page to the left of the side sheet, then the sheet stays open and "Family" is still checked. (L2-024)

### Screen readers

- **AC-9** Given the public menu, the admin menu, and the studio filters in their default, selected and invalid states, when axe-core scans each in the light and dark themes, then it reports no violations, each sheet has an accessible name and description, and Close is named "Close". (L2-069)

### Theming

- **AC-10** Given the studio filters sheet in the light and dark themes, when the contrast check runs, then the title and filter labels are at least 4.5:1 and the intro line at least 4.5:1 against `--color-bg-surface-raised`, and the focus ring on Close is at least 3:1 against it. (L2-068)

### Responsive

- **AC-11** Given the studio filters sheet at 360 px on a device with top and bottom safe-area insets, when it renders, then `.sheet__header`'s top padding includes `env(safe-area-inset-top)`, `.sheet__footer`'s bottom padding includes `env(safe-area-inset-bottom)`, and Close, "Clear all" and "Show 7 studios" are each at least 44 × 44 CSS px. (L2-065)
- **AC-12** Given the studio filters sheet at 320 px, when it renders, then "Clear all" and "Show 7 studios" sit side by side at equal widths on one row, neither label wraps, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-13** Given the studio filters sheet at 768 px, when it renders, then it is 28rem wide, full height, against the right edge with `--shadow-4`, and the page to its left is covered by the backdrop. (L2-022)
- **AC-14** Given the studio filters sheet at 360 × 640 px, when the visitor scrolls to "Parking", then only `.sheet__body` scrolls and the header with Close and the footer with "Show 7 studios" do not move. (L2-022)
- **AC-15** Given the admin menu in a 1280 px viewport at 200 % zoom, when it renders, then every row, Close and "Sign out" are reachable by scrolling the body only and nothing scrolls horizontally. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the slide-up and slide-in take 0 ms
([sheet.html](../../design-system/components/sheet.html), Accessibility › Motion).

### Performance

- **AC-16** Given the `sheet/performance` harness route at 360 px, when "Filters" is activated and the studio filters sheet opens, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/sheet/`: `sheet.component.ts`
  (`SheetComponent`, selector `st-sheet`), `sheet.component.html`,
  `sheet.component.css` (`:host { display: contents }` and the
  `.sheet__header`, `.sheet__title`, `.sheet__body`, `.sheet__footer` rules).
  The `.sheet` panel rule lives in the library-internal overlay container's
  CSS ([dialog.md](dialog.md) Implementation notes), because the container is
  the `.sheet` element.
- Template: `.sheet__header` (title, Close as `<button st-button variant="ghost" iconOnly type="button" [attr.aria-label]="closeLabel()"><st-icon name="close" /></button>`),
  `<div class="sheet__body">@if (description()) { <p class="subtitle" [id]="descId">{{ description() }}</p> }<ng-content /></div>`,
  `<div class="sheet__footer"><ng-content select="[slot=footer]" /></div>`,
  with `.sheet__footer:empty { display: none }`.
- The component registers its title ID and the description ID (or
  `describedBy`) with the container through `inject(DialogRef).containerInstance`,
  and closes on Escape through `DialogRef.keydownEvents`, as `st-dialog` does.
- Footer: `display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr)`
  replaces the DS `.sheet__footer .btn { flex: 1 }`, which encapsulated CSS
  cannot apply to projected buttons (D-5).
- ICD change (ICD-002 1.1.0, additive): `SheetComponent` gains `describedBy`
  (input, `string | null`, default `null`): the ID of an element in the
  projected body that describes the sheet, used only when `description` is
  `null` (D-2).
- ICD patch (no API change): §9.4 `st-sheet` "Used by: site menu, studio and
  spot filters"; `st-dialog`'s "Used by" drops the filters (D-1).
- Mocks drift the component corrects: Close, "Clear all" and the primary drawn
  as `<a>` are buttons with `form="…"`; the admin footer's `<form method="post">`
  becomes the application's "Sign out" click handler; the inline
  `grid-template-columns` on the cost `.field-row` is the consumer's
  `.field-row--pair`; the sheets get the backdrop (D-3).

## Decisions

- **D-1** *ICD §9.4 lists the studio and spot filters as `st-dialog` users with `fullScreenBelowSm`, while the design-system sheet page and all five filters mocks render them as `.sheet`.* The filters use `st-sheet`. Only the sheet gives the 28rem side sheet between 48rem and 62rem that the DS specifies, its full-height panel is the "full-height dialog with an Apply action and a close control" L2-022.5 asks for, and the existing `st-sheet` API (title, description, default and footer slots) covers them. ICD §9.4's "Used by" lines need a patch; `st-dialog` keeps `fullScreenBelowSm` ([dialog.md](dialog.md) D-11).
- **D-2** *The menus describe the sheet with a visually hidden line ("Site navigation") while the filters show theirs; `description` can only render one way.* `description` renders the visible `p.subtitle` the filters need, and the new `describedBy` input (additive, shared with `st-dialog`) points at a hidden line the menu projects. A `descriptionHidden` flag would also work but adds a second input that only one consumer needs, while `describedBy` also serves the dialog's refusal.
- **D-3** *The sheet mocks have no backdrop, so from 48rem the side sheet sits over an undimmed, inert page.* The service draws the backdrop behind sheets as behind dialogs ([dialog.md](dialog.md) D-6); clicking it does nothing ([dialog.md](dialog.md) D-1), as the DS's "Close and Escape are the only ways out" says. A dimmed page tells a sighted visitor it is unavailable, which an undimmed inert page does not.
- **D-4** *What happens to an open filters sheet when the viewport crosses 62rem (rotation, window resize)?* The page closes it with result `undefined` when its own breakpoint observer reports LG, because the sidebar then shows the same filters; the sheet stays unaware of the width, since ICD-API-10 keeps layout decisions out of components.
- **D-5** *The DS spaces filter groups and stretches footer buttons with descendant rules (`.sheet__body` gap on the form's groups, `.sheet__footer .btn { flex: 1 }`) that emulated encapsulation cannot apply to projected content.* The footer becomes an equal-column grid on `.sheet__footer` itself (same look), and the consumer's form takes the global `.stack .stack--lg` utility for its `--space-8` gaps.
- **D-6** *Should the admin menu keep the mock's `<form class="sheet__footer" method="post">` for "Sign out"?* No. The application projects a `type="button"` "Sign out" that calls its session service; a native POST form would bypass the API library and its CSRF handling.
