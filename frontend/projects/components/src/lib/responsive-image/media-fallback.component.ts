import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/**
 * Internal, not exported: the .media-fallback that stands in for a photo that failed to load, with
 * the image-failed glyph and the alt text (none when the image is decorative). `ratio` keeps the
 * image's box where the slot has no fixed height.
 */
@Component({
  selector: 'span[st-media-fallback]',
  imports: [IconComponent],
  templateUrl: './media-fallback.component.html',
  styleUrl: './media-fallback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'media-fallback',
    '[style.aspect-ratio]': 'ratio()',
  },
})
export class MediaFallbackComponent {
  readonly alt = input('');
  readonly ratio = input<string | null>(null);
}
