# Status label

| Field | Value |
|---|---|
| Selector | `st-status` |
| Library path | `frontend/projects/components/src/lib/status/` |
| Status | planned |
| Traces to | L2-056, L2-063, L2-064, L2-066, L2-068, L2-069, L2-071 |
| Design system | [`status-label.html`](../../design-system/components/status-label.html) |
| Source mocks | [`pages/admin-studios/default`](../../mocks/pages/admin-studios/default.html), [`pages/admin-spots/default`](../../mocks/pages/admin-spots/default.html), [`pages/admin-guides/default`](../../mocks/pages/admin-guides/default.html), [`pages/studio-editor/default`](../../mocks/pages/studio-editor/default.html), [`pages/studio-editor/published`](../../mocks/pages/studio-editor/published.html), [`pages/spot-editor/default`](../../mocks/pages/spot-editor/default.html), [`pages/spot-editor/published`](../../mocks/pages/spot-editor/published.html), [`pages/guide-editor/default`](../../mocks/pages/guide-editor/default.html), [`pages/guide-editor/published`](../../mocks/pages/guide-editor/published.html), [`notifications/admin-toast/success`](../../mocks/notifications/admin-toast/success.html), [`dialogs/unpublish/default`](../../mocks/dialogs/unpublish/default.html), [`dialogs/missing-fields/spot`](../../mocks/dialogs/missing-fields/spot.html) |
| Rendering | [`status-label.html`](status-label.html) |

## Purpose and scope

The status label tells the owner whether a studio, spot or guide is on the
public site: "Published" or "Draft". It is a word plus a shape (a filled dot
for Published, a hollow ring for Draft), so the state never rests on colour
alone. It appears wherever the owner sees content: the Status column of the
three administration lists (L2-063.1), the editor's page header beside the
last-saved time, and the editor's Status aside.

Use [`st-badge`](badge.md) for attention flags beside it ("Prices stale",
"Permits stale", "Due soon"), [`st-tag-list`](tag.md) for descriptions
visitors see, and [`st-save-status`](inline-message.md) for the save state of
the form ("Unsaved changes", "All changes saved"). Status labels never appear on
public pages: visitors only see published content.

Out of scope:

- Which state a record has, and changing it: the server decides; the editor's
  "Publish" and "Unpublish" buttons ([`button[st-button]`](button.md)) and the
  confirmation dialogs change it.
- The text around the label ("· Last saved 11 Oct 2026, 4:12 pm", "· on the
  public site"), the "Status" column header, the table's `data-label` caption
  and the stacked-card layout: the application and [`table[st-table]`](table.md).
- Announcing a change of state: the toast that confirms the publish
  ([`st-toast-region`](toast.md)) announces it; the label is not a live region.
- Counts by state in list subtitles ("9 studios · 7 published · 2 draft"): application copy.

## Usage

Every `.status` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks status "span"` plus grep), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-studios/default`, `admin-spots/default`, `admin-guides/default` Status column | `status` draft or published, inside `<td data-label="Status">` of `table[st-table][stack]` | "Draft" (Corktown Garage Studio, Annex Attic Studio, Scarborough Bluffs, Best for headshots); "Published" (the 7 studios, 5 spots, 3 guides) | default; row hovered (`--color-bg-subtle` behind it); stacked card below 48rem under the "Status" caption | table surface; card surface at XS |
| `pages/studio-editor/*`, `spot-editor/*`, `guide-editor/*` page header | inside the `subtitle` slot of [`st-page-header`](page-header.md), followed by application text | "Draft" + " · Last saved 11 Oct 2026, 4:12 pm"; "Published" + " · Last saved 29 Sep 2026, 9:40 am"; "Draft" alone for a never-saved new spot (`dialogs/missing-fields/spot`) | default; switches to Published after a publish (`notifications/admin-toast/success`) | canvas |
| Editors' Status aside | inside the application's `<dd>` under "Visibility" | "Draft" + " · not on the public site"; "Published" + " · on the public site" | default; switched after publish or unpublish | canvas (aside) |
| `dialogs/delete-content/*`, `discard-changes`, `guide-entry-picker/*`, `missing-fields/*`, `remove-image/*`, `unpublish/*`; `notifications/admin-toast/*` | the editor header and aside behind an open dialog or toast | as above | default (behind the backdrop) | canvas under `--color-bg-scrim` |

Every row is buildable with the API below: one required `status` input and the
default slot for the word.

## Anatomy

1. **Container** — the host element `st-status`, carrying `.status` and one
   variant class. `display: inline-flex`, items centred, `--space-2` gap, on one
   line (`white-space: nowrap`).
2. **Shape** — `::before` pseudo-element, `--space-2` (8 px) square,
   `border-radius: 50%`. Published: filled with `currentColor`. Draft:
   transparent with a `--border-width-thick` `currentColor` ring. Not a DOM node;
   not read by assistive technology.
3. **Word** — projected text, `--text-label`. It is the only thing assistive
   technology reads.

Host: per ICD-DOM-1 the host carries the block class
(`<st-status class="status status--draft">`); there is no inner wrapper.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `status` | `ContentStatus` (`'draft' \| 'published'`) | — | yes | Adds `.status--draft` or `.status--published` beside `.status` on the host. `input.required()`, so a missing status fails the build. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The label is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text: "Draft" or "Published" | The word, marked `i18n` by the consumer. It must name the same state as `status` (D-2). |

The status label has no library strings (ICD §12).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Published | `.status--published` | On the public site. `--color-success-fg` word and filled dot. |
| Draft | `.status--draft` | Only the owner can see it. `--color-fg-muted` word and hollow ring. |

One size: `--text-label` with an 8 px (`--space-2`) shape, in table cells,
page headers and the aside alike. Width comes from the word.

## States

The label is text, not a control: it has no hover, focus, active or disabled
state of its own. Its states are the two variants and the surfaces it sits on.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Published | `status="published"` | Success-green word and filled dot | Reads the word, "Published" |
| Draft | `status="draft"` | Muted word and hollow ring | Reads the word, "Draft" |
| On a hovered row | the table row's `:hover` (`table[st-table]`) | Row fill `--color-bg-subtle` behind it; label colours unchanged | — |
| Stacked card (XS) | `table[st-table][stack]` below 48rem | Label sits under the cell's "Status" caption (`td[data-label]::before`); unchanged itself | Cell still reads "Status, Draft" in table navigation where the table semantics remain |
| Changed after publish | the application sets `status` from `'draft'` to `'published'` and the slot to "Published" | Variant switches in place; no transition | Not announced by the label; the toast "Corktown Garage Studio is published" announces it |
| Not focusable | always | — | Skipped by Tab; no role, no `tabindex` |

## Markup

```html
<!-- rendered: the two variants -->
<st-status class="status status--published">Published</st-status>
<st-status class="status status--draft">Draft</st-status>
```

```html
<!-- rendered: in an admin list cell (the td and data-label are the application's) -->
<td data-label="Status"><st-status class="status status--draft">Draft</st-status></td>
```

The mocks write `<span class="status status--draft">`; the product renders the
same classes on the `st-status` host (ICD-DOM-1), and page objects select by
`.status` and the variant class, never by tag name (ICD-DOM-3).

```html
<!-- consumer: admin list row -->
<td data-label="Status" i18n-data-label>
  <st-status [status]="row.status">
    @if (row.status === 'published') { <ng-container i18n>Published</ng-container> }
    @else { <ng-container i18n>Draft</ng-container> }
  </st-status>
</td>

<!-- consumer: editor page header subtitle -->
<st-page-header [title]="name()">
  <p slot="subtitle"><st-status [status]="status()">{{ statusWord() }}</st-status> · {{ lastSavedText() }}</p>
</st-page-header>

<!-- consumer: Status aside -->
<dt i18n>Visibility</dt>
<dd><st-status [status]="status()">{{ statusWord() }}</st-status> · {{ visibilityNote() }}</dd>
```

`statusWord()` and `visibilityNote()` are `$localize` strings chosen in the
editor's view model ("Published" / "Draft", "on the public site" / "not on the
public site").

## Design

- Layout: `inline-flex`, `align-items: center`, `gap: --space-2`, `white-space: nowrap`.
- Type: `--text-label`, sentence case as written.
- Shape: `--space-2` square, `border-radius: 50%`, `flex: none`; Draft ring
  `--border-width-thick` solid `currentColor` on a transparent fill.
- Colour: the host sets only `color`; the shape uses `currentColor`, so one
  token per variant colours both the word and the shape.
- Elevation, motion and layering: none.

There are no component tokens; a re-theme changes `--color-success-fg` or
`--color-fg-muted`.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Published word and dot | `--color-success-fg` | `--palette-callaloo-700` | `--palette-callaloo-300` |
| Draft word and ring (and the base `.status`) | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Hovered row behind it | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Table and card surface | `--color-bg-surface` | `--palette-white` | `--palette-stone-950` |
| Page | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-success-fg` | `--color-bg-canvas` | 4.5:1 | Published in the editor header and aside |
| `--color-success-fg` | `--color-bg-surface` | 4.5:1 | Published in a table cell or stacked card |
| `--color-success-fg` | `--color-bg-subtle` | 4.5:1 | Published on a hovered row |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Draft in the editor header and aside |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Draft in a table cell or stacked card |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Draft on a hovered row |

The dot and ring share the word's colour, so they clear 3:1 (WCAG 1.4.11)
wherever the word clears 4.5:1.

Forced colours: the word takes the system text colour. The shape's
`::before` opts out of forced-colour adjustment so the filled dot keeps
`currentColor` and does not vanish into the system background (D-3); the ring
is a border and survives either way, so the two states still differ by shape.

## Responsive behaviour

- Size and shape do not change by breakpoint; the label never wraps
  (`white-space: nowrap`). Both words fit any column, including a 320 px
  stacked card.
- Below 48rem the admin tables become label-over-value cards
  (`table[st-table][stack]`, L2-063.3): the label sits under its "Status"
  caption beside the name, flag and Edit action. The label itself does not change.
- In the editor header the subtitle wraps between the label and "· Last saved
  …" when the line is too long; the label stays whole.
- At 320 px nothing scrolls horizontally; at 200 % zoom the label stays visible
  and whole. It is not a target, so the touch-target rules do not apply.

## Accessibility

### Role and pattern

Plain text in the `st-status` host; no ARIA role and no widget pattern. In
tables the column header ("Status") gives it context; in the aside it sits in a
`<dd>` under "Visibility"; in the header it follows the `h1`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips the label; it is not focusable. Focus moves between the row's name link and its Edit button. |
| Screen-reader table navigation | Reading across a row announces "Status, Draft" from the column header. |

### Focus

Never focusable and never clickable: no `tabindex`, no click handler. Publishing
is done with the editor's buttons.

### Labelling

The word is the accessible text; the shape is a pseudo-element and is not read.
The word is never replaced by an icon or an `aria-label`, and the shape is never
shipped without the word (WCAG 1.4.1: colour plus shape plus text).

### Announcements

None. A state change is announced by the toast that confirms the publish or
unpublish; the label only reflects it.

### Motion

None: the variant switches without a transition.

## Content and internationalisation

- Exactly two words, sentence case: "Published", "Draft". Never "Live",
  "Public", "Hidden" or "Unpublished".
- Where there is room the application says what the state means next to it:
  "Published · on the public site", "Draft · not on the public site", and pairs
  it with the time in headers: "Draft · Last saved 11 Oct 2026, 4:12 pm"
  (dates per L2-070.3, formatted by the application).
- Translatable: the default slot. The component has no strings of its own.
- Longer translations stay on one line; "Brouillon" and "Publié" fit any column
  the English words fit.

## Performance

- Change detection: `OnPush`, one signal input; the host class is one `computed`.
- No template logic beyond `<ng-content />`; no dependencies beyond `@angular/core`.
- Performance scenario: the `components-harness` route `status-label/performance`
  renders the studio admin list's nine Status cells (Corktown Garage Studio and
  Annex Attic Studio Draft, the seven published studios Published) inside a
  stacked table, held to the L2-071 layout-shift budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the label's size depends only on its word and the fixed
  8 px shape, so it renders server-side at its final size and never shifts.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-status status="draft">Draft</st-status>` in Corktown Garage Studio's row of the studio admin list, when it renders, then the host has exactly the classes `status status--draft`, its text is "Draft", and its `::before` shape has a transparent fill with a 2 px `currentColor` border. (L2-063)
- **AC-2** Given `<st-status status="published">Published</st-status>` in The Junction Loft's row, when it renders, then the host has the classes `status status--published`, its colour is `--color-success-fg`, and its `::before` shape is filled with that colour. (L2-063)
- **AC-3** Given the studio admin list with nine studios, when it renders, then each row's Status cell contains exactly one status label, "Draft" for Corktown Garage Studio and Annex Attic Studio and "Published" for the other seven. (L2-063)

### States

- **AC-4** Given Corktown Garage Studio's editor showing "Draft" in the header and the Status aside, when the owner publishes and the application sets `status` to `'published'` and the word to "Published", then both labels switch to `.status--published` with the filled dot, without a page reload. (L2-056)
- **AC-5** Given the studio admin list at 1280 px, when the pointer hovers Ossington Blackbox's row, then the label keeps its colour on the `--color-bg-subtle` row fill and its contrast against that fill is at least 4.5:1 in light and dark. (L2-068)
- **AC-6** Given the studio admin list at 360 px, when the rows stack into cards, then Corktown Garage Studio's card shows the "Status" caption above "Draft", and the label is on one line and fully visible. (L2-063)

### Keyboard and focus

- **AC-7** Given the studio admin list, when a keyboard user tabs through Corktown Garage Studio's row, then focus moves from the name link to "Edit Corktown Garage Studio" and never lands on the status label, which has no `tabindex` and no role. (L2-069)

### Screen readers

- **AC-8** Given the studio admin list read with a screen reader in table mode, when the reader moves across Liberty Cyc House's row to the Status cell, then it announces "Status" and "Published", and nothing from the shape. (L2-069)
- **AC-9** Given the three admin lists and the studio editor in light and dark, when axe-core scans them, then no violation involves a status label. (L2-069)

### Theming

- **AC-10** Given Published and Draft labels on the page, on the table surface and on a hovered row, when the contrast check runs in light and dark, then every word is at least 4.5:1 and every dot and ring at least 3:1 against what is behind it. (L2-068)
- **AC-11** Given a Published and a Draft label rendered in greyscale, when they are compared, then they differ by shape (filled dot versus hollow ring) as well as by word. (L2-068)

### Responsive

- **AC-12** Given Corktown Garage Studio's editor at 320 px wide, when the header subtitle "Draft · Last saved 11 Oct 2026, 4:12 pm" renders, then the label is whole on one line and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-13** Given The Junction Loft's editor at 200 % zoom in a 1280 px viewport, when the owner reads the Status aside, then "Published · on the public site" is fully visible with no horizontal page scroll. (L2-066)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the label has no
animation, and switching variant happens without a transition
([status-label.html](../../design-system/components/status-label.html), Accessibility › Motion).

### Performance

- **AC-14** Given the `status-label/performance` harness route with the nine studio Status cells, when it is measured with Lighthouse on the mobile profile, then Cumulative Layout Shift is at most 0.1 and no status label moves after first paint. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/status/`: `status.component.ts`
  (`StatusComponent`, selector `st-status`), `status.component.html`
  (`<ng-content />`), `status.component.css` (port of the `.status`,
  `.status::before`, `.status--published` and `.status--draft` rules from
  `components.css`, written against `:host`, `:host(.status--published)`,
  `:host(.status--draft)::before`). `ContentStatus` in `src/lib/types/content-status.ts`.
- Host bindings: `[class]` from a `computed` returning `status status--{status}`.
- Add `forced-color-adjust: none` to `:host::before` (D-3).
- DS drift the port drops: `components.css` declares `.status--published` twice
  and a redundant `.status--draft` colour; port one copy of each.
- The editors' inline `style="font: var(--text-h4)"` on the aside heading belongs
  to the editor layout, not to this component.

## Decisions

- **D-1** *Does the component render the word itself from `status`, or take it from the slot?* From the slot, as ICD-002 fixes ("default slot: Draft, Published"). The library holds no product copy (ICD-I18N-2), and the slot lets the editor keep its own `$localize` strings.
- **D-2** *What if the slot word and `status` disagree?* The application must keep them in step (one view-model field drives both); the component does not check, because comparing copy to state would be a business rule in the library (ICD-API-10). The acceptance tests check the pair on every screen that renders it.
- **D-3** *In forced colours the system background replaces `background: currentColor`, so the Published dot would disappear and only Draft's ring would show a shape.* The `::before` opts out of forced-colour adjustment, so the dot is painted in the forced text colour. This implements the design-system statement that "the filled dot and the ring still tell them apart" in forced colours.
- **D-4** *Is the label ever a live region, given it changes after a publish?* No. The success toast is the one announcer of a publish (ICD-A11Y-4); a second polite region on the label would read the change twice.
