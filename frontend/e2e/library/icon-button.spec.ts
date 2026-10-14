import { expect, test } from '@playwright/test';
import { IconButtonComponent } from '../components/icon-button.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('IconButtonComponent (ICD-002 §9.1, DS icon-button)', () => {
  test('is a native button named by its label, drawing its icon decoratively in a 44px circle', async ({ page }) => {
    // Given the ghost "Close" icon button
    const harness = new HarnessPage(page);
    // When the default route opens
    await harness.open('icon-button/default');
    // Then it is a button named "Close" by aria-label, styled .icon-btn, with no aria-pressed
    const close = new IconButtonComponent(page, 'Close');
    expect(await close.classes()).toEqual(['icon-btn']);
    await expect(close.root).not.toHaveAttribute('aria-pressed');
    // And it draws the close icon, hidden from assistive technology
    await expect(close.icon.svg).toHaveAttribute('aria-hidden', 'true');
    expect(await close.icon.drawing()).toBe('<path d="M6 6l12 12M18 6 6 18"/>');
    // And it is a 44 x 44 target with no edge
    expect(await close.size()).toEqual({ width: 44, height: 44 });
    expect((await close.border()).width).toBe(0);
    expect(harness.errors).toEqual([]);
  });

  test('is 44px at phone width too (L2-065.3)', async ({ page }) => {
    // Given the "Close" icon button
    const harness = new HarnessPage(page);
    // When the default route opens at 320px
    await harness.open('icon-button/default', { width: 320 });
    // Then it is still 44 x 44
    expect(await new IconButtonComponent(page, 'Close').size()).toEqual({ width: 44, height: 44 });
  });

  test('adds the hairline ring when outline', async ({ page }) => {
    // Given the outline "Next photo" icon button
    const harness = new HarnessPage(page);
    // When the default route opens
    await harness.open('icon-button/default');
    // Then it is .icon-btn--outline with a 1px solid edge
    const next = new IconButtonComponent(page, 'Next photo');
    expect(await next.classes()).toEqual(['icon-btn', 'icon-btn--outline']);
    expect(await next.border()).toEqual({ width: 1, style: 'solid' });
  });

  test('activates with a click, Enter and Space', async ({ page }) => {
    // Given the "Close" icon button
    const harness = new HarnessPage(page);
    await harness.open('icon-button/default');
    const close = new IconButtonComponent(page, 'Close');
    // When it is clicked, then activated with Enter and Space
    await close.click();
    await close.press('Enter');
    await close.press('Space');
    // Then the consumer's listener ran each time
    expect(await harness.activations()).toEqual(['click: Close', 'click: Close', 'click: Close']);
  });

  test('keeps link semantics on a[st-icon-button]', async ({ page }) => {
    // Given an icon link back to the review
    const harness = new HarnessPage(page);
    // When the default route opens
    await harness.open('icon-button/default');
    // Then it is a link named by its label, styled .icon-btn
    const back = new IconButtonComponent(page, 'Back to The Junction Loft', 'link');
    expect(await back.classes()).toEqual(['icon-btn']);
    await expect(back.root).toHaveAttribute('href', '/studios/the-junction-loft');
  });

  test('renders aria-pressed when pressed is set, with the accent glyph while pressed', async ({ page }) => {
    // Given an icon toggle, not pressed
    const harness = new HarnessPage(page);
    await harness.open('icon-button/pressed');
    const toggle = new IconButtonComponent(page, 'Show the map');
    await expect(toggle.root).toHaveAttribute('aria-pressed', 'false');
    const idle = await toggle.glyphColour();
    // When it is activated and the application sets pressed
    await toggle.click();
    // Then it is aria-pressed="true" and its glyph turns accent
    await expect(toggle.root).toHaveAttribute('aria-pressed', 'true');
    await page.mouse.move(0, 0);
    expect(await toggle.glyphColour()).not.toBe(idle);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      for (const route of ['icon-button/default', 'icon-button/pressed']) {
        test(`${route} has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
          // Given ${route} in the ${theme} theme at ${width}px
          const harness = new HarnessPage(page);
          // When axe scans it
          await harness.open(route, { width, theme });
          // Then it finds no violations and nothing scrolls sideways
          expect(await harness.accessibilityViolations()).toEqual([]);
          expect(await harness.hasHorizontalScroll()).toBe(false);
        });
      }
    }
  }
});
