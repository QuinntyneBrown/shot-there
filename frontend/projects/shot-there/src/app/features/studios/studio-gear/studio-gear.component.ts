import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Component, LOCALE_ID, computed, inject, input } from '@angular/core';
import { StudioGearDto } from '@shot-there/api';
import { DescriptionListComponent } from '@shot-there/components';

import { gearItemLabel, groupIncludedGear } from './studio-gear.view-model';

@Component({
  selector: 'st-studio-gear',
  imports: [DescriptionListComponent],
  templateUrl: './studio-gear.component.html',
  styleUrl: './studio-gear.component.css',
})
export class StudioGearComponent {
  private readonly locale = inject(LOCALE_ID);
  readonly gear = input.required<StudioGearDto>();
  protected readonly included = computed(() =>
    groupIncludedGear(this.gear().included).map((group) => ({ term: group.category, detail: group.items })),
  );
  protected readonly extras = computed(() =>
    this.gear().extras.map((extra) => ({
      term: gearItemLabel(extra),
      detail:
        extra.extraCost === null
          ? ''
          : formatCurrency(extra.extraCost, this.locale, getCurrencySymbol('CAD', 'narrow', this.locale), 'CAD', '1.2-2'),
      numeric: true,
    })),
  );
}