# Score and pips

| Field | Value |
|---|---|
| Selector | `st-score-list`, `st-score-overall`, `st-light-rating` |
| Library path | `frontend/projects/components/src/lib/score/` |
| Status | planned |
| Traces to | L2-006, L2-011, L2-015, L2-064, L2-066, L2-068, L2-069, L2-070, L2-071, L2-074 |
| Design system | [`score.html`](../../design-system/components/score.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/studio/minimal`](../../mocks/pages/studio/minimal.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/studio/playing`](../../mocks/pages/studio/playing.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/no-video`](../../mocks/pages/spot/no-video.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/spot/no-rain-backup`](../../mocks/pages/spot/no-rain-backup.html), [`pages/spot/map-failed`](../../mocks/pages/spot/map-failed.html), [`pages/compare/default`](../../mocks/pages/compare/default.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/guide/default`](../../mocks/pages/guide/default.html) |
| Rendering | [`score.html`](score.html) |

## Purpose and scope

Every studio is scored on the same six-part rubric and every location's natural
light is rated on the same four-step scale, so locations compare side by side.
This CRD covers the three library parts that state those judgements on a
review page: `st-score-overall` prints the server's overall score ("3.8
overall, out of 5"), `st-score-list` prints the six rubric rows (Value, Light,
Space, Gear, Logistics, Condition) with five pips and the number, and
`st-light-rating` prints one natural-light rating as three pips and a word
("Medium"). A score is always a number or a word with pips beside it as a quick
visual read; pips are never the only carrier of the value.

Where space is tight (a location card, a guide entry, a comparison cell) the
pips are dropped and only the number with "out of 5" remains. That compact
score is not one of these components: it is a `Fact` with `srSuffix` in
[`st-location-card`](location-card.md) and [`st-description-list`](description-list.md),
and plain markup in the application's comparison table (D-2). Its markup is
fixed under *Markup* so every surface reads the same.

Out of scope:

- Computing anything: the overall is the server's `overallScore`, formatted to
  one decimal by the application (ICD-I18N-4); the page never re-averages
  (L2-011.1, ICD-API-10). The application also maps `LightRating` to its
  i18n-marked word ("Strong").
- The verdict section, its "Verdict" heading, "Who it's for" and "Who should
  skip it": the application's `StudioVerdictComponent`.
- The natural-light tiles (`.light-grid`, `.light-grid__item`,
  `.light-grid__time`): application feature CSS (ICD-002 §11.2) in
  `StudioSpecificationsComponent`, which places one `st-light-rating` in each tile.
- The spot light table: [`table[st-table]`](table.md) with `.table--stack`,
  which places one `st-light-rating` in each "Rating" cell.
- Entering scores: the studio editor takes them as numbers in
  [`st-text-field`](text-field.md); pips are never a control.

## Usage

Every `.score-list`, `.score-overall`, `.light-rating` and `.pips` in
`docs/mocks/` (`usage_inventory.py docs/mocks score-list|score-overall|light-rating|pips "ul|p|span"`),
plus every compact score found by searching for "out of 5".

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/default`, `in-compare`, `playing`, `media-failed` verdict | `st-score-overall` + `st-score-list` | "3.8" / "overall, out of 5"; label "Rubric scores"; The Junction Loft 4 5 3 4 2 5 | values 2 to 5 | canvas (review section) |
| `pages/studio/minimal` verdict | same | Bloordale Sun Studio "4.0"; 4 5 4 4 3 4 | values 3 to 5 | canvas |
| `pages/studio/stale` verdict | same | Ossington Blackbox "3.8"; 3 2 5 5 4 4 | values 2 to 5 | canvas |
| `pages/studio/default`, `minimal`, `in-compare`, `playing`, `media-failed` specifications | `st-light-rating` in each application `.light-grid__item` | Morning Medium, Midday Strong, Afternoon Strong, Evening Low (Bloordale: Evening Medium) | low, medium, strong | sunken tile |
| `pages/studio/stale` specifications | `st-light-rating` ×4 | Ossington Blackbox: None at every time of day | none | sunken tile |
| `pages/spot/default`, `map-failed`, `no-rain-backup` light table | `st-light-rating` in `td[data-label="Rating"]` of `table[st-table]` `.table--stack` | Evergreen Brick Works: Morning Medium, Midday Low, Afternoon Medium, Golden hour Strong, Blue hour Low | low, medium, strong | table row; stacked card below 48rem |
| `pages/spot/no-video` | same | Trinity Bellwoods Park: Blue hour None | none … strong | table row / stacked card |
| `pages/spot/stale-permit` | same | Distillery District: Blue hour Medium | low, medium, strong | table row / stacked card |
| `pages/studios/default`, `pages/home/default` cards | compact, no pips (`st-location-card` fact) | "Score 3.8" + hidden " out of 5" | — | card surface |
| `pages/guide/default` entries | compact, no pips (`st-location-card` fact) | "Overall 3.2" + hidden " out of 5" | — | card surface |
| `pages/compare/default` table | compact, no pips (application markup) | "4" + visible " / 5" (hidden from AT) + hidden " out of 5"; overall in `<strong>` "3.8 / 5" | — | table cell |

Every review-page row is buildable with the API below: one `st-score-overall`
and one `st-score-list` per verdict, one `st-light-rating` per time of day
wherever the application puts it. The compact rows are built by their own
components (D-2).

## Anatomy

`st-score-overall`:

1. **Paragraph** — `p.score-overall`: value and scale on one baseline, `--space-2` apart, no reading measure.
2. **Value** — `span.score-overall__value`: `--text-display`, tabular figures, always one decimal ("3.8", "4.0").
3. **Scale** — `span.score-overall__max`: "overall, out of 5" in `--color-fg-muted`. A space text node separates it from the value, so it reads "3.8 overall, out of 5" (D-8).

`st-score-list`:

1. **List** — `ul.score-list` with `aria-label` ("Rubric scores"); one column, two from 48rem.
2. **Row** — `li.score`: three-column grid (label, pips, 2ch number), `--target-comfortable` tall, hairline divider underneath.
3. **Category label** — `span.score__label`, `aria-hidden="true"`.
4. **Pips** — `span.pips`, `aria-hidden="true"`: `max` `<i>` bars, the first `value` carrying `data-on`.
5. **Number** — `span.score__value`, `aria-hidden="true"`, right-aligned, tabular figures.
6. **Sentence** — `span.visually-hidden`: library string `st.score.text`, "Value: 4 out of 5".

`st-light-rating`:

1. **Rating** — the host element itself carries `.light-rating` (inline-flex, `--space-2` gap, `--text-label`).
2. **Pips** — `span.pips`, `aria-hidden="true"`: always three narrower bars (16 × 8 px); none 0, low 1, medium 2, strong 3 carry `data-on`.
3. **Word** — text node after the pips: the `text` input ("Medium"). It is the visible and the accessible value.

Hosts: `st-score-list` and `st-score-overall` render a native `<ul>` and `<p>`,
so their hosts add no box of their own (`display: contents`), as ICD-DOM-1
requires when the block must be a specific native element. `st-light-rating`
has no such element, so its host carries the block class:
`<st-light-rating class="light-rating">` (D-1).

## API

### `st-score-list`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The list's `aria-label` ("Rubric scores"). Product copy, marked `i18n-label` by the application. |
| `scores` | `readonly RubricScore[]` | — | yes | One `li.score` per item, in the given order, tracked by `label`. `value` fills that many pips and prints as the number; the hidden sentence is `st.score.text` with `label`, `value` and `max` (L2-068.3). Values are whole numbers 1 to 5 from the server; out-of-range values are clamped for the pips only (D-3). |
| `max` | `number` | `5` | no | Number of pips per row and the `{$max}` of the sentence. `numberAttribute`. |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Not interactive. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Everything comes from inputs. |

### `st-score-overall`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `string` | — | yes | The server's `overallScore` formatted by the application to one decimal ("3.8", "4.0"). Printed exactly as given. |
| `maxText` | `string` | — | yes | The scale beside the value. ShotThere passes "overall, out of 5" on the verdict (D-4). Product copy, marked `i18n-maxText`. |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Not interactive. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | |

### `st-light-rating`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `level` | `LightLevel` (`'none' \| 'low' \| 'medium' \| 'strong'`) | — | yes | Fills 0, 1, 2 or 3 of the three pips. The pips are `aria-hidden`. |
| `text` | `string` | — | yes | The word printed after the pips ("None", "Low", "Medium", "Strong"), chosen and i18n-marked by the application's view model (D-5). It is the visible and the accessible value. |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Not interactive. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | |

Library strings (ICD-002 §12): `st.score.text` "{$label}: {$value} out of {$max}"
in `st-score-list`, a `$localize` string with three placeholders and no
override input. `st-score-overall` and `st-light-rating` render no text of
their own.

## Variants and sizes

| Variant | Component | Use for |
|---|---|---|
| Overall | `st-score-overall` | The verdict's headline score, once per studio review. |
| Rubric list | `st-score-list` | The six rubric rows under the overall, always in the order Value, Light, Space, Gear, Logistics, Condition. |
| Light rating in a tile | `st-light-rating` inside `.light-grid__item` | A studio's four times of day (L2-006.4). |
| Light rating in a table | `st-light-rating` inside `td[data-label="Rating"]` | A spot's five times of day, beside a note (L2-015). |
| Compact (not a component) | `Fact.srSuffix` / application markup | Cards, guide entries and comparison cells: number only, no pips (D-2). |

| Size | Pip | Number / word | Notes |
|---|---|---|---|
| Rubric | 5 bars, `--space-5` × `--space-2` (20 × 8 px), `--space-1` apart | `--text-label` at `--font-size-md` | Row `--target-comfortable` tall. |
| Light | 3 bars, `--space-4` × `--space-2` (16 × 8 px), `--space-1` apart | `--text-label` | Inline, sized by its word. |
| Overall | no pips | `--text-display` value | One line at every width. |

Pips never scale with the viewport. Width comes from the container: the list
fills its column, the overall and the light rating size to their content.

## States

Pips are static: there is no hover, focus, active, pressed, disabled, loading
or error state, because nothing is interactive and the data arrives with the
server-rendered page. The states are the values.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Rubric value 1 to 5 | `RubricScore.value` | First `value` bars filled in `--color-fg-default`; the rest a 1 px `--color-border-strong` edge | "Space: 3 out of 5" |
| Rubric lowest / highest | value 1 / 5 | One filled bar / five filled bars; a rubric row never shows five empty bars | "Space: 1 out of 5" / "Light: 5 out of 5" |
| Light none | `level="none"` | Three empty edges, the word "None" | "None" |
| Light low / medium / strong | `level` | One / two / three filled bars and the word | "Low" / "Medium" / "Strong" |
| Overall lowest / highest | `value` | "3.2" (Kensington Window Room) / "4.2" (Liberty Cyc House), the same type | "3.2 overall, out of 5" |
| On a sunken tile | inside `.light-grid__item` | Same tokens; the empty edge keeps 3:1 against `--color-bg-surface-sunken` | — |
| In a stacked table card | inside `.table--stack` below 48rem | Same tokens on `--color-bg-surface`, under the "Rating" label | Read with its row header ("Golden hour") |
| Forced colours | `forced-colors: active` | Each bar a 1 px `CanvasText` border, filled bars `CanvasText`, `forced-color-adjust: none` | Unchanged; the number or word carries the value |

## Markup

```html
<!-- rendered: st-score-overall (host has display: contents) -->
<p class="score-overall"><span class="score-overall__value">3.8</span> <span class="score-overall__max">overall, out of 5</span></p>
```

```html
<!-- rendered: st-score-list, The Junction Loft (host has display: contents) -->
<ul class="score-list" aria-label="Rubric scores">
  <li class="score"><span class="score__label" aria-hidden="true">Value</span><span class="pips" aria-hidden="true"><i data-on></i><i data-on></i><i data-on></i><i data-on></i><i></i></span><span class="score__value" aria-hidden="true">4</span><span class="visually-hidden">Value: 4 out of 5</span></li>
  <li class="score"><span class="score__label" aria-hidden="true">Light</span><span class="pips" aria-hidden="true"><i data-on></i><i data-on></i><i data-on></i><i data-on></i><i data-on></i></span><span class="score__value" aria-hidden="true">5</span><span class="visually-hidden">Light: 5 out of 5</span></li>
  <!-- Space 3, Gear 4, Logistics 2, Condition 5 -->
</ul>
```

```html
<!-- rendered: st-light-rating (the host carries the block class) -->
<st-light-rating class="light-rating"><span class="pips" aria-hidden="true"><i data-on></i><i data-on></i><i></i></span>Medium</st-light-rating>
<st-light-rating class="light-rating"><span class="pips" aria-hidden="true"><i></i><i></i><i></i></span>None</st-light-rating>
```

```html
<!-- compact score (not these components; fixed here so every surface matches, D-2) -->
<!-- card and guide entry fact: Fact { term: 'Score', detail: '3.8', srSuffix: ' out of 5' } -->
<dd>3.8<span class="visually-hidden"> out of 5</span></dd>
<!-- comparison cell (application): -->
<span>4<span aria-hidden="true"> / 5</span><span class="visually-hidden"> out of 5</span></span>
```

Angular's `_ngcontent-*` attributes and the `st-` host element names are not
part of the contract (ICD-DOM-3); page objects select `.score-list`, `.score`,
`.score-overall__value`, `.light-rating` and `.pips > i[data-on]`.

```html
<!-- consumer: studio verdict -->
<st-score-overall [value]="vm().overallText" maxText="overall, out of 5" i18n-maxText />
<st-score-list label="Rubric scores" i18n-label [scores]="vm().scores" />

<!-- consumer: natural-light tile in StudioSpecificationsComponent -->
<li class="light-grid__item">
  <span class="light-grid__time">{{ tile.time }}</span>
  <st-light-rating [level]="tile.level" [text]="tile.word" />
</li>

<!-- consumer: spot light table cell -->
<td data-label="Rating" i18n-data-label><st-light-rating [level]="row.rating" [text]="row.word" /></td>
```

## Design

- Overall: `display: flex`, `align-items: baseline`, gap `--space-2`, `max-width: none`; value `--text-display` with tabular figures; scale `--color-fg-muted` in body type.
- List: no bullets, no padding; grid of one column, `repeat(2, minmax(0, 1fr))` from 48rem with column gap `--space-12` and no row gap.
- Row: grid `minmax(0, 1fr) auto 2ch`, gap `--space-4`, `min-height: --target-comfortable`, bottom rule `--border-width-hairline` in `--color-border-default`; label and number `--text-label` at `--font-size-md`; number right-aligned with tabular figures.
- Pips: inline-flex, gap `--space-1`, `flex: none`; each bar `--space-5` × `--space-2` (light: `--space-4` wide), `--radius-full`; empty bar is an inset `--border-width-hairline` shadow in `--color-border-strong`; filled bar `--color-fg-default`, no shadow.
- Light rating: inline-flex, centred, gap `--space-2`, `--text-label`.
- Elevation, motion, layering: none.

No component tokens: every part reads semantic tokens directly, so a surface
re-themes the pips by changing `--color-fg-default` and `--color-border-strong`.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Filled pip, label, number, light word, overall value | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Empty pip edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Row divider | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Overall scale | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Page behind the verdict | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Light tile (application) | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Stacked table card | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Label, number, overall value, filled pip on the page |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Empty pip edge on the page (1.4.11) |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | "overall, out of 5" |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Light word and filled pip on a tile |
| `--color-border-strong` | `--color-bg-surface-sunken` | 3:1 | Empty pip edge on a tile |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Light word in a stacked table card |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Empty pip edge in a stacked table card |

Filled and empty pips differ by fill, never by hue; pips never use the accent
or a status colour, so a score is never a judgement colour (DS *Theming*).
Forced colours: `.pips > i` opts out of adjustment and draws a 1 px
`CanvasText` border, filled bars a `CanvasText` fill; the number or word stays.

## Responsive behaviour

- `st-score-list` is one column below 48rem and two columns from 48rem; rows
  fill across, so Value and Light share the first line. This is the only
  breakpoint rule in these components.
- A row never wraps: the label takes the leftover width, pips never shrink, and
  "Condition" plus five pips plus "5" fits at 320 px.
- `st-score-overall` keeps display size at every width and stays on one line.
- `st-light-rating` never wraps; the tile grid (application) and the stacked
  table (`st-table`) decide where it sits.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom every value
  stays readable. Nothing here is a target; the 44 px row height is rhythm only.

## Accessibility

### Role and pattern

Plain text in native elements: `<p>` for the overall, `<ul>`/`<li>` for the
rubric, a text node for the light word. No ARIA widget role: the pips are
`aria-hidden="true"` and are not a `meter` or `img`, because the text already
carries the value.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Passes over every part: nothing is focusable and no `tabindex` is ever set. |
| Screen-reader browse keys | Read each rubric row as one sentence, "Light: 5 out of 5", then the next. |

### Focus

Nothing takes focus and nothing moves focus.

### Labelling

- The list is named by `label` ("Rubric scores").
- Each row hides its visible label, pips and number and exposes one sentence
  from `st.score.text`: "Value: 4 out of 5" (L2-011.3).
- The overall reads "3.8 overall, out of 5".
- A light rating reads as its word ("Medium"); the time of day comes from the
  surrounding tile text or row header.

### Announcements

None. Scores do not change while a page is open.

### Motion

None: scores do not animate in or count up, so reduced motion needs no rule.

## Content and internationalisation

- Categories are fixed, in order, never abbreviated: Value, Light, Space, Gear,
  Logistics, Condition (application data, translated by the application).
- Rubric scores are whole numbers ("4"); the overall always has one decimal
  ("4.0", never "4"), formatted for `en-CA` by the application (L2-070.3).
- The scale is "out of 5": "overall, out of 5" beside the overall, "/ 5" in
  comparison cells. No percentages.
- Light words are None, Low, Medium, Strong, capitalised.
- Translatable inputs: `label`, `maxText`, `text`, and the `label` of each
  `RubricScore`. The library string `st.score.text` uses placeholders so a
  translation can reorder them (ICD-I18N-5). French category names
  ("Logistique") are longer; the label column takes the leftover width and the
  row still fits at 320 px.

## Performance

- Change detection: `OnPush`, signal inputs. The pip arrays (`boolean[]` per
  row) and the hidden sentences come from `computed`s, never from template
  expressions; rows are tracked by `label` (ICD-PERF-2).
- Performance scenario: the `components-harness` route `score/performance`
  renders the verdicts of all seven published studios (Liberty Cyc House 4.2 …
  Kensington Window Room 3.2; 42 rubric rows), their 28 natural-light ratings
  and Evergreen Brick Works' five-row light table, as one review page would
  many times over; the route must stay within the L2-071 budgets.
- Regression rule: a change to the templates, inputs, styles or change
  detection is measured on that route against the base branch before it is pushed.
- Layout stability: everything renders on the server with its final size;
  nothing loads later, so these parts add no layout shift.
- Weight: imports only `@angular/core` and `@angular/localize`; no CDK.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-score-overall value="3.8" maxText="overall, out of 5">` on The Junction Loft's verdict, when it renders, then the page has a `p.score-overall` whose `.score-overall__value` is "3.8" and whose `.score-overall__max` is "overall, out of 5", and its text content reads "3.8 overall, out of 5". (L2-011)
- **AC-2** Given `st-score-list` with label "Rubric scores" and The Junction Loft's scores Value 4, Light 5, Space 3, Gear 4, Logistics 2, Condition 5, when it renders, then a `ul.score-list[aria-label="Rubric scores"]` holds six `li.score` rows in that order, each showing its label, five pips and its number. (L2-011)
- **AC-3** Given that list with the default `max`, when the Light and Logistics rows are inspected, then Light has five `.pips > i` all with `data-on`, and Logistics has five `.pips > i` of which only the first two have `data-on`. (L2-011)
- **AC-4** Given a studio scored 3 in every category whose overall the application passes as "3.0", when `st-score-overall` renders, then the value shows "3.0", not "3". (L2-011)
- **AC-5** Given The Junction Loft's rubric list, when the accessibility tree is read, then each row exposes exactly one text, "Value: 4 out of 5", "Light: 5 out of 5" … "Condition: 5 out of 5", and the visible label, pips and number are hidden from it. (L2-011)
- **AC-6** Given any rubric row, when it is inspected, then the score shown by the filled pips is also present as text in the row (the visible number and the `.visually-hidden` sentence), and `.pips` carries `aria-hidden="true"`. (L2-068)

### Light ratings

- **AC-7** Given `<st-light-rating level="medium" text="Medium">` in The Junction Loft's Morning tile, when it renders, then the host has the class `light-rating`, contains a `.pips` with three `i` of which the first two have `data-on`, and is followed by the text "Medium". (L2-006)
- **AC-8** Given Ossington Blackbox's four tiles with `level="none"` and text "None", when they render, then each shows three `i` with no `data-on` and the word "None", so the four times of day all keep a rating. (L2-006)
- **AC-9** Given Evergreen Brick Works' Golden hour row with `level="strong"` and text "Strong" in the spot light table, when a screen reader reads the row, then it hears "Golden hour", "Strong" and the note "West light rakes the brick; the best hour here.", and three filled pips are drawn. (L2-015)
- **AC-10** Given Trinity Bellwoods Park's Blue hour with `level="none"` and Evergreen Brick Works' Midday with `level="low"`, when they render, then they show zero and one filled pips respectively with the words "None" and "Low". (L2-015)

### Screen readers

- **AC-11** Given the verdict and the light tiles of The Junction Loft, when axe-core scans them in the light and the dark theme, then it reports no violations, the pips expose no role, and no part of the three components is focusable. (L2-069)
- **AC-12** Given the extracted translation source, when it is inspected, then the rubric sentence comes from the message `st.score.text` with the placeholders `label`, `value` and `max`, and the three components render no other text of their own. (L2-070)

### Theming

- **AC-13** Given the verdict on the page in the light and the dark theme, when the contrast check runs, then label, number and overall value are at least 4.5:1 against `--color-bg-canvas`, "overall, out of 5" is at least 4.5:1, and the empty pip edge and filled pips are at least 3:1. (L2-068)
- **AC-14** Given a light rating on a sunken tile and in a stacked table card, in the light and the dark theme, when the contrast check runs, then the word is at least 4.5:1 and the empty pip edge at least 3:1 against `--color-bg-surface-sunken` and `--color-bg-surface`. (L2-068)

### Responsive

- **AC-15** Given The Junction Loft's verdict at 320 px wide, when it renders, then the score list is one column, the "Condition" row keeps its label, five pips and "5" on one line, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-16** Given the same verdict at 768 px and 1280 px wide, when it renders, then the score list is two columns with Value and Light on the first line. (L2-064)
- **AC-17** Given The Junction Loft's page at 200 % zoom in a 1280 px viewport, when the visitor reaches the verdict and the light tiles, then every score, word and pip row is fully visible with no horizontal page scroll. (L2-066)

### Server rendering

- **AC-18** Given The Junction Loft's page fetched with JavaScript disabled, when the HTML is inspected, then it contains "3.8", the six sentences "Value: 4 out of 5" … "Condition: 5 out of 5" and the four light words with their pips. (L2-074)

### Motion

The design-system rule (no AC; L2 has no motion requirement): scores never
animate or count up, so `prefers-reduced-motion` changes nothing
([score.html](../../design-system/components/score.html), Accessibility › Motion).

### Performance

- **AC-19** Given the `score/performance` harness route with seven verdicts and 28 light ratings, when it is measured with Lighthouse in mobile mode, then Largest Contentful Paint is at most 2.5 s and Cumulative Layout Shift is at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/score/`: `score-list.component.ts`
  (`ScoreListComponent`, `st-score-list`), `score-overall.component.ts`
  (`ScoreOverallComponent`, `st-score-overall`), `light-rating.component.ts`
  (`LightRatingComponent`, `st-light-rating`), each with its `.html` and
  `.css`. The `.pips` rules live once in a shared `pips.css` that both list and
  light rating include through `styleUrls`, because emulated encapsulation
  scopes them per component.
- Types `RubricScore` and `LightLevel` come from `src/lib/types/` (ICD §8).
- `ScoreListComponent`: `rows = computed(() => scores().map(s => ({ label, value, pips: Array.from({ length: max() }, (_, i) => i < clamp(s.value)), text: $localize`:@@st.score.text:${s.label}:label:: ${s.value}:value: out of ${max()}:max:` })))`.
- `LightRatingComponent`: `host: { class: 'light-rating' }`; `filled = computed(() => ({ none: 0, low: 1, medium: 2, strong: 3 })[level()])`.
- Hosts of the list and the overall: `:host { display: contents; }`.
- Forced-colours rule for the pips comes across with the `.pips` block.
- No ICD change.

## Decisions

- **D-1** *Which element carries the block class?* `st-score-list` and `st-score-overall` render the DS's native `<ul>` and `<p>` inside a host with `display: contents`; `st-light-rating`'s host carries `.light-rating`. ICD-DOM-1 asks the host to carry the block class except where the block must be a specific native element; a list and a paragraph are, an inline rating is not, and the class on the host keeps the rating an inline-flex box in tiles and table cells exactly as in the mocks.
- **D-2** *Is the compact score (number only, no pips) a mode of these components?* No. ICD-002 gives none of the three a compact input, and every compact use sits inside another component: `st-location-card` and `st-description-list` render it from `Fact.srSuffix` (" out of 5"), and the comparison table is application markup. This CRD fixes the compact markup under *Markup* so cards, guide entries and comparison cells read the same; their acceptance criteria live in those components' CRDs.
- **D-3** *What if a rubric value is outside 0 to `max`?* The pips clamp to that range; the number and the sentence print the value as given. The server only sends whole numbers 1 to 5 (L2-011), so this never shows, and clamping keeps a bad value from rendering six or minus one bars without the library doing score arithmetic.
- **D-4** *ICD-002 gives "out of 5" as the `maxText` example; the DS and the mocks show "overall, out of 5".* The application passes "overall, out of 5" on the verdict. `maxText` is copy, so no API change is needed.
- **D-5** *Who turns `LightLevel` into the word?* The application, through `text`, as ICD-002 fixes and the spot-light design says ("Rating labels such as 'Strong' are i18n-marked text chosen in the view model"). The library adds no library strings for light words.
- **D-6** *How many pips does a light rating of None show?* Three empty bars with the word "None", as the DS renders for Ossington Blackbox: the empty edges keep the slots visible, so None reads as the bottom of the scale rather than missing data.
- **D-7** *Does the rubric list take a heading level or show the categories as headings?* No. The categories are row labels, the "Verdict" heading belongs to the application, and the list is named by `label`.
- **D-8** *The mock markup has no space between the overall value and the scale, so some screen readers read "3.8overall".* The component writes a space text node between the two spans; flex layout ignores it visually, and the text becomes "3.8 overall, out of 5" as the DS's *Labelling* asks.
