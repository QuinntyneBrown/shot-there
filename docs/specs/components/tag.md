# Tag

| Field | Value |
|---|---|
| Selector | `st-tag-list` |
| Library path | `frontend/projects/components/src/lib/tag-list/` |
| Status | planned |
| Traces to | L2-019, L2-036, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 |
| Design system | [`tag.html`](../../design-system/components/tag.html) |
| Source mocks | [`pages/spots/default`](../../mocks/pages/spots/default.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`dialogs/spot-filters/default`](../../mocks/dialogs/spot-filters/default.html) |
| Rendering | [`tag.html`](tag.html) |

## Purpose and scope

A tag is a quiet outlined label that says what a place is good for
("Engagement", "Portrait") or links to a related page (the spot list filtered
to that use, a guide the studio is featured in). `st-tag-list` renders a group
of tags as a list. Tags never change state: they are not selected, pressed or
removed.

Use [`st-active-filters`](chip.md) for an applied filter the visitor can remove,
[`st-badge`](badge.md) for status or attention ("Prices may be out of date"),
[`st-status`](status-label.md) for an admin publish state, and
[`a[st-link]`](link.md) for a link inside running text.

Out of scope:

- Which tags a place has and their order: the server's stored best uses (from
  the fixed set engagement, family, portrait, brand, video, L2-019) and the
  guides that include a studio (L2-036). The component renders `items` in the
  order given.
- Building link paths (`/spots?use=engagement`, `/guides/best-natural-light`):
  the application, from `APP_PATHS` (ICD-API-11).
- The heading or caption that names a group ("Best uses", "Featured in", "Best
  for") and omitting the "Featured in" section for a studio in no guide: the
  application (L2-036.2).
- Placing the list in a card: [`st-location-card`](location-card.md) projects it into its default
  slot, under the card's stretched link, so a card only ever holds static tags.

## Usage

Every `.tags` and `.tag` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks tags "ul|div"` and `usage_inventory.py docs/mocks tag "li|a|span"`), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/spots/default`, `filtered` spot cards, `pages/home/*` spot cards; `dialogs/spot-filters/*` behind | static, `label="Best uses"`, projected into `st-location-card`'s default slot | Evergreen Brick Works: Engagement, Family, Portrait, Brand; Humber Bay Arch Bridge: Engagement, Portrait, Video; Allan Gardens Conservatory: Portrait, Engagement, Brand | default (compact) | card surface |
| `pages/spot/*` summary panel | static, no `label` (the visible "Best for" caption names it), in `st-summary-panel`'s default slot | Engagement, Family, Portrait, Brand | default (compact) | surface (summary panel) |
| `pages/spot/*` "Best uses" section | link, no `label` (the `h2` "Best uses" names it) | Engagement → `/spots?use=engagement`, Family → `/spots?use=family`, Portrait, Brand | default, hover, focus (large) | canvas |
| `pages/studio/default` "Featured in" | link, no `label` (the `h2` "Featured in" names it) | "Best natural light" → `/guides/best-natural-light` | default, hover, focus (large) | canvas |
| `pages/studio/stale` "Featured in" | link | "Best for a large crew" → `/guides/best-for-a-large-crew` | default (large) | canvas |
| Leslieville Daylight Studio's page (cast: two guides) | link | "Best studios under $120 for 2 hours", "Best natural light" | default; the longest title at 320 px | canvas |
| Bloordale Sun Studio's page (cast: no guide) | not rendered | `items` empty: the application omits the section; the component renders nothing | empty | — |

Every row is buildable with the API below: `items` carries the label and an
optional `link`; `label` names the list when no visible heading does.

## Anatomy

1. **Group** — `<ul class="tags">`: no markers, wrapping flex row, `--space-2`
   gap, `--space-1` top margin. Named by `aria-label` from `label` when set.
2. **Static tag** — `<li class="tag">`: compact pill, `--border-width-hairline`
   `--color-border-default` edge, no fill, `--text-caption` in
   `--color-fg-muted`, at least `--target-min` tall, `--space-2` padding,
   `white-space: nowrap`.
3. **Link tag** — `<li><a class="tag">`: the large size: `--text-body`,
   `--space-3` padding, at least `--target-comfortable` (44 px) tall, no
   underline. It is the accessible name and the target.

Host: the list must be a native `<ul>`, so `st-tag-list` renders it and the host
adds no box of its own (`:host { display: contents; }`, ICD-DOM-1).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `items` | `readonly { label: string; link?: string }[]` | — | yes | One tag per item, in the given order, tracked by `label` (labels are unique within a list). With `link`, the tag is an `a.tag` with `RouterLink` (large); without, an `li.tag` (compact) (D-1). Empty: renders nothing (D-2). |
| `label` | `string \| null` | `null` | no | `aria-label` on the `ul` when no visible heading or caption names the group ("Best uses" on cards). `null` renders no attribute. |

`link` is an application path, which may carry a query string
(`/spots?use=family`); the component turns it into a `UrlTree` so the query
survives (D-3).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Link tags navigate through `RouterLink`; static tags do nothing. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | All content comes from `items`. |

Translatable copy: `label` (marked `i18n-label` by the consumer) and each
item's `label` (best-use names from the application's catalogue; guide titles
are data). The component has no library strings (ICD §12).

## Variants and sizes

| Variant | Element | Use for |
|---|---|---|
| Static | `li.tag` | Facts on cards and in the summary panel: a spot's best uses. |
| Link | `li > a.tag` | Best uses on the spot page (to the filtered spot list, L2-019.2) and "Featured in" guides on a studio page (L2-036). |

| Size | When | Height | Padding | Type |
|---|---|---|---|---|
| Compact | every static tag | at least `--target-min` (24 px); not a target | `--space-2` | `--text-caption` |
| Large | every link tag | at least `--target-comfortable` (44 px) at every width | `--space-3` | `--text-body` |

The size follows the variant; there is no size input (D-1). Width comes from
the label.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default, static | — | Muted label, `--color-border-default` edge, no fill | List item text, "Engagement" |
| Default, link | — | As static, large size, no underline | Link, named by its label |
| Hover (link) | `:hover` | Label `--color-fg-default`, edge `--color-border-strong`; no fill, no underline; no transition | — |
| Focus (link) | `:focus-visible` | Shared `--focus-ring-width` ring in `--color-focus-ring`, offset `--focus-ring-offset`, following the pill | Focus on the link |
| Active (link) | `:active` | Same as hover; no pressed style | — |
| Disabled | never | A guide that is not published is not listed; a use that does not apply is left out | — |
| Empty | `items` is `[]` | Nothing rendered | Nothing |
| Wrapped group | not enough width | Tags flow onto more lines; a tag never wraps or truncates inside itself | Unchanged |

## Markup

```html
<!-- rendered: static, named by aria-label (spot card) -->
<st-tag-list>
  <ul class="tags" aria-label="Best uses">
    <li class="tag">Engagement</li><li class="tag">Family</li><li class="tag">Portrait</li><li class="tag">Brand</li>
  </ul>
</st-tag-list>
```

```html
<!-- rendered: links, named by the section heading -->
<st-tag-list>
  <ul class="tags">
    <li><a class="tag" href="/guides/best-studios-under-120">Best studios under $120 for 2 hours</a></li>
    <li><a class="tag" href="/guides/best-natural-light">Best natural light</a></li>
  </ul>
</st-tag-list>
```

The summary panel's mock writes `<li><span class="tag">`; the product renders
`<li class="tag">` for every static tag (the design system allows either). The
mocks' inline `style="font: var(--text-body); padding-inline: var(--space-3); min-height: var(--target-comfortable);"`
on link tags is dropped: the `a.tag` rule sets the large size. The `st-tag-list`
host element is not part of the contract (ICD-DOM-3).

```html
<!-- consumer: spot card best uses -->
<st-tag-list [items]="card.bestUses" i18n-label label="Best uses" />

<!-- consumer: spot page best uses (links) -->
<section class="review-section" aria-labelledby="uses">
  <h2 id="uses" i18n>Best uses</h2>
  <st-tag-list [items]="bestUseLinks()" />
</section>

<!-- consumer: studio page "Featured in" -->
@if (featuredIn().length) {
  <section class="review-section" aria-labelledby="featured">
    <h2 id="featured" i18n>Featured in</h2>
    <st-tag-list [items]="featuredIn()" />
  </section>
}
```

`bestUseLinks()` is built beside the page, one item per best use, for example
`{ label: 'Family', link: '/spots?use=family' }` with the label marked with
`$localize` and the path from `APP_PATHS`.

## Design

- Group: `display: flex; flex-wrap: wrap; gap: --space-2; list-style: none;
  padding: 0; margin: --space-1 0 0`.
- Tag: `inline-flex`, items centred, `gap: --space-1`, `white-space: nowrap`,
  `--border-width-hairline` solid edge, `--radius-full`.
- Compact: `min-height: --target-min`, `padding: 0 --space-2`, `--text-caption`.
- Large (`a.tag`): `min-height: --target-comfortable`, `padding-inline: --space-3`,
  `--text-body`, `text-decoration: none`.
- Focus: the global `:focus-visible` ring (`--focus-ring-width`,
  `--color-focus-ring`, `--focus-ring-offset`); the outline follows `--radius-full`.
- Motion: none; hover changes colour instantly.
- No component tokens; re-theme by changing the roles below.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Label | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Edge | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Label, hover | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Edge, hover | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Page and card behind | `--color-bg-canvas`, `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Tag label on the page |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Tag label on a card or the summary panel |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Hovered link-tag label |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Hovered link-tag edge |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |

The resting edge (`--color-border-default`) is decorative: the label carries
the meaning at 4.5:1, so the edge needs no 3:1 (it is listed as decorative in
`contrast-pairs.json`). Red accent is never used: on ShotThere red means
"selected", which a tag never is.

Forced colours: the tag opts out of forced-colour adjustment and draws a
hairline `CanvasText` edge (`components.css`).

## Responsive behaviour

- The size does not change by breakpoint: compact tags are never targets, and
  link tags are already 44 px tall at every width (L2-065).
- The group wraps onto as many lines as it needs; tags never shrink, truncate
  or scroll sideways. A single tag never wraps inside itself.
- The longest guide title, "Best studios under $120 for 2 hours", fits a 320 px
  column at the large size; guide titles are kept that short (design-system
  content rule).
- At 320 px nothing scrolls horizontally; at 200 % zoom every tag stays visible
  and every link tag operable.

## Accessibility

### Role and pattern

A native list (`ul`, `li`) of plain text items or native links. No ARIA widget
pattern: a tag is not a button and has no pressed or selected state. The list
is named with `aria-label` only when no visible heading or caption names it.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through link tags in order. Static tags are not in the tab order. |
| <kbd>Enter</kbd> | Follows the link: the filtered spot list or the guide. |

### Focus

Link tags show the shared 2 px `--color-focus-ring` on `:focus-visible` only.
The component never moves focus.

### Labelling

- The tag text is the accessible name; labels are unique within a group.
- A link tag's text is the destination ("Best natural light" is the guide's
  title); the section heading gives the context (WCAG 2.4.4).
- Link tags are not underlined: they sit in their own list under a heading, not
  in running text, so WCAG 1.4.1 does not require it; the pill edge marks them.
- A list read by a screen reader announces "Best uses, list, 4 items".

### Announcements

None.

### Motion

None: hover changes colour without a transition.

## Content and internationalisation

- Best uses come from the fixed set and are written exactly: "Engagement",
  "Family", "Portrait", "Brand", "Video". Sentence case, singular.
- Shown in the spot's stored order on every surface, so the card, the summary
  panel and the best-uses section agree.
- A "Featured in" tag is the guide's full title: "Best for a large crew".
- No counts, prices or verbs in tags; never a warning or status.
- Translatable: best-use names and `label` (the application's catalogue).
  Guide titles are data. French best uses ("Fiançailles", "Portrait") are
  longer; the group wraps.

## Performance

- Change detection: `OnPush`, signal inputs; the `UrlTree` for each link is
  computed once per `items` change in a `computed`, not in the template.
- `@for (item of items(); track item.label)` (ICD-PERF-2).
- Imports `@angular/core`, `RouterLink` and `Router` (for `parseUrl` only) from
  `@angular/router`.
- Performance scenario: the `components-harness` route `tag/performance` renders
  the spots list's five spot cards' best-use lists ("Best uses": Allan Gardens
  Conservatory, Trinity Bellwoods Park, Evergreen Brick Works, Humber Bay Arch
  Bridge, Distillery District) and Evergreen Brick Works' four link tags,
  held to the L2-071 layout-shift budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: tags are server-rendered at their final size; nothing loads later.

## Acceptance criteria

### Rendering

- **AC-1** Given Evergreen Brick Works' card on the spot list with `label="Best uses"`, when it renders, then it shows a `ul.tags` named "Best uses" with four `li.tag` items, "Engagement", "Family", "Portrait", "Brand", in that order, and no links. (L2-019)
- **AC-2** Given Humber Bay Arch Bridge tagged engagement, portrait and video, when its card renders, then exactly three tags show, "Engagement", "Portrait", "Video", and no others. (L2-019)
- **AC-3** Given Evergreen Brick Works' page, when the visitor activates the "Family" link tag in the "Best uses" section, then the spot list opens at `/spots?use=family` with the Family filter applied. (L2-019)
- **AC-4** Given Leslieville Daylight Studio, featured in two published guides, when its page renders, then the "Featured in" section's list has two link tags, "Best studios under $120 for 2 hours" and "Best natural light", each linking to its guide. (L2-036)
- **AC-5** Given `items` is empty (Bloordale Sun Studio, in no guide), when the component renders, then it renders no `ul` and no tag. (L2-036)

### States

- **AC-6** Given "Best natural light" on The Junction Loft's page at 1280 px, when the pointer hovers it, then its label becomes `--color-fg-default` and its edge `--color-border-strong`, with no underline and no fill, and the label stays at least 4.5:1 against the page. (L2-068)

### Keyboard and focus

- **AC-7** Given Evergreen Brick Works' page, when a keyboard user tabs through the "Best uses" section and the summary panel, then focus visits the four link tags in order and skips the summary panel's static tags, and Enter on "Portrait" opens `/spots?use=portrait`. (L2-067)
- **AC-8** Given focus on the "Engagement" link tag, when it is focused by keyboard, then a 2 px `--color-focus-ring` ring follows the pill with at least 3:1 contrast against the page, and no ring shows when the tag is clicked with a mouse. (L2-067)

### Screen readers

- **AC-9** Given the spot list and Evergreen Brick Works' page in light and dark, when axe-core scans them, then no violation involves a tag list, each card's list is named "Best uses", and each link tag's name is its label. (L2-069)

### Theming

- **AC-10** Given static tags on a card and link tags on the page, when the contrast check runs in light and dark, then every tag label is at least 4.5:1 against what is behind it and the hovered edge at least 3:1. (L2-068)

### Responsive

- **AC-11** Given Evergreen Brick Works' page at 360 px and at 1280 px, when the link tags are measured, then each is at least 44 CSS px tall, and the static tags on its card are at least 24 px tall and not focusable. (L2-065)
- **AC-12** Given Leslieville Daylight Studio's page at 320 px wide, when "Best studios under $120 for 2 hours" renders, then the tag is on one line inside the column, the group wraps, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-13** Given Evergreen Brick Works' page at 200 % zoom in a 1280 px viewport, when the visitor reaches the "Best uses" section, then all four link tags are visible and operable with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): tags have no
animation; hover changes colour without a transition
([tag.html](../../design-system/components/tag.html), Accessibility › Motion).

### Performance

- **AC-14** Given the `tag/performance` harness route with the five spot cards' best uses and Evergreen Brick Works' link tags, when it is measured with Lighthouse on the mobile profile, then Cumulative Layout Shift is at most 0.1 and no tag moves after first paint. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/tag-list/`: `tag-list.component.ts`
  (`TagListComponent`, selector `st-tag-list`), `tag-list.component.html`,
  `tag-list.component.css` (port of `.tags`, `.tag`, `a.tag` and `a.tag:hover`
  from `components.css`; `:host { display: contents; }`). The item type is the
  inline `{ label: string; link?: string }` ICD-002 fixes; it needs no named file.
- Template: `@if (items().length) { <ul class="tags" [attr.aria-label]="label()"> @for (…; track item.label) { … } </ul> }`.
- Links: a `computed` maps each `link` to `inject(Router).parseUrl(link)` and
  binds `[routerLink]` to the `UrlTree` (D-3). No navigation call, no URL reading.
- Not ported: `.tag .icon` (no screen uses a tag icon, and `items` carries none).
- The DS rule that raises `.location-card .tags` above the card's stretched link
  is not ported here: the card keeps its projected tags under the link and allows
  no link tags in a card ([location-card.md](location-card.md)).

## Decisions

- **D-1** *The design system has a compact and a large tag; ICD-002 gives `st-tag-list` no size input.* The size follows the kind: static tags are compact, link tags large, exactly as the design system's `a.tag` rule does ("Large is the default for a.tag"). Every mock use fits this, and a compact link tag would fail the 44 px target (L2-065), so no input is needed.
- **D-2** *What renders for an empty `items`?* Nothing, not an empty `ul`: an empty list is announced as "list, 0 items". The application still omits the "Featured in" heading itself (L2-036.2).
- **D-3** *`RouterLink` bound to a string encodes `?`, so `/spots?use=family` would lose its query.* The component parses each `link` with `Router.parseUrl` into a `UrlTree` and binds that. Parsing neither navigates nor reads the current URL, so ICD-API-11 holds, and the application keeps passing one path string per ICD-002.
- **D-4** *The summary panel mock nests `<span class="tag">` in the `li`; the cards put the class on the `li`.* The component always renders `li.tag` for static tags; the design system allows either, and one shape keeps the component object simple.
- **D-5** *Is the summary panel's "Best for" list named?* No `label` there: the design system has the visible caption "Best for" name it, and naming it again would read the group name twice.
