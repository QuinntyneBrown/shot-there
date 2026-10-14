import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ResponsiveImage, VideoPosterComponent } from '@shot-there/components';

/** Evergreen Brick Works' episode 7 in a review's main column (45rem from LG, the content width below). */
@Component({
  selector: 'st-video-poster-column',
  imports: [VideoPosterComponent],
  templateUrl: './video-poster-column.component.html',
  styleUrl: './video-poster.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPosterColumnComponent {
  protected readonly embedUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl('https://www.youtube-nocookie.com/embed/Qz3Fv8LmN2w');
  protected readonly poster: ResponsiveImage = {
    alt: 'Evergreen Brick Works at golden hour',
    width: 1280,
    height: 720,
    sources: [{ format: 'jpeg', srcset: '/test-images/episode-7-640.jpg 640w, /test-images/episode-7-1280.jpg 1280w' }],
    fallbackUrl: '/test-images/episode-7-1280.jpg',
  };
}
