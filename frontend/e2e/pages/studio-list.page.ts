import { Locator, Page } from '@playwright/test';

export class StudioListPage {
  readonly heading: Locator;
  readonly resultCount: Locator;
  readonly cards: Locator;
  readonly emptyState: Locator;
  readonly results: Locator;
  readonly loadingStatus: Locator;
  readonly skeletonCards: Locator;
  readonly errorAlert: Locator;
  readonly tryAgainButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.resultCount = page.getByRole('status').filter({ hasText: /studio/ });
    this.cards = page.getByRole('list', { name: 'Studios' }).getByRole('listitem');
    this.emptyState = page.getByRole('heading', { name: 'No studio reviews yet' });
    this.results = page.getByRole('region', { name: 'Results' });
    this.loadingStatus = page.getByRole('status').filter({ hasText: 'Loading studios…' });
    this.skeletonCards = page.locator('.location-card--skeleton');
    this.errorAlert = page.getByRole('alert').filter({ hasText: "We couldn't load the studios" });
    this.tryAgainButton = page.getByRole('button', { name: 'Try again' });
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
