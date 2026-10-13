# 03 · Outdoor spots and the map

> **Runtime:** ~5 min · **Audience:** the product team and reviewers of the MVP mocks · **Prerequisites:** the earlier videos in this series

**Video:** [03-outdoor-spots-and-the-map.mp4](03-outdoor-spots-and-the-map.mp4) · [Slides](slides.html) · **Audio:** [03-outdoor-spots-and-the-map.mp3](03-outdoor-spots-and-the-map.mp3) · [Transcript](script.md)

## Why this video exists

Outdoor spots and the map complete the public side of ShotThere. This video shows the spot list and its states, every section of a spot review, the stale-permit warning, the rain backup and the map with its popups and states.

## Learning objectives

By the end, the viewer can:

- Describe what a spot card shows and how spots filter.
- Name the sections of a spot review.
- Explain the stale-permit warning.
- Explain the rain backup and its empty state.
- Describe the map markers, popup, filter and states.

## Key questions

| Question | What a strong answer includes |
|---|---|
| What does a spot card lead with? | The permit rule for portraits |
| When are permit rules flagged? | Verified more than six months ago, e.g. Distillery District, March 20, 2026 |
| What is the rain backup? | The nearest reviewed studios by straight-line distance; a message and a link when none are published |
| How is the map accessible? | Markers are buttons in the tab order; Escape closes the popup and returns focus; every location is also listed below |

## Code / assets on screen

| File | What to show |
|---|---|
| `docs/mocks/pages/spots/` | List, filtered, loading, no-results, error, empty |
| `docs/mocks/pages/spot/` | Default, permit-stale, no-backup |
| `docs/mocks/dialogs/lightbox/sample-shot.html` | Sample shot lightbox |
| `docs/mocks/pages/map/` | Default, popup, studios-only, loading, error, empty |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 0:00-0:14 | Introduction | What the video covers |
| 0:15-0:36 | The spot list | Cards and the permit rule |
| 0:37-1:27 | Filtering spots | Type and use filters, list states |
| 1:28-1:45 | A spot review | Hero, summary panel, phone |
| 1:46-2:02 | Getting there | Static map and directions |
| 2:03-2:37 | Best light and sample shots | Light by time and season, samples, lightbox |
| 2:38-3:09 | Permits | Permit table and stale warning |
| 3:10-3:38 | Episode and rain backup | Episode, nearest studios, no-backup |
| 3:39-4:28 | The map | Markers, popup, filter, list |
| 4:28-4:50 | Map states | Loading, error, empty, phone |
| 4:51-5:14 | Recap | Things to remember |

## Demo commands

```sh
node tools/video-shots/capture-shots.mjs docs/videos/03-outdoor-spots-and-the-map
node tools/video-audio/generate-audio.mjs docs/videos/03-outdoor-spots-and-the-map
node tools/video-build/build-video.mjs docs/videos/03-outdoor-spots-and-the-map
```

## Pitfalls

- The screenshots are the mocks, not the built app; the MVP deferrals in `docs/mocks/README.md` apply.
- The spot page uses a static map image in the MVP, not an interactive map.
- The spot list has no permit filter in the MVP, and spot cards carry no stale flag (open question 5).
- Re-capture the screenshots after any mock change; `img/` is generated from `shots.json`.

## References

- [`docs/mocks/README.md`](../../mocks/README.md): cast, catalog, MVP scope and open questions
- [`docs/specs/L2.md`](../../specs/L2.md): L2-014 to L2-020 (spot review), L2-024 (spot list), L2-027 to L2-029 (map), L2-037 and L2-038 (rain backup), L2-043 (stale data)
