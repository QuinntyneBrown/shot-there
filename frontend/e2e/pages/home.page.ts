import { Locator, Page } from '@playwright/test';

import { SignupFormPanel } from './signup-form.panel';

export class HomePage {
  readonly heading: Locator;
  readonly signup: SignupFormPanel;
  readonly latestReviews: Locator;
  readonly latestCards: Locator;
  readonly allStudiosLink: Locator;
  readonly firstReviewsComing: Locator;
  readonly emailMeLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.signup = new SignupFormPanel(page, 'home');
    this.latestReviews = page.getByRole('region', { name: 'Latest reviews' });
    this.latestCards = this.latestReviews.getByRole('listitem');
    this.allStudiosLink = this.latestReviews.getByRole('link', { name: 'All studios' });
    this.firstReviewsComing = this.latestReviews.getByRole('heading', {
      name: 'The first studio reviews are coming',
    });
    this.emailMeLink = this.latestReviews.getByRole('link', {
      name: 'Get an email when they go up',
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  card(name: string): Locator {
    return this.latestCards.filter({ has: this.page.getByRole('link', { name, exact: true }) });
  }

  cardNames(): Promise<string[]> {
    return this.latestCards.getByRole('heading').allInnerTexts();
  }

  title(): Promise<string> {
    return this.page.title();
  }
}
