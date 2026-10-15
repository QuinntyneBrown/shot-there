import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { StudioVerdictDto } from '@shot-there/api';
import { RubricScore, ScoreListComponent, ScoreOverallComponent } from '@shot-there/components';

@Component({
  selector: 'st-studio-verdict',
  imports: [DecimalPipe, ScoreOverallComponent, ScoreListComponent],
  templateUrl: './studio-verdict.component.html',
  styleUrl: './studio-verdict.component.css',
})
export class StudioVerdictComponent {
  readonly verdict = input.required<StudioVerdictDto>();

  protected readonly scores = computed((): RubricScore[] => {
    const s = this.verdict().scores;
    return [
      { label: $localize`Value`, value: s.value },
      { label: $localize`Light`, value: s.light },
      { label: $localize`Space`, value: s.space },
      { label: $localize`Gear`, value: s.gear },
      { label: $localize`Logistics`, value: s.logistics },
      { label: $localize`Condition`, value: s.condition },
    ];
  });
}
