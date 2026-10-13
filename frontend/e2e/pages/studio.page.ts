import { Locator, Page } from '@playwright/test';

export class StudioPage {
  readonly heading: Locator;
  readonly headings: Locator;
  readonly basics: Locator;
  readonly bookingLink: Locator;
  readonly pricing: Locator;
  readonly allInCost: Locator;
  readonly staleWarning: Locator;
  readonly notFoundHeading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.headings = page.getByRole('main').getByRole('heading', { level: 1 });
    this.basics = page.getByRole('main').locator('header');
    this.bookingLink = page.getByRole('link', { name: "Book on the studio's site (opens in a new tab)" });
    this.pricing = page.getByRole('region', { name: 'Pricing' });
    this.allInCost = this.pricing.locator('.price-block__allin');
    this.staleWarning = this.pricing.getByRole('status').filter({ hasText: 'Prices may be out of date' });
    this.notFoundHeading = page.getByRole('heading', { name: "We couldn't find that page" });
  }

  /** Pins today's date so "N days ago" copy is stable. */
  async todayIs(isoDate: string): Promise<void> {
    await this.page.clock.setFixedTime(new Date(`${isoDate}T12:00:00-04:00`));
  }

  async usePhoneWidth(): Promise<void> {
    await this.page.setViewportSize({ width: 320, height: 700 });
  }

  async open(slug: string): Promise<void> {
    await this.page.goto(`/studios/${slug}`);
  }

  priceRow(label: string): Locator {
    return this.pricing.locator('dt', { hasText: label }).locator('xpath=following-sibling::dd[1]');
  }

  title(): Promise<string> {
    return this.page.title();
  }

  hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  }
}
