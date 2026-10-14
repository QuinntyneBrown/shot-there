import { afterNextRender, Directive, ElementRef, inject, Renderer2, ViewContainerRef } from '@angular/core';
import { MediaFallbackComponent } from './media-fallback.component';

/**
 * When the image fails to load, hides it and puts the .media-fallback right after it: the
 * image-failed glyph and the alt text (none when alt is empty), in the box the image's width and
 * height reserved, so the layout does not shift (ICD-MEDIA-3, CRD responsive-image).
 */
@Directive({
  selector: 'img[stFallbackImage]',
  host: { '(error)': 'showFallback()' },
})
export class FallbackImageDirective {
  private readonly image = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly container = inject(ViewContainerRef);
  private fallbackShown = false;

  constructor() {
    // An image that broke before hydration attached the error listener (CRD responsive-image D-3).
    afterNextRender(() => {
      if (this.image.getAttribute('src') && this.image.complete && this.image.naturalWidth === 0) {
        this.showFallback();
      }
    });
  }

  showFallback(): void {
    if (this.fallbackShown) {
      return;
    }
    this.fallbackShown = true;
    const fallback = this.container.createComponent(MediaFallbackComponent);
    fallback.setInput('alt', this.image.alt);
    const width = this.image.getAttribute('width');
    const height = this.image.getAttribute('height');
    fallback.setInput('ratio', width && height ? `${width} / ${height}` : null);
    this.renderer.setStyle(this.image, 'display', 'none');
  }
}
