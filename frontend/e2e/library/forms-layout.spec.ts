import { expect, test } from '@playwright/test';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('Form layout parts (ICD-002 §9.2)', () => {
  test('the error summary takes focus when errors appear and its items focus the fields', async ({ page }) => {
    // Given a form with no errors
    const harness = new HarnessPage(page);
    await harness.open('error-summary/states');
    await expect(page.getByRole('alert')).toHaveCount(0);
    // When the form fails
    await page.getByRole('button', { name: 'Fail the form' }).click();
    // Then the summary is an alert holding focus, titled by its heading
    const summary = page.getByRole('alert');
    await expect(summary).toBeFocused();
    await expect(summary).toHaveAccessibleName('Fix 2 things before saving');
    // When an item is activated
    await summary.getByRole('link', { name: 'Hourly rate: Enter an amount of 0 or more' }).click();
    // Then focus moves to that field
    await expect(page.getByLabel('Hourly rate')).toBeFocused();
    expect(harness.errors).toEqual([]);
  });

  test('form actions are sticky with the save status in each state as a polite status', async ({ page }) => {
    // Given the sticky actions
    const harness = new HarnessPage(page);
    await harness.open('form-actions/states');
    // Then the buttons come first and the saved status follows
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cancel' })).toBeVisible();
    const statuses = page.getByRole('status');
    await expect(statuses).toHaveText(['Saved 4:12 pm', 'Not saved. Fix the 6 things listed above.', 'Unsaved changes']);
    await expect(page.locator('.form-actions--sticky')).toHaveCSS('position', 'sticky');
  });

  for (const route of ['error-summary/states', 'form-actions/states']) {
    for (const theme of ['light', 'dark'] as HarnessTheme[]) {
      for (const width of [320, 1280]) {
        test(route + ' has no WCAG A/AA violations at ' + width + 'px in the ' + theme + ' theme', async ({ page }) => {
          const harness = new HarnessPage(page);
          await harness.open(route, { width, theme });
          expect(await harness.accessibilityViolations()).toEqual([]);
          expect(await harness.hasHorizontalScroll()).toBe(false);
        });
      }
    }
  }
});
