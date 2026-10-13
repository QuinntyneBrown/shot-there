import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';

const SVG_NAMESPACE = 'svg';
const BROKEN_IMAGE_PATHS = ['m3 16 5-5 4 4 2-2 7 7', 'M3 3l18 18'];

/**
 * When the image fails to load, replaces it with its alt text in a placeholder that fills
 * the same slot, so the layout does not shift and the description still reads.
 */
@Directive({
  selector: 'img[stFallbackImage]',
  host: { '(error)': 'showFallback()' }
})
export class FallbackImageDirective {
  private readonly image = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private fallbackShown = false;

  showFallback(): void {
    if (this.fallbackShown) {
      return;
    }
    this.fallbackShown = true;
    const fallback = this.renderer.createElement('span');
    this.renderer.addClass(fallback, 'media-fallback');
    this.renderer.appendChild(fallback, this.brokenImageIcon());
    const text = this.renderer.createElement('span');
    this.renderer.appendChild(text, this.renderer.createText(this.image.alt));
    this.renderer.appendChild(fallback, text);
    this.renderer.insertBefore(this.renderer.parentNode(this.image), fallback, this.image);
    this.renderer.setAttribute(this.image, 'hidden', '');
  }

  private brokenImageIcon(): SVGElement {
    const svg = this.renderer.createElement('svg', SVG_NAMESPACE);
    this.renderer.addClass(svg, 'icon');
    this.renderer.setAttribute(svg, 'aria-hidden', 'true');
    this.renderer.setAttribute(svg, 'viewBox', '0 0 24 24');
    const frame = this.renderer.createElement('rect', SVG_NAMESPACE);
    for (const [name, value] of [['x', '3'], ['y', '5'], ['width', '18'], ['height', '14'], ['rx', '2']]) {
      this.renderer.setAttribute(frame, name, value);
    }
    this.renderer.appendChild(svg, frame);
    for (const d of BROKEN_IMAGE_PATHS) {
      const path = this.renderer.createElement('path', SVG_NAMESPACE);
      this.renderer.setAttribute(path, 'd', d);
      this.renderer.appendChild(svg, path);
    }
    return svg;
  }
}
