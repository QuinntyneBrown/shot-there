# Error page

| Field | Value |
|---|---|
| Selector | `st-error-page` |
| Library path | `frontend/projects/components/src/lib/error-page/` |
| Status | planned |
| Traces to | L2-001, L2-064, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-083 |
| Design system | [`error-page.html`](../../design-system/components/error-page.html) |
| Source mocks | [`pages/not-found/default`](../../mocks/pages/not-found/default.html), [`pages/server-error/default`](../../mocks/pages/server-error/default.html) |
| Rendering | [`error-page.html`](error-page.html) |

## Purpose and scope

When a whole page cannot be shown, the error page says so plainly under the
normal site header and offers a way home (L2-083). ShotThere has two: "We
couldn't find that page" (HTTP 404) for any URL that matches no route and for
any studio, spot or guide that is a draft, so a draft cannot be found by
guessing its slug (L2-001); and "Something went wrong on our side" (HTTP 500)
for an unhandled server error, with a support reference and never a stack
trace or internal detail (L2-083.2, L2-085). `st-error-page` renders the
centred column inside the application's `main`: the code line, the page's
only `h1`, the explanation and the way out.

Use [`st-empty-state`](empty-state.md) with the error tone when a list, map,
dashboard or record failed but the page itself loaded ("We couldn't load the
studios", "We couldn't open this studio"), and [`st-alert`](alert.md) when the
page can still show most of its content (a compare link with one unknown
studio, a rate-limited sign-in).

Out of scope:

- The HTTP status (404, 500), the wildcard route, the SSR error handler, the
  correlation ID and the document title from the central page titles: the
  application's (`handle-errors-and-health`).
- `main#main.container[tabindex="-1"]`, the site header and footer, and moving
  focus to `main` after a client-side route change: the application's
  (ICD-A11Y-3, ICD §14).
- The actions: projected `a[st-button]` links ("Go to the home page", "Browse
  studios", "Try again") with paths from `APP_PATHS`.
- Deciding that a draft gets the same 404 as an unknown slug: the server's
  (L2-001.1); the component renders whatever copy it is given.

## Usage

Every `.system-page` in `docs/mocks/` (two screens), plus the draft case the
design-system page documents.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/not-found/default` (unknown URL `/studios/parkdale-loft`) | `code` "Error 404" above the heading | `title` "We couldn't find that page"; `text` "It may have been renamed, or the location isn't published."; actions: primary "Go to the home page", secondary "Browse studios" | default, action hover/focus/active | canvas inside the public header and footer |
| Same page for a draft (`/studios/corktown-garage-studio`) | identical inputs | identical | default | canvas |
| `pages/server-error/default` | no `code`; `reference` "Reference 7f3a-91c2" below the text | `title` "Something went wrong on our side"; default slot: paragraph "Try again in a minute. If it keeps happening, tell us at hello@shotthere.ca and quote this reference." with a `mailto:` link; actions: primary "Try again" (reloads the same URL), secondary "Go to the home page" | default, action hover/focus/active | canvas |

Both rows are buildable with `code`, `title`, `text`, `reference`, the
`actions` slot and a default slot for the paragraph with the mail link, which
ICD-002 1.0.0 lacks (D-1).

## Anatomy

1. **Column** — the host, `st-error-page.system-page`: a centred flex column up
   to 34rem wide, gap `--space-4`, `--space-16` above and `--space-8` below,
   `text-align: center`, `margin-inline: auto`.
2. **Code line (optional)** — `p.system-page__code` before the heading:
   "Error 404". `--text-body-sm` in `--color-fg-subtle`.
3. **Heading** — the page's only `h1`, `--text-display` (48 px on phones, 64 px
   from 62rem). Says what happened.
4. **Text (optional)** — `p`, body text: why and what to do.
5. **Body (optional)** — the default slot: a consumer paragraph with inline
   links, after the text (D-1).
6. **Reference (optional)** — `p.system-page__code` after the text and body:
   "Reference 7f3a-91c2". Same look as the code line.
7. **Actions** — `.system-page__actions`: a centred, wrapping row, gap
   `--space-3`, `margin-top: var(--space-4)`, holding the projected
   button-links.

The host carries the block class (ICD-DOM-1); the parts render inside it in
the order above.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `code` | `string \| null` | `null` | no | The complete code line, "Error 404", rendered before the `h1` in `p.system-page__code`; omitted when `null` or empty. |
| `title` | `string` | — | yes | The page's `h1` text. |
| `text` | `string \| null` | `null` | no | A plain paragraph after the `h1`; omitted when `null` or empty. |
| `reference` | `string \| null` | `null` | no | The complete support reference line, "Reference 7f3a-91c2", rendered after the text and body in `p.system-page__code`; omitted when `null` or empty. Never a stack trace, error name, path or status text. |

Signal inputs. `code` and `reference` are display strings the application
builds and translates (`$localize` with the ID as a placeholder), because the
words "Error" and "Reference" are product copy (D-2).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The actions are links; they navigate on their own. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | One `<p>` with inline native links, written by the consumer | Rendered after `text` and before `reference`. For the 500's "tell us at hello@shotthere.ca" paragraph. ICD change (ICD-002 1.1.0, additive, D-1). |
| `actions` | One or two `a[st-button]` elements with `slot="actions"` | The primary first ("Go to the home page" on 404, "Try again" on 500), then one secondary. Both are plain links, never disabled or busy. |

The error page has no library strings (ICD §12): every word comes from the
consumer.

## Variants and sizes

| Variant | Inputs | Use for |
|---|---|---|
| Not found | `code`, `title`, `text`; actions "Go to the home page" (primary), "Browse studios" | HTTP 404: unknown URLs and drafts (L2-083.1, L2-001.1) |
| Something went wrong | `title`, default-slot paragraph, `reference`; actions "Try again" (primary), "Go to the home page" | HTTP 500 (L2-083.2) |

There are no modifier classes. One size: a column up to 34rem wide; only the
heading's type steps up at 62rem, because `--font-size-5xl` is 3rem below and
4rem from 62rem.

## States

The page is static; its actions are plain links and carry the interactive
states. There is no disabled or busy state.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Code line, display heading, text, actions | A normal document: `h1`, paragraphs, links; no live region |
| With reference | `reference` set | Subtle reference line after the text | Read in reading order after the instruction that asks for it |
| Without code / text / reference | input `null` | The element is not rendered | — |
| Action hover, focus, active | the projected link's | The button's states | The link's |
| Client-side route to the page | the application routes here | No change | Focus moves to `main` (application), so the `h1` is read next |

## Markup

```html
<!-- rendered: not found (inside the application's main) -->
<main id="main" class="container" tabindex="-1">
  <st-error-page class="system-page">
    <p class="system-page__code">Error 404</p>
    <h1>We couldn't find that page</h1>
    <p>It may have been renamed, or the location isn't published.</p>
    <div class="system-page__actions">
      <a class="btn btn--primary" href="/">Go to the home page</a>
      <a class="btn" href="/studios">Browse studios</a>
    </div>
  </st-error-page>
</main>
```

```html
<!-- rendered: something went wrong -->
<st-error-page class="system-page">
  <h1>Something went wrong on our side</h1>
  <p>Try again in a minute. If it keeps happening, tell us at <a href="mailto:hello@shotthere.ca">hello@shotthere.ca</a> and quote this reference.</p>
  <p class="system-page__code">Reference 7f3a-91c2</p>
  <div class="system-page__actions">
    <a class="btn btn--primary" href="/studios/the-junction-loft">Try again</a>
    <a class="btn" href="/">Go to the home page</a>
  </div>
</st-error-page>
```

Host tag names are not part of the contract (ICD-DOM-3).

```html
<!-- consumer: not-found page component -->
<st-error-page i18n-code code="Error 404" i18n-title title="We couldn't find that page"
  i18n-text text="It may have been renamed, or the location isn't published.">
  <a st-button slot="actions" variant="primary" [routerLink]="paths.home" i18n>Go to the home page</a>
  <a st-button slot="actions" [routerLink]="paths.studios" i18n>Browse studios</a>
</st-error-page>

<!-- consumer: server error page component -->
<st-error-page i18n-title title="Something went wrong on our side" [reference]="referenceLine()">
  <p i18n>Try again in a minute. If it keeps happening, tell us at <a href="mailto:hello@shotthere.ca">hello@shotthere.ca</a> and quote this reference.</p>
  <a st-button slot="actions" variant="primary" [href]="currentUrl()" i18n>Try again</a>
  <a st-button slot="actions" [routerLink]="paths.home" i18n>Go to the home page</a>
</st-error-page>
```

`referenceLine()` returns the translated line with the ID as a placeholder
("Reference {$id}"), or `null` when the server has no correlation ID to give.

## Design

- Layout: flex column, `align-items: center`, `text-align: center`, gap `--space-4`, `padding-block: var(--space-16) var(--space-8)`, `max-width: 34rem`, `margin-inline: auto`. It sits in the application's `.container`, so it keeps the page margins (16 px on phones).
- Heading: `--text-display` (`--font-size-5xl`: 48 px, 64 px from 62rem), `--color-fg-default`, wraps.
- Text and body: body type, `--color-fg-default`; the mail link is a native link in `--color-fg-link` from the foundations.
- Code and reference lines: `--text-body-sm`, `--color-fg-subtle`, `overflow-wrap: anywhere` so a long reference wraps rather than overflows (D-4).
- Actions: flex row, `flex-wrap: wrap`, `justify-content: center`, gap `--space-3`, `margin-top: var(--space-4)`.
- Elevation, background, radius, motion: none. No illustration, no photo.

The component declares no tokens of its own.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Page | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Heading, text | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Code and reference lines | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Mail link | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |
| Primary action fill | `--color-action` | `--palette-stone-950` | `--palette-stone-100` |
| Primary action label | `--color-fg-on-action` | `--palette-white` | `--palette-stone-950` |
| Secondary action border | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Heading and text on the page |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Code and reference lines |
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Mail link |
| `--color-fg-on-action` | `--color-action` | 4.5:1 | Primary action label |
| `--color-action` | `--color-bg-canvas` | 3:1 | Primary action edge |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Secondary action edge |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the actions and the mail link |

Forced colours: all parts are text and native links, so the system colours
apply with nothing lost.

## Responsive behaviour

- The column is centred in `.container` and stops at 34rem on wide screens.
- The heading is 48 px on phones and 64 px from 62rem, and wraps: at 360 px
  "We couldn't find that page" is two lines (L2-083.3).
- The two actions sit side by side when they fit and stack, centred, when they
  do not.
- The code and reference lines wrap at any character only when they would
  otherwise overflow (D-4); "Reference 7f3a-91c2" fits on one line at 320 px.
- At 320 px nothing scrolls sideways; at 200 % zoom everything stays available;
  both actions are 44 px tall with 12 px between them.

## Accessibility

### Role and pattern

A normal document: the application's banner and navigation, `main` holding the
`h1`, and the footer. No live region and no `role="alert"`: the page loads as
a page, the document title names the error, and the HTTP status is the
machine-readable part. No APG pattern applies.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skip link, header navigation, then the mail link (on a 500), the primary action and the secondary action. |
| <kbd>Enter</kbd> | Follows the focused link. |

### Focus

A full page load starts at the top as usual. The component never moves focus;
after a client-side route to the error page the application moves focus to
`main` (`tabindex="-1"`), so the `h1` is read next.

### Labelling

- The `h1` is the message; it is the page's only `h1` (ICD-A11Y-3 names this
  component as one of two that may render one).
- Action labels say where they go ("Go to the home page", "Browse studios");
  "Try again" reloads the same URL.
- The reference is plain text, so it can be selected and copied.

### Announcements

None.

### Motion

None. The design-system page specifies no animation.

## Content and internationalisation

- The heading says what happened, from the visitor's side: "We couldn't find
  that page", "Something went wrong on our side". The 500 takes the blame.
- The 404 never reveals drafts: "It may have been renamed, or the location
  isn't published." covers both an unknown slug and a draft.
- The 500 says what to do: try again in a minute, and how to report it, with a
  reference to quote.
- Code line: "Error 404"; reference: "Reference" plus the correlation ID. No
  other technical detail, no status jargon ("500 Internal Server Error"), no
  jokes, illustrations or exclamation marks.
- Translatable: `code`, `title`, `text`, `reference` (with the ID as a
  placeholder), the body paragraph (with the mail link as an element
  placeholder) and the actions, all marked by the consumer. The email address
  and the ID are data. French runs about 30 % longer; the heading and text
  wrap and the actions stack.

## Performance

- Change detection: `OnPush`, signal inputs, no computed work beyond
  presence checks.
- Performance scenario: the `components-harness` route `error-page/performance`
  renders the 404 page ("Error 404", "We couldn't find that page", "Go to the
  home page", "Browse studios") inside a `main.container`; its heading is the
  largest paint and must stay within the L2-071 budgets on the Lighthouse
  mobile profile.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: text only, rendered on the server with its final content;
  the self-hosted font uses `font-display: swap` (ICD-STY-8), which the
  budget absorbs.
- Weight: imports only `@angular/core`; no router dependency (the actions'
  `routerLink` is the consumer's).

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-error-page code="Error 404" title="We couldn't find that page" text="It may have been renamed, or the location isn't published.">` with the actions "Go to the home page" and "Browse studios", when it renders, then the host has the class `system-page` and holds, in order, `p.system-page__code` "Error 404", `h1` "We couldn't find that page", the text paragraph and `.system-page__actions` with a link to the home page and a link to the studio list. (L2-083)
- **AC-2** Given the server-error page with `reference="Reference 7f3a-91c2"`, the mail paragraph in the default slot and the actions "Try again" and "Go to the home page", when it renders, then the order is `h1`, the mail paragraph with its `mailto:hello@shotthere.ca` link, `p.system-page__code` "Reference 7f3a-91c2", then the actions, and there is no code line before the `h1`. (L2-083)
- **AC-3** Given an unhandled render error whose server log holds "TypeError: Cannot read properties of undefined (reading 'slug')", when the 500 page renders with only its title, paragraph, reference and actions, then the `.system-page` text contains none of the error name, message, stack, file path or status text. (L2-083)
- **AC-4** Given a request for `/studios/corktown-garage-studio` (a draft) and one for `/studios/parkdale-loft` (unknown), when both 404 pages render, then their `.system-page` markup is identical. (L2-001)
- **AC-5** Given `code`, `text` and `reference` all `null`, when the page renders, then it holds only the `h1` and the actions, with no empty paragraphs. (L2-083)

### Screen readers

- **AC-6** Given the 404 page in the public layout, when headings and landmarks are listed, then there is one `main` (the application's), exactly one `h1` "We couldn't find that page", and the component itself renders no `main`, landmark, `role` or `aria-live`. (L2-069)
- **AC-7** Given the 404 and 500 pages at 320 px and 1280 px, when axe-core scans them in light and dark, then no violation is reported. (L2-069)

### Keyboard and focus

- **AC-8** Given the 500 page, when a keyboard user tabs past the header navigation, then focus visits the "hello@shotthere.ca" link, "Try again" and "Go to the home page" in that order, each showing a 2 px `--color-focus-ring` with at least 3:1 contrast. (L2-067)

### Theming

- **AC-9** Given the 404 and 500 pages in the light and the dark theme, when the contrast check runs, then the heading and text are at least 4.5:1, the code and reference lines (`--color-fg-subtle`) at least 4.5:1 and the mail link at least 4.5:1 against `--color-bg-canvas`. (L2-068)

### Responsive

- **AC-10** Given the 404 page at 360 px, when it renders, then "We couldn't find that page" wraps to two lines at 48 px, the two actions stack centred if they do not fit side by side, and `document.documentElement.scrollWidth` equals the viewport width. (L2-083)
- **AC-11** Given the 500 page at 320 px with `reference="Reference 3b241101-e2bb-4255-8caf-4136c566a962"`, when it renders, then the reference wraps inside the column and nothing scrolls horizontally. (L2-064)
- **AC-12** Given the 404 page at 1280 px, when it renders, then the `h1` is 64 px (`--font-size-5xl` from 62rem) and the column is at most 34rem wide and centred. (L2-064)
- **AC-13** Given the 500 page at 200 % zoom in a 1280 px viewport, when it renders, then the heading, paragraph, reference and both actions are visible and operable with no horizontal page scroll. (L2-066)

### Content

- **AC-14** Given an error page with only `title="We couldn't find that page"`, when its text content is read, then it is exactly "We couldn't find that page": the component adds no words of its own. (L2-070)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the page never
animates, so `prefers-reduced-motion` changes nothing
([error-page.html](../../design-system/components/error-page.html),
Accessibility › Motion).

### Performance

- **AC-15** Given the `error-page/performance` harness route, when it loads on the Lighthouse mobile profile, then Largest Contentful Paint is at most 2.5 s and Cumulative Layout Shift at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/error-page/`:
  `error-page.component.ts` (`ErrorPageComponent`, selector `st-error-page`,
  host class `system-page`), `error-page.component.html` (`@if (code())`
  paragraph, `<h1>{{ title() }}</h1>`, `@if (text())` paragraph,
  `<ng-content />`, `@if (reference())` paragraph,
  `<div class="system-page__actions"><ng-content select="[slot=actions]" /></div>`),
  `error-page.component.css` (port of `.system-page*` from `components.css`
  against `:host`, plus `overflow-wrap: anywhere` on `.system-page__code`).
- ICD change (ICD-002 1.1.0, additive): `ErrorPageComponent` gains a default
  slot ("body"), rendered after `text` and before `reference`.
- The application's `NotFoundPageComponent` and `ErrorPageComponent` in
  `features/errors/` (`handle-errors-and-health`) each render this component.
  The application's error page component shares its class name with this
  library component; the application imports the library one under an alias
  or names its own `ServerErrorPageComponent`.
- Actions are [`a[st-button]`](button.md); the mail link is a native link
  styled by the foundations.
- Mocks drift the component corrects: none. The 404's code above the heading
  and the 500's reference below the text are deliberate and kept.

## Decisions

- **D-1** *The 500 paragraph holds a `mailto:` link, but `text` is a plain string and the component never binds `innerHTML` (ICD-SEC-1).* `ErrorPageComponent` gains a default slot for one consumer paragraph with inline links, rendered after `text` and before `reference` (ICD-002 1.1.0, additive). Neither `text` nor `actions` can carry the link without dropping it from the sentence the design system shows, and the design system's keyboard order and contrast table include the mail link.
- **D-2** *Are "Error" and "Reference" library strings, or part of the inputs?* Part of the inputs: `code` and `reference` are complete display lines ("Error 404", "Reference 7f3a-91c2"), as the ICD's example "Error 404" shows. They are product copy the application translates with the ID as a placeholder, so the library renders no words of its own and needs no §12 strings.
- **D-3** *Does the component render `main`?* No. The application owns `main#main.container[tabindex="-1"]` (ICD-A11Y-3); the component's host is the `.system-page` column inside it.
- **D-4** *The design system says the reference "never wraps mid-code; it is short by design", but `handle-errors-and-health` makes the correlation ID a `crypto.randomUUID()` (36 characters), which does not fit at 320 px.* The code and reference lines take `overflow-wrap: anywhere`: a short reference stays on one line and a long one wraps instead of scrolling, because L2-083.3 forbids horizontal scroll. The application may pass a shortened reference; the component handles either.
- **D-5** *Can an action be busy or disabled?* No. Both are links that load a page; the design system's state matrix says "Never disabled", so the slot accepts only `a[st-button]`.
