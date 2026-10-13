import { Locator, Page } from '@playwright/test';

/** An image enhanced with img[stFallbackImage], and the .media-fallback placeholder it shows when the image fails. */
export class FallbackImageComponent {
  readonly image: Locator;
  readonly placeholder: Locator;

  constructor(scope: Page | Locator, alt: string) {
    this.image = scope.getByRole('img', { name: alt });
    this.placeholder = scope.locator('.media-fallback').filter({ hasText: alt });
  }

  /** The placeholder's rendered size in whole CSS pixels. */
  async placeholderSize(): Promise<{ width: number; height: number } | null> {
    const box = await this.placeholder.boundingBox();
    return box && { width: Math.round(box.width), height: Math.round(box.height) };
  }
}
