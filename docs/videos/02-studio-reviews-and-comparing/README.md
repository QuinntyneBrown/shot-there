# 02 · Studio reviews and comparing

> **Runtime:** ~5 min · **Audience:** the product team and reviewers of the MVP mocks · **Prerequisites:** the earlier videos in this series

**Video:** [02-studio-reviews-and-comparing.mp4](02-studio-reviews-and-comparing.mp4) · [Slides](slides.html) · **Audio:** [02-studio-reviews-and-comparing.mp3](02-studio-reviews-and-comparing.mp3) · [Transcript](script.md)

## Why this video exists

The studio review and the comparison are the core of ShotThere. This video shows every section of a review, the lightbox, sparse and failed states, building a comparison, and what happens when a comparison link is wrong.

## Learning objectives

By the end, the viewer can:

- Name the sections of a studio review in order.
- Explain why the three standard test shots make studios comparable.
- Describe the lightbox's keyboard and loading behaviour.
- Explain how a comparison is built from the list, and the limit of four.
- Describe how the comparison page handles too many, unknown or too few studios.

## Key questions

| Question | What a strong answer includes |
|---|---|
| What is in the all-in cost? | Hourly rate × minimum booking plus mandatory fees; optional extras are listed but excluded |
| How does the lightbox behave? | Focus starts on Close and is trapped; Escape returns focus to the thumbnail; Next wraps; no Previous in the MVP |
| What happens on a fifth Compare? | It is refused; the bar names the studio to remove first; the selection survives a reload |
| What if a comparison link names an unknown studio? | The page names it and compares the rest |

## Code / assets on screen

| File | What to show |
|---|---|
| `docs/mocks/pages/studio/default.html` | Every review section |
| `docs/mocks/pages/studio/sparse.html` | No episode, no Featured in |
| `docs/mocks/pages/studio/image-failed.html` | Failed gallery image |
| `docs/mocks/dialogs/lightbox/` | Lightbox default and busy |
| `docs/mocks/pages/studios/compare-*.html` | Compare bar with one, two and four studios |
| `docs/mocks/pages/compare/` | Comparison default, over-limit, unknown-studio, empty |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 0:00-0:10 | Introduction | What the video covers |
| 0:11-0:47 | The top of a review | Hero, summary panel, phone |
| 0:48-1:35 | Pricing, specs and logistics | All-in breakdown, measured specs, gear and logistics |
| 1:36-2:32 | Test shots and the gallery | Three setups, gallery, lightbox |
| 2:33-3:12 | Verdict, disclosure and episode | Six scores, disclosure, episode, Featured in |
| 3:13-3:36 | When a review is sparse | Missing sections, failed image |
| 3:37-4:06 | Choosing studios to compare | Compare bar and the limit of four |
| 4:07-4:44 | The comparison page | Table, test shots row, phone |
| 4:45-5:07 | When a comparison link is wrong | Over-limit, unknown studio, empty |
| 5:08-5:29 | Recap | Things to remember |

## Demo commands

```sh
node tools/video-shots/capture-shots.mjs docs/videos/02-studio-reviews-and-comparing
node tools/video-audio/generate-audio.mjs docs/videos/02-studio-reviews-and-comparing
node tools/video-build/build-video.mjs docs/videos/02-studio-reviews-and-comparing
```

## Pitfalls

- The screenshots are the mocks, not the built app; the MVP deferrals in `docs/mocks/README.md` apply.
- The studio page shows no prices-verified date in the MVP (open question 4 in the mocks README).
- There is no Copy link on the comparison and no Compare toggle on the studio page in the MVP.
- Re-capture the screenshots after any mock change; `img/` is generated from `shots.json`.

## References

- [`docs/mocks/README.md`](../../mocks/README.md): cast, catalog, MVP scope and open questions
- [`docs/specs/L2.md`](../../specs/L2.md): L2-003 to L2-013 (studio review), L2-030 to L2-032 (comparison), L2-047 (episode embed), L2-086 (failed images)
