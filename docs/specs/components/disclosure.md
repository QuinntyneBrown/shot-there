# Disclosure

| Field | Value |
|---|---|
| Selector | `st-disclosure` |
| Library path | `frontend/projects/components/src/lib/disclosure/` |
| Status | planned |
| Traces to | L2-012, L2-020, L2-045, L2-046, L2-064, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-074 |
| Design system | [`disclosure.html`](../../design-system/components/disclosure.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/minimal`](../../mocks/pages/studio/minimal.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/studio/playing`](../../mocks/pages/studio/playing.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spot/no-rain-backup`](../../mocks/pages/spot/no-rain-backup.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html), [`pages/spot/map-failed`](../../mocks/pages/spot/map-failed.html), [`pages/editorial-policy/default`](../../mocks/pages/editorial-policy/default.html) |
| Rendering | [`disclosure.html`](disclosure.html) |

## Purpose and scope

Every review says how the session was paid for (L1-011): paid in full,
discounted by a named studio, or comped by a named studio; spots say they were
shot on a regular visit. The disclosure is the quiet, fixed callout that holds
that sentence at the end of a studio's "Verdict" (L2-012) and a spot's "Best
uses" (L2-020.3), with a link to the editorial policy. It looks the same
whatever the answer, so no review reads as more or less trustworthy from its
styling.

Use [`st-alert`](alert.md) for warnings and news (stale prices, stale permits);
the disclosure is a fact about the review, not about the location.

Out of scope:

- Choosing the sentence: the application's `studio-disclosure.view-model.ts`
  (and the spot equivalent) picks the fixed, i18n-marked sentence from the
  stored `disclosure` value and `disclosureProvider` (L2-045). The component
  renders the title and whatever statement it is given.
- Placement: the application puts the callout last in the verdict or best-uses
  section and spaces it from the text above (D-3).
- The disclosure value in the editors: a radio group and a provider field
  ([`st-radio-group`](radio-group.md), [`st-text-field`](text-field.md)).
- The editorial policy page and the footer link to it (L2-046.2).

## Usage

Every `.disclosure` in `docs/mocks/` (`usage_inventory.py docs/mocks disclosure "div|p"`):
eleven uses, all at the end of a review section.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/default`, `minimal`, `stale`, `in-compare`, `media-failed`, `playing` | title "How this session was paid for" | "I paid the full rate for this session. No studio pays for placement or scores." + link "Editorial policy" | default, link hover, link focus | sunken callout on the canvas, last in "Verdict" |
| Leslieville Daylight Studio (DS page, cast) | same title | "This session was discounted by Leslieville Daylight Studio. That did not affect the scores." + link | default | same |
| Liberty Cyc House (DS page, cast) | same title | "This session was provided free of charge by Liberty Cyc House. That did not affect the scores." + link | default | same |
| `pages/spot/default`, `stale-permit`, `no-rain-backup`, `no-video`, `map-failed` | title "How this visit was paid for" | "Shot on a regular visit; no one paid for or arranged this review." + link | default | sunken callout, last in "Best uses" |
| `pages/editorial-policy/default` | not used: the policy lists the sentences as plain text | — | — | — |

Every row is buildable with the API below: the title is an input, the
statement and its link are the default slot.

## Anatomy

1. **Container** — the host element carries `.disclosure`: flex row, `--space-3` gap, padding `--space-4` × `--space-5`, `--color-bg-surface-sunken`, a `--border-width-thick` rule in `--color-border-strong` on the left, square left corners and `--radius-md` on the right.
2. **Icon** — [`st-icon`](icon.md) `info` (`svg.icon`, `aria-hidden="true"`), 20 px, `--color-fg-muted`, nudged down `--space-0-5` to the title's first line. Rendered by the component, not projected (D-1).
3. **Text column** — an unclassed `div` holding the title and the statement.
4. **Title** — `p.disclosure__title`: the `title` input, `--text-label` at `--font-size-md`. A paragraph, not a heading (D-2).
5. **Statement** — a `<p>` the component renders around the default slot: the fixed sentence and, at its end, the projected [`a[st-link]`](link.md) "Editorial policy". Full width of the callout (`.disclosure p { max-width: none }`, D-8).

Host: `st-disclosure` carries the block class (`<st-disclosure class="disclosure">`),
as ICD-DOM-1 asks for a block that is a plain `div` (D-5).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | "How this session was paid for" (studios) or "How this visit was paid for" (spots). Rendered in `p.disclosure__title`. Product copy, `i18n-title`. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The only control is the projected link, which is the application's. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Inline content: the fixed statement text and, last, `a[st-link]` "Editorial policy" (a router link to the editorial policy path, same tab) | Projected into the component's statement `<p>`, after the title. No block elements. The provider's name is plain text, never a link (D-7). |

The disclosure renders no text of its own (ICD-002 §12 has no disclosure string).

## Variants and sizes

The variants are the stored values (L2-045). Container, icon and order never
change; only the sentence does.

| Variant | Title | Statement |
|---|---|---|
| Paid in full (`paid_in_full`) | How this session was paid for | I paid the full rate for this session. No studio pays for placement or scores. |
| Discounted by … (`discounted`) | How this session was paid for | This session was discounted by Leslieville Daylight Studio. That did not affect the scores. |
| Comped by … (`comped`) | How this session was paid for | This session was provided free of charge by Liberty Cyc House. That did not affect the scores. |
| Spot, regular visit | How this visit was paid for | Shot on a regular visit; no one paid for or arranged this review. |

Every statement ends with the "Editorial policy" link. One size: the callout
fills the width of the section it ends.

## States

The callout does not react; its one control is the projected link.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Sunken callout, left rule, icon, title, statement | Read in order: title, statement, "Editorial policy, link" |
| Link hover | `:hover` on the link | `--color-fg-link-hover`, thicker underline (link component) | — |
| Link focus | `:focus-visible` on the link | `--focus-ring-width` ring in `--color-focus-ring` at `--focus-ring-offset`, drawn on the sunken ground | Focus on the link |
| Link active | `:active` | As hover; links have no pressed style | — |
| Disabled | never | — | — |
| Missing value | cannot occur | A location without a disclosure can't be published (L2-045.3); no "Not disclosed" variant exists | — |

## Markup

```html
<!-- rendered: studio, paid in full -->
<st-disclosure class="disclosure">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h0"/></svg>
  <div>
    <p class="disclosure__title">How this session was paid for</p>
    <p>I paid the full rate for this session. No studio pays for placement or scores. <a href="/editorial-policy">Editorial policy</a></p>
  </div>
</st-disclosure>
```

```html
<!-- rendered: spot, regular visit -->
<st-disclosure class="disclosure">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h0"/></svg>
  <div>
    <p class="disclosure__title">How this visit was paid for</p>
    <p>Shot on a regular visit; no one paid for or arranged this review. <a href="/editorial-policy">Editorial policy</a></p>
  </div>
</st-disclosure>
```

The discounted and comped variants differ only in the statement text. The
`svg` path data is the DS icon sheet's `info` glyph as `st-icon` renders it; the
`<a>` is whatever `a[st-link]` renders. Angular attributes and host names are
not part of the contract (ICD-DOM-3).

```html
<!-- consumer: StudioDisclosureComponent, last in the verdict section -->
<st-disclosure class="review-disclosure" title="How this session was paid for" i18n-title>
  {{ vm().statement }} <a st-link [routerLink]="paths.editorialPolicy" i18n>Editorial policy</a>
</st-disclosure>
```

## Design

- Container: `display: flex`, `align-items: flex-start`, gap `--space-3`, padding `--space-4` block and `--space-5` inline, `--color-bg-surface-sunken`, left border `--border-width-thick` solid `--color-border-strong`, radius `0 --radius-md --radius-md 0`.
- Icon: `flex: none`, 20 px (`.icon` default), `--color-fg-muted`, `margin-top: --space-0-5`.
- Title: `--text-label` at `--font-size-md`, `--color-fg-default`.
- Statement: body text, `--color-fg-default`, `max-width: none`.
- Link: `--color-fg-link`, underlined; hover `--color-fg-link-hover` (link component).
- No tone family, ever: the same tokens for every value. Elevation, motion, layering: none.

No component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Background | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Left rule | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Icon | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Title and statement | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Policy link | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |
| Policy link, hover | `--color-fg-link-hover` | `--palette-pepper-600` | `--palette-pepper-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Title and statement |
| `--color-fg-muted` | `--color-bg-surface-sunken` | 4.5:1 | Icon (meets text contrast though decorative) |
| `--color-border-strong` | `--color-bg-surface-sunken` | 3:1 | Left rule |
| `--color-fg-link` | `--color-bg-surface-sunken` | 4.5:1 | Policy link |
| `--color-fg-link-hover` | `--color-bg-surface-sunken` | 4.5:1 | Policy link, hover |
| `--color-focus-ring` | `--color-bg-surface-sunken` | 3:1 | Focus ring on the callout |

Forced colours: the ground disappears and the left rule becomes `CanvasText`;
the text and the underlined link stay.

## Responsive behaviour

- The same at every breakpoint: the callout fills its column, the icon stays
  top left, and the title and statement wrap beside it. Padding does not change.
- XS to MD: the column is the page width less the layout margins; the statement
  runs to three or four lines at 360 px. LG and up: the main column beside the
  summary panel; one or two lines.
- Long provider names ("Leslieville Daylight Studio") wrap between words;
  nothing truncates.
- At 320 px nothing scrolls horizontally; at 200 % zoom the whole statement and
  the link stay visible. The link is inline text in a sentence (2.5.8 exempt)
  with the full line height to tap.

## Accessibility

### Role and pattern

Plain content: a `div` with two paragraphs, no ARIA role and no live region. It
is read in reading order at the end of the "Verdict" or "Best uses" region. The
title is a `<p>`, so the page outline stays one `h2` per section.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Stops once, on "Editorial policy". |
| <kbd>Enter</kbd> | Follows the link to the editorial policy in the same tab. |

### Focus

The component never moves focus. The link takes the shared 2 px ring on the sunken ground.

### Labelling

- Read as: "How this session was paid for. This session was discounted by
  Leslieville Daylight Studio. That did not affect the scores. Editorial policy, link."
- The icon is decorative (`aria-hidden="true"`); the title carries the meaning.
- "Editorial policy" makes sense out of context in a links list (2.4.4).

### Announcements

None.

### Motion

None. The link's colour change follows the link component's transition tokens.

## Content and internationalisation

- The sentences are fixed by the editorial policy and filled only with the
  provider's name as stored; the application never paraphrases them per review.
- First person for paid in full ("I paid"): one reviewer shoots every location.
- Titles: "How this session was paid for" (studio), "How this visit was paid
  for" (spot).
- Translatable: `title`, the statement and the link text (application
  catalogue, `i18n`); data: the provider's name. French runs longer; the
  statement wraps, the callout grows in height only.

## Performance

- Change detection: `OnPush`, one signal input, no derived state.
- Performance scenario: the `components-harness` route `disclosure/performance`
  renders the four variants (The Junction Loft, Leslieville Daylight Studio,
  Liberty Cyc House, Evergreen Brick Works) repeated for every published studio
  and spot (twelve callouts), within the L2-071 budgets.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: static server-rendered text; nothing loads later.
- Weight: imports `@angular/core` and `st-icon`.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-disclosure title="How this session was paid for">` with The Junction Loft's paid-in-full statement, when it renders, then the host has the class `disclosure` and holds an `svg.icon` with `aria-hidden="true"`, then a `div` with `p.disclosure__title` "How this session was paid for" followed by "I paid the full rate for this session. No studio pays for placement or scores. Editorial policy". (L2-012)
- **AC-2** Given Leslieville Daylight Studio's discounted statement, when the callout renders, then it reads "This session was discounted by Leslieville Daylight Studio. That did not affect the scores." with the provider's name as plain text, not a link. (L2-012)
- **AC-3** Given Liberty Cyc House's comped statement, when the callout renders, then it reads "This session was provided free of charge by Liberty Cyc House. That did not affect the scores." under the same title. (L2-012)
- **AC-4** Given Evergreen Brick Works with title "How this visit was paid for" and "Shot on a regular visit; no one paid for or arranged this review.", when the callout renders at the end of "Best uses", then the title and statement show in the same callout structure as on studios. (L2-020)
- **AC-5** Given the paid-in-full, discounted and comped callouts rendered side by side, when their computed styles are compared, then background, left rule, icon colour, padding and title type are identical and none carries a tone or status class. (L2-045)
- **AC-6** Given each of the four statements, when the callout renders, then the projected "Editorial policy" link sits at the end of the statement paragraph and points at the editorial policy page. (L2-046)

### Keyboard and focus

- **AC-7** Given The Junction Loft's verdict, when a keyboard user tabs through the callout, then focus stops only on "Editorial policy", and a focus ring of `--focus-ring-width` (2 px) in `--color-focus-ring` is drawn with at least 3:1 contrast against `--color-bg-surface-sunken`. (L2-067)

### Screen readers

- **AC-8** Given Leslieville Daylight Studio's callout, when a screen reader reads it, then it hears "How this session was paid for", the discounted statement and "Editorial policy, link", the title is not a heading, and the callout has no role and no live region. (L2-069)
- **AC-9** Given any callout, when it is inspected, then the info icon is `aria-hidden="true"` and adds nothing to the accessibility tree. (L2-068)
- **AC-10** Given the component's template, when it is inspected and the translation source extracted, then the callout renders no text of its own: the title comes from `title` and the statement and link from the slot. (L2-070)

### Theming

- **AC-11** Given the comped callout in the light and the dark theme, when the contrast check runs, then title, statement and link are at least 4.5:1 against `--color-bg-surface-sunken` and the left rule at least 3:1. (L2-068)

### Responsive

- **AC-12** Given Leslieville Daylight Studio's callout at 320 px wide, when it renders, then the icon stays top left, the statement wraps between words beside it, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-13** Given The Junction Loft's page at 200 % zoom in a 1280 px viewport, when the visitor reaches the verdict, then the whole callout and its link are visible and operable with no horizontal page scroll. (L2-066)

### Server rendering

- **AC-14** Given Evergreen Brick Works' page fetched with JavaScript disabled, when the HTML is inspected, then it contains the title, the regular-visit statement and the link to the editorial policy. (L2-074)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the callout does
not animate, so `prefers-reduced-motion` changes nothing
([disclosure.html](../../design-system/components/disclosure.html), Accessibility › Motion).

### Performance

- **AC-15** Given the `disclosure/performance` harness route with twelve callouts, when it is measured with Lighthouse in mobile mode, then Largest Contentful Paint is at most 2.5 s and Cumulative Layout Shift is at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/disclosure/`:
  `disclosure.component.ts` (`DisclosureComponent`, selector `st-disclosure`,
  `host: { class: 'disclosure' }`), `disclosure.component.html`
  (`<st-icon name="info" />`, then `<div><p class="disclosure__title">{{ title() }}</p><p><ng-content /></p></div>`),
  `disclosure.component.css` (port of `.disclosure`, `.disclosure .icon`,
  `.disclosure p` and `.disclosure__title` against `:host`; both paragraphs are
  the component's own, so emulated encapsulation reaches them).
- Composes [`st-icon`](icon.md) (`info`); the application projects
  [`a[st-link]`](link.md).
- Mock drift the product corrects: every review mock spaces the callout with an
  inline `margin-top: var(--space-8)`; the application sets it from feature CSS
  (D-3).
- No ICD change.

## Decisions

- **D-1** *Is the icon projected or rendered?* Rendered: always the `info` glyph. The DS fixes the icon for every value, and a slot would let one review look different from another.
- **D-2** *Is the title a heading?* No. The DS makes it a `<p>` so the page keeps one `h2` per section, and ICD-002 gives the component no `headingLevel`.
- **D-3** *Who puts `--space-8` above the callout?* The application. The DS rule `.review-section > .disclosure` combines an application-owned block (`.review-section`) with a library class, which ICD-DOM-5 forbids the application to target. The application gives the host its own feature class and sets `margin-top: var(--space-8)` on it, which ICD-DOM-5 allows.
- **D-4** *The spot editor offers Discounted and Comped, but the policy defines only the regular-visit sentence for spots.* The component is agnostic: it renders any title and statement. The application follows the DS's interim rule (a discounted or comped spot uses the studio sentence with "visit" for "session"); confirming that wording is a content decision for the owner, outside this component.
- **D-5** *Does the host carry `.disclosure`?* Yes: the DS block is a plain `div`, so ICD-DOM-1 makes the host the block and the component adds no wrapper.
- **D-6** *What does the component do with an empty slot or an empty title?* Nothing special: there is no "Not disclosed" variant, because publishing without a disclosure is refused (L2-045.3) and `title` is required.
- **D-7** *Is the provider's name a link to the studio?* No, plain text, so the disclosure can't read as an endorsement (DS *Labelling*). The application's statement contains no other link than "Editorial policy".
- **D-8** *Who renders the statement paragraph?* The component: it wraps the default slot in its own `<p>`. ICD-002 makes the slot "statement and policy link", and emulated encapsulation cannot style a paragraph the application projects, so the DS's full-width rule (`.disclosure p { max-width: none }`) only holds on an element the component owns. The application projects inline text and the link.
