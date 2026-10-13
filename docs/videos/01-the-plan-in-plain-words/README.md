# 01 · The plan, in plain words

> **Runtime:** ~6:11 · **Audience:** the founder's family, friends, collaborators and anyone who asks how a free review site makes money · **Prerequisites:** none

**Video:** [01-the-plan-in-plain-words.mp4](01-the-plan-in-plain-words.mp4) · [Slides](slides.html) · **Audio:** [01-the-plan-in-plain-words.mp3](01-the-plan-in-plain-words.mp3) · [Transcript](script.md)

## Why this video exists

The business plan in [`docs/plans/business-plan.md`](../../plans/business-plan.md)
is written for someone who reads forecasts. This video explains it the way you
would to a five-year-old: one picture per idea, few words, no jargon. It covers
how a solo founder who is a photographer, a software architect, a salesperson
and a communicator, with AI carrying half of each hat, turns a free review site
into a business, and what three years of that might look like.

## Learning objectives

By the end, the viewer can:

- Say what ShotThere is and why it stays free to read.
- Name the four jars the money comes from and which pays first.
- Explain how one person runs it, and what AI does and never does.
- Give the three-year numbers and the careful case.
- Say why trust is the product and list what the founder never does.

## Key questions

| Question | What a strong answer includes |
|---|---|
| How does a free review site make money? | Four jars: the channel (ads, sponsors, affiliates, $5 members), the camera (client sessions, fixed-price studio media, workshops), the maps ($15 shoot maps, the studio report, scouting) and the computer (city licence at $800 a month, data licensing, $19 spec-sheet widget) (plan, "Revenue streams") |
| Which jar pays first? | The camera in year one (~$47K at half time); the channel, maps and computer are more than two thirds of ~$345K by year three (plan, "Financial forecast") |
| How does one person do it? | Four hats; AI drafts scripts, captions, pages and builds the site from requirements; AI never visits, measures or scores (plan, "Founder advantages", "Operations") |
| What happens in the first 90 days? | Launch on 15 January 2027 with ten studios, five spots and ten episodes; six targets at the review (plan, "90-day launch plan") |
| What is the biggest risk? | Trust: no jar buys a score; studio media is fixed-price, after publication, disclosed; dated data with a six-month stale flag (plan, "Risks and compliance") |

## Code / assets on screen

| File | What to show |
|---|---|
| `docs/plans/business-plan.md` | Every figure on screen |
| `docs/videos/assets/mark.svg` | The ShotThere mark on the title and end slides |

The pictures are inline SVG in `slides.html`, drawn with design-system colour
roles. There are no screen recordings: nothing in this video is the running app.

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 00:00-00:35 | Introduction | A map of every place to shoot, tested the same way; how does free pay? |
| 00:35-01:08 | The problem | 4,600 photographers, hundreds of studios, zero same-test reviews; owner photos and a star rating |
| 01:08-01:45 | One person, four hats | Photographer, architect, salesperson, communicator; AI carries half of each, never measures or scores |
| 01:45-03:35 | Four jars | The channel, the camera, the maps, the computer; the jars feed each other |
| 03:35-04:19 | Year by year | ~$47K, ~$174K, ~$345K; ~$17K costs; careful case ×0.5 |
| 04:19-05:01 | The first ninety days | Launch on 15 January 2027; ten studios, five spots, ten episodes; six targets |
| 05:01-05:40 | The rules | Trust is the product; the never list; dated data and the stale flag |
| 05:40-06:11 | Things to remember | Five-point recap; next, the 90-day review |

## Demo commands

```sh
node tools/video-audio/generate-audio.mjs docs/videos/01-the-plan-in-plain-words --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/01-the-plan-in-plain-words
node tools/video-build/build-video.mjs docs/videos/01-the-plan-in-plain-words --check
node tools/video-build/build-video.mjs docs/videos/01-the-plan-in-plain-words --slides-only
node tools/video-build/build-video.mjs docs/videos/01-the-plan-in-plain-words
```

The Edge read-aloud service refused connections from the build machine (HTTP
403, with edge-tts 7.2.8), so the published narration was synthesized offline
with the Kokoro `af_heart` voice through the generator's `piper` engine slot.
A small stand-in `piper` module ran Kokoro ONNX:

```sh
python -m pip install kokoro-onnx soundfile   # plus kokoro-v1.0.onnx and voices-v1.0.bin
PYTHONPATH=path/to/shim KOKORO_DIR=path/to/model PIPER_MODEL=af_heart \
  node tools/video-audio/generate-audio.mjs docs/videos/01-the-plan-in-plain-words --engine piper
```

The default Edge voice works just as well once the service answers.

## Pitfalls

- Every figure is the plan's, and the plan is approximate: year one assumes the founder is on ShotThere about half time, and the careful case is half of every number.
- The photographer count (about 4,580 in the Toronto region) is Job Bank's NOC 53110 profile, last updated November 2023.
- The narration says "the founder" rather than the name, so the voice never mispronounces it.
- Nothing here is a requirement. Any product change the plan implies (members, maps, the widget, the city licence, the data API) still needs L1/L2 requirements, a detailed design and mocks (`AGENTS.md`).

## References

- `docs/plans/business-plan.md` (every figure in the video)
- Job Bank, Photographer (NOC 53110) in the Toronto region: <https://www.jobbank.gc.ca/marketreport/outlook-occupation/5514/22437>
- Tagvenue, photo studios in Toronto (hourly rates): <https://www.tagvenue.com/ca/hire/cheap-photo-studios/toronto>
- Giggster, photo studios in Toronto: <https://giggster.com/find/toronto--on/photo-studio>
