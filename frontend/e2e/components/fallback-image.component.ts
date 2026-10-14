import { Locator } from '@playwright/test';
import { IconComponent } from './icon.component';

/** An image enhanced with img[stFallbackImage], and the .media-fallback placeholder it shows when the image fails. */
export class FallbackImageComponent {
  readonly image: Locator;
  readonly placeholder: Locator;
  readonly placeholderIcon: IconComponent;
  readonly placeholderText: Locator;

  /** `scope` is the slot that holds the one image. */
  constructor(scope: Locator) {
    this.image = scope.locator('img');
    this.placeholder = scope.locator('.media-fallback');
    this.placeholderIcon = new IconComponent(this.placeholder);
    this.placeholderText = this.placeholder.locator(':scope > span');
  }

  /** The placeholder's rendered size in whole CSS pixels. */
  async placeholderSize(): Promise<{ width: number; height: number } | null> {
    const box = await this.placeholder.boundingBox();
    return box && { width: Math.round(box.width), height: Math.round(box.height) };
  }

  /** True when the placeholder is the element right after the image. */
  placeholderFollowsImage(): Promise<boolean> {
    return this.placeholder.evaluate((fallback) => fallback.previousElementSibling?.tagName === 'IMG');
  }

  /** The image's computed display. */
  imageDisplay(): Promise<string> {
    return this.image.evaluate((img) => getComputedStyle(img).display);
  }
}
