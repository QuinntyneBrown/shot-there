import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResponsiveImage, ResponsiveImageComponent } from '@shot-there/components';

const variants = (id: string, format: string) => ['480', '960', '1440'].map((w) => `/test-images/${id}/${w}.${format} ${w}w`).join(', ');

/**
 * Loaded photos in their slots: a gallery photo in a 4:5 shot (sources arriving JPEG, WebP, AVIF),
 * one with only WebP and JPEG, the priority hero in a 960 x 420 box, and a decorative card photo in a
 * 3:2 frame.
 */
@Component({
  selector: 'st-responsive-image-default',
  imports: [ResponsiveImageComponent],
  templateUrl: './responsive-image-default.component.html',
  styleUrl: './responsive-image.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveImageDefaultComponent {
  protected readonly gallerySizes = '(min-width: 62rem) 25vw, (min-width: 48rem) 33vw, 50vw';
  protected readonly gallery: ResponsiveImage = {
    alt: 'Close portrait against the brick wall with the octabox as fill.',
    width: 1600,
    height: 2000,
    sources: [
      { format: 'jpeg', srcset: variants('9f2c41', 'jpeg') },
      { format: 'webp', srcset: variants('9f2c41', 'webp') },
      { format: 'avif', srcset: variants('9f2c41', 'avif') },
    ],
    fallbackUrl: '/test-images/9f2c41/960.jpeg',
  };
  protected readonly twoFormats: ResponsiveImage = {
    ...this.gallery,
    sources: [
      { format: 'jpeg', srcset: variants('7d1e08', 'jpeg') },
      { format: 'webp', srcset: variants('7d1e08', 'webp') },
    ],
    fallbackUrl: '/test-images/7d1e08/960.jpeg',
  };
  protected readonly hero: ResponsiveImage = {
    alt: 'The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand.',
    width: 3000,
    height: 2000,
    sources: ['avif', 'webp', 'jpeg'].map((format) => ({ format, srcset: variants('a01b22', format) })),
    fallbackUrl: '/test-images/a01b22/960.jpeg',
  };
  protected readonly card: ResponsiveImage = {
    alt: 'Kensington Window Room: tall windows over a wooden floor',
    width: 1200,
    height: 800,
    sources: ['avif', 'webp', 'jpeg'].map((format) => ({ format, srcset: variants('c33d44', format) })),
    fallbackUrl: '/test-images/c33d44/960.jpeg',
  };
}
