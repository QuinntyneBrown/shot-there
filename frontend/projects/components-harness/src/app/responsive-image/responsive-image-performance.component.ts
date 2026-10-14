import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponsiveImage, ResponsiveImageComponent } from '@shot-there/components';

const variants = (id: string, format: string, root: string) =>
  ['480', '960', '1440'].map((w) => `${root}/${id}/${w}.${format} ${w}w`).join(', ');
const photo = (
  id: string,
  alt: string,
  width: number,
  height: number,
  root = '/test-images',
): ResponsiveImage => ({
  alt,
  width,
  height,
  sources: ['avif', 'webp', 'jpeg'].map((format) => ({
    format,
    srcset: variants(id, format, root),
  })),
  fallbackUrl: `${root}/${id}/960.jpeg`,
});

/**
 * A studio page's hero and eight-photo gallery. The route data's `failed` count makes that many gallery
 * photos return 404.
 */
@Component({
  selector: 'st-responsive-image-performance',
  imports: [ResponsiveImageComponent],
  templateUrl: './responsive-image-performance.component.html',
  styleUrl: './responsive-image.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveImagePerformanceComponent {
  private readonly failed =
    (inject(ActivatedRoute).snapshot.data['failed'] as number | undefined) ?? 0;
  protected readonly hero = photo(
    'hero',
    'The Junction Loft: two tall north windows over a brick wall, a white cyc in the right corner and a softbox on a stand.',
    3000,
    2000,
  );
  protected readonly gallery = Array.from({ length: 8 }, (_, i) =>
    photo(
      `gallery-${i + 1}`,
      `Test shot ${i + 1} at The Junction Loft`,
      1600,
      2000,
      i < this.failed ? '/missing' : '/test-images',
    ),
  );
}
