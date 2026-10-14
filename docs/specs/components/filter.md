# Filter

| Field | Value |
|---|---|
| Selector | `button[st-filter-trigger]`, `a[st-filter-trigger]`, `st-result-count`; page composition by the application's studio and spot filter components |
| Library path | `frontend/projects/components/src/lib/filter-trigger/`, `frontend/projects/components/src/lib/result-count/` |
| Status | planned |
| Traces to | L2-022, L2-023, L2-024, L2-025, L2-026, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`filter.html`](../../design-system/components/filter.html); patterns [`forms.html`](../../design-system/patterns/forms.html), [`feedback-and-loading.html`](../../design-system/patterns/feedback-and-loading.html), [`empty-and-error-states.html`](../../design-system/patterns/empty-and-error-states.html) |
| Source mocks | [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studios/filtered`](../../mocks/pages/studios/filtered.html), [`pages/studios/no-results`](../../mocks/pages/studios/no-results.html), [`pages/studios/loading`](../../mocks/pages/studios/loading.html), [`pages/studios/error`](../../mocks/pages/studios/error.html), [`pages/spots/default`](../../mocks/pages/spots/default.html), [`pages/spots/filtered`](../../mocks/pages/spots/filtered.html), [`pages/spots/no-results`](../../mocks/pages/spots/no-results.html), [`dialogs/studio-filters/default`](../../mocks/dialogs/studio-filters/default.html), [`dialogs/studio-filters/selected`](../../mocks/dialogs/studio-filters/selected.html), [`dialogs/studio-filters/invalid`](../../mocks/dialogs/studio-filters/invalid.html), [`dialogs/spot-filters/default`](../../mocks/dialogs/spot-filters/default.html), [`dialogs/spot-filters/selected`](../../mocks/dialogs/spot-filters/selected.html), [`pages/admin-studios/default`](../../mocks/pages/admin-studios/default.html), [`pages/admin-studios/no-results`](../../mocks/pages/admin-studios/no-results.html), [`pages/admin-spots/default`](../../mocks/pages/admin-spots/default.html), [`pages/admin-guides/default`](../../mocks/pages/admin-guides/default.html) |
| Rendering | [`filter.html`](filter.html) |

## Purpose and scope

Filters narrow the studio and spot lists to what a shoot needs: all-in cost,
neighbourhood, light, gear and parking for studios (L2-022); type, use case and
permit for spots (L2-024). From LG the filters sit in a column beside the
results; below LG a "Filters" button with the active count opens them in a
sheet. The chosen filters show as removable chips, the result count says how
many places match, and every choice lives in the URL (L2-025).

This CRD specifies the two library parts the design system's filter page
defines on its own, and how the pages compose the rest:

- **`button[st-filter-trigger]`** (`FilterTriggerComponent`): the pill-shaped
  "Filters" button below LG, with the count of active filters.
- **`st-result-count`** (`ResultCountComponent`, live): "7 studios", the only
  announcer of a list's count (ICD-002 D-7), also used, visually hidden, by the
  administration lists.
- **Composition** (application): the studios and spots pages' filter column
  and filters sheet, built from [`st-checkbox-group`](checkbox.md),
  [`st-radio-group`](radio-group.md), [`st-select`](select.md) and
  [`st-text-field`](text-field.md) with `appearance="filter"` where the control
  has one, [`st-active-filters`](chip.md), [`st-sheet`](sheet.md),
  [`button[st-button]`](button.md) and [`st-empty-state`](empty-state.md). The
  page grid (`.browse*`) is application feature CSS (ICD-002 §11.2).

Use [`st-segmented`](button-group.md) to switch views (Both / Studios / Spots on
the map), [`st-search-field`](combobox.md) for the admin search, and
[`st-compare-bar`](compare-bar.md) for the compare count.

Out of scope:

- Parsing and writing the URL query, counting active filters, building chip
  labels, previewing "Show 5 studios", validating the cost range and applying
  filters: the application, in plain TypeScript beside the page
  (`parseStudioListQuery`, `toStudioListQueryParams`, `countActiveFilters` in the
  [filter-and-sort-studios](../../detailed-designs/browse/filter-and-sort-studios/README.md)
  design). The server applies the filters and is the authority (L2-022).
- Each control's own markup, states and accessibility: their CRDs.
- Opening, trapping focus in and closing the sheet: `DialogService` and
  [`st-sheet`](sheet.md).

## Usage

Every `.filter-trigger`, `.result-count`, `.filter-group` and `.browse*` in
`docs/mocks/` (inventory from `usage_inventory.py docs/mocks filter-trigger "a|button"`,
`… result-count "p|span|div"`, plus grep), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studios/*`, `pages/spots/*` results head, below LG (`.until-lg` on the host); behind `dialogs/*-filters/*` and `notifications/public-toast/*` | `button[st-filter-trigger]`, `count` 0 to 3, `aria-expanded` from the consumer | "Filters"; "Filters, 2 active"; "Filters, 3 active" (studios no-results) | default; with count; open while the sheet shows (mocks draw it as a link, D-2) | canvas |
| `pages/studios/*` results head | `st-result-count`, `srSuffix` when sorted | "7 studios"; "5 studios" + ", sorted by all-in cost"; "0 studios"; "Loading studios…" | default, changed (announced), loading | canvas |
| `pages/spots/*` results head | `st-result-count` | "5 spots", "2 spots", "0 spots", "Loading spots…" | as above | canvas |
| `pages/admin-studios/*`, `admin-spots/*`, `admin-guides/*` above the table | `st-result-count` with `.visually-hidden` on the host | "9 studios", "No studios match"; "6 spots", "No spots match"; "4 guides", "No guides match" | default, changed by the search (announced, not shown) | — |
| Studios column (LG+) and sheet | composition: cost range (two `st-text-field`), `st-checkbox-group` "Neighbourhood", `st-checkbox-group` "Space and light" with projected `st-select` "Minimum usable space", `st-checkbox-group` "Included gear", `st-radio-group` "Parking"; sheet adds `st-select` "Sort by" first | legends and options from the [cast](../../mocks/README.md) | none selected; some selected (Natural light, Maximum 150); invalid range (Minimum 200, Maximum 100) | canvas (column); `--color-bg-surface-raised` (sheet) |
| Spots column (LG+) and sheet | composition: `st-checkbox-group` "Type", `st-checkbox-group` "Use case", `st-radio-group` "Permit" | Park, Architecture, Waterfront, Indoor public; Engagement … Video; Any, No permit needed for the selected use | none selected; Family + No permit needed | as above |
| `pages/studios/no-results`, `pages/spots/no-results` | composition: chips + `st-empty-state` "No studios match these filters" with "Clear filters" | "Try removing a filter, or clear them all to see all 7 studios." | no results | canvas |

Every row is buildable with the API below; two additions to ICD-002 are
needed and specified under *Implementation notes* (D-1, D-5).

## Anatomy

### `button[st-filter-trigger]`

1. **Container** — the host, a native `<button>` (or `<a>`) with
   `.filter-trigger`: 44 px pill (`--control-height-md`), hairline
   `--color-border-strong` edge, `--color-bg-surface` fill, `--space-2` gap,
   `--space-4` side padding.
2. **Icon** — `st-icon` `filters` (`svg.icon`, `aria-hidden="true"`), added by
   the component before the slot.
3. **Label** — the projected text, "Filters".
4. **Count bubble** — `span.filter-trigger__count`, only when `count` > 0: a
   22 px (1.375rem) `--color-action` circle that grows sideways for two digits,
   holding the visible number (`aria-hidden="true"`) and a visually hidden
   ", 2 active" that joins the accessible name (D-1).

Host: an attribute selector on the native element, like `button[st-button]`;
the classes and `aria-haspopup="dialog"` go on the host through host bindings,
and the component adds no wrapper.

### `st-result-count`

1. **Count** — the host carries `.result-count`, `role="status"` and
   `aria-live="polite"`: `--text-body-sm` in `--color-fg-muted`. Its text is `text`.
2. **Hidden suffix (optional)** — `<span class="visually-hidden">` with
   `srSuffix` (", sorted by all-in cost"), read and announced with the count (D-5).

### Page composition (application)

1. **Browse grid** — `.browse` with `.browse__title` (the `h1` and subtitle),
   `.browse__aside` (the filter column, `aside` named by its `h2`, not displayed
   below 62rem), `.browse__results` (`section` named by a visually hidden
   `h2` "Results", `tabindex="-1"`), `.browse__head` (count row, then chips).
2. **Filter form** — one reactive `<form class="stack stack--lg">` per page,
   rendered by the application's filter component in the column and in the
   sheet: the groups, then (column only) "Apply filters".
3. **Filter groups** — one `<fieldset>` per question with a `<legend>`, rendered
   by the controls with `appearance="filter"`, or by the application for the
   cost range (D-9).
4. **Results head** — the result count, then (below LG) the trigger and (studios)
   the inline "Sort by" select, then the active-filter chips.

## API

### `button[st-filter-trigger]`, `a[st-filter-trigger]`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `count` | `number` | `0` | no | `numberAttribute`. Above 0, renders the count bubble with the number and the hidden text from `st.filterTrigger.count` (", {$count} active"), so the name becomes "Filters, 2 active". 0 or less renders no bubble. |

Native attributes stay on the host and belong to the consumer: `type`
(`button`), `aria-expanded` (`true` while the sheet is open, else `false`; D-3),
`aria-controls`, `disabled`, and on the anchor `href`/`routerLink`. The
component adds `class="filter-trigger"` and `aria-haspopup="dialog"`; the
consumer adds `.until-lg` to hide it from 62rem.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The consumer listens to the native `click` and opens the sheet with `DialogService` (ICD-API-3). |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text | "Filters", marked `i18n` by the consumer. The icon and the bubble are the component's. |

Library string: `st.filterTrigger.count`, default ", {$count} active"
(ICD-002 1.1.0, additive; D-1).

### `st-result-count`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `text` | `string` | — | yes | The visible count, ICU-pluralised and formatted by the application: "7 studios", "1 studio", "0 spots", "Loading studios…", "No studios match". |
| `srSuffix` | `string \| null` | `null` | no | **ICD change (D-5).** Visually hidden text after `text`, announced with it: ", sorted by all-in cost". `null` or `''` renders no span. |

The host is `role="status"` and `aria-live="polite"` from the first render, so
only changes are announced. The application never also announces the count
through `AnnouncerService` (ICD-A11Y-4).

#### Outputs and slots

None.

### Page composition (application)

The pages own this; it is specified here so the screens are built the same way.

| Part | Built with | Rule |
|---|---|---|
| Filter column (LG+) | `<aside class="browse__aside" aria-labelledby="filters-title">`, `h2#filters-title` "Filter studios" / "Filter spots", the filter form, `button[st-button] type="submit"` "Apply filters" | Choices apply as they change (D-11); "Apply filters" applies the form as typed, the commit for the number fields. |
| Filters sheet (below LG) | `DialogService.open(…, { kind: 'sheet' })` with the application's sheet component ([sheet.md](sheet.md)): title "Filters", the intro as `description`, the same groups, studios first with `st-select` "Sort by"; footer `button[st-button] type="reset"` "Clear all" and `variant="primary" type="submit"` "Show 7 studios" | Nothing applies until the primary; Close and Escape discard (D-12). |
| Cost range | `<fieldset class="cost-range">` + `<legend>` "All-in cost for 2 hours" + two `st-text-field` (`type="number"`, `inputmode="decimal"`, `min="0"`, `step="10"`, `prefix="$"`, labels "Minimum" / "Maximum", `inputId` `cost-min` / `cost-max`) side by side | The application's own fieldset (D-9). The range error goes on "Maximum". |
| Neighbourhood, Included gear, Type, Use case | `st-checkbox-group appearance="filter"` | Options in the order the design system lists ("Bloordale" to "Riverside"). |
| Space and light | `st-checkbox-group appearance="filter"` (Natural light with description "At least medium at some time of day", Cyc wall) with `st-select` "Minimum usable space" projected into it | As [checkbox.md](checkbox.md) D-2 and D-3 define. |
| Parking, Permit | `st-radio-group appearance="filter"`, "Any" (`''`) first | |
| Results head | `.browse__head` > `.cluster.cluster--between` (`st-result-count`; `.cluster` with the trigger and, for studios, `st-select inline` "Sort by"), then `st-active-filters` | Count first, so it is read before the controls. |
| No results | `st-empty-state` (`icon="search"`, title "No studios match these filters", text with the total) with `button[st-button]` "Clear filters" in `actions` | Below the chips, which stay (L2-022.4). |

## Variants and sizes

| Part | Variant | Rule |
|---|---|---|
| Trigger | one look; with or without the count bubble | The bubble appears when `count` > 0. |
| Trigger | button or anchor host | The product uses the button; the anchor renders the same DOM (D-2). |
| Result count | visible or visually hidden | Hidden with the global `.visually-hidden` utility on the host in the admin lists (D-8). |
| Filter set | column (LG+) or sheet (below LG) | Same groups and order; the sheet adds Sort first and has its own footer. |

| Part | Below 48rem | 48rem and up | Token |
|---|---|---|---|
| Trigger height | 44 px | 44 px (shown until 62rem) | `--control-height-md` |
| Count bubble | 22 px circle, grows sideways for two digits | same | `--text-caption`, `--font-weight-semibold` |
| Option row | 44 px | at least 24 px | `--target-comfortable` / `--target-min` ([checkbox.md](checkbox.md)) |
| Filter column (62rem+) | — | 15rem, 48 px from the results | `--layout-sidebar-width`, `--space-12` |
| Gap between groups | 32 px in the sheet and the column | same | `--space-8` (`.stack--lg`) |

## States

### Trigger

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Surface fill, `--color-border-strong` edge, filters icon, "Filters" | "Filters, button, has popup dialog, collapsed" |
| With count | `count` > 0 | Ink bubble with the number after the label | "Filters, 2 active, button, …" |
| Hover | `:hover` | Fill `--color-bg-subtle` | — |
| Focus | `:focus-visible` | Shared 2 px `--color-focus-ring`, offset `--focus-ring-offset` | Focus on the trigger |
| Active | `:active` | Fill `--color-bg-subtle-hover` | — |
| Open | consumer `aria-expanded="true"` | Edge and an inset hairline in `--color-fg-default` (a 2 px ink edge); covered by the sheet below 48rem, beside the side sheet from 48rem | "expanded" |
| Disabled | native `disabled` | 50 % opacity, `not-allowed` | Removed from the tab order. No screen uses it: the trigger stays usable while the list loads. |

### Result count

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | first render with `text` | "7 studios" | Not announced on page load |
| Changed | `text` or `srSuffix` changes | New text | Announced politely once: "5 studios, sorted by all-in cost" |
| Loading | the application sets "Loading studios…" while the list reloads | Text replaced | Announced politely; the results region carries `aria-busy="true"` (L2-026.1) |
| Visually hidden | `.visually-hidden` on the host | Not shown | Still announced |

### Filter set (composition)

| State | What the visitor sees | Rule |
|---|---|---|
| None selected | Column: nothing checked, Parking and Permit on "Any", fields empty. Head: "7 studios", "Filters" with no bubble, no chip row. Sheet primary "Show 7 studios". | `countActiveFilters` is 0. |
| Some selected | Checked controls; "Filters, 2 active"; chips "Up to $150.00", "Natural light"; "5 studios" + ", sorted by all-in cost" when sorted; sheet primary "Show 5 studios" | The bubble count equals the number of chips (L2-022.6). |
| Invalid range | Minimum 200, Maximum 100: "The minimum must be lower than the maximum" under Maximum (`aria-invalid`), focus moves to Maximum; sheet primary reads "Show studios", natively disabled, `aria-describedby="cost-max-error"`; in the column the range is not applied until fixed (D-15) | A URL with `costMin` above `costMax` is not an error: the range is unset and the fields are empty (L2-025.4). |
| No results | "0 studios", chips stay with "Clear all", empty state "No studios match these filters" with "Clear filters" | Chips stay so one filter can be removed at a time (L2-022.4). |
| Cleared | After "Clear all" or "Clear filters": the URL keeps only `sort`, the chip row and the bubble go, "7 studios" is announced, focus moves to the results heading (D-13) | Sheet "Clear all" only resets the sheet's choices until "Show 7 studios" (D-14). |
| Loading | Count "Loading studios…", skeleton cards, the results section `aria-busy="true"`; the trigger, sort, column and chips stay usable | The application's (L2-026). |
| Error | "We couldn't load the studios" empty state; filters kept | The application's (L2-026.2). |

## Markup

```html
<!-- rendered: trigger, no active filters (below LG) -->
<button class="filter-trigger until-lg" type="button" aria-haspopup="dialog" aria-expanded="false">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>Filters
</button>
```

```html
<!-- rendered: trigger with two active filters (D-1) -->
<button class="filter-trigger until-lg" type="button" aria-haspopup="dialog" aria-expanded="false">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg>Filters
  <span class="filter-trigger__count"><span aria-hidden="true">2</span><span class="visually-hidden">, 2 active</span></span>
</button>
```

```html
<!-- rendered: result counts -->
<st-result-count class="result-count" role="status" aria-live="polite">5 studios<span class="visually-hidden">, sorted by all-in cost</span></st-result-count>
<st-result-count class="result-count visually-hidden" role="status" aria-live="polite">9 studios</st-result-count>
```

The mocks draw the trigger as `<a class="filter-trigger" href="…">` with no
`aria-expanded` and the count as `<p class="result-count">`; the product renders
a button (D-2) and the class and role on the `st-result-count` host (D-6). Page
objects find the trigger by role and name ("Filters, 2 active") and the count
by `role="status"` with `.result-count`.

```html
<!-- consumer: studio list results head -->
<div class="browse__head">
  <div class="cluster cluster--between">
    <st-result-count [text]="countText()" [srSuffix]="sortSuffix()" />
    <div class="cluster">
      <button st-filter-trigger class="until-lg" type="button" [count]="activeCount()"
              [attr.aria-expanded]="filtersOpen()" (click)="openFilters()" i18n>Filters</button>
      <st-select inline i18n-label label="Sort by" name="sort" [options]="sortOptions" [formControl]="sort" />
    </div>
  </div>
  <st-active-filters [filters]="activeFilters()" (filterRemoved)="removeFilter($event)" (cleared)="clearFilters()" />
</div>
```

```html
<!-- consumer: studio filter column (LG+) -->
<aside class="browse__aside" aria-labelledby="filters-title">
  <form class="stack stack--lg" [formGroup]="form" (ngSubmit)="apply()">
    <h2 id="filters-title" i18n>Filter studios</h2>
    <fieldset class="cost-range">
      <legend i18n>All-in cost for 2 hours</legend>
      <div class="cost-range__fields">
        <st-text-field formControlName="costMin" inputId="cost-min" name="costMin" type="number" inputmode="decimal"
                       min="0" step="10" prefix="$" i18n-label label="Minimum" />
        <st-text-field formControlName="costMax" inputId="cost-max" name="costMax" type="number" inputmode="decimal"
                       min="0" step="10" prefix="$" i18n-label label="Maximum" [error]="rangeError()" />
      </div>
    </fieldset>
    <st-checkbox-group formControlName="hoods" name="hood" appearance="filter" i18n-label label="Neighbourhood" [options]="hoodOptions" />
    <st-checkbox-group formControlName="spaceLight" name="spaceLight" appearance="filter" i18n-label label="Space and light" [options]="spaceLightOptions">
      <st-select formControlName="space" name="space" i18n-label label="Minimum usable space" [options]="spaceOptions" />
    </st-checkbox-group>
    <st-checkbox-group formControlName="gear" name="gear" appearance="filter" i18n-label label="Included gear" [options]="gearOptions" />
    <st-radio-group formControlName="parking" name="parking" appearance="filter" i18n-label label="Parking" [options]="parkingOptions" />
    <div class="cluster"><button st-button type="submit" i18n>Apply filters</button></div>
  </form>
</aside>
```

```html
<!-- consumer: filters sheet footer, invalid range -->
<div slot="footer">
  <button st-button type="reset" form="studio-filters" i18n>Clear all</button>
  <button st-button variant="primary" type="submit" form="studio-filters"
          [disabled]="rangeInvalid()" [attr.aria-describedby]="rangeInvalid() ? 'cost-max-error' : null">{{ showLabel() }}</button>
</div>
```

`showLabel()` is "Show 5 studios" (ICU plural, formatted by the application), or
"Show studios" while the range is invalid. `cost-max-error` is the error ID
`st-text-field` derives from `inputId` ([form-field.md](form-field.md)).

## Design

### Trigger

- `inline-flex`, items centred, `gap: --space-2`, `min-height: --control-height-md`,
  `padding: 0 --space-4`, `--border-width-hairline` solid `--color-border-strong`,
  `--radius-full`, `--color-bg-surface` fill, `--color-fg-default` label,
  `--text-label` at `--font-size-md`, `position: relative`.
- Count bubble: `inline-grid`, centred, `min-width` and `height` 1.375rem,
  `padding-inline: --space-1`, `--radius-full`, `--color-action` fill,
  `--color-fg-on-action` text, `--text-caption` at `--font-weight-semibold`.
- Open: `border-color: --color-fg-default` plus an inset `--border-width-hairline`
  shadow in `--color-fg-default`.
- Motion: background over `--duration-fast` with `--ease-standard`.

### Result count

- `--text-body-sm` in `--color-fg-muted`; `display: block`; no margin of its own
  (the application's `.cluster` places it).

### Composition

- `.browse` (application feature CSS, ported from the design system): one column
  below 62rem; from 62rem `--layout-sidebar-width` column plus results,
  `--space-12` apart, `--space-16` above; `.browse__head` stacks the count row
  and the chips `--space-4` apart with `--space-10` below.
- The column heading is an `h2` in `--text-h4` and the cost range legend
  `--text-label` in `--color-fg-subtle` with `--space-2` below, the minimum and
  maximum side by side in two equal columns `--space-4` apart at every width:
  application component CSS on the application's own elements (D-9, D-10).
- Groups are `--space-8` apart (`.stack--lg`).

There are no component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Trigger fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Trigger edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Trigger label, open edge | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Trigger hover | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Trigger active | `--color-bg-subtle-hover` | `--palette-stone-200` | `--palette-stone-700` |
| Count bubble | `--color-action` | `--palette-stone-950` | `--palette-stone-100` |
| Count bubble number | `--color-fg-on-action` | `--palette-white` | `--palette-stone-950` |
| Result count | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Group legend, range legend | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Sheet surface | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Trigger label |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Trigger label, hover |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | Trigger label, active |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Trigger edge on the page |
| `--color-fg-default` | `--color-bg-canvas` | 3:1 | Open edge on the page |
| `--color-fg-on-action` | `--color-action` | 4.5:1 | Count bubble |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Result count |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Legends in the column |
| `--color-fg-subtle` | `--color-bg-surface-raised` | 4.5:1 | Legends in the sheet |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the trigger |

Forced colours: the trigger opts out of forced-colour adjustment and keeps a
`CanvasText` edge (`components.css`); the bubble keeps its ink fill.

## Responsive behaviour

- **XS and SM (below 48rem):** no filter column. The results head shows the
  count, the trigger and (studios) Sort; the trigger opens a full-screen sheet
  with Sort and every group and a footer with "Clear all" and "Show 7 studios"
  above the bottom safe area (L2-022.5, L2-065.1). Trigger, option rows, chips
  and remove buttons are 44 px.
- **MD (48rem to 62rem):** the same trigger; the sheet is a 28rem side sheet
  over a backdrop, and the open trigger shows its ink edge beside it.
- **LG and up (62rem+):** `.browse` becomes two columns, the 15rem filter column
  (its heading above it) and the results, 48 px apart; the trigger is hidden
  (`.until-lg`). An open sheet closes when the viewport crosses 62rem
  ([sheet.md](sheet.md) D-4).
- The count row wraps (`.cluster`), chips wrap, a long option such as "No permit
  needed for the selected use" wraps under its box, and nothing scrolls sideways
  at 320 px. At 200 % zoom every control stays reachable.

## Accessibility

### Role and pattern

- The trigger is a native `<button aria-haspopup="dialog" aria-expanded>` that
  opens an APG modal dialog (the sheet).
- The result count is `role="status"` with polite announcements.
- The filters are a form of `<fieldset>` groups with `<legend>`s, so each option
  is read with its question ("Neighbourhood, Junction, checkbox, not checked").
  The column is an `<aside>` named by its heading ("Filter studios"); the results
  are a `section` named "Results".

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the column's groups and Apply filters, then the results head: trigger, Sort, each chip's remove button, Clear all. Inside the sheet focus stays in the sheet. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activate the trigger (opens the sheet). Space toggles a checkbox. |
| <kbd>↑</kbd> <kbd>↓</kbd> | Move between radios (Parking, Permit) and select as they move. |
| <kbd>Enter</kbd> in a field | Submits the form: Apply filters in the column, "Show 5 studios" in the sheet. |
| <kbd>Esc</kbd> | Closes the sheet with nothing applied; focus returns to "Filters" (L2-067.3). |

### Focus

- The sheet opens with focus on its first focusable element, Close; in the
  invalid state the application moves focus to "Maximum".
- Close, Esc and "Show 5 studios" return focus to the trigger (`DialogService`).
- Applying a filter in the column keeps focus on the control that changed;
  sorting or filtering never moves focus (the count is announced instead).
- After removing a chip: the next chip's remove button, else the results heading;
  after "Clear all" or "Clear filters": the results heading (D-13,
  [chip.md](chip.md) D-6).
- The trigger shows the shared 2 px ring on `:focus-visible` only.

### Labelling

- The trigger's name includes the count: "Filters, 2 active" (WCAG 2.5.3: the
  visible "Filters" and "2" are in the name).
- The column is named "Filter studios" / "Filter spots"; the sheet "Filters",
  described by its intro.
- "Minimum" and "Maximum" are grouped under "All-in cost for 2 hours"; the range
  error is linked to "Maximum" and to the disabled "Show studios"
  (`aria-describedby`, L2-069.2).
- The count reads the sort too: "5 studios, sorted by all-in cost" (L2-023.3).

### Announcements

`st-result-count` is the only announcer of the count (ICD-002 D-7): it announces
each change of `text` or `srSuffix` once, politely. Every reload passes through
"Loading studios…", so a filter change that ends on the same count is still
announced (D-7). The chips, the trigger and the sheet announce nothing.

### Motion

The trigger's fill changes over `--duration-fast`; the sheet slides in over
`--duration-slow` ([sheet.md](sheet.md)). Reduced motion zeroes both. Result
updates do not animate.

## Content and internationalisation

- Legends name the question in sentence case: "All-in cost for 2 hours",
  "Neighbourhood", "Space and light", "Included gear", "Parking", "Type", "Use
  case", "Permit". Single-choice groups start with "Any".
- Options use the words on the cards: neighbourhoods alphabetical ("Bloordale"
  to "Riverside"), "On-site", "Street", "None".
- The count uses the noun with the right number: "7 studios", "1 studio",
  "0 studios", "5 spots" (ICU plural in the application); the sort suffix is
  ", sorted by all-in cost", ", sorted by overall score", and none for the
  default "Most recent review".
- The sheet's primary previews the outcome: "Show 7 studios", "Show 2 spots";
  "Show studios" while the range is invalid. The column's button is "Apply filters".
- Clearing is "Clear all" in the chip row and the sheet, "Clear filters" in the
  empty state (L2-022.4). Range error: "The minimum must be lower than the maximum".
- Translatable: the trigger's slot, `text`, `srSuffix`, every legend, option and
  button label (the application), and `st.filterTrigger.count` (library).
  Numbers and prices are formatted by the application for `en-CA` (L2-070.3).

## Performance

- Change detection: `OnPush`, signal inputs on both library parts; the
  trigger's host attributes and the bubble text come from `computed`s.
- The trigger imports `IconComponent`; the result count only `@angular/core`.
- Performance scenario: the `components-harness` route `filter/performance`
  renders the studios results head ("7 studios", "Filters", Sort) beside a
  filter column with every studio group from the cast; ticking "Natural light"
  and updating the count to "5 studios, sorted by all-in cost" and the trigger to
  "Filters, 2 active" is held to the L2-071 INP budget.
- Regression rule: a change to the templates, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the count line keeps its height through "Loading
  studios…"; the bubble appears inside the trigger's fixed 44 px height; the
  column and grid are server-rendered from the URL (L2-026.3).

## Acceptance criteria

### Trigger

- **AC-1** Given `<button st-filter-trigger class="until-lg" type="button" [count]="0">Filters</button>` on the studio list at 360 px, when it renders, then it is a native `button.filter-trigger` with `aria-haspopup="dialog"`, a decorative filters icon, no `.filter-trigger__count`, and the accessible name "Filters". (L2-022)
- **AC-2** Given `count` 2 on the filtered studio list, when the trigger renders, then it shows a bubble with "2" and its accessible name is "Filters, 2 active". (L2-022)
- **AC-3** Given the spot list filtered to Family and No permit needed, when the trigger renders, then its name is "Filters, 2 active" and the chip row holds exactly two chips. (L2-024)
- **AC-4** Given the studio list at 360 px, when the visitor activates "Filters", then the trigger has `aria-expanded="true"` and the 2 px ink edge while the sheet is open, and `aria-expanded="false"` after it closes. (L2-069)
- **AC-5** Given the studio list at 1280 px, when it renders, then the trigger is not displayed and the filter column named "Filter studios" is shown beside the results. (L2-022)

### Result count

- **AC-6** Given the unfiltered studio list, when it renders, then a `.result-count` element with `role="status"` and `aria-live="polite"` reads "7 studios" and nothing is announced on load. (L2-069)
- **AC-7** Given the studio list at 1280 px, when the visitor ticks "Natural light" and the list updates, then the count announces "5 studios" once, politely, and `AnnouncerService` announces nothing for that change. (L2-069)
- **AC-8** Given seven studios sorted by most recent review, when the visitor chooses "All-in cost, low to high", then the count shows "7 studios" and announces "7 studios, sorted by all-in cost". (L2-023)
- **AC-9** Given a filter change whose request is still pending, when the count renders, then it reads "Loading studios…", the results section has `aria-busy="true"`, and the trigger and sort stay operable. (L2-026)
- **AC-10** Given the studio admin list with its count visually hidden, when the owner types "junction" in the search, then the count reads "1 studio", is announced politely, and is not visible. (L2-069)

### Composition

- **AC-11** Given the unfiltered studio list at 1280 px, when it renders, then the column holds, in order, the groups "All-in cost for 2 hours", "Neighbourhood", "Space and light", "Included gear" and "Parking", each a `fieldset` named by its legend, with nothing checked, Parking on "Any", and no chip row. (L2-022)
- **AC-12** Given the unfiltered spot list at 1280 px, when it renders, then the column holds "Type", "Use case" and "Permit", and Permit starts on "Any". (L2-024)
- **AC-13** Given the studio list at 1280 px, when the visitor ticks "Natural light", then the URL becomes `/studios?light=medium`, the chip "Natural light" appears, and focus stays on the checkbox. (L2-025)
- **AC-14** Given the filters sheet with Maximum 150 and Natural light chosen, when the visitor activates "Show 5 studios", then the sheet closes, the list shows five studios, focus returns to the trigger, and the trigger reads "Filters, 2 active". (L2-022)
- **AC-15** Given the filters sheet with Minimum 200 and Maximum 100, when the visitor tries to show the results, then "Maximum" has `aria-invalid="true"` and the error "The minimum must be lower than the maximum", focus is on "Maximum", and the primary reads "Show studios", is natively disabled and is described by that error. (L2-069)
- **AC-16** Given the URL `/studios?costMin=200&costMax=100`, when the list loads, then the range is unset, both cost fields are empty, no cost chip shows, no error shows, and seven studios are listed. (L2-025)
- **AC-17** Given `/studios?costMax=120&cyc=yes&parking=on-site`, when the list renders, then the count reads "0 studios", the three chips and "Clear all" stay, and the empty state "No studios match these filters" offers "Clear filters". (L2-022)
- **AC-18** Given that no-results list, when the visitor activates "Clear filters", then the URL has no filter parameters, "7 studios" is announced, the chip row and the trigger's bubble are gone, and focus is on the results heading. (L2-022)
- **AC-19** Given the filtered list after the visitor applied "Natural light", when they press browser Back, then the previous filter set is restored in the column, the chips, the trigger count and the list. (L2-025)
- **AC-20** Given the filters sheet with Neighbourhood "Junction" ticked but not applied, when the visitor presses Escape, then the sheet closes, nothing is applied, and focus returns to "Filters". (L2-067)

### Keyboard and focus

- **AC-21** Given the trigger focused by keyboard, when the ring is measured, then it is 2 px of `--color-focus-ring` with at least 3:1 contrast against the page, and no ring shows when the trigger is clicked with a mouse. (L2-067)

### Theming

- **AC-22** Given the trigger (default, hover, open, with count), the result count and the group legends on the page and in the sheet, when the contrast check runs in light and dark, then every label is at least 4.5:1 and the trigger edge, open edge and focus ring at least 3:1 against what surrounds them. (L2-068)

### Responsive

- **AC-23** Given the studio list and the filters sheet at 360 px, when the trigger, the option rows and the footer buttons are measured, then each is at least 44 px tall. (L2-065)
- **AC-24** Given the filters sheet on a device with a bottom safe-area inset, when it is open, then the footer's bottom padding includes the inset and "Show 7 studios" is not obscured. (L2-065)
- **AC-25** Given the studio list with three filters and the filters sheet at 320 px, when they render, then the count row and chips wrap, "No permit needed for the selected use" wraps under its box in the spot sheet, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-26** Given the filtered studio list at 200 % zoom in a 1280 px viewport, when the visitor uses the trigger, the sheet and the chips, then every control is visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the trigger's fill change and the sheet's slide
take 0 ms, and result updates never animate
([filter.html](../../design-system/components/filter.html), Accessibility › Motion).

### Performance

- **AC-27** Given the `filter/performance` harness route with the studios results head and filter column, when "Natural light" is ticked and the count and trigger update, then interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- **Trigger:** folder `frontend/projects/components/src/lib/filter-trigger/`:
  `filter-trigger.component.ts` (`FilterTriggerComponent`, selector
  `button[st-filter-trigger], a[st-filter-trigger]`), `.html`
  (`<st-icon name="filters" /><ng-content />@if (count() > 0) {…bubble…}`),
  `.css` (port of `.filter-trigger*`, `a.filter-trigger` and the forced-colours
  rule, against `:host`). Host bindings: `class="filter-trigger"`,
  `aria-haspopup="dialog"`.
- **Result count:** folder `frontend/projects/components/src/lib/result-count/`:
  `result-count.component.ts` (`ResultCountComponent`, selector
  `st-result-count`), `.html` (`{{ text() }}@if (srSuffix()) {<span class="visually-hidden">{{ srSuffix() }}</span>}`),
  `.css` (`:host { display: block; font: var(--text-body-sm); color: var(--color-fg-muted); }`).
  Host bindings: `class="result-count"`, `role="status"`, `aria-live="polite"`.
- **ICD change (ICD-002 1.1.0, additive), §12 library string:** ID
  `st.filterTrigger.count`, default `, {$count} active`, override input `—
  (placeholders)`. Rendered in the bubble's visually hidden span when `count` > 0 (D-1).
- **ICD change (ICD-002 1.1.0, additive), §9.5 `ResultCountComponent`:** member
  `srSuffix`, kind input, type `string | null`, default `null`, rule "Visually
  hidden text after `text`, announced with it (", sorted by all-in cost"). `null`
  or empty renders nothing." (D-5)
- **Application** (`features/studios/studio-filters/`, `features/studios/studio-filters-dialog/`,
  `features/spots/spot-filters/`, `features/spots/spot-filters-dialog/`):
  `StudioFiltersComponent` and `SpotFiltersComponent` hold the groups and are
  used in the column and in the sheet; `StudioFiltersDialogComponent` and
  `SpotFiltersDialogComponent` (the detailed design's names;
  [sheet.md](sheet.md) calls them `StudioFiltersDialogComponent` and
  `SpotFiltersDialogComponent`) wrap them in `st-sheet`. The `.browse*` rules are
  ported from `components.css` into the list pages' feature CSS; the `.cost-range`
  legend, the minimum and maximum grid and the column `h2` are the filter
  component's own CSS (D-9, D-10).
- Mock drift the product corrects: the trigger as a link with no
  `aria-expanded`; the column heading's inline style; the range's inline grid
  style; the results head's inline margins (replaced by `.browse__head`); the
  sheet's footer and Close drawn as links.

## Decisions

- **D-1** *The design system splits the trigger's hidden text around the visible number (`<span class="visually-hidden">, </span>2<span class="visually-hidden"> active</span>`), which a translatable library string cannot produce, and ICD-002 has no string for it.* The bubble holds the visible number with `aria-hidden="true"` and one visually hidden span with the new library string `st.filterTrigger.count` (", {$count} active"), additive in ICD-002 1.1.0. The look and the accessible name ("Filters, 2 active") are unchanged; the words reach the catalogue as one placeholder string (ICD-I18N-5).
- **D-2** *ICD-002 allows `a[st-filter-trigger]`, the mocks draw the trigger as a link, and the design system says a link that opens a dialog is announced as navigation.* The product uses `button[st-filter-trigger]` on both lists. The anchor host renders the same DOM for parity with `button[st-button]`, and is not used to open the sheet.
- **D-3** *Who sets `aria-expanded`?* The consumer, from the open state it holds while the `DialogRef` is open, because the trigger cannot know whether the sheet it asked for is open. The design system's markup always carries it, so the consumer writes `false` when closed rather than omitting it.
- **D-4** *What does `count` 0 show?* No bubble and the plain name "Filters" (design system "None selected").
- **D-5** *The mocks and L2-023.3 need the count to announce the sort ("5 studios, sorted by all-in cost") while showing only "5 studios"; ICD-002 gives `st-result-count` only `text`.* A new optional input `srSuffix` (additive, ICD-002 1.1.0) renders the visually hidden suffix inside the live region. Without it the application would need a second announcer, which ICD-002 D-7 forbids.
- **D-6** *The mocks write `<p class="result-count">`; must the component render a `p`?* No: the host carries `.result-count`, `role="status"` and `aria-live="polite"` (ICD-DOM-1), with `display: block`. A paragraph adds nothing to a status region, and page objects find it by role and class.
- **D-7** *A live region announces only when its text changes, so a filter change that leaves the count at "5 studios" would say nothing (L2-069.3).* The application sets the count to "Loading studios…" / "Loading spots…" when a list request starts, as `pages/studios/loading` shows, so every result is a change and is announced.
- **D-8** *The admin lists' counts are visually hidden (`p.result-count.visually-hidden`).* The application puts the global `.visually-hidden` utility on the `st-result-count` host, as it puts `.until-lg` on the trigger; ICD-002 allows visibility utilities on hosts.
- **D-9** *"All-in cost for 2 hours" groups two text fields in a `fieldset.filter-group`, but no ICD-002 component renders a filter group without options ([text-field.md](text-field.md) D-10), and `.filter-group*` is library CSS the application may not write.* The filter component writes a native `<fieldset>` and `<legend>` (foundation-styled) and gives its own elements the legend colour `--color-fg-subtle` and the two-column grid in its encapsulated CSS. The library renders nothing it would duplicate (ICD-DOM-4), so no ICD change is needed; the look matches `.filter-group`.
- **D-10** *The column heading reuses `.filter-group__title` with an inline style in 17 mocks.* It is a plain `h2` styled `--text-h4` by the filter component's CSS; the application never writes the library class.
- **D-11** *When do column choices apply?* As they change, as the design system says for LG: a checkbox, radio or select on change, a number field on commit (change event or Enter), each as one URL navigation (L2-025.2). "Apply filters" stays as the explicit commit the design system keeps; the CRD does not promise a no-script fallback, because the groups' native names do not match the URL keys ([checkbox.md](checkbox.md) D-3) and no L2 requires one.
- **D-12** *What does the sheet apply, and when?* Nothing until the primary: it then closes with the form value and the page navigates once. Close and Escape discard the sheet's choices; there is no confirmation over it (design system: no stacked overlays).
- **D-13** *Where does focus go after "Clear filters" or "Clear all"?* To the results heading ("Results", `tabindex="-1"`), the same target [chip.md](chip.md) D-6 uses after the last chip goes, because the control that had focus has disappeared and the new count is read there. The design-system filter page's alternative (the trigger below LG, the first group from LG) is reported to the owner.
- **D-14** *Does the sheet's "Clear all" apply at once?* No: it resets the sheet's choices (Sort kept) and the preview becomes "Show 7 studios"; the primary applies it. The chip row's "Clear all" applies at once.
- **D-15** *The invalid range is drawn only in the sheet; what happens in the column?* The same error shows under "Maximum" and the range is not applied until it is fixed; the other choices keep applying. A URL with an inverted range is not an error (L2-025.4).
