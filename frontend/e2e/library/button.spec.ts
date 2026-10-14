import { expect, test } from '@playwright/test';
import { ButtonComponent } from '../components/button.component';
import { HarnessPage, HarnessTheme } from '../pages/harness.page';

const THEMES: HarnessTheme[] = ['light', 'dark'];

test.describe('ButtonComponent: rendering, sizes and layout (CRD button, ICD-002 §9.1)', () => {
  test('AC-1 a primary submit button is the native button itself with btn btn--primary and its label as name', async ({
    page,
  }) => {
    // Given <button st-button variant="primary" type="submit">Save changes</button>
    const harness = new HarnessPage(page);
    // When the variants route renders
    await harness.open('button/variants');
    // Then the element named "Save changes" is a native submit button carrying btn btn--primary, with no wrapper
    const save = new ButtonComponent(page, 'Save changes');
    expect(await save.tag()).toBe('button');
    await expect(save.root).toHaveAttribute('type', 'submit');
    expect(await save.classes()).toEqual(['btn', 'btn--primary']);
    expect(harness.errors).toEqual([]);
  });

  test('AC-2 each variant adds its modifier and secondary adds none', async ({ page }) => {
    // Given secondary, ghost, ghost-danger, link and danger buttons
    const harness = new HarnessPage(page);
    // When the variants route renders
    await harness.open('button/variants');
    // Then they carry btn, btn--ghost, btn--ghost-danger, btn--link and btn--danger
    expect(await new ButtonComponent(page, 'Apply filters').classes()).toEqual(['btn']);
    expect(await new ButtonComponent(page, 'Remove Cleaning fee').classes()).toEqual([
      'btn',
      'btn--ghost',
    ]);
    expect(
      await new ButtonComponent(harness.example('status panel'), 'Delete studio').classes(),
    ).toEqual(['btn', 'btn--ghost-danger']);
    expect(await new ButtonComponent(page, 'Clear all').classes()).toEqual(['btn', 'btn--link']);
    expect(await new ButtonComponent(harness.example('dialog'), 'Delete studio').classes()).toEqual(
      ['btn', 'btn--danger'],
    );
  });

  test('AC-3 a[st-button] stays a link with its href, target and rel, named with the hidden suffix', async ({
    page,
  }) => {
    // Given a primary external link drawn as a button, with the external icon and the hidden suffix
    const harness = new HarnessPage(page);
    // When the link route renders
    await harness.open('button/link');
    // Then it is a link with btn btn--primary that keeps href, target and rel
    const book = new ButtonComponent(
      page,
      "Book on the studio's site (opens in a new tab)",
      'link',
    );
    expect(await book.classes()).toEqual(['btn', 'btn--primary']);
    await expect(book.root).toHaveAttribute('href', 'https://thejunctionloft.example/book');
    await expect(book.root).toHaveAttribute('target', '_blank');
    await expect(book.root).toHaveAttribute('rel', 'noopener');
    // And its arrow is hidden from assistive technology and sized 1.25em of the 16px label
    await expect(book.icon.svg).toHaveAttribute('aria-hidden', 'true');
    expect(await book.icon.size()).toEqual({ width: 20, height: 20 });
  });

  test('AC-6 a button without pressed has neither aria-pressed nor the toggle class', async ({
    page,
  }) => {
    // Given "Apply filters" with no pressed input
    const harness = new HarnessPage(page);
    // When it renders
    await harness.open('button/variants');
    // Then it is not a toggle
    const apply = new ButtonComponent(page, 'Apply filters');
    await expect(apply.root).not.toHaveAttribute('aria-pressed');
    expect(await apply.isToggle()).toBe(false);
  });

  test('sizes: 36px small, 44px medium by default and 52px large from 48rem', async ({ page }) => {
    // Given one button at each size
    const harness = new HarnessPage(page);
    // When the sizes route opens at 1280px
    await harness.open('button/sizes', { width: 1280 });
    // Then the heights follow --control-height-sm/md/lg and the modifiers are set
    expect((await new ButtonComponent(page, 'Save changes').size()).height).toBe(44);
    expect((await new ButtonComponent(page, 'Sign in').size()).height).toBe(52);
    expect(await new ButtonComponent(page, 'Sign in').classes()).toEqual([
      'btn',
      'btn--primary',
      'btn--lg',
    ]);
  });

  test('AC-18 at 1280px a small button is 36px tall and no button is smaller than 24 x 24', async ({
    page,
  }) => {
    // Given the editor row's small "Edit Ossington Blackbox prices" and the other sizes
    const harness = new HarnessPage(page);
    // When they are measured at 1280px
    await harness.open('button/sizes', { width: 1280 });
    const edit = new ButtonComponent(page, 'Edit Ossington Blackbox prices');
    // Then the small button is .btn--sm and 36px tall
    expect(await edit.classes()).toEqual(['btn', 'btn--sm']);
    expect((await edit.size()).height).toBe(36);
    // And every button is at least 24 x 24
    for (const name of ['Edit Ossington Blackbox prices', 'Save changes', 'Sign in', 'Close']) {
      const size = await new ButtonComponent(page, name).size();
      expect(Math.min(size.width, size.height), name).toBeGreaterThanOrEqual(24);
    }
  });

  test('AC-17 at 360px a small toggle and a small "Move up" are at least 44 x 44', async ({
    page,
  }) => {
    // Given a card's small "Compare" toggle and an editor row's small "Move up"
    const harness = new HarnessPage(page);
    // When they are measured at 360px
    await harness.open('button/pressed', { width: 360 });
    const compare = await new ButtonComponent(page, 'Compare Kensington Window Room').size();
    await harness.open('button/soft-disabled', { width: 360 });
    const moveUp = await new ButtonComponent(page, 'Move up test shot 2').size();
    // Then each is at least 44 x 44
    for (const size of [compare, moveUp]) {
      expect(size.width).toBeGreaterThanOrEqual(44);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('iconOnly: the ghost Close is a 44px square named by its aria-label, and 36px when small from 48rem', async ({
    page,
  }) => {
    // Given <button st-button variant="ghost" iconOnly aria-label="Close"> and a small one
    const harness = new HarnessPage(page);
    // When the icon-only route renders at 1280px
    await harness.open('button/icon-only');
    // Then Close is btn btn--ghost btn--icon, 44 x 44, and the small one 36 x 36
    const close = new ButtonComponent(harness.example('md'), 'Close');
    expect(await close.classes()).toEqual(['btn', 'btn--ghost', 'btn--icon']);
    expect(await close.size()).toEqual({ width: 44, height: 44 });
    expect(await new ButtonComponent(harness.example('sm'), 'Close').size()).toEqual({
      width: 36,
      height: 36,
    });
  });

  test('iconOnly: a small icon-only button grows to 44 x 44 below 48rem', async ({ page }) => {
    // Given the small icon-only Close
    const harness = new HarnessPage(page);
    // When the icon-only route renders at 360px
    await harness.open('button/icon-only', { width: 360 });
    // Then it is 44 x 44
    expect(await new ButtonComponent(harness.example('sm'), 'Close').size()).toEqual({
      width: 44,
      height: 44,
    });
  });

  test('block fills its container', async ({ page }) => {
    // Given a block "Sign in" button in a 320px container
    const harness = new HarnessPage(page);
    // When the block route opens
    await harness.open('button/block');
    // Then it is .btn--block and 320px wide
    const signIn = new ButtonComponent(page, 'Sign in');
    expect(await signIn.classes()).toEqual(['btn', 'btn--primary', 'btn--block']);
    expect((await signIn.size()).width).toBe(320);
  });

  test('AC-19 at 320px the block "Sign in" and "Show 7 studios" fit untruncated with no sideways scroll', async ({
    page,
  }) => {
    // Given the block "Sign in" and the sheet footer's "Show 7 studios"
    const harness = new HarnessPage(page);
    // When the block route renders at 320px
    await harness.open('button/block', { width: 320 });
    // Then each label fits its button and the page does not scroll sideways
    expect(await new ButtonComponent(page, 'Sign in').labelFits()).toBe(true);
    expect(await new ButtonComponent(page, 'Show 7 studios').labelFits()).toBe(true);
    expect(await harness.hasHorizontalScroll()).toBe(false);
  });

  test('AC-20 at 200% zoom "Book on the studio\'s site" and "Add to compare" are fully visible and operable', async ({
    page,
  }) => {
    // Given The Junction Loft's summary actions in a 1280px window at 200% zoom (640 CSS px)
    const harness = new HarnessPage(page);
    await harness.open('button/pressed', { width: 640 });
    const book = new ButtonComponent(
      page,
      "Book on the studio's site (opens in a new tab)",
      'link',
    );
    const add = new ButtonComponent(page, 'Add to compare');
    // When the visitor reaches them
    // Then both are fully visible, the page does not scroll sideways, and "Add to compare" toggles
    expect(await book.isFullyInView()).toBe(true);
    expect(await add.isFullyInView()).toBe(true);
    expect(await harness.hasHorizontalScroll()).toBe(false);
    await add.click();
    await expect(new ButtonComponent(page, 'Remove from compare').root).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('AC-13 keyboard focus draws the 2px ring 3px outside in --color-focus-ring at 3:1, and a mouse click draws none', async ({
    page,
  }) => {
    // Given "Apply filters" on the page
    const harness = new HarnessPage(page);
    await harness.open('button/variants');
    const apply = new ButtonComponent(page, 'Apply filters');
    // When a mouse clicks it
    await apply.click();
    // Then no ring is drawn
    expect((await apply.focusRing()).style).toBe('none');
    // When a keyboard user tabs to it
    await new ButtonComponent(page, 'Save changes').focus();
    await page.keyboard.press('Tab');
    await expect(apply.root).toBeFocused();
    // Then a solid 2px ring in --color-focus-ring sits 3px outside it at 3:1 against the page
    const ring = await apply.focusRing();
    expect(ring).toEqual({
      width: 2,
      offset: 3,
      style: 'solid',
      colour: await harness.tokenColour('--color-focus-ring'),
    });
    expect(await apply.contrast('outline')).toBeGreaterThanOrEqual(3);
  });

  test('activates with a click, Enter and Space', async ({ page }) => {
    // Given "Apply filters"
    const harness = new HarnessPage(page);
    await harness.open('button/variants');
    const apply = new ButtonComponent(page, 'Apply filters');
    // When it is clicked, then activated with Enter and with Space
    await apply.click();
    await apply.press('Enter');
    await apply.press('Space');
    // Then the consumer's click listener ran three times
    await expect
      .poll(() => harness.activations())
      .toEqual(['click: Apply filters', 'click: Apply filters', 'click: Apply filters']);
  });

  for (const theme of THEMES) {
    test(`AC-16 labels keep 4.5:1 and edges 3:1 on the page, in a dialog and on a card in the ${theme} theme`, async ({
      page,
    }) => {
      // Given primary, secondary, danger, link and pressed-toggle buttons on three grounds
      const harness = new HarnessPage(page);
      // When the contrast check runs in the ${theme} theme
      await harness.open('button/contrast', { theme });
      for (const ground of ['page', 'dialog', 'card']) {
        const region = harness.example(ground);
        // Then every label is at least 4.5:1 against its fill
        for (const name of [
          'Save changes',
          'Apply filters',
          'Delete studio',
          'Clear all',
          'Remove Kensington Window Room',
        ]) {
          expect(
            await new ButtonComponent(region, name).contrast('text'),
            `${ground}: ${name}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
        // And the secondary border and the pressed edge are at least 3:1 against the ground
        for (const name of ['Apply filters', 'Remove Kensington Window Room']) {
          expect(
            await new ButtonComponent(region, name).contrast('border'),
            `${ground}: ${name} edge`,
          ).toBeGreaterThanOrEqual(3);
        }
      }
    });

    for (const width of [320, 1280]) {
      test(`AC-15 axe finds no violations in the variants, link, icon-only, disabled and soft-disabled routes at ${width}px in the ${theme} theme`, async ({
        page,
      }) => {
        // Given the button routes in the ${theme} theme at ${width}px
        const harness = new HarnessPage(page);
        const found: string[] = [];
        // When axe scans each
        for (const route of [
          'button/variants',
          'button/link',
          'button/icon-only',
          'button/disabled',
          'button/soft-disabled',
          'button/sizes',
        ]) {
          await harness.open(route, { width, theme });
          found.push(...(await harness.accessibilityViolations()).map((v) => `${route}: ${v}`));
          expect(await harness.hasHorizontalScroll(), route).toBe(false);
        }
        // Then it finds no violations
        expect(found).toEqual([]);
      });
    }
  }

  test('AC-15 an icon-only button is named only by its aria-label and its icon adds no node', async ({
    page,
  }) => {
    // Given the dialog's icon-only Close
    const harness = new HarnessPage(page);
    // When the accessibility tree is read
    await harness.open('button/icon-only');
    // Then it is exactly a button named "Close"
    expect(await new ButtonComponent(harness.example('md'), 'Close').ariaTree()).toBe(
      '- button "Close"',
    );
  });

  test.describe('performance (L2-071)', () => {
    // Measured on a shared machine with the CPU slowed 4x: a retry absorbs contention from parallel
    // workers, while a real regression fails every attempt.
    test.describe.configure({ retries: 2 });

    test('AC-21 pressing a card toggle among seven stays within the 200ms INP budget', async ({
      page,
    }) => {
      // Given the button/performance route with seven card toggles and the compare bar
      const harness = new HarnessPage(page);
      await harness.open('button/performance', { width: 412 });
      // When a toggle is pressed with the CPU slowed
      const latency = await harness.interactionLatency(() =>
        new ButtonComponent(page, 'Compare The Junction Loft').click(),
      );
      // Then the interaction paints within 200ms and the toggle is pressed
      expect(latency).toBeLessThanOrEqual(200);
      await expect(new ButtonComponent(page, 'Remove The Junction Loft').root).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
  });
});
