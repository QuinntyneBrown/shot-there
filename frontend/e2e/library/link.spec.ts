import { expect, test } from '@playwright/test';
import { LinkComponent } from '../components/link.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('LinkComponent (ICD-002 §9.1, §12, ICD-SEC-2, DS link)', () => {
  test('an inline link is a native, underlined link that opens in the same tab', async ({ page }) => {
    // Given an inline link in a sentence
    const harness = new HarnessPage(page);
    // When the variants route opens
    await harness.open('link/variants');
    // Then it is a link named by its text, with no modifier, no target and the DS underline
    const corrections = new LinkComponent(page, 'corrections@shotthere.ca');
    expect(await corrections.classes()).toEqual([]);
    await expect(corrections.root).not.toHaveAttribute('target');
    expect((await corrections.look()).underline).toBe(true);
    expect(harness.errors).toEqual([]);
  });

  test('a standalone link is .link--standalone and at least 44px tall', async ({ page }) => {
    // Given the standalone "Change studios" link
    const harness = new HarnessPage(page);
    // When the variants route opens
    await harness.open('link/variants');
    // Then it carries .link--standalone and is a 44px target
    const change = new LinkComponent(page, 'Change studios');
    expect(await change.classes()).toEqual(['link--standalone']);
    expect(await change.height()).toBeGreaterThanOrEqual(44);
  });

  test('an external link opens a new tab safely, says so in hidden text and trails a decorative arrow (L2-048.1)', async ({ page }) => {
    // Given the external "Watch on YouTube" link
    const harness = new HarnessPage(page);
    // When the variants route opens
    await harness.open('link/variants');
    // Then it is named with the library's hidden suffix " (opens in a new tab)"
    const watch = new LinkComponent(page, 'Watch on YouTube (opens in a new tab)');
    expect(await watch.classes()).toEqual(['link--external']);
    // And it opens a new tab with rel="noopener"
    await expect(watch.root).toHaveAttribute('target', '_blank');
    await expect(watch.root).toHaveAttribute('rel', 'noopener');
    // And it trails the external arrow, hidden from assistive technology, at 0.9em of its 16px text
    await expect(watch.icon.svg).toHaveAttribute('aria-hidden', 'true');
    expect(await watch.icon.drawing()).toBe('<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>');
    expect(await watch.icon.size()).toEqual({ width: 14, height: 14 });
  });

  test('replaces the hidden suffix with externalHint', async ({ page }) => {
    // Given an external link whose application passes its own externalHint
    const harness = new HarnessPage(page);
    // When the variants route opens
    await harness.open('link/variants');
    // Then the link is named with that hint instead of the library default
    await expect(new LinkComponent(page, 'Open in Google Maps (new tab)').root).toHaveAttribute('target', '_blank');
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given every link variant in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans it
        await harness.open('link/variants', { width, theme });
        // Then it finds no violations and nothing scrolls sideways
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
