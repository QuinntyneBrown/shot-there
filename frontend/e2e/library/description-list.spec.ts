import { expect, test } from '@playwright/test';
import { DescriptionListComponent } from '../components/description-list.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('DescriptionListComponent (ICD-002 §9.4, CRD description-list)', () => {
  test('renders one dt and dd per fact, flat inside dl.kv', async ({ page }) => {
    // Given the pricing facts
    const harness = new HarnessPage(page);
    await harness.open('description-list/pricing');
    const list = new DescriptionListComponent(harness.example('Pricing'));
    // Then the terms read in order and every dt and dd is a direct child of the dl
    expect(await list.terms()).toEqual(['Hourly rate', 'Minimum booking', 'Cleaning fee', 'Light']);
    expect(await list.isFlat()).toBe(true);
    await expect(list.detail('Minimum booking')).toHaveText('2 hours');
    expect(harness.errors).toEqual([]);
  });

  test('wraps a numeric detail in span.num with tabular figures and puts a badge after it', async ({
    page,
  }) => {
    // Given a numeric fact with a badge
    const harness = new HarnessPage(page);
    await harness.open('description-list/pricing');
    const list = new DescriptionListComponent(harness.example('Pricing'));
    // Then "$25.00" is a .num span with tabular figures followed by the badge "Mandatory"
    await expect(list.numericPart('Cleaning fee')).toHaveText('$25.00');
    expect(await list.numericFeature('Cleaning fee')).toContain('tabular-nums');
    await expect(list.badge('Cleaning fee')).toHaveText('Mandatory');
    await expect(list.detail('Cleaning fee')).toHaveText('$25.00 Mandatory');
  });

  test('keeps a hidden suffix after the detail', async ({ page }) => {
    // Given the fact "Light" 5 with the suffix " out of 5"
    const harness = new HarnessPage(page);
    await harness.open('description-list/pricing');
    const list = new DescriptionListComponent(harness.example('Pricing'));
    // Then the suffix is visually hidden and read after the detail
    await expect(list.hiddenSuffix('Light')).toHaveText('out of 5');
    await expect(list.detail('Light')).toContainText('5');
  });

  test('renders nothing for an empty list', async ({ page }) => {
    // Given an empty list under "Costs extra"
    const harness = new HarnessPage(page);
    await harness.open('description-list/pricing');
    // Then there is no dl in that section
    await expect(new DescriptionListComponent(harness.example('Costs extra')).root).toHaveCount(0);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('description-list/pricing', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
