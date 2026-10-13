# ShotThere mocks

Static HTML mocks for every page, dialog and notification of the Phase 1 MVP
in every state, written from `docs/specs/L2.md` and `docs/detailed-designs/`.
They consume the design system directly: every mock links
`docs/design-system/tokens/tokens.css` and `docs/design-system/assets/components.css`.
Components the inherited system did not have (location card, rubric pips,
compare bar and table, lightbox, maps, episode poster, editor sections, image
manager …) were added to `components.css` under **SHOTTHERE COMPONENTS**.

## How to open

- Open [`index.html`](index.html) from disk; it links every screen and state.
- Each mock has a bar at the bottom: sibling states, theme toggle, hide chrome.
- `?theme=dark` or `?theme=light` forces a theme; <kbd>t</kbd> toggles it.
- `?chrome=0` hides the mock bar and the yellow notes, leaving only the product.
- Photos and map tiles are illustrated SVG stand-ins in `assets/img/` so the
  set works offline. They are content, like real photos, so they keep their own
  colours in both themes.

## Cast and catalog

"Today" is **Monday 13 October 2026**. Stale means verified more than 183 days
ago (before 13 Apr 2026); due soon means 153–183 days (13 Apr – 13 May 2026).
All-in = rate × max(2, minimum hours) + mandatory fees. Overall = mean of six
scores to one decimal. Booking sites use the reserved `.example` domain.

### Studios (published)

| Studio (slug) | Neighbourhood · cross streets | Rate · min · fees | All-in 2 h | V L S G Lo C → overall | Price verified | Reviewed | Disclosure | Video | Guides |
|---|---|---|---|---|---|---|---|---|---|
| The Junction Loft (`the-junction-loft`) | Junction · Dundas St W at Pacific Ave | $60.00 · 2 h · cleaning $25.00 mandatory; after-hours access $30.00 optional | **$145.00** | 4 5 3 4 2 5 → **3.8** | 22 Sep 2026 | 29 Sep 2026 | Paid in full | Yes | Best natural light |
| Leslieville Daylight Studio (`leslieville-daylight-studio`) | Leslieville · Queen St E at Carlaw Ave | $45.50 · 2 h · none | **$91.00** | 5 5 3 3 4 4 → **4.0** | 10 Aug 2026 | 14 Aug 2026 | Discounted by Leslieville Daylight Studio | Yes | Under $120; Best natural light |
| Ossington Blackbox (`ossington-blackbox`) | Ossington · Ossington Ave at Dundas St W | $90.00 · 3 h · none | **$270.00** | 3 2 5 5 4 4 → **3.8** | 2 Mar 2026 (**stale**, 225 days) | 6 Mar 2026 | Paid in full | No | Large crew |
| Liberty Cyc House (`liberty-cyc-house`) | Liberty Village · Liberty St at Atlantic Ave | $75.00 · 2 h · cyc touch-up $35.00 mandatory | **$185.00** | 3 3 5 5 5 4 → **4.2** | 28 Apr 2026 (**due soon**, 168 days) | 2 May 2026 | Comped by Liberty Cyc House | Yes | Large crew |
| Kensington Window Room (`kensington-window-room`) | Kensington Market · Augusta Ave at Baldwin St | $40.00 · 1 h · none | **$80.00** | 5 4 2 2 3 3 → **3.2** | 30 Sep 2026 | 3 Oct 2026 | Paid in full | No | Under $120; Best natural light |
| Bloordale Sun Studio (`bloordale-sun-studio`) | Bloordale · Bloor St W at Brock Ave | $55.00 · 2 h · cleaning $20.00 mandatory | **$130.00** | 4 5 4 4 3 4 → **4.0** | 15 Jul 2026 | 20 Jul 2026 | Paid in full | No | — (the "minimal" studio: no cyc, no extras, changing area None) |
| Riverside Rooftop Studio (`riverside-rooftop-studio`) | Riverside · Queen St E at Broadview Ave | $50.00 · 2 h · none | **$100.00** | 4 4 3 3 3 4 → **3.5** | 5 Jun 2026 | 9 Jun 2026 | Paid in full | No | Under $120 |

Drafts (admin only): **Corktown Garage Studio** (Corktown, updated 11 Oct 2026,
missing ceiling height), **Annex Attic Studio** (The Annex, updated 8 Oct 2026).

Orders the list must show:
- Most recent review (default): Kensington, Junction, Leslieville, Bloordale, Riverside, Liberty, Ossington.
- All-in cost: Kensington $80, Leslieville $91, Riverside $100, Bloordale $130, Junction $145, Liberty $185, Ossington $270.
- Overall score: Liberty 4.2, Leslieville 4.0, Bloordale 4.0, Junction 3.8, Ossington 3.8, Riverside 3.5, Kensington 3.2 (ties by review date).

**The Junction Loft in full** (studio/default): 6.1 m × 4.3 m (20 ft × 14 ft)
usable; ceiling 4.0 m (13 ft); windows face north; natural light morning Medium,
midday Strong, afternoon Strong, evening Low; power 8 outlets (15 A), 20 A
circuits Yes (2); cyc wall Yes, scuffed; backdrops white, grey and black
seamless (2.7 m). Included: 2 × Godox AD600 strobes, 1 × 60 cm LED panel,
1 × 120 cm octabox, 2 × 5-in-1 reflectors, 4 × C-stands, garment steamer.
Extras: hazer $20.00, extra seamless roll $15.00. Load-in freight elevator
"small, 1.2 m wide"; parking street, paid, 2-hour limit; transit Dundas West
station 8-minute walk, 505 streetcar at the door; washroom private; changing
area curtained corner with mirror; client seating sofa for 4; noise streetcar
rumble every few minutes. Who it's for: portrait and fashion shooters who want
big north light and a usable cyc on a mid-range budget. Who should skip it:
video crews and anyone hauling heavy cases. Episode: "Episode 4: The Junction
Loft — big north light, tiny elevator" (YouTube ID `Jx7Lq2pT9aE`).
Test shots (setup: "One Godox AD600 in a 120 cm octabox at 45°, 1.5 m from
the subject, f/8, 1/160 s, ISO 100, 85 mm"): 1 headshot, 2 full length,
3 product on table. Gallery: 8 photos from a real shoot.

### Outdoor spots (published)

| Spot (slug) | Neighbourhood · type | Best uses | Permits: portrait / wedding or engagement / commercial / video | Verified | Video | Rain backup (distance, all-in) |
|---|---|---|---|---|---|---|
| Evergreen Brick Works (`evergreen-brick-works`) | Don Valley · park | engagement, family, portrait, brand | Not required / Required / Required / Required | 1 Sep 2026 · source evergreen.ca | Yes | Riverside Rooftop 3.1 km $100.00; Leslieville Daylight 4.0 km $91.00; Kensington Window Room 5.6 km $80.00 |
| Humber Bay Arch Bridge (`humber-bay-arch-bridge`) | Humber Bay · waterfront | engagement, portrait, video | Not required / Not required / Required / Required | 15 Aug 2026 · toronto.ca | No | Junction Loft 6.2 km; Liberty Cyc House 7.9 km; Ossington Blackbox 8.4 km |
| Distillery District (`distillery-district`) | Distillery District · architecture | engagement, brand, portrait | Required / Required / Required / Required | 20 Mar 2026 (**stale**, 207 days) | No | Riverside Rooftop 1.9 km; Leslieville Daylight 2.8 km; Kensington 3.3 km |
| Trinity Bellwoods Park (`trinity-bellwoods-park`) | Trinity Bellwoods · park | family, portrait, engagement | Not required / Not required / Required / Required | 12 Sep 2026 · toronto.ca | No | Ossington Blackbox 0.9 km; Kensington 1.6 km; Bloordale 2.0 km |
| Allan Gardens Conservatory (`allan-gardens-conservatory`) | Garden District · indoor public | portrait, engagement, brand | Not required / Required / Required / Required | 4 Oct 2026 · toronto.ca | No | Riverside Rooftop 2.4 km; Kensington 2.5 km; Leslieville 3.6 km |

Draft spot: **Scarborough Bluffs**. Permit data is illustrative, not advice.

**Evergreen Brick Works in full** (spot/default): 43.6846, −79.3653. How to get
there: TTC 28A shuttle from Davisville or Broadview station; driving via Bayview
Ave, paid lot on site; walking 20 minutes down the Beltline from Moore Park.
Light: morning Medium (east-facing kiln walls), midday Low (harsh; little shade
in the courtyard), afternoon Medium, golden hour Strong (west light rakes the
brick), blue hour Low (few lights after closing). Seasons: spring wet paths,
quarry garden green by May; summer Saturday farmers' market crowds; autumn
valley colour peaks mid-October; winter skating rink, icy paths. Crowds weekday
Low, weekend High; parking paid lot; washrooms in the main building; changing
washrooms only. Samples: 85 mm "shoot north from the lower steps"; 35 mm "kiln
tunnel, backlit from the west door"; 50 mm "quarry boardwalk, facing the
skyline"; 24 mm "chimney courtyard from the north-east corner"; 135 mm
"compress the valley from the top of the Beltline". Episode: "Episode 7:
Evergreen Brick Works at golden hour" (YouTube ID `Ev7Bw3kGh2Q`, 12:48).

### Guides

| Guide (slug) | Entries in order | Data point |
|---|---|---|
| Best studios under $120 for 2 hours (`best-studios-under-120`) | Kensington Window Room, Leslieville Daylight Studio, Riverside Rooftop Studio | All-in cost |
| Best natural light (`best-natural-light`) | The Junction Loft, Leslieville Daylight Studio, Kensington Window Room | Light score, window direction |
| Best for a large crew (`best-for-a-large-crew`) | Ossington Blackbox, Liberty Cyc House | Usable space, ceiling height |

Draft guide: **Best for headshots** (Leslieville, Kensington; updated 9 Oct 2026).

### People and accounts

- Owner account: `owner@shotthere.ca` (the only account).
- Signup example: `maya.chen@example.com`.
- Channel: `https://www.youtube.com/@ShotThere`.

### Admin counts

Studios 7 published, 2 draft · Spots 5 published, 1 draft · Guides 3 published,
1 draft. Needs re-verification: Ossington Blackbox prices (2 Mar 2026),
Distillery District permits (20 Mar 2026). Due soon: Liberty Cyc House prices
(28 Apr 2026).

## Assumptions and open questions

1. **Home page content is not specified.** L2-039 places the signup form on it and L2-083 links to it; the mock shows the promise, the latest reviews, the guides and the signup form. Confirm the content.
2. **Paths the designs leave to `APP_PATHS`** are assumed: `/`, `/editorial-policy`, `/admin/sign-in`, `/admin`, `/admin/{studios|spots|guides}`, `/new` and `/:id` editors.
3. **Owner password reset, offline and maintenance pages** are not in the specs and were not mocked (scope: specs plus implied screens).
4. **Studio filters between SM and LG**: L2-022.5 fixes XS (full-height dialog) and LG (sidebar). The mocks use the dialog below LG.
5. **Minimum above maximum** in the filters dialog: L2-025.4 ignores it in the URL; the dialog shows an inline message before Apply. Confirm.
6. **Skeleton count** while a list loads: six cards (two rows at LG).
7. **Spot filters** use a dialog below LG and a sidebar at LG, like studios (L2-024 does not say).
8. **Compare limit message** (L2-030.3) is a warning toast; the detailed design only says "message".
9. **Map popup** on phones opens as a bottom card over the map rather than above the marker.
10. **Admin navigation** items (Dashboard, Studios, Spots, Guides, View site, Sign out) are assumed; the designs list screens but not the nav.
11. **Invented detail beyond the catalog** (consistent across mocks, review before copy is final): specs, gear and logistics for Ossington, Bloordale, Leslieville and Liberty; light, samples, directions and coordinates for Distillery and Trinity Bellwoods; all Scarborough Bluffs copy; editor's notes in guides.
12. **Comparison row order**: "Prices verified" sits in the Cost group beside the prices, not after the overall score as L2-031 lists it. Missing mandatory fees show "—".
13. **Invalid email wording** for `not-an-email` (L2-039.3): "Enter a valid email address, like name@example.com".
14. **Price confirmation** (L2-042.2): after a price edit the "Prices last verified" field is emptied and required, with the previous date as help text.
15. **Guide entry removal** has no confirmation dialog (L2-060 does not ask for one); removal is staged until Save.

## Re-check and re-screenshot

```sh
python .claude/skills/writing-html-mocks/scripts/check_mocks.py docs/mocks --write
python .claude/skills/writing-html-mocks/scripts/screenshot_mocks.py docs/mocks
python .claude/skills/extracting-design-systems/scripts/check_design_system.py docs/design-system
python .claude/skills/extracting-design-systems/scripts/check_contrast.py docs/design-system/tokens/tokens.css
```

Screenshots land in `docs/mocks/.cache/` (ignored by git).

## Coverage

<!-- coverage:start -->

Legend: ✅ mock exists · ➖ not applicable (reason in manifest) · ❌ missing

### Pages

| Screen | default | loading | empty | error | invalid | submitting | success | rate-limited | no-results | filtered | selected-one | selected | list | studios-only | tiles-failed | stale | minimal | playing | media-failed | in-compare | stale-permit | no-rain-backup | no-video | map-failed | four | unknown-slug | over-limit | incorrect | session-expired | signed-out | up-to-date | partial | new | published | uploading | upload-failed | price-changed | Requirements |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Home (`home`) | [✅](pages/home/default.html) | ➖ | [✅](pages/home/empty.html) | [✅](pages/home/error.html) | [✅](pages/home/invalid.html) | [✅](pages/home/submitting.html) | [✅](pages/home/success.html) | [✅](pages/home/rate-limited.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-039`, `L2-041`, `L2-035`, `L2-046`, `L2-048` |
| Studios (`studios`) | [✅](pages/studios/default.html) | [✅](pages/studios/loading.html) | [✅](pages/studios/empty.html) | [✅](pages/studios/error.html) |  |  |  |  | [✅](pages/studios/no-results.html) | [✅](pages/studios/filtered.html) | [✅](pages/studios/selected-one.html) | [✅](pages/studios/selected.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-021`, `L2-022`, `L2-023`, `L2-025`, `L2-026`, `L2-030`, `L2-043`, `L2-046`, `L2-069` |
| Outdoor spots (`spots`) | [✅](pages/spots/default.html) | [✅](pages/spots/loading.html) | [✅](pages/spots/empty.html) | [✅](pages/spots/error.html) |  |  |  |  | [✅](pages/spots/no-results.html) | [✅](pages/spots/filtered.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-024`, `L2-025`, `L2-026`, `L2-019`, `L2-069` |
| Map (`map`) | [✅](pages/map/default.html) | [✅](pages/map/loading.html) | [✅](pages/map/empty.html) | [✅](pages/map/error.html) |  |  |  |  |  |  |  |  | [✅](pages/map/list.html) | [✅](pages/map/studios-only.html) | [✅](pages/map/tiles-failed.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-027`, `L2-028`, `L2-029`, `L2-086` |
| Studio review (`studio`) | [✅](pages/studio/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/studio/stale.html) | [✅](pages/studio/minimal.html) | [✅](pages/studio/playing.html) | [✅](pages/studio/media-failed.html) | [✅](pages/studio/in-compare.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-003`, `L2-004`, `L2-005`, `L2-006`, `L2-007`, `L2-008`, `L2-009`, `L2-010`, `L2-011`, `L2-012`, `L2-013`, `L2-030`, `L2-036`, `L2-043`, `L2-047`, `L2-048`, `L2-086` |
| Outdoor spot (`spot`) | [✅](pages/spot/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/spot/stale-permit.html) | [✅](pages/spot/no-rain-backup.html) | [✅](pages/spot/no-video.html) | [✅](pages/spot/map-failed.html) |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-014`, `L2-015`, `L2-016`, `L2-017`, `L2-018`, `L2-019`, `L2-020`, `L2-037`, `L2-038`, `L2-043`, `L2-047`, `L2-086` |
| Compare studios (`compare`) | [✅](pages/compare/default.html) | ➖ | [✅](pages/compare/empty.html) | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/compare/four.html) | [✅](pages/compare/unknown-slug.html) | [✅](pages/compare/over-limit.html) |  |  |  |  |  |  |  |  |  |  | `L2-031`, `L2-032`, `L2-033`, `L2-043` |
| Guides (`guides`) | [✅](pages/guides/default.html) | ➖ | [✅](pages/guides/empty.html) | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-035` |
| Guide (`guide`) | [✅](pages/guide/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-034` |
| Editorial policy (`editorial-policy`) | [✅](pages/editorial-policy/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-046` |
| Page not found (`not-found`) | [✅](pages/not-found/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-083`, `L2-001` |
| Something went wrong (`server-error`) | [✅](pages/server-error/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-083` |
| Owner sign-in (`sign-in`) | [✅](pages/sign-in/default.html) | ➖ | ➖ | [✅](pages/sign-in/error.html) | [✅](pages/sign-in/invalid.html) | [✅](pages/sign-in/submitting.html) |  | [✅](pages/sign-in/rate-limited.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/sign-in/incorrect.html) | [✅](pages/sign-in/session-expired.html) | [✅](pages/sign-in/signed-out.html) |  |  |  |  |  |  |  | `L2-049`, `L2-050`, `L2-051`, `L2-052` |
| Dashboard (`admin-dashboard`) | [✅](pages/admin-dashboard/default.html) | [✅](pages/admin-dashboard/loading.html) | [✅](pages/admin-dashboard/empty.html) | [✅](pages/admin-dashboard/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-dashboard/up-to-date.html) | [✅](pages/admin-dashboard/partial.html) |  |  |  |  |  | `L2-053`, `L2-044`, `L2-052` |
| Studios (admin) (`admin-studios`) | [✅](pages/admin-studios/default.html) | [✅](pages/admin-studios/loading.html) | [✅](pages/admin-studios/empty.html) | [✅](pages/admin-studios/error.html) |  |  |  |  | [✅](pages/admin-studios/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-063`, `L2-043` |
| Spots (admin) (`admin-spots`) | [✅](pages/admin-spots/default.html) | [✅](pages/admin-spots/loading.html) | [✅](pages/admin-spots/empty.html) | [✅](pages/admin-spots/error.html) |  |  |  |  | [✅](pages/admin-spots/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-063`, `L2-043` |
| Guides (admin) (`admin-guides`) | [✅](pages/admin-guides/default.html) | [✅](pages/admin-guides/loading.html) | [✅](pages/admin-guides/empty.html) | [✅](pages/admin-guides/error.html) |  |  |  |  | [✅](pages/admin-guides/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-063` |
| Studio editor (`studio-editor`) | [✅](pages/studio-editor/default.html) | [✅](pages/studio-editor/loading.html) | ➖ | [✅](pages/studio-editor/error.html) | [✅](pages/studio-editor/invalid.html) | [✅](pages/studio-editor/submitting.html) | [✅](pages/studio-editor/success.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/studio-editor/new.html) | [✅](pages/studio-editor/published.html) | [✅](pages/studio-editor/uploading.html) | [✅](pages/studio-editor/upload-failed.html) | [✅](pages/studio-editor/price-changed.html) | `L2-054`, `L2-042`, `L2-045`, `L2-057`, `L2-058`, `L2-059`, `L2-002`, `L2-056`, `L2-061`, `L2-062` |
| Spot editor (`spot-editor`) | [✅](pages/spot-editor/default.html) | [✅](pages/spot-editor/loading.html) | ➖ | [✅](pages/spot-editor/error.html) | [✅](pages/spot-editor/invalid.html) | [✅](pages/spot-editor/submitting.html) | [✅](pages/spot-editor/success.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/spot-editor/new.html) | [✅](pages/spot-editor/published.html) |  |  |  | `L2-055`, `L2-042`, `L2-045`, `L2-056`, `L2-057`, `L2-059`, `L2-061`, `L2-062` |
| Guide editor (`guide-editor`) | [✅](pages/guide-editor/default.html) | [✅](pages/guide-editor/loading.html) | ➖ | [✅](pages/guide-editor/error.html) | [✅](pages/guide-editor/invalid.html) | [✅](pages/guide-editor/submitting.html) | [✅](pages/guide-editor/success.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/guide-editor/new.html) | [✅](pages/guide-editor/published.html) |  |  |  | `L2-060`, `L2-061`, `L2-062` |

### Dialogs

| Screen | default | busy | invalid | selected | spot | sample-shot | last | image-failed | admin | failed | refused | results | no-matches | Requirements |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Studio filters (`studio-filters`) | [✅](dialogs/studio-filters/default.html) | ➖ | [✅](dialogs/studio-filters/invalid.html) | [✅](dialogs/studio-filters/selected.html) |  |  |  |  |  |  |  |  |  | `L2-022`, `L2-023`, `L2-025`, `L2-067` |
| Spot filters (`spot-filters`) | [✅](dialogs/spot-filters/default.html) | ➖ | ➖ | [✅](dialogs/spot-filters/selected.html) |  |  |  |  |  |  |  |  |  | `L2-024`, `L2-025`, `L2-067` |
| Map marker popup (`map-popup`) | [✅](dialogs/map-popup/default.html) | ➖ | ➖ |  | [✅](dialogs/map-popup/spot.html) |  |  |  |  |  |  |  |  | `L2-028` |
| Photo lightbox (`lightbox`) | [✅](dialogs/lightbox/default.html) | ➖ | ➖ |  |  | [✅](dialogs/lightbox/sample-shot.html) | [✅](dialogs/lightbox/last.html) | [✅](dialogs/lightbox/image-failed.html) |  |  |  |  |  | `L2-010`, `L2-016`, `L2-067`, `L2-086` |
| Site menu (`site-menu`) | [✅](dialogs/site-menu/default.html) | ➖ | ➖ |  |  |  |  |  | [✅](dialogs/site-menu/admin.html) |  |  |  |  | `L2-064`, `L2-035`, `L2-052` |
| Can't publish yet (`missing-fields`) | [✅](dialogs/missing-fields/default.html) | ➖ | ➖ |  | [✅](dialogs/missing-fields/spot.html) |  |  |  |  |  |  |  |  | `L2-056`, `L2-002`, `L2-045`, `L2-055`, `L2-060` |
| Unpublish (`unpublish`) | [✅](dialogs/unpublish/default.html) | [✅](dialogs/unpublish/busy.html) | ➖ |  |  |  |  |  |  | [✅](dialogs/unpublish/failed.html) |  |  |  | `L2-056` |
| Delete (`delete-content`) | [✅](dialogs/delete-content/default.html) | [✅](dialogs/delete-content/busy.html) | ➖ |  |  |  |  |  |  | [✅](dialogs/delete-content/failed.html) |  |  |  | `L2-061` |
| Remove image (`remove-image`) | [✅](dialogs/remove-image/default.html) | ➖ | ➖ |  |  |  |  |  |  |  | [✅](dialogs/remove-image/refused.html) |  |  | `L2-058` |
| Discard changes (`discard-changes`) | [✅](dialogs/discard-changes/default.html) | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  | `L2-062` |
| Add guide entry (`guide-entry-picker`) | [✅](dialogs/guide-entry-picker/default.html) | [✅](dialogs/guide-entry-picker/busy.html) | [✅](dialogs/guide-entry-picker/invalid.html) |  |  |  |  |  |  |  |  | [✅](dialogs/guide-entry-picker/results.html) | [✅](dialogs/guide-entry-picker/no-matches.html) | `L2-060` |

### Notifications

| Screen | info | success | warning | danger | stacked | Requirements |
|---|---|---|---|---|---|---|
| Admin toasts (`admin-toast`) | [✅](notifications/admin-toast/info.html) | [✅](notifications/admin-toast/success.html) | [✅](notifications/admin-toast/warning.html) | [✅](notifications/admin-toast/danger.html) | [✅](notifications/admin-toast/stacked.html) | `L2-054`, `L2-056`, `L2-061` |
| Public toasts (`public-toast`) | ➖ | [✅](notifications/public-toast/success.html) | [✅](notifications/public-toast/warning.html) | [✅](notifications/public-toast/danger.html) |  | `L2-030`, `L2-032` |

<!-- coverage:end -->
