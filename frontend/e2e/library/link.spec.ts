import { expect, test } from '@playwright/test';
import { LinkComponent } from '../components/link.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const THEMES: HarnessTheme[] = ['light', 'dark'];
const EXTERNAL_ARROW = '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>';

test.describe('LinkComponent (CRD link, ICD-002 §9.1, §12, ICD-SEC-2)', () => {
  test('AC-1 an inline a[st-link] is a plain native link: no class, no target or rel, link colour and hairline underline', async ({ page }) => {
    // Given <a st-link href="mailto:corrections@shotthere.ca"> in the editorial policy's sentence
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('link/variants');
    const corrections = new LinkComponent(page, 'corrections@shotthere.ca');
    // Then it has no class, no target and no rel, and the DS link look
    expect(await corrections.allClasses()).toEqual([]);
    await expect(corrections.root).not.toHaveAttribute('target');
    await expect(corrections.root).not.toHaveAttribute('rel');
    expect(await corrections.look()).toEqual({ colour: await harness.tokenColour('--color-fg-link'), underline: true, thickness: 1, offset: 2.4 });
    expect(harness.errors).toEqual([]);
  });

  test('AC-2 a standalone link is .link--standalone, points to the studio and is named with its hidden context', async ({ page }) => {
    // Given a guide entry's standalone "Read the full review" with the hidden " of Kensington Window Room"
    const harness = new HarnessPage(page);
    // When the guide renders
    await harness.open('link/variants');
    // Then the link is named "Read the full review of Kensington Window Room", is standalone and points to the studio
    const review = new LinkComponent(page, 'Read the full review of Kensington Window Room');
    expect(await review.classes()).toEqual(['link--standalone']);
    await expect(review.root).toHaveAttribute('href', '/studios/kensington-window-room');
  });

  test('AC-3 an external link opens a new tab with noopener and trails the hidden arrow straight after its text', async ({ page }) => {
    // Given <a st-link external href="https://www.youtube.com/watch?v=Jx7Lq2pT9aE">Watch on YouTube</a>
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('link/variants');
    const watch = new LinkComponent(page, 'Watch on YouTube (opens in a new tab)');
    // Then it is .link--external with target="_blank" and rel="noopener"
    expect(await watch.classes()).toEqual(['link--external']);
    await expect(watch.root).toHaveAttribute('target', '_blank');
    await expect(watch.root).toHaveAttribute('rel', 'noopener');
    // And the hidden external arrow comes directly after the text, at 0.9em of 16px
    await expect(watch.icon.svg).toHaveAttribute('aria-hidden', 'true');
    expect(await watch.icon.drawing()).toBe(EXTERNAL_ARROW);
    expect(await watch.arrowFollowsText()).toBe(true);
    expect(await watch.icon.size()).toEqual({ width: 14, height: 14 });
  });

  test('AC-4 activating an external permit source opens it in a new tab with no opener', async ({ page }) => {
    // Given Evergreen Brick Works' permit source link
    const harness = new HarnessPage(page);
    await harness.open('link/variants');
    const source = new LinkComponent(page, 'Evergreen: photography and filming (opens in a new tab)');
    // When the visitor activates it
    const [tab] = await Promise.all([page.context().waitForEvent('page'), source.click()]);
    await tab.waitForLoadState();
    // Then evergreen.ca opens in a new tab that cannot reach the opener
    expect(new URL(tab.url()).hostname).toBe('www.evergreen.ca');
    expect(await tab.evaluate(() => window.opener)).toBeNull();
    expect(new URL(page.url()).pathname).toBe('/link/variants');
  });

  test('AC-5 "Open in Google Maps" is an external link to the spot\'s coordinates', async ({ page }) => {
    // Given the unavailable map's "Open in Google Maps" for Evergreen Brick Works
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('link/variants');
    // Then it is an external a[st-link] to the Google Maps search URL that opens in a new tab
    const maps = new LinkComponent(page, 'Open in Google Maps (opens in a new tab)');
    expect(await maps.classes()).toEqual(['link--external']);
    await expect(maps.root).toHaveAttribute('href', 'https://www.google.com/maps/search/?api=1&query=43.6846,-79.3653');
    await expect(maps.root).toHaveAttribute('target', '_blank');
  });

  test('AC-6 externalHint replaces the hidden suffix; without it the suffix is @@st.link.external', async ({ page }) => {
    // Given one external link with externalHint "(s'ouvre dans un nouvel onglet)" and others without
    const harness = new HarnessPage(page);
    // When they render
    await harness.open('link/variants');
    // Then the first is named with the application's hint after one space, the others with the library default
    await expect(new LinkComponent(page, "Watch on YouTube (s'ouvre dans un nouvel onglet)").root).toHaveAttribute('target', '_blank');
    await expect(new LinkComponent(page, 'Watch on YouTube (opens in a new tab)').hiddenSuffix).toHaveText(' (opens in a new tab)');
  });

  test('AC-7 on hover "Change studios" turns --color-fg-link-hover with a thick underline at 4.5:1', async ({ page }) => {
    // Given "Change studios" on the comparison page
    const harness = new HarnessPage(page);
    await harness.open('link/variants');
    const change = new LinkComponent(page, 'Change studios');
    // When the pointer rests on it
    await change.hover();
    // Then it is --color-fg-link-hover with a thick underline and at least 4.5:1 against the page
    const look = await change.look();
    expect(look.colour).toBe(await harness.tokenColour('--color-fg-link-hover'));
    expect(look.thickness).toBe(2);
    expect(await change.contrast('text')).toBeGreaterThanOrEqual(4.5);
  });

  test('AC-8 Tab shows the 2px ring at 3:1 and Enter opens the review', async ({ page }) => {
    // Given the guide's "Read the full review of Leslieville Daylight Studio"
    const harness = new HarnessPage(page);
    await harness.open('link/variants');
    const review = new LinkComponent(page, 'Read the full review of Leslieville Daylight Studio');
    // When a keyboard user tabs to it
    await new LinkComponent(page, 'Read the full review of Kensington Window Room').root.focus();
    await page.keyboard.press('Tab');
    await expect(review.root).toBeFocused();
    // Then a solid 2px ring in --color-focus-ring shows at 3:1
    expect(await review.focusRing()).toEqual({ width: 2, style: 'solid', colour: await harness.tokenColour('--color-focus-ring') });
    expect(await review.contrast('outline')).toBeGreaterThanOrEqual(3);
    // When they press Enter
    await page.keyboard.press('Enter');
    // Then Leslieville Daylight Studio's page opens
    await expect(page).toHaveURL(/\/link\/destination$/);
  });

  for (const theme of THEMES) {
    test(`AC-10 links and hovered links keep 4.5:1 and focus rings 3:1 on every surface in the ${theme} theme`, async ({ page }) => {
      // Given inline, standalone and external links on the page, a guide entry, the map popup and a sunken panel
      const harness = new HarnessPage(page);
      await harness.open('link/contrast', { theme });
      for (const surface of ['page', 'guide entry', 'map popup', 'sunken panel']) {
        for (const name of ['corrections@shotthere.ca', 'Change studios', 'Watch on YouTube (opens in a new tab)']) {
          const link = new LinkComponent(harness.example(surface), name);
          // When the contrast check runs at rest, on hover and with focus
          // Then the text is at least 4.5:1 and the ring at least 3:1
          expect(await link.contrast('text'), `${surface}: ${name}`).toBeGreaterThanOrEqual(4.5);
          await link.hover();
          await expect.poll(() => link.contrast('text'), `${surface}: ${name} hovered`).toBeGreaterThanOrEqual(4.5);
          await link.root.focus();
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          expect(await link.contrast('outline'), `${surface}: ${name} ring`).toBeGreaterThanOrEqual(3);
        }
      }
    });

    for (const width of [320, 1280]) {
      test(`AC-9 axe finds no empty link name and no link-in-text-block at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given the link variants and the link surfaces in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans them
        await harness.open('link/variants', { width, theme });
        const variants = await harness.accessibilityViolations();
        await harness.open('link/contrast', { width, theme });
        // Then it reports no violations and nothing scrolls sideways
        expect(variants).toEqual([]);
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }

  test('AC-11 at 360px "Change studios" and every "Read the full review" are at least 44px tall', async ({ page }) => {
    // Given the standalone links at 360px
    const harness = new HarnessPage(page);
    await harness.open('link/variants', { width: 360 });
    // When each is measured
    // Then each is at least 44px tall
    for (const name of [
      'Change studios',
      'Read the full review of Kensington Window Room',
      'Read the full review of Leslieville Daylight Studio',
      'Read the full review of The Junction Loft',
    ]) {
      expect(await new LinkComponent(page, name).height(), name).toBeGreaterThanOrEqual(44);
    }
  });

  test('AC-12 at 320px a wrapping external link keeps its arrow on the line of its last word', async ({ page }) => {
    // Given Evergreen Brick Works' permit line at 320px
    const harness = new HarnessPage(page);
    // When "Evergreen: photography and filming" wraps
    await harness.open('link/variants', { width: 320 });
    // Then the arrow sits on the same line as "filming" and the page does not scroll sideways
    const source = new LinkComponent(page, 'Evergreen: photography and filming (opens in a new tab)');
    expect(await source.arrowOnLastWordLine()).toBe(true);
    expect(await harness.hasHorizontalScroll()).toBe(false);
  });

  test('AC-13 at 200% zoom "Watch on YouTube" and its arrow are fully visible with no sideways scroll', async ({ page }) => {
    // Given the video section's link in a 1280px window at 200% zoom (640 CSS px)
    const harness = new HarnessPage(page);
    // When the visitor reaches it
    await harness.open('link/variants', { width: 640 });
    // Then it is fully visible and the page does not scroll sideways
    expect(await new LinkComponent(page, 'Watch on YouTube (opens in a new tab)').isFullyInView()).toBe(true);
    expect(await harness.hasHorizontalScroll()).toBe(false);
  });

  test.describe('performance (L2-071)', () => {
    // Measured on a shared machine with the CPU slowed 4x: a retry absorbs contention from parallel
    // workers, while a real regression fails every attempt.
    test.describe.configure({ retries: 2 });

    test('AC-14 the link/performance route shifts no layout (CLS at most 0.1)', async ({ page }) => {
      // Given the link/performance route
      const harness = new HarnessPage(page);
      // When it loads on a mobile profile and hydrates
      const metrics = await harness.loadMetrics('link/performance');
      // Then cumulative layout shift is at most 0.1
      expect(metrics.cls).toBeLessThanOrEqual(0.1);
    });
  });
});
