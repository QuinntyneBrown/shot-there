import AxeBuilder from '@axe-core/playwright';
import { Locator, Page } from '@playwright/test';

export class ShellPage {
  readonly skipLink: Locator;
  readonly main: Locator;
  readonly menuButton: Locator;
  readonly menuDialog: Locator;
  readonly menuCloseButton: Locator;
  readonly footer: Locator;

  constructor(private readonly page: Page) {
    this.skipLink = page.getByRole('link', { name: 'Skip to content' });
    this.main = page.getByRole('main');
    // The open menu is modal, so the page behind it (and this button) leaves the accessibility tree.
    this.menuButton = page
      .getByRole('banner', { includeHidden: true })
      .getByRole('button', { name: 'Menu', includeHidden: true });
    this.menuDialog = page.getByRole('dialog', { name: 'Menu' });
    this.menuCloseButton = this.menuDialog.getByRole('button', { name: 'Close' });
    this.footer = page.getByRole('contentinfo');
  }

  async open(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async usePhoneWidth(): Promise<void> {
    await this.page.setViewportSize({ width: 320, height: 640 });
  }

  async useDesktopWidth(): Promise<void> {
    await this.page.setViewportSize({ width: 1280, height: 800 });
  }

  documentLanguage(): Promise<string | null> {
    return this.page.locator('html').getAttribute('lang');
  }

  /** Stores a theme choice the way the site remembers one, before the next page loads. */
  async rememberTheme(theme: 'light' | 'dark'): Promise<void> {
    await this.page.addInitScript((choice) => localStorage.setItem('theme', choice), theme);
  }

  documentTheme(): Promise<string | null> {
    return this.page.locator('html').getAttribute('data-theme');
  }

  /** Whether the page's text font, Figtree, was loaded from the site's own /fonts/. */
  async usesSelfHostedFigtree(): Promise<boolean> {
    const loaded = await this.page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].some(
        (face) => face.family.replace(/"/g, '') === 'Figtree' && face.status === 'loaded',
      );
    });
    const fromOwnHost = await this.page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .some(
          (entry) =>
            new URL(entry.name).origin === location.origin &&
            entry.name.includes('/fonts/figtree-'),
        ),
    );
    return loaded && fromOwnHost;
  }

  async pressTab(): Promise<void> {
    await this.page.keyboard.press('Tab');
  }

  async pressEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async activateFocused(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }

  headerLink(name: string): Locator {
    return this.page
      .getByRole('banner')
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name, exact: true });
  }

  headerLinks(): Promise<{ name: string; href: string | null }[]> {
    return this.linkList(
      this.page.getByRole('banner').getByRole('navigation', { name: 'Primary' }).getByRole('link'),
    );
  }

  menuLinks(): Promise<{ name: string; href: string | null }[]> {
    return this.menuDialog.getByRole('link').evaluateAll((links) =>
      links.map((link) => ({
        name: link.querySelector('.section-link__title')?.textContent?.trim() ?? '',
        href: link.getAttribute('href'),
      })),
    );
  }

  footerLink(name: string): Locator {
    return this.footer.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name });
  }

  private linkList(links: Locator): Promise<{ name: string; href: string | null }[]> {
    return links.evaluateAll((all) =>
      all.map((link) => ({
        name: link.textContent?.trim() ?? '',
        href: link.getAttribute('href'),
      })),
    );
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async menuButtonHeight(): Promise<number> {
    return (await this.menuButton.boundingBox())?.height ?? 0;
  }

  hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
  }

  async accessibilityViolations(): Promise<string[]> {
    const results = await new AxeBuilder({ page: this.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    return results.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
    );
  }
}
