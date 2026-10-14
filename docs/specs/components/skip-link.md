# Skip link

| Field | Value |
|---|---|
| Selector | `st-skip-link` |
| Library path | `frontend/projects/components/src/lib/skip-link/` |
| Status | planned |
| Traces to | L2-064, L2-065, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`skip-link.html`](../../design-system/components/skip-link.html) |
| Source mocks | [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`pages/not-found/default`](../../mocks/pages/not-found/default.html), [`dialogs/site-menu/default`](../../mocks/dialogs/site-menu/default.html), [`notifications/admin-toast/success`](../../mocks/notifications/admin-toast/success.html) |
| Rendering | [`skip-link.html`](skip-link.html) |

## Purpose and scope

The skip link is the first thing a keyboard user reaches on every ShotThere
page, public or admin. It stays above the viewport until it has focus, then
slides in at the top left over the site header; activating it moves focus to
the page's one `<main id="main">`, so the next Tab lands on the first control
of the page (the filters trigger on Studios, the breadcrumb on The Junction
Loft, the first editor section on the studio editor) instead of the wordmark
and the five header links again.

There is one skip link per page and no other kind. Landmarks and headings let
screen-reader users jump elsewhere; the header ([`st-site-header`](site-header.md))
and the breadcrumb ([`st-breadcrumb`](breadcrumb.md)) are the next stops after it.

Out of scope:

- Placing it first in the document, rendering `<main id="main" tabindex="-1">`
  and hiding the main landmark's own focus ring: the application's shell
  (ICD-A11Y-3; `main[tabindex="-1"]:focus { outline: none; }` is in the global
  foundations).
- `scroll-padding-top` on `html`: a global foundation rule, not this component's.
- Focus management for dialogs, the site menu sheet and the lightbox: the
  overlay takes focus itself and the page behind, skip link included, is inert.

## Usage

Every `.skip-link` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks skip-link "a"`): 143 uses across all 33 screens, one configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Every page mock (`pages/*/*`), public and admin, including `pages/sign-in/*`, `pages/not-found/default`, `pages/server-error/default` | `targetId` `'main'` (default) | "Skip to content" (library string) | default (off-screen), focus | over the site header on `--color-bg-canvas` |
| Every dialog mock (`dialogs/*/*`) | same, inside the inert page behind the dialog | same | not reachable (inert) | behind the dialog backdrop |
| `notifications/*/*` | same; the toast region sits after the content, so the skip link is still first | same | default, focus | over the header |

Every row is buildable with the API below: the shell renders `<st-skip-link />`
once as its first child and never sets an input.

## Anatomy

1. **Link** — `a.skip-link`, `href="#main"`. Raised surface, `--radius-md`,
   `--shadow-3`, padding `--space-2` by `--space-4`, at least
   `--target-comfortable` tall, layer `--z-tooltip`. Positioned above the
   viewport until `:focus-visible`.
2. **Label** — text node, the library string "Skip to content" or `label`. It is
   the accessible name.
3. **Target (not rendered here)** — the application's
   `<main id="main" tabindex="-1">`.

Host: `st-skip-link` is `display: contents`; it adds no box. The `<a>` inside is
the only element.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `targetId` | `string` | `'main'` | no | Renders `href="#" + targetId`. Activation moves focus to the element with that ID (D-1). |
| `label` | `string` | §12 `st.skipLink.label` ("Skip to content") | no | The link text and accessible name. |

`label` is the only text; the application overrides it only through translation
of the library string, so the shell passes no inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Activation is handled inside the component; the application has nothing to react to. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | The label comes from `label`. |

## Variants and sizes

One variant and one size. The same link, label and target are on public pages,
admin pages and the sign-in page; only what it skips differs. Height is at
least `--target-comfortable`; width is the label plus padding, capped at
`calc(100vw - 2 * var(--space-4))` so a longer translation wraps.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Above the viewport (`top: calc(-1 * var(--space-24))`); still first in the tab order | Exposed as a link named "Skip to content" |
| Focus | `:focus-visible` | Slides to `top: var(--space-4)`, `left: var(--space-4)`; raised surface and shadow; shared focus ring (`--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset`) | Focused link |
| Hover | `:hover` | Only reachable while focused, so it looks the same as focus | — |
| Active | `:active` | Same as focus; on activation focus moves to `#main` and the link slides back out | — |
| Inert | inside a page behind an open dialog | Unchanged, unreachable | Hidden by `inert` |
| Print | `@media print` | Not printed | — |

It is never disabled and has no attribute-driven states.

## Markup

```html
<!-- rendered -->
<a class="skip-link" href="#main">Skip to content</a>
```

```html
<!-- consumer: shell template, first element -->
<st-skip-link />
<st-site-header … />
<main id="main" class="container" tabindex="-1"><router-outlet /></main>
```

Angular's `_ngcontent-*` attributes and the `st-skip-link` host are not part of
the contract (ICD-DOM-3); page objects find the link by its role and name.

## Design

- Position: `absolute`, `left: var(--space-4)`; hidden at `top: calc(-1 * var(--space-24))`, shown at `top: var(--space-4)`.
- Layer `--z-tooltip`, above the header and the compare bar.
- Box: padding `--space-2` `--space-4`, `min-height: var(--target-comfortable)`, `inline-flex` centred, `max-width: calc(100vw - 2 * var(--space-4))`.
- Shape and elevation: `--radius-md`, `--shadow-3`.
- Type: body text, `--color-fg-default`, no underline.
- Motion: `top` over `--duration-fast` with `--ease-standard`.
- Print: `display: none`.

It declares no component tokens; a theme changes it through the semantic tokens
only.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Background | `--color-bg-surface-raised` | `--palette-white` | `--palette-stone-850` |
| Label | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Page behind (header) | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Ring against the link's own surface |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Ring against the header behind it |

Forced colours: the system draws the link with `LinkText` on `Canvas` and the
focus outline with the system highlight; the shadow is dropped, so the link
keeps the `:focus-visible` outline as its edge.

## Responsive behaviour

Identical at every breakpoint: `left: var(--space-4)` and `top: var(--space-4)`
when focused. At 320 px "Skip to content" fits on one line; the `max-width`
lets a longer translation wrap inside the screen instead of widening the page.
It covers the wordmark while focused, which lasts only until focus moves on.
Touch alone never shows it (no `:focus-visible`); a phone with a keyboard or
switch access gets it as on desktop, 44 px tall. Nothing scrolls horizontally
at 320 px and it stays available at 200 % zoom.

## Accessibility

### Role and pattern

A native in-page link, the standard technique for WCAG 2.4.1 Bypass Blocks.
The target's `tabindex="-1"` (the application's) lets it take focus.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> (first press on a page) | Focuses and shows the skip link. |
| <kbd>Enter</kbd> | Moves focus to `#main`; the next Tab reaches the first control in the main content. |
| <kbd>Tab</kbd> without Enter | Hides it and continues to the wordmark. |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> from the wordmark | Comes back to the skip link. |

### Focus

The component moves focus exactly once: on activation, to the element with
`targetId` (D-1). It never takes focus on its own. Its ring is the shared 2 px
`--color-focus-ring` with the `--focus-ring-offset` offset.

### Labelling

The visible text is the name. No `aria-label`, no `title`.

### Announcements

None. Moving focus to the main landmark makes the screen reader announce
"main" and continue from there.

### Motion

The slide-in uses `--duration-fast`, which the tokens set to 0 under
`prefers-reduced-motion: reduce`, so the link appears in place
([skip-link.html](../../design-system/components/skip-link.html), Accessibility › Motion).

## Content and internationalisation

- Exactly "Skip to content", sentence case (L2-067.1). Not "Skip to main
  content", "Skip navigation" or "Jump to studios". No icon, no arrow.
- It is a library string (`$localize`, ID `@@st.skipLink.label`), extracted with
  the application's messages and overridable through `label`.
- A longer translation wraps within `calc(100vw - 2 * var(--space-4))`; it
  never widens the page.

## Performance

- Change detection: `OnPush`; `href` is a `computed` of `targetId`.
- One click listener on the link, registered once; the target is looked up
  only on activation, through `inject(DOCUMENT)` (ICD-SSR-1).
- Performance scenario: the `components-harness` route `skip-link/performance`
  renders the skip link above a copy of the public header and the studio list's
  `<main id="main" tabindex="-1">`; activating the link must stay within the
  L2-071 INP budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the link is absolutely positioned, so showing and hiding it
  moves nothing (no layout shift).
- Weight: imports only `@angular/core` and `@angular/localize`.

## Acceptance criteria

### Rendering

- **AC-1** Given the studio list page rendered by the shell, when a keyboard user presses Tab once after load, then the focused element is a link named "Skip to content" with `class="skip-link"` and `href="#main"`, and no focusable element precedes it in the document. (L2-067)
- **AC-2** Given focus on the skip link on The Junction Loft's page, when the user presses Enter, then focus is on `<main id="main">`, and the next Tab focuses the breadcrumb link "Studios". (L2-067)
- **AC-3** Given the server-rendered studio list loaded with JavaScript disabled, when the user tabs to "Skip to content" and presses Enter, then the browser follows `href="#main"` and the next Tab focuses the first control inside `main`. (L2-067)
- **AC-4** Given `<st-skip-link targetId="content" />` above an element with `id="content"`, when it renders and is activated, then the link has `href="#content"` and focus moves to that element. (L2-067)
- **AC-5** Given the skip link before it has focus, when the page is inspected, then the link's bounding box lies entirely above the viewport and it is still in the tab order. (L2-067)

### Keyboard and focus

- **AC-6** Given the skip link is focused, when it renders, then its box is fully inside the viewport at `top` and `left` of `--space-4` (16 px), and a 2 px `--color-focus-ring` outline with at least 3:1 contrast against the header behind it is visible. (L2-067)
- **AC-7** Given the skip link is focused, when the user presses Tab without activating it, then the link returns above the viewport and focus is on the wordmark "ShotThere Toronto". (L2-067)

### Screen readers

- **AC-8** Given the studio list and the studio editor pages, when axe-core scans them in light and dark with the skip link focused, then no violation is reported and the link's accessible name is exactly "Skip to content". (L2-069)

### Theming

- **AC-9** Given the focused skip link in the light and the dark theme, when the contrast check runs, then the label is at least 4.5:1 against `--color-bg-surface-raised`. (L2-068)

### Responsive

- **AC-10** Given a 320 px viewport and a `label` of "Passer au contenu principal de la page", when the link is focused, then the label wraps inside the link, the link stays inside the viewport, and `document.documentElement.scrollWidth` equals 320. (L2-064)
- **AC-11** Given a 360 px viewport with a keyboard attached, when the skip link is focused, then it is at least 44 CSS px tall. (L2-065)

### Content

- **AC-12** Given the components-harness extracted messages, when the library's translation source is inspected, then "Skip to content" is a message with the ID `st.skipLink.label` and the component's template contains no other static text. (L2-070)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` the link appears in place instead of sliding
([skip-link.html](../../design-system/components/skip-link.html), Accessibility › Motion).

### Performance

- **AC-13** Given the `skip-link/performance` harness route, when the skip link is focused and activated with Enter, then the interaction-to-next-paint is at most 200 ms on the Lighthouse mobile profile and the cumulative layout shift stays 0. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/skip-link/`:
  `skip-link.component.ts` (`SkipLinkComponent`, selector `st-skip-link`),
  `skip-link.component.html`, `skip-link.component.css` (port of `.skip-link`
  from `components.css`, minus the documentation-only `[data-state="focus"]`
  selector; `:host { display: contents; }`).
- The default label is `$localize\`:@@st.skipLink.label:Skip to content\``
  assigned as the `label` input's default.
- Activation: a `click` listener (which also fires on Enter) reads
  `inject(DOCUMENT).getElementById(targetId())`; when found, it calls
  `preventDefault()` and `target.focus()`. When not found it does nothing, so
  the browser's default fragment navigation runs.
- The print rule (`@media print { display: none }`) comes across with the block.

## Decisions

- **D-1** *Does the component move focus itself or rely on the browser following `href="#main"`?* It moves focus itself on activation (`preventDefault()` then `focus()` on the target) and leaves the URL unchanged. ICD-002 makes focus movement the component's ("activation moves focus to the target"); following the fragment in an Angular application would add `#main` to the URL and hand a navigation to the router. Without JavaScript the plain `href="#main"` still works (ICD-SSR-3).
- **D-2** *What if the target is missing?* The component does not prevent the default action, so the browser's fragment behaviour applies, and it adds no `tabindex` to anything. The shell always renders `<main id="main" tabindex="-1">` (ICD-A11Y-3), so this only matters in the harness.
- **D-3** *Which element is the host's box?* None: `:host { display: contents; }`. The link is absolutely positioned against the page, and a host box would add nothing but an empty inline element in the tab-order-first position.
