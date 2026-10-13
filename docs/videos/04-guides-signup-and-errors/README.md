# 04 · Guides, signup and error pages

> **Runtime:** ~4 min · **Audience:** the product team and reviewers of the MVP mocks · **Prerequisites:** the earlier videos in this series

**Video:** [04-guides-signup-and-errors.mp4](04-guides-signup-and-errors.mp4) · [Slides](slides.html) · **Audio:** [04-guides-signup-and-errors.mp3](04-guides-signup-and-errors.mp3) · [Transcript](script.md)

## Why this video exists

Guides, the email signup, the editorial policy and the error pages surround the reviews. This video shows each of them and every state of the signup form.

## Learning objectives

By the end, the viewer can:

- Explain how guide entries get their costs.
- Walk through every state of the email signup.
- Summarise the editorial policy.
- Describe the 404 and 500 pages.

## Key questions

| Question | What a strong answer includes |
|---|---|
| Where do guide costs come from? | Each studio's review, so they stay current; stale prices are flagged |
| What does a repeat signup see? | The same success message, so the list is never revealed |
| What does the 500 page show? | A static page without app chrome, no internal detail, a link to the studio list |

## Code / assets on screen

| File | What to show |
|---|---|
| `docs/mocks/pages/guides/default.html` | Guides index |
| `docs/mocks/pages/guide/default.html` | A guide |
| `docs/mocks/pages/email-signup/` | Default, invalid, invalid-format, submitting, success, error |
| `docs/mocks/pages/editorial-policy/default.html` | Editorial policy |
| `docs/mocks/pages/not-found/default.html` | 404 |
| `docs/mocks/pages/server-error/default.html` | 500 |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 0:00-0:12 | Introduction | What the video covers |
| 0:13-1:23 | Guides | Index, guide, entries, Featured in |
| 1:24-2:34 | The email signup | Every signup state |
| 2:35-2:56 | The editorial policy | The six commitments |
| 2:57-3:31 | Error pages | 404 and 500 |
| 3:32-3:57 | Recap | Things to remember |

## Demo commands

```sh
node tools/video-shots/capture-shots.mjs docs/videos/04-guides-signup-and-errors
node tools/video-audio/generate-audio.mjs docs/videos/04-guides-signup-and-errors
node tools/video-build/build-video.mjs docs/videos/04-guides-signup-and-errors
```

## Pitfalls

- The screenshots are the mocks, not the built app; the MVP deferrals in `docs/mocks/README.md` apply.
- Guides list studios only, and all-in cost is the only data point, in the MVP.
- The signup shows one generic failure message, including for rate limiting, in the MVP.
- Re-capture the screenshots after any mock change; `img/` is generated from `shots.json`.

## References

- [`docs/mocks/README.md`](../../mocks/README.md): cast, catalog, MVP scope and open questions
- [`docs/specs/L2.md`](../../specs/L2.md): L2-034 to L2-036 (guides), L2-039 to L2-041 (email signup), L2-043 (stale data), L2-083 (error pages)
