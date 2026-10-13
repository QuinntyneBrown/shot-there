# 07 · Editing spots and guides

> **Runtime:** ~4 min · **Audience:** the product team and reviewers of the MVP mocks · **Prerequisites:** the earlier videos in this series

**Video:** [07-editing-spots-and-guides.mp4](07-editing-spots-and-guides.mp4) · [Slides](slides.html) · **Audio:** [07-editing-spots-and-guides.mp3](07-editing-spots-and-guides.mp3) · [Transcript](script.md)

## Why this video exists

The spot and guide editors complete the owner's tools. This video covers what differs from the studio editor, the guide entry picker, and the publishing rules for both.

## Learning objectives

By the end, the viewer can:

- Name the spot editor's sections.
- Explain why spots can't yet be published in the MVP.
- Describe the guide editor and its entries.
- Walk through every state of the guide entry picker.

## Key questions

| Question | What a strong answer includes |
|---|---|
| What does the spot editor add? | Type, coordinates, directions, permits by shoot type, source link and date, best uses, sample shots with focal length and angle |
| Why is a spot refused? | Best light by time and season are standard fields the MVP editor has no input for |
| Can a studio be added to a guide twice? | No; it is shown as already in the guide and can't be added |

## Code / assets on screen

| File | What to show |
|---|---|
| `docs/mocks/pages/spot-editor/` | Every spot editor state |
| `docs/mocks/dialogs/missing-fields/spot.html` | Can't publish yet |
| `docs/mocks/pages/guide-editor/` | Every guide editor state |
| `docs/mocks/dialogs/guide-entry-picker/` | Default, busy, failed, invalid, no-results |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 0:00-0:10 | Introduction | What the video covers |
| 0:11-1:11 | The spot editor | Sections and phone |
| 1:12-1:35 | Spot editor states | Saving, invalid, loading, error |
| 1:36-2:12 | Publishing a spot | Missing fields, published |
| 2:13-2:43 | The guide editor | Title, slug, entries, phone |
| 2:44-3:22 | Adding a studio to a guide | Picker states |
| 3:23-3:50 | Guide editor states | Saving, no entries, published, loading |
| 3:51-4:17 | Recap | Things to remember |

## Demo commands

```sh
node tools/video-shots/capture-shots.mjs docs/videos/07-editing-spots-and-guides
node tools/video-audio/generate-audio.mjs docs/videos/07-editing-spots-and-guides
node tools/video-build/build-video.mjs docs/videos/07-editing-spots-and-guides
```

## Pitfalls

- The screenshots are the mocks, not the built app; the MVP deferrals in `docs/mocks/README.md` apply.
- Spots can't be published as scoped (open question 1); existing spots and guides have no admin list (open question 2).
- Guides can't be unpublished or deleted in the MVP; unsaved-changes protection covers the studio editor only.
- Re-capture the screenshots after any mock change; `img/` is generated from `shots.json`.

## References

- [`docs/mocks/README.md`](../../mocks/README.md): cast, catalog, MVP scope and open questions
- [`docs/specs/L2.md`](../../specs/L2.md): L2-055 (spot editor), L2-060 (guide editor and picker), L2-002 and L2-056 (publishing)
