import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { StudioVerdictDto } from '@shot-there/api';

@Component({
  selector: 'st-studio-verdict',
  imports: [DecimalPipe],
  templateUrl: './studio-verdict.component.html',
  styleUrl: './studio-verdict.component.css',
})
export class StudioVerdictComponent {
  readonly verdict = input.required<StudioVerdictDto>();

  protected readonly pipSlots = [1, 2, 3, 4, 5];
  protected readonly scores = computed(() => {
    const s = this.verdict().scores;
    return [
      { label: $localize`Value`, score: s.value },
      { label: $localize`Light`, score: s.light },
      { label: $localize`Space`, score: s.space },
      { label: $localize`Gear`, score: s.gear },
      { label: $localize`Logistics`, score: s.logistics },
      { label: $localize`Condition`, score: s.condition },
    ];
  });
}
