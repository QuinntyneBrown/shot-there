import { expect, test } from '@playwright/test';
import { ProgressComponent } from '../components/progress.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('ProgressComponent (ICD-002 §9.7, CRD progress)', () => {
  test('is a named progressbar whose value and fill follow `value`', async ({ page }) => {
    // Given an upload at 45 %
    const harness = new HarnessPage(page);
    await harness.open('progress/states');
    const bar = new ProgressComponent(page, 'Uploading gallery-02.jpg');
    // Then it is a .progress progressbar with min 0, max 100, now 45, and the fill is 45 % of the track
    expect(await bar.classes()).toEqual(['progress']);
    await expect(bar.root).toHaveAttribute('aria-valuemin', '0');
    await expect(bar.root).toHaveAttribute('aria-valuemax', '100');
    await expect(bar.root).toHaveAttribute('aria-valuenow', '45');
    expect(await bar.fillPercent()).toBe(45);
    expect(harness.errors).toEqual([]);
  });

  test('shows an empty track at 0 and a full one at 100', async ({ page }) => {
    // Given bars at 0 % and 100 %
    const harness = new HarnessPage(page);
    await harness.open('progress/states');
    // Then their fills are empty and full
    const start = new ProgressComponent(page, 'Uploading gallery-03.jpg');
    await expect(start.root).toHaveAttribute('aria-valuenow', '0');
    expect(await start.fillPercent()).toBe(0);
    const done = new ProgressComponent(page, 'Uploaded gallery-04.jpg');
    await expect(done.root).toHaveAttribute('aria-valuenow', '100');
    expect(await done.fillPercent()).toBe(100);
  });

  test('is indeterminate when value is null, with no aria-valuenow', async ({ page }) => {
    // Given a bar whose value is null
    const harness = new HarnessPage(page);
    await harness.open('progress/states');
    const bar = new ProgressComponent(page, 'Processing gallery-05.jpg');
    // Then it carries .progress--indeterminate and no aria-valuenow
    expect(await bar.classes()).toEqual(['progress', 'progress--indeterminate']);
    expect(await bar.root.getAttribute('aria-valuenow')).toBeNull();
  });

  test('clamps values outside 0–100', async ({ page }) => {
    // Given values of 120 and -5
    const harness = new HarnessPage(page);
    await harness.open('progress/states');
    // Then they read 100 and 0
    await expect(new ProgressComponent(page, 'Over').root).toHaveAttribute('aria-valuenow', '100');
    await expect(new ProgressComponent(page, 'Under').root).toHaveAttribute('aria-valuenow', '0');
  });

  test('adds a tone modifier only for success and danger', async ({ page }) => {
    // Given success and danger bars
    const harness = new HarnessPage(page);
    await harness.open('progress/states');
    // Then each carries its modifier and a different fill from the neutral bar
    expect(await new ProgressComponent(page, 'Uploaded gallery-04.jpg').classes()).toEqual(['progress', 'progress--success']);
    expect(await new ProgressComponent(page, 'Failed gallery-06.jpg').classes()).toEqual(['progress', 'progress--danger']);
    const neutral = await new ProgressComponent(page, 'Uploading gallery-02.jpg').fillColour();
    expect(await new ProgressComponent(page, 'Failed gallery-06.jpg').fillColour()).not.toBe(neutral);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('progress/states', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
