# Screen composition: pages, dialogs, notifications and shell

Source: `docs/mocks/` (every state of each screen) and the component catalogue in
`docs/icd/components-library-application.md` §9. Components are named by class
and selector from `@shot-there/components`.

**Local UI** means UI the mocks show that no library component covers. It is
built in the app under `features/<area>/` or `core/`, using library components
and tokens inside it. If a local item turns out to be reusable, raise it through
ICD change control (§15) rather than copying it between pages.

Mock-only chrome (`mock-bar`, `mock-note`) is not product UI and is excluded.

## 1. Shell

The shell wraps every public and admin page. Mocks: any page, plus
`dialogs/site-menu`, `notifications/*`.

| Part | Library components | Local UI |
|---|---|---|
| Skip link | `SkipLinkComponent` (`st-skip-link`) | none |
| Public header | `SiteHeaderComponent` (`st-site-header`), `LinkComponent`, `IconButtonComponent` (menu button), `IconComponent` | wordmark and tagline content, nav link list and which link is current |
| Admin header | `SiteHeaderComponent`, `LinkComponent`, `IconButtonComponent` | admin nav links and the sign-out link (`site-nav__extra`) |
| Sign-in header | `SiteHeaderComponent` | wordmark only, no nav |
| Footer | `SiteFooterComponent` (`st-site-footer`), `LinkComponent` | footer links and copy; email signup block (see §2, Email signup) |
| Toast region | `ToastRegionComponent` (`st-toast-region`) once in the shell, opened through `ToastService` | none |
| Compare bar | `CompareBarComponent` (`st-compare-bar`), `ButtonComponent` | compare selection state (which studios, limit of 4); it is rendered on studio list pages only |
| Overlay host | `DialogService` | none |

Public pages have the footer; admin pages and sign-in do not.

## 2. Local components shared by several screens

Build these once in `core/` or the owning feature and reuse.

| Local UI | Used by | Notes |
|---|---|---|
| Email signup (`signup`, `signup__row`, `signup__trap`) | footer on all public pages, home | Uses `TextFieldComponent`, `ButtonComponent`, and `AlertComponent` for rate-limited and failed states. The honeypot trap field and success status region are local. States: default, invalid, submitting, success, error, rate-limited (see `pages/home`). |
| Compare toggle (`compare-toggle`) | studios list cards, studio page, filters dialog preview | A pressed/unpressed toggle built on `ButtonComponent`; wires to the compare selection state. |
| Review layout (`review-layout`, `review-main`, `review-section`, `regions`, `review-head`, `review-head__meta`) | studio, spot, guide | Page-level layout only; sections are filled with library components. |
| Episode links (`episode__links`) | studio, spot | Row of `LinkComponent`s to the video. |
| Browse layout (`browse`, `browse__aside`, `browse__results`, `filter-group`) | studios, spots | Aside filter panel on desktop (`until-lg` hides it on small screens in favour of the filters sheet); the filter groups are the same form content as the sheet. |
| Static map surface (`static-map`, `map-marker`, tiles) | map, spot, spot editor, map popup | Wraps the map engine. Legend, popup and failure state are library components. |
| Admin list row (`admin-row`, `admin-list`) | admin dashboard | Row layout of title, meta, badge and actions. |
| Prose (`prose`, `container--narrow`) | editorial policy, guide | Typography wrapper for authored long-form content. |

## 3. Public pages

### Home — `/` (`pages/home`: default, empty, error, invalid, submitting, success, rate-limited)
- **Library:** `PageHeaderComponent` or hero heading content, `LocationGridComponent` + `LocationCardComponent`, `TagListComponent`, `ButtonComponent`, `LinkComponent`, `AlertComponent` (error and signup request failures), `EmptyStateComponent` (empty), `TextFieldComponent` (signup email error).
- **Local:** home hero (`home-hero`) copy and layout; guide index teasers (`guide-index`); email signup block with its states.

### Studios — `/studios` (`pages/studios`: default, loading, empty, error, no-results, filtered, selected-one, selected)
- **Library:** `PageHeaderComponent`, `FilterTriggerComponent`, `ResultCountComponent`, `ActiveFiltersComponent`, `LocationGridComponent`, `LocationCardComponent`, `LocationCardSkeletonComponent` (loading), `EmptyStateComponent` (empty, no-results), `AlertComponent` (error), `TagListComponent`, `BadgeComponent`, `SelectComponent` (sort), `CompareBarComponent` (selected states), `SheetComponent` via the filters dialog.
- **Local:** browse layout with the aside filter form; compare toggle on each card (`location-card__actions`).

### Outdoor spots — `/spots` (`pages/spots`: default, loading, empty, error, no-results, filtered)
- **Library:** same set as Studios without the compare bar and compare toggle: `PageHeaderComponent`, `FilterTriggerComponent`, `ResultCountComponent`, `ActiveFiltersComponent`, `LocationGridComponent`, `LocationCardComponent`, `LocationCardSkeletonComponent`, `EmptyStateComponent`, `AlertComponent`, `TagListComponent`, `BadgeComponent`.
- **Local:** browse layout with the aside filter form.

### Map — `/map` (`pages/map`: default, list, studios-only, loading, empty, error, tiles-failed)
- **Library:** `SegmentedControlComponent` (map/list and studio/spot toggles), `MapLegendComponent`, `MapPopupComponent` (via the popup, §5), `MapUnavailableComponent` (tiles-failed), `LocationGridComponent` + `LocationCardComponent` (list view), `SpinnerComponent` or `SkeletonComponent` (loading), `EmptyStateComponent`, `AlertComponent`.
- **Local:** full-height map page layout (`map-page`, `map-page__bar`, `map-page__map`, `map-page__list`); static map surface and markers (`map-marker--studio`, `map-marker--spot`); list item rows (`map-list-item`).

### Studio review — `/studios/:slug` (`pages/studio`: default, stale, minimal, playing, media-failed, in-compare)
- **Library:** `BreadcrumbComponent`, `SectionLinksComponent`, `ScoreListComponent`, `ScoreOverallComponent`, `LightRatingComponent`, `PriceBlockComponent`, `SummaryPanelComponent`, `DescriptionListComponent`, `TableComponent` (included gear, extras), `DisclosureComponent`, `ShotGridComponent` and `LightboxComponent`, `VideoPosterComponent`, `ResponsiveImageComponent`, `TagListComponent`, `BadgeComponent` / `StatusComponent` (stale, due soon), `AlertComponent` (stale notice), `ButtonComponent`, `LinkComponent`, `MapUnavailableComponent` where a map shows.
- **Local:** review layout (`review-layout`, `regions`); review head; light grid by time of day (`light-grid`, `light-grid__item`) composed with `LightRatingComponent`; shot-grid setup captions (`shot-grid__setup`); episode links; compare toggle; verification text.

### Outdoor spot — `/spots/:slug` (`pages/spot`: default, stale-permit, no-rain-backup, no-video, map-failed)
- **Library:** `BreadcrumbComponent`, `LightRatingComponent`, `SummaryPanelComponent`, `DescriptionListComponent`, `TableComponent`, `DisclosureComponent`, `ShotGridComponent` + `LightboxComponent`, `VideoPosterComponent`, `TagListComponent`, `BadgeComponent`, `AlertComponent` (stale permit), `EmptyStateComponent` (no rain backup), `MapUnavailableComponent` (map-failed), `LinkComponent`.
- **Local:** review layout and head; static map with the spot marker (`static-map--spot`); best-times list (`list`, `list__item`); episode links.

### Compare — `/compare?studios=a,b` (`pages/compare`: default, four, empty, unknown-slug, over-limit)
- **Library:** `PageHeaderComponent`, `TableComponent` (`table[st-table]`), `BadgeComponent`, `ButtonComponent`, `LinkComponent`, `AlertComponent` (unknown-slug, over-limit), `EmptyStateComponent` (empty), `ScoreOverallComponent`.
- **Local:** compare table row groups and labels (`compare-table__group`, `__label`, `__value`) and sticky first column; the logic that builds rows from the selected studios; query-string state.

### Guides — `/guides` (`pages/guides`: default, empty)
- **Library:** `PageHeaderComponent`, `LocationCardComponent` for entries, `LocationGridComponent`, `EmptyStateComponent`.
- **Local:** guide index layout (`guide-index`).

### Guide — `/guides/:slug` (`pages/guide`: default)
- **Library:** `BreadcrumbComponent`, `LocationCardComponent`, `LinkComponent`.
- **Local:** guide entry rows with rank number, data line and note (`guide-entry`, `guide-entry__rank`, `__body`, `__data`, `__note`); prose intro; review head.

### Editorial policy — `/editorial-policy` (`pages/editorial-policy`: default)
- **Library:** `PageHeaderComponent`, `LinkComponent`.
- **Local:** narrow prose layout with the authored policy text.

### Page not found — any unknown URL (`pages/not-found`: default)
- **Library:** `ErrorPageComponent` (`st-error-page`), `ButtonComponent`.
- **Local:** none.

### Something went wrong — HTTP 500 (`pages/server-error`: default)
- **Library:** `ErrorPageComponent`, `ButtonComponent`.
- **Local:** none.

## 4. Admin pages

### Owner sign-in — `/admin/sign-in` (`pages/sign-in`: default, invalid, incorrect, submitting, rate-limited, error, session-expired, signed-out)
- **Library:** `TextFieldComponent` (email, password), `ButtonComponent` (block, large, busy while submitting), `AlertComponent` (incorrect, error, rate-limited, session-expired, signed-out), `ErrorSummaryComponent` (invalid), `SiteHeaderComponent`.
- **Local:** centred auth card layout (`auth`, `auth__head`); sign-in form state and validation messages.

### Dashboard — `/admin` (`pages/admin-dashboard`: default, loading, empty, error, up-to-date, partial)
- **Library:** `PageHeaderComponent`, `StatGridComponent` + `StatTileComponent`, `StatTileSkeletonComponent` (loading), `BadgeComponent`, `ButtonComponent`, `LinkComponent`, `AlertComponent` (partial, error), `EmptyStateComponent` (empty, up-to-date).
- **Local:** admin list rows for items needing re-verification (`admin-row`, `admin-row__title`, `__meta`, `__actions`).

### Studios (admin) — `/admin/studios` (`pages/admin-studios`: default, loading, empty, error, no-results)
### Spots (admin) — `/admin/spots` (`pages/admin-spots`: same states)
### Guides (admin) — `/admin/guides` (`pages/admin-guides`: same states)
- **Library:** `PageHeaderComponent`, `SearchFieldComponent`, `ResultCountComponent`, `TableComponent` (responsive stacked rows), `StatusComponent` (draft, published), `BadgeComponent` (stale, due soon), `ButtonComponent`, `LinkComponent`, `SkeletonComponent` (loading), `EmptyStateComponent` (empty, no-results), `AlertComponent` (error).
- **Local:** per-page column definitions and row actions; list search/filter state.

### Studio editor — `/admin/studios/new`, `/admin/studios/:id` (`pages/studio-editor`: new, default, published, loading, error, invalid, submitting, success, uploading, upload-failed, price-changed)
- **Library:** `BreadcrumbComponent`, `PageHeaderComponent`, `StatusComponent`, `EditorSectionComponent`, `TextFieldComponent`, `TextareaComponent`, `SelectComponent`, `CheckboxComponent` / `CheckboxGroupComponent`, `RadioGroupComponent`, `FileUploadComponent`, `ProgressComponent` (uploading), `ImageListComponent` + `ImageRowComponent`, `ResponsiveImageComponent`, `FormActionsComponent` (sticky), `SaveStatusComponent`, `ErrorSummaryComponent` (invalid), `AlertComponent` (success, price-changed, upload-failed), `InlineMessageComponent`, `SummaryPanelComponent` (aside), `SpinnerComponent` / `SkeletonComponent` (loading), `ButtonComponent`.
- **Local:** editor layout with aside (`editor-layout`, `editor-aside`); fee rows with add/remove and mandatory flag (`fee-row`); price input with currency add-on (`addon`, `input-group`); price-changed warning logic and re-verify date; per-section field definitions and validation rules; publish eligibility check that feeds the "Can't publish yet" dialog.

### Spot editor — `/admin/spots/new`, `/admin/spots/:id` (`pages/spot-editor`: new, default, published, loading, error, invalid, submitting, success)
- **Library:** same form set as the studio editor, plus `MapUnavailableComponent` if the preview fails.
- **Local:** editor layout with aside; preview map with a draggable or coordinate-driven marker (`preview-map`, `static-map`); best-times and permit field definitions; validation rules.

### Guide editor — `/admin/guides/new`, `/admin/guides/:id` (`pages/guide-editor`: new, default, published, loading, error, invalid, submitting, success)
- **Library:** `BreadcrumbComponent`, `PageHeaderComponent`, `StatusComponent`, `EditorSectionComponent`, `TextFieldComponent`, `TextareaComponent`, `ImageListComponent` + `ImageRowComponent` (entries), `EmptyStateComponent` (new, no entries), `FormActionsComponent`, `SaveStatusComponent`, `ErrorSummaryComponent`, `AlertComponent`, `ButtonComponent`.
- **Local:** entry list reordering, rank numbers (`image-row--entry`, `guide-entry__rank`); editor layout with aside; entry add action that opens the guide-entry picker dialog.

## 5. Dialogs

Opened with `DialogService`. Overlay surfaces use `DialogComponent`, `SheetComponent` or `LightboxComponent`; the app supplies only the content.

| Dialog (mock folder: states) | Surface | Library components | Local UI |
|---|---|---|---|
| Studio filters (`studio-filters`: default, selected, invalid) | `SheetComponent` | `CheckboxGroupComponent`, `CheckboxComponent`, `RadioGroupComponent`, `SelectComponent`, `TextFieldComponent` (price range with add-on), `ErrorSummaryComponent` or `InlineMessageComponent` (invalid range), `ButtonComponent` (apply, clear) | Filter form model, range validation, URL-state mapping; the same fields as the aside filter panel |
| Spot filters (`spot-filters`: default, selected) | `SheetComponent` | `CheckboxGroupComponent`, `CheckboxComponent`, `ButtonComponent` | Filter form model and URL-state mapping |
| Map marker popup (`map-popup`: default, spot) | popover docked to the map | `MapPopupComponent`, `LinkComponent` / `ButtonComponent` | Marker-to-popup wiring; positioning against the map |
| Photo lightbox (`lightbox`: default, sample-shot, last, image-failed) | `LightboxComponent` (`kind: 'viewer'`) | `LightboxComponent`, `IconButtonComponent` (close, previous, next), `ResponsiveImageComponent`, `MediaFallback` behaviour via `FallbackImageDirective` (image-failed) | Image list and index state passed in |
| Site menu (`site-menu`: default, admin) | `SheetComponent` | `SectionLinksComponent`, `IconButtonComponent` (close), `LocationCardComponent` + `LocationGridComponent` (featured, public menu), `StatGridComponent` + `StatTileComponent` (admin menu) | Menu link sets for public and admin; which items show for an owner |
| Can't publish yet (`missing-fields`: default, spot) | `DialogComponent` | `ButtonComponent`, `IconButtonComponent` (close) | List of missing fields built from the editor's validation, with links back to each field |
| Unpublish (`unpublish`: default, busy, failed) | `DialogComponent` | `ButtonComponent` (busy), `AlertComponent` (failed) | Unpublish request and its result handling |
| Delete (`delete-content`: default, busy, failed) | `DialogComponent` | `ButtonComponent` (danger, busy), `AlertComponent` (failed) | Delete request and its result handling |
| Discard changes (`discard-changes`: default) | `DialogComponent` | `ButtonComponent` (danger) | Dirty-form guard that opens it |
| Remove image (`remove-image`: default, refused) | `DialogComponent` | `ButtonComponent` (danger), `ImageRowComponent` (preview of the image), `AlertComponent` (refused) | Rule deciding when removal is refused (for example the last image of a published item) |
| Guide entry picker (`guide-entry-picker`: default, results, no-matches, invalid, busy) | `DialogComponent` (form variant) | `SearchFieldComponent`, `TextareaComponent` (note), `EmptyStateComponent` (no-matches), `SpinnerComponent` (busy), `InlineMessageComponent` (invalid), `ButtonComponent` | Suggestion list with hint text (`suggestions`, `suggestion`, `suggestion__hint`) and its keyboard selection; search request; chosen-entry state |

## 6. Notifications

Shown through `ToastService` into the single `ToastRegionComponent` in the shell.

| Notification (mock folder: states) | Library components | Local UI |
|---|---|---|
| Admin toast (`admin-toast`: success, info, warning, danger, stacked) | `ToastRegionComponent`, `ToastService`, `ButtonComponent` (action) | Message copy per admin action; the code that raises each toast |
| Public toast (`public-toast`: success, warning, danger) | `ToastRegionComponent`, `ToastService` | Copy and trigger for the compare-limit warning and public errors |

## 7. Summary of local UI to build

1. Email signup block (footer and home).
2. Compare toggle and compare selection state.
3. Review layout, review head, light grid, shot setup captions and episode links.
4. Browse layout and the aside filter form, shared with the filters sheets.
5. Static map surface, markers, map page layout and list rows; preview map in the spot editor.
6. Guide entry rows, guide index layout and prose layout.
7. Compare table row groups and the logic that builds them.
8. Editor layout with aside, fee rows, price add-on inputs, price-changed logic and publish eligibility.
9. Guide entry reordering and the guide-entry picker suggestion list.
10. Admin list row (dashboard) and per-list column definitions.
11. Auth card layout on sign-in.
12. Menu link sets, toast copy, and request handling for unpublish, delete and remove image.
