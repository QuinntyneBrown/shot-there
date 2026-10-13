# Spinner

| Field | Value |
|---|---|
| Selector | `st-spinner` |
| Library path | `frontend/projects/components/src/lib/spinner/` |
| Status | planned |
| Traces to | L2-060, L2-064, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`spinner.html`](../../design-system/components/spinner.html), [`feedback-and-loading.html`](../../design-system/patterns/feedback-and-loading.html) |
| Source mocks | [`dialogs/guide-entry-picker/busy`](../../mocks/dialogs/guide-entry-picker/busy.html), [`dialogs/delete-content/busy`](../../mocks/dialogs/delete-content/busy.html), [`dialogs/unpublish/busy`](../../mocks/dialogs/unpublish/busy.html), [`pages/sign-in/submitting`](../../mocks/pages/sign-in/submitting.html), [`pages/home/submitting`](../../mocks/pages/home/submitting.html), [`pages/studio-editor/submitting`](../../mocks/pages/studio-editor/submitting.html) |
| Rendering | [`spinner.html`](spinner.html) |

## Purpose and scope

A spinner says "working on it" when a wait is short and has no amount. On
ShotThere the standalone spinner appears in one place: beside the "Searching"
caption while the guide entry picker looks up studios and spots for "ju"
(L2-060.4). It is a 2 px ring with an ink arc that turns once every
`--duration-loop-fast`, plus a visually hidden label; it never stands alone,
because a status message elsewhere says what is happening.

Busy buttons ("Sign in", "Subscribe", "Save changes", "Delete studio",
"Unpublish") do not use this component: the button draws its own ring in its
label colour with `aria-busy="true"` ([button.md](button.md), `busy`). Never
put `st-spinner` inside a button. Use a [skeleton](skeleton.md) while a known
layout loads and a [progress bar](progress.md) when the wait has an amount
(image uploads).

Out of scope:

- When the spinner shows (after 300 ms, DS States), when it goes, and what
  replaces it: the consumer's.
- The visible caption ("Searching") and the live announcement ("Searching…"):
  the consumer's status element, not this component (D-2).
- The busy-button ring: [button.md](button.md).

## Usage

Every `.spinner` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks spinner "span"`), and every busy ring the DS spinner page lists.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/guide-entry-picker/busy` busy line under the search field | `sm`, inside [`st-search-field`](combobox.md)'s `aria-hidden` busy line beside the visible caption "Searching…"; the search field's own `role="status"` announces | `label` default (hidden with its container) | present while the query "ju" is searched | dialog surface |
| Any other short unmeasured wait (no screen today) | `md` beside body text or `lg` alone in a region, inside the consumer's persistent `role="status"` element | `label` "Loading studios…" style copy from the consumer | present | canvas or surface |
| `dialogs/delete-content/busy`, `dialogs/unpublish/busy`, `pages/sign-in/submitting`, `pages/home/submitting`, `pages/studio-editor/submitting` (and the spot and guide editors) | not this component: the button's own ring | — | busy | — ([button.md](button.md)) |

Every row that renders `st-spinner` is buildable with `size` and `label`.

## Anatomy

1. **Host** — `st-spinner`, `display: inline-flex`, no box of its own (D-1).
2. **Ring** — `span.spinner` with `aria-hidden="true"`: a circle with a
   `--border-width-thick` track in `--color-border-default` and the top quarter
   (the arc) in `--color-fg-default`, turning linearly once per
   `--duration-loop-fast`. Size from the modifier.
3. **Label** — `span.visually-hidden` holding `label`: the words a screen
   reader finds in reading order ("Loading", "Searching…").

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | `sm` → `.spinner--sm` (`--icon-size-sm`, 16 px), `md` adds no modifier (`--icon-size-md`, 20 px), `lg` → `.spinner--lg` (`--space-10`, 40 px, D-3). |
| `label` | `string` | `$localize` `@@st.spinner.label` "Loading" | no | Rendered in `span.visually-hidden`. Say what is happening with the item's name ("Loading studios…", "Searching…"). |

Inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The spinner is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | No projection; the caption beside it is the consumer's. |

Library string (ICD §12): `st.spinner.label` "Loading", overridden by `label`.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Inline spinner | `.spinner` | Beside a short caption while something small is fetched (the entry picker's search). |
| Busy button ring | — (`.btn[aria-busy="true"]::after`) | Not this component; see [button.md](button.md). |

| Size | Modifier | Diameter | Ring |
|---|---|---|---|
| sm | `.spinner--sm` | `--icon-size-sm` (16 px) | `--border-width-thick` |
| md (default) | — | `--icon-size-md` (20 px) | `--border-width-thick` |
| lg | `.spinner--lg` | `--space-10` (40 px) | `--border-width-thick` |

Match the size to the text beside it: `sm` beside `--text-caption`, `md` beside
body text, `lg` alone in an empty region. Only `sm` is on a ShotThere screen
today.

## States

The spinner has no interactive states: it is present while working and
removed when done. Hover, focus, active and disabled do not apply.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Present | rendered by the consumer | Ring turning once per `--duration-loop-fast`, linear | Label in reading order; announced only through the consumer's live region (D-2) |
| Gone | the consumer stops rendering it | Removed | — |
| Reduced motion | `prefers-reduced-motion: reduce` | Keeps turning (it reports status) | — |
| Inside an `aria-hidden` container | consumer's busy line already announces | Same | Hidden, label included |

## Markup

```html
<!-- rendered: small, default label -->
<st-spinner>
  <span class="spinner spinner--sm" aria-hidden="true"></span>
  <span class="visually-hidden">Loading</span>
</st-spinner>
```

```html
<!-- rendered: large with a label, inside the consumer's persistent status element -->
<p class="cluster" role="status">
  <st-spinner><span class="spinner spinner--lg" aria-hidden="true"></span><span class="visually-hidden">Loading studios…</span></st-spinner>
</p>
```

The medium spinner has no modifier. Host tag names and Angular's
`_ngcontent-*` attributes are not part of the contract (ICD-DOM-3); page
objects find the ring by `.spinner` and the words by text.

```html
<!-- consumer: a persistent status element; the spinner and caption appear inside it while busy -->
<p class="cluster" role="status">
  @if (searching()) {
    <st-spinner size="sm" i18n-label label="Searching…" />
    <span class="text-caption" aria-hidden="true" i18n>Searching</span>
  }
</p>
```

## Design

- Ring: `display: inline-block`, `border-radius: 50%`, `flex: none`; `border` `--border-width-thick` solid `--color-border-default`; `border-top-color` `--color-fg-default`.
- Sizes: `--icon-size-sm`, `--icon-size-md`, `--space-10`.
- Motion: `animation: spin` over `--duration-loop-fast`, linear, infinite (`rotate` 0 to 360 deg).
- Host: `display: inline-flex`, `align-items: center`; adds no margin, padding or box.
- Gap to a caption: the consumer's (`.cluster` with `--space-2`).
- No elevation; in flow; no focus ring (not focusable).

There are no spinner component tokens; the ring reads the semantic tokens
directly.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Arc | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Track | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 3:1 | Arc on the page |
| `--color-fg-default` | `--color-bg-surface-raised` | 3:1 | Arc in a dialog (entry picker) |
| `--color-fg-default` | `--color-border-default` | 3:1 | Arc against its own track |

The arc tells the user something is working, so it needs 3:1 against what is
behind it (WCAG 1.4.11); the track is decorative. Forced colours: the track
takes `GrayText` and the arc `CanvasText`, so the turning arc stays visible
(D-4).

## Responsive behaviour

- Spinner sizes never change by breakpoint.
- The spinner never wraps or overflows; a caption beside it wraps under the
  consumer's `.cluster`.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom the ring scales with the text.
- Nothing to touch: the spinner is not a target.

## Accessibility

### Role and pattern

The ring is decoration (`aria-hidden="true"`); the words are the label in a
visually hidden span. The spinner has no role and no live region of its own
(ICD-002 does not mark it "live"): to announce, the consumer renders it inside
an element with `role="status"` that is in the DOM before the spinner arrives
(WCAG 4.1.3; there is no APG spinner pattern) (D-2).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips the spinner; it is not focusable. |
| Typing in the entry picker | Keeps working while "Searching" shows. |

### Focus

A spinner never takes or moves focus.

### Labelling

- Say what is happening with the item's name: "Loading studios…",
  "Searching…". Not "Please wait".
- Present participle plus the ellipsis character; the visible caption may drop
  it ("Searching"), the label keeps it.
- When the consumer's status element already says the words (the entry
  picker), the consumer hides the spinner's container with `aria-hidden`, so
  nothing is read twice.

### Announcements

None by the component. Inserted into the consumer's persistent `role="status"`
element, its label is announced politely once.

### Motion

The design-system rule: the spinner keeps turning under
`prefers-reduced-motion: reduce`, because a still ring reads as frozen; the
turn is small, slow and linear and ends as soon as the work does (DS Motion).

## Content and internationalisation

- The label names the work: "Searching…", "Loading studios…". Present
  participle, ellipsis character, no time estimates.
- Translatable: `label` (the consumer's `i18n-label`), and the library default
  "Loading" (`st.spinner.label`).
- Long translations do not affect the ring; the hidden label has no width.

## Performance

- Change detection: `OnPush`, signal inputs; the ring's class list is a
  `computed`.
- The turn animates `rotate` on the compositor; no layout or paint per frame.
- Server rendering: renders on the server as static markup; nothing runs until
  the animation starts in the browser.
- Performance scenario: the `components-harness` route `spinner/performance`
  renders the entry picker's busy line (small spinner, "Searching") while the
  query field takes typing ("j", "ju"); typing must stay within the L2-071 INP
  budget while the spinner turns.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: fixed diameters; inserting the spinner into a reserved line
  moves nothing.
- Weight: imports only `@angular/core`.

## Acceptance criteria

### Rendering

- **AC-1** Given the entry picker searching for "ju", when `<st-spinner size="sm" />` renders, then it contains a `span.spinner.spinner--sm` with `aria-hidden="true"` that is 16 × 16 CSS px with a 2 px ring, and a visually hidden label, and nothing else. (L2-060)
- **AC-2** Given `<st-spinner />` with no inputs, when it renders, then the ring is `.spinner` with no size modifier at 20 × 20 CSS px and the hidden label reads "Loading" from the `$localize` string `@@st.spinner.label`; with `label="Loading studios…"` it reads "Loading studios…". (L2-070)
- **AC-3** Given `<st-spinner size="lg" />`, when it renders, then the ring has `.spinner--lg` and is 40 × 40 CSS px, and its arc keeps at least 3:1 against the canvas. (L2-068)

### Screen readers

- **AC-4** Given an empty `role="status"` element in the page, when the consumer inserts `<st-spinner label="Searching…" />` into it, then "Searching…" is announced once, the ring is not in the accessibility tree, and no other text from the spinner is read. (L2-069)
- **AC-5** Given the spinner harness routes in light and dark, when axe-core scans them, then no violations are reported. (L2-069)

### Keyboard

- **AC-6** Given the entry picker while the spinner shows, when a keyboard user presses Tab from the search field, then focus moves to the next control without stopping on the spinner, and typing in the field keeps working. (L2-067)

### Theming

- **AC-7** Given the small spinner on the canvas and in a dialog, in light and dark, when the contrast check runs, then the arc is at least 3:1 against the background and against its own track. (L2-068)

### Responsive

- **AC-8** Given the entry picker dialog at 320 px with the busy line, when it renders, then the spinner and caption fit on the line and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the spinner keeps turning
([spinner.html](../../design-system/components/spinner.html), Accessibility › Motion).

### Performance

- **AC-9** Given the `spinner/performance` harness route, when the owner types "j" then "u" into the entry picker's field while the spinner turns, then each keystroke's interaction-to-next-paint is at most 200 ms and the spinner causes no layout shift. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/spinner/`:
  `spinner.component.ts` (`SpinnerComponent`, selector `st-spinner`),
  `spinner.component.html`
  (`<span [class]="ringClass()" aria-hidden="true"></span><span class="visually-hidden">{{ label() }}</span>`),
  `spinner.component.css` (port of `.spinner` and `.spinner--sm`, the restored
  `.spinner--lg`, the `spin` keyframes, the `:host` inline-flex rule and the
  forced-colours rule).
- `.visually-hidden` is the global utility (ICD §11.1); the component uses it
  as a class in its own template.
- Composed by [`st-search-field`](combobox.md) for its busy line.
- Never composed by `button[st-button]`; the busy ring is the button's CSS.

## Decisions

- **D-1** *ICD-DOM-1 puts the DS block class on the host, but the DS requires `aria-hidden="true"` on `.spinner` while ICD-002 gives the spinner a label that must be read.* The ring is an inner `span.spinner` (`aria-hidden`) beside the hidden label, and the host is a box-less inline-flex wrapper. Hiding the host would hide the label; putting the label inside an `aria-hidden` ring would hide it too.
- **D-2** *Is the spinner a live region?* No. ICD-002 does not mark it "live", and a `role="status"` inserted together with its text is not reliably announced. The consumer keeps a persistent status element (the search field's status, or its own `role="status"` wrapper) and inserts the spinner into it; the label then supplies the words once.
- **D-3** *ICD-002 has size `lg`, but the DS removed the large spinner because no mock used it (DS README).* `lg` keeps the pre-removal DS rule (git `ee40038^`): `--space-10` (40 px) with the same `--border-width-thick` ring. The rendering shows it as a specimen until the DS restores it.
- **D-4** *The DS has no forced-colours rule for the spinner; in forced colours the track and arc both become the text colour, so the turn is invisible.* Under `forced-colors: active` the ring opts out of adjustment with a `GrayText` track and a `CanvasText` arc, so the turning arc stays visible, matching how the DS keeps other state visible with system colours.
- **D-5** *Should the spinner delay itself by 300 ms (DS States, "Delayed")?* No; the consumer decides when to render it, because only the consumer knows when the work started. The component renders immediately.
