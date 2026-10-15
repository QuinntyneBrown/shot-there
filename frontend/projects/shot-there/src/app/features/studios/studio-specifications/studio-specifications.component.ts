import { Component, computed, input } from '@angular/core';
import { StudioSpecificationsDto } from '@shot-there/api';
import { DescriptionListComponent, LightRatingComponent } from '@shot-there/components';

import {
  LIGHT_RATING_LABELS,
  cycWallLabel,
  formatDimensions,
  formatHeight,
  powerLabel,
} from './studio-specifications.view-model';

@Component({
  selector: 'app-studio-specifications',
  imports: [DescriptionListComponent, LightRatingComponent],
  templateUrl: './studio-specifications.component.html',
  styleUrl: './studio-specifications.component.css',
})
export class StudioSpecificationsComponent {
  readonly specifications = input.required<StudioSpecificationsDto>();

  protected readonly facts = computed(() => {
    const v = this.view();
    return [
      { term: $localize`Usable shooting space`, detail: v.space },
      { term: $localize`Ceiling height`, detail: v.ceiling },
      { term: $localize`Window direction`, detail: this.specifications().windowDirection },
      { term: $localize`Power`, detail: v.power },
      { term: $localize`Cyc wall`, detail: v.cycWall },
      { term: $localize`Backdrops`, detail: v.backdrops },
    ];
  });

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
        rating: slot.rating,
      })),
    };
  });
}
