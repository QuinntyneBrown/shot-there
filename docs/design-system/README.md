# ShotThere design system

Inherited from the Sweet Hand design system on Monday 13 October 2026 (Sweet Hand extracted it from 436 HTML mocks on 10 October 2026). This copy keeps the tokens, the 12 foundations, the 8 patterns and the 32 basic components; the domain components were dropped and will be re-derived from the ShotThere mocks. Open [index.html](index.html) in a browser; press <kbd>t</kbd> on any page to switch between light and dark.

The look comes from the reference design: a white canvas, a bold wordmark, a quiet text-only nav, a vertical text filter list with the selected item in pepper red, and round food photos with a name and a short line underneath. Three rules hold everywhere:

- **One ink-black primary button per screen** (`--color-action`).
- **Pepper red means "selected / you are here"** (`--color-accent`), never an action and never an error (errors are sorrel, deeper and cooler).
- **Flat surfaces**: white space separates things; borders and shadows only lift overlays.

## How to use it

1. Link `tokens/tokens.css`, then `assets/components.css`. (`assets/ds.css` and `assets/ds.js` are only for these documentation pages.)
2. Use the class names and attributes from each component page's **Code** section. State lives in real attributes (`disabled`, `aria-pressed`, `aria-current`, `aria-invalid`, `aria-expanded`, `aria-busy`); `data-state` exists only to show states in static pages. The mocks, the product and the e2e page objects share these class names (see `AGENTS.md`).
3. Read tokens by role (`var(--color-fg-muted)`), never by value. Other platforms consume `tokens/tokens.json`.
4. Theme with `data-theme="light|dark"` on `<html>`; without it the OS preference applies. A `[data-theme]` region can sit inside a page of the other theme.
5. Re-run both checkers below after any change.

## Foundations

| Page | Covers |
|---|---|
| [Color](foundations/color.html) | Stone, pepper, callaloo, mango and sorrel ramps; semantic roles; ink = action, pepper = selected, info is stone, sorrel vs pepper; statuses, stars, scrim; both themes; every contrast pair with live ratios; adding a brand theme. |
| [Typography](foundations/typography.html) | Figtree and fallbacks, mono; the 9-step scale and the 62rem display bump; weights, line heights, letter spacing; all 16 `--text-*` roles; measure and wrapping; tabular numbers; 12px minimum. |
| [Spacing](foundations/spacing.html) | The 4px scale, inside vs between, padding by component size, control heights (sm from 48rem), touch targets. |
| [Layout](foundations/layout.html) | L2 viewport classes XS–XL plus 2XL; columns, gutters, margins, top bar and section gap per breakpoint; live grid; container and measure; sidebar, panel, dialog and sheet widths; six page templates with mock views. |
| [Elevation](foundations/elevation.html) | Flat by default; four shadows plus focus; surface hierarchy; dark-theme elevation; z-order with a live layered example. |
| [Shape](foundations/shape.html) | Radius scale and which radius for which element, phone sheets, the round photo, border widths and rings. |
| [Motion](foundations/motion.html) | Durations and easings with replayable demos, loops and the tooltip delay, choreography (dialog scale-in, phone sheet slide-up, side sheet slide-in, toast, menu, viewer, photo zoom), reduced motion. |
| [Iconography](foundations/iconography.html) | 24-unit outline grid, 2px round stroke, `currentColor`, six sizes, colour and labelling rules, the sheet of 38 icons used in the mocks. |
| [Theming](foundations/theming.html) | `data-theme`, `prefers-color-scheme`, `color-scheme`, no-flash setup, the three token tiers, dark is not inverted, contrast preferences, adding a theme, consuming `tokens.json`. |
| [Responsive](foundations/responsive.html) | Mobile first at 360px with 320px reflow, L2 viewport classes, visibility utilities, per-component breakpoint table, phone views of mocks, touch, safe areas, testing matrix. |
| [Accessibility](foundations/accessibility.html) | WCAG 2.2 AA commitments by principle, per-screen checklist, focus ring, focus destinations, 44px targets (L2-065), automated and manual testing, the component contract. |
| [Content](foundations/content.html) | Canadian English, voice by moment, sentence case, verbs, numbers, dates, times, CAD, postal codes, island traditions and dish names, privacy, allergens, certificates, error and empty formulas, microcopy library. |

## Components

32 basic components. Every page has the same thirteen sections: overview, anatomy, variants, sizes, states, responsive, theming, accessibility, content, do and don't, tokens, code, sources.

### Actions

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Button](components/button.html) | primary (ink), secondary, ghost, link, danger; with icon, icon-only, block, wrap; sm, md, lg | default, hover, focus, active, disabled, loading | caterer, enquiry, suspend-caterer, profile-menu, not-found |
| [Icon button](components/icon-button.html) | ghost, outline, with count badge, as link | default, hover, focus, active, disabled, pressed, expanded, current | inbox, dashboard, search, suspend-caterer, photo-viewer, profile-photos, profile-menu |
| [Button group](components/button-group.html) | segmented text filter, button group md/sm, loading | default, hover, focus, active, disabled, selected | inbox, thread, dashboard-enquiries, admin-caterers, admin-queue, admin-reviews, admin-metrics |
| [Link](components/link.html) | inline, standalone, external, back link, in alerts, summaries and footers | default, hover, focus, visited (unstyled) | terms, privacy, caterer, profile-details, dashboard, sign-in, thread, profile-banner, caterers |

### Inputs

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Form field](components/form-field.html) | help, optional, counter, error, warning, over limit, read-only value | default, focus, invalid, warning, disabled, read-only | enquiry, profile-details, sign-in, thread, dish, admin-audit |
| [Text field](components/text-field.html) | text, email, password with Show, tel, date, numeric, search, input group, read-only; sm, md, lg | default, hover, focus, invalid, disabled, read-only | sign-in, register, register-caterer, two-factor, enquiry, profile-events, admin-caterers, admin-audit, profile-details |
| [Textarea](components/textarea.html) | form textarea with counter, reply box | default, hover, focus, invalid, over limit, disabled, read-only | thread, profile-details, enquiry, decline-enquiry, suspend-caterer, report, review-response |
| [Select](components/select.html) | placeholder option and optgroups, filter select | default, hover, focus, invalid, disabled, busy, warning | enquiry, profile-cuisines, admin-audit, admin-metrics |
| [Checkbox](components/checkbox.html) | single with consent summary, with description or count, fieldset and option grid, nested region with indeterminate parent | unchecked, checked, indeterminate, hover, focus, disabled, invalid, group error | profile-cuisines, profile-events, dish, filters, register, photo-details, moderate-review, sign-in |
| [Radio group](components/radio-group.html) | vertical, horizontal, card, primary pick | unselected, selected, hover, focus, disabled, invalid, unanswered | report, add-operator, resolve-report, record-breach, profile-cuisines |
| [File upload](components/file-upload.html) | label-as-button trigger, file row, upload tile | default, hover, focus, disabled/full, dragging, failed, uploading, processing, invalid, empty | profile-photos, profile-certificate, photo-details, dashboard-toast |
| [Form layout](components/form-layout.html) | fieldset, field row, actions, sticky actions, autosave status, toolbar, dialog form | default, submitting, invalid, saved, failed, read-only | register, sign-in, profile-details, profile-events, profile-certificate, enquiry, admin-metrics, admin-audit |

### Navigation

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Skip link](components/skip-link.html) | main content | hidden, focus, print | every page |
| [Site header](components/site-header.html) | visitor, customer, caterer, operator; legacy `.topbar` | default, hover, focus, current, expanded, with badge | caterers, inbox, dashboard, admin-queue, site-menu, account-menu |
| [Footer](components/footer.html) | public, caterer, operator, legacy `.footer` | default, hover, focus, current | caterers, dashboard, admin-queue, about, privacy, caterer, server-error |

### Containers and overlays

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Container and grid](components/container.html) | container, narrow, stack, cluster, grid, auto grid, page intro, prose, browse/caterer/work/inbox/auth layouts | default, loading, empty, variant | caterers, caterer, dashboard, inbox, thread, sign-in, admin-cuisines, about |
| [Card](components/card.html) | card, flush, interactive, selected, well, closed note, contact card, private note, enquiry panel, certificate | default, hover, focus, selected, loading | caterer, admin-caterer, review-response, admin-report, sign-in/challenge, thread, profile-certificate |
| [Dialog](components/dialog.html) | default, destructive, form, success; sm, default, form, lg; full screen | default, invalid, busy, failed, success | enquiry, suspend-caterer, approve-profile, remove-photo, remove-dish, retire-cuisine, download-data, add-cuisine, review-response, delete-review |
| [Sheet and drawer](components/sheet.html) | filters sheet, site menu sheet, drawer, drawer left | open, selected/current, focus on Close, busy | filters, site-menu, caterers |
| [Divider](components/divider.html) | horizontal, vertical, labelled, menu divider | on page, raised, sunken | account-menu, caterer, admin-cuisines, inbox |

### Data display

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Table](components/table.html) | default, numeric, dense, sortable, row actions | row hover/focus/selected, sort asc/desc, loading, empty, no results, error | admin-audit, admin-metrics, privacy |
| [Description list](components/description-list.html) | dl, facts and inline list, regions, kv, enquiry summary, certificate, change review | default, long, missing, loading, certificate valid/expiring/expired, changed | caterer, account, admin-caterer, thread, dashboard-enquiry, admin-profile-review, admin-changes, approve-profile, profile-certificate |
| [Badge](components/badge.html) | neutral, info, success, warning, danger, solid, count | default, 99+, zero, in a hovered or current link | admin-queue, dashboard, inbox, admin-operators, add-cuisine, retire-cuisine, caterer |
| [Chip](components/chip.html) | active filter (removable), toggle, static | default, hover, focus, active, selected, selected hover, disabled | caterers, filters, admin-caterers |

### Feedback

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Inline message](components/inline-message.html) | help, error, warning, counter; inline status; save status | help, warning, invalid, over limit, read-only; saving, saved, error | profile-details, profile-cuisines, profile-photos, enquiry, search, caterers, review, thread, dashboard-enquiry |
| [Alert and banner](components/alert.html) | info, success, warning, danger; inline and `.banner`; dismissible, persistent | default, with action, dismissible, close hover/focus, action focus, dismissed, busy action | site-banner, profile-banner, profile-certificate, sign-in, dashboard, profile-details, admin-metrics, caterers |
| [Toast](components/toast.html) | info, success, warning, danger; with action; stacked; region default, `--top`, `--static` | default, action hover/focus, close hover/focus, entering, paused, persistent, leaving, replaced | toast, dashboard-toast, admin-toast |
| [Progress and meter](components/progress.html) | determinate, indeterminate, success, danger, setup meter | empty, in progress, complete, indeterminate, succeeded, failed, paused offline | dashboard, submit-profile, withdraw-submission, profile-photos |
| [Spinner](components/spinner.html) | standalone, inline with text, in a button; sm, md, lg | per surface, delayed, done, taking long | photo-viewer, enquiry, profile-certificate, verify-email |
| [Skeleton](components/skeleton.html) | text, title, circle, rect; caterer card, inbox row, admin row, queue, table | loading (`aria-busy`), reduced motion, loaded, failed, paging | caterers, inbox, admin-queue, admin-caterers, admin-cuisines, admin-operators, admin-audit, verify-email, profile-photos |
| [Empty state](components/empty-state.html) | first run, no results, error, offline, forbidden, in a dialog; full and compact | action default/hover/focus/busy, retrying, recovering | profile-menu, profile-photos, dashboard, inbox, caterers, dashboard-reviews, dashboard-enquiries, admin-audit, admin-queue, admin-metrics, report |
| [Error page](components/error-page.html) | 404, 403, 500 with reference, 429, offline, maintenance | action default/hover/focus/disabled/busy, copied | not-found, forbidden, server-error, rate-limited, offline, maintenance, site-banner |

## Patterns

| Pattern | Covers |
|---|---|
| [Forms](patterns/forms.html) | One-column layout, field pairs from 36rem, labels above, "(optional)" without asterisks, validation timing, error summary with focus, busy/failed/conflict/success, autosave (open question 16), destructive-confirmation tiers; the enquiry form in its invalid state. |
| [Feedback and loading](patterns/feedback-and-loading.html) | Which feedback for which action, skeleton vs spinner vs progress vs meter, the 300ms threshold, optimistic vs confirmed actions, Undo, partial failure, offline. |
| [Empty and error states](patterns/empty-and-error-states.html) | First run, no results with Clear filters, empty segment, failed load with reference, partial failure, offline, forbidden, not found, removed caterer, 500/429/503; title, line and action formulas. |
| [Navigation and page structure](patterns/navigation.html) | Site header per role, phone site menu, side nav vs section list, segments vs tabs vs sub-pages, page intro and back link, layouts by breakpoint, back behaviour and URL state. |
| [Dialogs and overlays](patterns/dialogs-and-overlays.html) | Dialog vs full screen vs bottom sheet vs side sheet vs dropdown vs popover vs viewer vs page; success in a dialog vs a toast; no stacking; focus start and return; inert page. |
| [Data tables and lists](patterns/tables-and-lists.html) | Rows over tables and when a real table is right; density; filtering with segments, toolbar and search; fixed sort orders; numbered pages, no infinite scroll; loading/empty/error rows; phone strategy. |
| [Notifications](patterns/notifications.html) | Toast vs banner vs inline vs email and badges; priority; persistence (danger never auto-dismisses, 8s pausing); stacking (max 3); live regions; banner and toast families. |
| [Content and tone](patterns/content-and-tone.html) | Tone by moment, high-stakes message anatomy, copy through the enquiry, review, moderation and suspension flows, consistent nouns and verbs, flow strings for the library. |

## Tokens

- `tokens/tokens.css` is the single source of truth. It has three tiers:
  - primitives: `--palette-*` (stone, pepper, callaloo, mango, sorrel), `--font-*`;
  - semantic tokens: colour, text roles, space, layout, radius, shadow, motion, z-order, interaction, icon size;
  - component tokens, declared in `assets/components.css`.

  Light is `:root` (restated under `[data-theme="light"]`). Dark is `[data-theme="dark"]` plus an identical block under `prefers-color-scheme: dark`. Reduced motion, `prefers-contrast: more` and forced colours are handled in the tokens.
- `tokens/tokens.json` is the W3C DTCG export: aliases are preserved and theme overrides sit under `$extensions`. Regenerate it with `tokens_to_json.py` after editing `tokens.css`.
- `tokens/contrast-pairs.json` holds the 111 foreground/background pairings the components rely on, checked in both themes.
- Breakpoints are the L2 viewport classes: sm 36rem, md 48rem, lg 62rem, xl 75rem; 2xl 90rem is the container max. Below 48rem every control is at least 44 × 44px (L2-065.1).

## Pending for ShotThere

- **Dropped component pages (35):** accordion, avatar, bar chart, breadcrumb, calendar, caterer card, checklist, combobox, dish, filter list, filter trigger, gallery and viewer, inbox row, list rows, map, menu, message thread, pagination, photo, photo tile, popover, queue item, rating, review, side navigation, stat, status label, sticky call to action, switch, tabs, tag, timeline, tooltip. ShotThere's own versions (listing cards, gallery and lightbox, map, filters, compare bar, score display, admin lists) come from the ShotThere mocks.
- **CSS for dropped components:** `assets/components.css` dropped the accordion, switch, stat, bar chart, timeline, directory map and calendar sections. The other dropped components' CSS stays for now because the foundations, patterns and kept component pages still render them in examples (caterer cards, inbox rows, round photos, status labels, filter lists). Cut each one when its example is rewritten.
- **Example copy:** the kept pages still use Sweet Hand's caterer examples, and the [Content](foundations/content.html) foundation is written for Caribbean food. Rewrite both for studios and outdoor spots once the ShotThere mocks and L2 copy exist.
- **Mock previews:** embedded mock previews were replaced with a note, mock links were unlinked, and the example images were copied to `assets/img/`.

## Verification

Run on Monday 13 October 2026 against this folder:

| Check | Command | Result |
|---|---|---|
| Contrast, both themes | `python .claude/skills/extracting-design-systems/scripts/check_contrast.py docs/design-system/tokens/tokens.css` | 222 pairs passed, 0 failed, 0 unresolved (light and dark) |
| Structure, sections, labels, links, raw colours | `python .claude/skills/extracting-design-systems/scripts/check_design_system.py docs/design-system` | 53 pages (12 foundations, 32 components, 8 patterns, index), 0 errors, 0 warnings |
