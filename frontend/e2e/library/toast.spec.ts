import { expect, test } from '@playwright/test';
import { ToastComponent } from '../components/toast.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('ToastRegionComponent and ToastService (ICD-002 §9.7, §10.2)', () => {
  test('the region is a polite status that is present and empty from the first render', async ({
    page,
  }) => {
    // Given the shell with no toasts raised
    const harness = new HarnessPage(page);
    await harness.open('toast/shell');
    const toast = new ToastComponent(page);
    // Then the live region exists, is polite and holds nothing
    await expect(toast.region).toHaveAttribute('role', 'status');
    await expect(toast.region).toHaveAttribute('aria-live', 'polite');
    await expect(toast.toasts()).toHaveCount(0);
    expect(harness.errors).toEqual([]);
  });

  test('a success toast shows title, text, a link action and a countdown, and dismisses from its button', async ({
    page,
  }) => {
    // Given the shell
    const harness = new HarnessPage(page);
    await harness.open('toast/shell');
    const toast = new ToastComponent(page);
    // When a success toast is raised
    await page.getByRole('button', { name: 'Raise success' }).click();
    // Then it shows its parts with the link action
    expect(await toast.classes('Studio is published')).toEqual(['toast', 'toast--success']);
    await expect(
      toast.toast('Studio is published').getByRole('link', { name: 'View public page' }),
    ).toHaveAttribute('href', '/studios/corktown');
    await expect(toast.toast('Studio is published').locator('.toast__progress')).toHaveCount(1);
    // When it is dismissed
    await toast.toast('Studio is published').getByRole('button', { name: 'Dismiss' }).click();
    // Then it is gone
    await expect(toast.toasts()).toHaveCount(0);
  });

  test('a danger toast is an alert with no countdown, and its action runs then dismisses it', async ({
    page,
  }) => {
    // Given the shell
    const harness = new HarnessPage(page);
    await harness.open('toast/shell');
    const toast = new ToastComponent(page);
    // When a failure toast is raised
    await page.getByRole('button', { name: 'Raise failure' }).click();
    // Then it is role=alert and has no timer bar
    await expect(toast.toast('Could not save')).toHaveAttribute('role', 'alert');
    await expect(toast.toast('Could not save').locator('.toast__progress')).toHaveCount(0);
    // When its action is activated
    await toast.toast('Could not save').getByRole('button', { name: 'Try again' }).click();
    // Then the action ran and the toast dismissed
    await expect.poll(() => harness.activations()).toEqual(['retry']);
    await expect(toast.toasts()).toHaveCount(0);
  });

  test('shows at most three toasts, newest last', async ({ page }) => {
    // Given the shell
    const harness = new HarnessPage(page);
    await harness.open('toast/shell');
    const toast = new ToastComponent(page);
    // When four toasts are raised
    for (const n of ['one', 'two', 'three', 'four']) {
      await page.getByRole('button', { name: 'Raise ' + n }).click();
    }
    // Then only the newest three show, in order
    await expect(toast.toasts()).toHaveCount(3);
    await expect(toast.toasts().first()).toContainText('Toast 2');
    await expect(toast.toasts().last()).toContainText('Toast 4');
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations with toasts at ${width}px in the ${theme} theme`, async ({
        page,
      }) => {
        const harness = new HarnessPage(page);
        await harness.open('toast/shell', { width, theme });
        await page.getByRole('button', { name: 'Raise success' }).click();
        await page.getByRole('button', { name: 'Raise failure' }).click();
        await expect(page.locator('.toast')).toHaveCount(2);
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
