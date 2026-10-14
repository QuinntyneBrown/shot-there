import { givenImageFails, givenStudio } from './fakes/fake-studios-api';
import { BLOORDALE_SUN_STUDIO, THE_JUNCTION_LOFT } from './fakes/studio-details';
import { expect, test } from './fakes/test';
import { StudioPage } from './pages/studio.page';

test.describe('Studio page: test shots and gallery', () => {
  test('shows the three standard test shots in order with alt text and the setup caption', async ({
    page,
  }) => {
    // Given a studio with three standard test shots
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    // When the visitor opens its page
    await studio.open('the-junction-loft');
    // Then they show in order, each with its alt text and caption, under the standard setup
    await expect(studio.testShotImages).toHaveCount(3);
    for (const [index, shot] of THE_JUNCTION_LOFT.testShots.entries()) {
      await expect(studio.testShotImages.nth(index)).toHaveAttribute('alt', shot.alt);
    }
    await expect(studio.testShots).toContainText('1 · Headshot');
    await expect(studio.testShots).toContainText('3 · Product on table');
    await expect(studio.testShots).toContainText('Same setup in every studio');
  });

  test('puts the test shots at the same place in every studio page', async ({ page }) => {
    // Given two published studios
    await givenStudio(page, THE_JUNCTION_LOFT);
    await givenStudio(page, BLOORDALE_SUN_STUDIO);
    const studio = new StudioPage(page);
    // When the visitor opens each page
    await studio.open('the-junction-loft');
    await expect(studio.testShots).toBeVisible();
    const first = await studio.sectionHeadings();
    await studio.open('bloordale-sun-studio');
    await expect(studio.testShots).toBeVisible();
    const second = await studio.sectionHeadings();
    // Then "Standard test shots" sits at the same position in both outlines
    expect(second.indexOf('Standard test shots')).toBe(first.indexOf('Standard test shots'));
  });

  test('lays the gallery out in 2, 3 and 4 columns as the window widens', async ({ page }) => {
    // Given a studio with eight gallery photos
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.useWidth(320);
    await studio.open('the-junction-loft');
    // Then there are eight thumbnails, two per row on a phone
    await expect(studio.thumbnails).toHaveCount(8);
    expect(await studio.galleryColumnCount()).toBe(2);
    // And three per row at MD, four at LG
    await studio.useWidth(800);
    await expect.poll(() => studio.galleryColumnCount()).toBe(3);
    await studio.useWidth(1280);
    await expect.poll(() => studio.galleryColumnCount()).toBe(4);
  });

  test('opens a photo in a lightbox and returns focus to its thumbnail on Escape', async ({
    page,
  }) => {
    // Given the gallery
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.open('the-junction-loft');
    // When the visitor activates the third thumbnail
    await studio.thumbnail(3).click();
    // Then a named lightbox shows that photo and takes focus
    await expect(studio.lightbox).toHaveAccessibleName('Photo viewer: The Junction Loft');
    await expect(studio.lightboxImage).toHaveAttribute('alt', THE_JUNCTION_LOFT.gallery[2].alt);
    await expect(studio.lightboxCount).toHaveText('Photo 3 of 8');
    await expect.poll(() => studio.focusIsInLightbox()).toBe(true);
    // When they press Escape
    await studio.pressKey('Escape');
    // Then the lightbox closes and focus returns to the thumbnail
    await expect(studio.lightbox).toBeHidden();
    await expect(studio.thumbnail(3)).toBeFocused();
  });

  test('wraps from the last photo to the first with Next, and back with Previous', async ({
    page,
  }) => {
    // Given the lightbox is open on the last photo
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.open('the-junction-loft');
    await studio.thumbnail(8).click();
    await expect(studio.lightboxCount).toHaveText('Photo 8 of 8');
    // When the visitor activates Next
    await studio.lightboxNext.click();
    // Then the first photo shows
    await expect(studio.lightboxCount).toHaveText('Photo 1 of 8');
    await expect(studio.lightboxImage).toHaveAttribute('alt', THE_JUNCTION_LOFT.gallery[0].alt);
    // When they activate Previous
    await studio.lightboxPrevious.click();
    // Then the last photo shows again
    await expect(studio.lightboxCount).toHaveText('Photo 8 of 8');
  });

  test('keeps keyboard focus inside the lightbox', async ({ page }) => {
    // Given the lightbox is open
    await givenStudio(page, THE_JUNCTION_LOFT);
    const studio = new StudioPage(page);
    await studio.open('the-junction-loft');
    await studio.thumbnail(1).click();
    await expect(studio.lightbox).toBeVisible();
    // When the visitor tabs through more controls than the lightbox has
    for (let i = 0; i < 6; i++) {
      await studio.pressKey('Tab');
      // Then focus never leaves it
      expect(await studio.focusIsInLightbox()).toBe(true);
    }
  });

  test('keeps the slot and shows the alt text when a photo fails to load', async ({ page }) => {
    // Given the second gallery photo cannot be loaded
    await givenStudio(page, THE_JUNCTION_LOFT);
    await givenImageFails(page, 'gallery-2-');
    const studio = new StudioPage(page);
    // When the visitor opens the page
    await studio.open('the-junction-loft');
    // Then the thumbnail shows the photo's description in a slot as tall as the others
    await expect(studio.thumbnail(2)).toContainText(THE_JUNCTION_LOFT.gallery[1].alt);
    const failed = await studio.thumbnail(2).boundingBox();
    const loaded = await studio.thumbnail(1).boundingBox();
    expect(Math.round(failed!.height)).toBe(Math.round(loaded!.height));
  });
});
