# Button

| Field | Value |
|---|---|
| Selector | `button[st-button]`, `a[st-button]` |
| Library path | `frontend/projects/components/src/lib/button/` |
| Status | planned |
| Traces to | L2-030, L2-041, L2-049, L2-058, L2-061, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`button.html`](../../design-system/components/button.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/studios/selected`](../../mocks/pages/studios/selected.html), [`pages/studios/selected-one`](../../mocks/pages/studios/selected-one.html), [`pages/studios/filtered`](../../mocks/pages/studios/filtered.html), [`pages/studios/error`](../../mocks/pages/studios/error.html), [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`pages/sign-in/submitting`](../../mocks/pages/sign-in/submitting.html), [`pages/home/submitting`](../../mocks/pages/home/submitting.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/studio-editor/submitting`](../../mocks/pages/studio-editor/submitting.html), [`pages/studio-editor/uploading`](../../mocks/pages/studio-editor/uploading.html), [`dialogs/delete-content/default`](../../mocks/dialogs/delete-content/default.html), [`dialogs/delete-content/busy`](../../mocks/dialogs/delete-content/busy.html), [`dialogs/studio-filters/default`](../../mocks/dialogs/studio-filters/default.html), [`dialogs/studio-filters/invalid`](../../mocks/dialogs/studio-filters/invalid.html) |
| Rendering | [`button.html`](button.html) |

## Purpose and scope

The button does something: applies filters, adds a studio to the comparison,
saves a studio, signs the owner in, deletes a draft after confirmation. One
solid ink primary button per screen marks the action the screen exists for
("Book on the studio's site", "Show 7 studios", "Save changes", "Sign in").
`a[st-button]` draws a link as a button when a page's main call to action only
goes somewhere ("Book on the studio's site", "Browse studios", "New studio");
it keeps `<a href>` semantics.

Use [`a[st-link]`](link.md) when text only navigates, [`st-icon-button`](icon-button.md)
for a lone glyph over a photo or map, [`st-segmented`](button-group.md) to pick
one view from a short row, and [`st-active-filters`](chip.md) for removable
filter chips. The compare bar that a pressed compare toggle feeds is
[`st-compare-bar`](compare-bar.md).

Out of scope:

- Whether a screen has one primary, which action is primary, and the order of
  buttons in a footer: the application's (the design system's rules are listed
  under *Content and internationalisation* for the application to follow).
- The text that explains a disabled or busy button ("Pick at least 2 studios to
  compare", "Saving…"): the application renders it and points `aria-describedby`
  at it; progress text lives in [`st-save-status`](inline-message.md) or the dialog.
- Opening dialogs, submitting forms, compare-selection rules and the four-studio
  limit: application logic.
- The close button inside `st-dialog`, `st-sheet` and `st-map-popup` and the
  "Menu" button inside `st-site-header`: those components render a button with
  this component and own its label.

## Usage

Every `.btn` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks btn "a|button"`), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/default` summary panel | `a`, primary, md, full width (panel), external | "Book on the studio's site", trailing `external` icon, hidden " (opens in a new tab)" | default, hover, focus | surface (summary panel) |
| `pages/studio/in-compare` summary panel | `a`, secondary (steps down under the compare bar), external | as above | default | surface |
| `pages/spot/default` directions | `a`, primary, external | "Open in Google Maps", `external` icon, hidden suffix | default | canvas |
| `pages/studio/default`, `in-compare` summary panel | `button`, secondary, md, toggle (`pressed`) | "Add to compare" / "Remove from compare" | pressed false/true, hover, focus | surface |
| `pages/studios/selected`, `selected-one`; `dialogs/studio-filters/*` behind; `notifications/public-toast/*` | `button`, secondary, sm, toggle, in a card's `actions` slot | "Compare" / "Remove" + hidden " Kensington Window Room" | pressed false/true | surface (card) |
| `pages/studios/selected-one`, `selected`; `pages/studio/in-compare` compare bar | `button`, primary, md | "Compare" | default; soft-disabled (`aria-disabled`) with `aria-describedby` hint "Pick at least 2 studios to compare" | surface (bar) |
| Compare bar | `button`, ghost, md | "Clear" | default | surface (bar) |
| `pages/studios/filtered`, `pages/spots/filtered` | `button`, link, sm | "Clear all" | default, hover, focus | canvas |
| `pages/studios/error`, `no-results`, `pages/spots/*`, `pages/map/*`, `pages/compare/*` empty and error states | `button` secondary "Try again" with leading `refresh` icon; `a` ghost "Go to the home page", `a` secondary "Browse studios", "Clear filters" | text, optional icon | default | canvas |
| `pages/map/*` | `a`, secondary, shown below LG only (`.until-lg` on host) | "Show the list" | default | canvas |
| `dialogs/studio-filters/*`, `dialogs/spot-filters/*` footer | `button` primary submit "Show 7 studios" (`form` attribute); `button` secondary "Clear all" | text | default; disabled "Show studios" with `aria-describedby` to the range error | dialog / sheet footer |
| `dialogs/delete-content/*` | `button` danger "Delete studio"; `button` secondary "Cancel" | text | default; busy (danger) with Cancel disabled | dialog |
| `dialogs/discard-changes/default`, `dialogs/remove-image/default` | danger "Discard", "Remove test shot"; secondary "Stay", "Cancel" | text | default | dialog |
| `dialogs/unpublish/*` | primary "Unpublish"; secondary "Cancel" | text | default, busy | dialog |
| `dialogs/missing-fields/default`, `dialogs/remove-image/refused` | primary "Got it" | text | default | dialog |
| `dialogs/guide-entry-picker/*` | primary "Add entry" (disabled until a location is picked); secondary "Cancel" | text | default, disabled, busy | dialog |
| `pages/sign-in/*` | `button` primary, lg, block, submit | "Sign in" | default, disabled, busy (`submitting`) | surface (auth card) |
| `pages/home/*` hero signup, every public footer | `button` primary (hero) or secondary (footer), submit | "Subscribe" | default, busy (`submitting`) | canvas / footer |
| `pages/studio-editor/*`, `spot-editor/*`, `guide-editor/*` form actions | `button` primary submit "Save changes" / "Create studio"; `a` ghost "Cancel" | text | default, busy, disabled with hint "Wait for uploads to finish" | canvas (sticky bar) |
| Editors' status panel | `button` secondary block "Publish" / "Unpublish"; ghost-danger block "Delete studio" | text | default; disabled with hint "Unpublish before deleting." | surface (aside) |
| Editors' image, fee and gear rows | `button` secondary sm "Move up: test shot 1", "Move down: …"; ghost sm "Remove Cleaning fee", "Cancel upload gallery-02.jpg"; secondary sm "Add fee", "Add included item", "Add extra" | text + hidden object | default; soft-disabled (`aria-disabled`) at the ends of a list | surface (row) |
| `pages/guide-editor/*` | secondary sm "Add entry" (opens the picker, `aria-haspopup="dialog"`); ghost sm "Remove Kensington Window Room" | text | default | surface |
| `pages/admin-dashboard/*`, `admin-studios/*`, `admin-spots/*`, `admin-guides/*` | `a` primary with leading `plus` icon "New studio", "New spot", "New guide"; `a` secondary sm "Edit Ossington Blackbox prices"; `button` ghost submit "Sign out" | text, optional icon | default, hover, focus | canvas, surface (row) |
| `notifications/admin-toast/*`, `public-toast/*` | secondary "Copy link", "Try again" inside a toast action | text | default | toast surface |

Every row above is buildable with the API below: variant, size, `block`,
`iconOnly`, `busy`, `softDisabled` and `pressed` are inputs; `type`, `disabled`,
`href`/`routerLink`, `target`, `rel`, `form`, `aria-describedby`,
`aria-haspopup`, `aria-controls` and `aria-expanded` are native attributes the
consumer writes on the host; icons and hidden context are projected.

## Anatomy

1. **Container** — the host element itself, `button.btn` or `a.btn`. Pill
   (`--radius-full`), 1 px border, height from the size, side padding from the
   size. Never exceeds its container (`max-width: 100%`).
2. **Label** — projected text node. It is the accessible name, together with
   any projected `<span class="visually-hidden">` context.
3. **Icon (optional)** — projected [`st-icon`](icon.md) (`svg.icon`,
   `aria-hidden="true"`), 1.25em, `currentColor`. Leading for "New studio"
   (`plus`) and "Try again" (`refresh`); trailing `external` on links that leave
   ShotThere.
4. **Busy indicator** — `::after` pseudo-element on the container: a 1.1em ring
   in `--btn-fg` turning once per `--duration-loop-fast`. Not a DOM node.

Host: the component uses an attribute selector on the native element
(`button[st-button]`, `a[st-button]`), so the host **is** the `<button>` or
`<a>`, and the component adds no wrapper. Classes and ARIA state go on the host
through host bindings. Native semantics, `type`, `disabled`, `href`,
`routerLink`, `form` and form submission keep working.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `ButtonVariant` (`'secondary' \| 'primary' \| 'ghost' \| 'ghost-danger' \| 'link' \| 'danger'`) | `'secondary'` | no | Adds `.btn--{variant}`; `secondary` adds no modifier. `danger` only inside a confirmation dialog; `ghost-danger` only for the editor's "Delete studio / spot / guide" that opens that dialog (D-2). |
| `size` | `ControlSize` | `'md'` | no | `sm` → `.btn--sm`, `lg` → `.btn--lg`, `md` adds none. |
| `block` | `boolean` | `false` | no | `.btn--block`: full width of the container. |
| `iconOnly` | `boolean` | `false` | no | `.btn--icon`: square, no side padding. The consumer must set `aria-label` on the host; the projected content is only an `st-icon` (D-3). |
| `busy` | `boolean` | `false` | no | Sets `aria-busy="true"` and `aria-disabled="true"`, shows the spinner, keeps the width and the accessible name, keeps focus, and swallows activation: no click listener of the consumer runs and a submit button does not submit (ICD-FORM-8, D-1). |
| `softDisabled` | `boolean` | `false` | no | Sets `aria-disabled="true"`, keeps the button in the tab order, swallows activation exactly as `busy` does. For "Move up" on the first row and "Move down" on the last. Use native `disabled` to remove a button from the tab order. |
| `pressed` | `boolean \| undefined` | `undefined` | no | When defined, the button is a toggle: it renders `aria-pressed="true\|false"` and the `.compare-toggle` class; `true` shows the selected look (D-4). When `undefined`, neither is rendered. |

Inputs are signal inputs; `block`, `iconOnly`, `busy` and `softDisabled` use
`booleanAttribute`, so `<button st-button block>` works. `pressed` keeps
`undefined` as "not a toggle", so it does not use `booleanAttribute`.

Native attributes stay on the host and belong to the consumer: `type` (the
consumer always writes it on a `<button>`; `button` unless it submits), `disabled`,
`href`, `routerLink`, `target`, `rel`, `form`, `aria-label`,
`aria-describedby`, `aria-haspopup`, `aria-controls`, `aria-expanded`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The consumer listens to the native `click` on the host. The component adds no output, because a second event for the same activation would be a duplicate (ICD-API-3). While `busy` or `softDisabled`, the component stops the click in the capture phase so the consumer's listener never runs. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text, optionally one `st-icon` before or after it, optionally `<span class="visually-hidden">` context | The text plus the hidden context is the accessible name. Product copy, marked `i18n` by the consumer. |

The button has no library strings (ICD §12): every word it shows comes from the consumer.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Primary | `.btn--primary` | The one action the screen exists for: "Book on the studio's site", "Show 7 studios", "Save changes", "Sign in", "Compare" in the bar. Solid `--color-action` (ink). |
| Secondary | none (`.btn`) | Every other action: "Apply filters", "Add to compare", "Publish", "Cancel", "Try again", "Edit", "Move up". Outlined pill. |
| Ghost | `.btn--ghost` | Repeated or quiet actions: "Remove" on rows, "Clear" in the compare bar, "Sign out", "Go to the home page". No border. |
| Ghost danger | `.btn--ghost-danger` | The editor status panel's quiet "Delete studio / spot / guide" that opens the confirmation. Ghost with `--color-danger-fg` label. |
| Link | `.btn--link` | Looks like a link but acts in place: "Clear all" after the active-filter chips. Underlined, `--color-fg-link`. |
| Danger | `.btn--danger` | Loss, inside a confirmation dialog only: "Delete studio", "Remove test shot", "Discard". Solid `--color-danger-solid`. |
| Toggle (any variant) | `.compare-toggle` + `aria-pressed` | When `pressed` is defined: "Compare" on cards, "Add to compare" on the studio page. Pressed shows the accent tint, edge and label. |
| Icon only | `.btn--icon` | Square icon button with `aria-label` (the dialog and sheet "Close"). |
| Block | `.btn--block` | Full width: sign-in, filter sheet footer. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| sm | `.btn--sm` | `--control-height-sm` from 48rem; `--target-comfortable` below 48rem | `--space-3` | `--text-label` at `--font-size-sm` |
| md (default) | — | `--control-height-md` | `--space-4` | `--text-label` at `--font-size-md` |
| lg | `.btn--lg` | `--control-height-lg` | `--space-6` | `--text-label` at `--font-size-lg` |

Width comes from the label and padding, or the container with `block`.
An icon-only button is as wide as it is tall (`--control-height-md`, or
`--control-height-sm` with `sm`, growing to `--target-comfortable` below 48rem).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Variant colours from the component tokens | Role button (or link), name from the label |
| Hover | `:hover` | Fill `--btn-bg-hover`; primary also gets `--shadow-2` and the hover border; link thickens its underline and takes `--color-fg-link-hover` | — |
| Focus | `:focus-visible` | `--focus-ring-width` ring in `--color-focus-ring`, offset `--focus-ring-offset`; never on mouse focus | Focus on the button |
| Active | `:active` | Fill `--btn-bg-active`, moves down 1 px | — |
| Disabled | native `disabled` (consumer) | 50 % opacity, `not-allowed` cursor, no transform | Removed from the tab order; announced "dimmed" / "unavailable"; the reason is read through the consumer's `aria-describedby` |
| Soft disabled | `softDisabled` → `aria-disabled="true"` | Same look as disabled | Stays in the tab order; announced unavailable; activation does nothing |
| Busy | `busy` → `aria-busy="true"` + `aria-disabled="true"` | Label colour transparent (width kept), spinner ring in `--btn-fg`, full opacity, `progress` cursor | Name kept; focus kept; announced busy/unavailable; activation does nothing |
| Pressed | `pressed` true → `aria-pressed="true"` | `.compare-toggle[aria-pressed="true"]`: `--color-accent-subtle` fill, `--color-accent` edge, `--color-fg-accent` label; hover `--color-accent-subtle-hover` | "toggle button, pressed" |
| Not pressed | `pressed` false → `aria-pressed="false"` | Variant look | "toggle button, not pressed" |
| Expanded | consumer `aria-expanded="true"` with `aria-haspopup="dialog"` | No change of look | "expanded" (the header "Menu") |
| On a dialog or toast surface | inside `st-dialog`, `st-sheet`, a toast | Same tokens; edges keep 3:1 against `--color-bg-surface-raised` | — |

## Markup

```html
<!-- rendered: primary submit -->
<button class="btn btn--primary" type="submit">Save changes</button>
```

```html
<!-- rendered: secondary, ghost, ghost danger, link, danger -->
<button class="btn" type="button">Apply filters</button>
<button class="btn btn--ghost" type="button">Remove<span class="visually-hidden"> Cleaning fee</span></button>
<button class="btn btn--ghost-danger btn--block" type="button" disabled aria-describedby="delete-hint">Delete studio</button>
<button class="btn btn--link btn--sm" type="button">Clear all</button>
<button class="btn btn--danger" type="button">Delete studio</button>
```

```html
<!-- rendered: link drawn as a button, external -->
<a class="btn btn--primary" href="https://thejunctionloft.example/book" target="_blank" rel="noopener">Book on the studio's site<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg><span class="visually-hidden"> (opens in a new tab)</span></a>
```

```html
<!-- rendered: leading icon -->
<a class="btn btn--primary" href="/admin/studios/new"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>New studio</a>
```

```html
<!-- rendered: toggle, small on a card, not pressed and pressed -->
<button class="btn btn--sm compare-toggle" type="button" aria-pressed="false">Compare<span class="visually-hidden"> Kensington Window Room</span></button>
<button class="btn btn--sm compare-toggle" type="button" aria-pressed="true">Remove<span class="visually-hidden"> The Junction Loft</span></button>
```

```html
<!-- rendered: busy (the label stays; the status line says what is happening) -->
<button class="btn btn--primary" type="submit" aria-busy="true" aria-disabled="true">Save changes</button>
```

```html
<!-- rendered: soft disabled -->
<button class="btn btn--sm" type="button" aria-disabled="true">Move up<span class="visually-hidden">: test shot 1</span></button>
```

```html
<!-- rendered: icon only (inside st-dialog) -->
<button class="btn btn--ghost btn--icon" type="button" aria-label="Close"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
```

Sizes add `.btn--sm` or `.btn--lg`; `block` adds `.btn--block`. Angular's
`_ngcontent-*` attributes on the host are not part of the contract (ICD-DOM-3).

```html
<!-- consumer: editor form actions -->
<button st-button variant="primary" type="submit" [busy]="saving()" [disabled]="uploading()"
        [attr.aria-describedby]="uploading() ? 'save-hint' : null" i18n>Save changes</button>

<!-- consumer: compare toggle on a studio card -->
<button st-button size="sm" type="button" slot="actions" [pressed]="selected()" (click)="toggle()">
  @if (selected()) { <ng-container i18n>Remove</ng-container> } @else { <ng-container i18n>Compare</ng-container> }
  <span class="visually-hidden"> {{ name() }}</span>
</button>

<!-- consumer: external call to action -->
<a st-button variant="primary" [href]="bookingUrl()" target="_blank" rel="noopener">
  <ng-container i18n>Book on the studio's site</ng-container><st-icon name="external" />
  <span class="visually-hidden" i18n> (opens in a new tab)</span>
</a>

<!-- consumer: reorder control at the top of a list -->
<button st-button size="sm" type="button" [softDisabled]="first()" (click)="moveUp()">
  <ng-container i18n>Move up</ng-container><span class="visually-hidden">: {{ label() }}</span>
</button>
```

## Design

- Layout: `inline-flex`, centred, `gap` `--space-2` between icon and label, label on one line (`white-space: nowrap`), `max-width: 100%`.
- Height `--control-height-sm`, `--control-height-md`, `--control-height-lg`; side padding `--space-3`, `--space-4`, `--space-6`; link variant `--space-1`.
- Label `--text-label` at `--font-size-sm`, `--font-size-md`, `--font-size-lg`; sentence case as written (no CSS text transform).
- Shape: `--radius-full`, `--border-width-hairline` border; link variant underline offset 0.2em, `--border-width-thick` on hover.
- Elevation: none, except primary hover `--shadow-2`.
- Focus ring: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset`.
- Motion: background, border, transform and shadow over `--duration-fast` with `--ease-standard`; active moves down 1 px; spinner one turn per `--duration-loop-fast`, linear.
- Icon: 1.25em square, `currentColor`.

Component tokens (declared on `.btn`, overridden by variants and by `.compare-toggle[aria-pressed="true"]`):

| Token | Aliases | Overridden by |
|---|---|---|
| `--btn-bg` | `--color-bg-surface` | primary `--color-action`; danger `--color-danger-solid`; ghost, ghost danger and link transparent; pressed `--color-accent-subtle` |
| `--btn-fg` | `--color-fg-default` | primary `--color-fg-on-action`; danger `--color-fg-on-danger`; ghost danger `--color-danger-fg`; link `--color-fg-link`; pressed `--color-fg-accent` |
| `--btn-border` | `--color-border-strong` | primary `--color-action`; danger `--color-danger-solid`; ghost, ghost danger and link transparent; pressed `--color-accent` |
| `--btn-bg-hover` | `--color-bg-subtle` | primary `--color-action-hover`; danger `--color-danger-solid-hover`; link transparent; pressed `--color-accent-subtle-hover` |
| `--btn-bg-active` | `--color-bg-subtle-hover` | primary `--color-action-active`; danger `--color-danger-solid-hover`; link transparent |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Primary fill | `--color-action` | `--palette-stone-950` | `--palette-stone-100` |
| Primary fill, hover | `--color-action-hover` | `--palette-stone-800` | `--palette-white` |
| Primary fill, active | `--color-action-active` | `--palette-stone-700` | `--palette-stone-200` |
| Primary label | `--color-fg-on-action` | `--palette-white` | `--palette-stone-950` |
| Secondary fill | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Secondary label | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Secondary border | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Secondary and ghost hover | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Danger fill | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Danger fill, hover | `--color-danger-solid-hover` | `--palette-sorrel-700` | `--palette-sorrel-100` |
| Danger label | `--color-fg-on-danger` | `--palette-white` | `--palette-sorrel-950` |
| Ghost danger label | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Link label | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |
| Pressed fill | `--color-accent-subtle` | `--palette-pepper-50` | `--palette-pepper-950` |
| Pressed fill, hover | `--color-accent-subtle-hover` | `--palette-pepper-100` | `--palette-pepper-900` |
| Pressed label | `--color-fg-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Pressed edge | `--color-accent` | `--palette-pepper-600` | `--palette-pepper-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-on-action` | `--color-action` | 4.5:1 | Primary label |
| `--color-fg-on-action` | `--color-action-hover` | 4.5:1 | Primary label, hover |
| `--color-fg-on-action` | `--color-action-active` | 4.5:1 | Primary label, active |
| `--color-action` | `--color-bg-canvas` | 3:1 | Primary edge on the page |
| `--color-action` | `--color-bg-surface-raised` | 3:1 | Primary edge in dialogs |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Secondary label |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Secondary and ghost label, hover |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Secondary border on surfaces |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Secondary border on the page |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Secondary border in dialogs |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Danger label |
| `--color-fg-on-danger` | `--color-danger-solid-hover` | 4.5:1 | Danger label, hover |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Ghost danger label in the status panel |
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Link-button label |
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Pressed toggle label |
| `--color-fg-accent` | `--color-accent-subtle-hover` | 4.5:1 | Pressed toggle label, hover |
| `--color-accent` | `--color-bg-surface` | 3:1 | Pressed toggle edge on a card |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in dialogs |

Forced colours: every button keeps a `CanvasText` border and opts out of
forced-colour adjustment; primary paints `Highlight` with `HighlightText`, so
the main action stays distinguishable.

## Responsive behaviour

- Below 48rem (XS and SM), `.btn--sm` and the small icon-only button grow to
  `--target-comfortable` (44 px) in height and width; from 48rem they are
  `--control-height-sm` (36 px) with at least `--space-2` to the next target.
- Medium (44 px) and large (52 px) meet the 44 px phone target at every size, so
  submit buttons satisfy L2-065.3 without a breakpoint rule.
- `block` stretches to the container at every size. Parents that stretch
  buttons do it with their own rules (summary panel, editor status panel, sheet
  footer, signup row below 36rem); the button does not change by breakpoint
  otherwise.
- The label never truncates or wraps; `max-width: 100%` keeps the pill inside
  its container. Every label in the mocks fits at 320 px; a label that would not
  gets a shorter verb phrase from the application.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; every target is at least 44 × 44 CSS px on touch devices below 48rem and at least 24 × 24 CSS px everywhere.

## Accessibility

### Role and pattern

Native `<button>` following the [APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/);
with `pressed` defined it is the APG toggle button (`aria-pressed`). A link
drawn as a button stays a native `<a href>` with the link role. A button that
opens a dialog carries the consumer's `aria-haspopup="dialog"`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the button in DOM order. Native `disabled` buttons are skipped; busy and soft-disabled ones are not. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates a `<button>`; flips a toggle. Does nothing while busy or soft disabled. |
| <kbd>Enter</kbd> | Follows an `a[st-button]` (links do not answer Space). |

### Focus

The focus ring shows on `:focus-visible` only. A busy button keeps focus for
the whole request, so a keyboard user's position is not lost when "Save
changes" or "Sign in" goes busy and comes back. The component never moves
focus itself.

### Labelling

- The accessible name is the projected text plus any visually hidden context:
  "Compare Kensington Window Room", "Move up: test shot 1", "Book on the studio's
  site (opens in a new tab)". Repeated buttons always include their object.
- Icon-only buttons take `aria-label` from the consumer ("Close").
- Projected icons are `aria-hidden="true"` and add nothing to the name.
- Busy and soft-disabled buttons keep their name; they never become "Saving…".
- A disabled or soft-disabled button's reason is a visible text element the
  consumer references with `aria-describedby`.
- The compare toggle changes both its label ("Compare" → "Remove") and
  `aria-pressed`, as L2-030.1 asks (D-5).
- A button that must explain why it is unavailable uses `softDisabled`, not
  native `disabled`, so it stays focusable and its description is heard
  ("Compare" in the bar with one studio, D-8).

### Announcements

The button has no live region. Pressed and busy changes are conveyed by state
attributes; progress and results are announced by the consumer's status element
([`st-save-status`](inline-message.md), the dialog's status, [`st-compare-bar`](compare-bar.md)).

### Motion

Colour and shadow transitions use `--duration-fast`, which the tokens set to
0 under `prefers-reduced-motion: reduce`; the 1 px active nudge is removed. The
busy spinner keeps turning, because it reports status.

## Content and internationalisation

- Verb phrases in sentence case, Canadian English, three or four words: "Apply
  filters", "Save changes", "Add to compare", "Create studio", "Try again".
  Never "Submit", "Yes", "OK" or "Click here"; acknowledge-only dialogs use "Got it".
- Say what happens next when it helps: "Show 7 studios" carries the live count
  (formatted by the application); "Book on the studio's site" says where booking happens.
- Destructive labels name the loss: "Delete studio", "Remove test shot",
  "Discard". The safe action beside them is "Cancel", or "Stay" when leaving is the risk.
- One primary per screen, placed last in a row; when the compare bar shows its
  primary "Compare", the studio page's "Book on the studio's site" becomes secondary.
- Translatable content: the default slot (label and hidden context) and the
  consumer's `aria-label`. Data values inside labels: studio, spot, guide,
  fee and file names ("Remove Godox AD600 strobe", "Cancel upload gallery-02.jpg").
- Longer translations: the button grows with its label and never truncates; a
  translation that cannot fit at 320 px is shortened in the catalogue.

## Performance

- Change detection: `OnPush`, signal inputs; host classes and ARIA attributes
  come from one `computed` each, not from template expressions.
- The activation guard for `busy` and `softDisabled` is one capture-phase click
  listener on the host, registered once; no per-render work.
- Performance scenario: the `components-harness` route `button/performance`
  renders the studio list's seven card toggles ("Compare Kensington Window Room"
  … "Compare Ossington Blackbox") and the compare bar's "Clear" and "Compare";
  pressing a toggle must stay within the L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: busy keeps the label in the DOM (transparent), so the button
  keeps its width and nothing moves when a request starts or ends.
- Weight: imports only `@angular/core`; no CDK, no router dependency (`routerLink`
  is the consumer's directive on the host).

## Acceptance criteria

### Rendering

- **AC-1** Given `<button st-button variant="primary" type="submit">Save changes</button>` in the studio editor, when it renders, then the element is a native `button` with the classes `btn btn--primary`, `type="submit"`, the accessible name "Save changes", and no wrapper element around it. (L2-069)
- **AC-2** Given secondary, ghost, ghost-danger, link and danger buttons labelled "Apply filters", "Remove Cleaning fee", "Delete studio", "Clear all" and "Delete studio", when they render, then they carry `btn`, `btn btn--ghost`, `btn btn--ghost-danger`, `btn btn--link` and `btn btn--danger` respectively, and the secondary has no modifier class. (L2-069)
- **AC-3** Given `<a st-button variant="primary" href="https://thejunctionloft.example/book" target="_blank" rel="noopener">` with the `external` icon and the hidden suffix, when it renders, then it is a link with the classes `btn btn--primary`, keeps `href`, `target` and `rel`, and its accessible name is "Book on the studio's site (opens in a new tab)". (L2-069)
- **AC-4** Given an "Add to compare" toggle on The Junction Loft's page with `pressed` false, when the visitor activates it and the application sets `pressed` true and the label "Remove from compare", then the button has `aria-pressed="true"`, the `compare-toggle` class and the `--color-accent-subtle` fill, `--color-accent` edge and `--color-fg-accent` label. (L2-030)
- **AC-5** Given a card toggle in the studio list with the label "Compare" and the hidden text " Kensington Window Room", when it renders unpressed, then its accessible name is "Compare Kensington Window Room" and it has `aria-pressed="false"`. (L2-030)
- **AC-6** Given a button without a `pressed` input, when it renders, then it has neither `aria-pressed` nor the `compare-toggle` class. (L2-069)

### States

- **AC-7** Given the sign-in form's "Sign in" button with `busy` true, when it renders, then it has `aria-busy="true"` and `aria-disabled="true"`, no `disabled` attribute, shows the spinner, keeps the accessible name "Sign in", and its width equals its width before it went busy. (L2-049)
- **AC-8** Given the footer signup's "Subscribe" button is busy while the request is pending, when the visitor clicks it or presses Enter or Space on it, then the consumer's click handler does not run and the form is not submitted again. (L2-041)
- **AC-9** Given focus is on "Save changes" when `busy` becomes true and later false, when the request ends, then focus is still on "Save changes". (L2-067)
- **AC-10** Given the first image row's "Move up: test shot 1" with `softDisabled` true, when a keyboard user tabs through the row and presses Enter on it, then the button receives focus, has `aria-disabled="true"`, and nothing moves. (L2-058)
- **AC-11** Given the published studio's ghost-danger "Delete studio" with native `disabled` and `aria-describedby="delete-hint"` pointing at "Unpublish before deleting.", when a screen reader reaches the status panel, then the button is skipped by Tab, is exposed as unavailable, and its description is "Unpublish before deleting.". (L2-061)
- **AC-12** Given the compare bar with one studio selected, when a keyboard user tabs to the primary "Compare", then it receives focus, has `aria-disabled="true"` at 50 % opacity, is described by "Pick at least 2 studios to compare", and pressing Enter does nothing. (L2-030)

### Keyboard and focus

- **AC-13** Given any button on the studio list page, when a keyboard user tabs to it, then a focus ring of `--focus-ring-width` (2 px) in `--color-focus-ring` is drawn `--focus-ring-offset` (3 px) outside it with at least 3:1 contrast against the page, and no ring appears when the same button is clicked with a mouse. (L2-067)
- **AC-14** Given focus on the "Add to compare" toggle, when the visitor presses Space and then Enter, then each key flips the toggle once. (L2-067)

### Screen readers

- **AC-15** Given the delete dialog's footer and the editor's rows, when axe-core scans them in light and dark, then no button has a missing name, an icon-only button is named by its `aria-label` ("Close"), and projected icons are hidden from the accessibility tree. (L2-069)

### Theming

- **AC-16** Given primary, secondary, danger, link and pressed-toggle buttons on the page, in a dialog and on a card, when the contrast check runs in the light and the dark theme, then every label is at least 4.5:1 against its fill and every border, pressed edge and focus ring is at least 3:1 against what surrounds it. (L2-068)

### Responsive

- **AC-17** Given the studio list at 360 px wide, when a card's small "Compare" toggle and an editor row's small "Move up" are measured, then each is at least 44 × 44 CSS px. (L2-065)
- **AC-18** Given the editor rows at 1280 px wide, when a small "Edit Ossington Blackbox prices" button is measured, then it is 36 px tall and no button on the screen is smaller than 24 × 24 CSS px. (L2-065)
- **AC-19** Given the sign-in page at 320 px wide, when the block "Sign in" button and the filters sheet's "Show 7 studios" render, then each fits its container, its label is not truncated, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-20** Given The Junction Loft's page at 200 % zoom in a 1280 px viewport, when the visitor reaches "Book on the studio's site" and "Add to compare", then both are fully visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` hover and press transitions take 0 ms and the
1 px press nudge is removed, while the busy spinner keeps turning
([button.html](../../design-system/components/button.html), Accessibility › Motion).

### Performance

- **AC-21** Given the `button/performance` harness route with seven card toggles, when a toggle is pressed, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/button/`: `button.component.ts`
  (`ButtonComponent`, selector `button[st-button], a[st-button]`),
  `button.component.html` (`<ng-content />`), `button.component.css` (port of
  the `.btn*` and `.compare-toggle` rules from `components.css`, written against
  `:host` and `:host(.btn--primary)` …). Types `ButtonVariant` and `ControlSize`
  in `src/lib/types/`.
- Host bindings: `[class]` from a `computed` of variant, size, block, iconOnly
  and toggle; `[attr.aria-busy]`, `[attr.aria-disabled]` (`busy || softDisabled`
  → `'true'`, else `null`), `[attr.aria-pressed]` (`null` when `pressed` is `undefined`).
- Activation guard: a host listener for `click` in the capture phase that calls
  `preventDefault()` and `stopImmediatePropagation()` while busy or soft
  disabled, so neither the consumer's `(click)` nor form submission runs.
- The `.btn--primary` hover shadow, focus ring and forced-colour rules come
  across with the rest of the block; the global `:focus-visible` ring in
  `foundations.css` already applies.
- ICD change: `ButtonVariant` gains `'ghost-danger'` and `ButtonComponent`
  gains `iconOnly` (ICD-002 1.1.0, additive).
- Mocks drift the component corrects: the editors' inline
  `style="color: var(--color-danger-fg)"` on "Delete studio" becomes
  `variant="ghost-danger"`; busy buttons that swap their label ("Saving…",
  "Signing in") keep it; "Cancel" and "Close" drawn as `<a>` in dialog mocks
  (they link to sibling mock files) are `<button type="button">` in the product.

## Decisions

- **D-1** *Does busy use native `disabled` (as the design-system Code section and the mocks write it) or `aria-disabled`?* `aria-disabled="true"` with `aria-busy="true"`, and the activation guard. ICD-002 fixes this (`busy` "sets `aria-busy` and `aria-disabled`", ICD-FORM-8), and keeping focus on a busy button is what a keyboard user needs; L2-041.3's "disabled" is met because the button is exposed as unavailable and ignores activation. The look is the design system's busy look either way.
- **D-2** *The design system has `.btn--ghost-danger` for the editors' "Delete studio" but ICD-002's `ButtonVariant` does not.* `ButtonVariant` gains `'ghost-danger'` (additive, ICD-002 1.1.0). Fourteen editor mocks need it, and without it the application would hand-style the button, which ICD-DOM-5 forbids.
- **D-3** *How does a library component render the icon-only "Close" (`.btn--ghost.btn--icon`) when `.btn*` styles are encapsulated in this component?* Through a new `iconOnly` input (additive, ICD-002 1.1.0). `st-dialog`, `st-sheet` and `st-map-popup` use `<button st-button variant="ghost" iconOnly>`, and the application may use it for any other icon-only action that sits among buttons.
- **D-4** *Which element carries the selected look for a toggle, and does the password "Show" toggle get it?* Any button with `pressed` defined renders `.compare-toggle`, and pressed true shows the accent tint, as ICD-002 D-9 decided; the sign-in "Show" toggle therefore tints when pressed. Keeping the class on every toggle keeps the mocks' DOM contract for the compare toggles that page objects select.
- **D-5** *L2-030.1 asks the toggle's label to change to "Remove"; the APG advises a fixed label on a toggle button.* The label changes, because L2 decides what must happen; the application supplies both labels and the component reflects `aria-pressed`. A screen reader hears "Remove The Junction Loft, toggle button, pressed".
- **D-6** *The mocks write dialog "Cancel", "Close" and "Got it" as `<a href>` to sibling mock files.* In the product they are `<button type="button">`, because they act in place; the mocks link only so the static set can be navigated.
- **D-7** *Should the component add `target="_blank"` and `rel="noopener"` to external button-links, as `a[st-link][external]` does?* No. ICD-002 gives the button no `external` input; the consumer writes `target`, `rel`, the `external` icon and the hidden "(opens in a new tab)" itself, as the markup above shows.
- **D-8** *The `pages/studios/selected-one` mock disables the bar's "Compare" natively while pointing `aria-describedby` at its hint.* The bar's "Compare" uses `softDisabled`, as the design system's compare-bar page resolves: a natively disabled button cannot be focused, so its hint is never heard from the keyboard. Native `disabled` stays for buttons whose reason is visible beside them and need not be reached (the published studio's "Delete studio").
