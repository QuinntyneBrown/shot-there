# Guide entry

| Field | Value |
|---|---|
| Selector | `st-guide-entry` (*application*); the guide index lists (`ul.guide-index`) are page markup with no component of their own (D-4) |
| Library path | `frontend/projects/shot-there/src/app/features/guides/guide-entry/` |
| Status | planned |
| Traces to | L2-034, L2-035, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071, L2-072, L2-074, L2-086 |
| Design system | [`guide-entry.html`](../../design-system/components/guide-entry.html) |
| Source mocks | [`pages/guide/default`](../../mocks/pages/guide/default.html), [`pages/guides/default`](../../mocks/pages/guides/default.html), [`pages/guides/empty`](../../mocks/pages/guides/empty.html), [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/guide-editor/published`](../../mocks/pages/guide-editor/published.html) |
| Rendering | [`guide-entry.html`](guide-entry.html) |

## Purpose and scope

A guide is an editorial shortlist built from the same measurements as every
review: "Best studios under $120 for 2 hours", "Best natural light", "Best for
a large crew". A guide entry is one ranked place in it: the location card with
the rank beside the name, the one or two data points the guide ranks by, read
live from the review, the editor's note that justifies the rank, and a link to
the full review (L2-034). The guide index lists the guides themselves: as
cards on the guides page and as a compact title-and-summary list on the home
page (L2-035).

`GuideEntryComponent` is an application component in `features/guides`
(the `view-guide` detailed design names it). It composes the library's
[`st-location-card`](location-card.md) and [`a[st-link]`](link.md) and owns the
application CSS blocks `.guide-list`, `.guide-entry*` (except the rank disc,
location-card D-8) and `.guide-index` (ICD-002 §11.2). Use the location card in
`ul[st-location-grid]` for the studio and spot lists, where the order is the
visitor's sort and there is no rank.

Out of scope:

- Loading the guide, dropping draft locations and computing live data points:
  the server (`getGuide`) and `guide-view-model.ts` (L2-034.2, L2-034.3).
- The card itself (photo, rank disc, name link, meta, hover and focus): the
  [location card CRD](location-card.md).
- The guide page's title, introduction, breadcrumb and `review-head`: the guide
  page (`GuidePageComponent`).
- The "Featured in" links on a studio page (L2-036): `FeaturedInComponent` in
  `features/studios`, which uses [`st-tag-list`](tag.md), not guide entries.
- The guide editor's entry rows (`.image-row--entry`): the guide editor.

## Usage

Every `.guide-entry`, `.guide-list` and `.guide-index` in `docs/mocks/`
(inventory from `usage_inventory.py docs/mocks guide-entry "li|div"` and
`guide-index "ul"`, plus grep).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/guide/default` | `ol.guide-list role="list"` of three `st-guide-entry`; card `rank` 1–3, `headingLevel` 2, `priority` on the first | data points "All-in for 2 hours" "$80.00", "Overall" "3.2" + hidden " out of 5"; note; "Read the full review" + hidden " of Kensington Window Room" | default, hover, focus (card and link) | canvas |
| DS page (light and crew guides) | Same entry, other data points | "Light score" "5" + " out of 5", "Windows face" "North"; "Usable space" "9.1 m × 7.3 m (30 ft × 24 ft)", "Ceiling height" "5.5 m (18 ft)" | default, image failed | canvas |
| `pages/guides/default` | `ul.guide-index` of `st-location-card`, `headingLevel` 2, `secondaryMeta` "3 studios · Updated 3 Oct 2026", image of the first entry, `priority` on the first | summary `<p>` in the card's default slot | default, hover, focus | canvas |
| `pages/guides/empty` | No list: `st-empty-state` "No guides yet" with "Browse studios" | — | no guides | canvas |
| `pages/home/default` "Guides" | `ul.guide-index` of `li.stack.stack--sm`: `h3` link and `p.subtitle` summary, no images | — | default; section hidden when there are no guides | canvas |
| `pages/guide-editor/published` | Entry order and notes as the owner writes them | — | — | Not this component (guide editor) |

Every row is buildable with the inputs below and the location card's API
(including its default slot and `secondaryMeta`, location-card D-2).

## Anatomy

1. **Guide list** — `ol.guide-list` with `role="list"`, written by the guide
   page: no markers, `--space-12` between entries. Each child is an `<li>`
   holding one `st-guide-entry`.
2. **Entry** — the host `st-guide-entry` with class `guide-entry`: a
   `--border-width-hairline` `--color-border-default` top rule, `--space-8`
   above the content; one column, then card and body side by side from 48rem.
3. **Card** — [`st-location-card`](location-card.md) with `rank`,
   `headingLevel` 2, `meta`, `image`, no facts and no actions. Rank disc,
   photo, name link and meta are the card's.
4. **Body** — `.guide-entry__body`: a column of the data, the note and the
   link, `--space-4` apart.
5. **Data points** — `.guide-entry__data`, a `<dl>` of one or two
   `<div><dt><dd>` pairs: label in `--text-label` `--color-fg-subtle`, value in
   `--text-h4` tabular figures, optional visually hidden suffix.
6. **Editor's note** — `.guide-entry__note`, `--text-body-lg`.
7. **Review link** — `a[st-link] standalone` (`.link--standalone`): "Read the
   full review" plus a visually hidden " of {name}".

Guide index (page markup, D-4):

8. **Index list** — `ul.guide-index`: one column, two from 48rem, `--space-8`
   gap. On the guides page each `<li>` holds an `st-location-card`; on the home
   page each `<li class="stack stack--sm">` holds an `h3` with a link and a
   `p.subtitle` summary.

## API

### `st-guide-entry` (application)

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `entry` | `GuideEntryView` | — | yes | The view model `guide-view-model.ts` builds from `GuideEntryDto` (D-1): `name`, `link` (review path from `APP_PATHS`), `image` (`ResponsiveImage \| null`), `meta` ("Kensington Market · Reviewed 3 Oct 2026"), `dataPoints` (`readonly Fact[]`, one or two, formatted for `en-CA`, scores with `srSuffix` " out of 5"), `note`. |
| `rank` | `number` | — | yes | The entry's 1-based position in the rendered list (`$index + 1`), passed to the card's `rank` (D-2). |
| `priority` | `boolean` | `false` | no | Passed to the card; the guide page sets it on the first entry only (ICD-MEDIA-2). |

`GuideEntryView` is an interface in `guide-entry-view.ts` beside the page (one
type per file). Inputs are signal inputs; `priority` uses `booleanAttribute`.

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Both interactive parts are native links. |

#### Content slots

None. Every string is in `entry` or in the component's own i18n-marked
template ("Read the full review", " of {name}").

### Guide index (page markup)

| Page | Markup | Data |
|---|---|---|
| Guides page (`GuidesIndexPageComponent`) | `<ul class="guide-index">` › `<li>` › `st-location-card` with `headingLevel` 2, `name` = title, `link` = guide path, `image` = first entry's image, `priority` on the first, default slot `<p>` summary, `secondaryMeta` "3 studios · Updated 3 Oct 2026" | `GuideIndexItemView` from the page's view model (D-9) |
| Home page (`HomePageComponent`) | `<ul class="guide-index">` › `<li class="stack stack--sm">` › `<h3><a routerLink>title</a></h3>` + `<p class="subtitle">summary</p>` | title, summary, link |
| No published guides | Guides page: `st-empty-state` "No guides yet", text "Guides group the studios we've reviewed by budget, light and crew size. The first ones are on the way.", action `a[st-button]` primary "Browse studios". Home: the "Guides" section is not rendered. | — |

## Variants and sizes

| Variant | Use for |
|---|---|
| Ranked entry | Every entry on a guide page. The data points follow the guide's subject: price guide "All-in for 2 hours" + "Overall"; light guide "Light score" + "Windows face"; crew guide "Usable space" + "Ceiling height". |
| Index card | A guide on the guides page (photo, title, summary, count and date). |
| Compact index item | A guide on the home page (title and summary, no photo), so the latest reviews above stay the visual lead. |

One size. The entry changes layout by breakpoint, not by size.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Rule, card, body | `listitem` n of 3; `h2` name link; data `dl`; link |
| Card hover | `:hover` on the card | Photo zoom, name underline (card CRD) | — |
| Card focus | name link `:focus-visible` | Ring around the whole card, `--space-2` out | Focus on "Kensington Window Room" |
| Review link hover | `:hover` | `--color-fg-link-hover`, thicker underline (link CRD) | — |
| Review link focus | `:focus-visible` | Standard `--color-focus-ring` ring | Focus on "Read the full review of Kensington Window Room" |
| Active | `:active` | Same as hover; no pressed style | — |
| Image failed | card image errors | 3:2 slot keeps its size with the `.media-fallback` icon (card CRD) | Nothing announced |
| Entry omitted | the location is draft (server omits it) | Not rendered; the next entry moves up and the discs read 1, 2 with no gap | List of 2 |
| Value changed | the review's value changed | The data point shows the new value on next render; the note is unchanged | — |
| Disabled | — | Never; a draft location's entry is omitted | — |
| No guides | zero published guides | Guides page: empty state "No guides yet"; home: no Guides section | Empty-state heading `h2` |
| Index hover / focus | on an index card or home title link | Card: as the location card. Home title: standard link hover and focus ring | — |

## Markup

```html
<!-- rendered: guide page list (GuidePageComponent) with the first entry -->
<ol class="guide-list" role="list">
  <li>
    <st-guide-entry class="guide-entry">
      <st-location-card class="location-card">
        <div class="location-card__media">…<img alt="" width="1200" height="800" loading="eager" fetchpriority="high" sizes="(min-width: 48rem) 18rem, 100vw" …>…</div>
        <div class="cluster">
          <span class="guide-entry__rank" aria-hidden="true">1</span>
          <h2 class="location-card__name"><a href="/studios/kensington-window-room">Kensington Window Room</a></h2>
        </div>
        <p class="location-card__meta">Kensington Market · Reviewed 3 Oct 2026</p>
        <div class="location-card__actions"></div>
      </st-location-card>
      <div class="guide-entry__body">
        <dl class="guide-entry__data">
          <div><dt>All-in for 2 hours</dt><dd>$80.00</dd></div>
          <div><dt>Overall</dt><dd>3.2<span class="visually-hidden"> out of 5</span></dd></div>
        </dl>
        <p class="guide-entry__note">The cheapest room we've shot in, and the light is the reason to book it: big east-facing windows over Augusta Ave. Book a morning; by mid-afternoon the room goes flat.</p>
        <a class="link--standalone" href="/studios/kensington-window-room">Read the full review<span class="visually-hidden"> of Kensington Window Room</span></a>
      </div>
    </st-guide-entry>
  </li>
</ol>
```

```html
<!-- rendered: guides page index card -->
<ul class="guide-index">
  <li>
    <st-location-card class="location-card">
      <div class="location-card__media">…<img alt="" … loading="eager" fetchpriority="high">…</div>
      <h2 class="location-card__name"><a href="/guides/best-studios-under-120">Best studios under $120 for 2 hours</a></h2>
      <p>Three studios where a standard 2-hour shoot, with every mandatory fee, comes in under $120.</p>
      <p class="location-card__meta">3 studios · Updated 3 Oct 2026</p>
      <div class="location-card__actions"></div>
    </st-location-card>
  </li>
</ul>
```

```html
<!-- rendered: home page compact index -->
<ul class="guide-index">
  <li class="stack stack--sm"><h3><a href="/guides/best-studios-under-120">Best studios under $120 for 2 hours</a></h3><p class="subtitle">Three studios where 2 hours with mandatory fees comes in under $120.00.</p></li>
</ul>
```

```html
<!-- consumer: GuideEntryComponent template (guide-entry.component.html) -->
<st-location-card [name]="entry().name" [link]="entry().link" [image]="entry().image" [priority]="priority()"
                  imageSizes="(min-width: 48rem) 18rem, 100vw" [headingLevel]="2" [rank]="rank()" [meta]="entry().meta" />
<div class="guide-entry__body">
  <dl class="guide-entry__data">
    @for (point of entry().dataPoints; track point.term) {
      <div><dt>{{ point.term }}</dt><dd>{{ point.detail }}@if (point.srSuffix) {<span class="visually-hidden">{{ point.srSuffix }}</span>}</dd></div>
    }
  </dl>
  <p class="guide-entry__note">{{ entry().note }}</p>
  <a st-link standalone [routerLink]="entry().link"><ng-container i18n>Read the full review</ng-container><span class="visually-hidden" i18n> of {{ entry().name }}</span></a>
</div>

<!-- consumer: GuidePageComponent -->
<ol class="guide-list" role="list">
  @for (entry of entries(); track entry.link; let i = $index) {
    <li><st-guide-entry [entry]="entry" [rank]="i + 1" [priority]="i === 0" /></li>
  }
</ol>
```

The host carries `guide-entry` through a host binding. Element names of hosts
are not part of the contract; page objects select `.guide-entry`,
`.guide-entry__data`, roles and names.

## Design

- Entry (`.guide-entry`): `display: grid`, one column `minmax(0, 1fr)`; from
  48rem `minmax(0, 18rem) minmax(0, 1fr)`; gap `--space-4` `--space-8`;
  `padding-top` `--space-8`; top border `--border-width-hairline` solid
  `--color-border-default`. No `overflow: hidden`, so focus rings are not
  clipped.
- List (`.guide-list`): no markers, no padding, flex column, gap `--space-12`.
  The DS's `guide-entry` counter is not ported (D-13).
- Body: flex column, gap `--space-4`, `min-width: 0`.
- Data: flex row wrapping, gap `--space-4` `--space-8`; `dt` `--text-label` in
  `--color-fg-subtle`; `dd` no margin, `--text-h4`, tabular figures.
- Note: `--text-body-lg` in `--color-fg-default`.
- Review link: `.link--standalone` (`--text-label` at `--font-size-md`,
  `--target-comfortable` minimum height), from the link component; the entry
  places its host with `align-self: flex-start`, so the link and its focus ring
  are only as wide as the text (D-14).
- Index (`.guide-index`): no markers, no padding, grid one column, two from
  48rem, gap `--space-8`. Home items use the global `.stack.stack--sm` and
  `.subtitle` utilities.
- Motion: none of its own; the card photo zoom is the card's.

No component tokens; the entry reads semantic tokens only.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Entry rule (decorative) | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Data value, note | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Data label | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Card meta, home summary | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Rank disc (card) | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Review link | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Values, note, names |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Data labels |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Meta, home summaries |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Rank on its disc |
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Review link and home title links |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus rings |

The entry rule is decorative (headings and list structure separate the
entries), so WCAG 1.4.11 does not apply. Forced colours: the rule becomes
`CanvasText`, links `LinkText`, focus `Highlight`.

## Responsive behaviour

| Viewport | Entry | Guide index |
|---|---|---|
| XS, SM (below 48rem) | One column: card (photo, rank and name, meta), then data, note, link | One column |
| MD and up (48rem) | Card at most 18rem on the left, body fills the rest, `--space-8` gutter | Two columns |

- Entries keep `--space-12` between them at every width.
- Data points wrap as label-over-value pairs; a long measurement ("9.1 m ×
  7.3 m (30 ft × 24 ft)") moves to its own line rather than shrinking.
- The rank disc never shrinks; a long name ("Leslieville Daylight Studio")
  wraps beside it.
- At 320 px nothing scrolls horizontally or clips (L2-034.4, L2-064.1); at 200 %
  zoom everything stays available; the review link is at least 44 px tall and
  every target is at least 24 × 24 CSS px.

## Accessibility

### Role and pattern

A native ordered list: `<ol class="guide-list" role="list">` of `<li>`, so
screen readers announce "list, 3 items" and each position. `role="list"` keeps
the list semantics in WebKit despite `list-style: none` (D-5). The visible rank
is `aria-hidden`, so the position is announced once. Data points are a `<dl>`
with each pair in a `<div>`. The guide index is a plain `<ul>`; its order has
no meaning.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Each entry's name link, then "Read the full review", then the next entry. Photo, rank and data are not focusable. |
| <kbd>Enter</kbd> | Follows the focused link to the review (entries) or the guide (index). |
| Heading navigation | Each entry name is an `h2` under the guide's `h1`. |

### Focus

The name link's ring goes round the whole card (location card); the review
link gets the standard ring. Neither is clipped. The component never moves
focus.

### Labelling

- Card link: the location name. Review link: "Read the full review of
  Kensington Window Room" (visible text first, so WCAG 2.5.3 holds; unique in a
  links list, WCAG 2.4.4).
- Scores add a visually hidden " out of 5".
- Photos are decorative (`alt=""`).
- Headings: `h2` names on a guide page, `h2` names on the guides page, `h3`
  titles under the home page's `h2` "Guides".

### Announcements

None: the guide is static content.

### Motion

The design-system rule (no AC; L2 has no motion requirement): only the card
photo moves on hover, and under `prefers-reduced-motion: reduce` it does not
zoom; the underline still marks hover
([guide-entry.html](../../design-system/components/guide-entry.html),
Accessibility › Motion).

## Content and internationalisation

- Guide titles name the reader's need, sentence case, threshold in the title:
  "Best studios under $120 for 2 hours".
- Index summaries say what the guide ranks by, one sentence: "Studios where the
  windows do the work, ranked by our light score and window direction."
- Data labels are short nouns matching the review: "All-in for 2 hours",
  "Overall", "Light score", "Windows face", "Usable space", "Ceiling height".
  Prices CAD with cents ("$80.00"); measurements metric first with imperial in
  brackets; formatted by the view model for `en-CA` (L2-070.3).
- Editor's notes: two or three sentences of first-hand judgement that never
  repeat a data point (it would go stale; the public guide's note is the
  reference, D-7).
- Meta: "3 studios · Updated 3 Oct 2026".
- Translatable: "Read the full review", " of {name}", data labels, " out of 5",
  the meta template, the empty state. Data: names, notes, titles, summaries.
- Longer translations wrap; nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs; `@for` over data points tracks
  `term`; no formatting in the template (the view model formats).
- Performance scenario: application components have no harness route; the
  guide page `/guides/best-studios-under-120` and the guides index `/guides`
  are measured with Lighthouse in mobile mode against the L2-071 budgets
  (D-10).
- Regression rule: a change to the entry's template or styles is measured on
  those pages against the base branch before it is pushed.
- Layout stability: the card reserves the 3:2 photo frame; only the first
  entry's photo is eager; the page renders on the server, so no skeleton.
- Weight: `@angular/core`, `RouterLink`, `@shot-there/components`
  (`LocationCardComponent`, `LinkComponent`).

## Acceptance criteria

### Rendering

- **AC-1** Given the guide "Best studios under $120 for 2 hours" with Kensington Window Room first, when the page renders, then the first `.guide-entry` holds a card with rank "1" and an `h2` link "Kensington Window Room", the data "All-in for 2 hours" "$80.00" and "Overall" "3.2", the note "The cheapest room we've shot in…", and a link to `/studios/kensington-window-room`. (L2-034)
- **AC-2** Given the guide's three entries in the configured order, when the page renders, then the `ol.guide-list` has `role="list"` and three entries in the order Kensington Window Room, Leslieville Daylight Studio, Riverside Rooftop Studio with rank discs 1, 2, 3. (L2-034)
- **AC-3** Given Leslieville Daylight Studio has gone back to draft, when the guide renders, then two entries are shown, Kensington Window Room and Riverside Rooftop Studio, with rank discs 1 and 2. (L2-034)
- **AC-4** Given Kensington Window Room's all-in cost changes to $95.00 without the guide being edited, when the guide page next renders, then its entry's "All-in for 2 hours" reads "$95.00" and its note is unchanged. (L2-034)

### Guide index

- **AC-5** Given two published guides and the draft "Best for headshots", when a visitor opens the guides page, then `ul.guide-index` lists two cards, each with an `h2` title link, its summary and its "studios · Updated" line, and "Best for headshots" is absent. (L2-035)
- **AC-6** Given the guides page, when the visitor activates the card "Best natural light" anywhere on it, then the guide page `/guides/best-natural-light` opens. (L2-035)
- **AC-7** Given the home page with three published guides, when it renders, then its "Guides" section lists three `h3` title links each followed by a `p.subtitle` summary and no images. (L2-035)
- **AC-8** Given no published guides, when a visitor opens the guides page, then no `ul.guide-index` is rendered, the empty state "No guides yet" with a "Browse studios" link to `/studios` is shown, and the home page renders no "Guides" section. (L2-035)
- **AC-9** Given the guides page fetched with JavaScript disabled, when the HTML arrives, then every published guide's title, link and summary are in it. (L2-074)

### Images

- **AC-10** Given the guide page, when it renders, then the first entry's card image has `loading="eager"` and `fetchpriority="high"`, the others `loading="lazy"`, and each has `sizes="(min-width: 48rem) 18rem, 100vw"` and `alt=""`. (L2-072)
- **AC-11** Given Riverside Rooftop Studio's card image returns HTTP 404, when the guide renders, then its 3:2 slot keeps its size with the fallback icon and the entry's data, note and link do not move. (L2-086)

### Keyboard and focus

- **AC-12** Given the guide page, when a keyboard user tabs from Kensington Window Room's name link, then focus moves to "Read the full review of Kensington Window Room", then to "Leslieville Daylight Studio". (L2-067)
- **AC-13** Given keyboard focus on "Read the full review of Leslieville Daylight Studio", when it is inspected, then a ring of at least 2 px in `--color-focus-ring` with at least 3:1 contrast against the page surrounds it and is not clipped by the entry. (L2-067)

### Screen readers

- **AC-14** Given the guide page, when a screen reader lists headings and lists, then it finds one `h1` "Best studios under $120 for 2 hours", three `h2` entry names, a list of 3 items, no announced rank digits, and "Overall, 3.2 out of 5" in the first entry's data. (L2-069)
- **AC-15** Given the guide page and the guides page, when axe-core scans them at 320 px and 1280 px in light and dark, then no violation is reported. (L2-069)

### Theming

- **AC-16** Given the guide page in the light and the dark theme, when the contrast check runs, then values, notes, data labels, meta and the review link are at least 4.5:1 against the page and the rank is at least 4.5:1 on its disc. (L2-068)

### Responsive

- **AC-17** Given the guide page at 360 px wide, when it renders, then each entry is one column with the card above the data, and "9.1 m × 7.3 m (30 ft × 24 ft)" wraps to its own line rather than overflowing. (L2-034)
- **AC-18** Given the guide page at 1280 px wide, when it renders, then each card is at most 18rem wide on the left with the body beside it, and the guides page index shows two columns. (L2-064)
- **AC-19** Given the guide page and the guides page at 320 px wide, when they render, then `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-20** Given the guide page at 360 px wide, when "Read the full review of Kensington Window Room" is measured, then it is at least 44 CSS px tall. (L2-065)

### Performance

- **AC-21** Given the guide page `/guides/best-studios-under-120` with three entries, when it is measured with Lighthouse in mobile mode, then LCP is at most 2.5 s and CLS at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/shot-there/src/app/features/guides/guide-entry/`:
  `guide-entry.component.ts|html|css` (`GuideEntryComponent`, selector
  `st-guide-entry`, host class `guide-entry`). The view model interface
  `GuideEntryView` lives in `features/guides/guide-page/guide-entry-view.ts`,
  built by `guide-view-model.ts` beside the guide page (the design's
  `reviewLink` becomes `GuideEntryView.link`).
- Feature CSS: `.guide-entry`, `.guide-entry__body`, `.guide-entry__data*`,
  `.guide-entry__note` in `guide-entry.component.css`; `.guide-list` in the
  guide page's CSS; `.guide-index` in the guides page's and the home page's CSS
  (D-4). `.guide-entry__rank` is the location card's (location-card D-8).
- Imports from `@shot-there/components`: `LocationCardComponent`,
  `LinkComponent`, `EmptyStateComponent` (guides page), `ButtonComponent`
  (empty-state action); `RouterLink` from `@angular/router`.
- Depends on the location card's additive inputs (`secondaryMeta`, default
  slot) for the guides page cards (location-card D-2).
- Data gap: `GuideSummaryDto` (`browse-guides`) has `slug`, `title`, `summary`
  only; the index card also needs the first entry's image, the published entry
  count and the update date (D-9).
- Mock drift corrected: `role="list"` added to `ol.guide-list` (D-5); the rank
  row's inline style goes (location-card D-8); the guide editor's Kensington
  note follows the public one (D-7).

## Decisions

- **D-1** *The `view-guide` design gives `GuideEntryComponent` an `entry: GuideEntryDto` input and a computed `reviewLink`, but also says `guide-view-model.ts` formats data points and builds the review link.* `entry` is the view model `GuideEntryView`, not the DTO. Formatting and links are application rules that live in plain TypeScript beside the page (AGENTS.md), and a component that received the DTO would have to format.
- **D-2** *Does the rank come from `GuideEntryDto.position` or from the list position?* The list position (`$index + 1`) through a required `rank` input. L2-034.2 omits draft entries and the DS says the remaining entries renumber; a stored position would leave a gap.
- **D-3** *The DS writes `<li class="guide-entry">`; the component is an element.* The guide page writes a bare `<li>` and the host carries `guide-entry`, the same structure as the location card in its grid (location-card D-1). The list semantics are unchanged.
- **D-4** *Is the guide index a component?* No. It is a list on two pages with different items (cards on the guides page, title and summary on the home page), and a shared application component would make `features/home` import from `features/guides`, against the feature → core → libraries direction. Each page writes its own `ul.guide-index` and ports the three-line `.guide-index` rule into its own CSS; the cards are `st-location-card`.
- **D-5** *The guide mock's `ol.guide-list` has `list-style: none` and no role.* `role="list"`, as the DS requires, so VoiceOver keeps the list and the position (the rank is `aria-hidden`).
- **D-6** *Which heading levels?* Entry names `h2` under the guide `h1`; guides page cards `h2` under the page `h1` "Guides"; home titles `h3` under the section `h2` "Guides" (DS Labelling, L2-069.1).
- **D-7** *The guide editor mock shows a different note for Kensington Window Room that repeats the price.* The public guide's note is the reference (DS Sources); notes never repeat a data point.
- **D-8** *How is the review link built?* `a[st-link] standalone` with `routerLink`, text "Read the full review" and a visually hidden " of {name}", as the DS and the mock show.
- **D-9** *The guides page cards show a photo, the entry count and the update date, but `GuideSummaryDto` carries only slug, title and summary; L2-035 asks for title and summary.* The CRD follows the DS and the mock: the index card shows photo, title, summary and "3 studios · Updated 3 Oct 2026". The DTO needs three more fields (first entry's image, published entry count, updated date); that is an additive change to the `browse-guides` design and ICD-001, made upstream before this slice.
- **D-10** *Which performance scenario does an application component name?* The pages it renders on, measured with Lighthouse; the `components-harness` hosts library components only (ICD-002 D-12).
- **D-11** *What do the guides page and the home page show with no published guides?* The guides page shows the empty state "No guides yet" with "Browse studios" (`pages/guides/empty`); the home page omits its "Guides" section, as the DS States section says.
- **D-12** *Does the card in an entry keep its stretched link over the photo and meta?* Yes; the name link covers the card only, not the body, so the body's own link stays the second tab stop and nothing is nested.
- **D-13** *The DS increments a `guide-entry` CSS counter that nothing displays.* Not ported; the rank is the `rank` input (D-2).
- **D-14** *In the body's flex column the review link stretches to the full width, so its focus ring and hit area run across the empty space after "Read the full review".* The entry sets `align-self: flex-start` on the link host, which ICD-DOM-5 allows (flex placement of a library host); the ring then hugs the text.
