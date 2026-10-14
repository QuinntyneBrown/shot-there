# Breadcrumb

| Field | Value |
|---|---|
| Selector | `st-breadcrumb` |
| Library path | `frontend/projects/components/src/lib/breadcrumb/` |
| Status | planned |
| Traces to | L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`breadcrumb.html`](../../design-system/components/breadcrumb.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/guide/default`](../../mocks/pages/guide/default.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/new`](../../mocks/pages/studio-editor/new.html), [`pages/studio-editor/loading`](../../mocks/pages/studio-editor/loading.html), [`pages/studio-editor/error`](../../mocks/pages/studio-editor/error.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/new`](../../mocks/pages/spot-editor/new.html), [`pages/spot-editor/loading`](../../mocks/pages/spot-editor/loading.html), [`pages/spot-editor/error`](../../mocks/pages/spot-editor/error.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html), [`pages/guide-editor/new`](../../mocks/pages/guide-editor/new.html), [`pages/guide-editor/loading`](../../mocks/pages/guide-editor/loading.html), [`pages/guide-editor/error`](../../mocks/pages/guide-editor/error.html), [`notifications/admin-toast/success`](../../mocks/notifications/admin-toast/success.html) |
| Rendering | [`breadcrumb.html`](breadcrumb.html) |

## Purpose and scope

The breadcrumb is a one-line trail above the page title that says where a
detail page sits and links back to its list: "Studios / The Junction Loft" on a
review, "Studios / Corktown Garage Studio" in the studio editor. ShotThere's
trails are two levels deep, a section list and the page itself; the wordmark
already goes home, so a trail never starts with "Home". It is the first thing
in `<main>`, so after "Skip to content" the parent link is the first stop in the
page body.

It is not a back button: it always names the same parent, wherever the visitor
came from. Top-level pages (lists, home, map, compare) have no breadcrumb; the
[site header](site-header.md) marks them with `aria-current`.

Out of scope:

- The page title below it and its loading skeleton: the page header
  ([`st-page-header`](container.md)) or the review head (application).
- Marking the region busy and announcing "Loading studio…": the application
  (`aria-busy` on `<main>`, a hidden status).
- The error message and the "Back to studios" action when a record cannot be
  opened: [`st-empty-state`](empty-state.md).
- Building paths and choosing the parent: the application (`APP_PATHS`).

## Usage

Every `.breadcrumb` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks breadcrumb "ol"`): 44 uses on 7 screens.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/*` (default, stale, minimal, media-failed, in-compare, playing) | public, two items | "Studios" → `/studios`, "The Junction Loft" (also "Bloordale Sun Studio" on minimal, "Ossington Blackbox" on stale) | current | canvas |
| `pages/spot/*` (default, map-failed, no-rain-backup, no-video, stale-permit) | public, two items | "Spots" → `/spots`, "Evergreen Brick Works" ("Distillery District", "Trinity Bellwoods Park") | current | canvas |
| `pages/guide/default` | public, two items; longest name | "Guides" → `/guides`, "Best studios under $120 for 2 hours" | current; wraps at 320 px | canvas |
| `pages/studio-editor/*`, `pages/spot-editor/*`, `pages/guide-editor/*` (default, invalid, published, submitting, success, uploading, upload-failed, price-changed) | admin, two items | "Studios" → `/admin/studios`, "Corktown Garage Studio"; "Spots", "Scarborough Bluffs"; "Guides", "Best for headshots" | current | canvas |
| `pages/studio-editor/new`, `spot-editor/new`, `guide-editor/new` | admin, unsaved record | "New studio", "New outdoor spot", "New guide" | current | canvas |
| `pages/studio-editor/loading`, `spot-editor/loading`, `guide-editor/loading` | `loading` | parent link, then a text skeleton with hidden "Loading" | loading | canvas, inside `main[aria-busy="true"]` |
| `pages/studio-editor/error`, `spot-editor/error`, `guide-editor/error` | `current` false, one item | "Studios" / "Spots" / "Guides" link only | no current crumb | canvas, above the error state |
| `notifications/admin-toast/*` | admin, two items, behind the toast | as the editor | current | canvas |
| Design system *Collapsed on phones* (no mock yet) | `collapse` | "‹ Guides" below 48rem, full trail from 48rem | collapsed | canvas |

Every row is buildable with the API below: the trail is data, the loading,
error and collapsed forms are boolean inputs.

## Anatomy

1. **Landmark** — `nav` named by `label` ("Breadcrumb"), `margin-top:
   var(--space-4)`.
2. **Trail** — `ol.breadcrumb` (plus `.breadcrumb--collapse` when `collapse`):
   wrapping flex row, `--text-body-sm`, `--color-fg-muted`.
3. **Crumb** — `li`, a centred flex row so a wrapping name keeps its separator
   beside it.
4. **Parent link** — `a` (RouterLink): muted, no underline until hover, at least
   `--target-min` tall (`--target-comfortable` below 48rem).
5. **Separator** — CSS `::before` "/" on every crumb but the first, in
   `--color-fg-subtle`, with empty alternative text. Not a DOM node.
6. **Current page** — the last `li` with `aria-current="page"`: plain text in
   `--color-fg-default` at `--font-weight-medium`.
7. **Loading placeholder** — inside the current crumb: an aria-hidden
   [`st-skeleton`](skeleton.md) (`shape` `text`, `--space-32` wide) followed by
   the item's label in `span.visually-hidden`.

Host: `st-breadcrumb` is `display: block` with no box styles; the `nav` inside
is the landmark.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `items` | `readonly BreadcrumbItem[]` | — | yes | One `li` each, in order, tracked by index. An item with `link` renders `<a [routerLink]>`, except the current one; an item without `link` renders plain text. When `current` is true the last item renders with `aria-current="page"` and no link. An empty array renders nothing (D-8). |
| `label` | `string` | §12 `st.breadcrumb.label` ("Breadcrumb") | no | The `nav`'s `aria-label`. |
| `current` | `boolean` | `true` | no | When `false`, no item is current: every item with a `link` is a link (the editor error state, D-1). ICD change. |
| `loading` | `boolean` | `false` | no | When `true`, the last item shows an aria-hidden text skeleton and its label only as visually hidden text (D-2). ICD change. |
| `collapse` | `boolean` | `false` | no | Adds `.breadcrumb--collapse`: below 48rem only the second-last crumb shows, prefixed with "‹" (D-3). ICD change. |

`current`, `loading` and `collapse` use `booleanAttribute`. Labels are product
copy (`BreadcrumbItem.label` through `$localize`) or data (record names).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The parent is a link; the router handles it. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Everything comes from `items`. |

The breadcrumb's only library string is `st.breadcrumb.label` (ICD §12).

## Variants and sizes

| Variant | Configuration | Use for |
|---|---|---|
| Public review | `[{ label: 'Studios', link: '/studios' }, { label: 'The Junction Loft' }]` | Studio, spot and guide pages. |
| Admin editor | `[{ label: 'Studios', link: '/admin/studios' }, { label: 'Corktown Garage Studio' }]` | Studio, spot and guide editors. |
| New record | last item "New studio", "New outdoor spot" or "New guide" | Unsaved editors. |
| Loading | `loading`, last item `{ label: 'Loading' }` | Editors while the record loads. |
| Parent only | `current` `false`, one item with a link | "We couldn't open this studio". |
| Collapsed | `collapse` | A long current name repeated by the title right below. |

One size: `--text-body-sm`; links at least `--target-min` (24 px), growing to
`--target-comfortable` (44 px) below 48rem.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Parent link `--color-fg-muted`, no underline | "Breadcrumb navigation, list, 2 items" |
| Hover | `:hover` on the parent link | `--color-fg-default`, underline | — |
| Focus | `:focus-visible` | Shared ring: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset` | Focus on the link |
| Active | `:active` | Same as hover | — |
| Current | last `li` with `aria-current="page"` | `--color-fg-default`, `--font-weight-medium`; no hover, focus or active of its own | "current page" |
| Loading | `loading` | Text skeleton `--space-32` wide in the current crumb; shimmer | The crumb's name is its hidden label, "Loading" |
| Parent only | `current` false | One crumb, a link; no separator | "list, 1 item"; nothing current |
| Collapsed, below 48rem | `collapse` and viewport | Only the parent, prefixed "‹" | Only the parent is in the tree; the "‹" is not read |
| Collapsed, from 48rem | `collapse` and viewport | Full trail | Full trail |
| Disabled | — | Never: a crumb is a link or plain text | — |

## Markup

```html
<!-- rendered: public review -->
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/studios">Studios</a></li>
    <li aria-current="page">The Junction Loft</li>
  </ol>
</nav>
```

```html
<!-- rendered: loading -->
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/admin/spots">Spots</a></li>
    <li aria-current="page"><st-skeleton class="skeleton skeleton--text" aria-hidden="true"></st-skeleton><span class="visually-hidden">Loading</span></li>
  </ol>
</nav>
```

```html
<!-- rendered: record could not be opened (current false) -->
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/admin/studios">Studios</a></li>
  </ol>
</nav>
```

```html
<!-- rendered: collapsed -->
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb breadcrumb--collapse">
    <li><a href="/guides">Guides</a></li>
    <li aria-current="page">Best studios under $120 for 2 hours</li>
  </ol>
</nav>
```

The skeleton's host element name is not part of the contract; its classes and
`aria-hidden` are (ICD-DOM-3).

```html
<!-- consumer: studio editor (view model beside the page builds the items) -->
<st-breadcrumb [items]="crumbs()" [loading]="loading()" [current]="!loadFailed()" />
```

```ts
// studio-editor-breadcrumb.ts (application)
crumbs = computed<BreadcrumbItem[]>(() => this.loadFailed()
  ? [{ label: $localize`Studios`, link: APP_PATHS.adminStudios }]
  : [{ label: $localize`Studios`, link: APP_PATHS.adminStudios },
     { label: this.loading() ? $localize`Loading` : this.studio()?.name ?? $localize`New studio` }]);
```

## Design

- `nav`: `margin-top: var(--space-4)` (D-5).
- Trail: `display: flex`, `flex-wrap: wrap`, `align-items: center`, `gap: var(--space-2)`; no list style, padding or margin; `--text-body-sm`, `--color-fg-muted`.
- Crumb: `display: flex`, `align-items: center`, `min-width: 0`.
- Separator: `li + li::before { content: "/" / ""; margin-right: var(--space-2); color: var(--color-fg-subtle); }`.
- Parent link: `--color-fg-muted`, no underline; `inline-flex`, `min-height: var(--target-min)`, `--target-comfortable` below 48rem; hover `--color-fg-default` with underline.
- Current: `--color-fg-default`, `--font-weight-medium`.
- Loading skeleton: `inline-size: var(--space-32)`, `margin-block: 0` (D-2).
- Collapsed below 48rem: every crumb but the second-last hidden; that crumb's `::before` is `"‹" / ""` with `margin-right: var(--space-1)`.
- Motion: none of its own; the skeleton shimmer is [skeleton](skeleton.md)'s.

It declares no component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Trail and parent link | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Hovered link, current page | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Separator | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Page behind | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Parent link |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Current page, hovered link |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Separator (decorative, held to text contrast anyway) |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

Forced colours: the link takes `LinkText`, the separators `CanvasText`, and the
current page stays plain text.

## Responsive behaviour

- The trail sits in the page container and takes its margin; it never scrolls
  sideways.
- The default trail wraps: each crumb is its own flex row, so "Best studios
  under $120 for 2 hours" moves to a second line with its separator beside it at 320 px. Names
  never truncate.
- Below 48rem the parent link grows to 44 px tall (L2-065); from 48rem it is
  24 px, the WCAG 2.5.8 minimum, and it is the trail's only target.
- With `collapse`, below 48rem only "‹ Guides" shows; from 48rem the full
  trail returns.
- At 200 % zoom everything stays visible; the trail wraps or collapses as on a
  phone.

## Accessibility

### Role and pattern

[APG Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/): a
`nav` landmark named "Breadcrumb" around an `ol`; the last item carries
`aria-current="page"` and is not a link. Separators and the collapsed "‹" are
generated content with empty alternative text, so they are not read.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves to and from the parent link; the current page is text and is skipped. |
| <kbd>Enter</kbd> | Follows the parent link. |

### Focus

The shared 2 px `--color-focus-ring` on `:focus-visible`. The component never
moves focus.

### Labelling

- `aria-label` is exactly the `label` ("Breadcrumb"); the landmark adds
  "navigation".
- Link text is the section name ("Studios"), meaningful on its own.
- While loading, the current crumb's only text is the hidden "Loading" beside
  the aria-hidden skeleton.

### Announcements

None. The application announces loading and errors for the page.

### Motion

None of its own; the skeleton's shimmer stops under `prefers-reduced-motion`
([breadcrumb.html](../../design-system/components/breadcrumb.html), Accessibility › Motion).

## Content and internationalisation

- The parent is the section name as the header says it: "Studios", "Spots",
  "Guides"; in the admin the same words lead to the admin lists.
- The current crumb is the record's name exactly as the page title shows it;
  an unsaved record is "New studio", "New outdoor spot" or "New guide".
- Never "Home", never "Error" or "Not found" in the trail; when the record
  cannot be opened, the trail keeps only the way back.
- Never truncate with an ellipsis; wrap, or collapse on phones.
- Section names, "New studio" and "Loading" are product copy the application
  marks; record names are data. "Breadcrumb" is the library string
  `st.breadcrumb.label`. Longer translations wrap.

## Performance

- Change detection: `OnPush`, signal inputs; the index of the current item is a
  `computed` of `items`, `current` and `loading`; crumbs render with `@for`
  tracked by index.
- Performance scenario: the `components-harness` route `breadcrumb/performance`
  renders the spot editor's trail in its loading form ("Spots" and the
  skeleton) and swaps it for "Spots / Scarborough Bluffs"; the swap must stay
  within the L2-071 CLS budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the skeleton is one text line tall, so the trail keeps its
  height when the name arrives (a name that wraps at 320 px is the only change,
  and it happens below the parent).
- Weight: imports `@angular/core`, `@angular/router` (`RouterLink`),
  `@angular/localize` and the library's skeleton.

## Acceptance criteria

### Rendering

- **AC-1** Given `items` "Studios" → `/studios` and "The Junction Loft", when the breadcrumb renders, then a navigation landmark named "Breadcrumb" holds `ol.breadcrumb` with a link "Studios" to `/studios` and a last `li` with `aria-current="page"` reading "The Junction Loft" that contains no link. (L2-069)
- **AC-2** Given the same trail, when a screen reader reads it, then it hears "Studios" and "The Junction Loft" as two list items, and the "/" separator is not part of any accessible name or text alternative. (L2-069)
- **AC-3** Given the unsaved studio editor with `items` "Studios" → `/admin/studios` and "New studio", when it renders, then "New studio" is the current page and "Studios" links to `/admin/studios`. (L2-069)
- **AC-4** Given the spot editor while loading, with `loading` true and `items` "Spots" → `/admin/spots` and "Loading", when it renders, then the last `li` has `aria-current="page"` and contains an aria-hidden `.skeleton.skeleton--text` 8rem wide followed by "Loading" in `.visually-hidden`, and the "Spots" link works. (L2-069)
- **AC-5** Given the studio editor's error state with `current` false and one item "Studios" → `/admin/studios`, when it renders, then the trail has one `li` holding a link "Studios", and no element in the trail has `aria-current`. (L2-069)
- **AC-6** Given `items` whose first item has no `link`, when the breadcrumb renders, then that item is plain text and not focusable. (L2-069)

### Keyboard and focus

- **AC-7** Given The Junction Loft's page, when a keyboard user activates "Skip to content" and presses Tab, then focus is on the breadcrumb's "Studios", and the next Tab skips "The Junction Loft". (L2-067)
- **AC-8** Given focus on "Studios" in the breadcrumb, when it is focused with the keyboard, then a 2 px `--color-focus-ring` outline with at least 3:1 contrast against the canvas is visible. (L2-067)

### Screen readers

- **AC-9** Given the studio page, the studio editor in its default, loading and error states, when axe-core scans them in light and dark at 360 px and 1280 px, then no violation is reported in the breadcrumb. (L2-069)

### Theming

- **AC-10** Given the trail "Spots / Evergreen Brick Works" in the light and the dark theme, when the contrast check runs, then "Spots" is at least 4.5:1 and "Evergreen Brick Works" at least 4.5:1 against `--color-bg-canvas`. (L2-068)

### Responsive

- **AC-11** Given the studio page at 360 px, when the "Studios" link is measured, then it is at least 44 CSS px tall. (L2-065)
- **AC-12** Given the studio editor at 1280 px, when the "Studios" link is measured, then it is at least 24 CSS px tall. (L2-065)
- **AC-13** Given the guide page at 320 px with "Guides / Best studios under $120 for 2 hours", when it renders, then the current crumb moves to a second line in full, without an ellipsis, with the "/" separator beside the name, and `document.documentElement.scrollWidth` equals 320. (L2-064)
- **AC-14** Given the same trail with `collapse` true, when it renders at 360 px, then only the "Guides" link is displayed, preceded by "‹", and at 768 px the full trail "Guides / Best studios under $120 for 2 hours" is displayed. (L2-064)
- **AC-15** Given the collapsed trail at 360 px, when the accessibility tree is inspected, then "‹" is not exposed and the navigation contains the link "Guides". (L2-069)
- **AC-16** Given the guide page in a 1280 px window at 200 % zoom, when it renders, then the whole trail is visible and there is no horizontal page scroll. (L2-066)

### Content

- **AC-17** Given no `label`, when the breadcrumb renders, then the `nav`'s accessible name is the library string `st.breadcrumb.label` "Breadcrumb", and with `label` "Fil d'Ariane" it is "Fil d'Ariane". (L2-070)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the breadcrumb
animates nothing; the loading skeleton's shimmer stops under
`prefers-reduced-motion: reduce`
([breadcrumb.html](../../design-system/components/breadcrumb.html), Accessibility › Motion).

### Performance

- **AC-18** Given the `breadcrumb/performance` harness route at 1280 px, when the loading trail "Spots" plus skeleton is replaced by "Spots / Scarborough Bluffs", then the cumulative layout shift caused by the breadcrumb is 0 and stays within the 0.1 budget. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/breadcrumb/`:
  `breadcrumb.component.ts` (`BreadcrumbComponent`, selector `st-breadcrumb`),
  `.html`, `.css` (port of `.breadcrumb*` from `components.css`, with
  `nav:has(> .breadcrumb)` written as the component's own `nav` rule, minus the
  `[data-state]` documentation selectors, plus the skeleton sizing of D-2).
  `:host { display: block; }`.
- Composes `st-skeleton` (`shape="text"`) for the loading crumb.
- The phone target rule `.breadcrumb a { min-height: var(--target-comfortable) }`
  below 48rem moves from the shared phone-targets block into this component.
- ICD change (ICD-002 1.1.0, additive): `BreadcrumbComponent` gains `current`
  (input, `boolean`, default `true`, D-1), `loading` (input, `boolean`, default
  `false`, D-2) and `collapse` (input, `boolean`, default `false`, D-3).
- Mock drift the component corrects: every mock spaces the `nav` with an inline
  `margin-top`; `studio-editor/loading` puts the hidden "Loading" before the
  skeleton and restyles the skeleton inline (D-6).

## Decisions

- **D-1** *ICD-002 renders the last item as the current page, but the editors' error state keeps only the way back ("Studios" as a link) with nothing current.* A new input `current` (default `true`, ICD-002 1.1.0, additive). With `current` false no item is current, so the single parent stays a link, as the design system and all three error mocks show. Changing the existing rule to "an item with a link is never current" would change the behaviour of an existing input, so it is not done.
- **D-2** *How does the loading crumb render, when a `BreadcrumbItem` label is only a string?* A new input `loading` (default `false`, ICD-002 1.1.0, additive). The last item's label becomes visually hidden text after an aria-hidden `st-skeleton` of shape `text`; the application passes the label "Loading" (translated), so no new library string is needed. The skeleton is `--space-32` (8rem) wide with no block margin, as the spot and guide editor mocks draw it; the design system has no rule for it, so the rendering applies it as a specimen.
- **D-3** *The design system defines `.breadcrumb--collapse` but ICD-002 has no way to set it.* A new input `collapse` (default `false`, ICD-002 1.1.0, additive). No mock sets it yet; the design system names the guide page as the first candidate, and the application decides where to use it.
- **D-4** *How are separators kept out of the accessible name?* CSS generated content with empty alternative text (`content: "/" / ""`), never a DOM node or an `aria-hidden` span, as the design system specifies.
- **D-5** *Who spaces the trail from the header?* The component: its `nav` has `margin-top: var(--space-4)`, replacing the mocks' inline style and the design system's `nav:has(> .breadcrumb)` rule.
- **D-6** *The loading mocks order the skeleton and the hidden text two ways.* Skeleton first, then the hidden label, as the design system chose; the inline restyling in `studio-editor/loading` is dropped.
- **D-7** *What if a non-last item has no link?* It renders as plain text in its `li` with no `aria-current`. ShotThere's trails always link the parent, so this only guards against bad data.
- **D-8** *What if `items` is empty?* Nothing is rendered, not even the `nav`, so there is never an empty landmark.
