import { expect, test } from '@playwright/test';
import { StatusComponent } from '../components/status.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('StatusComponent (ICD-002 §9.5)', () => {
  test('draft is a hollow 2px ring', async ({ page }) => {
    // Given a Draft label
    const harness = new HarnessPage(page);
    await harness.open('status/variants');
    // Then it is .status.status--draft with a transparent fill and a 2px currentColor border
    const draft = new StatusComponent(page, 'Draft');
    expect(await draft.classes()).toEqual(['status', 'status--draft']);
    const shape = await draft.shape();
    expect(shape.background).toBe('rgba(0, 0, 0, 0)');
    expect(shape.borderWidth).toBe(2);
    expect(shape.borderColour).toBe(shape.colour);
    expect(harness.errors).toEqual([]);
  });

  test('published is a filled dot in the success colour', async ({ page }) => {
    // Given a Published label
    const harness = new HarnessPage(page);
    await harness.open('status/variants');
    // Then it is .status--published, coloured and its dot filled with the same colour, unlike the draft
    const published = new StatusComponent(page, 'Published');
    expect(await published.classes()).toEqual(['status', 'status--published']);
    const shape = await published.shape();
    expect(shape.background).toBe(shape.colour);
    expect(shape.colour).not.toBe((await new StatusComponent(page, 'Draft').shape()).colour);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('status/variants', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
