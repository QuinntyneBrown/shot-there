import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ResponsiveImage, VideoPosterComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** The Junction Loft's episode poster in a 320px column; played is logged. */
@Component({
  selector: 'st-video-poster-default',
  imports: [VideoPosterComponent, ActivationLogComponent],
  templateUrl: './video-poster-default.component.html',
  styleUrl: './video-poster.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPosterDefaultComponent {
  protected readonly embedUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    'https://www.youtube-nocookie.com/embed/Jx7Lq2pT9aE',
  );
  protected readonly poster: ResponsiveImage = {
    alt: 'The Junction Loft from the doorway',
    width: 1280,
    height: 720,
    sources: [
      {
        format: 'jpeg',
        srcset: '/test-images/episode-4-640.jpg 640w, /test-images/episode-4-1280.jpg 1280w',
      },
    ],
    fallbackUrl: '/test-images/episode-4-1280.jpg',
  };
  protected readonly log = signal<readonly string[]>([]);

  protected record(entry: string): void {
    this.log.update((log) => [...log, entry]);
  }
}
