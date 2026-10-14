import { Locator, Page } from '@playwright/test';

export class NotFoundPage {
  readonly heading: Locator;
  readonly homeLink: Locator;
  readonly browseStudiosLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.homeLink = page.getByRole('main').getByRole('link', { name: 'Go to the home page' });
    this.browseStudiosLink = page.getByRole('main').getByRole('link', { name: 'Browse studios' });
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path);
  }

  title(): Promise<string> {
    return this.page.title();
  }
}
