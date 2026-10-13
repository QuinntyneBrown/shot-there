# ShotThere videos

Narrated walkthroughs of the ShotThere MVP mocks in [`docs/mocks/`](../mocks/). Each video is built from three text files (`script.md`, `slides.html`, `README.md`) plus screenshots of the mocks listed in `shots.json`.

| # | Video | Runtime | Covers |
|---|---|---|---|
| 01 | [Finding a studio](01-finding-a-studio/README.md) | 3:48 | Studio list, sort, filters, URL state, loading, no results, error, empty, phone menu |
| 02 | [Studio reviews and comparing](02-studio-reviews-and-comparing/README.md) | 5:29 | Studio review sections, lightbox, sparse and failed states, compare bar, comparison page and broken links |
| 03 | [Outdoor spots and the map](03-outdoor-spots-and-the-map/README.md) | 5:14 | Spot list, spot review, permits and stale warning, rain backup, map, popup and states |
| 04 | [Guides, signup and error pages](04-guides-signup-and-errors/README.md) | 3:57 | Guides index and guide, email signup states, editorial policy, 404, 500 |
| 05 | [Signing in and the dashboard](05-signing-in-and-the-dashboard/README.md) | 3:48 | Sign-in states and rate limit, dashboard and re-verification, admin studio list |
| 06 | [Editing a studio](06-editing-a-studio/README.md) | 6:00 | Studio editor, uploads, remove image, validation, publish, unpublish, delete, unsaved changes, toasts |
| 07 | [Editing spots and guides](07-editing-spots-and-guides/README.md) | 4:17 | Spot editor, missing fields, guide editor, entry picker states |

## Building a video

Run from the repository root. You need Node, Playwright with Chromium, ffmpeg with libx264 and libass, Python with `edge-tts` (`python -m pip install edge-tts`) and internet access for the speech synthesis.

```sh
node tools/video-shots/capture-shots.mjs docs/videos/NN-topic       # screenshots of the mocks into img/
node tools/video-audio/generate-audio.mjs docs/videos/NN-topic --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/NN-topic      # NN-topic.mp3 and the timing manifest
node tools/video-build/build-video.mjs docs/videos/NN-topic --check # cue schedule
node tools/video-build/build-video.mjs docs/videos/NN-topic         # NN-topic.mp4 with burned-in captions
```

`PYTHON`, `EDGE_VOICE`, `EDGE_VOICE_2`, `EDGE_PATH` and `FFMPEG_PATH` override the defaults. Behind a TLS-intercepting proxy, append the proxy CA to the bundle that `python -c "import certifi; print(certifi.where())"` prints. Generated files under `.cache/` are not committed.
