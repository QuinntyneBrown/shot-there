import { expect, test } from '@playwright/test';
import { BreadcrumbComponent } from '../components/breadcrumb.component';
import { PageHeaderComponent } from '../components/page-header.component';
import { SectionLinksComponent } from '../components/section-links.component';
import { SiteFooterComponent } from '../components/site-footer.component';
import { SiteHeaderComponent } from '../components/site-header.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

test.describe('Navigation components (ICD-002 §9.3)', () => {
  test('site header shows the wordmark with its tag, the links, and external links open in a new tab', async ({ page }) => {
    // Given the public header at desktop width
    const harness = new HarnessPage(page);
    await harness.open('site-header/default');
    const header = new SiteHeaderComponent(page, 'Primary');
    // Then the wordmark carries the tag and the links are in the nav
    await expect(header.wordmark()).toContainText('ShotThere');
    await expect(header.wordmark()).toContainText('Toronto');
    await expect(header.link('Studios')).toHaveAttribute('href', '/studios');
    await expect(header.link('YouTube')).toHaveAttribute('target', '_blank');
    await expect(header.link('YouTube')).toHaveAttribute('rel', 'noopener');
    // And the menu button is hidden from MD up
    await expect(header.menuButton).toBeHidden();
    expect(harness.errors).toEqual([]);
  });

  test('site header on a phone hides the links, shows the menu button and reports its press', async ({ page }) => {
    // Given the header at 360px
    const harness = new HarnessPage(page);
    await harness.open('site-header/default', { width: 360 });
    const header = new SiteHeaderComponent(page, 'Primary');
    // Then the links are hidden and the menu button controls the site menu
    await expect(header.link('Studios')).toBeHidden();
    await expect(header.menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(header.menuButton).toHaveAttribute('aria-controls', 'site-menu');
    // When it is pressed
    await header.menuButton.click();
    // Then the application hears it
    await expect.poll(() => harness.activations()).toEqual(['menuToggled']);
  });

  test('site footer lists its links, brand, tagline and copy line', async ({ page }) => {
    // Given the footer
    const harness = new HarnessPage(page);
    await harness.open('site-footer/default');
    const footer = new SiteFooterComponent(page, 'Footer');
    // Then the nav holds the links and the copy line shows
    await expect(footer.nav.getByRole('link')).toHaveCount(2);
    await expect(footer.nav.getByRole('link', { name: 'YouTube channel' })).toHaveAttribute('target', '_blank');
    await expect(footer.copy()).toHaveText('© 2026 ShotThere');
    await expect(footer.root).toContainText('Toronto photo locations, shot first-hand.');
  });

  test('breadcrumb marks the last item as current without a link, and keeps links when not current', async ({ page }) => {
    // Given the three breadcrumbs
    const harness = new HarnessPage(page);
    await harness.open('breadcrumb/states');
    const crumbs = new BreadcrumbComponent(page, 'Breadcrumb');
    // Then the last item is the current page and only the first is a link
    expect(await crumbs.crumbs()).toEqual(['Studios', 'The Junction Loft']);
    await expect(crumbs.current()).toHaveText('The Junction Loft');
    await expect(crumbs.links()).toHaveText(['Studios']);
    // And when loading, the label stays readable
    const loading = new BreadcrumbComponent(page, 'Loading crumbs');
    await expect(loading.nav.locator('.visually-hidden')).toHaveText('The Junction Loft');
    // And when not current, nothing is current
    await expect(new BreadcrumbComponent(page, 'No current').current()).toHaveCount(0);
  });

  test('section links are full-row links with a meta line, and attention highlights it', async ({ page }) => {
    // Given the dashboard section links
    const harness = new HarnessPage(page);
    await harness.open('section-links/default');
    const links = new SectionLinksComponent(page, 'Sections');
    // Then each row links and shows its meta, and the stale row carries the highlight
    await expect(links.row('Studios')).toHaveAttribute('href', '/admin/studios');
    await expect(links.row('Studios')).toContainText('7 published');
    await expect(links.row('Needs re-verification')).toHaveAttribute('data-highlight', '');
  });

  test('page header renders the h1, subtitle and actions, and a loading title as hidden text plus skeleton', async ({ page }) => {
    // Given the page headers
    const harness = new HarnessPage(page);
    await harness.open('page-header/states');
    const header = new PageHeaderComponent(page, 'Studios');
    // Then it has the h1, the subtitle and the action
    await expect(header.heading()).toHaveText('Studios');
    await expect(header.subtitle()).toHaveText('Draft · Last saved 4:12 pm');
    await expect(header.root.getByRole('button', { name: 'New studio' })).toBeVisible();
    // And the loading header keeps one named h1
    await expect(page.getByRole('heading', { level: 1, name: 'Loading studio' })).toHaveCount(1);
  });

  for (const route of ['site-header/default', 'site-footer/default', 'breadcrumb/states', 'section-links/default', 'page-header/states']) {
    for (const theme of ['light', 'dark'] as HarnessTheme[]) {
      for (const width of [320, 1280]) {
        test(`${route} has no WCAG A/AA violations at ${width}px in the ${theme} theme`, async ({ page }) => {
          const harness = new HarnessPage(page);
          await harness.open(route, { width, theme });
          expect(await harness.accessibilityViolations()).toEqual([]);
          expect(await harness.hasHorizontalScroll()).toBe(false);
        });
      }
    }
  }
});
