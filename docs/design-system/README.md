# ShotThere design system

Extracted from the [ShotThere mocks](../mocks/README.md) (33 screens, 143 mocks) on Tuesday 13 October 2026. Open [index.html](index.html) in a browser; press <kbd>t</kbd> on any page to switch between light and dark.

The tokens, foundations and basic components started as a copy of an earlier design system for another product. This extraction rewrote every example, variant and rule from the ShotThere mocks, added 23 pages for the ShotThere components, and removed everything the ShotThere mocks do not use (see [Changelog](#changelog)).

Three rules hold everywhere:

- **One ink-black primary button per screen** (`--color-action`).
- **Accent red means "selected / you are here"** (`--color-accent`): a pressed Compare toggle, an active filter, the current nav item. Never an action, never an error (danger red is deeper and cooler).
- **Never colour alone**: scores are a number plus pips, map markers differ by shape (ink square for studios, ringed circle for spots), statuses are a word plus a shape.

## How to use it

1. Link `tokens/tokens.css`, then `assets/components.css`. (`assets/ds.css` and `assets/ds.js` are only for these documentation pages.)
2. Use the class names and attributes from each component page's **Code** section. State lives in real attributes (`disabled`, `aria-disabled`, `aria-pressed`, `aria-current`, `aria-invalid`, `aria-expanded`, `aria-busy`); `data-state` only forces hover, focus and active in static pages. The mocks, the Angular frontend and its Playwright page objects share these class names.
3. Read tokens by role (`var(--color-fg-muted)`), never by value. Other platforms consume `tokens/tokens.json`.
4. Theme with `data-theme="light|dark"` on `<html>`; without it the OS preference applies.
5. Re-run both checkers below after any change.

## Foundations

| Page | Covers |
|---|---|
| [Color](foundations/color.html) | Neutral stone, accent red and status ramps; semantic roles in both themes; every contrast pair with live ratios. |
| [Typography](foundations/typography.html) | Figtree and mono, the type scale and text roles, tabular numbers for prices, scores and measurements. |
| [Spacing](foundations/spacing.html) | The 4px scale, inside versus between, padding by component size, control heights and touch targets. |
| [Layout](foundations/layout.html) | Breakpoints, columns, gutters and margins; containers; the home, browse, review, compare, map, admin and editor templates. |
| [Elevation](foundations/elevation.html) | Flat by default; four shadows; surfaces; z-order for the compare bar, map popup, sheets, dialogs and toasts. |
| [Shape](foundations/shape.html) | Radius scale by element, border widths and focus rings. |
| [Motion](foundations/motion.html) | Durations and easings with replayable demos; overlay choreography; hover zoom; reduced motion. |
| [Iconography](foundations/iconography.html) | Outline icons on a 24-unit grid, sizes, colour and labelling rules, and every icon the mocks use. |
| [Theming](foundations/theming.html) | data-theme and prefers-color-scheme, token tiers, why dark is not inverted, adding a theme, tokens.json. |
| [Responsive](foundations/responsive.html) | Mobile first at 360px, viewport classes, what every component does at each breakpoint, safe areas. |
| [Accessibility](foundations/accessibility.html) | WCAG 2.2 AA commitments, focus, 44px targets, scores and map markers that never rely on colour alone. |
| [Content](foundations/content.html) | First-hand, measured voice; Canadian English; CAD all-in costs, dates, units and scores; error and empty formulas. |

## Components

55 components, every one found in the ShotThere mocks. Every page has the same thirteen sections: overview, anatomy, variants, sizes, states, responsive, theming, accessibility, content, do and don't, tokens, code, sources.

### Actions

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Button](components/button.html) | primary, secondary, ghost, link, danger, compare toggle; sm, md, lg; icon, block, wrap | default, hover, focus, active, disabled, busy, pressed, aria-disabled | studio/default, in-compare; studios/selected, selected-one, filtered; studio-filters/*; studio-editor/*; delete-content/*; discard-changes; remove-image; sign-in; admin-dashboard |
| [Icon button](components/icon-button.html) | ghost, outline | default, hover, focus, active, disabled | lightbox/*, map-popup/* |
| [Button group](components/button-group.html) | segmented (map Show and View as), button group | default, hover, focus, disabled, pressed | map/*, map-popup/* |
| [Link](components/link.html) | inline, standalone, external, external as a button | default, hover, focus | editorial-policy, guide, compare, spot/*, studio/default, map-popup |
| [Compare toggle and bar](components/compare-bar.html) | card toggle (sm), review toggle (md); bar with 1 or 2–4 picked | toggle off/on × default, hover, focus, active; bar hidden, 1 with hint, 2–4, over the limit | studios/selected-one, selected; studio/default, in-compare; public-toast/*; compare/over-limit |

### Inputs

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Form field](components/form-field.html) | help, optional, conditional, error, warning, inline, counter, read-only value | default, hover, focus, invalid, warning, disabled, read-only | sign-in; studio-editor/default, invalid, price-changed; spot and guide editor invalid; studios; studio-filters/invalid; home/invalid |
| [Text field](components/text-field.html) | email, password with Show, text, url, date, decimal and whole numbers, $ addon, unit suffix, search, read-only; sm, md, lg | default, hover, focus, invalid, disabled, read-only | sign-in; studio and spot editors; studio-filters; home; admin-studios; admin-guides |
| [Textarea](components/textarea.html) | verdict, introduction, editor's note, directions; rows 2–4 | default, hover, focus, invalid, disabled, read-only | studio, guide and spot editors |
| [Select](components/select.html) | form, fieldset set, filter, inline sort, fee row | default, hover, focus, invalid, disabled | studios/default, filtered; studio-filters; studio and spot editors |
| [Combobox](components/combobox.html) | raised listbox, flat listbox (`--inline`), empty message | closed, hover, focus, disabled, invalid, expanded, active option, no matches, busy | dialogs/guide-entry-picker/*; guide-editor/default |
| [Checkbox](components/checkbox.html) | single, studio and spot filter groups, editor group with help, option grid | unchecked, checked, indeterminate × default, hover, focus, disabled, invalid; group error | studio-filters, spot-filters, studios, spots, studio and spot editors, missing-fields/spot |
| [Radio group](components/radio-group.html) | filter group, disclosure with dependent field, card | default, hover, focus, selected, disabled, invalid; nothing chosen | studio-filters, spot-filters, spots/filtered, studio and spot editors |
| [File upload](components/file-upload.html) | after a list, empty group, with refused files | default, hover, focus, active, disabled, refused | studio-editor/default, new, uploading, upload-failed; spot-editor/default, new |
| [Form layout](components/form-layout.html) | editor form, field rows (default, pair, fit), fieldset with follow-up, error summary, sign-in layout | default, busy, saved, invalid, disabled | studio, spot and guide editors; sign-in/default, invalid, incorrect, submitting; studio filters |
| [Email signup](components/signup.html) | hero (primary), footer (secondary) | default, hover, focus, active, invalid (empty, not an email), submitting, success, rate limited, server error | home/default, invalid, submitting, success, rate-limited, error; footer of studio/default |

### Navigation

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Skip link](components/skip-link.html) | one | default, focus, print | every mock |
| [Site header](components/site-header.html) | public (Toronto), admin, sign-in (wordmark only) | default, hover, focus, active, current, expanded | studios, studio, spot, home, admin-dashboard, studio-editor, sign-in, dialogs/site-menu/* |
| [Footer](components/footer.html) | public footer with brand, signup, links and copy | link default, hover, focus, current; Subscribe states | home, studios, spots, studio, guide, not-found, server-error |
| [Breadcrumb](components/breadcrumb.html) | public trail, admin trail, new record, loading, error, collapsed on phones | default, hover, focus, current, loading | studio/*, spot/*, guide/default, studio-editor/*, spot-editor/*, guide-editor/* |
| [Filters](components/filter.html) | range, checkbox list, select and radio groups; side column from LG or sheet below; trigger with count; active-filter chips | trigger default, hover, focus, active, disabled, open, with count; chip remove hover/focus; option checked, disabled, invalid; none selected, some selected, invalid range, no results, cleared | dialogs/studio-filters/*, spot-filters/*; studios/default, filtered, no-results; spots/default, filtered, no-results |

### Containers and overlays

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Container and grid](components/container.html) | container, narrow, stack, cluster, grid, prose, section-gap, browse, page-header, home-hero, section-head, has-compare-bar, auth | default, loading, empty, no results, error, selected | studios, spots, home, sign-in, editorial-policy, admin-studios, compare, studio-editor, guide |
| [Review layout](components/review-layout.html) | studio, spot, head-only (guide); studio and spot summary panels | default, hover, focus, active, stale, in compare, hero failed, minimal, playing, no video, no rain backup, map failed | studio/*, spot/*, guide/default |
| [Editor layout](components/editor-layout.html) | status panel (new, draft, published); section (closed, open, invalid); repeating rows (fees, included gear) | default, hover, focus, active, open, invalid; screens new, default, invalid, submitting, success, published, price changed, uploading, upload failed, loading, error | studio-editor/*, spot-editor/*, guide-editor/*, dialogs/discard-changes, unpublish/*, missing-fields/* |
| [Card](components/card.html) | default, header and footer, flush, interactive, selected, well | default, hover, focus, selected | none use `.card` directly; informs location card, stat tile, summary panel, editor aside |
| [Dialog](components/dialog.html) | delete, unpublish, discard changes, remove image, can't publish yet, add entry (form), with icon; sm, default, form, lg, full | default, hover, focus, active, disabled, busy, failed, invalid, refused | dialogs/delete-content, unpublish, discard-changes, missing-fields, remove-image, guide-entry-picker |
| [Sheet and drawer](components/sheet.html) | site menu (visitor, admin), studio filters, spot filters, drawer, drawer left | row default, hover, focus, current; footer states; selected, invalid | dialogs/site-menu, studio-filters, spot-filters |
| [Popover](components/popover.html) | title and text, with actions, map marker popup | trigger default, hover, focus, expanded; open, closed, static | dialogs/map-popup/*, map/default |
| [Lightbox](components/lightbox.html) | gallery photo, sample shot | controls default, hover, focus, active; first, middle, last (wraps); image failed; phone pager | dialogs/lightbox/* |
| [Divider](components/divider.html) | horizontal, vertical, labelled | static | none (core) |

### Data display

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Location card](components/location-card.html) | studio card with or without compare toggle, spot card, stale, compact map-list item, inside a guide entry; 1/2/3-column grid | default, hover, focus, loading, image failed, stale | studios/*, spots/*, home/default, map/list, map/loading, studio/media-failed, guide/default |
| [Table](components/table.html) | reference table (light by time and season), permit table, admin list; `.num`, `.na` | default, hover, focus, loading, sorted, stacked below 48rem, empty and error replaced by an empty state | spot/default, stale-permit; admin-studios/*, admin-spots/*, admin-guides/* |
| [Comparison table](components/compare-table.html) | 2, 3 or 4 columns; empty below 2 | row hover, header link hover and focus, lowest, missing value, stale price, unknown slug, over the limit, empty | compare/*; public-toast/success, danger |
| [List rows](components/list.html) | list row, full-row link, admin row with badge and Edit, section link, section link with attention meta | default, hover, focus, active, selected, current, loading, empty | spot/default, stale-permit, no-video, map-failed; admin-dashboard/*; dialogs/site-menu/* |
| [Description list](components/description-list.html) | `.kv` (specs, pricing and fees, gear, logistics, spot directions and conditions), `.regions`, summary-panel rows | static, sparse value, stale | studio/default, minimal, stale; spot/default, stale-permit |
| [Price block](components/price-block.html) | no fees, mandatory fee, mandatory and optional fees, minimum above 2 h, verified line under a permit table | fresh, due soon, stale, price changed (editor), source link hover/focus | studio/default, minimal, stale; spot/default, stale-permit; studios/default; compare/default; studio-editor/price-changed |
| [Score and pips](components/score.html) | verdict (overall plus six rubric rows), studio light grid, spot light table, compact number only | static values: rubric 1–5, light None/Low/Medium/Strong, overall | studio/default, stale, minimal, in-compare, playing, media-failed; spot/default, no-video; compare/default; studios/default; guide/default |
| [Shot grid](components/shot-grid.html) | standard test shots with setup line, gallery, spot sample shots | default, hover, focus, active, loading, failed | studio/default, media-failed; spot/default |
| [Episode poster](components/video-poster.html) | studio episode, spot episode; poster then player | default, hover, focus, active, playing, poster failed, no video | studio/default, playing, media-failed, minimal; spot/default, no-video |
| [Map](components/map.html) | locations map, spot map, preview map; studio and spot markers; floating or docked popup; inline or overlay legend; tiles-failed panel; map page layout; map list item | marker default, hover, focus, active, selected; popup open; studios only; loading; empty; error; tiles failed; list view on phones | map/*; dialogs/map-popup/*; spot/default, map-failed; spot-editor/default, new, invalid |
| [Guide entry](components/guide-entry.html) | ranked entry; data-point sets; guide index as cards or compact list | default, hover, focus, image failed; no guides | guide/default, guides/default, guides/empty, home/default, guide-editor/published |
| [Stat tile](components/stat-tile.html) | primary or secondary action; one size | default, hover, focus, active, loading, zero counts; dashboard error, partial, up to date | admin-dashboard/*; dialogs/site-menu/admin |
| [Image manager](components/image-manager.html) | image set, empty set, sample shot row, entry row, preview row, upload area | ready, only image, uploading, failed, invalid alt text, files refused; remove confirm and refused; move at the ends | studio-editor/default, published, uploading, upload-failed, invalid; spot-editor/default; guide-editor/default; dialogs/remove-image/* |
| [Disclosure](components/disclosure.html) | paid in full, discounted by …, comped by …, spot regular visit | default, link hover, link focus | studio/*, spot/*, editorial-policy/default, studio-editor/default |
| [Badge](components/badge.html) | neutral, success, warning, info; danger, solid, count | tones, wrapped | studio/default, stale; studios/default; spot/default, stale-permit; spots/default; compare/*; admin-dashboard; admin-studios; admin-spots |
| [Status label](components/status-label.html) | published, draft; in an admin row and the editor | default, in a hovered row, stacked card at XS | admin-studios/default, admin-spots/default, admin-guides/default, studio-editor/default, published, guide-editor/default, spot-editor/default, notifications/admin-toast/success |
| [Chip](components/chip.html) | active filter (removable), toggle, static | default, hover, focus, active, pressed, disabled | studios/filtered, no-results; spots/filtered, no-results |
| [Tag](components/tag.html) | static on a card or under a caption, link to filtered spots or guides; compact and large | link default, hover, focus | spots/default, filtered; home/default; spot/default; studio/default, stale |

### Feedback

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Inline message](components/inline-message.html) | help, error, warning, error without a field, save status | default, invalid, busy, saved, error | studio-editor/*, spot-editor/invalid, guide-editor/invalid, sign-in/invalid, home/invalid, studio-filters/invalid, guide-entry-picker/invalid |
| [Alert and banner](components/alert.html) | info, success, warning, danger; title and body, body only, with actions, dismissible, in a dialog; `.banner` | dismiss and action default, hover, focus, active, disabled, busy | studio/stale, spot/stale-permit, sign-in/*, home/error, rate-limited, compare/over-limit, unknown-slug, editor success, admin-dashboard/partial, dialogs failed |
| [Toast](components/toast.html) | public (success, warning, danger), admin (info, success, warning, danger), stacked; action, progress; region bottom, above compare bar, top, static | dismiss and action states; entering, counting down, paused, persistent, leaving | notifications/public-toast/*, admin-toast/* |
| [Progress and meter](components/progress.html) | upload bar, toast timer; indeterminate, success, danger, meter | 0%, uploading, complete, processing, succeeded, failed | studio-editor/uploading, upload-failed; admin-toast/*, public-toast/* |
| [Spinner](components/spinner.html) | busy button (default, primary, danger; sm, md, lg), inline with caption | default, hover, focus, active, disabled, busy | delete-content/busy, unpublish/busy, sign-in/submitting, home/submitting, editors' submitting, guide-entry-picker/busy |
| [Skeleton](components/skeleton.html) | text, title, rect, pill; location card, map row and area, admin row, stat tile, editor | loading, loaded, failed | studios, spots, map, admin-*, editors loading |
| [Empty state](components/empty-state.html) | nothing published yet, no results, didn't load, all done, compact | default, hover, focus, active, busy | studios/spots/guides/home/map/compare empty; no-results; errors; admin-dashboard/up-to-date; spot/no-rain-backup; guide-editor/new |
| [Error page](components/error-page.html) | 404, 500 with reference; compare unknown slug and rate limit as in-page cases | action default, hover, focus, active | not-found/default, server-error/default, compare/unknown-slug, sign-in/rate-limited |

## Patterns

| Pattern | Covers |
|---|---|
| [Forms](patterns/forms.html) | Sign-in, signup and the editors: layout, labels, validation timing, error summary, submit states. |
| [Feedback and loading](patterns/feedback-and-loading.html) | Which feedback for which action; skeleton versus spinner versus progress; optimistic versus confirmed. |
| [Empty and error states](patterns/empty-and-error-states.html) | First run, no results, unknown compare slugs, failed maps and media, 404, 500 and rate limits. |
| [Navigation and page structure](patterns/navigation.html) | Header and menu, browse to review to compare, the admin dashboard, back links and URL state. |
| [Dialogs and overlays](patterns/dialogs-and-overlays.html) | Dialog versus sheet versus popover versus lightbox; focus start and return; no stacking. |
| [Data tables and lists](patterns/tables-and-lists.html) | Location grids, the comparison table, stacked spec tables, admin rows and fixed sort orders. |
| [Notifications](patterns/notifications.html) | Public and admin toasts, alerts and inline messages; persistence and live regions. |
| [Content and tone](patterns/content-and-tone.html) | The review's voice from verdict to disclosure, admin copy, and the nouns and verbs we keep. |

## Tokens

- `tokens/tokens.css` is the single source of truth (221 tokens) in three tiers:
  - primitives: `--palette-*` and `--font-*`. The palette names (stone, pepper, callaloo, mango, sorrel) are kept from the inherited system for stability; read them as neutral, accent red, success green, warning amber and danger red;
  - semantic tokens: colour, text roles, space, layout, radius, shadow, motion, z-order, interaction, icon size;
  - component tokens (`--btn-*`, `--field-*`, …), declared in `assets/components.css`.

  Light is `:root` (restated under `[data-theme="light"]`). Dark is `[data-theme="dark"]` plus an identical block under `prefers-color-scheme: dark`. Reduced motion, `prefers-contrast: more` and forced colours are handled in the tokens and components.
- `tokens/tokens.json` is the W3C DTCG export (aliases preserved; dark overrides under `$extensions`). Regenerate it with `tokens_to_json.py` after editing `tokens.css`.
- `tokens/contrast-pairs.json` holds the 118 foreground/background pairings the components rely on, checked in both themes.
- Breakpoints are the L2 viewport classes: sm 36rem, md 48rem, lg 62rem, xl 75rem; 2xl 90rem is the container max. Below 48rem the primary navigation, filter controls and submit buttons are at least 44px tall (L2-065.3); nothing is smaller than 24 × 24px (L2-065.2).
- Photos, map tiles and episode stills in `assets/img/` are the mocks' illustrated SVG stand-ins. They are content, so they keep their own colours in both themes.

## Drift found in the mocks

What the mocks do differently from the system, and how the system resolves it. Where the resolution is a CSS rule, the rule is in `assets/components.css` and the mocks pick it up because they link this stylesheet; markup changes (buttons instead of links, attributes, copy) are for the next pass over the mocks and for the product.

| Mock | Issue | Resolution |
|---|---|---|
| docs/mocks/README.md | Calls 13 October 2026 a Monday; it is a Tuesday | The system writes the date without a weekday or as Tuesday |
| pages/studio/default, media-failed vs pages/spot/default | Studio poster links to playing.html, spot poster to the YouTube watch URL | Poster link is always the watch URL (L2-047.3) |
| pages/studio/*, pages/spot/default | Poster stills are 3:2 cropped into a 16:9 slot | Supply 16:9 stills (1280 × 720) |
| pages/studio/media-failed | At 320–360px the play pill covers the fallback title | Pill moves to the bottom when the poster failed |
| pages/studio/default | Poster has no pressed style | Added pressed state |
| pages/map/*, dialogs/map-popup/* | Markers are `<a href>` with aria-expanded/aria-haspopup; popup Close is a link | Markers and Close are `<button type="button">` |
| dialogs/map-popup/default vs pages/map/* | "All-in for 2 hours: $145.00" vs "All-in 2 h: $145.00" | Use "All-in for 2 hours: $145.00" |
| pages/map/* | Inline heading font on every map-list-item | `.map-list-item .location-card__name` rule |
| pages/map/* | map-list-item has no visible focus | Row focus ring added |
| pages/map/empty, error, loading | Map overlays positioned with inline styles | `.static-map__overlay` added |
| pages/map/* | Tiles `<img>` has no width/height | Give it 1600 × 1000 |
| pages/spot-editor/default, new, invalid | aria-describedby on a plain div is ignored | Add role="group" aria-label="Map preview" |
| pages/map/tiles-failed vs pages/spot/map-failed | `.map-unavailable` has role="status" on one page only | role="status" on both |
| pages/studio/default, in-compare, media-failed, playing | Review date is plain text, not `<time>` | Use `<time datetime>` as studio/stale and minimal do |
| all review mocks | Inline margin-top on breadcrumb, disclosure and score list | `.review-section > .disclosure` spacing rule added; others documented |
| pages/studio/default vs stale, minimal | Tabular figures set two ways (`dd.num` vs a span) | `.num` on the `<dd>` unless a badge follows |
| pages/spot/default, stale-permit | Permit dates reuse `.price-block__verified` | Documented as the shared verified line |
| pages/studio-editor/price-changed | Highlighted field uses an inline style | `.field--warning` added |
| dialogs/guide-entry-picker/no-matches | The listbox is replaced by a div, so aria-controls points at a non-listbox | Keep the listbox in the DOM with `hidden`; the message goes in a sibling `.suggestions` box with role="status" |
| dialogs/guide-entry-picker/invalid | aria-describedby lists the help before the error | Error first in aria-describedby |
| dialogs/guide-entry-picker/results | Note says Esc closes the dialog while the list is open | First Esc closes the list, second closes the dialog (APG) |
| pages/studio-editor/loading vs spot-editor, guide-editor loading | Loading crumb written two ways | Skeleton first, then hidden "Loading" |
| every breadcrumb mock (48) | Inline margin-top on the breadcrumb nav | Breadcrumb spacing rule added |
| pages/guide/default at 360px | Trail wraps to two lines; no mock uses `.breadcrumb--collapse` | Use `--collapse` there |
| dialogs/map-popup/default, spot | Popup sits after all 12 markers and the legend in the DOM | Place the popover right after its trigger |
| dialogs/site-menu/admin | Dashboard behind the menu reads "7 published · 2 drafts" with unlinked h2 tile titles | Follow the dashboard mocks and L2-053.1: "7 published, 2 draft", linked h3, New button |
| dialogs/site-menu/admin | aria-current="page" row has no visual style | Current section-link style added |
| pages/admin-dashboard/loading | Tile skeleton sized inline | `.stat-tile--skeleton` added |
| pages/studio-editor/*, spot-editor/default | Remove image is an `<a href>` | `<button type="button" aria-haspopup="dialog">` |
| pages/guide-editor/default | Entry heading styled inline | `.image-row__title` added |
| pages/studio-editor/upload-failed | Refusal messages use inline flex-basis | `.upload-drop__errors` added |
| pages/studio-editor/default, uploading, upload-failed, invalid | Corktown Garage Studio reuses Liberty Cyc House test shots | Examples use each studio's own shots |
| pages/studio-editor/*, spot-editor/* | No announcement when an image moves | "Test shot 3, now 2 of 3" everywhere (L2-058.3) |
| components.css | `.list__item:last-child` removes the divider from every full-row link | Divider rule moved to the `<li>` |
| 21 editor, 5 admin-toast and 16 dialog mocks | 75 inline `font: var(--text-h4)` h2s: 42 are the editor "Status" heading (no rule), 33 are fake editor sections behind dialogs | `.editor-aside > h2` rule added; dialogs should show real `<details>` sections |
| 16 dialog mocks | The editor behind each dialog fakes sections with divs and inline h2s | Real `<details><summary><h2>` sections |
| 14 editor mocks; spot-editor/published, guide-editor/published | Delete's danger colour is inline in 14 mocks and missing in two | `.btn--danger-ghost` added |
| editor mocks | Publish and Unpublish are links | `<button aria-haspopup="dialog">` |
| studio-editor/invalid | Invalid sections are marked by a border colour alone, under 3:1 | `.editor-section__errors` text count added; errors also open the section and the summary links each field |
| studio-, spot-, guide-editor/invalid | Error summary heading worded three ways | "Fix N things before saving" |
| dialogs/missing-fields/* | Links have no field fragment (L2-056.3); the only button says "OK" | Link to each field; button says "Close" |
| studio-editor/loading, price-changed | Inline layout styles | `.editor-section--skeleton` and `.field--warning` added |
| `.fee-row` between 62rem and 75rem | Amount column shrinks to about 5rem | Amount column has a 7rem minimum |
| studios/*, spots/*, dialogs/*-filters/* (17 mocks) | Filter column heading overrides `.filter-group__title` inline | `.browse__aside h2` rule added |
| studios and spots list mocks | `.filter-trigger` is an `<a>` with no aria-expanded; the open state never appears | A button with aria-expanded |
| dialogs/studio-filters/*, spot-filters/* | Close, Clear all and Show N are links; the invalid state uses a disabled button | All buttons; Close is named "Close filters" |
| studios/filtered, no-results and the spots equivalents | Results-header spacing is inline; `.browse__head` is never used | Use `.browse__head` |
| studios/no-results, spots/no-results | The chip row loses "Clear all" | Chip row keeps "Clear all"; the empty state keeps "Clear filters" (L2-022.4) |
| dialogs/studio-filters/* | L2-022.5 says "Apply"; the sheet says "Show N studios", the side column "Apply filters" | Both documented; L2 wording to be aligned |
| all filter mocks | Focus after removing a chip or clearing is not specified | Next chip's remove button, then the Filters trigger (below LG) or the first group (LG) |
| pages/studio/default, media-failed; spot/default | `.shot` is an `<a href>` to the lightbox mock | `<button type="button">` per the detailed design |
| dialogs/lightbox/* | Close is a link back to the page | `<button type="button">` |
| pages/spot/default, dialogs/lightbox/sample-shot | Sample images declared 800 × 1000; the files are 1200 × 800 | Declare the true size |
| components.css (viewer) | aria-disabled end-arrow rule contradicts L2-010.3 (navigation wraps) | Rule removed |
| dialogs/lightbox/* at phone width | Pager sits on the home indicator; the safe-area inset is on the caption | Inset moved to the pager |
| pages/studio/* | Pips disappear in forced colours | Forced-colours rule for pips added |
| pages/compare/default, studios/default, guide/default | Scores shown without pips | Documented as the compact variant (number only) |
| all mocks | `.light-grid__note` is styled but never used | Documented as optional |
| pages/home/* (hero and footer) | Inline align-self on Subscribe | `.signup__row .btn` alignment rule added |
| pages/home/invalid | `autofocus` on the invalid input | Focus moves to the field after submit, never on load |
| pages/home/success | Form replaced without moving focus | Move focus to the confirmation (tabindex="-1") |
| pages/home/invalid | The not-an-email message (README assumption 13) is never rendered | Rendered on the Email signup page |
| pages/spot/*, studio/* | Large link-tag size inline on every `a.tag` | `a.tag` large size rule added |
| pages/guide/default | `ol.guide-list` has list-style none and an aria-hidden rank, so VoiceOver loses the list and the rank | Add role="list" and keep the rank in text |
| pages/guide-editor/published | Kensington's editor's note differs from the public guide's | The public guide's note is the reference |
| components.css | Duplicate `.status--published` / `.status--draft` rules; comment cites L2-069.5 which does not exist | Duplicates removed; cite WCAG 1.4.1 |
| pages/studios/*, spots/* (12 list mocks) | Results row spaced inline; `.browse__head` unused | Use `.browse__head` |
| pages/guide/default | `.prose` on a single paragraph with inline max-width and margins | Do/don't on the container page |
| dialogs/missing-fields/* vs remove-image/refused | Only button is "OK" in one, "Got it" in the other | "Got it" |
| dialogs/missing-fields/* | Body list styled inline | `.dialog__body ul` rule added |
| dialogs/*/default, failed | Close, Cancel and confirm are links; the busy mocks use buttons | Buttons |
| dialogs/studio-filters/*, pages/studios/* | Inline grid-template-columns on `.field-row` | Documented |
| pages/admin-dashboard, studio, studio-editor | stat-tile, summary-panel, editor-aside and editor-section each restate the card border | Recorded on the Card page |
| pages/spot-editor/submitting, guide-editor/submitting | Busy button renamed "Saving…" beside a "Saving…" status; the studio editor keeps "Save changes" | Keep the button label; the status line says "Saving…" |
| pages/sign-in/submitting | Button renamed "Signing in" with a hidden status repeating it | Keep the label |
| pages/home/submitting | Signup busy state has no status message | Hidden "Subscribing…" status |
| dialogs/delete-content/busy, unpublish/busy, sign-in, editors | Native `disabled` on the pressed button drops keyboard focus | `aria-disabled`, focus stays in place |
| pages/map/loading | Map list rows repeat card skeleton widths inline | Use `location-card--skeleton` on `.map-list-item` |
| pages/admin-*/error, admin-dashboard/error, studio-editor/error | No `role="alert"`, unlike the public lists, map and other editors | `role="alert"` on every error that replaces content after a request |
| pages/guide-editor/new, invalid | Empty title set to h4 inline | Keep the h3 size |
| pages/map/empty, error | Floating card surface, radius and shadow inline | `.static-map__overlay` rule added |
| pages/map/default | Spot marker's 4px ring reads `--space-1`; no 4px border token | Documented on Shape |
| notifications/public-toast/warning | Toast offset above the compare bar set inline | `.has-compare-bar .toast-region` rule added |
| pages/studio/media-failed | Failed-image fallback is the sunken colour, not the photo-slot colour | Fallback uses `--color-bg-photo` |
| pages/map/loading | Map list skeleton sized inline | Skeleton rule extended to `.map-list-item` |
| pages/spots/*, studios/* | Plain tags and the actions row sit above the card link, so taps on them open nothing | Only the controls inside take pointer events |
| pages/studios/selected-one at 360px | Compare bar is 122–143px tall but the page keeps only 96px clear (L2-030.6); a focused footer link can hide under the bar (WCAG 2.4.11) | Larger padding and scroll-padding on phones |
| pages/studio/in-compare | Compare comes before Clear; bar labelled "Comparison"; `.has-compare-bar` on `<main>` | Clear then Compare; label "Studios to compare"; class on `<body>` |
| pages/studios/selected-one | Compare is natively disabled with aria-describedby, so keyboard users never reach the hint | `aria-disabled="true"` |
| pages/compare/* | Inline badge wrapping and caption display; scroll wrapper has no tabindex, role or label; group row fill never applies (specificity); group label scrolls away on phones | Class rules; wrapper gets tabindex="0" role="region" aria-labelledby; sticky group label |
| pages/compare/default | Copy link is an `<a>` to the toast mock | `<button>` |
| 119 mocks with a Menu trigger | Menu trigger is an `<a href>` with aria-haspopup and aria-expanded | `<button type="button">` |
| dialogs/site-menu/default | Public menu has no aria-current (the admin menu does) | Both mark the current page |
| pages/admin-* at 768px | Header is 1px wider than the viewport | Nav link padding reduced between MD and LG |
| pages/studios/default | Footer Studios link has no aria-current (the other 7 states have it) | Marked in every state |
| all 15 editor mocks with uploads | Accepted-types line not tied to the file input | aria-describedby |
| editor save-status lines | Refused and new strings vary; `--saved`/`--error` modifiers unused | One string each; modifiers applied |
| pages/sign-in/invalid | Error summary has no aria-labelledby and relies on autofocus | Aligned with the editor summaries |
| 32 field rows | Inline grid-template-columns | `.field-row--pair`, `--fit`, `--fit-sm` added |
| all 21 editor mocks | Sticky actions can hide a focused field (WCAG 2.4.11) | scroll-padding-bottom added |
| all mocks with icons | 32 drawings for 23 icons (warning drawn 4 ways, info 3, danger, refresh, map pin and search 2 each) | One drawing per icon; the variants are listed on Iconography for replacement |
| components.css comments | Cite L2-065.1 for 44px targets; the rule is L2-065.3 | Comments corrected |
| dialogs/missing-fields/* vs remove-image/refused | Info-only dialogs close with "OK" or "Got it" | "Got it" (a dialog button names what it does) |
| pages/spot/* | No mock shows the permits disclaimer | Rule on the Content page; UI still to be mocked |
| pages/admin-studios/loading | Skeleton rows have no row header or data-label | Acceptable for a placeholder |
| all editors | save-status `--saved`/`--error` modifiers never used | Documented with the modifiers |
| spot-editor/invalid vs studio-editor/invalid | aria-describedby order differs | Error first |
| sign-in, home, studio/stale, dialogs, public-toast/warning | Warning triangle and info icons drawn several ways | One drawing per icon (dup of Iconography) |
| dialogs/unpublish/failed, delete-content/failed, remove-image/refused | Bare text in `.alert__body` | Wrap in `<p>` |
| studio-editor/success vs spot, guide editor success | Only the studio "created as a draft" alert has Dismiss | Dismiss is optional |
| all toast mocks | role="alert" danger toast nested inside the role="status" region | Test for double announcement; use a sibling role="alert" container if needed |
| studio and spot mocks with an episode (7) | "Watch on YouTube" has `.link--external` but shows no arrow; external arrows drop onto their own line | `.link--external .icon` set inline |
| dialogs/map-popup/* | "View the review" is a bare link about 24px tall | `.link--standalone` (44px target) |
| pages/map/* (9 mocks) | Segmented buttons lack `data-text`, so the row shifts when the selection changes | Add `data-text` |
| pages/spots/default, dialogs/spot-filters/* vs spot/stale-permit | "Permit info may be out of date" vs "Permit rules may be out of date" | "Permit rules may be out of date" |
| lightbox and map popup vs dialogs and sheets | Close drawn as `.icon-btn` in some places and `.btn--ghost.btn--icon` in others | Both documented, each with its place |
| dialogs/lightbox/default | gallery-8 alt text says "wide frame of the whole space" but the image is a portrait | Fix the alt text in the mock |
| studio, spot and guide editors; studios/default sidebar | 724 fields use a wrapping `label.field`; 63 wrap help and 5 wrap an error, which leak into the accessible name; no ids, so the error summary can't link to them | `div.field` with a sibling `label for` |
| pages/studios/default vs filtered | Sidebar fields wrapped in one state, `for` in the other | `for` in both |
| pages/studio-editor/price-changed | "(required)" marked with `.optional` | Marker dropped |
| pages/guide-editor/invalid | Summary "Title: enter a title" vs field "Enter a title" | Summary repeats the field's words |
| pages/studio-editor/* | Fee amounts have no `step`; hourly rate step 0.5 rejects $45.25 | Money fields take step="0.01" |
| all editor selects | Options have no `value`, so they submit display words | Every option gets a key |
| pages/studio-editor/default | Cyc wall is a No/Yes select beside a 20 A checkbox | Checkbox for yes-or-no facts |
| pages/spot-editor/default | Best-uses help sits after the fieldset, unreferenced | Help under the legend, referenced by the fieldset |
| pages/spot-editor/invalid; dialogs/missing-fields/spot | No inline best-uses error; the dialog link doesn't target `#uses` | Group error pattern |
| pages/sign-in/default | 2px seam beside the Show button; the button clips the focused field's ring | Group seam and focus rules added |
| editors | Textarea rows 2 and 3 render at the same 110px min-height | Textarea min-height lowered so `rows` works |
| editor submitting vs sign-in/submitting | Editors stay editable while saving; sign-in goes readonly | Both documented |
| pages/guide-editor/invalid vs dialogs/missing-fields/* | A refused Publish is a form summary on guides but a dialog on studios and spots | Every refused Publish uses the "Can't publish yet" dialog; refused saves use the error summary |
| pages/admin-dashboard, dialogs/site-menu/admin, admin-studios | Counts read "7 published, 2 draft", "7 published · 2 drafts" and "7 published · 2 draft" | "7 published, 2 draft" |
| pages/sign-in/*, home/* | Alert titles mix trailing full stops | No full stop on titles |
| notifications/public-toast/warning at 360px | The toast overlaps the compare bar once the bar wraps to two rows | The toast offset grows on phones |
| pages/map/loading | The map's loading skeleton is styled inline | `.static-map > .skeleton` |

## Open questions

Decisions the mocks and requirements leave open. Each is noted on the page it affects.

| Where | Question | Current behaviour |
|---|---|---|
| pages/studio/* | Summary panel is shown first below LG with `order: -1` but is last in the tab order (WCAG 1.3.2, 2.4.3) | Open: put the `<aside>` first in the markup and place it in column 2 from LG; needs the mocks and CSS changed together |
| pages/spot-editor/* | Offers Discounted and Comped, but the editorial policy defines only the regular-visit sentence for spots | Open question, flagged on the Disclosure page |
| dialogs/studio-filters, spot-filters, site-menu | No `.backdrop`, so from 48rem the side sheet sits over an undimmed page | Open question |
| pages/studios/default | L2-021.4 asks for 3 columns at LG; beside the filter column the grid is 2-up at LG, 3-up from XL | Open question for the requirements |
| all compare-toggle mocks | Label changes "Compare" → "Remove" while aria-pressed also changes (L2-030.1 asks for both) | Open question for the spec owner |
| pages/compare/* | Sizes metric only, without imperial | Content decision: metric with imperial in brackets everywhere |
| L2-064.2 vs all menu mocks | Spec asks for a disclosure; the mocks use a modal sheet | Open question; the system follows the mocks |
| pages/spot/* light table | The "Rating" column header can be read as a review score | Unchanged; "Light" suggested |
| pages/compare/* | "Prices verified" sits in the Cost group, unlike the row order L2-031 lists (mocks README open question 12) | The system follows the mock |
| pages/spot/* | No mock shows a standing permit disclaimer while the rules are fresh; only the mocks README says permit data is illustrative | Verified date, official source link and "Confirm with … before you shoot" act as the disclaimer |
| notifications/admin-toast/*, public-toast/danger | Danger toasts are `role="alert"` nested inside the `role="status"` region; a separate assertive container would avoid double announcements | Kept as mocked; test with screen readers before splitting the region |

## Changelog

**13 October 2026: extracted for ShotThere (v2.0).**

- 23 new component pages for the ShotThere components: location card, compare toggle and bar, comparison table, review layout, editor layout, price block, score and pips, shot grid, lightbox, episode poster, map, guide entry, stat tile, image manager, list rows, disclosure, status label, tag, filters, combobox, breadcrumb, popover and email signup.
- The 32 basic component pages, 12 foundations and 8 patterns rewritten from the ShotThere mocks: examples, variants, states, content rules, do and don't pairs and sources. Variants that only the earlier product used were removed.
- `assets/components.css`: 502 selectors for components the ShotThere mocks do not use were removed (listing cards with round photos, inbox and message threads, dish rows, ratings, menus, tabs, pagination, side navigation, tooltips, avatars, photo tiles, checklists and their layouts). New rules replace inline styles the mocks repeat, and fix the defects found while documenting (see the drift log).
- Tokens: `--color-star`, `--color-star-empty`, `--photo-card-size` and `--duration-hover-delay` were retired with their contrast pairs. No other token name changed; comments now describe ShotThere. 13 contrast pairs were added.
- Not carried over: menu, tabs, pagination, side navigation, tooltip, switch and avatar. No ShotThere mock uses them; add a page (and restore the CSS from git history) when a mock does.
- `assets/img/`: the earlier product's photos were replaced by the ShotThere stand-ins.

## Verification

Run on Tuesday 13 October 2026 against this folder:

| Check | Command | Result |
|---|---|---|
| Contrast, both themes | `python .claude/skills/extracting-design-systems/scripts/check_contrast.py docs/design-system/tokens/tokens.css` | 236 checks passed (118 pairs × 2 themes), 0 failed, 0 unresolved |
| Structure, sections, labels, links, raw colours | `python .claude/skills/extracting-design-systems/scripts/check_design_system.py docs/design-system` | 76 pages (12 foundations, 55 components, 8 patterns, index), 0 errors, 0 warnings |

