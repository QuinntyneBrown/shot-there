import { expect, test } from '@playwright/test';
import { FilterTriggerComponent } from '../components/filter-trigger.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('FilterTriggerComponent (ICD-002 §9.1, L2-022.6, DS filter)', () => {
  test('is a 44px pill button that announces a dialog, with a decorative filters icon and no count at 0', async ({ page }) => {
    // Given a filter trigger with no active filters
    const harness = new HarnessPage(page);
    // When the states route opens
    await harness.open('filter-trigger/states');
    // Then it is a button named "Filters" that opens a dialog, styled .filter-trigger, 44px tall
    const trigger = new FilterTriggerComponent(harness.example('none'), 'Filters');
    expect(await trigger.classes()).toEqual(['filter-trigger']);
    await expect(trigger.root).toHaveAttribute('aria-haspopup', 'dialog');
    expect(await trigger.height()).toBe(44);
    // And it leads with the filters icon, hidden from assistive technology, and shows no count
    await expect(trigger.icon.svg).toHaveAttribute('aria-hidden', 'true');
    expect(await trigger.icon.drawing()).toContain('M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0');
    await expect(trigger.count).toHaveCount(0);
    expect(harness.errors).toEqual([]);
  });

  test('shows the active count in a badge that joins its accessible name', async ({ page }) => {
    // Given a filter trigger with 2 active filters
    const harness = new HarnessPage(page);
    // When the states route opens
    await harness.open('filter-trigger/states');
    // Then the badge shows 2 and the trigger is named "Filters 2"
    const trigger = new FilterTriggerComponent(harness.example('count'), 'Filters 2');
    await expect(trigger.count).toHaveText('2');
    await expect(trigger.root).toBeVisible();
  });

  test('activates with a click and Enter, and shows the ink edge while its dialog is open', async ({ page }) => {
    // Given a filter trigger whose application toggles aria-expanded when activated
    const harness = new HarnessPage(page);
    await harness.open('filter-trigger/states');
    const trigger = new FilterTriggerComponent(harness.example('none'), 'Filters');
    expect(await trigger.hasOpenEdge()).toBe(false);
    // When it is clicked
    await trigger.click();
    // Then the listener ran, the trigger is expanded and it draws the ink edge
    await expect(trigger.root).toHaveAttribute('aria-expanded', 'true');
    expect(await trigger.hasOpenEdge()).toBe(true);
    // And Enter activates it too
    await trigger.press('Enter');
    await expect.poll(() => harness.activations()).toEqual(['click: Filters', 'click: Filters']);
  });

  test('dims when natively disabled', async ({ page }) => {
    // Given a disabled filter trigger
    const harness = new HarnessPage(page);
    // When the states route opens
    await harness.open('filter-trigger/states');
    // Then it is disabled at the DS 50% opacity
    const trigger = new FilterTriggerComponent(harness.example('disabled'), 'Filters');
    await expect(trigger.root).toBeDisabled();
    expect(await trigger.opacity()).toBe(0.5);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given every filter trigger state in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans it
        await harness.open('filter-trigger/states', { width, theme });
        // Then it finds no violations and nothing scrolls sideways
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
