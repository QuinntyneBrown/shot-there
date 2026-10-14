# Component requirements documents

One CRD per ShotThere component: `<component>.md` holds the requirements and
Given/When/Then acceptance criteria traced to [L2](../L2.md);
`<component>.html` renders the component in every variant, size and state in
light and dark with the design system's real stylesheets. `<component>` is the
design-system page slug; the two library parts with no component page use their
library folder name (`icon`, `responsive-image`).

Each CRD works inside [ICD-002](../../icd/components-library.md), which fixes
every selector, input, output, slot and type that crosses the boundary between
the components library and the application. A CRD adds states, styling,
behaviour and acceptance criteria; it never changes the boundary. Where a CRD
needed something ICD-002 1.0.0 did not allow, the ICD was changed first
(additive, version 1.1.0) and the CRD records it under *Decisions*.

Check them with:

```sh
python .claude/skills/writing-component-requirements-documents/scripts/check_crds.py docs/specs/components
```

## Conventions every CRD follows

- **Selectors** use the `st` prefix (ICD-002 D-2): `st-` plus the design-system
  slug for components, an attribute selector on a native element where the
  native element must be kept (`button[st-button]`, `table[st-table]`), and
  `st` plus camel case for directives (`img[stFallbackImage]`). Application
  components specified here (rows marked *application*) use the same prefix and
  live in `frontend/projects/shot-there/src/app/features/<area>/<component>/`;
  library components live in `frontend/projects/components/src/lib/<folder>/`.
- **Ownership** follows ICD-002 §11.2: a design-system block owned by
  application feature CSS is specified as an application component, and the
  library parts it composes are referenced, not re-specified.
- **Shared field contract.** [`form-field.md`](form-field.md) specifies the
  `.field` structure (label, optional marker, help, error, warning,
  `aria-describedby`, `aria-invalid`, generated IDs) that every form control in
  ICD-002 §9.2 renders; each control's CRD specifies only what is its own.
- **Performance scenario.** There is no separate perf-test project. Each CRD
  names a route in the `components-harness` application (ICD-002 D-12),
  `<component>/performance`, that renders a realistic instance from the
  [mocks cast](../../mocks/README.md); the render or interaction budget it is
  held to traces to L2-071.
- **Motion and forced colours.** L2 has no motion requirement, so
  reduced-motion behaviour is stated as a design-system rule in each CRD's
  *Accessibility › Motion* and has no acceptance criterion.
- **Strings.** Product copy reaches components through inputs and slots; the
  only text a library component renders on its own is listed in ICD-002 §12.

## Index

55 CRDs, 1102 acceptance criteria. *Application* marks a component the
application owns (ICD-002 §11.2); *library and application* marks a CRD that
specifies library components together with the application layout that
composes them; every other row is a library component. All
are `planned`: no frontend code exists yet.

| Component | Selector | Status | ACs | Traces to | Requirements | Rendering | Design system |
|---|---|---|---|---|---|---|---|
| Alert | `st-alert` | planned | 27 | L2-005, L2-018, L2-026, L2-032, L2-041, L2-049, L2-050, L2-051, L2-054, L2-056, L2-058, L2-061, L2-064, L2-065, L2-067, L2-068, L2-069, L2-070, L2-071, L2-074 | [alert.md](alert.md) | [alert.html](alert.html) | [`alert.html`](../../design-system/components/alert.html), [`notifications.html`](../../design-system/patterns/notifications.html) |
| Badge | `st-badge` | planned | 17 | L2-004, L2-018, L2-021, L2-031, L2-043, L2-044, L2-063, L2-064, L2-066, L2-068, L2-069, L2-071 | [badge.md](badge.md) | [badge.html](badge.html) | [`badge.html`](../../design-system/components/badge.html) |
| Breadcrumb | `st-breadcrumb` | planned | 18 | L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [breadcrumb.md](breadcrumb.md) | [breadcrumb.html](breadcrumb.html) | [`breadcrumb.html`](../../design-system/components/breadcrumb.html) |
| Button | `button[st-button]`, `a[st-button]` | planned | 21 | L2-030, L2-041, L2-049, L2-058, L2-061, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [button.md](button.md) | [button.html](button.html) | [`button.html`](../../design-system/components/button.html) |
| Button group | `st-segmented` | planned | 14 | L2-027, L2-029, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [button-group.md](button-group.md) | [button-group.html](button-group.html) | [`button-group.html`](../../design-system/components/button-group.html) |
| Checkbox | `st-checkbox`, `st-checkbox-group` | planned | 20 | L2-022, L2-024, L2-025, L2-054, L2-055, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 | [checkbox.md](checkbox.md) | [checkbox.html](checkbox.html) | [`checkbox.html`](../../design-system/components/checkbox.html), [`filter.html`](../../design-system/components/filter.html) |
| Chip | `st-active-filters` | planned | 18 | L2-022, L2-024, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [chip.md](chip.md) | [chip.html](chip.html) | [`chip.html`](../../design-system/components/chip.html) (filter chip), [`filter.html`](../../design-system/components/filter.html) (active filters) |
| Combobox | `st-search-field` | planned | 24 | L2-060, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [combobox.md](combobox.md) | [combobox.html](combobox.html) | [`combobox.html`](../../design-system/components/combobox.html) |
| Compare bar | `st-compare-bar` | planned | 21 | L2-030, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [compare-bar.md](compare-bar.md) | [compare-bar.html](compare-bar.html) | [`compare-bar.html`](../../design-system/components/compare-bar.html) |
| Comparison table *(application)* | `st-compare-table` (application component, composing `table[st-table]`) | planned | 26 | L2-031, L2-032, L2-033, L2-043, L2-064, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072 | [compare-table.md](compare-table.md) | [compare-table.html](compare-table.html) | [`compare-table.html`](../../design-system/components/compare-table.html), [`table.html`](../../design-system/components/table.html) |
| Container | `st-page-header`; global utility classes (`.container`, `.container--narrow`, `.stack`, `.stack--sm`, `.stack--lg`, `.cluster`, `.cluster--between`, `.cluster--end`, `.grid`, `.grid--auto`, `.section-gap`, `.section-head`, `.prose`, `.subtitle`, `.text-muted`, `.text-caption`, `.has-compare-bar`, `.visually-hidden`, `.until-lg`) | planned | 20 | L2-022, L2-030, L2-064, L2-065, L2-066, L2-068, L2-069, L2-070, L2-071 | [container.md](container.md) | [container.html](container.html) | [`container.html`](../../design-system/components/container.html), [`responsive.html`](../../design-system/foundations/responsive.html), [`layout.html`](../../design-system/foundations/layout.html) |
| Description list | `st-description-list` | planned | 19 | L2-004, L2-005, L2-006, L2-007, L2-008, L2-011, L2-017, L2-064, L2-068, L2-069, L2-070, L2-071 | [description-list.md](description-list.md) | [description-list.html](description-list.html) | [`description-list.html`](../../design-system/components/description-list.html) |
| Dialog | `st-dialog` (`DialogComponent`), and the service `DialogService` (no selector) | planned | 24 | L2-056, L2-058, L2-060, L2-061, L2-062, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [dialog.md](dialog.md) | [dialog.html](dialog.html) | [`dialog.html`](../../design-system/components/dialog.html), [`dialogs-and-overlays.html`](../../design-system/patterns/dialogs-and-overlays.html) |
| Disclosure | `st-disclosure` | planned | 15 | L2-012, L2-020, L2-045, L2-046, L2-064, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-074 | [disclosure.md](disclosure.md) | [disclosure.html](disclosure.html) | [`disclosure.html`](../../design-system/components/disclosure.html) |
| Editor layout *(library and application)* | `st-editor-section`; application layout classes `.editor-layout`, `.editor-aside`, `.editor-aside__meta`, `.editor-form`, `.fee-row` | planned | 28 | L2-042, L2-054, L2-056, L2-057, L2-061, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 | [editor-layout.md](editor-layout.md) | [editor-layout.html](editor-layout.html) | [`editor-layout.html`](../../design-system/components/editor-layout.html), [`form-layout.html`](../../design-system/components/form-layout.html), [`forms.html`](../../design-system/patterns/forms.html) |
| Email signup *(application)* | `st-email-signup` (application component `EmailSignupComponent`) | planned | 27 | L2-039, L2-040, L2-041, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [signup.md](signup.md) | [signup.html](signup.html) | [`signup.html`](../../design-system/components/signup.html) |
| Empty state | `st-empty-state` | planned | 20 | L2-024, L2-026, L2-032, L2-038, L2-044, L2-064, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [empty-state.md](empty-state.md) | [empty-state.html](empty-state.html) | [`empty-state.html`](../../design-system/components/empty-state.html) |
| Episode poster | `st-video-poster` | planned | 19 | L2-013, L2-020, L2-047, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-086 | [video-poster.md](video-poster.md) | [video-poster.html](video-poster.html) | [`video-poster.html`](../../design-system/components/video-poster.html) |
| Error page | `st-error-page` | planned | 15 | L2-001, L2-064, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-083 | [error-page.md](error-page.md) | [error-page.html](error-page.html) | [`error-page.html`](../../design-system/components/error-page.html) |
| File upload | `st-file-upload` | planned | 20 | L2-057, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [file-upload.md](file-upload.md) | [file-upload.html](file-upload.html) | [`file-upload.html`](../../design-system/components/file-upload.html) |
| Filter | `button[st-filter-trigger]`, `a[st-filter-trigger]`, `st-result-count`; page composition by the application's studio and spot filter components | planned | 27 | L2-022, L2-023, L2-024, L2-025, L2-026, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [filter.md](filter.md) | [filter.html](filter.html) | [`filter.html`](../../design-system/components/filter.html); patterns [`forms.html`](../../design-system/patterns/forms.html), [`feedback-and-loading.html`](../../design-system/patterns/feedback-and-loading.html), [`empty-and-error-states.html`](../../design-system/patterns/empty-and-error-states.html) |
| Footer | `st-site-footer` | planned | 17 | L2-039, L2-046, L2-048, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [footer.md](footer.md) | [footer.html](footer.html) | [`footer.html`](../../design-system/components/footer.html) |
| Form field | None of its own. Implemented by `st-text-field`, `st-textarea`, `st-select`, `st-checkbox`, `st-checkbox-group`, `st-radio-group`, `st-search-field` | planned | 28 | L2-039, L2-042, L2-049, L2-054, L2-064, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-074 | [form-field.md](form-field.md) | [form-field.html](form-field.html) | [`form-field.html`](../../design-system/components/form-field.html) |
| Form layout | `st-error-summary`, `st-form-actions`, `st-save-status`; global utilities `.field-row`, `.field-row--pair`, `.field-row--fit`, `.field-row--fit-sm` | planned | 25 | L2-049, L2-054, L2-057, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [form-layout.md](form-layout.md) | [form-layout.html](form-layout.html) | [`form-layout.html`](../../design-system/components/form-layout.html), [`patterns/forms.html`](../../design-system/patterns/forms.html) |
| Guide entry *(application)* | `st-guide-entry` (*application*); the guide index lists (`ul.guide-index`) are page markup with no component of their own (D-4) | planned | 21 | L2-034, L2-035, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071, L2-072, L2-074, L2-086 | [guide-entry.md](guide-entry.md) | [guide-entry.html](guide-entry.html) | [`guide-entry.html`](../../design-system/components/guide-entry.html) |
| Icon | `st-icon` | planned | 10 | L2-067, L2-068, L2-069, L2-071, L2-074 | [icon.md](icon.md) | [icon.html](icon.html) | [`foundations/iconography.html`](../../design-system/foundations/iconography.html) |
| Icon button | `button[st-icon-button]`, `a[st-icon-button]` | planned | 15 | L2-010, L2-028, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 | [icon-button.md](icon-button.md) | [icon-button.html](icon-button.html) | [`icon-button.html`](../../design-system/components/icon-button.html) |
| Image manager | `ol[st-image-list]`, `li[st-image-row]` | planned | 28 | L2-057, L2-058, L2-060, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [image-manager.md](image-manager.md) | [image-manager.html](image-manager.html) | [`image-manager.html`](../../design-system/components/image-manager.html) |
| Inline message | `p[st-inline-message]` (ICD-002 1.1.0, additive). Messages inside a field are rendered by the §9.2 controls through [form-field](form-field.md); the save status by `st-save-status` ([form-layout](form-layout.md)) | planned | 13 | L2-039, L2-049, L2-054, L2-055, L2-057, L2-064, L2-067, L2-068, L2-069, L2-071 | [inline-message.md](inline-message.md) | [inline-message.html](inline-message.html) | [`inline-message.html`](../../design-system/components/inline-message.html) |
| Lightbox | None — opened through `DialogService` with `kind: 'viewer'`; component class `LightboxComponent` | planned | 22 | L2-010, L2-016, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072, L2-086 | [lightbox.md](lightbox.md) | [lightbox.html](lightbox.html) | [`lightbox.html`](../../design-system/components/lightbox.html), [`dialogs-and-overlays.html`](../../design-system/patterns/dialogs-and-overlays.html) |
| Link | `a[st-link]` | planned | 14 | L2-018, L2-034, L2-048, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071, L2-086 | [link.md](link.md) | [link.html](link.html) | [`link.html`](../../design-system/components/link.html) |
| List rows *(library and application)* | `st-section-links` (library); application parts: the `.list` rows of `RainBackupComponent` and the `.admin-list` rows of `AdminDashboardPageComponent` | planned | 23 | L2-026, L2-037, L2-044, L2-053, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 | [list.md](list.md) | [list.html](list.html) | [`list.html`](../../design-system/components/list.html) |
| Location card | `st-location-card`, `st-location-card-skeleton`, `ul[st-location-grid]` | planned | 25 | L2-021, L2-024, L2-026, L2-030, L2-034, L2-043, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072, L2-074, L2-086 | [location-card.md](location-card.md) | [location-card.html](location-card.html) | [`location-card.html`](../../design-system/components/location-card.html) |
| Map *(library and application)* | Library: `st-map-legend`, `st-map-unavailable`; global classes `.map-marker`, `.map-marker--studio`, `.map-marker--spot`, `.map-legend__key--studio`, `.map-legend__key--spot`. Application: `st-locations-map`, `st-spot-map`, `li[st-map-location-card]`, the map page layout (`MapPageComponent`) | planned | 34 | L2-014, L2-026, L2-027, L2-028, L2-029, L2-055, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071, L2-086 | [map.md](map.md) | [map.html](map.html) | [`map.html`](../../design-system/components/map.html), [`popover.html`](../../design-system/components/popover.html) |
| Popover | `st-map-popup` (`MapPopupComponent`) | planned | 16 | L2-028, L2-029, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 | [popover.md](popover.md) | [popover.html](popover.html) | [`popover.html`](../../design-system/components/popover.html), [`map.html`](../../design-system/components/map.html), [`dialogs-and-overlays.html`](../../design-system/patterns/dialogs-and-overlays.html) |
| Price block | `st-price-block` | planned | 19 | L2-004, L2-005, L2-042, L2-043, L2-064, L2-066, L2-068, L2-069, L2-070, L2-071, L2-074 | [price-block.md](price-block.md) | [price-block.html](price-block.html) | [`price-block.html`](../../design-system/components/price-block.html) |
| Progress | `st-progress` | planned | 13 | L2-057, L2-064, L2-067, L2-068, L2-069, L2-071 | [progress.md](progress.md) | [progress.html](progress.html) | [`progress.html`](../../design-system/components/progress.html), [`feedback-and-loading.html`](../../design-system/patterns/feedback-and-loading.html) |
| Radio group | `st-radio-group` | planned | 18 | L2-022, L2-024, L2-025, L2-045, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 | [radio-group.md](radio-group.md) | [radio-group.html](radio-group.html) | [`radio-group.html`](../../design-system/components/radio-group.html), [`filter.html`](../../design-system/components/filter.html) |
| Responsive image | `st-responsive-image`, `img[stFallbackImage]` | planned | 23 | L2-064, L2-068, L2-069, L2-071, L2-072, L2-074, L2-086 | [responsive-image.md](responsive-image.md) | [responsive-image.html](responsive-image.html) | [`patterns/empty-and-error-states.html`](../../design-system/patterns/empty-and-error-states.html) (*Map and media failures*), [`components/shot-grid.html`](../../design-system/components/shot-grid.html) (*States › Failed*), [`components/review-layout.html`](../../design-system/components/review-layout.html) (hero) |
| Review layout *(library and application)* | `st-summary-panel`; application layout classes `.review-layout`, `.review-main`, `.review-head`, `.review-head__meta`, `.review-hero`, `.review-section`, `.light-grid`, `.light-grid__item`, `.light-grid__time`, `.regions` | planned | 29 | L2-003, L2-006, L2-009, L2-011, L2-013, L2-019, L2-020, L2-030, L2-036, L2-038, L2-043, L2-064, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072, L2-086 | [review-layout.md](review-layout.md) | [review-layout.html](review-layout.html) | [`review-layout.html`](../../design-system/components/review-layout.html), [`description-list.html`](../../design-system/components/description-list.html) (summary row, regions) |
| Score and pips | `st-score-list`, `st-score-overall`, `st-light-rating` | planned | 19 | L2-006, L2-011, L2-015, L2-064, L2-066, L2-068, L2-069, L2-070, L2-071, L2-074 | [score.md](score.md) | [score.html](score.html) | [`score.html`](../../design-system/components/score.html) |
| Select | `st-select` | planned | 16 | L2-022, L2-023, L2-025, L2-054, L2-055, L2-064, L2-065, L2-067, L2-068, L2-069, L2-071 | [select.md](select.md) | [select.html](select.html) | [`select.html`](../../design-system/components/select.html), [`form-field.html`](../../design-system/components/form-field.html) |
| Sheet | `st-sheet` (`SheetComponent`) | planned | 16 | L2-022, L2-024, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [sheet.md](sheet.md) | [sheet.html](sheet.html) | [`sheet.html`](../../design-system/components/sheet.html), [`dialogs-and-overlays.html`](../../design-system/patterns/dialogs-and-overlays.html) |
| Shot grid | `st-shot-grid` | planned | 20 | L2-009, L2-010, L2-016, L2-064, L2-066, L2-067, L2-068, L2-069, L2-071, L2-072, L2-074, L2-086 | [shot-grid.md](shot-grid.md) | [shot-grid.html](shot-grid.html) | [`shot-grid.html`](../../design-system/components/shot-grid.html) |
| Site header | `st-site-header` | planned | 22 | L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [site-header.md](site-header.md) | [site-header.html](site-header.html) | [`site-header.html`](../../design-system/components/site-header.html) |
| Skeleton | `st-skeleton` | planned | 11 | L2-026, L2-064, L2-067, L2-069, L2-071 | [skeleton.md](skeleton.md) | [skeleton.html](skeleton.html) | [`skeleton.html`](../../design-system/components/skeleton.html) |
| Skip link | `st-skip-link` | planned | 13 | L2-064, L2-065, L2-067, L2-068, L2-069, L2-070, L2-071 | [skip-link.md](skip-link.md) | [skip-link.html](skip-link.html) | [`skip-link.html`](../../design-system/components/skip-link.html) |
| Spinner | `st-spinner` | planned | 9 | L2-060, L2-064, L2-067, L2-068, L2-069, L2-070, L2-071 | [spinner.md](spinner.md) | [spinner.html](spinner.html) | [`spinner.html`](../../design-system/components/spinner.html), [`feedback-and-loading.html`](../../design-system/patterns/feedback-and-loading.html) |
| Stat tile | `ul[st-stat-grid]`, `li[st-stat-tile]`, `li[st-stat-tile-skeleton]` | planned | 19 | L2-053, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [stat-tile.md](stat-tile.md) | [stat-tile.html](stat-tile.html) | [`stat-tile.html`](../../design-system/components/stat-tile.html) |
| Status label | `st-status` | planned | 14 | L2-056, L2-063, L2-064, L2-066, L2-068, L2-069, L2-071 | [status-label.md](status-label.md) | [status-label.html](status-label.html) | [`status-label.html`](../../design-system/components/status-label.html) |
| Table | `table[st-table]` | planned | 23 | L2-015, L2-018, L2-026, L2-031, L2-063, L2-064, L2-066, L2-067, L2-068, L2-069, L2-071 | [table.md](table.md) | [table.html](table.html) | [`table.html`](../../design-system/components/table.html), [`patterns/tables-and-lists.html`](../../design-system/patterns/tables-and-lists.html) |
| Tag | `st-tag-list` | planned | 14 | L2-019, L2-036, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-071 | [tag.md](tag.md) | [tag.html](tag.html) | [`tag.html`](../../design-system/components/tag.html) |
| Text field | `st-text-field` | planned | 25 | L2-039, L2-042, L2-045, L2-049, L2-054, L2-055, L2-063, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [text-field.md](text-field.md) | [text-field.html](text-field.html) | [`text-field.html`](../../design-system/components/text-field.html), [`form-field.html`](../../design-system/components/form-field.html) |
| Textarea | `st-textarea` | planned | 21 | L2-054, L2-055, L2-060, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 | [textarea.md](textarea.md) | [textarea.html](textarea.html) | [`textarea.html`](../../design-system/components/textarea.html) |
| Toast | `st-toast-region`, service `ToastService` (with `ToastOptions`, `ToastRef`) | planned | 27 | L2-030, L2-032, L2-054, L2-056, L2-061, L2-064, L2-065, L2-067, L2-068, L2-069, L2-070, L2-071, L2-074 | [toast.md](toast.md) | [toast.html](toast.html) | [`toast.html`](../../design-system/components/toast.html), [`notifications.html`](../../design-system/patterns/notifications.html), [`feedback-and-loading.html`](../../design-system/patterns/feedback-and-loading.html) |
