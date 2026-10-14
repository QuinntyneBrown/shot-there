import { expect, test } from '@playwright/test';
import { SegmentedControlComponent } from '../components/segmented-control.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('SegmentedControlComponent (ICD-002 §9.1, DS button-group)', () => {
  test('is a labelled group of toggle buttons with exactly the current value pressed', async ({ page }) => {
    // Given the map's "Show" control with the value "both"
    const harness = new HarnessPage(page);
    // When the default route opens
    await harness.open('segmented/default');
    // Then it is a .segmented group named "Show" whose "Both" button alone is pressed
    const show = new SegmentedControlComponent(page, 'Show');
    expect(await show.classes()).toEqual(['segmented']);
    expect(await show.pressedOptions()).toEqual(['Both']);
    await expect(show.option('Studios')).toHaveAttribute('aria-pressed', 'false');
    await expect(show.option('Spots')).toHaveAttribute('aria-pressed', 'false');
    // And every option is a 44px target
    expect((await show.optionSize('Spots')).height).toBe(44);
    expect(harness.errors).toEqual([]);
  });

  test('presses the chosen option, releases the other, keeps focus there and reports valueChange', async ({ page }) => {
    // Given the "Show" control on "Both"
    const harness = new HarnessPage(page);
    await harness.open('segmented/default');
    const show = new SegmentedControlComponent(page, 'Show');
    const width = (await show.optionSize('Studios')).width;
    // When the visitor clicks "Studios"
    await show.choose('Studios');
    // Then "Studios" alone is pressed, focus stays on it, and the application hears the new value
    await expect(show.option('Studios')).toHaveAttribute('aria-pressed', 'true');
    expect(await show.pressedOptions()).toEqual(['Studios']);
    await expect(show.option('Studios')).toBeFocused();
    await expect.poll(() => harness.activations()).toEqual(['valueChange: studios']);
    // And the semibold pressed label does not shift its width
    expect((await show.optionSize('Studios')).width).toBe(width);
  });

  test('presses options with Enter and Space, each option being its own tab stop', async ({ page }) => {
    // Given the "Show" control on "Both", focused on its first option
    const harness = new HarnessPage(page);
    await harness.open('segmented/default');
    const show = new SegmentedControlComponent(page, 'Show');
    await show.option('Both').focus();
    // When the visitor tabs to "Studios" and presses Space, then tabs to "Spots" and presses Enter
    await page.keyboard.press('Tab');
    await expect(show.option('Studios')).toBeFocused();
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await expect(show.option('Spots')).toBeFocused();
    await page.keyboard.press('Enter');
    // Then "Spots" is pressed and each change was reported
    expect(await show.pressedOptions()).toEqual(['Spots']);
    await expect.poll(() => harness.activations()).toEqual(['valueChange: studios', 'valueChange: spots']);
  });

  test('does nothing when the pressed option is pressed again', async ({ page }) => {
    // Given the "Show" control on "Both"
    const harness = new HarnessPage(page);
    await harness.open('segmented/default');
    const show = new SegmentedControlComponent(page, 'Show');
    // When the visitor presses "Both" again, then chooses "Spots"
    await show.choose('Both');
    await show.choose('Spots');
    // Then only the change to "Spots" was reported
    await expect.poll(() => harness.activations()).toEqual(['valueChange: spots']);
  });

  test('follows a value the application sets', async ({ page }) => {
    // Given the "Show" control on "Both"
    const harness = new HarnessPage(page);
    await harness.open('segmented/default');
    const show = new SegmentedControlComponent(page, 'Show');
    // When the application sets the value to "spots"
    await harness.toggle('Show spots only');
    // Then "Spots" alone is pressed
    await expect(show.option('Spots')).toHaveAttribute('aria-pressed', 'true');
    expect(await show.pressedOptions()).toEqual(['Spots']);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given the "Show" control in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans it
        await harness.open('segmented/default', { width, theme });
        // Then it finds no violations and nothing scrolls sideways
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
