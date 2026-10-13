# 01 · Finding a studio

> **Runtime:** ~4 min · **Audience:** the product team and reviewers of the MVP mocks · **Prerequisites:** none

**Video:** [01-finding-a-studio.mp4](01-finding-a-studio.mp4) · [Slides](slides.html) · **Audio:** [01-finding-a-studio.mp3](01-finding-a-studio.mp3) · [Transcript](script.md)

## Why this video exists

The studio list is the first screen most visitors see. This video walks through every state of it in the mocks, so reviewers can check the behaviour without opening ten HTML files.

## Learning objectives

By the end, the viewer can:

- Name the facts every studio card shows and why the all-in cost comes first.
- Explain the stale-price flag.
- List the sort orders and filters, and explain that the view lives in the URL.
- Describe the loading, no-results, error and empty states.
- Describe the phone menu and the collapsible filter panel.

## Key questions

| Question | What a strong answer includes |
|---|---|
| What does a studio card show? | Photo, name, neighbourhood, review date, all-in cost for 2 hours, overall score, stale flag, Compare |
| When is a price flagged? | Prices verified more than 183 days ago, e.g. Junction Cyc Studio (March 2, 2026) |
| How is a filtered view shared? | Filters and sort are in the query string, e.g. `/studios?costMax=160&light=medium&sort=cost` |
| What happens when the server fails? | "We couldn't load studios", filters are kept, Try again |

## Code / assets on screen

| File | What to show |
|---|---|
| `docs/mocks/pages/studios/default.html` | List, cards, sort, filters |
| `docs/mocks/pages/studios/filtered.html` | Two filters applied, sorted by cost |
| `docs/mocks/pages/studios/loading.html` | Updating results |
| `docs/mocks/pages/studios/no-results.html` | No studios match these filters |
| `docs/mocks/pages/studios/error.html` | We couldn't load studios |
| `docs/mocks/pages/studios/empty.html` | No studio reviews yet |
| `docs/mocks/pages/studios/menu-open.html` | Phone menu |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 0:00-0:20 | Introduction | What the series is; this video covers the studio list |
| 0:21-1:17 | The studio list | Cards, default order, stale flag, Compare |
| 1:18-2:11 | Sorting and filtering | Sort, filters, filtered view in the URL |
| 2:12-3:04 | When results are not normal | Loading, no results, error, empty |
| 3:05-3:23 | On a phone | Menu disclosure, filter panel |
| 3:24-3:48 | Recap | Four things to remember |

## Demo commands

```sh
node tools/video-shots/capture-shots.mjs docs/videos/01-finding-a-studio
node tools/video-audio/generate-audio.mjs docs/videos/01-finding-a-studio
node tools/video-build/build-video.mjs docs/videos/01-finding-a-studio
```

## Pitfalls

- The screenshots are the mocks, not the built app: the MVP deferrals noted in `docs/mocks/README.md` apply (plain loading text, no skeleton cards; one filter panel at every width).
- Re-capture the screenshots after any mock change; `img/` is generated from `shots.json`.

## References

- [`docs/mocks/README.md`](../../mocks/README.md): cast, catalog and MVP scope
- [`docs/specs/L2.md`](../../specs/L2.md): L2-021 to L2-023 and L2-025 to L2-026 (list, filters, sort, URL state, loading and errors), L2-043 (stale data) and L2-064 (breakpoints)
