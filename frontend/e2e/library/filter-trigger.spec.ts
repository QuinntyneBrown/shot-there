import { expect, test } from '@playwright/test';
import { FilterTriggerComponent } from '../components/filter-trigger.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const THEMES: HarnessTheme[] = ['light', 'dark'];
const FILTERS_ICON = 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0';

test.describe('FilterTriggerComponent (CRD filter: trigger, ICD-002 §9.1, §12)', () => {
  test('AC-1 with no active filters it is a native button.filter-trigger that opens a dialog, named "Filters", with no bubble', async ({ page }) => {
    // Given <button st-filter-trigger type="button" [count]="0">Filters</button> at 360px
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('filter-trigger/states', { width: 360 });
    const trigger = new FilterTriggerComponent(harness.example('none'), 'Filters');
    // Then it is a native button.filter-trigger with aria-haspopup="dialog", a decorative filters icon and no bubble
    expect(await trigger.tag()).toBe('button');
    expect(await trigger.classes()).toEqual(['filter-trigger']);
    await expect(trigger.root).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger.icon.svg).toHaveAttribute('aria-hidden', 'true');
    expect(await trigger.icon.drawing()).toContain(FILTERS_ICON);
    await expect(trigger.count).toHaveCount(0);
    expect(harness.errors).toEqual([]);
  });

  test('AC-2 with two active filters the bubble shows "2" and the name is "Filters, 2 active"', async ({ page }) => {
    // Given count 2
    const harness = new HarnessPage(page);
    // When the trigger renders
    await harness.open('filter-trigger/states');
    // Then it is named "Filters, 2 active" from the hidden library string, and its bubble shows 2, hidden from assistive technology
    const trigger = new FilterTriggerComponent(harness.example('count'), FilterTriggerComponent.nameWithCount(2));
    await expect(trigger.countWords).toHaveText(', 2 active');
    await expect(trigger.countNumber).toHaveText('2');
    await expect(trigger.countNumber).toBeVisible();
  });

  test('AC-4 aria-expanded follows the open sheet, with the 2px ink edge while open', async ({ page }) => {
    // Given the trigger whose application opens and closes a sheet on activation
    const harness = new HarnessPage(page);
    await harness.open('filter-trigger/states', { width: 360 });
    const trigger = new FilterTriggerComponent(harness.example('none'), 'Filters');
    await expect(trigger.root).toHaveAttribute('aria-expanded', 'false');
    expect(await trigger.hasOpenEdge()).toBe(false);
    // When the visitor activates it
    await trigger.click();
    // Then it is expanded with the --color-fg-default edge and the inset hairline
    await expect(trigger.root).toHaveAttribute('aria-expanded', 'true');
    expect(await trigger.hasOpenEdge()).toBe(true);
    expect(await trigger.edgeColour()).toBe(await harness.tokenColour('--color-fg-default'));
    // When the sheet closes (Enter on the trigger again in the harness)
    await trigger.press('Enter');
    // Then it is collapsed again
    await expect(trigger.root).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(() => harness.activations()).toEqual(['click: Filters', 'click: Filters']);
  });

  test('AC-21 keyboard focus draws the 2px ring at 3:1, and a mouse click draws none', async ({ page }) => {
    // Given the trigger
    const harness = new HarnessPage(page);
    await harness.open('filter-trigger/states');
    const trigger = new FilterTriggerComponent(harness.example('none'), 'Filters');
    // When it is clicked with a mouse
    await trigger.click();
    // Then no ring shows
    expect((await trigger.focusRing()).style).toBe('none');
    // When a keyboard user focuses it
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(trigger.root).toBeFocused();
    // Then a solid 2px ring in --color-focus-ring shows at 3:1 against the page
    expect(await trigger.focusRing()).toEqual({ width: 2, style: 'solid', colour: await harness.tokenColour('--color-focus-ring') });
    expect(await trigger.contrast('outline')).toBeGreaterThanOrEqual(3);
  });

  test('a natively disabled trigger is dimmed to 50%', async ({ page }) => {
    // Given a disabled trigger
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('filter-trigger/states');
    // Then it is disabled at the DS 50% opacity
    const trigger = new FilterTriggerComponent(harness.example('disabled'), 'Filters');
    await expect(trigger.root).toBeDisabled();
    expect(await trigger.opacity()).toBe(0.5);
  });

  for (const theme of THEMES) {
    test(`AC-22 label 4.5:1 and edges 3:1 at rest, hovered, open and with a count, on the page and in a sheet, in the ${theme} theme`, async ({ page }) => {
      // Given triggers on the page and on a sheet surface
      const harness = new HarnessPage(page);
      await harness.open('filter-trigger/states', { theme });
      for (const surface of ['none', 'sheet']) {
        const trigger = new FilterTriggerComponent(harness.example(surface), 'Filters');
        // When the contrast check runs at rest, hovered and open
        // Then the label is at least 4.5:1 and the edge at least 3:1
        expect(await trigger.contrast('text'), `${surface} rest`).toBeGreaterThanOrEqual(4.5);
        expect(await trigger.contrast('border'), `${surface} edge`).toBeGreaterThanOrEqual(3);
        await trigger.hover();
        await expect.poll(() => trigger.contrast('text'), `${surface} hover`).toBeGreaterThanOrEqual(4.5);
        await trigger.click();
        await expect(trigger.root).toHaveAttribute('aria-expanded', 'true');
        expect(await trigger.contrast('border'), `${surface} open edge`).toBeGreaterThanOrEqual(3);
      }
      // And with a count the label and the bubble's number are at least 4.5:1
      const counted = new FilterTriggerComponent(harness.example('count'), FilterTriggerComponent.nameWithCount(2));
      expect(await counted.contrast('text')).toBeGreaterThanOrEqual(4.5);
      expect(await counted.countContrast()).toBeGreaterThanOrEqual(4.5);
    });

    for (const width of [320, 1280]) {
      test(`axe finds no violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given every trigger state in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans it
        await harness.open('filter-trigger/states', { width, theme });
        // Then it reports no violations and nothing scrolls sideways
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }

  test('AC-23 at 360px the trigger is at least 44px tall', async ({ page }) => {
    // Given the trigger with and without a count at 360px
    const harness = new HarnessPage(page);
    // When it is measured
    await harness.open('filter-trigger/states', { width: 360 });
    // Then each is at least 44px tall
    expect(await new FilterTriggerComponent(harness.example('none'), 'Filters').height()).toBeGreaterThanOrEqual(44);
    expect(await new FilterTriggerComponent(harness.example('count'), FilterTriggerComponent.nameWithCount(2)).height()).toBeGreaterThanOrEqual(44);
  });

  test('AC-27 (trigger part) updating the count after a filter change stays within the 200ms INP budget', async ({ page }) => {
    // Given the filter/performance route: the results head with the trigger and the "Natural light" option
    const harness = new HarnessPage(page);
    await harness.open('filter/performance', { width: 412 });
    // When "Natural light" is ticked with the CPU slowed
    const latency = await harness.interactionLatency(() => harness.toggle('Natural light'));
    // Then the interaction paints within 200ms and the trigger reads "Filters, 1 active"
    expect(latency).toBeLessThanOrEqual(200);
    await expect(new FilterTriggerComponent(page, FilterTriggerComponent.nameWithCount(1)).root).toBeVisible();
  });
});
