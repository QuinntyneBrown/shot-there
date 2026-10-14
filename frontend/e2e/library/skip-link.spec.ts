import { expect, test } from '@playwright/test';
import { SkipLinkComponent } from '../components/skip-link.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('SkipLinkComponent (ICD-002 §9.3)', () => {
  test('is a link to #main named "Skip to content", parked above the screen until focused', async ({
    page,
  }) => {
    // Given the page with a skip link before main
    const harness = new HarnessPage(page);
    await harness.open('skip-link/default');
    const skip = new SkipLinkComponent(page);
    // Then it is a .skip-link to #main that sits above the viewport
    expect(await skip.classes()).toEqual(['skip-link']);
    await expect(skip.root).toHaveAttribute('href', '#main');
    expect(await skip.top()).toBeLessThan(0);
    expect(harness.errors).toEqual([]);
  });

  test('is the first tab stop, shows on focus, and activating it moves focus to main', async ({
    page,
  }) => {
    // Given the page just loaded
    const harness = new HarnessPage(page);
    await harness.open('skip-link/default');
    const skip = new SkipLinkComponent(page);
    // When the visitor presses Tab
    await page.keyboard.press('Tab');
    // Then the skip link has focus and is on screen
    await expect(skip.root).toBeFocused();
    expect(await skip.top()).toBeGreaterThanOrEqual(0);
    // When they activate it
    await page.keyboard.press('Enter');
    // Then focus is on the main landmark
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('takes its target and label from inputs', async ({ page }) => {
    // Given the default skip link
    const harness = new HarnessPage(page);
    await harness.open('skip-link/default');
    // Then the default label is the library string
    await expect(new SkipLinkComponent(page).root).toHaveText('Skip to content');
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('skip-link/default', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
