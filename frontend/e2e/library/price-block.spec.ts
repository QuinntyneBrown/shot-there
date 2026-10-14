import { expect, test } from '@playwright/test';
import { PriceBlockComponent } from '../components/price-block.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('PriceBlockComponent (ICD-002 §9.5, CRD price-block)', () => {
  test('shows the all-in figure, its explanation, the facts and the verified date in order', async ({ page }) => {
    // Given The Junction Loft pricing
    const harness = new HarnessPage(page);
    await harness.open('price-block/states');
    const block = new PriceBlockComponent(page);
    // Then the all-in figure and its explanation come first, then the facts, then the verified line
    await expect(block.allIn()).toHaveText('$145.00');
    await expect(block.allInText()).toContainText('All-in for a standard 2-hour shoot');
    expect(await block.facts.terms()).toEqual(['Hourly rate', 'Minimum booking', 'Cleaning fee']);
    await expect(block.verified()).toHaveText('Prices verified 22 September 2026');
    expect(await block.isStackedInOrder(block.allIn(), block.facts.root, block.verified(), page.getByRole('status'))).toBe(true);
    expect(harness.errors).toEqual([]);
  });

  test('renders the verified date as a time element with its machine-readable value', async ({ page }) => {
    // Given the verified date
    const harness = new HarnessPage(page);
    await harness.open('price-block/states');
    // Then it is a time element carrying the ISO date
    await expect(new PriceBlockComponent(page).verifiedDate()).toHaveAttribute('datetime', '2026-09-22');
  });

  test('renders the projected stale notice after the verified line', async ({ page }) => {
    // Given a projected status paragraph
    const harness = new HarnessPage(page);
    await harness.open('price-block/states');
    // Then it comes last in the block
    await expect(page.getByRole('status')).toHaveText('Prices may be out of date');
    const block = new PriceBlockComponent(page);
    expect(await block.isStackedInOrder(block.verified(), page.getByRole('status'))).toBe(true);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('price-block/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
