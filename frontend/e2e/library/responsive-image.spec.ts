import { expect, test } from '@playwright/test';
import { ButtonComponent } from '../components/button.component';
import { ResponsiveImageComponent } from '../components/responsive-image.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const PORTRAIT = 'Close portrait against the brick wall with the octabox as fill.';
const HERO =
  'The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand.';
const FASHION = 'Full-length fashion frame on the cyc, warm afternoon light from the left.';
const GALLERY_SIZES = '(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw';
const IMAGE_FAILED =
  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/>';
const srcset = (format: string) =>
  ['480', '960', '1440'].map((w) => `/test-images/9f2c41/${w}.${format} ${w}w`).join(', ');

test.describe('ResponsiveImageComponent (ICD-002 §9.8, ICD-MEDIA-1..3)', () => {
  test('AC-1, AC-3 one typed <source> per format in AVIF, WebP, JPEG order, whatever order the data has', async ({
    page,
  }) => {
    // Given a gallery photo whose sources arrive JPEG, WebP, AVIF, and one with only WebP and JPEG
    const harness = new HarnessPage(page);
    // When they render
    await harness.open('responsive-image/default');
    // Then the first has AVIF, WebP, JPEG sources, each with its srcset and the gallery sizes
    expect(await new ResponsiveImageComponent(harness.example('gallery photo')).sources()).toEqual([
      { type: 'image/avif', srcset: srcset('avif'), sizes: GALLERY_SIZES },
      { type: 'image/webp', srcset: srcset('webp'), sizes: GALLERY_SIZES },
      { type: 'image/jpeg', srcset: srcset('jpeg'), sizes: GALLERY_SIZES },
    ]);
    // And the second has exactly WebP then JPEG
    expect(
      (await new ResponsiveImageComponent(harness.example('two formats')).sources()).map(
        (s) => s.type,
      ),
    ).toEqual(['image/webp', 'image/jpeg']);
    expect(harness.errors).toEqual([]);
  });

  test('AC-2, AC-9 the <img> carries fallbackUrl, the JPEG srcset, sizes, the alt text, the dimensions and lazy loading', async ({
    page,
  }) => {
    // Given the informative gallery photo
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('responsive-image/default');
    // Then its <img> attributes come from the data, its alt is the stored alt text, and it is lazy with no fetchpriority
    expect(
      await new ResponsiveImageComponent(harness.example('gallery photo')).imageAttributes(),
    ).toEqual({
      src: '/test-images/9f2c41/960.jpeg',
      srcset: srcset('jpeg'),
      sizes: GALLERY_SIZES,
      alt: PORTRAIT,
      width: '1600',
      height: '2000',
      loading: 'lazy',
      fetchpriority: null,
    });
  });

  test('AC-4 the priority hero loads eagerly with high fetch priority', async ({ page }) => {
    // Given The Junction Loft's hero with priority
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('responsive-image/default');
    const attributes = await new ResponsiveImageComponent(
      harness.example('hero'),
    ).imageAttributes();
    // Then it is eager with fetchpriority="high"
    expect([attributes['loading'], attributes['fetchpriority']]).toEqual(['eager', 'high']);
  });

  test('AC-5 Chromium loads the AVIF variant', async ({ page }) => {
    // Given the gallery photo in Chromium
    const harness = new HarnessPage(page);
    // When it loads
    await harness.open('responsive-image/default');
    // Then its currentSrc is an AVIF variant
    expect(
      await new ResponsiveImageComponent(harness.example('gallery photo')).loadedUrl(),
    ).toMatch(/\.avif$/);
  });

  test.describe('on a 2x screen', () => {
    test.use({ deviceScaleFactor: 2 });

    test('AC-6 at 360px no gallery thumbnail loads a variant wider than 960px', async ({
      page,
    }) => {
      // Given the gallery photo at 360px with a device pixel ratio of 2
      const harness = new HarnessPage(page);
      // When it loads
      await harness.open('responsive-image/default', { width: 360 });
      // Then the chosen variant is at most 960 wide
      const url = await new ResponsiveImageComponent(harness.example('gallery photo')).loadedUrl();
      expect(Number(url.match(/\/(\d+)\.\w+$/)?.[1])).toBeLessThanOrEqual(960);
    });
  });

  test('AC-7 a photo held for 3s already has its final 4:5 box and nothing moves when it arrives', async ({
    page,
  }) => {
    // Given the gallery photo's files held back for 3 seconds
    const harness = new HarnessPage(page);
    await harness.open('responsive-image/default', {
      held: { url: /\/test-images\/9f2c41\//, ms: 3000 },
    });
    const photo = new ResponsiveImageComponent(harness.example('gallery photo'));
    // When the page renders, and later when the photo arrives
    const before = await photo.boxes();
    await photo.loadedUrl();
    // Then the slot already had its final 4:5 box, and the boxes are unchanged
    expect(before.slot).toEqual({ width: 240, height: 300 });
    expect(await photo.boxes()).toEqual(before);
  });

  test('AC-8 a decorative card photo has alt=""', async ({ page }) => {
    // Given Kensington Window Room's card photo with decorative and a stored alt text
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('responsive-image/default');
    // Then its <img> has an empty alt
    expect(
      (await new ResponsiveImageComponent(harness.example('card photo')).imageAttributes())['alt'],
    ).toBe('');
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('AC-10 the server HTML holds the hero and the gallery as <picture> markup', async ({
      page,
    }) => {
      // Given a browser with JavaScript off
      const harness = new HarnessPage(page);
      // When the route is server-rendered
      await harness.open('responsive-image/performance');
      // Then the hero and the eight gallery photos are <picture> elements with their sources and <img> attributes
      for (const name of ['hero', ...Array.from({ length: 8 }, (_, i) => `photo ${i + 1}`)]) {
        const photo = new ResponsiveImageComponent(harness.example(name));
        expect(
          (await photo.sources()).map((s) => s.type),
          name,
        ).toEqual(['image/avif', 'image/webp', 'image/jpeg']);
        expect((await photo.imageAttributes())['width'], name).not.toBeNull();
      }
    });
  });

  test('AC-11, AC-16 a photo that returns 404 is replaced by the fallback with the image-failed icon and its alt text', async ({
    page,
  }) => {
    // Given gallery photo 2 in a shot button, whose URL returns HTTP 404
    const harness = new HarnessPage(page);
    // When the page renders
    await harness.open('responsive-image/failed');
    const photo = new ResponsiveImageComponent(harness.example('gallery photo'));
    // Then the slot holds .media-fallback with the image-failed icon and the alt text, and no <picture> or <img>
    await expect(photo.placeholder).toBeVisible();
    expect(await photo.placeholderIcon.drawing()).toBe(IMAGE_FAILED);
    await expect(photo.placeholderText).toHaveText(PORTRAIT);
    await expect(photo.picture).toHaveCount(0);
    await expect(photo.image).toHaveCount(0);
    // And the shot button is still named by the alt text
    await expect(
      new ButtonComponent(harness.example('gallery photo'), PORTRAIT).root,
    ).toBeVisible();
  });

  test('AC-12 the failing photo keeps its box exactly and shifts no layout', async ({ page }) => {
    // Given gallery photo 2 whose 404 arrives after a second
    const harness = new HarnessPage(page);
    await harness.open('responsive-image/failed', {
      held: { url: /\/missing\/gallery-2\//, ms: 1000, status: 404 },
    });
    const photo = new ResponsiveImageComponent(harness.example('gallery photo'));
    // When its box is measured before and after the error
    const before = await photo.boxes();
    await expect(photo.placeholder).toBeVisible();
    // Then the slot and host boxes are identical, and the fallback has the image's box
    const after = await photo.boxes();
    expect(after.slot).toEqual(before.slot);
    expect(after.host).toEqual(before.host);
    expect(after.media).toEqual(before.media);
  });

  test('AC-13 a decorative card photo that fails shows the icon and no text', async ({ page }) => {
    // Given Kensington Window Room's decorative card photo returning 404
    const harness = new HarnessPage(page);
    // When the card renders
    await harness.open('responsive-image/failed');
    const photo = new ResponsiveImageComponent(harness.example('card photo'));
    // Then the fallback shows the icon and no text
    await expect(photo.placeholder).toBeVisible();
    expect(await photo.placeholderIcon.drawing()).toBe(IMAGE_FAILED);
    expect((await photo.placeholderBox()).text).toBe('');
    await expect(photo.placeholderText).toHaveCount(0);
  });

  test('AC-14 a hero that failed before hydration shows the fallback once the page hydrates', async ({
    page,
  }) => {
    // Given The Junction Loft's hero returning 404 while the scripts are still loading
    const harness = new HarnessPage(page);
    // When hydration completes a second later
    await harness.open('responsive-image/failed', { hydrationDelayMs: 1000 });
    // Then the hero shows the fallback with its alt text
    const hero = new ResponsiveImageComponent(harness.example('hero'));
    await expect(hero.placeholder).toBeVisible();
    await expect(hero.placeholderText).toHaveText(HERO);
  });

  test('AC-15 a photo that fails in the lightbox fills the box the lightbox sized for it, with its alt text', async ({
    page,
  }) => {
    // Given photo 3 failing in the lightbox frame
    const harness = new HarnessPage(page);
    // When the viewer shows it
    await harness.open('responsive-image/failed');
    const photo = new ResponsiveImageComponent(harness.example('lightbox'));
    // Then the fallback fills the frame's box with the alt text
    await expect(photo.placeholderText).toHaveText(FASHION);
    const boxes = await photo.boxes();
    expect(boxes.media).toEqual(boxes.slot);
  });

  test('AC-17 a new image value renders the picture again and removes the fallback', async ({
    page,
  }) => {
    // Given the failed gallery photo
    const harness = new HarnessPage(page);
    await harness.open('responsive-image/failed');
    const photo = new ResponsiveImageComponent(harness.example('gallery photo'));
    await expect(photo.placeholder).toBeVisible();
    // When the application passes a working image
    await harness.toggle('Use a working photo');
    // Then the <picture> is back and the fallback is gone
    await expect(photo.picture).toHaveCount(1);
    await expect(photo.placeholder).toHaveCount(0);
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    test(`AC-20 the fallback's alt text is 4.5:1 and its icon 3:1 on --color-bg-photo in the ${theme} theme`, async ({
      page,
    }) => {
      // Given the failed informative gallery photo
      const harness = new HarnessPage(page);
      // When the contrast check runs in the ${theme} theme
      await harness.open('responsive-image/failed', { theme });
      const contrast = await new ResponsiveImageComponent(
        harness.example('gallery photo'),
      ).placeholderContrast();
      // Then the text is at least 4.5:1 and the icon at least 3:1
      expect(contrast.text).toBeGreaterThanOrEqual(4.5);
      expect(contrast.icon).toBeGreaterThanOrEqual(3);
    });

    for (const width of [320, 1280]) {
      test(`axe finds no violations in the loaded and failed routes at ${width}px in the ${theme} theme`, async ({
        page,
      }) => {
        // Given the routes in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans them
        await harness.open('responsive-image/default', { width, theme });
        const loaded = await harness.accessibilityViolations();
        await harness.open('responsive-image/failed', { width, theme });
        // Then it reports no violations
        expect(loaded).toEqual([]);
        expect(await harness.accessibilityViolations()).toEqual([]);
      });
    }
  }

  test("AC-21 at 320px the failed hero's alt text wraps inside its 3:2 slot with no sideways scroll", async ({
    page,
  }) => {
    // Given The Junction Loft's failed hero at 320px
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('responsive-image/failed', { width: 320 });
    const hero = new ResponsiveImageComponent(harness.example('hero'));
    await expect(hero.placeholderText).toHaveText(HERO);
    // Then the fallback has the slot's 3:2 box and the page does not scroll sideways
    const boxes = await hero.boxes();
    expect(boxes.media).toEqual(boxes.slot);
    expect(Math.round((boxes.slot.width * 2) / 3)).toBe(boxes.slot.height);
    expect(await harness.hasHorizontalScroll()).toBe(false);
  });

  test('AC-23 the image and its fallback fill the host, the host fills the slot, the image covers and keeps its dimensions', async ({
    page,
  }) => {
    // Given the hero in a 960 x 420 (16:7) box and a card photo in a 3:2 frame, loaded and failed
    const harness = new HarnessPage(page);
    for (const route of ['responsive-image/default', 'responsive-image/failed']) {
      // When each renders
      await harness.open(route);
      for (const name of ['hero', 'card photo']) {
        const photo = new ResponsiveImageComponent(harness.example(name));
        await expect(route.endsWith('failed') ? photo.placeholder : photo.image).toBeVisible();
        // Then media, host and slot have the same box
        const boxes = await photo.boxes();
        expect(boxes.host, `${route} ${name} host`).toEqual(boxes.slot);
        expect(boxes.media, `${route} ${name} media`).toEqual(boxes.host);
        if (!route.endsWith('failed')) {
          // And the loaded image covers its box and keeps its width and height attributes
          expect(await photo.objectFit()).toBe('cover');
          const attributes = await photo.imageAttributes();
          expect([attributes['width'], attributes['height']]).not.toContain(null);
        }
      }
      if (route.endsWith('default'))
        expect(await new ResponsiveImageComponent(harness.example('hero')).boxes()).toMatchObject({
          slot: { width: 960, height: 420 },
        });
    }
  });

  test.describe('performance (L2-071)', () => {
    // Measured on a shared machine with the CPU slowed 4x: a retry absorbs contention from parallel
    // workers, while a real regression fails every attempt.
    test.describe.configure({ retries: 2 });

    for (const route of ['responsive-image/performance', 'responsive-image/performance-failed']) {
      test(`AC-22 ${route} loads with LCP at most 2.5s and CLS at most 0.1`, async ({ page }) => {
        // Given the hero and eight gallery photos${route.endsWith('failed') ? ', two of them failing' : ''}
        const harness = new HarnessPage(page);
        // When the route loads on a mobile profile
        const metrics = await harness.loadMetrics(route);
        // Then LCP is at most 2.5s and CLS at most 0.1
        expect(metrics.lcp).toBeLessThanOrEqual(2500);
        expect(metrics.cls).toBeLessThanOrEqual(0.1);
      });
    }
  });
});
