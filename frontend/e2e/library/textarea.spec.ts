import { expect, test } from '@playwright/test';
import { FieldComponent } from '../components/field.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('TextareaComponent (ICD-002 §9.2, CRD textarea)', () => {
  test('renders rows, error then help as its description', async ({ page }) => {
    // Given the verdict textarea with an error and help
    const harness = new HarnessPage(page);
    await harness.open('textarea/states');
    const verdict = new FieldComponent(page, 'Who it is for');
    // Then it has 3 rows, is invalid, and is described by the error then the help
    await expect(verdict.input).toHaveClass('textarea');
    await expect(verdict.input).toHaveAttribute('rows', '3');
    await expect(verdict.input).toHaveAttribute('aria-invalid', 'true');
    expect(await verdict.description()).toEqual(['Write who this studio is for', 'Visitors read this first.']);
    expect(harness.errors).toEqual([]);
  });

  test('counts characters against maxlength and flags the over-limit state without truncating', async ({ page }) => {
    // Given a textarea limited to 20 characters
    const harness = new HarnessPage(page);
    await harness.open('textarea/states');
    const intro = new FieldComponent(page, 'Introduction');
    // Then the counter starts at zero and is part of the description
    await expect(page.locator('.field__counter')).toHaveText('0 of 20 characters');
    // When the owner types 25 characters
    await intro.input.fill('abcdefghijklmnopqrstuvwxy');
    // Then the counter says so, is over the limit, and nothing was cut
    await expect(page.locator('.field__counter')).toHaveText('25 of 20 characters');
    await expect(page.locator('.field__counter--over')).toHaveCount(1);
    await expect(intro.input).toHaveValue('abcdefghijklmnopqrstuvwxy');
    expect(await intro.description()).toEqual(['25 of 20 characters']);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('textarea/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
