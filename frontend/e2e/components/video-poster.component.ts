import { Locator, Page } from '@playwright/test';
import { colourOf, contrastOf } from './contrast';
import { IconComponent } from './icon.component';
import { ResponsiveImageComponent } from './responsive-image.component';

/** An st-video-poster: the .video-poster link to YouTube, then the .video-frame player that replaces it. */
export class VideoPosterComponent {
  readonly poster: Locator;
  readonly play: Locator;
  readonly playIcon: IconComponent;
  readonly still: ResponsiveImageComponent;
  /** The poster's own fallback, a direct child of the link, shown when the still fails or is missing. */
  readonly fallback: Locator;
  readonly fallbackText: Locator;
  readonly player: Locator;

  constructor(scope: Page | Locator, playName: string, playerTitle: string) {
    this.poster = scope.getByRole('link', { name: playName, exact: true });
    this.play = this.poster.locator('.video-poster__play');
    this.playIcon = new IconComponent(this.play);
    this.still = new ResponsiveImageComponent(this.poster);
    this.fallback = this.poster.locator(':scope > .media-fallback');
    this.fallbackText = this.fallback.locator(':scope > span');
    this.player = scope
      .locator('iframe.video-frame')
      .and(scope.getByTitle(playerTitle, { exact: true }));
  }

  /** The poster's rendered width and height in whole CSS pixels. */
  async posterSize(): Promise<{ width: number; height: number }> {
    const box = await this.poster.boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** The player's rendered width and height in whole CSS pixels. */
  async playerSize(): Promise<{ width: number; height: number }> {
    const box = await this.player.boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** Where the play pill sits: its centre and bottom gap as fractions of the poster's height. */
  async playPosition(): Promise<{ centre: number; bottomGap: number }> {
    const poster = await this.poster.boundingBox();
    const pill = await this.play.boundingBox();
    if (!poster || !pill) return { centre: 0, bottomGap: 0 };
    return {
      centre: (pill.y + pill.height / 2 - poster.y) / poster.height,
      bottomGap: (poster.y + poster.height - (pill.y + pill.height)) / poster.height,
    };
  }

  /** The pill's visible label, without its visually hidden context. */
  playLabel(): Promise<string> {
    return this.play.evaluate((pill) =>
      Array.from(pill.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join('')
        .trim(),
    );
  }

  /** True when the pill fits on one line inside the poster. */
  pillFits(): Promise<boolean> {
    return this.play.evaluate((pill) => {
      const poster = pill.closest('a')!.getBoundingClientRect();
      const r = pill.getBoundingClientRect();
      const oneLine = r.height <= parseFloat(getComputedStyle(pill).minHeight) + 1;
      return oneLine && r.left >= poster.left && r.right <= poster.right;
    });
  }

  /** The number of lines the fallback's title takes, and whether its last line stays above the pill. */
  fallbackTextLayout(): Promise<{ lines: number; clearOfPill: boolean }> {
    return this.fallbackText.evaluate((text) => {
      const lineHeight = parseFloat(getComputedStyle(text).lineHeight);
      const box = text.getBoundingClientRect();
      const pill = text.closest('a')!.querySelector('.video-poster__play')!.getBoundingClientRect();
      return { lines: Math.round(box.height / lineHeight), clearOfPill: box.bottom <= pill.top };
    });
  }

  /** The iframe attributes that decide what the player may do. */
  playerAttributes(): Promise<Record<string, string | null>> {
    return this.player.evaluate((frame) =>
      Object.fromEntries(
        ['src', 'title', 'allow', 'allowfullscreen', 'referrerpolicy'].map((name) => [
          name,
          frame.getAttribute(name),
        ]),
      ),
    );
  }

  playerHasFocus(): Promise<boolean> {
    return this.player.evaluate((frame) => document.activeElement === frame);
  }

  /** The poster's focus outline: width in px, style and colour. */
  async focusRing(): Promise<{ width: number; style: string; colour: string }> {
    const colour = await this.poster.evaluate(colourOf, 'outlineColor');
    return this.poster.evaluate((el, c) => {
      const style = getComputedStyle(el);
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle, colour: c };
    }, colour);
  }

  /** WCAG contrast of the poster's focus ring against the page. */
  ringContrast(): Promise<number> {
    return this.poster.evaluate(contrastOf, 'outline');
  }

  /** WCAG contrast of the play label against the pill. */
  playContrast(): Promise<number> {
    return this.play.evaluate(contrastOf, 'text');
  }

  /** WCAG contrast of the fallback's title against its ground. */
  fallbackContrast(): Promise<number> {
    return this.fallbackText.evaluate(contrastOf, 'text');
  }

  /** The link's accessibility subtree as Playwright's ARIA snapshot. */
  ariaTree(): Promise<string> {
    return this.poster.ariaSnapshot();
  }

  async hover(): Promise<void> {
    await this.poster.hover();
  }

  async pressDown(): Promise<void> {
    await this.poster.hover();
    await this.poster.page().mouse.down();
  }

  /** Lets go away from the poster, so the press does not become a click. */
  async release(): Promise<void> {
    await this.poster.page().mouse.move(0, 0);
    await this.poster.page().mouse.up();
  }

  async click(modifiers?: ('Control' | 'Meta' | 'Shift' | 'Alt')[]): Promise<void> {
    await this.poster.click({ modifiers });
  }

  async press(key: string): Promise<void> {
    await this.poster.focus();
    await this.poster.press(key);
  }
}
