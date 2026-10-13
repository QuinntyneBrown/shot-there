import { expect, test } from '@playwright/test';
import { FallbackImageComponent } from '../components/fallback-image.component';

test.describe('FallbackImageDirective (ICD-MEDIA-3, L2-086.1)', () => {
  test('replaces a failed image with its alt text in the same box', async ({ page }) => {
    // Given a 320 x 200 image slot whose image fails to load
    const image = new FallbackImageComponent(page, 'The Junction Loft, cyc wall from the doorway');
    // When the page renders
    await page.goto('/fallback-image/broken');
    // Then the image is hidden and a placeholder shows its alt text in the same 320 x 200 box
    await expect(image.placeholder).toBeVisible();
    await expect(image.image).toBeHidden();
    expect(await image.placeholderSize()).toEqual({ width: 320, height: 200 });
  });
});
