import { expect, test } from '@playwright/test';
import { SegmentedControlComponent } from '../components/segmented-control.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const THEMES: HarnessTheme[] = ['light', 'dark'];

test.describe('SegmentedControlComponent (CRD button-group, ICD-002 §9.1)', () => {
  test('AC-1 "Show" is a .segmented group of three typed toggle buttons with data-text, "Both" alone pressed', async ({ page }) => {
    // Given st-segmented "Show" with Both, Studios and Spots and the value "both"
    const harness = new HarnessPage(page);
    // When the map bar renders
    await harness.open('segmented/default');
    const show = new SegmentedControlComponent(page, 'Show');
    // Then the group is .segmented with role group and the name "Show"
    expect(await show.classes()).toEqual(['segmented']);
    // And it holds three type="button" items whose data-text is their name
    expect(await show.items()).toEqual([
      { name: 'Both', type: 'button', dataText: 'Both' },
      { name: 'Studios', type: 'button', dataText: 'Studios' },
      { name: 'Spots', type: 'button', dataText: 'Spots' },
    ]);
    // And only "Both" is pressed
    await expect(show.option('Both')).toHaveAttribute('aria-pressed', 'true');
    await expect(show.option('Studios')).toHaveAttribute('aria-pressed', 'false');
    await expect(show.option('Spots')).toHaveAttribute('aria-pressed', 'false');
    expect(harness.errors).toEqual([]);
  });

  test('AC-2 "View as" on "map" at 360px presses "Map" and not "List"', async ({ page }) => {
    // Given "View as" with Map and List and the value "map"
    const harness = new HarnessPage(page);
    // When the map bar renders at 360px
    await harness.open('segmented/default', { width: 360 });
    const viewAs = new SegmentedControlComponent(page, 'View as');
    // Then "Map" is pressed and "List" is not
    await expect(viewAs.option('Map')).toHaveAttribute('aria-pressed', 'true');
    await expect(viewAs.option('List')).toHaveAttribute('aria-pressed', 'false');
  });

  test('AC-3 pressing "Studios" presses it in accent semibold, releases the others and emits "studios" once', async ({ page }) => {
    // Given "Show" on "Both"
    const harness = new HarnessPage(page);
    await harness.open('segmented/default');
    const show = new SegmentedControlComponent(page, 'Show');
    const width = (await show.optionSize('Studios')).width;
    // When the visitor presses "Studios"
    await show.choose('Studios');
    // Then "Studios" alone is pressed, in --color-fg-accent and semibold, and valueChange carried "studios" once
    expect(await show.pressedOptions()).toEqual(['Studios']);
    await page.mouse.move(0, 0);
    await expect.poll(() => show.optionLook('Studios')).toEqual({ colour: await harness.tokenColour('--color-fg-accent'), weight: 600 });
    await expect.poll(() => harness.activations()).toEqual(['Show valueChange: studios']);
    // And the semibold label keeps its width
    expect((await show.optionSize('Studios')).width).toBe(width);
  });

  test('AC-4 pressing the pressed item again changes nothing and emits nothing', async ({ page }) => {
    // Given "Show" on "Studios"
    const harness = new HarnessPage(page);
    await harness.open('segmented/default');
    const show = new SegmentedControlComponent(page, 'Show');
    await show.choose('Studios');
    // When the visitor presses "Studios" again, then "Spots"
    await show.choose('Studios');
    expect(await show.pressedOptions()).toEqual(['Studios']);
    await show.choose('Spots');
    // Then only the two real changes were emitted
    await expect.poll(() => harness.activations()).toEqual(['Show valueChange: studios', 'Show valueChange: spots']);
  });

  test('AC-5 pressing "List" at 360px presses it, emits "list" and keeps focus on it', async ({ page }) => {
    // Given "View as" on "Map" at 360px
    const harness = new HarnessPage(page);
    await harness.open('segmented/default', { width: 360 });
    const viewAs = new SegmentedControlComponent(page, 'View as');
    // When the visitor presses "List"
    await viewAs.choose('List');
    // Then "List" is pressed, has focus, and valueChange carried "list"
    await expect(viewAs.option('List')).toHaveAttribute('aria-pressed', 'true');
    await expect(viewAs.option('List')).toBeFocused();
    await expect.poll(() => harness.activations()).toEqual(['View as valueChange: list']);
  });

  test('AC-6 a value set by the application presses its option and emits nothing', async ({ page }) => {
    // Given "Show" on "Both"
    const harness = new HarnessPage(page);
    await harness.open('segmented/default');
    const show = new SegmentedControlComponent(page, 'Show');
    // When the application sets the value to "studios", then the visitor presses "Spots"
    await harness.toggle('Show studios only');
    await expect(show.option('Studios')).toHaveAttribute('aria-pressed', 'true');
    expect(await show.pressedOptions()).toEqual(['Studios']);
    await show.choose('Spots');
    // Then only the visitor's change was emitted
    await expect.poll(() => harness.activations()).toEqual(['Show valueChange: spots']);
  });

  test('AC-7 Tab visits Both, Studios, Spots, Map, List with the 2px ring at 3:1, and Space or Enter presses "Spots"', async ({ page }) => {
    // Given the map bar at 360px
    const harness = new HarnessPage(page);
    await harness.open('segmented/default', { width: 360 });
    const show = new SegmentedControlComponent(page, 'Show');
    const viewAs = new SegmentedControlComponent(page, 'View as');
    // When a keyboard user tabs from the title onwards
    const stops = await harness.tabSequence(5);
    // Then focus visits the five items in order
    expect(stops).toEqual(['button Both', 'button Studios', 'button Spots', 'button Map', 'button List']);
    // And each shows a solid 2px ring in --color-focus-ring at 3:1
    const ring = { width: 2, style: 'solid', colour: await harness.tokenColour('--color-focus-ring') };
    for (const [group, name] of [[show, 'Both'], [show, 'Studios'], [show, 'Spots'], [viewAs, 'Map'], [viewAs, 'List']] as const) {
      await group.option(name).focus();
      expect(await group.optionFocusRing(name), name).toEqual(ring);
      expect(await group.optionContrast(name, 'outline'), name).toBeGreaterThanOrEqual(3);
    }
    // And Space presses "Spots", Enter presses "Studios"
    await show.press('Spots', 'Space');
    await expect(show.option('Spots')).toHaveAttribute('aria-pressed', 'true');
    await show.press('Studios', 'Enter');
    await expect(show.option('Studios')).toHaveAttribute('aria-pressed', 'true');
  });

  test('AC-8 the group and its items are exposed as a named group of toggle buttons', async ({ page }) => {
    // Given the map bar
    const harness = new HarnessPage(page);
    // When a screen reader reads "Show"
    await harness.open('segmented/default');
    // Then it is a group named "Show" holding "Both" pressed and the others not
    await expect(new SegmentedControlComponent(page, 'Show').root).toMatchAriaSnapshot(`
      - group "Show":
        - button "Both" [pressed]
        - button "Studios"
        - button "Spots"
    `);
  });

  for (const theme of THEMES) {
    test(`AC-9 items at rest, hovered and pressed keep 4.5:1 against the map bar in the ${theme} theme`, async ({ page }) => {
      // Given both groups on the map bar
      const harness = new HarnessPage(page);
      await harness.open('segmented/default', { width: 360, theme });
      const show = new SegmentedControlComponent(page, 'Show');
      // When the contrast check runs at rest, hovered and pressed
      // Then each is at least 4.5:1
      expect(await show.optionContrast('Studios', 'text'), 'rest').toBeGreaterThanOrEqual(4.5);
      await show.hover('Studios');
      await expect.poll(() => show.optionContrast('Studios', 'text'), 'hover').toBeGreaterThanOrEqual(4.5);
      expect(await show.optionContrast('Both', 'text'), 'pressed').toBeGreaterThanOrEqual(4.5);
      expect(await new SegmentedControlComponent(page, 'View as').optionContrast('List', 'text'), 'View as rest').toBeGreaterThanOrEqual(4.5);
    });

    for (const width of [320, 1280]) {
      test(`AC-8 axe finds no violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given the map bar in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans it
        await harness.open('segmented/default', { width, theme });
        // Then it reports no violations
        expect(await harness.accessibilityViolations()).toEqual([]);
      });
    }
  }

  test('AC-10 at 360px every item is at least 44px tall', async ({ page }) => {
    // Given the map bar at 360px
    const harness = new HarnessPage(page);
    await harness.open('segmented/default', { width: 360 });
    // When every item is measured
    // Then each is at least 44px tall
    for (const [label, names] of [['Show', ['Both', 'Studios', 'Spots']], ['View as', ['Map', 'List']]] as const) {
      for (const name of names) {
        expect((await new SegmentedControlComponent(page, label).optionSize(name)).height, name).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('AC-11 at 320px the bar wraps, every item stays whole and on screen, and nothing scrolls sideways', async ({ page }) => {
    // Given the map bar with both groups at 320px
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('segmented/default', { width: 320 });
    // Then every item is in view and the page does not scroll sideways
    expect(await new SegmentedControlComponent(page, 'Show').optionsInView()).toBe(true);
    expect(await new SegmentedControlComponent(page, 'View as').optionsInView()).toBe(true);
    expect(await harness.hasHorizontalScroll()).toBe(false);
  });

  test('AC-12 at 1280px "Show" is visible and "View as", with .until-lg on its host, is not displayed', async ({ page }) => {
    // Given the map bar at 1280px
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('segmented/default', { width: 1280 });
    // Then "Show" is visible and "View as" is hidden
    await expect(new SegmentedControlComponent(page, 'Show').root).toBeVisible();
    await expect(new SegmentedControlComponent(page, 'View as').root).toBeHidden();
  });

  test('AC-13 in landscape at 640 x 360 both groups are visible and operable', async ({ page }) => {
    // Given the map bar at 640 x 360
    const harness = new HarnessPage(page);
    await harness.open('segmented/default', { width: 640, height: 360 });
    const show = new SegmentedControlComponent(page, 'Show');
    const viewAs = new SegmentedControlComponent(page, 'View as');
    // When it renders
    // Then both groups are fully in view and respond
    expect(await show.optionsInView()).toBe(true);
    expect(await viewAs.optionsInView()).toBe(true);
    await viewAs.choose('List');
    await expect(viewAs.option('List')).toHaveAttribute('aria-pressed', 'true');
  });

  test('AC-14 pressing "Studios" stays within the 200ms INP budget', async ({ page }) => {
    // Given the button-group/performance route
    const harness = new HarnessPage(page);
    await harness.open('button-group/performance', { width: 412 });
    const show = new SegmentedControlComponent(page, 'Show');
    // When "Studios" is pressed with the CPU slowed
    const latency = await harness.interactionLatency(() => show.choose('Studios'));
    // Then the interaction paints within 200ms and "Studios" is pressed
    expect(latency).toBeLessThanOrEqual(200);
    await expect(show.option('Studios')).toHaveAttribute('aria-pressed', 'true');
  });
});
