import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResponsiveImage, ResponsiveImageComponent } from '@shot-there/components';

/** An informative and a decorative image whose files are missing, each in a 320 x 200 slot. */
@Component({
  selector: 'st-responsive-image-failed',
  imports: [ResponsiveImageComponent],
  templateUrl: './responsive-image-failed.component.html',
  styleUrl: './responsive-image.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveImageFailedComponent {
  protected readonly image: ResponsiveImage = {
    alt: 'The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand.',
    width: 1200,
    height: 800,
    sources: [
      { format: 'avif', srcset: '/missing/loft-480.avif 480w' },
      { format: 'webp', srcset: '/missing/loft-480.webp 480w' },
      { format: 'jpeg', srcset: '/missing/loft-480.jpg 480w' },
    ],
    fallbackUrl: '/missing/loft-960.jpg',
  };
}
