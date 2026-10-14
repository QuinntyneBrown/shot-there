import { expect, test } from '@playwright/test';
import { FieldComponent } from '../components/field.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('TextFieldComponent (ICD-002 §9.2, CRD text-field)', () => {
  test('renders a labelled input with its help, wired by for and aria-describedby, and reports typing', async ({ page }) => {
    // Given a text field "Name" with help, bound to a form control holding "Junction"
    const harness = new HarnessPage(page);
    await harness.open('text-field/states');
    const name = new FieldComponent(page, 'Name');
    // Then the input has the class, id and autocomplete off, its value and the help as its description
    await expect(name.input).toHaveClass('input');
    await expect(name.input).toHaveAttribute('id', 'name');
    await expect(name.input).toHaveAttribute('autocomplete', 'off');
    await expect(name.input).toHaveValue('Junction');
    expect(await name.description()).toEqual(['Shown on the card.']);
    // When the owner types
    await name.input.fill('Junction Loft');
    // Then the value is reported on each keystroke
    await expect(name.value('Name')).toHaveText('Junction Loft');
    expect(harness.errors).toEqual([]);
  });

  test('puts a prefix in an input group, outside the accessible name, and reports a string', async ({ page }) => {
    // Given the prefixed hourly rate
    const harness = new HarnessPage(page);
    await harness.open('text-field/states');
    const rate = new FieldComponent(page, 'Hourly rate', 'spinbutton');
    // Then the addon is hidden from assistive technology and the value never holds the prefix
    await expect(page.locator('.input-group .addon')).toHaveAttribute('aria-hidden', 'true');
    await rate.input.fill('65.00');
    await expect(rate.value('Rate')).toHaveText('65.00');
    await rate.input.fill('');
    await expect(rate.value('Rate')).toHaveText('');
  });

  test('shows an error first, flags aria-invalid and removes both when cleared', async ({ page }) => {
    // Given the rate field
    const harness = new HarnessPage(page);
    await harness.open('text-field/states');
    const rate = new FieldComponent(page, 'Hourly rate', 'spinbutton');
    // When the application sets an error
    await page.getByRole('button', { name: 'Fail rate' }).click();
    // Then the input is invalid and described by the error
    await expect(rate.input).toHaveAttribute('aria-invalid', 'true');
    expect(await rate.description()).toEqual(['Enter an amount of 0 or more']);
    // When it is cleared
    await page.getByRole('button', { name: 'Clear rate error' }).click();
    // Then aria-invalid and the message are gone
    await expect(rate.input).not.toHaveAttribute('aria-invalid', 'true');
    expect(await rate.messages()).toEqual([]);
  });

  test('toggles the password between hidden and shown with a named pressed button', async ({ page }) => {
    // Given the large password field
    const harness = new HarnessPage(page);
    await harness.open('text-field/states');
    const password = page.getByLabel('Password', { exact: true });
    const toggle = page.getByRole('button', { name: 'Show password' });
    // Then it is concealed and the toggle is not pressed
    await expect(password).toHaveAttribute('type', 'password');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    // When the owner presses Space then Enter
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(password).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(password).toHaveAttribute('type', 'password');
    await expect(toggle).toBeFocused();
  });

  test('marks optional fields in the label and warning fields without aria-invalid', async ({ page }) => {
    // Given an optional field and a field with a warning
    const harness = new HarnessPage(page);
    await harness.open('text-field/states');
    // Then the optional marker is part of the name and the warning is described, not invalid
    await expect(page.getByRole('textbox', { name: 'Backdrops (optional)' })).toBeVisible();
    const verified = page.getByLabel('Prices last verified');
    await expect(verified).not.toHaveAttribute('aria-invalid', 'true');
    await expect(verified).toHaveAttribute('aria-describedby', 'verified-warning verified-help');
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('text-field/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
