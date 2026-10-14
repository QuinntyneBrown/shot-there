import { expect, test } from '@playwright/test';
import { IconButtonComponent } from '../components/icon-button.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const THEMES: HarnessTheme[] = ['light', 'dark'];

test.describe('IconButtonComponent (CRD icon-button, ICD-002 §9.1)', () => {
  test('AC-1 the map popup Close is a native button with only icon-btn, named by aria-label, holding one hidden svg and no text', async ({ page }) => {
    // Given <button st-icon-button type="button" icon="close" label="Close"> in the map popup
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('icon-button/default');
    const close = new IconButtonComponent(harness.example('map popup'), 'Close');
    // Then it is a native button with the class icon-btn only, aria-label="Close", one hidden svg.icon and no text
    expect(await close.tag()).toBe('button');
    expect(await close.classes()).toEqual(['icon-btn']);
    await expect(close.root).toHaveAttribute('aria-label', 'Close');
    await expect(close.icon.svg).toHaveAttribute('aria-hidden', 'true');
    expect(await close.icon.drawing()).toBe('<path d="M6 6l12 12M18 6 6 18"/>');
    expect((await close.textContent()).trim()).toBe('');
    expect(harness.errors).toEqual([]);
  });

  test('AC-2 the lightbox Close, Previous and Next carry icon-btn--outline and the 1px --color-border-default ring', async ({ page }) => {
    // Given the lightbox's three icon buttons with outline
    const harness = new HarnessPage(page);
    // When they render
    await harness.open('icon-button/default');
    const ring = { width: 1, style: 'solid', colour: await harness.tokenColour('--color-border-default') };
    // Then each is named, carries icon-btn icon-btn--outline and draws the ring
    for (const name of ['Close', 'Previous photo', 'Next photo']) {
      const button = new IconButtonComponent(harness.example('lightbox'), name);
      expect(await button.classes(), name).toEqual(['icon-btn', 'icon-btn--outline']);
      expect(await button.border(), name).toEqual(ring);
    }
  });

  test('AC-3, AC-4 aria-pressed only when pressed is set; pressed keeps the subtle fill and the accent glyph', async ({ page }) => {
    // Given an icon toggle not pressed, one pressed, and a plain icon button
    const harness = new HarnessPage(page);
    await harness.open('icon-button/pressed');
    // When they render
    const off = new IconButtonComponent(page, 'Show the map');
    const on = new IconButtonComponent(page, 'Show the list');
    // Then the plain button has no aria-pressed
    await expect(new IconButtonComponent(page, 'Close').root).not.toHaveAttribute('aria-pressed');
    // And the unpressed toggle is aria-pressed="false" with the default look
    await expect(off.root).toHaveAttribute('aria-pressed', 'false');
    expect(await off.fill()).toBe('transparent');
    expect(await off.glyphColour()).toBe(await harness.tokenColour('--color-fg-default'));
    // And the pressed toggle is aria-pressed="true" with the subtle fill and the accent glyph
    await expect(on.root).toHaveAttribute('aria-pressed', 'true');
    expect(await on.fill()).toBe(await harness.tokenColour('--color-bg-subtle'));
    expect(await on.glyphColour()).toBe(await harness.tokenColour('--color-fg-accent'));
  });

  test('AC-5 a current icon link keeps its href and the accent glyph at rest and on hover', async ({ page }) => {
    // Given <a st-icon-button href="/" icon="home" label="Home" aria-current="page">
    const harness = new HarnessPage(page);
    await harness.open('icon-button/default');
    const home = new IconButtonComponent(page, 'Home', 'link');
    // When it renders and the pointer rests on it
    // Then it is a link with icon-btn, keeps its href, and its glyph is accent both times
    expect(await home.classes()).toEqual(['icon-btn']);
    await expect(home.root).toHaveAttribute('href', '/');
    const accent = await harness.tokenColour('--color-fg-accent');
    expect(await home.glyphColour()).toBe(accent);
    await home.hover();
    await expect.poll(() => home.glyphColour()).toBe(accent);
  });

  test('AC-6 hover fills --color-bg-subtle, pressing fills --color-bg-subtle-hover, and the glyph stays default', async ({ page }) => {
    // Given the map popup's Close
    const harness = new HarnessPage(page);
    await harness.open('icon-button/default');
    const close = new IconButtonComponent(harness.example('map popup'), 'Close');
    const ink = await harness.tokenColour('--color-fg-default');
    // When the pointer rests on it
    await close.hover();
    // Then the fill is --color-bg-subtle and the glyph stays --color-fg-default
    await expect.poll(() => close.fill()).toBe(await harness.tokenColour('--color-bg-subtle'));
    expect(await close.glyphColour()).toBe(ink);
    // When it is pressed
    await close.pressDown();
    // Then the fill is --color-bg-subtle-hover
    await expect.poll(() => close.fill()).toBe(await harness.tokenColour('--color-bg-subtle-hover'));
    expect(await close.glyphColour()).toBe(ink);
    await close.release();
  });

  test('AC-7 a natively disabled icon button is skipped by Tab, at 50% with no hover fill, and unavailable', async ({ page }) => {
    // Given a disabled "Remove test shot 2" icon button
    const harness = new HarnessPage(page);
    await harness.open('icon-button/default');
    const remove = new IconButtonComponent(page, 'Remove test shot 2');
    // When a keyboard user tabs through the page and the pointer rests on it
    const stops = await harness.tabSequence(7);
    await remove.hover();
    // Then Tab never stops on it, it is at 50% opacity with no fill, and it is disabled
    expect(stops).not.toContain('button Remove test shot 2');
    expect(await remove.opacity()).toBe(0.5);
    expect(await remove.fill()).toBe('transparent');
    await expect(remove.root).toBeDisabled();
  });

  test('AC-8, AC-11 Tab moves Close → Previous → Next, and Enter or Space on Next activates once and keeps focus', async ({ page }) => {
    // Given the lightbox with focus on Close
    const harness = new HarnessPage(page);
    await harness.open('icon-button/default');
    const lightbox = harness.example('lightbox');
    await new IconButtonComponent(lightbox, 'Close').focus();
    // When a keyboard user presses Tab twice
    await page.keyboard.press('Tab');
    await expect(new IconButtonComponent(lightbox, 'Previous photo').root).toBeFocused();
    await page.keyboard.press('Tab');
    const next = new IconButtonComponent(lightbox, 'Next photo');
    await expect(next.root).toBeFocused();
    // Then "Next photo" is a button named only "Next photo"
    expect(await next.ariaTree()).toBe('- button "Next photo"');
    // When they press Enter and then Space
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    // Then each activates it once and focus stays on it
    await expect.poll(() => harness.activations()).toEqual(['click: Next photo', 'click: Next photo']);
    await expect(next.root).toBeFocused();
  });

  for (const theme of THEMES) {
    test(`AC-9, AC-12 glyph 3:1 at rest, hovered and pressed, and a 2px focus ring at 3:1, in the ${theme} theme`, async ({ page }) => {
      // Given the ghost Close on the map popup's raised surface and the outline Close on the lightbox canvas
      const harness = new HarnessPage(page);
      await harness.open('icon-button/default', { theme });
      for (const surface of ['map popup', 'lightbox']) {
        const close = new IconButtonComponent(harness.example(surface), 'Close');
        // When the contrast check runs at rest, on hover and while pressed
        // Then the glyph is at least 3:1 against what is behind it
        expect(await close.contrast('text'), `${surface} rest`).toBeGreaterThanOrEqual(3);
        await close.hover();
        await expect.poll(() => close.contrast('text'), `${surface} hover`).toBeGreaterThanOrEqual(3);
        await close.pressDown();
        await expect.poll(() => close.contrast('text'), `${surface} pressed`).toBeGreaterThanOrEqual(3);
        await close.release();
        // And a mouse click draws no ring, but keyboard focus draws the 2px ring 3px out at 3:1
        expect((await close.focusRing()).style, `${surface} mouse`).toBe('none');
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        await expect(close.root).toBeFocused();
        expect(await close.focusRing(), surface).toEqual({ width: 2, offset: 3, style: 'solid', colour: await harness.tokenColour('--color-focus-ring') });
        expect(await close.contrast('outline'), `${surface} ring`).toBeGreaterThanOrEqual(3);
      }
    });

    for (const width of [320, 1280]) {
      test(`AC-10 axe finds no violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given the lightbox, map popup and toggles in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans them
        await harness.open('icon-button/default', { width, theme });
        const lightbox = await harness.accessibilityViolations();
        await harness.open('icon-button/pressed', { width, theme });
        // Then it reports no violations and nothing scrolls sideways
        expect(lightbox).toEqual([]);
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }

  test('AC-13 every icon button is 44 x 44 at 1280px and at 360px', async ({ page }) => {
    // Given the lightbox and the map popup
    const harness = new HarnessPage(page);
    for (const width of [1280, 360]) {
      // When each icon button is measured at ${width}px
      await harness.open('icon-button/default', { width });
      // Then it is 44 x 44
      for (const [surface, name] of [['lightbox', 'Close'], ['lightbox', 'Previous photo'], ['lightbox', 'Next photo'], ['map popup', 'Close']]) {
        expect(await new IconButtonComponent(harness.example(surface), name).size(), `${width}px ${surface} ${name}`).toEqual({ width: 44, height: 44 });
      }
    }
  });

  test('AC-14 at 320px the docked popup Close is fully visible with no sideways scroll', async ({ page }) => {
    // Given the docked map popup for Leslieville Daylight Studio at 320px
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('icon-button/default', { width: 320 });
    // Then Close is fully in view and the page does not scroll sideways
    expect(await new IconButtonComponent(harness.example('map popup'), 'Close').isFullyInView()).toBe(true);
    expect(await harness.hasHorizontalScroll()).toBe(false);
  });

  test('AC-15 pressing "Next photo" stays within the 200ms INP budget', async ({ page }) => {
    // Given the icon-button/performance route: the lightbox over a 24-photo gallery
    const harness = new HarnessPage(page);
    await harness.open('icon-button/performance', { width: 412 });
    // When "Next photo" is pressed with the CPU slowed
    const latency = await harness.interactionLatency(() => new IconButtonComponent(page, 'Next photo').click());
    // Then the interaction paints within 200ms and the next photo shows
    expect(latency).toBeLessThanOrEqual(200);
    await expect(harness.status()).toHaveText('Photo 2 of 24');
  });
});
