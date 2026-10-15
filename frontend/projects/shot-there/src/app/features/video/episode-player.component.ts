import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LinkComponent, ResponsiveImage, VideoPosterComponent } from '@shot-there/components';

import { embedUrl, iframeTitle, watchUrl } from './episode-urls';

@Component({
  selector: 'app-episode-player',
  imports: [LinkComponent, VideoPosterComponent],
  templateUrl: './episode-player.component.html',
  styleUrl: './episode-player.component.css',
})
export class EpisodePlayerComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly videoId = input.required<string>();
  readonly episodeTitle = input.required<string>();
  readonly posterUrl = input.required<string>();

  protected readonly watchUrl = computed(() => watchUrl(this.videoId()));
  protected readonly embedUrl = computed(() =>
    embedUrl(this.videoId(), this.sanitizer),
  );
  protected readonly iframeTitle = computed(() => iframeTitle(this.episodeTitle()));
  protected readonly playContext = computed(
    () => $localize`:@@st.video.playContext:: ${this.episodeTitle()}:episodeTitle:`,
  );
  protected readonly poster = computed(
    () =>
      ({
        alt: '',
        width: 1200,
        height: 675,
        sources: [],
        fallbackUrl: this.posterUrl(),
      }) satisfies ResponsiveImage,
  );
}
