# Videos

Narrated walkthroughs made with the `creating-videos` skill
(`.claude/skills/creating-videos/SKILL.md`). Each folder holds the text the
video is built from (`script.md`, `slides.html`, `README.md` outline) and the
generated `NN-topic.mp3` and `NN-topic.mp4`.

| # | Video | Runtime | Covers |
|---|---|---|---|
| 01 | [The plan, in plain words](01-the-plan-in-plain-words/README.md) | 6:11 | The business plan and monetization strategy explained simply, with the three-year forecast |

## Making or updating a video

Run from the repository root. Generated timing and slide renders go to
`.cache/` (ignored by git). The slide renderer needs the Playwright package in
`tools/` (`cd tools && npm install`).

```sh
# 1. Narration: script.md → NN-topic.mp3 and .cache/videos/NN-topic/timing.json
python -m pip install edge-tts                       # free Edge read-aloud, needs internet
node tools/video-audio/generate-audio.mjs docs/videos/NN-topic --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/NN-topic
#    Offline alternative: a Piper voice (python -m pip install piper-tts)
PIPER_MODEL=path/to/en-us-ryan-high.onnx node tools/video-audio/generate-audio.mjs docs/videos/NN-topic --engine piper

# 2. Video: check cues, look at the slides, then encode
node tools/video-build/build-video.mjs docs/videos/NN-topic --check
node tools/video-build/build-video.mjs docs/videos/NN-topic --slides-only
node tools/video-build/build-video.mjs docs/videos/NN-topic
```

The tools need Node 22, Python 3 with the speech engine, ffmpeg with libx264
and libass, and a Chromium (Playwright's, or `EDGE_PATH`). `FFMPEG_PATH` and
`PYTHON` override the defaults. Acronyms are spoken through
`tools/video-audio/pronunciations.json`; a folder can add its own
`pronunciations.json`.

### Slides

`slides.html` uses the shared `assets/slides.css` and `assets/slides.js`, which
read colour and type from `docs/design-system/tokens/tokens.css` by role. Every
slide after the first has a `data-cue` copied verbatim from `script.md`; it
appears when the narration reaches that phrase.
