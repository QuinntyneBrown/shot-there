import { Locator, Page } from '@playwright/test';
import { IconComponent } from './icon.component';
import { ResponsiveImageComponent } from './responsive-image.component';

/** An st-video-poster: the .video-poster link to YouTube, then the .video-frame player that replaces it. */
export class VideoPosterComponent {
  readonly poster: Locator;
  readonly play: Locator;
  readonly playIcon: IconComponent;
  readonly still: ResponsiveImageComponent;
  readonly player: Locator;

  constructor(scope: Page | Locator, playName: string, playerTitle: string) {
    this.poster = scope.getByRole('link', { name: playName, exact: true });
    this.play = this.poster.locator('.video-poster__play');
    this.playIcon = new IconComponent(this.play);
    this.still = new ResponsiveImageComponent(this.poster);
    this.player = scope.locator('iframe.video-frame').and(scope.getByTitle(playerTitle, { exact: true }));
  }

  /** The poster's rendered width and height in whole CSS pixels. */
  async posterSize(): Promise<{ width: number; height: number }> {
    const box = await this.poster.boundingBox();
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

  playerHasFocus(): Promise<boolean> {
    return this.player.evaluate((frame) => document.activeElement === frame);
  }

  async click(): Promise<void> {
    await this.poster.click();
  }

  async press(key: string): Promise<void> {
    await this.poster.focus();
    await this.poster.press(key);
  }
}
