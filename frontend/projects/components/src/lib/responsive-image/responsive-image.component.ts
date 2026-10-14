import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  linkedSignal,
  viewChild,
} from '@angular/core';
import { ResponsiveImage } from '../types/responsive-image';
import { MediaFallbackComponent } from './media-fallback.component';

const FORMAT_ORDER = ['avif', 'webp', 'jpeg'];

/**
 * A content photo as <picture>: one <source> per format, AVIF, WebP then JPEG, and an <img> that
 * reserves its box from the data's width and height and lazy-loads unless `priority`. The host fills
 * its slot. A failed image is replaced by a .media-fallback in the same box until a new `image`
 * arrives (ICD-MEDIA-1..3, CRD responsive-image).
 */
@Component({
  selector: 'st-responsive-image',
  imports: [MediaFallbackComponent],
  templateUrl: './responsive-image.component.html',
  styleUrl: './responsive-image.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveImageComponent {
  readonly image = input.required<ResponsiveImage>();
  readonly sizes = input.required<string>();
  readonly priority = input(false, { transform: booleanAttribute });
  readonly decorative = input(false, { transform: booleanAttribute });

  /** True once the image failed; a new `image` value clears it. */
  protected readonly failed = linkedSignal({ source: this.image, computation: () => false });
  protected readonly sources = computed(() =>
    [...this.image().sources].sort((a, b) => rank(a.format) - rank(b.format)),
  );
  protected readonly jpegSrcset = computed(() => this.image().sources.find((s) => s.format === 'jpeg')?.srcset ?? null);
  protected readonly ratio = computed(() => `${this.image().width} / ${this.image().height}`);
  private readonly img = viewChild<ElementRef<HTMLImageElement>>('img');

  constructor() {
    // An image that broke before hydration attached the error listener (CRD responsive-image D-3).
    afterNextRender(() => {
      const img = this.img()?.nativeElement;
      if (img?.getAttribute('src') && img.complete && img.naturalWidth === 0) {
        this.failed.set(true);
      }
    });
  }
}

function rank(format: string): number {
  const index = FORMAT_ORDER.indexOf(format);
  return index === -1 ? FORMAT_ORDER.length : index;
}
