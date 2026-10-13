import { Locator, Page } from '@playwright/test';

export class ShellPage {
  readonly skipLink: Locator;
  readonly main: Locator;

  constructor(private readonly page: Page) {
    this.skipLink = page.getByRole('link', { name: 'Skip to content' });
    this.main = page.getByRole('main');
  }

  async open(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  documentLanguage(): Promise<string | null> {
    return this.page.locator('html').getAttribute('lang');
  }

  async pressTab(): Promise<void> {
    await this.page.keyboard.press('Tab');
  }

  async activateFocused(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }
}
