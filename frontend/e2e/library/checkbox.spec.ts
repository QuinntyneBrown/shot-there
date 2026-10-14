import { expect, test } from '@playwright/test';
import { FieldComponent } from '../components/field.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('Checkbox, CheckboxGroup and RadioGroup (ICD-002 §9.2, CRDs checkbox and radio-group)', () => {
  test('a single checkbox reports true and false and is described by its help', async ({ page }) => {
    // Given the "20 A circuits available" checkbox with help
    const harness = new HarnessPage(page);
    await harness.open('checkbox/states');
    const box = new FieldComponent(page, '20 A circuits available', 'checkbox');
    // Then it starts unchecked, described by its help
    await expect(box.input).not.toBeChecked();
    expect(await box.description()).toEqual(['Needed for strobes.']);
    // When the owner ticks it
    await box.input.check();
    // Then true is reported
    await expect(box.value('20A')).toHaveText('true');
    expect(harness.errors).toEqual([]);
  });

  test('a checkbox group is a named fieldset whose value follows option order', async ({ page }) => {
    // Given the Neighbourhood filter group
    const harness = new HarnessPage(page);
    await harness.open('checkbox/states');
    const group = page.getByRole('group', { name: 'Neighbourhood', exact: true });
    // When Leslieville then Junction are ticked
    await group.getByRole('checkbox', { name: 'Leslieville' }).check();
    await group.getByRole('checkbox', { name: 'Junction' }).check();
    // Then the value lists them in option order
    await expect(page.locator('p', { hasText: 'Hood value:' }).locator('output')).toHaveText('junction,leslieville');
    // And the first box takes the inputId and the next the suffixed id
    await expect(group.getByRole('checkbox', { name: 'Bloordale' })).toHaveAttribute('id', 'hood');
    await expect(group.getByRole('checkbox', { name: 'Junction' })).toHaveAttribute('id', 'hood-2');
  });

  test('a group error is described on the fieldset and flags every box invalid', async ({ page }) => {
    // Given the "Best for" group with an error and help
    const harness = new HarnessPage(page);
    await harness.open('checkbox/states');
    const group = page.getByRole('group', { name: 'Best for', exact: true });
    // Then the fieldset is described by the error then the help and each box is invalid
    await expect(group).toHaveAccessibleDescription('Choose at least one best use Choose one before publishing.');
    await expect(group.getByRole('checkbox').first()).toHaveAttribute('aria-invalid', 'true');
  });

  test('a radio group selects one value and arrow keys move the selection', async ({ page }) => {
    // Given the Parking radio group on "Any"
    const harness = new HarnessPage(page);
    await harness.open('checkbox/states');
    const group = page.getByRole('group', { name: 'Parking', exact: true });
    await group.getByRole('radio', { name: 'Any' }).check();
    await group.getByRole('radio', { name: 'Any' }).focus();
    // When the visitor presses ArrowDown
    await page.keyboard.press('ArrowDown');
    // Then On-site is chosen and reported
    await expect(group.getByRole('radio', { name: 'On-site' })).toBeChecked();
    await expect(page.locator('p', { hasText: 'Parking value:' }).locator('output')).toHaveText('on-site');
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('checkbox/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
