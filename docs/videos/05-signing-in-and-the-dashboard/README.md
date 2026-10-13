# 05 · Signing in and the dashboard

> **Runtime:** ~4 min · **Audience:** the product team and reviewers of the MVP mocks · **Prerequisites:** the earlier videos in this series

**Video:** [05-signing-in-and-the-dashboard.mp4](05-signing-in-and-the-dashboard.mp4) · [Slides](slides.html) · **Audio:** [05-signing-in-and-the-dashboard.mp3](05-signing-in-and-the-dashboard.mp3) · [Transcript](script.md)

## Why this video exists

This video starts the owner's side: signing in, the dashboard that surfaces stale prices and permits, and the admin studio list.

## Learning objectives

By the end, the viewer can:

- Describe every sign-in state, including rate limiting.
- Explain the needs re-verification list.
- Describe the admin studio list, search and its states.

## Key questions

| Question | What a strong answer includes |
|---|---|
| Does sign-in say which field was wrong? | No; one message for both, and the password is cleared |
| When is sign-in paused? | After five failures in 15 minutes from one client (HTTP 429) |
| What is on the dashboard? | Counts for studios, spots and guides, and prices or permits older than 183 days, oldest first |

## Code / assets on screen

| File | What to show |
|---|---|
| `docs/mocks/pages/sign-in/` | Default, invalid, submitting, error, rate-limited |
| `docs/mocks/pages/admin-dashboard/` | Default, up-to-date, empty, loading, error |
| `docs/mocks/pages/admin-studios/` | Default, search, no-results, loading, error, empty |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 0:00-0:12 | Introduction | What the video covers |
| 0:13-1:13 | Signing in | Every sign-in state |
| 1:14-2:17 | The dashboard | Tiles, re-verification, states |
| 2:18-3:24 | The admin studio list | List, search, states, phone |
| 3:25-3:48 | Recap | Things to remember |

## Demo commands

```sh
node tools/video-shots/capture-shots.mjs docs/videos/05-signing-in-and-the-dashboard
node tools/video-audio/generate-audio.mjs docs/videos/05-signing-in-and-the-dashboard
node tools/video-build/build-video.mjs docs/videos/05-signing-in-and-the-dashboard
```

## Pitfalls

- The screenshots are the mocks, not the built app; the MVP deferrals in `docs/mocks/README.md` apply.
- The MVP has no session-expired message and no return to the requested admin page.
- The admin lists cover studios only in the MVP (open question 2).
- Re-capture the screenshots after any mock change; `img/` is generated from `shots.json`.

## References

- [`docs/mocks/README.md`](../../mocks/README.md): cast, catalog, MVP scope and open questions
- [`docs/specs/L2.md`](../../specs/L2.md): L2-049 to L2-051 (sign-in, rate limiting and session), L2-053 (dashboard), L2-063 (admin lists)
