import { expect, test } from '@playwright/test';
import { ButtonComponent } from '../components/button.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('ButtonComponent: busy, disabled, soft-disabled and pressed (CRD button, ICD-FORM-8, D-9)', () => {
  test('AC-7 a busy button keeps its name, width and focusability, shows the spinner and has no disabled attribute', async ({
    page,
  }) => {
    // Given the primary submit button "Save changes" in a form, not busy
    const harness = new HarnessPage(page);
    await harness.open('button/busy');
    const save = new ButtonComponent(page, 'Save changes');
    const idleWidth = (await save.size()).width;
    // When the application marks it busy
    await harness.toggle('Busy');
    // Then it is aria-busy and aria-disabled, not natively disabled, with the same name and width
    await expect(save.root).toHaveAttribute('aria-busy', 'true');
    await expect(save.root).toHaveAttribute('aria-disabled', 'true');
    await expect(save.root).not.toHaveAttribute('disabled');
    expect((await save.size()).width).toBe(idleWidth);
    // And its label is hidden behind the turning spinner, without the disabled dimming
    expect(await save.labelColour()).toBe('rgba(0, 0, 0, 0)');
    expect(await save.showsSpinner()).toBe(true);
    expect(await save.opacity()).toBe(1);
    expect(harness.errors).toEqual([]);
  });

  test('AC-8 a busy submit button ignores Enter, Space and click, and activates again once not busy', async ({
    page,
  }) => {
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

  test('AC-9 focus stays on the button while it goes busy and comes back', async ({ page }) => {
    // Given focus on "Save changes"
    const harness = new HarnessPage(page);
    await harness.open('button/busy');
    const save = new ButtonComponent(page, 'Save changes');
    await save.focus();
    // When busy becomes true and later false (the application's own control, not focus, drives it)
    await page.keyboard.press('b');
    await expect(save.root).toHaveAttribute('aria-busy', 'true');
    await expect(save.root).toBeFocused();
    await page.keyboard.press('b');
    // Then focus is still on "Save changes"
    await expect(save.root).not.toHaveAttribute('aria-busy');
    await expect(save.root).toBeFocused();
  });

  test('AC-10 a soft-disabled button stays in the tab order, looks disabled and swallows Enter', async ({
    page,
  }) => {
    // Given the first row's small "Move up test shot 1", soft-disabled
    const harness = new HarnessPage(page);
    await harness.open('button/soft-disabled');
    const moveUp = new ButtonComponent(page, 'Move up test shot 1');
    // When a keyboard user tabs to it and presses Enter, Space and a click event
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

  test('AC-11 a natively disabled ghost-danger "Delete studio" is skipped by Tab, unavailable and described by its hint', async ({
    page,
  }) => {
    // Given the published studio's disabled "Delete studio" with aria-describedby pointing at its hint
    const harness = new HarnessPage(page);
    await harness.open('button/disabled');
    const remove = new ButtonComponent(page, 'Delete studio');
    // When a keyboard user tabs through the status panel
    const stops = await harness.tabSequence(2);
    // Then the button is never focused, is disabled, and is described by "Unpublish before deleting."
    expect(stops).not.toContain('button Delete studio');
    await expect(remove.root).toBeDisabled();
    await expect(remove.root).toHaveAccessibleDescription('Unpublish before deleting.');
    expect(await remove.classes()).toEqual(['btn', 'btn--ghost-danger', 'btn--block']);
  });

  test('AC-12 the soft-disabled bar "Compare" is focusable, dimmed, described by its hint, and Enter does nothing', async ({
    page,
  }) => {
    // Given the compare bar's primary "Compare" with one studio selected
    const harness = new HarnessPage(page);
    await harness.open('button/soft-disabled');
    const compare = new ButtonComponent(page, 'Compare');
    // When a keyboard user reaches it and presses Enter
    await compare.press('Enter');
    // Then it has focus, aria-disabled at 50% opacity, the hint as its description, and no listener ran
    await expect(compare.root).toBeFocused();
    await expect(compare.root).toHaveAttribute('aria-disabled', 'true');
    expect(await compare.opacity()).toBe(0.5);
    await expect(compare.root).toHaveAccessibleDescription('Pick at least 2 studios to compare');
    await new ButtonComponent(page, 'Move up test shot 2').activate();
    await expect.poll(() => harness.activations()).toEqual(['click: Move up test shot 2']);
  });

  test('AC-4, AC-5 a toggle renders aria-pressed and .compare-toggle, with the accent tint, edge and label when pressed', async ({
    page,
  }) => {
    // Given the card toggle "Compare" with the hidden " Kensington Window Room", not pressed
    const harness = new HarnessPage(page);
    await harness.open('button/pressed');
    const compare = new ButtonComponent(page, 'Compare Kensington Window Room');
    await expect(compare.root).toHaveAttribute('aria-pressed', 'false');
    expect(await compare.isToggle()).toBe(true);
    // When the visitor activates "Add to compare" and the application sets pressed and the label
    await new ButtonComponent(page, 'Add to compare').click();
    await page.mouse.move(0, 0);
    // Then "Remove from compare" is a pressed .compare-toggle in the accent fill, edge and label
    const remove = new ButtonComponent(page, 'Remove from compare');
    await expect(remove.root).toHaveAttribute('aria-pressed', 'true');
    expect(await remove.isToggle()).toBe(true);
    const accent = {
      background: await harness.tokenColour('--color-accent-subtle'),
      text: await harness.tokenColour('--color-fg-accent'),
      border: await harness.tokenColour('--color-accent'),
    };
    await expect.poll(() => remove.colours()).toEqual(accent);
    expect(harness.errors).toEqual([]);
  });

  test('AC-14 Space and then Enter each flip the toggle once', async ({ page }) => {
    // Given focus on "Add to compare"
    const harness = new HarnessPage(page);
    await harness.open('button/pressed');
    await new ButtonComponent(page, 'Add to compare').focus();
    // When the visitor presses Space
    await page.keyboard.press('Space');
    // Then it is pressed
    const remove = new ButtonComponent(page, 'Remove from compare');
    await expect(remove.root).toHaveAttribute('aria-pressed', 'true');
    // When the visitor presses Enter
    await page.keyboard.press('Enter');
    // Then it is not pressed
    await expect(new ButtonComponent(page, 'Add to compare').root).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`busy and pressed have no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({
        page,
      }) => {
        // Given a busy button and a pressed toggle in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        await harness.open('button/busy', { width, theme });
        await harness.toggle('Busy');
        const busy = await harness.accessibilityViolations();
        await harness.open('button/pressed', { width, theme });
        await new ButtonComponent(page, 'Add to compare').click();
        await expect(new ButtonComponent(page, 'Remove from compare').root).toHaveAttribute(
          'aria-pressed',
          'true',
        );
        // When axe scans them
        // Then it finds no violations
        expect(busy).toEqual([]);
        expect(await harness.accessibilityViolations()).toEqual([]);
      });
    }
  }
});
