import { expect, test } from '@playwright/test';
import { VideoPosterComponent } from '../components/video-poster.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const PLAY = 'Play episode: Episode 4, The Junction Loft';
const TITLE = 'Episode 4: The Junction Loft — big north light, tiny elevator';
const WATCH_URL = 'https://www.youtube.com/watch?v=Jx7Lq2pT9aE';
const EMBED_URL = 'https://www.youtube-nocookie.com/embed/Jx7Lq2pT9aE';

test.describe('VideoPosterComponent (ICD-002 §9.8, §12, ICD-MEDIA-4, L2-047, L2-086.3)', () => {
  test('starts as a 16:9 link to the episode on YouTube with a decorative still and the play pill, and no player', async ({
    page,
  }) => {
    // Given an episode poster in a 320px column
    const harness = new HarnessPage(page);
    // When the default route opens
    await harness.open('video-poster/default');
    // Then it is a .video-poster link to the watch URL, named by the play label and the hidden episode context
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    await expect(video.poster).toHaveAttribute('href', WATCH_URL);
    await expect(video.poster).toHaveClass('video-poster');
    expect(await video.posterSize()).toEqual({ width: 320, height: 180 });
    // And the still is decorative and the pill carries the filled play glyph
    expect((await video.still.imageAttributes())['alt']).toBe('');
    expect(await video.playIcon.drawing()).toBe(
      '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
    );
    // And no YouTube player is on the page yet (L2-047.1)
    await expect(video.player).toHaveCount(0);
    expect(harness.errors).toEqual([]);
  });

  test('swaps in the player on click, focuses it and reports played, without leaving the page (L2-047.2)', async ({
    page,
  }) => {
    // Given the episode poster
    const harness = new HarnessPage(page);
    await harness.open('video-poster/default');
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    // When the visitor clicks it
    await video.click();
    // Then the poster is replaced by the .video-frame player titled with the episode, loading the embed URL
    await expect(video.player).toHaveAttribute('src', EMBED_URL);
    await expect(video.poster).toHaveCount(0);
    // And focus is in the player, played was reported once, and the page did not navigate
    await expect.poll(() => video.playerHasFocus()).toBe(true);
    await expect.poll(() => harness.activations()).toEqual(['played']);
    expect(new URL(page.url()).pathname).toBe('/video-poster/default');
  });

  test('swaps in the player with Enter', async ({ page }) => {
    // Given the episode poster
    const harness = new HarnessPage(page);
    await harness.open('video-poster/default');
    const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
    // When a keyboard user presses Enter on it
    await video.press('Enter');
    // Then the player replaces it and has focus
    await expect(video.player).toHaveAttribute('src', EMBED_URL);
    await expect.poll(() => video.playerHasFocus()).toBe(true);
  });

  test('keeps the play control usable, moved to the bottom, when the still fails (L2-086.3)', async ({
    page,
  }) => {
    // Given an episode poster whose still fails to load
    const harness = new HarnessPage(page);
    await harness.open('video-poster/failed');
    const video = new VideoPosterComponent(harness.example('failed'), PLAY, TITLE);
    // When the still has failed
    await expect(video.still.placeholder).toBeVisible();
    // Then the 16:9 link still plays the episode, with its pill at the bottom of the poster
    expect(await video.posterSize()).toEqual({ width: 320, height: 180 });
    expect((await video.playPosition()).centre).toBeGreaterThan(0.6);
    await video.click();
    await expect(video.player).toHaveAttribute('src', EMBED_URL);
  });

  test('keeps the play control usable with no poster, and uses an application playLabel', async ({
    page,
  }) => {
    // Given an episode with no poster whose application passes playLabel "Watch the episode" and no context
    const harness = new HarnessPage(page);
    await harness.open('video-poster/failed');
    const video = new VideoPosterComponent(
      harness.example('no poster'),
      'Watch the episode',
      TITLE,
    );
    // When it renders
    // Then the 16:9 link is named "Watch the episode", has no still, and plays the episode
    expect(await video.posterSize()).toEqual({ width: 320, height: 180 });
    await expect(video.still.picture).toHaveCount(0);
    await video.click();
    await expect(video.player).toHaveAttribute('src', EMBED_URL);
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the server-rendered poster is a plain link to the episode on YouTube (L2-047.3, ICD-SSR-3)', async ({
      page,
    }) => {
      // Given a browser with JavaScript off
      const harness = new HarnessPage(page);
      // When the default route is server-rendered
      await harness.open('video-poster/default');
      // Then the poster is a link to the watch URL and there is no player
      const video = new VideoPosterComponent(harness.example('default'), PLAY, TITLE);
      await expect(video.poster).toHaveAttribute('href', WATCH_URL);
      await expect(video.player).toHaveCount(0);
    });
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      for (const route of ['video-poster/default', 'video-poster/failed']) {
        test(`${route} has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({
          page,
        }) => {
          // Given ${route} in the ${theme} theme at ${width}px
          const harness = new HarnessPage(page);
          // When axe scans it
          await harness.open(route, { width, theme });
          // Then it finds no violations and nothing scrolls sideways
          expect(await harness.accessibilityViolations()).toEqual([]);
          expect(await harness.hasHorizontalScroll()).toBe(false);
        });
      }
    }
  }
});
