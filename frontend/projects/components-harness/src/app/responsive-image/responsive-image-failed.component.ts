import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ResponsiveImage, ResponsiveImageComponent } from '@shot-there/components';

const missing = (id: string): ResponsiveImage['sources'] =>
  ['avif', 'webp', 'jpeg'].map((format) => ({ format, srcset: `/missing/${id}/480.${format} 480w` }));

/**
 * Photos whose files return 404: gallery photo 2 in a shot button (the "Use a working photo" checkbox
 * passes a new, working image), a decorative card photo beside its card link, the hero in a 3:2 slot
 * and photo 3 in a lightbox frame.
 */
@Component({
  selector: 'st-responsive-image-failed',
  imports: [ResponsiveImageComponent],
  templateUrl: './responsive-image-failed.component.html',
  styleUrl: './responsive-image.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveImageFailedComponent {
  private readonly broken: ResponsiveImage = {
    alt: 'Close portrait against the brick wall with the octabox as fill.',
    width: 1600,
    height: 2000,
    sources: missing('gallery-2'),
    fallbackUrl: '/missing/gallery-2/960.jpeg',
  };
  private readonly working: ResponsiveImage = {
    ...this.broken,
    sources: [{ format: 'jpeg', srcset: '/test-images/gallery-2/480.jpeg 480w' }],
    fallbackUrl: '/test-images/gallery-2/960.jpeg',
  };
  protected readonly gallery = signal(this.broken);
  protected readonly card: ResponsiveImage = {
    alt: 'Kensington Window Room: tall windows over a wooden floor',
    width: 1200,
    height: 800,
    sources: missing('card'),
    fallbackUrl: '/missing/card/960.jpeg',
  };
  protected readonly hero: ResponsiveImage = {
    alt: 'The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand.',
    width: 3000,
    height: 2000,
    sources: missing('hero'),
    fallbackUrl: '/missing/hero/960.jpeg',
  };
  protected readonly lightbox: ResponsiveImage = {
    alt: 'Full-length fashion frame on the cyc, warm afternoon light from the left.',
    width: 1600,
    height: 2000,
    sources: missing('photo-3'),
    fallbackUrl: '/missing/photo-3/960.jpeg',
  };

  protected useWorking(): void {
    this.gallery.set(this.working);
  }
}
