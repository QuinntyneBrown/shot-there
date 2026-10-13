# 06 · Editing a studio

> **Runtime:** ~6 min · **Audience:** the product team and reviewers of the MVP mocks · **Prerequisites:** the earlier videos in this series

**Video:** [06-editing-a-studio.mp4](06-editing-a-studio.mp4) · [Slides](slides.html) · **Audio:** [06-editing-a-studio.mp3](06-editing-a-studio.mp3) · [Transcript](script.md)

## Why this video exists

The studio editor holds the most behaviour in the product. This video follows a studio from creation through images, saving, publishing, unpublishing and deletion, with every dialog and message.

## Learning objectives

By the end, the viewer can:

- Name the editor's sections.
- Describe upload checks and image removal, including the refusal.
- Describe validation and the not-saved message.
- Explain the publish, unpublish and delete rules and their dialogs.
- Describe unsaved-changes protection.

## Key questions

| Question | What a strong answer includes |
|---|---|
| When can a studio be published? | When every standard field is present; otherwise a dialog lists what is missing |
| When can a studio be deleted? | Only as a draft; Delete is disabled with a reason while published |
| Which image removal is refused? | The last standard test shot of a published studio |
| What happens on leaving with unsaved changes? | A dialog names the changes; closing the tab uses the browser's prompt |

## Code / assets on screen

| File | What to show |
|---|---|
| `docs/mocks/pages/studio-editor/` | Every editor state |
| `docs/mocks/dialogs/remove-image/` | Default, busy, failed, refused |
| `docs/mocks/dialogs/missing-fields/default.html` | Can't publish yet |
| `docs/mocks/dialogs/unpublish/` | Default, busy, failed |
| `docs/mocks/dialogs/delete-location/` | Default, busy, failed |
| `docs/mocks/dialogs/unsaved-changes/default.html` | Leave without saving? |
| `docs/mocks/notifications/admin-toast/` | Created, published, draft again, deleted, not saved |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 0:00-0:14 | Introduction | What the video covers |
| 0:15-0:46 | Creating a studio | New studio, created message |
| 0:47-1:55 | The editor | Every section, pinned actions |
| 1:55-2:46 | Images | Uploading, rejected, remove dialogs |
| 2:47-3:33 | Saving | Busy, invalid, not saved, loading, error |
| 3:34-4:19 | Publishing | Missing fields, published, Delete disabled |
| 4:20-4:45 | Unpublishing | Dialog states, draft again |
| 4:46-5:17 | Deleting | Dialog states, deleted |
| 5:18-5:37 | Unsaved changes | Leave without saving? |
| 5:38-6:00 | Recap | Things to remember |

## Demo commands

```sh
node tools/video-shots/capture-shots.mjs docs/videos/06-editing-a-studio
node tools/video-audio/generate-audio.mjs docs/videos/06-editing-a-studio
node tools/video-build/build-video.mjs docs/videos/06-editing-a-studio
```

## Pitfalls

- The screenshots are the mocks, not the built app; the MVP deferrals in `docs/mocks/README.md` apply.
- As scoped, the MVP editor has no inputs for specifications, so publishing lists them as missing (open question 1).
- Uploads are one file at a time, with no progress bar, in the MVP.
- Re-capture the screenshots after any mock change; `img/` is generated from `shots.json`.

## References

- [`docs/mocks/README.md`](../../mocks/README.md): cast, catalog, MVP scope and open questions
- [`docs/specs/L2.md`](../../specs/L2.md): L2-002 (standard fields), L2-054 (studio editor), L2-056 (publish and unpublish), L2-057 and L2-058 (images), L2-059 (video link), L2-061 (delete), L2-062 (unsaved changes)
