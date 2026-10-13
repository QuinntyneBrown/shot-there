import { givenSubscribeAnswers } from './fakes/fake-subscribers-api';
import { expect, test } from './fakes/test';
import { EditorialPolicyPage } from './pages/editorial-policy.page';
import { SignupFormPanel } from './pages/signup-form.panel';

test.describe('Email signup', () => {
  test('subscribes from the footer and confirms inline', async ({ page }) => {
    // Given the server accepts subscriptions
    const received = await givenSubscribeAnswers(page, 200);
    await new EditorialPolicyPage(page).open();
    const signup = new SignupFormPanel(page, 'footer');
    // When the visitor subscribes from the footer
    await signup.subscribe('maya.chen@example.com');
    // Then the form is replaced by a confirmation in a status region
    await expect(signup.confirmation).toHaveText("You're subscribed. We'll email maya.chen@example.com when a new review goes up.");
    await expect(signup.form).toBeHidden();
    // And the server received the address, the page it came from and the empty honeypot
    expect(received).toEqual([{ email: 'maya.chen@example.com', sourcePath: '/editorial-policy', website: '' }]);
  });

  test('marks an empty address invalid without sending it', async ({ page }) => {
    // Given the footer form
    const received = await givenSubscribeAnswers(page, 200);
    await new EditorialPolicyPage(page).open();
    const signup = new SignupFormPanel(page, 'footer');
    // When the visitor submits it empty
    await signup.subscribe('');
    // Then the field is invalid, described by the message and focused, and nothing was sent
    await expect(signup.email).toHaveAttribute('aria-invalid', 'true');
    await expect(signup.email).toHaveAccessibleDescription('Enter your email address');
    await expect(signup.email).toBeFocused();
    expect(received).toEqual([]);
  });

  test('asks for a valid address when the email is malformed', async ({ page }) => {
    // Given the footer form
    const received = await givenSubscribeAnswers(page, 200);
    await new EditorialPolicyPage(page).open();
    const signup = new SignupFormPanel(page, 'footer');
    // When the visitor submits "not-an-email"
    await signup.subscribe('not-an-email');
    // Then the field asks for a valid address and nothing was sent
    await expect(signup.email).toHaveAttribute('aria-invalid', 'true');
    await expect(signup.email).toHaveAccessibleDescription('Enter a valid email address, like name@example.com');
    expect(received).toEqual([]);
    // When they correct it and submit again
    await signup.subscribe('maya.chen@example.com');
    // Then it is sent and confirmed
    await expect(signup.confirmation).toContainText("You're subscribed.");
    expect(received).toHaveLength(1);
  });

  test('stacks the field and button at full width at phone width', async ({ page }) => {
    // Given a 320px-wide window
    await page.setViewportSize({ width: 320, height: 640 });
    // When a page with the footer form loads
    await new EditorialPolicyPage(page).open();
    const signup = new SignupFormPanel(page, 'footer');
    // Then the button sits below the field and is as wide as it
    const field = await signup.email.boundingBox();
    const button = await signup.subscribeButton.boundingBox();
    expect(button!.y).toBeGreaterThan(field!.y + field!.height - 1);
    expect(Math.round(button!.width)).toBe(Math.round(field!.width));
  });
});
