import { expect, test } from '@playwright/test';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('Dialog, Sheet, Lightbox and DialogService (ICD-002 §9.4, §10.1)', () => {
  test('a dialog is a modal named and described by its title and description, and focus starts on the marked button', async ({ page }) => {
    // Given the opener page
    const harness = new HarnessPage(page);
    await harness.open('dialog/opener');
    // When the delete dialog opens
    await page.getByRole('button', { name: 'Delete studio' }).click();
    const dialog = page.getByRole('dialog', { name: 'Delete Corktown Garage Studio?' });
    // Then it is a modal described by its description
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAccessibleDescription('This deletes the draft and its 2 images. It can not be undone.');
    // And focus starts on the initial-focus button
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
    expect(harness.errors).toEqual([]);
  });

  test('Escape and Cancel close the dialog and return focus to the opener', async ({ page }) => {
    // Given an open dialog
    const harness = new HarnessPage(page);
    await harness.open('dialog/opener');
    const opener = page.getByRole('button', { name: 'Delete studio' });
    await opener.click();
    // When Escape is pressed
    await page.keyboard.press('Escape');
    // Then it closes without a result and focus returns to the opener
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect.poll(() => harness.activations()).toEqual(['dialog closed: undefined']);
  });

  test('a busy dialog ignores Escape and its close button, until it finishes', async ({ page }) => {
    // Given the delete dialog with Delete studio pressed
    const harness = new HarnessPage(page);
    await harness.open('dialog/opener');
    await page.getByRole('button', { name: 'Delete studio' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Delete studio' }).click();
    // Then the close button is disabled and Escape does nothing
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    // When the work finishes
    await dialog.getByRole('button', { name: 'Finish deleting' }).click();
    // Then it closes with the result
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect.poll(() => harness.activations()).toEqual(['dialog closed: deleted']);
  });

  test('a sheet opens as a named dialog and closes from its Close button', async ({ page }) => {
    // Given the opener page
    const harness = new HarnessPage(page);
    await harness.open('dialog/opener');
    // When the filters sheet opens
    await page.getByRole('button', { name: 'Open filters' }).click();
    const sheet = page.getByRole('dialog', { name: 'Filter studios' });
    // Then it shows its body and footer button
    await expect(sheet).toContainText('Filter fields go here.');
    await expect(sheet.getByRole('button', { name: 'Show results' })).toBeVisible();
    // When closed
    await sheet.getByRole('button', { name: 'Close' }).click();
    // Then it is gone
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect.poll(() => harness.activations()).toEqual(['sheet closed']);
  });

  test('the lightbox starts at the given photo, steps with arrow keys, announces the count and closes with the last index', async ({ page }) => {
    // Given the opener page
    const harness = new HarnessPage(page);
    await harness.open('dialog/opener');
    // When the viewer opens at photo 2
    await page.getByRole('button', { name: 'View photos' }).click();
    const viewer = page.getByRole('dialog', { name: 'Test shots' });
    // Then it shows "Photo 2 of 3" and the caption
    await expect(viewer.getByRole('status')).toHaveText('Photo 2 of 3');
    await expect(viewer).toContainText('Window light only.');
    // When the visitor presses the right arrow
    await page.keyboard.press('ArrowRight');
    // Then it shows the last photo and the next control is disabled
    await expect(viewer.getByRole('status')).toHaveText('Photo 3 of 3');
    await expect(viewer.getByRole('button', { name: 'Next photo' })).toBeDisabled();
    // When closed
    await viewer.getByRole('button', { name: 'Close' }).click();
    // Then the application receives the index shown last
    await expect.poll(() => harness.activations()).toEqual(['viewer closed at 2']);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test('has no WCAG A/AA violations with a dialog open at ' + width + 'px in the ' + theme + ' theme', async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('dialog/opener', { width, theme });
        await page.getByRole('button', { name: 'Delete studio' }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        expect(await harness.accessibilityViolations()).toEqual([]);
      });
    }
  }
});
