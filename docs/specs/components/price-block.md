# Price block

| Field | Value |
|---|---|
| Selector | `st-price-block` |
| Library path | `frontend/projects/components/src/lib/price-block/` |
| Status | planned |
| Traces to | L2-004, L2-005, L2-042, L2-043, L2-064, L2-066, L2-068, L2-069, L2-070, L2-071, L2-074 |
| Design system | [`price-block.html`](../../design-system/components/price-block.html) |
| Source mocks | [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/studio/minimal`](../../mocks/pages/studio/minimal.html), [`pages/studio/in-compare`](../../mocks/pages/studio/in-compare.html), [`pages/studio/playing`](../../mocks/pages/studio/playing.html), [`pages/studio/media-failed`](../../mocks/pages/studio/media-failed.html), [`pages/studio-editor/price-changed`](../../mocks/pages/studio-editor/price-changed.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html) |
| Rendering | [`price-block.html`](price-block.html) |

## Purpose and scope

Hourly rates don't compare, so every studio gets one number: the all-in cost of
a standard 2-hour shoot, computed by the server (L2-004). The price block is the
first section of every studio review and the one place that number is
explained: the figure ("$145.00"), one sentence saying how it was reached, the
hourly rate, the minimum booking, every fee marked "Mandatory" or "Optional,
not in all-in", and the date the prices were last verified. When the server
says the prices are stale, the application projects a warning alert into the
block.

The figure is repeated without the working in the summary panel
([`st-summary-panel`](summary-panel.md)), on list cards
([`st-location-card`](location-card.md)), in the comparison table and in
guides; those surfaces carry their own stale badge. Use
[`st-description-list`](description-list.md) alone for rate-free fact lists
(logistics, conditions).

Out of scope:

- Every number and judgement: the all-in arithmetic (`allInCost2h`), money and
  date formatting (`en-CA`), the working sentence, the fee order, and whether
  prices are stale (`priceStale`) are the server's and the application's
  (ICD-API-10, ICD-I18N-4). The block renders what it is given.
- The "Pricing" heading and its `section aria-labelledby`: the application's
  `StudioPricingComponent`.
- The stale warning itself: an [`st-alert`](alert.md) the application projects
  into the default slot. Its look and role are the alert's.
- The spot permit verified line ("Permit rules verified 1 September 2026 ·
  Source: …"): the spot page's permit section, not this component (D-1).
- The studio editor's "Prices last verified" confirmation after a price edit:
  a [`st-text-field`](text-field.md) with a warning (L2-042.2). The editor
  shows no price block (D-5).
- The administration dashboard's "Due soon" list: application rows.

## Usage

Every `.price-block` and `.price-block__verified` in `docs/mocks/`
(`usage_inventory.py docs/mocks price-block "div|p|span|strong"` plus grep).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/default`, `in-compare`, `playing`, `media-failed` | `allIn` "$145.00"; working "All-in for a standard 2-hour shoot: 2 hours at $60.00 plus the mandatory cleaning fee."; items Hourly rate $60.00 (numeric), Minimum booking 2 hours, Cleaning fee $25.00 badge "Mandatory", After-hours access $30.00 badge "Optional, not in all-in"; verified 22 September 2026 | slot empty | fresh (mandatory and optional fees) | canvas, sunken all-in panel |
| `pages/studio/minimal` | Bloordale Sun Studio "$130.00"; $55.00, 2 hours, Cleaning fee $20.00 "Mandatory"; verified 15 July 2026 | slot empty | fresh (mandatory fee) | canvas |
| `pages/studio/stale` | Ossington Blackbox "$270.00"; working "…the 3-hour minimum applies, so 3 hours at $90.00. No mandatory fees."; $90.00, 3 hours, Extra fees None; verified 2 March 2026 | `st-alert` warning, `role="status"`, "Prices may be out of date" / "We last checked these prices 225 days ago. Confirm with the studio before you book." | stale (minimum above 2 h) | canvas |
| DS page, Kensington Window Room | "$80.00"; $40.00, 1 hour, Extra fees None; verified 30 September 2026 | slot empty | fresh (no fees) | canvas |
| DS page, Liberty Cyc House (`pages/admin-dashboard/default` lists it as due soon) | "$185.00"; "2 hours at $75.00 plus the mandatory cyc touch-up fee."; $75.00, 2 hours, Cyc touch-up fee $35.00 "Mandatory"; verified 28 April 2026 | slot empty | due soon (looks fresh) | canvas |
| `pages/studio-editor/price-changed` | no price block; the editor shows "All-in for 2 hours: $150.00, calculated by the server when you save." and the warning field | — | price changed (editor) | — |
| `pages/spot/default`, `stale-permit` | `.price-block__verified` reused for "Permit rules verified …" under the permit table | — | — | not this component (D-1) |

Every studio row is buildable with the API below: the figure, working, fact
rows (with `numeric` and `badge`), label and date are inputs; the stale alert
is projected.

## Anatomy

1. **Block** — the host element carries `.price-block`: a flex column, `--space-5` between parts.
2. **All-in panel** — `p.price-block__allin` on `--color-bg-surface-sunken`, `--radius-lg`, padding `--space-5` × `--space-6`.
3. **All-in figure** — `<strong>` in the panel: `--text-h1`, tabular figures.
4. **Working** — `<span>` in the panel: `--text-body-sm`, `--color-fg-muted`, `--space-1` below the figure.
5. **Rate and fees** — [`st-description-list`](description-list.md) (`dl.kv`) with the `items`: `dt` label, `dd` value; a `numeric` value gets `.num`; a `badge` renders a neutral [`st-badge`](badge.md) after the amount.
6. **Verified line** — `p.price-block__verified`: `verifiedLabel`, a space, and `<time datetime>` with the long date; `--text-body-sm`, `--color-fg-muted`.
7. **Stale warning (projected)** — the default slot, after the verified line: an `st-alert` (`.alert.alert--warning`, `role="status"`).

Host: `st-price-block` carries the block class itself
(`<st-price-block class="price-block">`), as ICD-DOM-1 asks, so the projected
alert is a direct flex child and takes the `--space-5` gap (D-6).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `allIn` | `string` | — | yes | The server's `allInCost2h`, formatted by the application as CAD with two decimals ("$145.00"). Printed in the `<strong>` as given. |
| `allInText` | `string` | — | yes | The working sentence, from the application's view model ("All-in for a standard 2-hour shoot: 2 hours at $60.00 plus the mandatory cleaning fee."). |
| `items` | `readonly Fact[]` | `[]` | no | Rate, minimum, then one row per fee in the studio's order, or "Extra fees: None". Passed to `st-description-list`: `numeric` → `.num`, `badge` → neutral badge ("Mandatory", "Optional, not in all-in"). Empty renders no `<dl>` (D-2). |
| `verifiedLabel` | `string` | — | yes | "Prices verified". Product copy, `i18n-verifiedLabel`. |
| `verified` | `DisplayDate` | — | yes | `datetime` "2026-09-22" and `text` "22 September 2026", rendered as `<time datetime="2026-09-22">22 September 2026</time>`. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The block holds no controls. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | One `st-alert` with `tone="warning"` and `role="status"`, only when the API says `priceStale` | Projected after the verified line. Empty when prices are fresh or due soon; the block then renders nothing in its place (D-4). |

The block renders no text of its own (ICD-002 §12 has no price-block string).

## Variants and sizes

The variants are the shapes the data takes; the layout never changes.

| Variant | Example | What differs |
|---|---|---|
| No fees | Kensington Window Room "$80.00", minimum 1 hour, "Extra fees: None" | Working says "No mandatory fees."; the fees row reads "None" with no badge. |
| Mandatory fee | Bloordale Sun Studio "$130.00", Cleaning fee $20.00 "Mandatory" | One badge row. |
| Mandatory and optional fees | The Junction Loft "$145.00", Cleaning fee "Mandatory", After-hours access $30.00 "Optional, not in all-in" | The optional fee is listed and excluded (L2-004.3). |
| Minimum above 2 hours | Ossington Blackbox "$270.00", minimum 3 hours | Working says "the 3-hour minimum applies, so 3 hours at $90.00." |

One size: the block fills the main column of the review layout. The fee list is
stacked below 36rem and two columns (12rem label column) from 36rem, by
`st-description-list`.

## States

The block is not interactive: no hover, focus, active or disabled state, and it
is never empty (a studio can't be published without a rate, a minimum and a
verified date, L2-002). Its states are about freshness, decided by the server.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Fresh (up to 152 days) | slot empty | All-in panel, fact list, verified line | Read in order; no live region |
| Due soon (153 to 183 days) | slot empty (`priceStale` false) | Exactly as fresh: Liberty Cyc House (28 Apr 2026, 168 days) shows no warning. Only the admin dashboard lists it. | As fresh |
| Exactly 183 days | slot empty (`priceStale` false) | As fresh (L2-005.3) | As fresh |
| Stale (184 days and more) | `st-alert` projected | Every price stays visible; the warning alert follows the verified line on `--color-warning-bg` | The alert is a `role="status"` region (L2-005.2) |
| Price changed (after save) | new inputs, slot emptied by the application | The new figure and the newly confirmed date; the stale warning disappears without a reload | The `<time>` carries the new `datetime` |
| Price changed (editor, before save) | — | Not rendered: the editor shows its own field and line (D-5) | — |

## Markup

```html
<!-- rendered: fresh, mandatory and optional fees (The Junction Loft) -->
<st-price-block class="price-block">
  <p class="price-block__allin"><strong>$145.00</strong><span>All-in for a standard 2-hour shoot: 2 hours at $60.00 plus the mandatory cleaning fee.</span></p>
  <dl class="kv">
    <dt>Hourly rate</dt><dd class="num">$60.00</dd>
    <dt>Minimum booking</dt><dd>2 hours</dd>
    <dt>Cleaning fee</dt><dd><span class="num">$25.00</span> <span class="badge">Mandatory</span></dd>
    <dt>After-hours access</dt><dd><span class="num">$30.00</span> <span class="badge">Optional, not in all-in</span></dd>
  </dl>
  <p class="price-block__verified">Prices verified <time datetime="2026-09-22">22 September 2026</time></p>
</st-price-block>
```

```html
<!-- rendered: stale, minimum above 2 hours (Ossington Blackbox) -->
<st-price-block class="price-block">
  <p class="price-block__allin"><strong>$270.00</strong><span>All-in for a standard 2-hour shoot: the 3-hour minimum applies, so 3 hours at $90.00. No mandatory fees.</span></p>
  <dl class="kv">
    <dt>Hourly rate</dt><dd class="num">$90.00</dd>
    <dt>Minimum booking</dt><dd>3 hours</dd>
    <dt>Extra fees</dt><dd>None</dd>
  </dl>
  <p class="price-block__verified">Prices verified <time datetime="2026-03-02">2 March 2026</time></p>
  <div class="alert alert--warning" role="status">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h0"/></svg>
    <div class="alert__body"><p class="alert__title">Prices may be out of date</p><p>We last checked these prices 225 days ago. Confirm with the studio before you book.</p></div>
  </div>
</st-price-block>
```

The `dl.kv` markup, including `.num` on the `dd` for an amount alone and on a
`span` when a badge follows, is `st-description-list`'s; the alert markup is
`st-alert`'s. Angular attributes and host element names are not part of the
contract (ICD-DOM-3).

```html
<!-- consumer: StudioPricingComponent -->
<section class="review-section" aria-labelledby="pricing">
  <h2 id="pricing" i18n>Pricing</h2>
  <st-price-block [allIn]="vm().allIn" [allInText]="vm().allInText" [items]="vm().items"
                  verifiedLabel="Prices verified" i18n-verifiedLabel [verified]="vm().verified">
    @if (vm().stale) {
      <st-alert tone="warning" role="status" title="Prices may be out of date" i18n-title>
        <ng-container i18n>We last checked these prices {{ vm().ageDays }} days ago. Confirm with the studio before you book.</ng-container>
      </st-alert>
    }
  </st-price-block>
</section>
```

## Design

- Block: `display: flex`, column, gap `--space-5`.
- All-in panel: flex column, gap `--space-1`, padding `--space-5` block and `--space-6` inline, `--color-bg-surface-sunken`, `--radius-lg`.
- Figure: `--text-h1`, `font-variant-numeric: tabular-nums`, `--color-fg-default`; never coloured (price is a fact, not a status).
- Working and verified line: `--text-body-sm`, `--color-fg-muted`.
- Fact list (from `st-description-list`): labels `--text-label` in `--color-fg-subtle`, values in `--color-fg-default`, hairline `--color-border-default` under each value; neutral badge on `--color-bg-subtle` with `--color-fg-muted`.
- Stale alert (from `st-alert`): `--color-warning-bg`, `--color-warning-fg`, `--color-warning-icon`, `--color-warning-border`, `--radius-md`.
- Elevation, motion, layering: none.

No component tokens; the block re-themes through the semantic tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| All-in panel | `--color-bg-surface-sunken` | `--palette-stone-50` | `--palette-stone-900` |
| Figure, fee amounts | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Working, verified line | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Fee labels | `--color-fg-subtle` | `--palette-stone-600` | `--palette-stone-400` |
| Fee-kind badge | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Row rule | `--color-border-default` | `--palette-stone-200` | `--palette-stone-750` |
| Stale alert ground | `--color-warning-bg` | `--palette-mango-50` | `--palette-mango-950` |
| Stale alert text | `--color-warning-fg` | `--palette-mango-700` | `--palette-mango-300` |
| Stale alert icon | `--color-warning-icon` | `--palette-mango-500` | `--palette-mango-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | All-in figure |
| `--color-fg-muted` | `--color-bg-surface-sunken` | 4.5:1 | Working sentence |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Fee labels |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Fee amounts |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Fee-kind badge |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Verified line |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Stale warning text |
| `--color-warning-icon` | `--color-warning-bg` | 3:1 | Stale warning icon |

Forced colours: the panel ground and badge fill disappear; the figure, the
badge text and the alert's border and text remain, so no meaning is lost.

## Responsive behaviour

- Below 36rem the fee list stacks, each label above its value; a badge wraps
  under its amount when the row is too narrow (`st-description-list`).
- From 36rem the fee list is a 12rem label column and a value column.
- The all-in panel keeps its padding at every width; the working sentence wraps
  between words; amounts never break ("$1,250.00" stays on one line).
- LG and up: unchanged; the block sits in the main column beside the summary panel.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom every price
  stays visible. The block has no targets.

## Accessibility

### Role and pattern

Static content: a `<p>` for the figure and working, a `<dl>` for rate and fees,
a `<p>` with `<time datetime>` for the date, and, when stale, the projected
alert with `role="status"` (L2-005.2). The block adds no role of its own and
sits inside the application's "Pricing" region.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Passes over the block: nothing in it is focusable, the stale alert included. |

### Focus

Nothing takes focus and the block never moves focus.

### Labelling

- Read in order: "$145.00, All-in for a standard 2-hour shoot: 2 hours at
  $60.00 plus the mandatory cleaning fee." The working names the figure, so no
  extra label is needed.
- Each fee is a term and value: "Cleaning fee, $25.00 Mandatory". The badge is
  text, so the fee kind never relies on colour (1.4.1).
- The verified line reads "Prices verified 22 September 2026".

### Announcements

The stale alert is a status region present at load. It is the alert's role,
not the block's; the block never announces anything itself.

### Motion

None.

## Content and internationalisation

- CAD with a dollar sign and two decimals: "$45.50", "$91.00", formatted by the
  application for `en-CA` (L2-004.4, L2-070.3). No "CAD", no "/h" in the panel.
- The working sentence follows the DS formulas: "All-in for a standard 2-hour
  shoot: 2 hours at $60.00 plus the mandatory cleaning fee." / "… the 3-hour
  minimum applies, so 3 hours at $90.00. No mandatory fees."
- Fee names as the studio uses them, sentence case: "Cleaning fee", "Cyc
  touch-up fee", "After-hours access". Fee kinds exactly "Mandatory" and
  "Optional, not in all-in". No fees: "Extra fees" / "None".
- Long date: "Prices verified 22 September 2026".
- Stale alert: "Prices may be out of date" / "We last checked these prices 225
  days ago. Confirm with the studio before you book."
- Translatable inputs: `allInText`, `verifiedLabel`, each `Fact.term`, the
  textual `Fact.detail` ("2 hours", "None") and `Fact.badge`; data values are
  amounts and fee names. French runs longer: the working wraps, badges wrap
  under amounts.

## Performance

- Change detection: `OnPush`, signal inputs; nothing is derived except whether
  `items` is empty (`computed`).
- Performance scenario: the `components-harness` route `price-block/performance`
  renders the price blocks of all seven published studios (Kensington Window
  Room $80.00 … Ossington Blackbox $270.00 with its stale alert), within the
  L2-071 budgets.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: everything renders on the server; the stale alert is in the
  first HTML, never inserted later, so nothing shifts.
- Weight: imports `@angular/core` and `st-description-list` (which brings
  `st-badge`); `st-alert` is the application's import.

## Acceptance criteria

### Rendering

- **AC-1** Given The Junction Loft's inputs (`allIn` "$145.00", the working sentence, four items and `verified` 22 September 2026), when the block renders, then its host has the class `price-block` and holds, in order, `p.price-block__allin` with `<strong>$145.00</strong>` and the working sentence, a `dl.kv`, and `p.price-block__verified`. (L2-004)
- **AC-2** Given that block, when the fee rows are read, then "Cleaning fee" shows "$25.00" with the badge "Mandatory" and "After-hours access" shows "$30.00" with the badge "Optional, not in all-in", both badges as text in a neutral `.badge`. (L2-004)
- **AC-3** Given Kensington Window Room's inputs ("$80.00", minimum "1 hour", item "Extra fees" / "None"), when the block renders, then the fees row reads "Extra fees" "None" with no badge, and the figure is "$80.00". (L2-004)
- **AC-4** Given Ossington Blackbox's inputs with `allIn` "$270.00" and the working "All-in for a standard 2-hour shoot: the 3-hour minimum applies, so 3 hours at $90.00. No mandatory fees.", when the block renders, then figure and working are printed exactly as given, with no recalculation or reformatting. (L2-004)
- **AC-5** Given Leslieville Daylight Studio's `allIn` "$91.00" and rate fact "$45.50" marked `numeric`, when the block renders, then they show "$91.00" and "$45.50" with two decimals and the rate's `dd` has the class `num`. (L2-004)
- **AC-6** Given `verifiedLabel` "Prices verified" and `verified` `{ datetime: '2026-09-22', text: '22 September 2026' }`, when the block renders, then the verified line reads "Prices verified 22 September 2026" and contains `<time datetime="2026-09-22">`. (L2-005)

### States

- **AC-7** Given Kensington Window Room verified 30 September 2026 with an empty default slot, when the block renders, then it contains no `.alert`, no element with `role="status"`, and nothing after the verified line. (L2-005)
- **AC-8** Given Liberty Cyc House verified 28 April 2026 (168 days, `priceStale` false) with "$185.00" and "Cyc touch-up fee" "$35.00" "Mandatory", when the block renders, then it looks exactly like a fresh block: no alert, no warning badge, no tone class. (L2-043)
- **AC-9** Given Ossington Blackbox with the stale `st-alert` projected, when the block renders, then the alert follows the verified line inside `.price-block`, is separated from it by `--space-5`, and "$270.00", every fact row and "Prices verified 2 March 2026" stay visible. (L2-005)
- **AC-10** Given that stale block, when a screen reader user reaches it, then the warning "Prices may be out of date. We last checked these prices 225 days ago. Confirm with the studio before you book." is exposed in a `role="status"` region. (L2-005)
- **AC-11** Given Ossington Blackbox's block rendered stale, when the owner has confirmed the date and the application sets `verified` to `{ datetime: '2026-10-13', text: '13 October 2026' }` and removes the alert, then the verified line shows `<time datetime="2026-10-13">13 October 2026</time>` and no `.alert` remains, without a page reload. (L2-042)

### Screen readers

- **AC-12** Given the fresh and the stale block, when axe-core scans them in the light and the dark theme, then it reports no violations, the `dl` holds only `dt`/`dd` pairs, and no element in the block is focusable. (L2-069)
- **AC-13** Given the block's template, when it is inspected and the translation source extracted, then the block renders no text of its own: "Prices verified" comes from `verifiedLabel` and every other word from inputs or the slot. (L2-070)

### Theming

- **AC-14** Given The Junction Loft's block and Ossington Blackbox's stale block in the light and the dark theme, when the contrast check runs, then the figure and the working are at least 4.5:1 against `--color-bg-surface-sunken`, fee labels, amounts, badges and the verified line at least 4.5:1 against their grounds, and the warning text at least 4.5:1 against `--color-warning-bg`. (L2-068)

### Responsive

- **AC-15** Given Ossington Blackbox's stale block at 320 px wide, when it renders, then the fee labels sit above their values, "$270.00" is on one line, the working and the warning wrap between words, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-16** Given The Junction Loft's block at 360 px wide, when the "After-hours access" row renders, then the badge "Optional, not in all-in" wraps under "$30.00" rather than overflowing, and at 768 px the fee list is a label column and a value column. (L2-064)
- **AC-17** Given The Junction Loft's page at 200 % zoom in a 1280 px viewport, when the visitor reaches the price block, then the figure, every fee and the verified line are fully visible with no horizontal page scroll. (L2-066)

### Server rendering

- **AC-18** Given Ossington Blackbox's page fetched with JavaScript disabled, when the HTML is inspected, then it contains "$270.00", every fact row, "Prices verified" with `datetime="2026-03-02"` and the stale warning text. (L2-074)

### Motion

The design-system rule (no AC; L2 has no motion requirement): nothing in the
block animates, so `prefers-reduced-motion` changes nothing
([price-block.html](../../design-system/components/price-block.html), Accessibility › Motion).

### Performance

- **AC-19** Given the `price-block/performance` harness route with all seven studios' blocks, when it is measured with Lighthouse in mobile mode, then Largest Contentful Paint is at most 2.5 s and Cumulative Layout Shift is at most 0.1. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/price-block/`:
  `price-block.component.ts` (`PriceBlockComponent`, selector `st-price-block`,
  `host: { class: 'price-block' }`), `price-block.component.html`,
  `price-block.component.css` (port of `.price-block`, `.price-block__allin`
  and `.price-block__verified` against `:host`).
- Template: the panel `<p>`, then `@if (items().length) { <st-description-list [items]="items()" /> }`,
  then the verified `<p>` with `<time [attr.datetime]="verified().datetime">`,
  then `<ng-content />`.
- Composes [`st-description-list`](description-list.md) for the `.kv` rows,
  which composes [`st-badge`](badge.md); the projected alert is
  [`st-alert`](alert.md).
- Types `Fact` and `DisplayDate` from `src/lib/types/` (ICD §8).
- Mock drift the component corrects: `pages/studio/stale` and `minimal` put
  `.num` on a `span` inside the amount-only `dd`; the product puts it on the
  `dd` (DS rule, via `st-description-list`).
- No ICD change.

## Decisions

- **D-1** *The DS reuses `.price-block__verified` for the spot permit line, but ICD-002 gives `st-price-block` a required `allIn` and lists it for studio pricing only.* The permit line is not this component. The spot page's permit section renders it with global text utilities and `a[st-link][external]`, and its stale warning is a separate `st-alert`. Rendering a whole price block without a price would be wrong, and `.price-block*` is library-owned (ICD-002 §11.2), so the application cannot write that class. The DS page catches up by documenting the permit line under the permit section.
- **D-2** *What does an empty `items` render?* No `<dl>` at all, because an empty description list is meaningless to a screen reader. A published studio always has at least the rate and the minimum, so this happens only in a harness.
- **D-3** *Does "due soon" change the block?* No. The DS shows due soon exactly like fresh on public pages; only the admin dashboard lists it (L2-044.3). The block has no freshness input and holds no staleness rule (ICD-API-10).
- **D-4** *Where does the stale alert go, and what does an empty slot leave behind?* The default slot is projected last, after the verified line, as a direct child of the flex column, so it takes the same `--space-5` gap. An empty slot renders nothing: no wrapper, no empty status region, no gap.
- **D-5** *The DS lists "Price changed (editor)" as a price-block state.* The studio editor renders no price block: its "Prices last verified" field (`st-text-field` with a warning) and the line "All-in for 2 hours: $150.00, calculated by the server when you save." belong to the editor. For this component, "price changed" means the public block shows the new server values and the newly confirmed date after save, and drops the alert, as AC-11 states.
- **D-6** *Does the host carry `.price-block`?* Yes: the DS block is a plain `div`, so ICD-DOM-1's rule applies and the host is the block. The projected alert is then a direct flex child, as in the mocks.
- **D-7** *Does the block take a heading level?* No. The "Pricing" heading belongs to the application's section; the block renders no heading.
