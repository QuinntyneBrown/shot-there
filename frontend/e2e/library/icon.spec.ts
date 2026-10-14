import { expect, test } from '@playwright/test';
import { ButtonComponent } from '../components/button.component';
import { FilterTriggerComponent } from '../components/filter-trigger.component';
import { IconComponent } from '../components/icon.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

/** The drawing table (docs/specs/components/icon.md, Variants and sizes): every IconName and its children. */
const SHEET: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  filters:
    '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  'map-pin':
    '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  'sign-out': '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
  home: '<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  'arrow-up': '<path d="M12 19V5m-6 6 6-6 6 6"/>',
  'arrow-down': '<path d="M12 5v14m-6-6 6 6 6-6"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  offline:
    '<path d="M3 3l18 18"/><path d="M5 12.5a10 10 0 0 1 4.5-2.7M14.5 9.8A10 10 0 0 1 19 12.5M8.5 16a5 5 0 0 1 7 0M12 20h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  warning: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>',
  danger: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/>',
  'image-failed':
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/>',
  tree: '<path d="M12 3 6 12h4l-4 6h12l-4-6h4z"/><path d="M12 18v3"/>',
  compare:
    '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>',
  guide:
    '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.5M4 12h.5M4 18h.5"/>',
};

const THEMES: HarnessTheme[] = ['light', 'dark'];

test.describe('IconComponent (ICD-002 §9.5)', () => {
  test('AC-1, AC-2 and the drawing table: every name renders exactly its drawing as hidden SVG', async ({
    page,
  }) => {
    // Given the harness renders st-icon once for each of the 37 IconName members
    const harness = new HarnessPage(page);
    // When the sheet route opens
    await harness.open('icon/sheet');
    for (const [name, drawing] of Object.entries(SHEET)) {
      const icon = new IconComponent(harness.example(name));
      // Then each is svg.icon, hidden from assistive technology, on the 24-unit grid, with no role, title or label
      await expect(icon.svg).toHaveAttribute('aria-hidden', 'true');
      await expect(icon.svg).toHaveAttribute('viewBox', '0 0 24 24');
      await expect(icon.svg).not.toHaveAttribute('role');
      await expect(icon.svg).not.toHaveAttribute('aria-label');
      // And its children are the drawing table's, exactly, rendered as SVG shapes
      expect(await icon.drawing(), name).toBe(drawing);
      expect(await icon.rendersShapes(), name).toBe(true);
    }
    // And the server-rendered page hydrates without errors
    expect(harness.errors).toEqual([]);
  });

  test('renders each size at its token: sm 16px, md 20px (default), lg 24px, xl 28px', async ({
    page,
  }) => {
    // Given the map pin at each size, and one with no size
    const harness = new HarnessPage(page);
    // When the sizes route opens
    await harness.open('icon/sizes');
    // Then each icon is a square at its size's token
    const expected = { sm: 16, default: 20, md: 20, lg: 24, xl: 28 };
    for (const [size, px] of Object.entries(expected)) {
      expect(await new IconComponent(harness.example(size)).size(), size).toEqual({
        width: px,
        height: px,
      });
    }
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('AC-3 the server HTML holds the external arrow inline, and no icon font or sprite is requested', async ({
      page,
    }) => {
      // Given "Book on the studio's site" with its external arrow, and JavaScript disabled
      const harness = new HarnessPage(page);
      const requests: string[] = [];
      page.on('request', (request) => requests.push(new URL(request.url()).pathname));
      // When the page is server-rendered
      await harness.open('icon/in-controls');
      // Then the link holds the external drawing as inline svg.icon
      const book = new ButtonComponent(
        page,
        "Book on the studio's site (opens in a new tab)",
        'link',
      );
      expect(await book.icon.drawing()).toBe(SHEET['external']);
      // And nothing that looks like an icon font or sprite was fetched
      expect(requests.filter((path) => /\.(woff2?|ttf|otf|svg)$/.test(path))).toEqual([]);
    });
  });

  test('AC-4, AC-5 an icon adds nothing to a name, and an icon-only control is named only by its label', async ({
    page,
  }) => {
    // Given "Try again" with a leading refresh icon and an icon-only Close with aria-label="Close"
    const harness = new HarnessPage(page);
    // When the accessibility tree is read
    await harness.open('icon/in-controls');
    // Then the button is named exactly "Try again"
    await expect(new ButtonComponent(page, 'Try again').root).toBeVisible();
    // And Close is named "Close" and its SVG contributes no node
    expect(await new ButtonComponent(page, 'Close').ariaTree()).toBe('- button "Close"');
  });

  test('AC-7 Tab lands on the Filters button once and never on its icon', async ({ page }) => {
    // Given the controls route with "Menu", "Filters", four chip removers, "Try again", "Close" and the links
    const harness = new HarnessPage(page);
    await harness.open('icon/in-controls');
    // When a keyboard user tabs through the page
    const stops = await harness.tabSequence(9);
    // Then "Filters" takes focus exactly once and no stop is an SVG
    expect(stops.filter((stop) => stop === 'button Filters')).toHaveLength(1);
    expect(stops.filter((stop) => stop.startsWith('svg'))).toEqual([]);
    await expect(new FilterTriggerComponent(page, 'Filters').root).toBeVisible();
  });

  for (const theme of THEMES) {
    test(`AC-8 status glyphs keep 3:1 on their status ground in the ${theme} theme`, async ({
      page,
    }) => {
      // Given the warning alert glyph on --color-warning-bg and the error circle's danger glyph on --color-danger-bg
      const harness = new HarnessPage(page);
      // When the contrast check runs in the ${theme} theme
      await harness.open('icon/tones', { theme });
      // Then each glyph is at least 3:1 against its ground
      expect(
        await new IconComponent(harness.example('warning alert')).strokeContrast(),
      ).toBeGreaterThanOrEqual(3);
      expect(
        await new IconComponent(harness.example('error circle')).strokeContrast(),
      ).toBeGreaterThanOrEqual(3);
    });

    test(`AC-9 the success toast glyph is --color-fg-inverse at 4.5:1 in the ${theme} theme`, async ({
      page,
    }) => {
      // Given the "Link copied" success toast glyph
      const harness = new HarnessPage(page);
      // When it renders in the ${theme} theme
      await harness.open('icon/tones', { theme });
      const icon = new IconComponent(harness.example('success toast'));
      // Then its stroke is --color-fg-inverse, at least 4.5:1 against --color-bg-inverse
      expect(await icon.stroke()).toBe(await harness.tokenColour('--color-fg-inverse'));
      expect(await icon.strokeContrast()).toBeGreaterThanOrEqual(4.5);
    });

    for (const width of [320, 1280]) {
      test(`AC-6 axe finds no violations among icons at ${width}px in the ${theme} theme`, async ({
        page,
      }) => {
        // Given the sheet and the controls holding icons in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        // When axe scans each route
        await harness.open('icon/sheet', { width, theme });
        const sheet = await harness.accessibilityViolations();
        await harness.open('icon/in-controls', { width, theme });
        // Then it finds no violations and nothing scrolls sideways
        expect(sheet).toEqual([]);
        expect(await harness.accessibilityViolations()).toEqual([]);
        expect(await harness.hasHorizontalScroll()).toBe(false);
      });
    }
  }

  test.describe('performance (L2-071)', () => {
    // Measured on a shared machine with the CPU slowed 4x: a retry absorbs contention from parallel
    // workers, while a real regression fails every attempt.
    test.describe.configure({ retries: 2 });

    test('AC-10 60 icons render within the L2-071 budget: LCP at most 2.5s and no layout shift', async ({
      page,
    }) => {
      // Given the icon/performance route with the studio list's chrome and cards' icons, 60 in all
      const harness = new HarnessPage(page);
      // When it loads on a mobile profile
      const metrics = await harness.loadMetrics('icon/performance');
      // Then LCP is at most 2.5s and CLS is 0
      expect(metrics.lcp).toBeLessThanOrEqual(2500);
      expect(metrics.cls).toBe(0);
    });
  });
});
