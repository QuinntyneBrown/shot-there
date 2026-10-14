import { expect, test } from '@playwright/test';
import { ButtonComponent } from '../components/button.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('ButtonComponent: busy, soft-disabled and pressed (ICD-002 §9.1, ICD-FORM-8, D-9, DS button states)', () => {
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

  test('a busy submit button ignores Enter, Space and click, and activates again once not busy', async ({ page }) => {
    // Given a busy "Save changes" submit button
    const harness = new HarnessPage(page);
    await harness.open('button/busy');
    await harness.toggle('Busy');
    const save = new ButtonComponent(page, 'Save changes');
    // When it is activated with Enter, Space and a click event, then made idle and activated once more
    await save.press('Enter');
    await save.press('Space');
    await save.activate();
    await harness.toggle('Busy');
    await expect(save.root).not.toHaveAttribute('aria-busy');
    await expect(save.root).not.toHaveAttribute('aria-disabled');
    await save.activate();
    // Then the click listener and the form's submit listener ran only for the last, idle activation
    await expect.poll(() => harness.activations()).toEqual(['click: Save changes', 'submit']);
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
    // Then it is aria-disabled at the DS disabled opacity
    await expect(moveUp.root).toHaveAttribute('aria-disabled', 'true');
    expect(await moveUp.opacity()).toBe(0.5);
    // And when the next row's "Move up" is activated, only that activation reaches a listener
    await new ButtonComponent(page, 'Move up test shot 2').activate();
    await expect.poll(() => harness.activations()).toEqual(['click: Move up test shot 2']);
  });

  test('renders aria-pressed only when pressed is set, and the DS selected look while pressed (D-9)', async ({ page }) => {
    // Given the small compare toggle for Kensington Window Room, not pressed, and a plain button
    const harness = new HarnessPage(page);
    await harness.open('button/pressed');
    const compare = new ButtonComponent(page, 'Compare Kensington Window Room');
    await expect(compare.root).toHaveAttribute('aria-pressed', 'false');
    await expect(new ButtonComponent(page, 'Apply filters').root).not.toHaveAttribute('aria-pressed');
    const idle = await compare.colours();
    // When the visitor activates it and the application sets pressed and flips the label
    await compare.click();
    // Then it is a pressed toggle named "Remove Kensington Window Room"
    const remove = new ButtonComponent(page, 'Remove Kensington Window Room');
    await expect(remove.root).toHaveAttribute('aria-pressed', 'true');
    // And it shows the accent tint, label and edge instead of the secondary look
    await page.mouse.move(0, 0);
    const pressed = await remove.colours();
    expect(pressed.background).not.toBe(idle.background);
    expect(pressed.text).not.toBe(idle.text);
    expect(pressed.border).not.toBe(idle.border);
    expect(harness.errors).toEqual([]);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`the pressed toggle has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given the compare toggle, pressed, in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        await harness.open('button/pressed', { width, theme });
        await new ButtonComponent(page, 'Compare Kensington Window Room').click();
        await expect(new ButtonComponent(page, 'Remove Kensington Window Room').root).toHaveAttribute('aria-pressed', 'true');
        // When axe scans it
        // Then it finds no violations
        expect(await harness.accessibilityViolations()).toEqual([]);
      });

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
