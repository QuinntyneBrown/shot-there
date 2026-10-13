import { Locator, Page } from '@playwright/test';

export class StudioListPage {
  readonly heading: Locator;
  readonly resultCount: Locator;
  readonly cards: Locator;
  readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.resultCount = page.getByRole('status').filter({ hasText: /studio/ });
    this.cards = page.getByRole('list', { name: 'Studios' }).getByRole('listitem');
    this.emptyState = page.getByRole('heading', { name: 'No studio reviews yet' });
  }

  async open(query = ''): Promise<void> {
    await this.page.goto(`/studios${query}`);
  }

  async cardNames(): Promise<string[]> {
    return this.cards.getByRole('heading').allInnerTexts();
  }

  card(name: string): Locator {
    return this.cards.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  cardLink(name: string): Locator {
    return this.card(name).getByRole('link', { name, exact: true });
  }
}
