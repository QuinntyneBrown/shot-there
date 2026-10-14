import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResponsiveImage, ResponsiveImageComponent } from '@shot-there/components';

/** A lazy image and a priority image, each in a 320px-wide slot; sources arrive JPEG, AVIF, WebP. */
@Component({
  selector: 'st-responsive-image-default',
  imports: [ResponsiveImageComponent],
  templateUrl: './responsive-image-default.component.html',
  styleUrl: './responsive-image.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveImageDefaultComponent {
  protected readonly image: ResponsiveImage = {
    alt: 'The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand.',
    width: 1200,
    height: 800,
    sources: [
      { format: 'jpeg', srcset: '/test-images/loft-480.jpg 480w, /test-images/loft-960.jpg 960w' },
      { format: 'avif', srcset: '/test-images/loft-480.avif 480w, /test-images/loft-960.avif 960w' },
      { format: 'webp', srcset: '/test-images/loft-480.webp 480w, /test-images/loft-960.webp 960w' },
    ],
    fallbackUrl: '/test-images/loft-960.jpg',
  };
}
