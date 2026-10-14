import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/** The privacy-enhanced player for a video, with no autoplay (L2-047). */
export function embedUrl(videoId: string, sanitizer: DomSanitizer): SafeResourceUrl {
  return sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`,
  );
}

/** The video's page on YouTube. */
export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}

/** The player's accessible title: the episode's own title. */
export function iframeTitle(episodeTitle: string): string {
  return $localize`${episodeTitle}:episodeTitle:`;
}
