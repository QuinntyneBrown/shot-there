import { expect, test } from './fakes/test';
import { ShellPage } from './pages/shell.page';

test.describe('App shell', () => {
  test('declares the document language as Canadian English', async ({ page }) => {
    // Given the home page
    const shell = new ShellPage(page);
    // When it loads
    await shell.open();
    // Then the document language is en-CA
    expect(await shell.documentLanguage()).toBe('en-CA');
  });

  test('offers a skip link that moves focus to the main content', async ({ page }) => {
    // Given the home page
    const shell = new ShellPage(page);
    await shell.open();
    // When the visitor presses Tab once
    await shell.pressTab();
    // Then the skip link is focused
    await expect(shell.skipLink).toBeFocused();
    // When they activate it
    await shell.activateFocused();
    // Then focus is on the main landmark
    await expect(shell.main).toBeFocused();
  });

  test('applies the theme a visitor saved before the page paints', async ({ page }) => {
    // Given a visitor who chose the dark theme
    const shell = new ShellPage(page);
    await shell.rememberTheme('dark');
    // When they open the home page
    await shell.open();
    // Then the document is dark
    expect(await shell.documentTheme()).toBe('dark');
  });

  test('sets text in Figtree served by the site itself', async ({ page }) => {
    // Given the home page
    const shell = new ShellPage(page);
    // When it loads
    await shell.open();
    // Then its text font is the self-hosted Figtree
    expect(await shell.usesSelfHostedFigtree()).toBe(true);
  });
});

test.describe('Site header', () => {
  test('shows the primary links inline on a desktop', async ({ page }) => {
    // Given a desktop-width window
    const shell = new ShellPage(page);
    await shell.useDesktopWidth();
    // When the home page loads
    await shell.open();
    // Then the primary links show inline, in order, and there is no Menu button
    expect(await shell.headerLinks()).toEqual([
      { name: 'Studios', href: '/studios' },
      { name: 'Spots', href: '/spots' },
      { name: 'Map', href: '/map' },
      { name: 'Compare', href: '/compare' },
      { name: 'Guides', href: '/guides' },
    ]);
    await expect(shell.menuButton).toBeHidden();
  });

  test('collapses the links into a Menu at phone width', async ({ page }) => {
    // Given a 320px-wide window
    const shell = new ShellPage(page);
    await shell.usePhoneWidth();
    await shell.open();
    // Then the links are hidden behind a closed Menu button at least 44px tall
    await expect(shell.headerLink('Studios')).toBeHidden();
    await expect(shell.menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(await shell.menuButtonHeight()).toBeGreaterThanOrEqual(44);
    // When the visitor opens the menu
    await shell.openMenu();
    // Then the menu lists the site's pages and the editorial policy, and reports it is open
    await expect(shell.menuDialog).toBeVisible();
    expect(await shell.menuLinks()).toEqual([
      { name: 'Studios', href: '/studios' },
      { name: 'Spots', href: '/spots' },
      { name: 'Map', href: '/map' },
      { name: 'Compare', href: '/compare' },
      { name: 'Guides', href: '/guides' },
      { name: 'Editorial policy', href: '/editorial-policy' },
    ]);
    await expect(shell.menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('closes the menu with Escape and returns focus to the Menu button', async ({ page }) => {
    // Given the menu is open at phone width
    const shell = new ShellPage(page);
    await shell.usePhoneWidth();
    await shell.open();
    await shell.openMenu();
    await expect(shell.menuDialog).toBeVisible();
    // When the visitor presses Escape
    await shell.pressEscape();
    // Then the menu closes and focus returns to the Menu button
    await expect(shell.menuDialog).toBeHidden();
    await expect(shell.menuButton).toBeFocused();
    await expect(shell.menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes the menu with the Close button', async ({ page }) => {
    // Given the menu is open at phone width
    const shell = new ShellPage(page);
    await shell.usePhoneWidth();
    await shell.open();
    await shell.openMenu();
    // When the visitor presses Close
    await shell.menuCloseButton.click();
    // Then the menu closes and focus returns to the Menu button
    await expect(shell.menuDialog).toBeHidden();
    await expect(shell.menuButton).toBeFocused();
  });

  test('closes the menu with the backdrop', async ({ page }) => {
    // Given the menu is open at phone width
    const shell = new ShellPage(page);
    await shell.usePhoneWidth();
    await shell.open();
    await shell.openMenu();
    await shell.useBackdropWidth();
    // When the visitor clicks the backdrop
    await shell.clickMenuBackdrop();
    // Then the menu closes
    await expect(shell.menuDialog).toBeHidden();
    await expect(shell.menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes the menu when a navigation link is followed', async ({ page }) => {
    // Given the menu is open at phone width
    const shell = new ShellPage(page);
    await shell.usePhoneWidth();
    await shell.open();
    await shell.openMenu();
    // When the visitor follows a menu link
    await shell.menuLink('Spots').click();
    // Then navigation completes and the menu closes
    await expect(page).toHaveURL('/spots');
    await expect(shell.menuDialog).toBeHidden();
    await expect(shell.menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const width of [320, 1280]) {
      test(`has no accessibility violations with the menu open at ${width}px in ${theme} theme`, async ({
        page,
      }) => {
        // Given the menu open in a theme and viewport
        const shell = new ShellPage(page);
        await shell.rememberTheme(theme);
        await shell.usePhoneWidth();
        await shell.open();
        await shell.openMenu();
        if (width === 1280) await shell.useDesktopWidth();
        // Then axe finds no WCAG A/AA violations
        await expect(shell.menuDialog).toBeVisible();
        expect(await shell.accessibilityViolations()).toEqual([]);
      });
    }
  }

  for (const theme of ['light', 'dark'] as const) {
    for (const width of [320, 768, 1280]) {
      test(`lays out without horizontal scrolling or accessibility violations at ${width}px in ${theme} theme`, async ({
        page,
      }) => {
        // Given a window of this width and theme
        const shell = new ShellPage(page);
        await shell.rememberTheme(theme);
        await page.setViewportSize({ width, height: 800 });
        // When the home page loads
        await shell.open();
        await expect(shell.skipLink).toBeAttached();
        // Then the page does not scroll sideways and axe finds no WCAG A/AA violations
        expect(await shell.hasHorizontalScroll()).toBe(false);
        expect(await shell.accessibilityViolations()).toEqual([]);
      });
    }
  }

  test('keeps working at 200% zoom', async ({ page }) => {
    // Given a 1280px window at 200% zoom (a 640px CSS viewport)
    const shell = new ShellPage(page);
    await page.setViewportSize({ width: 640, height: 400 });
    // When the home page loads
    await shell.open();
    // Then the menu is still reachable and nothing scrolls sideways
    await expect(shell.menuButton).toBeVisible();
    expect(await shell.hasHorizontalScroll()).toBe(false);
  });
});

test.describe('Site footer', () => {
  test('closes every page with the site promise and footer links', async ({ page }) => {
    // Given any page
    const shell = new ShellPage(page);
    // When it loads
    await shell.open();
    // Then the contentinfo landmark holds the promise, the footer links and the policy line
    await expect(shell.footer).toContainText('Nothing is listed unless it has been shot there.');
    await expect(shell.footerLink('Studios')).toHaveAttribute('href', '/studios');
    await expect(shell.footerLink('Spots')).toHaveAttribute('href', '/spots');
    await expect(shell.footerLink('Guides')).toHaveAttribute('href', '/guides');
    await expect(shell.footerLink('Editorial policy')).toHaveAttribute('href', '/editorial-policy');
    const youtubeLink = shell.footerLink('YouTube channel (opens in a new tab)');
    await expect(youtubeLink).toHaveAttribute('target', '_blank');
    await expect(youtubeLink).toHaveAttribute('rel', 'noopener');
    await expect(youtubeLink).toHaveAccessibleName('YouTube channel (opens in a new tab)');
    await expect(shell.footer).toContainText(
      'No paid placement: order comes only from the sort you choose.',
    );
  });
});
