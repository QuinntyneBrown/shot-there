import { Component, input } from '@angular/core';
import { StudioEpisodeDto } from '@shot-there/api';

import { EpisodePlayerComponent } from '../../video/episode-player.component';

@Component({
  selector: 'app-studio-episode',
  imports: [EpisodePlayerComponent],
  templateUrl: './studio-episode.component.html',
  styleUrl: './studio-episode.component.css',
})
export class StudioEpisodeComponent {
  readonly episode = input.required<StudioEpisodeDto>();
}
