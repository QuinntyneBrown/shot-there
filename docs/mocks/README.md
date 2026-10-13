# ShotThere mocks

Static HTML mocks of the ShotThere **Phase 1 MVP**, scoped to the **minimal scope** of each estimate in [`docs/estimates/`](../estimates/). There is one file per page, dialog and notification state. Every mock traces to the L2 requirements in [`docs/specs/L2.md`](../specs/L2.md). The mocks use the design system: each one links [`docs/design-system/tokens/tokens.css`](../design-system/tokens/tokens.css) and [`docs/design-system/assets/components.css`](../design-system/assets/components.css). None of them has a local copy.

**26 screens · 108 files**: 18 pages (82 files), 7 dialogs (21 files) and 1 notification (5 files).

## How to open

- Open [`index.html`](index.html) from disk. It is a gallery of every screen with links to each state. No server or network is needed.
- Every mock has a mock bar at the bottom. It links the sibling states and toggles the theme (press <kbd>t</kbd> for the same toggle).
- `?theme=dark` or `?theme=light` forces a theme. `?chrome=0` hides the mock bar and the yellow notes, which leaves exactly the product UI.
- Images are flat SVG illustrations in [`assets/img/`](assets/img/) that stand in for real photography.

## Cast and catalog

Today is **Tuesday 13 October 2026**. "Stale" means a date more than 183 days old.

| Who / what | Detail |
|---|---|
| Owner | Jordan Okafor, `jordan@shotthere.ca`. The single admin account, and the reviewer. |
| Visitor in forms | Amara Chen, `amara.chen@fastmail.com` |
| Channel | ShotThere on YouTube, `youtube.com/@shotthere` |

**Published studios** (default order is the most recent review first):

| Studio | Neighbourhood | Rate × min | Mandatory fees | All-in, 2 h | Scores V/L/S/G/Lo/C | Overall | Reviewed | Prices verified | Disclosure | Video |
|---|---|---|---|---|---|---|---|---|---|---|
| Parkdale Daylight Loft | Parkdale | $65.00 × 2 h | Cleaning $25.00 (strobe kit $40.00 optional) | $155.00 | 4/5/3/4/2/5 | 3.8 | Sep 28 | Sep 28 | Paid in full | Yes |
| Junction Cyc Studio | The Junction | $95.00 × 2 h | — | $190.00 | 3/3/5/5/5/4 | 4.2 | Aug 14 | **Mar 2 (225 days, stale)** | Comped by the studio | No |
| Leslieville Window Room | Leslieville | $45.50 × 2 h | — | $91.00 | 5/4/2/2/3/4 | 3.3 | Jul 30 | Jul 30 | Paid in full | No |
| Liberty Village Studio B | Liberty Village | $60.00 × 3 h | — | $180.00 | 4/3/4/4/4/4 | 3.8 | Jun 18 | Jun 18 | Discounted by Liberty Village Studios | Yes |
| Queen West Black Box | Queen West | $60.00 × 1 h | — | $120.00 | 3/2/4/4/3/3 | 3.2 | May 9 | **Apr 1 (195 days, stale)** | Paid in full | Yes |

**Draft studios:** Riverside Rooftop Studio (updated Oct 9) and Dupont Corner Studio (updated Oct 12).

**Published spots:** Humber Bay Arch Bridge (waterfront; permits verified Sep 2), Union Station West Wing (indoor public), Evergreen Brick Works (park) and Distillery District (architecture; **permit rules verified Mar 20, 207 days ago, stale**).
**Draft spot:** Bluffer's Park Beach.

**Guides:** "Best studios for headshots" (Parkdale, Queen West, Liberty), "Best natural light studios" and "Best studios under $120 for 2 hours" are published. "Best studios for a large crew" (Junction, Liberty) is a draft.

**Standard test setups**, the same in every studio: 1, window light only at 85 mm; 2, one strobe in the largest included modifier at 85 mm; 3, full length with two strobes at 35 mm.

## What the MVP scope removed

These are the deferrals the estimates' minimal scopes call for. The mocks follow them, and a yellow note on each affected mock says so.

| Area | Not in these mocks | Estimate |
|---|---|---|
| Studio list | XS full-height filter dialog (the filters are one collapsible panel at every width), active-filter count badge, live sort announcement, skeleton cards (plain loading text instead) | filter-and-sort-studios, list-studios |
| Spot list | Permit filter | list-and-filter-spots |
| Map | Map/List toggle at XS and SM (the map sits above the list at every width) | view-locations-map |
| Compare | "Copy link"; the Compare toggle on the studio page (card only) | view-comparison, select-studios-to-compare |
| Studio page | "Prices verified" date and stale warning in the pricing block; gear grouped by category; Previous in the lightbox | show-studio-basics-and-pricing, show-studio-specifications, show-studio-test-shots-and-gallery |
| Spot page | Interactive map (a static image plus an external map link instead), practical conditions (L2-017), table layout for best light, best-use links | show-spot-location-and-directions, show-spot-conditions-and-permits, show-spot-best-light, show-spot-best-uses-disclosure-and-episode |
| Guides | Spot entries and per-guide data points (all-in cost only); empty-state message on the index | view-guide, browse-guides |
| Email signup | Home-page placement; the dedicated 429 message (one generic failure message instead) | subscribe-by-email |
| Errors | Branded 500 page (a static page without app chrome instead); map-unavailable and poster fallbacks | handle-errors-and-health |
| Sign-in and session | Per-account rate limit; session-expired message; return to the requested admin URL | sign-in-as-owner, maintain-owner-session |
| Studio editor | Specifications, gear and logistics sections; price-date confirmation prompt | edit-studio |
| Spot editor | Best light, practical conditions, preview map | edit-outdoor-spot |
| Guide editor | Unpublish; server-side search (the picker filters a list loaded once) | edit-guide |
| Admin lists | Spot and guide lists (studios only) | list-admin-content |
| Dashboard | "Due soon" group | view-admin-dashboard |
| Images | Per-file progress, multi-file queue with retry, reorder announcement | upload-and-arrange-images |
| Publish | Links in the missing-fields dialog that focus each field | publish-and-unpublish-location |
| Delete | Guide deletion | delete-content |
| Unsaved changes | Protection in the spot and guide editors | protect-unsaved-changes |

## Open questions

1. **Studios and spots cannot be published in the MVP as scoped.** L2-002 requires specifications (space, ceiling, window direction, natural light, power, cyc wall) for studios and best light for spots, but the minimal editors defer those sections. `dialogs/missing-fields` shows the result: the refusal lists fields the owner has no input for. Either bring those sections back into the MVP or relax L2-002 for Phase 1.
2. **Existing spots and guides have no way in.** With the admin spot and guide lists deferred, the owner reaches a spot only from the dashboard's re-verification list, and an existing guide not at all. The mocks point the spot and guide editors' back links at the dashboard.
3. **There is no home page.** No estimate builds one, but L2-039 and L2-083.1 mention it. The mocks assume `/` shows the studio list (the wordmark links there), and the 404 page links to studios and spots.
4. **Studio page versus list on freshness.** In the MVP the studio list, comparison and guides flag stale prices, but the studio page itself shows no verified date (basics-and-pricing minimal scope). This weakens L1-010 on the page visitors book from.
5. **Spot list stale flag.** L2-043 asks list cards to flag stale data. The spot list estimate is silent on permits, so spot cards carry no stale flag in these mocks.
6. **Images before the first save.** The mocks assume images can be added only after a studio or spot has been created (the upload needs an ID). Confirm this in the detailed design.
7. **Guide picker scope.** L2-060.4 says studios *and spots*. The MVP guide page renders studio entries only, so the picker lists studios only.
8. **Phone filter panel.** The minimal scope keeps "one panel at every width". The mocks render it as a collapsible disclosure on phones that is open beside the results from LG (`details[data-open-from-lg]`, opened by `assets/mock.js` the way the product would).

## Design-system changes made for these mocks

- `--layout-container-max` is now `80rem` (1280px) instead of `90rem`, because L2-064.3 caps content at 1280px. `tokens.css`, `tokens.json` and the design-system README are updated.
- A new **ShotThere domain components** section at the end of `assets/components.css` covers: site menu, list layout, filter panel, location card and compare toggle, compare bar, review layout, all-in price, score and pips, light level, shot grid and thumbnails (including the failed-image slot), lightbox frame, episode poster, verdict and disclosure, map with markers, legend and popup, static map, comparison table, guide list and entries, footer signup, and the admin tiles, editor sections, fee, image and entry rows and entry picker. It also lets dialog titles take their own row on phones. Photos are rectangular, not the inherited round photo, because test shots must show the whole frame.
- The next step, `extracting-design-systems`, should give these components their own pages and retire the inherited Sweet Hand examples.

## Checks

```sh
python .claude/skills/writing-html-mocks/scripts/check_mocks.py docs/mocks --write   # coverage, hygiene, links; regenerates index.html and the matrix below
python .claude/skills/writing-html-mocks/scripts/screenshot_mocks.py docs/mocks     # PNGs at 360/768/1280 in both themes into docs/mocks/.cache (not committed)
```

Last run (13 October 2026): 108 mocks, 0 errors and 0 warnings. Screenshots were taken at 320, 360, 768 and 1280px in light and at 360 and 1280px in dark. `document.documentElement.scrollWidth` never exceeded the viewport.

## Coverage

<!-- coverage:start -->

Legend: ✅ mock exists · ➖ not applicable (reason in manifest) · ❌ missing

### Pages

| Screen | default | loading | empty | error | filtered | no-results | compare-one | compare-two | compare-limit | menu-open | sparse | image-failed | permit-stale | no-backup | studios-only | popup | unknown-studio | over-limit | invalid | invalid-format | submitting | success | rate-limited | up-to-date | search | published | uploading | upload-rejected | Requirements |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Studio list (`studios`) | [✅](pages/studios/default.html) | [✅](pages/studios/loading.html) | [✅](pages/studios/empty.html) | [✅](pages/studios/error.html) | [✅](pages/studios/filtered.html) | [✅](pages/studios/no-results.html) | [✅](pages/studios/compare-one.html) | [✅](pages/studios/compare-two.html) | [✅](pages/studios/compare-limit.html) | [✅](pages/studios/menu-open.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-021`, `L2-022`, `L2-023`, `L2-025`, `L2-026`, `L2-030`, `L2-043`, `L2-064` |
| Studio review (`studio`) | [✅](pages/studio/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  | [✅](pages/studio/sparse.html) | [✅](pages/studio/image-failed.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-003`, `L2-004`, `L2-006`, `L2-007`, `L2-008`, `L2-009`, `L2-010`, `L2-011`, `L2-012`, `L2-013`, `L2-036`, `L2-047`, `L2-048`, `L2-086` |
| Outdoor spot list (`spots`) | [✅](pages/spots/default.html) | [✅](pages/spots/loading.html) | [✅](pages/spots/empty.html) | [✅](pages/spots/error.html) | [✅](pages/spots/filtered.html) | [✅](pages/spots/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-024`, `L2-025`, `L2-026` |
| Outdoor spot (`spot`) | [✅](pages/spot/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  | [✅](pages/spot/permit-stale.html) | [✅](pages/spot/no-backup.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-014`, `L2-015`, `L2-016`, `L2-018`, `L2-019`, `L2-020`, `L2-037`, `L2-038`, `L2-043` |
| Map (`map`) | [✅](pages/map/default.html) | [✅](pages/map/loading.html) | [✅](pages/map/empty.html) | [✅](pages/map/error.html) |  |  |  |  |  |  |  |  |  |  | [✅](pages/map/studios-only.html) | [✅](pages/map/popup.html) |  |  |  |  |  |  |  |  |  |  |  |  | `L2-027`, `L2-028`, `L2-029` |
| Comparison (`compare`) | [✅](pages/compare/default.html) | ➖ | [✅](pages/compare/empty.html) | ➖ |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/compare/unknown-studio.html) | [✅](pages/compare/over-limit.html) |  |  |  |  |  |  |  |  |  |  | `L2-031`, `L2-032`, `L2-033`, `L2-043` |
| Guides index (`guides`) | [✅](pages/guides/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-035` |
| Guide (`guide`) | [✅](pages/guide/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-034` |
| Editorial policy (`editorial-policy`) | [✅](pages/editorial-policy/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-046` |
| Not found (404) (`not-found`) | [✅](pages/not-found/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-083`, `L2-001` |
| Server error (500) (`server-error`) | [✅](pages/server-error/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-083` |
| Email signup (footer) (`email-signup`) | [✅](pages/email-signup/default.html) | ➖ | ➖ | [✅](pages/email-signup/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/email-signup/invalid.html) | [✅](pages/email-signup/invalid-format.html) | [✅](pages/email-signup/submitting.html) | [✅](pages/email-signup/success.html) |  |  |  |  |  |  | `L2-039`, `L2-040`, `L2-041` |
| Owner sign-in (`sign-in`) | [✅](pages/sign-in/default.html) | ➖ | ➖ | [✅](pages/sign-in/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/sign-in/invalid.html) |  | [✅](pages/sign-in/submitting.html) |  | [✅](pages/sign-in/rate-limited.html) |  |  |  |  |  | `L2-049`, `L2-050`, `L2-051` |
| Admin dashboard (`admin-dashboard`) | [✅](pages/admin-dashboard/default.html) | [✅](pages/admin-dashboard/loading.html) | [✅](pages/admin-dashboard/empty.html) | [✅](pages/admin-dashboard/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-dashboard/up-to-date.html) |  |  |  |  | `L2-053`, `L2-044`, `L2-052` |
| Admin studio list (`admin-studios`) | [✅](pages/admin-studios/default.html) | [✅](pages/admin-studios/loading.html) | [✅](pages/admin-studios/empty.html) | [✅](pages/admin-studios/error.html) |  | [✅](pages/admin-studios/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-studios/search.html) |  |  |  | `L2-063` |
| Studio editor (`studio-editor`) | [✅](pages/studio-editor/default.html) | [✅](pages/studio-editor/loading.html) | [✅](pages/studio-editor/empty.html) | [✅](pages/studio-editor/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/studio-editor/invalid.html) |  | [✅](pages/studio-editor/submitting.html) |  |  |  |  | [✅](pages/studio-editor/published.html) | [✅](pages/studio-editor/uploading.html) | [✅](pages/studio-editor/upload-rejected.html) | `L2-054`, `L2-042`, `L2-045`, `L2-056`, `L2-057`, `L2-058`, `L2-059`, `L2-061`, `L2-002` |
| Outdoor spot editor (`spot-editor`) | [✅](pages/spot-editor/default.html) | [✅](pages/spot-editor/loading.html) | [✅](pages/spot-editor/empty.html) | [✅](pages/spot-editor/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/spot-editor/invalid.html) |  | [✅](pages/spot-editor/submitting.html) |  |  |  |  | [✅](pages/spot-editor/published.html) |  |  | `L2-055`, `L2-042`, `L2-045`, `L2-056`, `L2-057`, `L2-059`, `L2-002` |
| Guide editor (`guide-editor`) | [✅](pages/guide-editor/default.html) | [✅](pages/guide-editor/loading.html) | [✅](pages/guide-editor/empty.html) | [✅](pages/guide-editor/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/guide-editor/invalid.html) |  | [✅](pages/guide-editor/submitting.html) |  |  |  |  | [✅](pages/guide-editor/published.html) |  |  | `L2-060` |

### Dialogs

| Screen | default | busy | invalid | sample-shot | failed | no-results | spot | refused | Requirements |
|---|---|---|---|---|---|---|---|---|---|
| Lightbox (`lightbox`) | [✅](dialogs/lightbox/default.html) | [✅](dialogs/lightbox/busy.html) | ➖ | [✅](dialogs/lightbox/sample-shot.html) |  |  |  |  | `L2-010`, `L2-016`, `L2-067` |
| Add a studio to a guide (`guide-entry-picker`) | [✅](dialogs/guide-entry-picker/default.html) | [✅](dialogs/guide-entry-picker/busy.html) | [✅](dialogs/guide-entry-picker/invalid.html) |  | [✅](dialogs/guide-entry-picker/failed.html) | [✅](dialogs/guide-entry-picker/no-results.html) |  |  | `L2-060` |
| Can't publish yet (`missing-fields`) | [✅](dialogs/missing-fields/default.html) | ➖ | ➖ |  |  |  | [✅](dialogs/missing-fields/spot.html) |  | `L2-056`, `L2-002`, `L2-045`, `L2-055` |
| Unpublish (`unpublish`) | [✅](dialogs/unpublish/default.html) | [✅](dialogs/unpublish/busy.html) | ➖ |  | [✅](dialogs/unpublish/failed.html) |  |  |  | `L2-056` |
| Delete studio (`delete-location`) | [✅](dialogs/delete-location/default.html) | [✅](dialogs/delete-location/busy.html) | ➖ |  | [✅](dialogs/delete-location/failed.html) |  |  |  | `L2-061` |
| Remove image (`remove-image`) | [✅](dialogs/remove-image/default.html) | [✅](dialogs/remove-image/busy.html) | ➖ |  | [✅](dialogs/remove-image/failed.html) |  |  | [✅](dialogs/remove-image/refused.html) | `L2-058` |
| Unsaved changes (`unsaved-changes`) | [✅](dialogs/unsaved-changes/default.html) | ➖ | ➖ |  |  |  |  |  | `L2-062` |

### Notifications

| Screen | info | success | warning | danger | published | deleted | Requirements |
|---|---|---|---|---|---|---|---|
| Admin toast (`admin-toast`) | [✅](notifications/admin-toast/info.html) | [✅](notifications/admin-toast/success.html) | ➖ | [✅](notifications/admin-toast/danger.html) | [✅](notifications/admin-toast/published.html) | [✅](notifications/admin-toast/deleted.html) | `L2-054`, `L2-056`, `L2-061` |

<!-- coverage:end -->
