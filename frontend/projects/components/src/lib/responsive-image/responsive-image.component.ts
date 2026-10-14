import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FallbackImageDirective } from '../fallback-image.directive';
import { ResponsiveImage } from '../types/responsive-image';

const FORMAT_ORDER = ['avif', 'webp', 'jpeg'];

/**
 * A content photo as <picture>: one <source> per format, AVIF, WebP then JPEG, and an <img> that
 * reserves its box from the data's width and height, lazy-loads unless `priority`, and shows the alt
 * text in a .media-fallback placeholder if it fails (ICD-MEDIA-1..3).
 */
@Component({
  selector: 'st-responsive-image',
  imports: [FallbackImageDirective],
  templateUrl: './responsive-image.component.html',
  styleUrl: './responsive-image.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveImageComponent {
  readonly image = input.required<ResponsiveImage>();
  readonly sizes = input.required<string>();
  readonly priority = input(false, { transform: booleanAttribute });
  readonly decorative = input(false, { transform: booleanAttribute });

  protected readonly sources = computed(() =>
    [...this.image().sources].sort((a, b) => rank(a.format) - rank(b.format)),
  );
  protected readonly jpegSrcset = computed(() => this.image().sources.find((s) => s.format === 'jpeg')?.srcset ?? null);
}

function rank(format: string): number {
  const index = FORMAT_ORDER.indexOf(format);
  return index === -1 ? FORMAT_ORDER.length : index;
}
