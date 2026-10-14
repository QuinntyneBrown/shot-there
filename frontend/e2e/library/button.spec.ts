import { expect, test } from '@playwright/test';
import { ButtonComponent } from '../components/button.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('ButtonComponent: variants, sizes, block, links and icons (ICD-002 §9.1, DS button)', () => {
  test('renders each variant as a native button with the DS block and variant class', async ({ page }) => {
    // Given one button of each variant, the secondary one with no variant set
    const harness = new HarnessPage(page);
    // When the variants route opens
    await harness.open('button/variants');
    // Then each is a native button named by its label, with .btn and .btn--{variant} (secondary adds none)
    expect(await new ButtonComponent(page, 'Save changes').classes()).toEqual(['btn', 'btn--primary']);
    expect(await new ButtonComponent(page, 'Apply filters').classes()).toEqual(['btn']);
    expect(await new ButtonComponent(page, 'Remove test shot 3').classes()).toEqual(['btn', 'btn--ghost']);
    expect(await new ButtonComponent(page, 'Clear all').classes()).toEqual(['btn', 'btn--link']);
    expect(await new ButtonComponent(page, 'Delete studio').classes()).toEqual(['btn', 'btn--danger']);
    // And the server-rendered page hydrates without errors
    expect(harness.errors).toEqual([]);
  });

  test('activates with a click, Enter and Space, and shows the focus ring on keyboard focus', async ({ page }) => {
    // Given the primary "Save changes" button
    const harness = new HarnessPage(page);
    await harness.open('button/variants');
    const save = new ButtonComponent(page, 'Save changes');
    // When it is clicked, then activated with Enter and with Space
    await save.click();
    await save.press('Enter');
    await save.press('Space');
    // Then the consumer's click listener ran three times
    await expect.poll(() => harness.activations()).toEqual(['click: Save changes', 'click: Save changes', 'click: Save changes']);
    // And keyboard focus shows a solid ring at least 2px wide (L2-067.2)
    const ring = await save.focusRing();
    expect(ring.style).toBe('solid');
    expect(ring.width).toBeGreaterThanOrEqual(2);
  });

  test('is 36px small, 44px medium by default and 52px large from 48rem', async ({ page }) => {
    // Given one button at each size
    const harness = new HarnessPage(page);
    // When the sizes route opens at 1280px
    await harness.open('button/sizes', { width: 1280 });
    // Then the heights follow --control-height-sm/md/lg, with medium the default
    expect((await new ButtonComponent(page, 'Edit').size()).height).toBe(36);
    expect((await new ButtonComponent(page, 'Save changes').size()).height).toBe(44);
    expect((await new ButtonComponent(page, 'Sign in').size()).height).toBe(52);
    expect(await new ButtonComponent(page, 'Edit').classes()).toEqual(['btn', 'btn--sm']);
    expect(await new ButtonComponent(page, 'Sign in').classes()).toEqual(['btn', 'btn--primary', 'btn--lg']);
  });

  test('grows a small button to the 44px phone target below 48rem (L2-065.3)', async ({ page }) => {
    // Given the small "Edit" button
    const harness = new HarnessPage(page);
    // When the sizes route opens at 320px
    await harness.open('button/sizes', { width: 320 });
    // Then it is 44px tall
    expect((await new ButtonComponent(page, 'Edit').size()).height).toBe(44);
  });

  test('fills its container when block', async ({ page }) => {
    // Given a block "Sign in" button in a 320px container
    const harness = new HarnessPage(page);
    // When the block route opens
    await harness.open('button/block');
    // Then it is .btn--block and 320px wide
    const signIn = new ButtonComponent(page, 'Sign in');
    expect(await signIn.classes()).toEqual(['btn', 'btn--primary', 'btn--block']);
    expect((await signIn.size()).width).toBe(320);
  });

  test('keeps link semantics on a[st-button], with the external arrow decorative', async ({ page }) => {
    // Given a link drawn as a primary button that leaves the site, and an internal one
    const harness = new HarnessPage(page);
    // When the link route opens
    await harness.open('button/link');
    // Then each is a link named by its text, the hidden "(opens in a new tab)" included, styled .btn
    const book = new ButtonComponent(page, "Book on the studio's site (opens in a new tab)", 'link');
    expect(await book.classes()).toEqual(['btn', 'btn--primary']);
    await expect(book.root).toHaveAttribute('href', 'https://thejunctionloft.example/book');
    // And its arrow icon is hidden from assistive technology and sized to the label (1.25em of 16px)
    await expect(book.icon.svg).toHaveAttribute('aria-hidden', 'true');
    expect(await book.icon.size()).toEqual({ width: 20, height: 20 });
    expect(await new ButtonComponent(page, 'Browse outdoor spots', 'link').classes()).toEqual(['btn']);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      for (const route of ['button/variants', 'button/sizes', 'button/link']) {
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
