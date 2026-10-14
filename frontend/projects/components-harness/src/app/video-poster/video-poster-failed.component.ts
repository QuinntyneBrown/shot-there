import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ResponsiveImage, VideoPosterComponent } from '@shot-there/components';

/** An episode poster whose still fails, and one with no poster and an application playLabel. */
@Component({
  selector: 'st-video-poster-failed',
  imports: [VideoPosterComponent],
  templateUrl: './video-poster-failed.component.html',
  styleUrl: './video-poster.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPosterFailedComponent {
  protected readonly embedUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    'https://www.youtube-nocookie.com/embed/Jx7Lq2pT9aE',
  );
  protected readonly poster: ResponsiveImage = {
    alt: 'The Junction Loft from the doorway',
    width: 1280,
    height: 720,
    sources: [{ format: 'jpeg', srcset: '/missing/episode-4-1280.jpg 1280w' }],
    fallbackUrl: '/missing/episode-4-1280.jpg',
  };
}
