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
  readonly specifications: Locator;
  readonly gear: Locator;
  readonly logistics: Locator;
  readonly lightRatings: Locator;
  readonly verdict: Locator;
  readonly overallScore: Locator;
  readonly rubricScores: Locator;
  readonly disclosure: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.headings = page.getByRole('main').getByRole('heading', { level: 1 });
    this.basics = page.getByRole('main').locator('header');
    this.bookingLink = page.getByRole('link', { name: "Book on the studio's site (opens in a new tab)" });
    this.pricing = page.getByRole('region', { name: 'Pricing' });
    this.allInCost = this.pricing.locator('.price-block__allin');
    this.staleWarning = this.pricing.getByRole('status').filter({ hasText: 'Prices may be out of date' });
    this.notFoundHeading = page.getByRole('heading', { name: "We couldn't find that page" });
    this.specifications = page.getByRole('region', { name: 'Measured specifications' });
    this.gear = page.getByRole('region', { name: 'Gear' });
    this.logistics = page.getByRole('region', { name: 'Logistics' });
    this.verdict = page.getByRole('region', { name: 'Verdict' });
    this.overallScore = this.verdict.locator('.score-overall');
    // Each score's text for assistive technology, e.g. "Light: 5 out of 5".
    this.rubricScores = this.verdict.getByRole('list', { name: 'Rubric scores' }).locator('li .st-visually-hidden');
    this.disclosure = this.verdict.getByRole('note', { name: 'How this session was paid for' });
    this.lightRatings = this.specifications.getByRole('list', { name: 'Natural light by time of day' }).getByRole('listitem');
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
    return this.row(this.pricing, label);
  }

  /** The value beside a label in a section's description list. */
  row(section: Locator, label: string): Locator {
    return section.locator('dt', { hasText: new RegExp(`^${label}$`) }).locator('xpath=following-sibling::dd[1]');
  }

  /** The verdict's "Who it's for" or "Who should skip it" text. */
  verdictPart(label: string): Locator {
    return this.row(this.verdict, label);
  }

  /** Whether a row's value sits beside its label or below it. */
  async rowLayout(section: Locator, label: string): Promise<'side-by-side' | 'stacked'> {
    const dt = await section.locator('dt', { hasText: new RegExp(`^${label}$`) }).boundingBox();
    const dd = await this.row(section, label).boundingBox();
    return dt && dd && dd.y >= dt.y + dt.height - 1 ? 'stacked' : 'side-by-side';
  }

  /** How many distinct rows the natural-light ratings occupy. */
  async lightRatingRowCount(): Promise<number> {
    const tops = await this.lightRatings.evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)));
    return new Set(tops).size;
  }

  async useWidth(width: number): Promise<void> {
    await this.page.setViewportSize({ width, height: 900 });
  }

  title(): Promise<string> {
    return this.page.title();
  }

  hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  }
}
