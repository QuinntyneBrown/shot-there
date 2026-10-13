import { expect, test } from '@playwright/test';
import { IconComponent } from '../components/icon.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

/** The drawings on the DS icon sheet (foundations/iconography.html#sheet) for every IconName it draws. */
const SHEET: Record<string, string> = {
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  filters:
    '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  warning: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>',
  danger: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  'map-pin': '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
};

test.describe('IconComponent (ICD-002 §9.5, ICD-A11Y-7)', () => {
  test('draws every sheet icon exactly as the DS icon sheet, as decorative SVG', async ({ page }) => {
    // Given the harness renders st-icon once for each icon the DS sheet draws
    const harness = new HarnessPage(page);
    // When the sheet route opens
    await harness.open('icon/sheet');
    for (const [name, drawing] of Object.entries(SHEET)) {
      const icon = new IconComponent(harness.example(name));
      // Then each icon is a 24-unit SVG hidden from assistive technology
      await expect(icon.svg).toHaveAttribute('aria-hidden', 'true');
      await expect(icon.svg).toHaveAttribute('viewBox', '0 0 24 24');
      // And its shapes are the sheet's, copied exactly, and render as SVG
      expect(await icon.drawing(), name).toBe(drawing);
      expect(await icon.rendersShapes(), name).toBe(true);
    }
    // And the server-rendered page hydrates without errors
    expect(harness.errors).toEqual([]);
  });

  test('renders each size at its token: sm 16px, md 20px (default), lg 24px, xl 28px', async ({ page }) => {
    // Given the map pin at each size, and one with no size
    const harness = new HarnessPage(page);
    // When the sizes route opens
    await harness.open('icon/sizes');
    // Then each icon is a square at its size's token
    const expected = { sm: 16, default: 20, md: 20, lg: 24, xl: 28 };
    for (const [size, px] of Object.entries(expected)) {
      expect(await new IconComponent(harness.example(size)).size(), size).toEqual({ width: px, height: px });
    }
  });

  for (const theme of ['light', 'dark'] as HarnessTheme[]) {
    for (const width of [320, 1280]) {
      test(`has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
        // Given the icon sheet in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans it
        await harness.open('icon/sheet', { width, theme });
        // Then it finds no violations and nothing scrolls sideways
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }
});
