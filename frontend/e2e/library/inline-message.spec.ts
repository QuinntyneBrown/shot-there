import { expect, test } from '@playwright/test';
import { InlineMessageComponent } from '../components/inline-message.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('InlineMessageComponent (ICD-002 §9.7, CRD inline-message)', () => {
  test('is help by default and keeps the id the consumer writes', async ({ page }) => {
    // Given help text with an id
    const harness = new HarnessPage(page);
    await harness.open('inline-message/states');
    // Then it is .field__help and keeps its id
    const help = new InlineMessageComponent(page, 'The preview moves as you type.');
    expect(await help.classes()).toEqual(['field__help']);
    await expect(help.root).toHaveAttribute('id', 'map-help');
    expect(harness.errors).toEqual([]);
  });

  test('is .field__error in the danger colour and keeps the role the consumer writes', async ({
    page,
  }) => {
    // Given an error message with role=alert
    const harness = new HarnessPage(page);
    await harness.open('inline-message/states');
    // Then it is announced as an alert, styled as an error and differs from help
    const error = new InlineMessageComponent(page, 'gallery-04.jpg');
    expect(await error.classes()).toEqual(['field__error']);
    await expect(page.getByRole('alert')).toHaveText(
      "gallery-04.jpg didn't upload. Check your connection.",
    );
    expect(await error.colour()).not.toBe(
      await new InlineMessageComponent(page, 'The preview').colour(),
    );
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('inline-message/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
