import { expect, test } from '@playwright/test';
import { BadgeComponent } from '../components/badge.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('BadgeComponent (ICD-002 §9.5, CRD badge)', () => {
  test('is a plain .badge by default and reads in place after its value', async ({ page }) => {
    // Given "$25.00 Mandatory"
    const harness = new HarnessPage(page);
    await harness.open('badge/tones');
    // Then the badge has only the block class and the line reads in order
    const badge = new BadgeComponent(page, 'Mandatory');
    expect(await badge.classes()).toEqual(['badge']);
    await expect(page.getByText('$25.00').first()).toContainText('$25.00 Mandatory');
    expect(harness.errors).toEqual([]);
  });

  test('carries a tone modifier for success, warning, info and danger', async ({ page }) => {
    // Given one badge per tone
    const harness = new HarnessPage(page);
    await harness.open('badge/tones');
    // Then each has its modifier
    expect(await new BadgeComponent(page, 'Not required').classes()).toEqual([
      'badge',
      'badge--success',
    ]);
    expect(await new BadgeComponent(page, 'Prices may be out of date').classes()).toEqual([
      'badge',
      'badge--warning',
    ]);
    expect(await new BadgeComponent(page, 'Due soon').classes()).toEqual(['badge', 'badge--info']);
    expect(await new BadgeComponent(page, 'Removed').classes()).toEqual(['badge', 'badge--danger']);
  });

  test('adds .badge--solid when solid, with a different fill from the soft badge', async ({
    page,
  }) => {
    // Given a soft and a solid success badge
    const harness = new HarnessPage(page);
    await harness.open('badge/tones');
    // Then the solid one carries the modifier and a stronger fill
    const solid = new BadgeComponent(page, 'Lowest');
    expect(await solid.classes()).toEqual(['badge', 'badge--success', 'badge--solid']);
    const soft = new BadgeComponent(page, 'Not required');
    expect((await solid.colours()).background).not.toBe((await soft.colours()).background);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('badge/tones', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
