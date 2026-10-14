import { expect, test } from '@playwright/test';
import { FallbackImageComponent } from '../components/fallback-image.component';
import { HarnessPage } from '../pages/harness.page';

const EVERGREEN = 'Evergreen Brick Works: the kiln buildings from the Beltline';
const IMAGE_FAILED = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/>';

test.describe('FallbackImageDirective (ICD-MEDIA-3, L2-086.1)', () => {
  test('AC-18 a failed image is hidden and followed by the fallback with the icon and its alt text, in the same box', async ({ page }) => {
    // Given <img stFallbackImage alt="Evergreen Brick Works: …" width="1200" height="675"> whose URL fails, in a 320px slot
    const harness = new HarnessPage(page);
    // When the error fires
    await harness.open('fallback-image/broken');
    const image = new FallbackImageComponent(harness.example('informative'));
    // Then the image is not displayed and a .media-fallback follows it
    await expect(image.placeholder).toBeVisible();
    expect(await image.imageDisplay()).toBe('none');
    expect(await image.placeholderFollowsImage()).toBe(true);
    // And it holds the image-failed icon and the alt text in the image's 320 x 180 box
    expect(await image.placeholderIcon.drawing()).toBe(IMAGE_FAILED);
    await expect(image.placeholderText).toHaveText(EVERGREEN);
    expect(await image.placeholderSize()).toEqual({ width: 320, height: 180 });
    expect(harness.errors).toEqual([]);
  });

  test('AC-19 a failed image with alt="" shows the icon and no text', async ({ page }) => {
    // Given <img stFallbackImage alt=""> that fails
    const harness = new HarnessPage(page);
    // When the error fires
    await harness.open('fallback-image/broken');
    const image = new FallbackImageComponent(harness.example('decorative'));
    // Then the fallback shows the icon and no text
    await expect(image.placeholder).toBeVisible();
    expect(await image.placeholderIcon.drawing()).toBe(IMAGE_FAILED);
    await expect(image.placeholderText).toHaveCount(0);
  });

  test('replaces an image that failed before the page hydrated (ICD-SSR-1)', async ({ page }) => {
    // Given a server-rendered image slot whose image fails while the scripts are still loading
    const harness = new HarnessPage(page);
    // When the page hydrates a second later
    await harness.open('fallback-image/broken', { hydrationDelayMs: 1000 });
    // Then the image is still replaced by its alt text in the same box
    const image = new FallbackImageComponent(harness.example('informative'));
    await expect(image.placeholderText).toHaveText(EVERGREEN);
    expect(await image.placeholderSize()).toEqual({ width: 320, height: 180 });
  });
});
