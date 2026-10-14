import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Trinity Bellwoods Park has no video ID, so the application renders no st-video-poster: the spot's
 * sections run on with no episode section, poster or placeholder (CRD video-poster D-9).
 */
@Component({
  selector: 'st-video-poster-no-video',
  templateUrl: './video-poster-no-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPosterNoVideoComponent {}
