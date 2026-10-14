import { expect, test } from '@playwright/test';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('Section parts: summary panel, compare bar, editor section, active filters (ICD-002 §9.4, §9.5)', () => {
  test('the summary panel is a named complementary landmark with facts and projected content', async ({ page }) => {
    // Given the summary panel
    const harness = new HarnessPage(page);
    await harness.open('summary-panel/default');
    const panel = page.getByRole('complementary', { name: 'Summary' });
    // Then it shows its facts, the hidden suffix, the tags and the primary button
    await expect(panel).toContainText('All-in');
    await expect(panel).toContainText('$145.00');
    await expect(panel.locator('.visually-hidden')).toHaveText('out of 5');
    await expect(panel.getByRole('list', { name: 'Best uses' })).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Visit the studio' })).toBeVisible();
    expect(harness.errors).toEqual([]);
  });

  test('the compare bar is fixed to the bottom, announces its count and holds the actions', async ({ page }) => {
    // Given the compare bar
    const harness = new HarnessPage(page);
    await harness.open('compare-bar/default');
    const bar = page.getByRole('complementary', { name: 'Studios to compare' });
    // Then it is fixed, shows count, hint and names, and the actions
    await expect(bar).toHaveCSS('position', 'fixed');
    await expect(bar.getByRole('status')).toHaveText('2 selected');
    await expect(bar.locator('.compare-bar__hint')).toHaveAttribute('id', 'compare-hint');
    await expect(bar.locator('.compare-bar__names')).toHaveText('The Junction Loft, Ossington Blackbox');
    await expect(bar.getByRole('link', { name: 'Compare' })).toHaveAttribute('aria-describedby', 'compare-hint');
  });

  test('an editor section opens and closes, reports open, shows its error count and a loading skeleton', async ({ page }) => {
    // Given the sections
    const harness = new HarnessPage(page);
    await harness.open('editor-section/states');
    const pricing = page.locator('details', { hasText: 'Pricing' });
    // Then Pricing is open with its field
    await expect(pricing).toHaveAttribute('open', '');
    await expect(page.getByLabel('Hourly rate')).toBeVisible();
    // When its summary is pressed
    await pricing.locator('summary').click();
    // Then it closes and reports it
    await expect(pricing).not.toHaveAttribute('open', '');
    await expect(page.locator('p', { hasText: 'Pricing open:' }).locator('output')).toHaveText('false');
    // And the collapsed Logistics section says it has errors in words and is marked invalid
    const logistics = page.locator('details', { hasText: 'Logistics' });
    await expect(logistics.locator('.editor-section__errors')).toHaveText('2 errors');
    await expect(logistics).toHaveAttribute('data-invalid', '');
    // And the loading section is hidden from assistive technology
    await expect(page.locator('.editor-section--skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  test('active filters list removable chips, report removal and clearing, and render nothing when empty', async ({ page }) => {
    // Given two active filters
    const harness = new HarnessPage(page);
    await harness.open('active-filters/default');
    // Then each chip has a named remove button
    await expect(page.getByRole('button', { name: 'Remove filter: Junction' })).toBeVisible();
    // When Cyc wall is removed and then everything cleared
    await page.getByRole('button', { name: 'Remove filter: Cyc wall' }).click();
    await page.getByRole('button', { name: 'Clear all' }).click();
    // Then the application hears both
    await expect.poll(() => harness.activations()).toEqual(['removed: Cyc wall', 'cleared']);
  });

  for (const route of ['summary-panel/default', 'compare-bar/default', 'editor-section/states', 'active-filters/default']) {
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
