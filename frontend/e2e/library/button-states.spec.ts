import { expect, test } from '@playwright/test';
import { ButtonComponent } from '../components/button.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('ButtonComponent: busy and soft-disabled (ICD-002 §9.1, ICD-FORM-8, DS button states)', () => {
  test('a busy submit button keeps its name, width and focus, shows the spinner and hides its label', async ({ page }) => {
    // Given the primary submit button "Save changes" in a form, not busy
    const harness = new HarnessPage(page);
    await harness.open('button/busy');
    const save = new ButtonComponent(page, 'Save changes');
    const idleWidth = (await save.size()).width;
    await save.root.focus();
    // When the application marks it busy
    await harness.toggle('Busy');
    // Then it is aria-busy and aria-disabled, still focusable, with the same name and width
    await expect(save.root).toHaveAttribute('aria-busy', 'true');
    await expect(save.root).toHaveAttribute('aria-disabled', 'true');
    expect((await save.size()).width).toBe(idleWidth);
    // And its label is hidden behind the turning spinner, without the disabled dimming
    expect(await save.labelColour()).toBe('rgba(0, 0, 0, 0)');
    expect(await save.showsSpinner()).toBe(true);
    expect(await save.opacity()).toBe(1);
    expect(harness.errors).toEqual([]);
  });

  test('a busy submit button ignores Enter, Space and click: no listener runs and the form does not submit', async ({ page }) => {
    // Given a busy "Save changes" submit button
    const harness = new HarnessPage(page);
    await harness.open('button/busy');
    await harness.toggle('Busy');
    const save = new ButtonComponent(page, 'Save changes');
    // When it is activated with Enter, Space and a click event
    await save.press('Enter');
    await save.press('Space');
    await save.activate();
    // Then neither the consumer's click listener nor the form's submit listener ran
    expect(await harness.activations()).toEqual([]);
  });

  test('activates again once it is no longer busy', async ({ page }) => {
    // Given a "Save changes" submit button that was busy
    const harness = new HarnessPage(page);
    await harness.open('button/busy');
    await harness.toggle('Busy');
    await harness.toggle('Busy');
    const save = new ButtonComponent(page, 'Save changes');
    // When it is activated
    await save.activate();
    // Then the click listener runs and the form submits, and busy attributes are gone
    expect(await harness.activations()).toEqual(['click: Save changes', 'submit']);
    await expect(save.root).not.toHaveAttribute('aria-busy');
    await expect(save.root).not.toHaveAttribute('aria-disabled');
  });

  test('a soft-disabled button stays in the tab order, looks disabled and swallows activation', async ({ page }) => {
    // Given the first row's small "Move up" button, soft-disabled
    const harness = new HarnessPage(page);
    await harness.open('button/soft-disabled');
    const moveUp = new ButtonComponent(page, 'Move up test shot 1');
    // When it is focused and activated with Enter, Space and a click event
    await page.keyboard.press('Tab');
    await expect(moveUp.root).toBeFocused();
    await moveUp.press('Enter');
    await moveUp.press('Space');
    await moveUp.activate();
    // Then it is aria-disabled at the DS disabled opacity, and no listener ran
    await expect(moveUp.root).toHaveAttribute('aria-disabled', 'true');
    expect(await moveUp.opacity()).toBe(0.5);
    expect(await harness.activations()).toEqual([]);
    // And the next row's "Move up" still works
    await new ButtonComponent(page, 'Move up test shot 2').activate();
    expect(await harness.activations()).toEqual(['click: Move up test shot 2']);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`busy and soft-disabled have no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given a busy button and a soft-disabled one in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        await harness.open('button/busy', { width, theme });
        await harness.toggle('Busy');
        // When axe scans each route
        const busy = await harness.accessibilityViolations();
        await harness.open('button/soft-disabled', { width, theme });
        // Then it finds no violations
        expect(busy).toEqual([]);
        expect(await harness.accessibilityViolations()).toEqual([]);
      });
    }
  }
});
