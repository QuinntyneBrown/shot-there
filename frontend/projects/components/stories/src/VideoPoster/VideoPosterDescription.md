An episode poster: `st-video-poster` renders a 16:9 `a.video-poster` linking to the episode on YouTube (so it works without JavaScript), with a decorative `st-responsive-image` still and a solid "Play episode" pill (`.video-poster__play`). Activating it prevents the navigation, swaps in an `iframe.video-frame` from `youtube-nocookie.com` in the same slot, moves focus to it and emits `played`.

The host adds no box (`display: contents`). The application builds both URLs and passes `embedUrl` as a trusted `SafeResourceUrl`; the iframe is named by `title`.
