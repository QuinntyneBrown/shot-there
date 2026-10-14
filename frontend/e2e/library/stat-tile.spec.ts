import { expect, test } from '@playwright/test';
import { StatTileComponent } from '../components/stat-tile.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('StatGrid and StatTile (ICD-002 §9.5, CRD stat-tile)', () => {
  test('renders a title heading at the given level, the counts and the slotted action in each tile', async ({ page }) => {
    // Given the dashboard tiles at heading level 3
    const harness = new HarnessPage(page);
    await harness.open('stat-tile/dashboard');
    const stats = new StatTileComponent(page);
    // Then there are three tiles, each with an h3 title, counts and an action link
    await expect(stats.tiles()).toHaveCount(3);
    await expect(page.getByRole('heading', { level: 3 })).toHaveText(['Studios', 'Spots', 'Guides']);
    await expect(stats.counts(stats.tile('Studios'))).toHaveText('7 published, 2 draft');
    await expect(stats.tile('Studios').getByRole('link', { name: 'New studio' })).toHaveAttribute('href', '/admin/studios/new');
    expect(harness.errors).toEqual([]);
  });

  test('makes the title a link only when a link is given', async ({ page }) => {
    // Given tiles with and without a link
    const harness = new HarnessPage(page);
    await harness.open('stat-tile/dashboard');
    const stats = new StatTileComponent(page);
    // Then Studios links to its list and Guides is plain text
    await expect(stats.titleHeading('Studios').getByRole('link')).toHaveAttribute('href', '/admin/studios');
    await expect(stats.titleHeading('Guides').getByRole('link')).toHaveCount(0);
  });

  test('lays tiles out in one column on phones and three from 768px', async ({ page }) => {
    // Given the dashboard
    const harness = new HarnessPage(page);
    await harness.open('stat-tile/dashboard', { width: 320 });
    const stats = new StatTileComponent(page);
    // Then one column at 320px
    expect(await stats.columns()).toBe(1);
    // And three at 1280px
    await harness.open('stat-tile/dashboard', { width: 1280 });
    expect(await stats.columns()).toBe(3);
  });

  test('renders skeleton tiles that are hidden from assistive technology while loading', async ({ page }) => {
    // Given the loading dashboard
    const harness = new HarnessPage(page);
    await harness.open('stat-tile/loading');
    const stats = new StatTileComponent(page);
    // Then three skeleton tiles are aria-hidden and only the status is read
    await expect(stats.skeletonTiles()).toHaveCount(3);
    await expect(stats.skeletonTiles().first()).toHaveAttribute('aria-hidden', 'true');
    await expect(page.getByRole('status')).toHaveText('Loading the dashboard');
  });

  for (const route of ['dashboard', 'loading']) {
    for (const theme of ['light', 'dark'] as HarnessTheme[]) {
      for (const width of [320, 1280]) {
        test(`${route} has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
          const harness = new HarnessPage(page);
          await harness.open('stat-tile/' + route, { width, theme });
          expect(await harness.accessibilityViolations()).toEqual([]);
          expect(await harness.hasHorizontalScroll()).toBe(false);
        });
      }
    }
  }
});
