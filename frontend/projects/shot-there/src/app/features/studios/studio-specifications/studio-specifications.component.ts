import { Component, computed, input } from '@angular/core';
import { StudioSpecificationsDto } from '@shot-there/api';

import {
  LIGHT_RATING_LABELS,
  LIGHT_RATING_PIPS,
  cycWallLabel,
  formatDimensions,
  formatHeight,
  powerLabel,
} from './studio-specifications.view-model';

@Component({
  selector: 'st-studio-specifications',
  templateUrl: './studio-specifications.component.html',
  styleUrl: './studio-specifications.component.css',
})
export class StudioSpecificationsComponent {
  readonly specifications = input.required<StudioSpecificationsDto>();

  protected readonly pipSlots = [1, 2, 3];
  protected readonly view = computed(() => {
    const s = this.specifications();
    return {
      space: formatDimensions(s.usableWidthM, s.usableDepthM),
      ceiling: formatHeight(s.ceilingHeightM),
      power: powerLabel(s),
      cycWall: cycWallLabel(s),
      backdrops: s.backdrops.join(' · '),
      light: [
        { time: $localize`Morning`, rating: s.naturalLight.morning },
        { time: $localize`Midday`, rating: s.naturalLight.midday },
        { time: $localize`Afternoon`, rating: s.naturalLight.afternoon },
        { time: $localize`Evening`, rating: s.naturalLight.evening },
      ].map((slot) => ({
        time: slot.time,
        label: LIGHT_RATING_LABELS[slot.rating],
        pips: LIGHT_RATING_PIPS[slot.rating],
      })),
    };
  });
}
