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
    this.menuButton = page.getByRole('banner', { includeHidden: true }).getByRole('button', { name: 'Menu', includeHidden: true });
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
    return this.page.getByRole('banner').getByRole('navigation', { name: 'Primary' }).getByRole('link', { name, exact: true });
  }

  footerLink(name: string): Locator {
    return this.footer.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name });
  }

  menuLink(name: string): Locator {
    return this.menuDialog.getByRole('link', { name, exact: true });
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async menuButtonHeight(): Promise<number> {
    return (await this.menuButton.boundingBox())?.height ?? 0;
  }

  hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  }

  async accessibilityViolations(): Promise<string[]> {
    const results = await new AxeBuilder({ page: this.page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  }
}
