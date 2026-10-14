import { expect, test } from '@playwright/test';
import { SkeletonComponent } from '../components/skeleton.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('SkeletonComponent (ICD-002 §9.7, CRD skeleton)', () => {
  test('is a text skeleton by default and carries a modifier per shape, each aria-hidden', async ({
    page,
  }) => {
    // Given a busy region with one skeleton per shape
    const harness = new HarnessPage(page);
    await harness.open('skeleton/shapes');
    const region = harness.example('Loading studios');
    // Then every shape has the .skeleton block and its modifier, hidden from assistive technology
    for (const shape of ['text', 'title', 'rect', 'pill', 'circle'] as const) {
      const skeleton = new SkeletonComponent(region, shape);
      expect(await skeleton.classes()).toEqual(['skeleton', `skeleton--${shape}`]);
      await expect(skeleton.root).toHaveAttribute('aria-hidden', 'true');
      await expect(skeleton.root).toHaveText('');
    }
    expect(harness.errors).toEqual([]);
  });

  test('exposes no skeleton in the accessibility tree: only the status words remain', async ({
    page,
  }) => {
    // Given the busy region
    const harness = new HarnessPage(page);
    await harness.open('skeleton/shapes');
    // Then the accessible text of the region is its status line alone
    await expect(harness.example('Loading studios')).toHaveText('Loading studios…');
  });

  test('keeps the size the consumer sets and rounds the pill and circle fully', async ({
    page,
  }) => {
    // Given a pill 5rem × 2.75rem and a circle 3rem square
    const harness = new HarnessPage(page);
    await harness.open('skeleton/shapes');
    // Then the pill is 80 × 44 with fully rounded ends and the circle is round
    const pill = new SkeletonComponent(harness.example('Loading studios'), 'pill');
    const box = await pill.root.boundingBox();
    expect([Math.round(box?.width ?? 0), Math.round(box?.height ?? 0)]).toEqual([80, 44]);
    expect(parseFloat(await pill.radius())).toBeGreaterThanOrEqual(22);
    const circle = new SkeletonComponent(harness.example('Loading studios'), 'circle');
    expect(parseFloat(await circle.radius())).toBeGreaterThanOrEqual(24);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        const harness = new HarnessPage(page);
        await harness.open('skeleton/shapes', { width, theme });
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
