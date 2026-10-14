import { expect, test } from '@playwright/test';
import { ResultCountComponent } from '../components/result-count.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('ResultCountComponent (ICD-002 §9.5, CRD filter)', () => {
  test('is a polite status carrying the text and a visually hidden suffix', async ({ page }) => {
    // Given "7 studios" with the suffix ", sorted by all-in cost"
    const harness = new HarnessPage(page);
    await harness.open('result-count/default');
    const count = new ResultCountComponent(page);
    // Then it is role=status, aria-live=polite, and reads text then suffix
    await expect(count.root).toHaveAttribute('role', 'status');
    await expect(count.root).toHaveAttribute('aria-live', 'polite');
    await expect(count.root).toHaveText('7 studios, sorted by all-in cost');
    await expect(count.suffix()).toHaveText(', sorted by all-in cost');
    expect(harness.errors).toEqual([]);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('result-count/default', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
