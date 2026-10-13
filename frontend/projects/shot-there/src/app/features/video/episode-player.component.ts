import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FallbackImageDirective } from '@shot-there/components';

import { embedUrl, iframeTitle, watchUrl } from './episode-urls';

/** A poster that links to the episode on YouTube and, once activated, swaps itself for the player. */
@Component({
  selector: 'st-episode-player',
  imports: [FallbackImageDirective],
  templateUrl: './episode-player.component.html',
  styleUrl: './episode-player.component.css'
})
export class EpisodePlayerComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly videoId = input.required<string>();
  readonly episodeTitle = input.required<string>();
  readonly posterUrl = input.required<string>();

  protected readonly playing = signal(false);
  protected readonly watchUrl = computed(() => watchUrl(this.videoId()));
  /** Built only from the fixed youtube-nocookie.com origin and an encoded video ID. */
  protected readonly embedUrl = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl(this.videoId())));
  protected readonly iframeTitle = computed(() => iframeTitle(this.episodeTitle()));
  protected readonly playLabel = computed(() => $localize`Play episode: ${this.episodeTitle()}:episodeTitle:`);

  play(event: Event): void {
    event.preventDefault();
    this.playing.set(true);
  }
}
