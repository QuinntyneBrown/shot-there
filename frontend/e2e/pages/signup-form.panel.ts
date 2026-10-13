import { Locator, Page } from '@playwright/test';

/** One email signup form: the footer's, or the home page's. */
export class SignupFormPanel {
  readonly form: Locator;
  readonly email: Locator;
  readonly subscribeButton: Locator;
  readonly confirmation: Locator;

  constructor(page: Page, where: 'footer' | 'home') {
    const root = where === 'footer' ? page.getByRole('contentinfo') : page.getByRole('main');
    const title = where === 'footer' ? 'New reviews by email' : 'Get new reviews by email';
    this.form = root.getByRole('form', { name: title });
    this.email = this.form.getByRole('textbox', { name: 'Email address' });
    this.subscribeButton = this.form.getByRole('button', { name: 'Subscribe' });
    this.confirmation = root.getByRole('status');
  }

  async subscribe(email: string): Promise<void> {
    await this.email.fill(email);
    await this.subscribeButton.click();
  }
}
