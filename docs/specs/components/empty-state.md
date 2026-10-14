# Empty state

| Field | Value |
|---|---|
| Selector | `st-empty-state` |
| Library path | `frontend/projects/components/src/lib/empty-state/` |
| Status | planned |
| Traces to | L2-024, L2-026, L2-032, L2-038, L2-044, L2-064, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`empty-state.html`](../../design-system/components/empty-state.html) |
| Source mocks | [`pages/studios/empty`](../../mocks/pages/studios/empty.html), [`pages/studios/no-results`](../../mocks/pages/studios/no-results.html), [`pages/studios/error`](../../mocks/pages/studios/error.html), [`pages/spots/empty`](../../mocks/pages/spots/empty.html), [`pages/spots/no-results`](../../mocks/pages/spots/no-results.html), [`pages/spots/error`](../../mocks/pages/spots/error.html), [`pages/home/empty`](../../mocks/pages/home/empty.html), [`pages/map/empty`](../../mocks/pages/map/empty.html), [`pages/map/error`](../../mocks/pages/map/error.html), [`pages/compare/empty`](../../mocks/pages/compare/empty.html), [`pages/guides/empty`](../../mocks/pages/guides/empty.html), [`pages/spot/no-rain-backup`](../../mocks/pages/spot/no-rain-backup.html), [`pages/admin-dashboard/empty`](../../mocks/pages/admin-dashboard/empty.html), [`pages/admin-dashboard/error`](../../mocks/pages/admin-dashboard/error.html), [`pages/admin-dashboard/up-to-date`](../../mocks/pages/admin-dashboard/up-to-date.html), [`pages/admin-studios/empty`](../../mocks/pages/admin-studios/empty.html), [`pages/admin-studios/no-results`](../../mocks/pages/admin-studios/no-results.html), [`pages/admin-studios/error`](../../mocks/pages/admin-studios/error.html), [`pages/admin-spots/empty`](../../mocks/pages/admin-spots/empty.html), [`pages/admin-spots/no-results`](../../mocks/pages/admin-spots/no-results.html), [`pages/admin-spots/error`](../../mocks/pages/admin-spots/error.html), [`pages/admin-guides/empty`](../../mocks/pages/admin-guides/empty.html), [`pages/admin-guides/no-results`](../../mocks/pages/admin-guides/no-results.html), [`pages/admin-guides/error`](../../mocks/pages/admin-guides/error.html), [`pages/studio-editor/error`](../../mocks/pages/studio-editor/error.html), [`pages/spot-editor/error`](../../mocks/pages/spot-editor/error.html), [`pages/guide-editor/error`](../../mocks/pages/guide-editor/error.html), [`pages/guide-editor/new`](../../mocks/pages/guide-editor/new.html), [`pages/guide-editor/invalid`](../../mocks/pages/guide-editor/invalid.html) |
| Rendering | [`empty-state.html`](empty-state.html) |

## Purpose and scope

An empty state fills the space where content would be with a title, one line
of why and one way forward. ShotThere has four reasons for one: nothing is
published yet ("No studio reviews yet"; nothing is listed until it has been
shot there, so the copy says the reviews are being shot), nothing matches
("No studios match these filters"), the data did not arrive ("We couldn't load
the studios", with "Try again", L2-026.2), and all done ("Everything is up to
date"). It sits in the place of a list, map, table, section or editor, and
everything that did load (filters, chips, headers) stays put.

Use [`st-error-page`](error-page.md) when the whole page cannot be shown (404,
500); [`st-alert`](alert.md) when part of a page failed or a page still has
content ("One studio in this link couldn't be found…"), and inside a dialog
or form; [`st-skeleton`](skeleton.md) while data is on its way;
[`st-map-unavailable`](map.md) when map tiles fail; and
[`st-responsive-image`](responsive-image.md)'s fallback when a photo fails.

Out of scope:

- Choosing which state to show, its copy and counts ("clear them all to see
  all 7 studios"): the application's.
- The actions themselves: projected [`button[st-button]`](button.md) and
  `a[st-button]` elements, including "Try again"'s busy state and what it
  re-requests (the same filters and sort, L2-026.2).
- The result count's announcement of "0 studios" for a no-results state
  (`st-result-count`), and moving focus after a page-level change: the
  application's (ICD §14).
- The raised card the map's empty and error states float in, and the space
  above the dashboard's empty state: the application's layout (D-6).

## Usage

Every `.empty` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks empty "div|section|p|h1|h2|h3|h4|li"`), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studios/empty` | neutral, `camera`, h3 (under the hidden "Results" h2) | "No studio reviews yet" · "The first reviews are being shot now. Each one goes up only after a full test shoot." · secondary link "Browse outdoor spots" | default | canvas |
| `pages/spots/empty` | neutral, `tree`, h3 | "No outdoor spots yet" · "The first spots are being scouted and shot now. Studio reviews are already up." · "Browse studios" | default | canvas |
| `pages/home/empty` | neutral, `camera`, h3 (under hidden "Latest reviews") | "The first studio reviews are coming" · "Each studio is reviewed only after a full test shoot. Leave your email and we'll tell you when the first one is up." · "Get an email when they go up" | default | canvas |
| `pages/guides/empty` | neutral, `guide`, h2 | "No guides yet" · "Guides group the studios we've reviewed by budget, light and crew size. The first ones are on the way." · primary "Browse studios" | default | canvas |
| `pages/map/empty` | neutral, compact, `map-pin`, h2, in the application's floating card | "No locations on the map yet" · "The first studio and spot reviews are being shot now. Each appears here once it is published." · "Get new reviews by email" | default | raised card over the map |
| `pages/compare/empty` | neutral, `compare`, h2 | "Pick at least two studios to compare" · "Use Compare on any studio card, then open the comparison from the bar." · primary "Browse studios" | default | canvas |
| `pages/studios/no-results`, `pages/spots/no-results` | neutral, `search`, h3, below the active-filter chips | "No studios match these filters" · "Try removing a filter, or clear them all to see all 7 studios."; "No spots match these filters" · "The only waterfront spot isn't rated for family shoots. Remove a filter, or clear them all to see all 5 spots." · "Clear filters" | default | canvas |
| `pages/admin-studios/no-results`, `admin-spots`, `admin-guides` | neutral, compact, `search`, h2, under the search box | "No studios match “parkdale”" · "Check the spelling, or clear the search to see all 9 studios." · "Clear search" | default | canvas |
| `pages/studios/error`, `pages/spots/error` | error, `danger`, h3 | "We couldn't load the studios" · "The studio list didn't arrive. Check your connection and try again; your filters are kept." · secondary "Try again" with `refresh` + ghost "Go to the home page" | default, Try again busy | canvas |
| `pages/map/error` | error, compact, `danger`, h2, in the floating card | "We couldn't load the locations" · "The map is here, but the studio and spot data didn't arrive. Try again in a moment." · "Try again" + ghost "Browse studios" | default | raised card |
| `pages/admin-studios/error`, `admin-spots`, `admin-guides` | error, `danger`, h2 | "We couldn't load your studios" · "Nothing has changed. Check your connection, then try again." · "Try again" + ghost "Back to dashboard" | default | canvas |
| `pages/admin-dashboard/error` | error, `danger`, h2 | "We couldn't load the dashboard" · "Your content is safe. Check your connection, then try again." · primary "Try again" | default | canvas |
| `pages/studio-editor/error`, `spot-editor`, `guide-editor` | error, `danger`, h2 below the application's `h1` (D-3) | "We couldn't open this studio" · "It may have been deleted. Go back to the studio list." · primary "Back to studios" + "Try again"; spot and guide: "The server didn't answer. Nothing was changed; your last save is safe." · primary "Try again" + "Back to spots" / "Back to guides" | default | canvas |
| `pages/admin-studios/empty`, `admin-spots`, `admin-guides` | neutral, `list`, h2 | "No studios yet" · "Add the first studio you've shot in. It stays a draft until you publish it." · primary "New studio" with `plus` | default | canvas |
| `pages/admin-dashboard/empty` | neutral, `camera`, h2 | "Nothing published yet" · "Start with the studio you shot most recently." · primary "New studio" with `plus` | default | canvas |
| `pages/admin-dashboard/up-to-date` | success, compact, `success`, h3 (under "Needs re-verification") | "Everything is up to date" · "No prices or permits are older than 153 days." · no action | default | canvas |
| `pages/spot/no-rain-backup` | neutral, compact, no icon, h3 (under "Rain backup", D-2) | "Studio reviews are coming" · "When we've shot in studios nearby, the closest three will show here." · "Browse studios" | default | canvas (review section) |
| `pages/guide-editor/new`, `guide-editor/invalid` | neutral, compact, no icon, h3 (under the "Entries" section heading, D-2) | "No entries yet" · "Add the studios and spots in the order you want them ranked." · small "Add entry" with `plus`, `aria-haspopup="dialog"` | default | surface (editor section) |

Every row is buildable with `title`, `text`, `icon`, `tone`, `compact`,
`headingLevel` and the `actions` slot. The `info` tone has no use in the mocks;
it is specified so the ICD's tone set is complete (D-5).

## Anatomy

1. **Block** — the host, `st-empty-state.empty`: a centred flex column, gap
   `--space-3`, padding `--space-12` / `--space-6` (compact `--space-8` /
   `--space-4`). No background, so it sits on whatever surface holds it.
2. **Icon (optional)** — `.empty__icon`, `aria-hidden="true"`: a 4.5rem circle
   in `--color-bg-subtle` (tinted by the tone) holding an `xl`
   [`st-icon`](icon.md). Rendered only when `icon` is set.
3. **Title** — `.empty__title`, an `h2`, `h3` or `h4` from `headingLevel`, in
   `--text-h3` whatever its level.
4. **Text (optional)** — `p.empty__text`, `--color-fg-muted`, at most 36ch wide.
   Rendered only when `text` is set.
5. **Actions (optional)** — `.empty__actions`: a centred, wrapping row with gap
   `--space-3` holding the projected buttons and links. Not displayed when
   nothing is projected (D-4).

The host carries the block, tone and size classes and the `role`
(ICD-DOM-1); the parts render inside it.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | The heading text. Product copy. |
| `text` | `string \| null` | `null` | no | `p.empty__text`; omitted when `null` or empty. |
| `icon` | `IconName \| null` | `null` | no | Renders `.empty__icon` with `st-icon` at size `xl`; omitted when `null`. The consumer picks it: `danger` for errors, `success` for all done, the content's glyph otherwise. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'error'` | `'neutral'` | no | Adds `.empty--{tone}`; `neutral` adds none. `error` also sets `role="alert"` on the host (D-1). |
| `compact` | `boolean` | `false` | no | `.empty--compact`: smaller padding, for a section, a search with no hits, or an overlay. |
| `headingLevel` | `HeadingLevel` (`2 \| 3 \| 4`) | `2` | no | The title's element: `h2`, `h3` or `h4` (ICD-API-13). The look is `--text-h3` at every level. |

Signal inputs; `compact` uses `booleanAttribute`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The actions are the consumer's buttons and links; their clicks go straight to the consumer. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `actions` | One or two `button[st-button]` / `a[st-button]` elements, each with `slot="actions"` | The way forward first ("Try again", "Clear filters", "New studio"), then at most one way out ("Go to the home page", "Back to dashboard"). Never a disabled action. |

The empty state has no library strings (ICD §12): every word comes from the
consumer.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Neutral | none | Nothing published yet, nothing matches, pick at least two. Stone icon circle. |
| Error | `.empty--error` + `role="alert"` | A list, map, dashboard or record that did not load. `--color-danger-bg` circle, `--color-danger-icon` glyph. |
| Success | `.empty--success` | All done: "Everything is up to date". `--color-success-bg` circle, `--color-success-icon` glyph. Needs no action. |
| Info | `.empty--info` | An informational empty region; no Phase 1 screen uses it. `--color-info-bg` circle, `--color-info-icon` glyph (D-5). |

| Size | Modifier | Padding (block / inline) | Use for |
|---|---|---|---|
| Default | — | `--space-12` / `--space-6` | A whole list, page area or table |
| Compact | `.empty--compact` | `--space-8` / `--space-4` | A section (Rain backup, Entries), a search with no hits, the map card |

Width: the block fills its container; the text stops at 36ch; the title wraps.

## States

The block is static; its actions carry the interactive states.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (neutral) | `tone` neutral | Stone circle, ink title, muted text | Heading and paragraph; no live role (the result count announces "0 studios") |
| Error | `tone="error"` | Danger-tinted circle | `role="alert"`: announced when it replaces content after a request |
| Success | `tone="success"` | Success-tinted circle, no actions | Heading and paragraph |
| Info | `tone="info"` | Info-tinted circle | Heading and paragraph |
| Compact | `compact` | Half the padding | — |
| Without icon | `icon` null | No circle | — |
| Without text | `text` null | No paragraph | — |
| Without actions | nothing projected | No action row and no space for it | — |
| Action hover, focus, active | the projected button's | The button's states | The button's |
| Action busy | the consumer's `busy` on "Try again" | The button's busy look; the block stays | Focus stays on "Try again" |
| On a raised surface | inside the application's map card or an editor panel | Same tokens; text keeps 4.5:1 on `--color-bg-surface-raised` and `--color-bg-surface` | — |

## Markup

```html
<!-- rendered: nothing published yet -->
<st-empty-state class="empty">
  <div class="empty__icon" aria-hidden="true"><svg class="icon icon--xl" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></div>
  <h3 class="empty__title">No studio reviews yet</h3>
  <p class="empty__text">The first reviews are being shot now. Each one goes up only after a full test shoot.</p>
  <div class="empty__actions"><a class="btn" href="/spots">Browse outdoor spots</a></div>
</st-empty-state>
```

```html
<!-- rendered: didn't load -->
<st-empty-state class="empty empty--error" role="alert">
  <div class="empty__icon" aria-hidden="true"><svg class="icon icon--xl" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/></svg></div>
  <h3 class="empty__title">We couldn't load the studios</h3>
  <p class="empty__text">The studio list didn't arrive. Check your connection and try again; your filters are kept.</p>
  <div class="empty__actions">
    <button class="btn" type="button"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg>Try again</button>
    <a class="btn btn--ghost" href="/">Go to the home page</a>
  </div>
</st-empty-state>
```

```html
<!-- rendered: all done, compact, no actions -->
<st-empty-state class="empty empty--compact empty--success">
  <div class="empty__icon" aria-hidden="true"><svg class="icon icon--xl" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg></div>
  <h3 class="empty__title">Everything is up to date</h3>
  <p class="empty__text">No prices or permits are older than 153 days.</p>
  <div class="empty__actions"></div>
</st-empty-state>
```

```html
<!-- rendered: compact in a section, no icon -->
<st-empty-state class="empty empty--compact">
  <h3 class="empty__title">Studio reviews are coming</h3>
  <p class="empty__text">When we've shot in studios nearby, the closest three will show here.</p>
  <div class="empty__actions"><a class="btn" href="/studios">Browse studios</a></div>
</st-empty-state>
```

The info tone adds `.empty--info`. The empty `.empty__actions` element is not
displayed (`:empty`), so it takes no space. Host tag names are not part of the
contract (ICD-DOM-3).

```html
<!-- consumer: studio list load failure -->
<st-empty-state tone="error" icon="danger" [headingLevel]="3"
  i18n-title title="We couldn't load the studios"
  i18n-text text="The studio list didn't arrive. Check your connection and try again; your filters are kept.">
  <button st-button slot="actions" type="button" [busy]="retrying()" (click)="retry()"><st-icon name="refresh" /><ng-container i18n>Try again</ng-container></button>
  <a st-button slot="actions" variant="ghost" [routerLink]="paths.home" i18n>Go to the home page</a>
</st-empty-state>

<!-- consumer: Rain backup with no published studio (L2-038) -->
<section class="review-section" aria-labelledby="rain">
  <h2 id="rain" i18n>Rain backup</h2>
  <st-empty-state compact [headingLevel]="3" i18n-title title="Studio reviews are coming"
    i18n-text text="When we've shot in studios nearby, the closest three will show here.">
    <a st-button slot="actions" [routerLink]="paths.studios" i18n>Browse studios</a>
  </st-empty-state>
</section>

<!-- consumer: editor that couldn't open its record (D-3) -->
<h1 class="visually-hidden" i18n>Edit studio</h1>
<st-empty-state tone="error" icon="danger" i18n-title title="We couldn't open this studio"
  i18n-text text="It may have been deleted. Go back to the studio list.">
  <a st-button slot="actions" variant="primary" [routerLink]="paths.adminStudios" i18n>Back to studios</a>
  <a st-button slot="actions" [routerLink]="currentPath()" i18n>Try again</a>
</st-empty-state>
```

## Design

- Layout: flex column, `align-items: center`, `text-align: center`, gap `--space-3`.
- Padding: `--space-12` block and `--space-6` inline; compact `--space-8` and `--space-4`.
- Icon circle: 4.5rem square, `--radius-full`, `display: grid; place-items: center`, `margin-bottom: var(--space-2)`; the glyph is `--icon-size-xl` (`st-icon size="xl"`).
- Title: `--text-h3`, `--color-fg-default`, at every heading level; wraps, never truncates.
- Text: `--color-fg-muted`, body type, `max-width: 36ch`.
- Actions: flex row, gap `--space-3`, `margin-top: var(--space-2)`, `flex-wrap: wrap`, `justify-content: center`; `display: none` when empty.
- Elevation, radius, background: none on the block.
- Motion: none; the block appears in place of the skeleton without animation.

The component declares no tokens of its own. The tone modifiers change only
the circle's background and colour.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Icon circle (neutral) | `--color-bg-subtle` | `--palette-stone-100` | `--palette-stone-800` |
| Icon (neutral), title | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Text | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Error circle | `--color-danger-bg` | `--palette-sorrel-50` | `--palette-sorrel-950` |
| Error icon | `--color-danger-icon` | `--palette-sorrel-500` | `--palette-sorrel-300` |
| Success circle | `--color-success-bg` | `--palette-callaloo-50` | `--palette-callaloo-950` |
| Success icon | `--color-success-icon` | `--palette-callaloo-500` | `--palette-callaloo-300` |
| Info circle | `--color-info-bg` | `--palette-stone-50` | `--palette-stone-900` |
| Info icon | `--color-info-icon` | `--palette-stone-700` | `--palette-stone-350` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-subtle` | 3:1 | Neutral icon on its circle |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | Error icon on its circle |
| `--color-success-icon` | `--color-success-bg` | 3:1 | Success icon on its circle |
| `--color-info-icon` | `--color-info-bg` | 3:1 | Info icon on its circle |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Title on the page |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Text on the page |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Text in an editor section |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Title on the map card |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Text on the map card |

The tone is never the only signal: error titles start "We couldn't…" and the
success title says "Everything is up to date". Forced colours: the circle's
background is removed by the system and the glyph and text take system
colours; nothing depends on the tint.

## Responsive behaviour

- Centred in its container at every width; the text column stops at 36ch, so
  lines stay short on a 1440 px screen too.
- Actions wrap onto their own centred lines when two buttons cannot share one,
  as "Try again" and "Go to the home page" do at 360 px.
- In the studio and spot lists the state takes the place of the card grid,
  beside the filter sidebar from 62rem and under the Filters button below it.
- Over the map, the application's card is centred with a 16 px inset and at
  most 24rem wide, so the map edges still show on a phone.
- Long search terms in a title ("No studios match “parkdale”") wrap; the title
  never truncates. At 320 px nothing scrolls sideways; at 200 % zoom
  everything stays available. Actions are full-size buttons, 44 px tall on
  phones, with 12 px between them.

## Accessibility

### Role and pattern

No widget role: a heading, a paragraph and native links or buttons. The error
tone carries `role="alert"` (APG
[Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)), so a
failure that replaces content after a client-side request is announced (WCAG
4.1.3). Neutral, info and success states have no live role: a no-results
state is announced by the result count's `role="status"` ("0 studios"), and
the others arrive with the page.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Moves to the first action ("Clear filters", "Try again", "New studio"), then the second. The block itself is not focusable. |
| <kbd>Enter</kbd> | Follows a link or presses a button. |
| <kbd>Space</kbd> | Presses a button ("Try again"). |

### Focus

The component never moves focus. Focus is not moved into an empty state that
appears after a filter change; it stays on the filter. "Try again" keeps focus
while it is busy and while the region reloads. On a full page that only shows
an empty state (an editor that could not open its record), focus lands on
`main` like any page load (the application's).

### Labelling

- The title is a real heading at the level the page outline needs: `h3` under
  the hidden "Results" `h2` in the public lists and under a section heading
  (Rain backup, Entries, Needs re-verification); `h2` on admin pages, compare,
  guides and the map.
- The icon is decorative: its wrapper and its SVG are `aria-hidden`.
- "Try again" names what it retries through the title above it; it needs no
  hidden text.

### Announcements

`role="alert"` on the error tone is the only announcement: the title and text
are read once when the block is inserted. The block never announces itself
again while it stays.

### Motion

None. The design-system page specifies no animation for the block.

## Content and internationalisation

- Title: what is (not) here, in plain words: "No studio reviews yet", "No
  studios match these filters", "We couldn't load the studios". Errors start
  "We couldn't…", owning the failure.
- Text: why, and what next, one or two sentences; reassure when something
  failed ("Nothing has changed.", "Your content is safe.", "your filters are
  kept").
- Action: one way forward, named for what it does (Clear filters, Clear search,
  Try again, New studio, Browse studios); a second action only to leave (Go to
  the home page, Back to dashboard).
- Give the count that clearing restores ("clear them all to see all 7
  studios"); say which filters clash ("The only waterfront spot isn't rated for
  family shoots."); quote a search term with curly quotes (No studios match
  “parkdale”).
- Public first-run copy keeps the promise honest: reviews are "being shot now"
  and go up "only after a full test shoot"; never "coming soon" with a date.
  No exclamation marks, no "Oops", no illustrations.
- Translatable: `title`, `text` and the projected actions, all product copy
  marked by the consumer (`i18n-title`, `i18n-text`, `i18n`). Data inside them:
  counts and search terms, formatted by the application. French runs about
  30 % longer; the title and text wrap and the actions wrap onto new lines.

## Performance

- Change detection: `OnPush`, signal inputs; host classes and `role` come from
  one `computed` each; the title element is chosen with `@switch` on
  `headingLevel`.
- Performance scenario: the `components-harness` route `empty-state/performance`
  renders the studio list's no-results state ("No studios match these
  filters", "Try removing a filter, or clear them all to see all 7 studios.",
  "Clear filters") and then swaps in the error state with "Try again" and "Go
  to the home page"; load and swap stay within the L2-071 budgets.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the block renders in one pass with its final content; no
  part appears later.
- Weight: imports `@angular/core` and the library's `IconComponent`.

## Acceptance criteria

### Rendering

- **AC-1** Given `<st-empty-state title="No studio reviews yet" text="The first reviews are being shot now. Each one goes up only after a full test shoot." icon="camera" [headingLevel]="3">` with the link "Browse outdoor spots" in `actions`, when it renders, then the host has the class `empty`, and holds in order `.empty__icon[aria-hidden="true"]` with a 28 px camera icon, `h3.empty__title`, `p.empty__text` and `.empty__actions` with the link. (L2-069)
- **AC-2** Given the admin studios list's "No studios yet" with no `headingLevel`, when it renders, then the title is an `h2.empty__title`. (L2-069)
- **AC-3** Given Evergreen Brick Works' page with no published studio, when the "Rain backup" section renders, then it holds a compact empty state (`empty empty--compact`) with no `.empty__icon`, the `h3` "Studio reviews are coming", the text "When we've shot in studios nearby, the closest three will show here." and a "Browse studios" link to the studio list. (L2-038)
- **AC-4** Given the spot list filtered to waterfront and family, when no spot matches, then the empty state shows "No spots match these filters", "The only waterfront spot isn't rated for family shoots. Remove a filter, or clear them all to see all 5 spots." and a "Clear filters" link, with no tone class and no `role`. (L2-024)
- **AC-5** Given `/compare?studios=the-junction-loft`, when the page renders, then the empty state shows "Pick at least two studios to compare" with a "Browse studios" link to the studio list. (L2-032)
- **AC-6** Given the dashboard with nothing stale or due soon, when the "Needs re-verification" section renders, then it holds `empty empty--compact empty--success` with "Everything is up to date", "No prices or permits are older than 153 days.", and no visible actions row. (L2-044)

### States

- **AC-7** Given the studio list request fails, when the application renders the error state, then the host has `empty empty--error` and `role="alert"`, the circle is `--color-danger-bg` with the `danger` glyph, and the actions "Try again" and "Go to the home page" are present in that order. (L2-026)
- **AC-8** Given that error state, when the visitor activates "Try again", then the application's click handler runs once and the component neither stops nor duplicates the click. (L2-026)

### Screen readers

- **AC-9** Given the studio list after a client-side refresh fails, when the error state replaces the skeletons, then a screen reader announces "We couldn't load the studios" and its text once. (L2-069)
- **AC-10** Given the studio list filtered to nothing, when "No studios match these filters" replaces the cards, then the empty state has no live role and the only announcement is the result count's "0 studios". (L2-069)
- **AC-11** Given the studio editor that couldn't open its record, with the application's `h1` and the empty state at `h2`, when headings are listed, then the page has exactly one `h1` and no skipped levels. (L2-069)
- **AC-12** Given the studio list's empty, no-results and error states, when axe-core scans each in light and dark, then no violation is reported. (L2-069)

### Keyboard and focus

- **AC-13** Given a keyboard user removes the last matching filter chip and "No studios match these filters" appears, when they press Tab, then focus moves through the remaining chips to "Clear filters", and the empty state never took focus itself. (L2-067)
- **AC-14** Given focus on "Try again" in the map's error card, when the consumer sets it busy and the error state is rendered again, then focus is still on "Try again". (L2-067)

### Theming

- **AC-15** Given the neutral, error and success states on the page and the compact error state on the map's raised card, when the contrast check runs in light and dark, then each glyph is at least 3:1 against its circle and the title and text are at least 4.5:1 against the surface behind them. (L2-068)

### Responsive

- **AC-16** Given "We couldn't load the studios" at 320 px wide, when it renders, then "Try again" and "Go to the home page" wrap onto separate centred lines, the text is at most 36ch wide, and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-17** Given "No studios match “parkdale”" in the admin studios list at 320 px, when it renders, then the title wraps with no truncation and nothing overflows horizontally. (L2-064)
- **AC-18** Given the compare page's empty state at 200 % zoom in a 1280 px viewport, when it renders, then the title, text and "Browse studios" are fully visible with no horizontal page scroll. (L2-066)

### Content

- **AC-19** Given an empty state with only `title="No guides yet"`, when its text content is read, then it is exactly "No guides yet": the component adds no words of its own. (L2-070)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the block never
animates, so `prefers-reduced-motion` changes nothing
([empty-state.html](../../design-system/components/empty-state.html),
Accessibility › Motion).

### Performance

- **AC-20** Given the `empty-state/performance` harness route, when it loads the no-results state and swaps in the error state on the Lighthouse mobile profile, then Largest Contentful Paint is at most 2.5 s, Cumulative Layout Shift at most 0.1 and the swap's Interaction to Next Paint at most 200 ms. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/empty-state/`:
  `empty-state.component.ts` (`EmptyStateComponent`, selector
  `st-empty-state`, host bindings `class` and `[attr.role]`),
  `empty-state.component.html` (`@if (icon())` wrapper with
  `<st-icon [name]="icon()!" size="xl" />`; `@switch (headingLevel())` for
  `h2`/`h3`/`h4`; `@if (text())` paragraph;
  `<div class="empty__actions"><ng-content select="[slot=actions]" /></div>`),
  `empty-state.component.css` (port of `.empty*` from `components.css`, against
  `:host` and `:host(.empty--error)`, plus `.empty__actions:empty { display:
  none }` and `.empty--info`).
- `.empty--info .empty__icon { background: var(--color-info-bg); color:
  var(--color-info-icon) }` is new; `components.css` has only error and
  success.
- The `.static-map__overlay > .empty` rule is not ported: the application
  draws the map's card around the host (D-6).
- Composes [`st-icon`](icon.md). Actions are the consumer's
  [`button[st-button]`](button.md) and `a[st-button]`.
- Mocks drift the component corrects: every error state gets `role="alert"`
  (the admin lists, dashboard and studio editor lacked it); the icon wrapper is
  always `aria-hidden`; the guide editor's inline `--text-h4` title becomes
  `--text-h3`; the paragraph titles of Rain backup and Entries become `h3`
  (D-2); the editors' `h1` titles become `h2` below the application's `h1`
  (D-3); the dashboard's inline `margin-top` and the map card's inline surface
  become application layout (D-6).

## Decisions

- **D-1** *When does the block get `role="alert"`: on every error, or only when it replaces content after a client-side request?* On every error (`tone="error"`). The design system requires it on every error that replaces content after a request, which is every error screen in the mocks except a full server render; an alert already present at page load is not announced by screen readers, so the server-rendered case loses nothing, and one rule saves a second input.
- **D-2** *The Rain backup and guide editor "Entries" mocks use a `p` title under a section heading; `HeadingLevel` has no paragraph option.* The title is always a heading, one level below the section heading (`h3`). The design system allows a heading there, it keeps the outline without skipped levels (L2-069.1), and a screen-reader user can reach the message by heading.
- **D-3** *The editor error mocks make the empty-state title the page's `h1`, but ICD-A11Y-3 lets only `st-page-header` and `st-error-page` render an `h1`.* The application renders the page's `h1` ("Edit studio", visually hidden) and the empty state renders its title at `h2`. This keeps the interface as it is and meets L2-069.1 (one `h1`, no skipped levels); the visible page is unchanged because the title keeps `--text-h3`. This departs from the design system's "the error title is the page's `h1`" and is reported to the owner.
- **D-4** *What happens to `.empty__actions` when nothing is projected (the success state)?* The element stays in the template, because a slot is declared once (ICD-API-9), and is hidden with `:empty`, so it adds no gap or margin. Angular removes whitespace between tags, so an unfilled slot leaves the element empty.
- **D-5** *ICD-002 allows `tone: 'info'`, which the design system and the mocks never draw.* It tints the circle with `--color-info-bg` and `--color-info-icon`, the same roles the info alert uses, so it follows the error and success pattern. No Phase 1 screen uses it.
- **D-6** *The map's floating card (raised surface, radius, shadow, 24rem) is drawn by a rule from the application block `.static-map__overlay` onto `.empty`, which ICD-DOM-5 forbids.* The application wraps the empty state in its own card element with those properties; the component stays background-free as the design system says. The dashboard's extra top margin is likewise the application's margin on the host.
- **D-7** *Does the component pick the icon from the tone?* No. `icon` is an input with no default (ICD), and the mocks pair tones with specific glyphs (`danger`, `success`); the consumer passes them, so the component holds no mapping that a later screen might need to override.
