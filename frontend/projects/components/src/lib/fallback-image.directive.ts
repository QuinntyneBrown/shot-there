import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject } from '@angular/core';

const BROKEN_IMAGE_ICON =
  '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 2-2 7 7"/><path d="M3 3l18 18"/></svg>';

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
  private readonly document = inject(DOCUMENT);

  showFallback(): void {
    if (this.image.previousElementSibling?.classList.contains('media-fallback')) {
      return;
    }
    const fallback = this.document.createElement('span');
    fallback.className = 'media-fallback';
    fallback.innerHTML = BROKEN_IMAGE_ICON;
    const text = this.document.createElement('span');
    text.textContent = this.image.alt;
    fallback.append(text);
    this.image.before(fallback);
    this.image.hidden = true;
  }
}
