import { expect, test } from '@playwright/test';
import { AlertComponent } from '../components/alert.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('AlertComponent (ICD-002 §9.7, CRD alert)', () => {
  test('carries its tone class, role, title and a hidden icon', async ({ page }) => {
    // Given the stale-prices warning with the status role
    const harness = new HarnessPage(page);
    await harness.open('alert/states');
    const alert = new AlertComponent(page, 'Prices may be out of date');
    // Then it is .alert--warning with role=status, a title, and a decorative icon
    expect(await alert.classes()).toEqual(['alert', 'alert--warning']);
    await expect(alert.root).toHaveAttribute('role', 'status');
    await expect(alert.title()).toHaveText('Prices may be out of date');
    await expect(alert.root.locator('svg.icon')).toHaveAttribute('aria-hidden', 'true');
    expect(harness.errors).toEqual([]);
  });

  test('has no role by default and info tone by default', async ({ page }) => {
    // Given the plain info alert
    const harness = new HarnessPage(page);
    await harness.open('alert/states');
    const alert = new AlertComponent(page, 'You can compare up to 4 studios.');
    // Then it is .alert--info with no role and no title
    expect(await alert.classes()).toEqual(['alert', 'alert--info']);
    expect(await alert.root.getAttribute('role')).toBeNull();
    await expect(alert.title()).toHaveCount(0);
  });

  test('projects an action and announces a danger alert', async ({ page }) => {
    // Given the danger alert with a Try again action
    const harness = new HarnessPage(page);
    await harness.open('alert/states');
    const alert = new AlertComponent(page, 'We could not load the list');
    // Then it is role=alert and holds the action
    await expect(alert.root).toHaveAttribute('role', 'alert');
    await expect(alert.root.getByRole('button', { name: 'Try again' })).toBeVisible();
  });

  test('dismissible shows a named close button that reports dismissed', async ({ page }) => {
    // Given the dismissible success alert
    const harness = new HarnessPage(page);
    await harness.open('alert/states');
    const alert = new AlertComponent(page, 'Studio created as a draft');
    // When the owner presses Dismiss
    await alert.dismissButton().click();
    // Then the application hears it
    await expect.poll(() => harness.activations()).toEqual(['dismissed']);
  });

  test('banner adds the banner class', async ({ page }) => {
    // Given the banner
    const harness = new HarnessPage(page);
    await harness.open('alert/states');
    // Then it carries .banner
    expect(await new AlertComponent(page, 'Banner text.').classes()).toEqual([
      'alert',
      'alert--info',
      'banner',
    ]);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('alert/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
