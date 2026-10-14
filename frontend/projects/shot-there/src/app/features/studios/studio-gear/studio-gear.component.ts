import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { StudioGearDto } from '@shot-there/api';

import { gearItemLabel, groupIncludedGear } from './studio-gear.view-model';

@Component({
  selector: 'st-studio-gear',
  imports: [CurrencyPipe],
  templateUrl: './studio-gear.component.html',
  styleUrl: './studio-gear.component.css',
})
export class StudioGearComponent {
  readonly gear = input.required<StudioGearDto>();
  protected readonly included = computed(() => groupIncludedGear(this.gear().included));
  protected readonly itemLabel = gearItemLabel;
}
