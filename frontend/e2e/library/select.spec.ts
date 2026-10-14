import { expect, test } from '@playwright/test';
import { FieldComponent } from '../components/field.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('SelectComponent (ICD-002 §9.2)', () => {
  test('shows the bound option, reports a new choice and is inline when asked', async ({
    page,
  }) => {
    // Given the inline "Sort by" select bound to "recent"
    const harness = new HarnessPage(page);
    await harness.open('select/states');
    const sort = new FieldComponent(page, 'Sort by', 'combobox');
    // Then it is a .select showing "Most recent review"
    await expect(sort.input).toHaveClass('select');
    await expect(sort.input).toHaveValue('recent');
    // When the visitor chooses another option
    await sort.input.selectOption('cost');
    // Then the new value is reported
    await expect(sort.value('Sort')).toHaveText('cost');
    expect(harness.errors).toEqual([]);
  });

  test('flags an error with aria-invalid and a described message', async ({ page }) => {
    // Given the "Type" select with an error
    const harness = new HarnessPage(page);
    await harness.open('select/states');
    const type = new FieldComponent(page, 'Type', 'combobox');
    // Then it is invalid and described by the error
    await expect(type.input).toHaveAttribute('aria-invalid', 'true');
    expect(await type.description()).toEqual(['Choose a type']);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('select/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
