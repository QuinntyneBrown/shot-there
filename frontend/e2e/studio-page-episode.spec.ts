import { givenStudio } from './fakes/fake-studios-api';
import { BLOORDALE_SUN_STUDIO, THE_JUNCTION_LOFT } from './fakes/studio-details';
import { expect, test } from './fakes/test';
import { StudioPage } from './pages/studio.page';

const WATCH_URL = 'https://www.youtube.com/watch?v=Jx7Lq2pT9aE';

test.describe('Studio page: episode', () => {
  test('shows a poster that links to the episode, with no player until it is activated', async ({
    page,
  }) => {
    // Given a studio with a YouTube episode
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then "Watch the episode" shows a poster linking to YouTube, and no player is loaded yet
    await expect(studio.playEpisode).toHaveAccessibleName(
      'Play episode: Episode 4: The Junction Loft — big north light, tiny elevator',
    );
    await expect(studio.playEpisode).toHaveAttribute('href', WATCH_URL);
    await expect(studio.episodePlayer).toHaveCount(0);
    await expect(studio.watchOnYouTube).toHaveAttribute('href', WATCH_URL);
    await expect(studio.watchOnYouTube).toHaveAttribute('target', '_blank');
    await expect(studio.watchOnYouTube).toHaveAttribute('rel', 'noopener');
  });

  test('loads the privacy-enhanced player, without autoplay, when the poster is activated', async ({
    page,
  }) => {
    // Given the episode poster
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.open('the-junction-loft');
    // When the visitor activates it
    await studio.playEpisode.click();
    // Then a youtube-nocookie.com player named after the episode replaces it, without autoplay
    await expect(studio.episodePlayer).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/Jx7Lq2pT9aE',
    );
    await expect(studio.episodePlayer).toHaveAttribute(
      'title',
      'Episode 4: The Junction Loft — big north light, tiny elevator',
    );
    await expect(studio.playEpisode).toHaveCount(0);
    expect(page.url()).toContain('/studios/the-junction-loft');
  });

  test('leaves the episode section out when there is no video', async ({ page }) => {
    // Given a studio with no episode
    await givenStudio(page, BLOORDALE_SUN_STUDIO);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('bloordale-sun-studio');
    await expect(studio.heading).toBeVisible();
    // Then there is no video section or placeholder
    await expect(studio.episode).toHaveCount(0);
  });

  test('keeps the player 16:9 at the full content width on a phone', async ({ page }) => {
    // Given a studio with an episode on a phone
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.usePhoneWidth();
    await studio.open('the-junction-loft');
    // When the visitor plays it
    await studio.playEpisode.click();
    // Then the player is 16:9 and nothing scrolls sideways
    const box = (await studio.episodePlayer.boundingBox())!;
    expect(Math.abs(box.height - (box.width * 9) / 16)).toBeLessThan(1);
    expect(await studio.hasHorizontalScroll()).toBe(false);
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const width of [320, 1280]) {
      test(`has no accessibility violations at ${width}px in the ${theme} theme`, async ({
        page,
      }) => {
        const studio = new StudioPage(page);
        await studio.useTheme(theme);
        await studio.useWidth(width);
        await givenStudio(page, THE_JUNCTION_LOFT);
        await studio.open('the-junction-loft');

        expect(await studio.accessibilityViolations()).toEqual([]);
      });
    }
  }
});
