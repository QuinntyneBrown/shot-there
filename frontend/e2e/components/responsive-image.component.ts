import { Locator } from '@playwright/test';

export interface PictureSource {
  type: string | null;
  srcset: string | null;
  sizes: string | null;
}

/** An st-responsive-image: a <picture> with its <source>s and <img>, and the .media-fallback shown when it fails. */
export class ResponsiveImageComponent {
  readonly picture: Locator;
  readonly image: Locator;
  readonly placeholder: Locator;

  constructor(scope: Locator) {
    this.picture = scope.locator('picture');
    this.image = this.picture.locator('img');
    this.placeholder = scope.locator('.media-fallback');
  }

  /** The <source> elements in document order. */
  sources(): Promise<PictureSource[]> {
    return this.picture.locator('source').evaluateAll((sources) =>
      sources.map((s) => ({ type: s.getAttribute('type'), srcset: s.getAttribute('srcset'), sizes: s.getAttribute('sizes') })),
    );
  }

  /** The <img> attributes the browser uses to pick, reserve and load the image. */
  imageAttributes(): Promise<Record<string, string | null>> {
    return this.image.evaluate((img) =>
      Object.fromEntries(
        ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'fetchpriority'].map((name) => [name, img.getAttribute(name)]),
      ),
    );
  }

  /** The URL the browser chose to load, once it has loaded. */
  async loadedUrl(): Promise<string> {
    await this.image.evaluate((img: HTMLImageElement) => (img.complete ? null : new Promise((done) => img.addEventListener('load', done, { once: true }))));
    return this.image.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname);
  }

  /** The placeholder's text and rendered size in whole CSS pixels. */
  async placeholderBox(): Promise<{ text: string; width: number; height: number }> {
    const box = await this.placeholder.boundingBox();
    return { text: (await this.placeholder.innerText()).trim(), width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** The image's rendered size in whole CSS pixels. */
  async imageSize(): Promise<{ width: number; height: number }> {
    const box = await this.image.boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }
}
