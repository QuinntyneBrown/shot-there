import { expect, test } from '@playwright/test';
import { ResponsiveImageComponent } from '../components/responsive-image.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const ALT = 'The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand.';
const SIZES = '(min-width: 62rem) 50vw, 100vw';

test.describe('ResponsiveImageComponent (ICD-002 §9.8, ICD-MEDIA-1..3, L2-072, L2-086.1)', () => {
  test('renders one <source> per format in AVIF, WebP, JPEG order and an <img> with the data and sizes', async ({ page }) => {
    // Given an image whose sources arrive as JPEG, AVIF, WebP
    const harness = new HarnessPage(page);
    // When the default route opens
    await harness.open('responsive-image/default');
    const image = new ResponsiveImageComponent(harness.example('lazy'));
    // Then the sources are AVIF, WebP, then JPEG, each typed and carrying the application's sizes
    expect(await image.sources()).toEqual([
      { type: 'image/avif', srcset: '/test-images/loft-480.avif 480w, /test-images/loft-960.avif 960w', sizes: SIZES },
      { type: 'image/webp', srcset: '/test-images/loft-480.webp 480w, /test-images/loft-960.webp 960w', sizes: SIZES },
      { type: 'image/jpeg', srcset: '/test-images/loft-480.jpg 480w, /test-images/loft-960.jpg 960w', sizes: SIZES },
    ]);
    // And the <img> falls back to fallbackUrl with the JPEG srcset, the alt text and the intrinsic size, lazy-loaded
    expect(await image.imageAttributes()).toEqual({
      src: '/test-images/loft-960.jpg',
      srcset: '/test-images/loft-480.jpg 480w, /test-images/loft-960.jpg 960w',
      sizes: SIZES,
      alt: ALT,
      width: '1200',
      height: '800',
      loading: 'lazy',
      fetchpriority: null,
    });
    expect(harness.errors).toEqual([]);
  });

  test('loads the AVIF variant in Chromium and fills its slot', async ({ page }) => {
    // Given a lazy image in a 320px-wide slot
    const harness = new HarnessPage(page);
    // When the default route opens and the image loads
    await harness.open('responsive-image/default');
    const image = new ResponsiveImageComponent(harness.example('lazy'));
    // Then the browser chose an AVIF variant
    expect(await image.loadedUrl()).toMatch(/\.avif$/);
    // And the image fills the slot's width at the data's 3:2 ratio
    expect(await image.imageSize()).toEqual({ width: 320, height: 213 });
  });

  test('loads eagerly with high fetch priority when priority (ICD-MEDIA-2)', async ({ page }) => {
    // Given the first above-the-fold image, marked priority
    const harness = new HarnessPage(page);
    // When the default route opens
    await harness.open('responsive-image/default');
    // Then its <img> is eager with fetchpriority="high"
    const attributes = await new ResponsiveImageComponent(harness.example('priority')).imageAttributes();
    expect(attributes['loading']).toBe('eager');
    expect(attributes['fetchpriority']).toBe('high');
  });

  test('keeps its slot and shows the alt text when the image fails (L2-086.1)', async ({ page }) => {
    // Given an informative image in a 320 x 200 slot whose files fail to load
    const harness = new HarnessPage(page);
    // When the failed route opens
    await harness.open('responsive-image/failed');
    // Then a placeholder with the alt text fills the same 320 x 200 box and the image is hidden
    const image = new ResponsiveImageComponent(harness.example('informative'));
    await expect(image.placeholder).toBeVisible();
    await expect(image.image).toBeHidden();
    expect(await image.placeholderBox()).toEqual({ text: ALT, width: 320, height: 200 });
  });

  test('a decorative image has empty alt text and a failed placeholder with no text', async ({ page }) => {
    // Given a decorative image whose files fail to load
    const harness = new HarnessPage(page);
    // When the failed route opens
    await harness.open('responsive-image/failed');
    const image = new ResponsiveImageComponent(harness.example('decorative'));
    // Then its <img> has alt="" and the placeholder fills the 320 x 200 slot with no text
    expect((await image.imageAttributes())['alt']).toBe('');
    await expect(image.placeholder).toBeVisible();
    expect(await image.placeholderBox()).toEqual({ text: '', width: 320, height: 200 });
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      for (const route of ['responsive-image/default', 'responsive-image/failed']) {
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
