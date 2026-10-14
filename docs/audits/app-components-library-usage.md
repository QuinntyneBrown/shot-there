# Audit: application vs. components library

Scope: `frontend/projects/shot-there/src` (styles, `index.html`, `app/**`).
Reference: `@shot-there/components` (`frontend/projects/components`) and
`docs/icd/components-library-application.md` (ICD-002).
Method: static read of every template, component stylesheet, global
stylesheet and `*.component.ts` in the application, compared with the
library's public API. Nothing was run.

## Summary

| Measure | Result |
|---|---|
| Library symbols the app imports from `@shot-there/components` | 1 (`FallbackImageDirective`), in 5 files |
| Library components the app renders | **0** |
| Library services the app uses (`DialogService`, `ToastService`) | **0** |
| Design-system components re-implemented by hand in the app | 17 app-defined (section A) and 20 template patterns (section B) |
| Global stylesheets that define DS component blocks | 3 files (`buttons.css`, `forms.css`, `content.css`) |
| App component selectors that collide with a library selector | 3 (`st-skip-link`, `st-site-footer`, `st-compare-bar`) |

The application uses the library only for tokens and foundations (via
`shot-there.css`) and for `img[stFallbackImage]`. Every other piece of
design-system UI is written again as raw markup, hand-copied CSS, or
app-defined components. `src/styles.css` already admits this in a
`TODO(re-platform)` comment: the three global files "break ICD-STY-4".

Rules broken (referenced in each finding):

- **ICD-STY-4**: the app does not style or redefine DS component blocks.
- **ICD-DOM-5 / §3**: the app must not "re-implement a component the library
  provides" or "write design-system markup by hand for something the library
  renders".
- **ICD-OVL-1..5**: overlays go through `DialogService`; toasts through
  `ToastService` and a single `st-toast-region`.
- **ICD-MEDIA-1**: every content photo goes through `st-responsive-image`.
- **ICD-API-4**: selectors use the `st` prefix, components are `st-` plus the
  DS slug (a name owned by the library).
- **AGENTS.md**: import libraries only through `@shot-there/*`; no
  hand-rolled modals; i18n on all text.

Severity: **High** = whole library component or service bypassed, or a
behavioural rule (focus, ARIA, overlay) re-implemented; **Medium** = markup
and CSS duplicated for a library component with a thin app wrapper;
**Low** = partial use or cosmetic duplication.

---

## A. Components defined in the app that the library already provides

These are app-owned components (or `core/` pieces) whose job is one the
library covers.

| ID | Sev | App file(s) | Defined in app | Library replacement | Notes |
|---|---|---|---|---|---|
| F-01 | High | `core/shell/skip-link.component.{ts,html,css}` | `st-skip-link` | `SkipLinkComponent` (`st-skip-link`) | Same selector as the library component. Hand-written `.skip-link` CSS and a manual `document.getElementById('main').focus()` handler. |
| F-02 | High | `core/layout/site-footer.component.{ts,html,css}` | `st-site-footer` | `SiteFooterComponent` (`st-site-footer`) | Same selector. Own `.site-footer` CSS. External link hint is inline `visually-hidden` text instead of the library's `st.link.external` string. |
| F-03 | High | `core/shell/header.component.{ts,html,css}` | `st-header`, `.site-header`, `.wordmark`, `.site-nav*` | `SiteHeaderComponent` (`st-site-header`) | App raw `<header>`, nav and the menu button; the app opens the menu sheet itself through CDK `Dialog` (F-37). |
| F-04 | High | `core/compare/compare-bar.component.{ts,html,css}` | `st-compare-bar`, `.compare-bar*`, `.toast*` | `CompareBarComponent` (`st-compare-bar`) | Same selector. Also contains its own hand-written toast (see F-18). |
| F-05 | High | `core/shell/site-menu-dialog.component.{ts,html,css}` | `.sheet`, `.sheet__*`, `.icon-btn`, `.section-list`, `.section-link*` | `SheetComponent`, `IconButtonComponent`, `SectionLinksComponent` | Hand-built sheet chrome and close button. |
| F-06 | High | `features/studios/gallery-lightbox-dialog/*` | `st-gallery-lightbox-dialog`, `.viewer*`, `.lightbox__*` | `LightboxComponent` (opened with `kind: 'viewer'`) | App rebuilds the viewer: count, close, previous and next buttons, caption, and the second set of previous/next buttons. |
| F-07 | High | `features/studios/studio-filters-dialog/*` | `.sheet`, `.sheet__*`, `.icon-btn` | `SheetComponent` | Hand-built sheet chrome and footer. Only the form content is app-specific. |
| F-08 | High | `features/errors/not-found-page.component.*` | `.system-page*` | `ErrorPageComponent` (`st-error-page`) | 404 page is raw markup and CSS. |
| F-09 | Medium | `core/shell/shell.component.*` | `<main>` plus unused hooks | `st-toast-region` is never rendered | ICD-OVL-5 requires one `st-toast-region` in the shell. The shell has none; see F-18. |
| F-10 | Medium | `features/compare/compare-toggle.component.*` | `.btn.btn--sm.compare-toggle` | `ButtonComponent` (`button[st-button]`, `size`, `pressed`) | ICD maps `button[st-button] pressed` to L2-030. App sets `aria-pressed` by hand and defines `.btn--sm` in its own CSS. |
| F-11 | Medium | `features/video/episode-player.component.*` | `st-episode-player`, `.video-poster*`, `.video-frame` | `VideoPosterComponent` (`st-video-poster`) | ICD-MEDIA-4: the app builds the embed URL and hands a `SafeResourceUrl` to the library component. The app's own player, poster, play pill, and `Play episode` string duplicate it. Link-out row is app content. |
| F-12 | Medium | `features/studios/studio-card/*` | `.location-card*` | `LocationCardComponent` (`st-location-card`) | Raw `<article>`, media, name, meta, `<dl>` facts and a `.badge`. |
| F-13 | Medium | `features/studios/studio-sort-control/*` | `.field.field--inline`, `.select` | `SelectComponent` (`st-select`) | Native `<select>` with hand-written label, plus a second copy in the filters dialog. |
| F-14 | Medium | `features/studios/studio-filters/*` | `.field`, `.input`, `.input-group`, `.addon`, `.choice`, `<fieldset>/<legend>` | `TextFieldComponent`, `SelectComponent`, `CheckboxComponent`, `CheckboxGroupComponent`, `RadioGroupComponent` | The whole filter form is native controls and DS classes. `$` add-on, error message and `aria-describedby` wiring done by hand. |
| F-15 | Medium | `core/email-signup/*` | `.field`, `.field__label`, `.input`, `.field__error`, `.btn`, `.alert*` | `TextFieldComponent`, `ButtonComponent` (`busy`), `AlertComponent`, `FormActionsComponent` | Raw field, busy button (`aria-busy` and a CSS spinner defined in the component CSS), and two hand-built alerts. |
| F-16 | Medium | `features/studios/studio-disclosure/*` | `.disclosure`, `role="note"` | `DisclosureComponent` (`st-disclosure`) | Raw markup and CSS. |
| F-17 | Medium | `features/studios/studio-pricing/*` | `.price-block*`, `.alert`, `.badge`, `<dl class="kv">` | `PriceBlockComponent` (`st-price-block`), `AlertComponent`, `BadgeComponent`, `DescriptionListComponent` | The ICD even documents the slot for the stale alert (`st-price-block` default slot). |

## B. Design-system blocks written by hand in templates

| ID | Sev | Pattern | Where (template:line) | Library replacement |
|---|---|---|---|---|
| F-18 | High | Toast | `core/compare/compare-bar.component.html:1-11` (`.toast-region`, `.toast`, own 4 s `setTimeout` in `compare-bar.component.ts`) | `ToastService` + `ToastRegionComponent` (ICD-OVL-5) |
| F-19 | High | Inline SVG icons | many inline `<svg class="icon">` across the templates, e.g. `header.component.html:8`, `compare-bar.component.html:3`, `compare-page.component.html:3,11`, `studio-list-page.component.html:19,52,66,74,83`, `gallery-lightbox-dialog.component.html:7,12,26,31`, `email-signup.component.html:4,21,31` | `IconComponent` (`st-icon`, typed `IconName`) |
| F-20 | High | Empty states | `compare-page.component.html:2-8`, `home-page.component.html:30-40`, `studio-list-page.component.html:66-71,75-80` (`.empty*`) | `EmptyStateComponent` (`st-empty-state`) |
| F-21 | High | Error state with retry | `studio-list-page.component.html:55-65` (`.empty--error`, `role="alert"`) | `EmptyStateComponent` or `AlertComponent` with action |
| F-22 | High | Loading placeholders | `studio-list-page.component.html:43-50` (`.location-card--skeleton`, `.skeleton*`) and its CSS | `LocationCardSkeletonComponent`, `SkeletonComponent` |
| F-23 | Medium | Buttons | 17 templates: `<button class="btn …">`, `<a class="btn …">`, `.icon-btn` (e.g. `studio-basics:9`, `compare-page:11-17`, `not-found-page:5-7`, `studio-list-page:11,19,57`) | `ButtonComponent`, `IconButtonComponent`, `LinkComponent` |
| F-24 | Medium | Filter trigger button | `studio-list-page.component.html:43-50` (`.filter-trigger`, `.filter-trigger__count`, styles in `studio-list-page.component.css:192-206`) | `FilterTriggerComponent` (`st-filter-trigger`) |
| F-25 | Medium | Result count with live region | `studio-list-page.component.html:35-43` (`.result-count`, `role="status"`) | `ResultCountComponent` (`st-result-count`, live) |
| F-26 | Medium | Alerts / notices | `compare-page.component.html:21-25` (notices), `email-signup.component.html` (rate-limited, failed), `studio-pricing.component.html` (stale) | `AlertComponent`, `InlineMessageComponent` |
| F-27 | Medium | Badges | `compare-page.component.html:48-51`, `studio-card.component.html:13`, `studio-pricing.component.html:28-31` | `BadgeComponent`, `StatusComponent` |
| F-28 | Medium | Comparison table | `compare-page.component.html:26-80` (`.table`, `.table-wrap`, `.compare-table`) plus 30+ lines of table CSS | `TableComponent` (`table[st-table]`, `dense`) |
| F-29 | Medium | Page header | `compare-page.component.html`, `editorial-policy-page.component.html` (`.page-header`, `.subtitle`) and their CSS | `PageHeaderComponent` (`st-page-header`) |
| F-30 | Medium | Key/value lists | `studio-gear:4,13`, `studio-logistics:4`, `studio-pricing:15`, `studio-specifications:4` (`<dl class="kv">`) | `DescriptionListComponent` (`st-description-list`) |
| F-31 | Medium | Scores | `studio-verdict.component.html:4-19` (`.score-overall`, `.score-list`, `.score`, `.pips`); `studio-specifications.component.html:16` (`.light-rating`, `.pips`) | `ScoreOverallComponent`, `ScoreListComponent`, `LightRatingComponent` |
| F-32 | Medium | Test-shot and gallery grids | `studio-test-shots.component.html:3-18`, `studio-gallery.component.html:6-14` (`.shot-grid`, `.shot`) and CSS | `ShotGridComponent` (`st-shot-grid`) |
| F-33 | Medium | Location grid | `home-page.component.html:7-25` (`<ul class="location-grid">` + hand-built `.location-card` list items, a second copy of F-12), `studio-list-page.component.html:79` | `LocationGridComponent`, `LocationCardComponent` |
| F-34 | Medium | Content photos | `<img>` in `studio-card`, `home-page`, `compare-page`, `studio-gallery`, `studio-test-shots`, `gallery-lightbox-dialog`, `episode-player` | `ResponsiveImageComponent` (ICD-MEDIA-1). These are content photos, so plain `<img stFallbackImage>` does not satisfy ICD-MEDIA-1. |
| F-35 | Low | Booking link | `studio-basics.component.html:9-11`: `.btn.btn--primary` with trailing SVG and hidden text | `ButtonComponent` with `st-icon` and the `st.link.external` string |

## C. Overlays, toasts and services

| ID | Sev | Finding | Where |
|---|---|---|---|
| F-37 | High | App opens overlays with CDK `Dialog` directly instead of the library's `DialogService`, so ICD-OVL-1 (one overlay service, focus return, kinds, sizes) is bypassed. | `header.component.ts:15,21`; `studio-gallery.component.ts:17,24`; `studio-list-page.component.ts:33,98` |
| F-38 | High | Dialog contents inject CDK `DialogRef` and `DIALOG_DATA`, not the library's dialog contract, and their templates have no `st-dialog` / `st-sheet` root as ICD-OVL-3 requires. | `site-menu-dialog.component.ts:15`; `gallery-lightbox-dialog.component.ts:1,16`; `studio-filters-dialog.component.ts:1,24` |
| F-39 | High | `ToastService` / `st-toast-region` unused; the app has a private toast with its own timer. | `compare-bar.component.{html,ts}` (`TOAST_MS`), `core/compare/compare-selection.service.ts` (`refused` signal) |
| F-40 | Low | `AnnouncerService` is allowed (ICD-A11Y-3), but compare toggle announces the limit message as well as showing the toast, so the same text is produced by two mechanisms. | `compare-toggle.component.ts:27` |
| F-41 | Low | `@angular/cdk` is imported straight from the app for `Dialog`, `DialogRef`, `DIALOG_DATA`, `Clipboard`, `LiveAnnouncer`. Dialog types should come through the library; `Clipboard` and `LiveAnnouncer` are acceptable. | see F-37, F-38 |

## D. Stylesheets that define library components

| ID | Sev | File | Defines | Library owner |
|---|---|---|---|---|
| F-42 | High | `src/styles/buttons.css` | `.btn`, `--primary`, `--ghost`, `--link`, `--block`, `.btn .icon` | `ButtonComponent` |
| F-43 | High | `src/styles/forms.css` | `.field`, `.field__label`, `.input`, `.select`, `.textarea`, `.choice`, radio and checkbox faces | `TextField`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` |
| F-44 | High | `src/styles/content.css` | `.kv`, `.badge*`, `.alert*`, `.review-section` | `DescriptionList`, `Badge`, `Alert`; `.review-section` is feature CSS and should live with the studio page |
| F-45 | High | `src/styles.css` | imports the three files above (marked `TODO(re-platform)`, "break ICD-STY-4") | remove after migration |
| F-46 | Medium | `core/compare/compare-bar.component.css` | `.compare-bar*`, `.toast-region`, `.toast` | `CompareBar`, `Toast*` |
| F-47 | Medium | `core/email-signup/email-signup.component.css` | `.alert--danger`, `.alert .icon`, `.btn[aria-busy]`, `.btn[aria-busy]::after` | `Alert`, `Button` busy state |
| F-48 | Medium | `core/layout/site-footer.component.css`, `core/shell/header.component.css`, `core/shell/skip-link.component.css` | `.site-footer`, `.site-header`, `.wordmark`, `.skip-link` | `SiteFooter`, `SiteHeader`, `SkipLink` |
| F-49 | Medium | `core/shell/site-menu-dialog.component.css`, `features/studios/studio-filters-dialog/*.css`, `gallery-lightbox-dialog.component.css` | `.sheet`, `.icon-btn`, `.section-list`, `.section-link`, `.viewer` | `Sheet`, `IconButton`, `SectionLinks`, `Lightbox` |
| F-50 | Medium | `features/studios/studio-card/*.css`, `features/home/home-page/*.css`, `studio-list-page.component.css` | `.location-card*`, `.location-grid`, `.badge`, `.empty*`, `.skeleton*`, `.filter-trigger*`, `.result-count`; `.location-card` is defined **three times** (card, home page, list page) and `.location-grid` twice | `LocationCard`, `LocationGrid`, `Badge`, `EmptyState`, `Skeleton`, `FilterTrigger`, `ResultCount` |
| F-51 | Medium | `features/compare/compare-page/*.css` | `.page-header`, `.alert .icon`, `.btn .icon`, `.badge--success`, `.badge--wrap`, `.table*`, `.empty` | `PageHeader`, `Alert`, `Button`, `Badge`, `Table`, `EmptyState` |
| F-52 | Medium | `studio-gallery.component.css`, `studio-test-shots.component.css` | `.shot-grid`, `.shot` (defined twice) | `ShotGrid` |
| F-53 | Medium | `studio-verdict.component.css`, `studio-specifications.component.css` | `.score-overall*`, `.score-list`, `.score*`, `.pips`, `.light-rating` (`.pips` defined twice) | `ScoreOverall`, `ScoreList`, `LightRating` |
| F-54 | Medium | `studio-pricing`, `studio-disclosure`, `episode-player`, `not-found-page` CSS | `.price-block*`, `.disclosure*`, `.video-poster*`, `.system-page*` | `PriceBlock`, `Disclosure`, `VideoPoster`, `ErrorPage` |
| F-55 | Low | `studio-filters.component.css`, `studio-basics.component.css`, `compare-toggle.component.css` | `.field-row--pair`, `.field--spaced`, `.input-group`, `.addon`, `.btn` and `.btn--sm` overrides | restyling library internals (ICD-DOM-5): the app may position a host, not restyle it |

## E. Naming and structure

| ID | Sev | Finding | Where |
|---|---|---|---|
| F-56 | High | Three app components reuse a library selector exactly: `st-skip-link`, `st-site-footer`, `st-compare-bar`. If both are ever imported in one component the app's silently wins or the compiler errors, and ICD-API-4 gives the `st-<DS slug>` space to the library. | `skip-link.component.ts:5`, `site-footer.component.ts:8`, `compare-bar.component.ts:12` |
| F-57 | Low | The app uses the `st` prefix for every app component (`st-studio-card`, `st-header`, `st-shell`, …). ICD-API-4 defines `st-` plus the DS slug as the library's naming, so app names can collide with library names (F-56). Not a rule break on its own; consider a distinct prefix. | all `selector:` values under `src/app` |
| F-58 | Low | `st-header` is both the app's name for the site header and a near-miss of `st-site-header`. | `header.component.ts:9` |
| F-59 | Low | `app.css` is empty and `app.ts` renders `st-shell`, which renders `st-header`, `st-skip-link`, `st-site-footer`, `st-compare-bar`. All four are candidates for deletion once the library is used. | `app/app.css`, `shell.component.html` |

## F. i18n and accessibility side effects of hand-written markup

| ID | Sev | Finding | Where |
|---|---|---|---|
| F-60 | Medium | Strings the library already owns are retyped in app templates (`Close`, `Menu`, `Skip to content`, `Play episode`, `Dismiss`, `(opens in a new tab)`, `Previous photo`, `Next photo`). They bypass the `@@st.*` IDs and the overrides in §13. | `site-menu-dialog.component.html:5`, `header.component.html:9`, `skip-link.component.html`, `episode-player.component.html:8`, `site-footer.component.html:11`, `gallery-lightbox-dialog.component.html` |
| F-61 | Medium | Behaviour the library already guarantees is re-implemented and can drift: focus to `#main` on skip, focus return after dialogs, `aria-busy` on submit, `aria-pressed` toggle, live region on result count, `role="status"` wrappers around alerts, and the focus-visible ring for `.location-card`. | `skip-link.component.ts`, `email-signup.component.html`, `compare-toggle.component.html`, `studio-list-page.component.html`, `studio-card.component.css:49` |
| F-62 | Low | Icon-only buttons get their name from hand-written `aria-label` (`Close`, `Previous photo`, `Next photo`); `st-icon-button` takes the label as an input. | `gallery-lightbox-dialog.component.html`, `site-menu-dialog.component.html` |

## G. What the app does correctly

- `img[stFallbackImage]` is imported from `@shot-there/components` through the alias, never by relative path.
- API access goes through `@shot-there/api` abstract classes and is registered in `app.config.ts` as `{ provide: Foo, useClass: HttpFoo }` (ICD-API rules).
- Routes, page titles and paths come from `core/routing/*`.
- Business rules (query parsing, view models, URL state) are plain TypeScript beside the pages.
- Templates and styles are in separate files, one type per file, and the template text carries `i18n`.
- `AnnouncerService` is app-owned as ICD-A11Y-3 intends.
- Fonts are self-hosted (`fonts.css`, ICD-STY-8).

## Suggested order for the migration

1. Shell: `st-skip-link`, `st-site-header`, `st-site-footer`, `st-toast-region`
   and `st-compare-bar` (F-01 to F-04, F-09, F-18, F-39, F-56).
2. Overlays: switch to `DialogService`, `st-sheet`, `st-lightbox` (F-05 to F-07,
   F-37, F-38).
3. Icons, buttons, alerts, empty and loading states, which touch every page
   (F-19 to F-27, F-42, F-44, F-47).
4. Forms and filters (F-13 to F-15, F-43).
5. Cards, grids, scores, tables, media (F-12, F-28 to F-34, F-50 to F-54).
6. Delete `buttons.css`, `forms.css`, `content.css` and the `styles.css`
   imports (F-42 to F-45); rename app selectors off the library's `st-`
   prefix (F-56, F-57).

Each step changes production behaviour, so it needs its requirement, detailed
design and mock first, and runs through `implementing-incrementally` with
Playwright acceptance tests (AGENTS.md).
