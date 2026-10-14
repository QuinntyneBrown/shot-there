import { expect, test } from '@playwright/test';
import { VideoPosterComponent } from '../components/video-poster.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const PLAY = 'Play episode: Episode 4, The Junction Loft';
const TITLE = 'Episode 4: The Junction Loft — big north light, tiny elevator';
const WATCH_URL = 'https://www.youtube.com/watch?v=Jx7Lq2pT9aE';
const EMBED_URL = 'https://www.youtube-nocookie.com/embed/Jx7Lq2pT9aE';
const PLAY_GLYPH = '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>';
const THEMES: HarnessTheme[] = ['light', 'dark'];

test.describe('VideoPosterComponent (CRD video-poster, ICD-002 §9.8, §12, ICD-MEDIA-4)', () => {
  test('AC-1, AC-15 on load the poster links to YouTube with a lazy decorative still and the play pill, and no iframe exists', async ({
    page,
  }) => {
    // Given The Junction Loft's episode inputs
    const harness = new HarnessPage(page);
    // When the page first loads
    await harness.open('video-poster/default');
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    // Then a.video-poster links to the watch URL
    await expect(video.poster).toHaveAttribute('href', WATCH_URL);
    await expect(video.poster).toHaveClass('video-poster');
    // And the still has alt="", lazy loading and the CRD's sizes
    const still = await video.still.imageAttributes();
    expect([still['alt'], still['loading'], still['sizes']]).toEqual([
      '',
      'lazy',
      '(min-width: 62rem) 45rem, 100vw',
    ]);
    // And the pill holds the play glyph and "Play episode", and there is no player
    expect(await video.playIcon.drawing()).toBe(PLAY_GLYPH);
    expect(await video.playLabel()).toBe('Play episode');
    await expect(video.player).toHaveCount(0);
    expect(harness.errors).toEqual([]);
  });

  test('AC-2 nothing is requested from YouTube before activation', async ({ page }) => {
    // Given the network log
    const harness = new HarnessPage(page);
    const hosts: string[] = [];
    page.on('request', (request) => hosts.push(new URL(request.url()).hostname));
    // When the page has loaded and nothing is activated
    await harness.open('video-poster/default');
    await page.waitForLoadState('networkidle');
    // Then no request went to youtube.com, youtube-nocookie.com or ytimg.com
    expect(
      hosts.filter((host) => /youtube\.com|youtube-nocookie\.com|ytimg\.com/.test(host)),
    ).toEqual([]);
  });

  test('AC-3, AC-5 a click swaps in the 16:9 nocookie player with its title, full screen allowed and no autoplay, without navigating', async ({
    page,
  }) => {
    // Given the poster in a 320px column
    const harness = new HarnessPage(page);
    await harness.open('video-poster/default');
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    const slot = await video.posterSize();
    // When the visitor clicks it
    await video.click();
    // Then the link is replaced by iframe.video-frame on the nocookie origin with the episode title
    await expect(video.poster).toHaveCount(0);
    expect(await video.playerAttributes()).toEqual({
      src: EMBED_URL,
      title: TITLE,
      allow: 'accelerometer; encrypted-media; gyroscope; picture-in-picture',
      allowfullscreen: '',
      referrerpolicy: 'strict-origin-when-cross-origin',
    });
    expect(new URL(EMBED_URL).searchParams.has('autoplay')).toBe(false);
    // And the player fills the poster's 16:9 slot, and the page did not navigate
    expect(await video.playerSize()).toEqual(slot);
    expect(new URL(page.url()).pathname).toBe('/video-poster/default');
  });

  test('AC-10 Enter swaps in the player, moves focus into it and emits played once', async ({
    page,
  }) => {
    // Given focus on the poster
    const harness = new HarnessPage(page);
    await harness.open('video-poster/default');
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    // When the visitor presses Enter
    await video.press('Enter');
    // Then the player has focus and played was emitted once
    await expect(video.player).toHaveAttribute('src', EMBED_URL);
    await expect.poll(() => video.playerHasFocus()).toBe(true);
    await expect.poll(() => harness.activations()).toEqual(['played']);
  });

  test('D-3 a modified click opens YouTube in a new tab and leaves the poster as it is', async ({
    page,
  }) => {
    // Given the poster
    const harness = new HarnessPage(page);
    await harness.open('video-poster/default');
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    // When the visitor Ctrl-clicks it
    const [tab] = await Promise.all([
      page.context().waitForEvent('page'),
      video.click(['Control']),
    ]);
    // Then the watch URL opens in a new tab, the poster stays and played is not emitted
    await tab.waitForURL(WATCH_URL);
    await expect(video.poster).toBeVisible();
    await expect(video.player).toHaveCount(0);
    await new VideoPosterComponent(
      harness.example('no poster'),
      'Watch the episode',
      TITLE,
    ).click();
    await expect.poll(() => harness.activations()).toEqual(['played: no poster']);
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('AC-4 activating the server-rendered poster follows the link to YouTube', async ({
      page,
    }) => {
      // Given the page loaded with JavaScript disabled
      const harness = new HarnessPage(page);
      await harness.open('video-poster/default');
      const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
      // When the visitor activates the poster
      await video.click();
      // Then the browser follows the link to the watch URL
      await expect(page).toHaveURL(WATCH_URL);
    });
  });

  test('AC-6 the poster and then the player are 16:9 boxes filling the main column', async ({
    page,
  }) => {
    // Given Evergreen Brick Works' episode in a 45rem main column
    const harness = new HarnessPage(page);
    await harness.open('video-poster/column');
    const video = new VideoPosterComponent(
      harness.example('column'),
      'Play episode: Episode 7, Evergreen Brick Works',
      'Episode 7: Evergreen Brick Works at golden hour',
    );
    // When the poster renders, and then the player
    // Then each is 720 x 405
    expect(await video.posterSize()).toEqual({ width: 720, height: 405 });
    await video.click();
    await expect(video.player).toBeVisible();
    expect(await video.playerSize()).toEqual({ width: 720, height: 405 });
  });

  test('AC-7 a review without a video renders no poster, player or placeholder', async ({
    page,
  }) => {
    // Given Trinity Bellwoods Park, which has no video ID
    const harness = new HarnessPage(page);
    // When its section renders
    await harness.open('video-poster/no-video');
    // Then there is no poster and no player
    const video = new VideoPosterComponent(harness.example('no video'), PLAY, TITLE);
    await expect(video.poster).toHaveCount(0);
    await expect(video.player).toHaveCount(0);
  });

  for (const width of [1280, 320]) {
    test(`AC-8 at ${width}px a failed still gives way to the hidden title fallback, the pill drops to the bottom and still plays`, async ({
      page,
    }) => {
      // Given the still returning 404
      const harness = new HarnessPage(page);
      await harness.open('video-poster/failed', { width });
      const video = new VideoPosterComponent(harness.example('failed'), PLAY, TITLE);
      const before = await video.posterSize();
      // When the page renders
      // Then the fallback, hidden from assistive technology, shows the episode title in at most two lines, clear of the pill
      await expect(video.fallback).toHaveAttribute('aria-hidden', 'true');
      await expect(video.fallbackText).toHaveText(TITLE);
      const layout = await video.fallbackTextLayout();
      expect(layout.lines).toBeLessThanOrEqual(2);
      expect(layout.clearOfPill).toBe(true);
      // And the pill sits at the bottom, the slot keeps its size, and "Play episode" still inserts the player
      expect((await video.playPosition()).centre).toBeGreaterThan(0.6);
      expect(await video.posterSize()).toEqual(before);
      await video.click();
      await expect(video.player).toHaveAttribute('src', EMBED_URL);
    });
  }

  test('AC-9, AC-13 with no poster the same fallback shows and the link plays; playLabel replaces the library string', async ({
    page,
  }) => {
    // Given an episode with no poster and playLabel "Watch the episode", beside a poster with no playLabel
    const harness = new HarnessPage(page);
    await harness.open('video-poster/failed');
    const video = new VideoPosterComponent(
      harness.example('no poster'),
      'Watch the episode',
      TITLE,
    );
    // When it renders
    // Then the fallback shows the title and the pill reads "Watch the episode", while the default reads "Play episode"
    await expect(video.fallbackText).toHaveText(TITLE);
    expect(await video.playLabel()).toBe('Watch the episode');
    expect(await new VideoPosterComponent(harness.example('failed'), PLAY, TITLE).playLabel()).toBe(
      'Play episode',
    );
    // And the link plays the episode
    await video.click();
    await expect(video.player).toHaveAttribute('src', EMBED_URL);
  });

  test('AC-11 keyboard focus draws the 2px ring around the whole poster at 3:1 against the canvas', async ({
    page,
  }) => {
    // Given a keyboard user
    const harness = new HarnessPage(page);
    await harness.open('video-poster/default');
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    // When they tab to the poster
    await page.keyboard.press('Tab');
    await expect(video.poster).toBeFocused();
    // Then a solid 2px ring in --color-focus-ring surrounds it at 3:1
    expect(await video.focusRing()).toEqual({
      width: 2,
      style: 'solid',
      colour: await harness.tokenColour('--color-focus-ring'),
    });
    expect(await video.ringContrast()).toBeGreaterThanOrEqual(3);
  });

  test('AC-12 the link is named "Play episode: Episode 4, The Junction Loft" and the still and glyph add nothing', async ({
    page,
  }) => {
    // Given the poster with playContext ": Episode 4, The Junction Loft"
    const harness = new HarnessPage(page);
    // When the accessibility tree is read
    await harness.open('video-poster/default');
    // Then the link has exactly that name, and neither the still nor the glyph is in its accessibility tree
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    await expect(video.poster).toHaveAccessibleName(PLAY);
    expect(await video.ariaTree()).not.toContain('img');
  });

  for (const theme of THEMES) {
    test(`AC-14 the play label keeps 4.5:1 at rest, hovered and pressed, and the fallback title 4.5:1, in the ${theme} theme`, async ({
      page,
    }) => {
      // Given the poster and the failed poster
      const harness = new HarnessPage(page);
      await harness.open('video-poster/failed', { theme });
      const video = new VideoPosterComponent(harness.example('failed'), PLAY, TITLE);
      // When the contrast check runs
      // Then the label is at least 4.5:1 at rest, hovered and pressed, and the fallback title at least 4.5:1
      expect(await video.playContrast(), 'rest').toBeGreaterThanOrEqual(4.5);
      await video.hover();
      expect(await video.playContrast(), 'hover').toBeGreaterThanOrEqual(4.5);
      await video.pressDown();
      expect(await video.playContrast(), 'pressed').toBeGreaterThanOrEqual(4.5);
      await video.release();
      expect(await video.fallbackContrast(), 'fallback').toBeGreaterThanOrEqual(4.5);
    });

    for (const width of [320, 1280]) {
      test(`AC-12 axe finds no violations for the poster and the player at ${width}px in the ${theme} theme`, async ({
        page,
      }) => {
        // Given the poster, the failed poster and the player in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans them
        await harness.open('video-poster/failed', { width, theme });
        const failed = await harness.accessibilityViolations();
        await harness.open('video-poster/default', { width, theme });
        const poster = await harness.accessibilityViolations();
        await new VideoPosterComponent(harness.example('default'), PLAY, TITLE).click();
        await expect(
          new VideoPosterComponent(harness.example('default'), PLAY, TITLE).player,
        ).toBeVisible();
        // Then it reports no violations
        expect(failed).toEqual([]);
        expect(poster).toEqual([]);
        expect(await harness.accessibilityViolations()).toEqual([]);
      });
    }
  }

  test('AC-16, AC-17 at 320px the poster is 16:9 across the content width, the pill fits on one line, and the target is large', async ({
    page,
  }) => {
    // Given The Junction Loft's poster at 320px
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('video-poster/column', { width: 320 });
    const video = new VideoPosterComponent(
      harness.example('column'),
      'Play episode: Episode 7, Evergreen Brick Works',
      'Episode 7: Evergreen Brick Works at golden hour',
    );
    // Then it is 16:9, the pill fits on one line, the target is at least 44 x 44 and nothing scrolls sideways
    const size = await video.posterSize();
    expect(Math.abs(size.height - (size.width * 9) / 16)).toBeLessThanOrEqual(1);
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
    expect(await video.pillFits()).toBe(true);
    expect(await harness.hasHorizontalScroll()).toBe(false);
  });

  test('AC-18 at 200% zoom the poster is visible and operable with no sideways scroll', async ({
    page,
  }) => {
    // Given the episode in a 1280px window at 200% zoom (640 CSS px)
    const harness = new HarnessPage(page);
    await harness.open('video-poster/column', { width: 640 });
    const video = new VideoPosterComponent(
      harness.example('column'),
      'Play episode: Episode 7, Evergreen Brick Works',
      'Episode 7: Evergreen Brick Works at golden hour',
    );
    // When the visitor reaches it
    await video.poster.scrollIntoViewIfNeeded();
    // Then it is visible, nothing scrolls sideways, and it plays
    await expect(video.poster).toBeInViewport();
    expect(await harness.hasHorizontalScroll()).toBe(false);
    await video.click();
    await expect(video.player).toBeVisible();
  });

  test.describe('performance (L2-071)', () => {
    // Measured on a shared machine with the CPU slowed 4x: a retry absorbs contention from parallel
    // workers, while a real regression fails every attempt.
    test.describe.configure({ retries: 2 });

    test('AC-19 activating the poster stays within the 200ms INP budget and CLS stays at most 0.1', async ({
      page,
    }) => {
      // Given the video-poster/performance route on a mobile profile
      const harness = new HarnessPage(page);
      const load = await harness.loadMetrics('video-poster/performance');
      const video = new VideoPosterComponent(
        harness.example('column'),
        'Play episode: Episode 7, Evergreen Brick Works',
        'Episode 7: Evergreen Brick Works at golden hour',
      );
      // When the poster is activated
      const latency = await harness.interactionLatency(() => video.click());
      // Then the interaction paints within 200ms and nothing shifted, the activation included
      await expect(video.player).toBeVisible();
      expect(latency).toBeLessThanOrEqual(200);
      expect(load.cls).toBeLessThanOrEqual(0.1);
      expect(await harness.layoutShift()).toBeLessThanOrEqual(0.1);
    });
  });
});
