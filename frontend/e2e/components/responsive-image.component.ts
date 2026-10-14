import { Locator } from '@playwright/test';
import { contrastOf } from './contrast';
import { IconComponent } from './icon.component';

export interface PictureSource {
  type: string | null;
  srcset: string | null;
  sizes: string | null;
}

export interface Box {
  width: number;
  height: number;
}

/** An st-responsive-image in its slot: a <picture> with its <source>s and <img>, or the .media-fallback that replaces it. */
export class ResponsiveImageComponent {
  readonly picture: Locator;
  readonly image: Locator;
  readonly placeholder: Locator;
  readonly placeholderIcon: IconComponent;
  readonly placeholderText: Locator;

  constructor(scope: Locator) {
    this.picture = scope.locator('picture');
    this.image = scope.locator('img');
    this.placeholder = scope.locator('.media-fallback');
    this.placeholderIcon = new IconComponent(this.placeholder);
    this.placeholderText = this.placeholder.locator(':scope > span');
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

  /** The <img>'s object-fit. */
  objectFit(): Promise<string> {
    return this.image.evaluate((img) => getComputedStyle(img).objectFit);
  }

  /** The path of the URL the browser chose to load, once it has loaded. */
  async loadedUrl(): Promise<string> {
    await this.image.evaluate((img: HTMLImageElement) => (img.complete ? null : new Promise((done) => img.addEventListener('load', done, { once: true }))));
    return this.image.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname);
  }

  /** The placeholder's text and rendered size in whole CSS pixels. */
  async placeholderBox(): Promise<{ text: string } & Box> {
    const box = await this.placeholder.boundingBox();
    return { text: (await this.placeholder.innerText()).trim(), width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /** The image's rendered size in whole CSS pixels. */
  async imageSize(): Promise<Box> {
    const box = await this.image.boundingBox();
    return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
  }

  /**
   * The boxes of the slot (the element around the component), the component's host, and what it shows
   * (the image, or the fallback once the image failed), in whole CSS pixels.
   */
  boxes(): Promise<{ slot: Box; host: Box; media: Box }> {
    return this.image
      .or(this.placeholder)
      .first()
      .evaluate((media) => {
        const box = (el: Element): { width: number; height: number } => {
          const r = el.getBoundingClientRect();
          return { width: Math.round(r.width), height: Math.round(r.height) };
        };
        let host = media.parentElement!;
        if (host.tagName === 'PICTURE') host = host.parentElement!;
        return { slot: box(host.parentElement!), host: box(host), media: box(media) };
      });
  }

  /** WCAG contrast of the placeholder's alt text and of its icon against the placeholder ground. */
  async placeholderContrast(): Promise<{ text: number; icon: number }> {
    return {
      text: await this.placeholderText.evaluate(contrastOf, 'text'),
      icon: await this.placeholderIcon.strokeContrast(),
    };
  }
}
