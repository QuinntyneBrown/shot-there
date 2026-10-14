import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScoreListComponent, ScoreOverallComponent, LightRatingComponent } from '@shot-there/components';

/** Overall score, rubric scores and light ratings at each level. */
@Component({
  selector: 'st-score-default',
  imports: [ScoreListComponent, ScoreOverallComponent, LightRatingComponent],
  templateUrl: './score-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreDefaultComponent {
  protected readonly scores = [
    { label: 'Value', value: 4 },
    { label: 'Light', value: 5 },
    { label: 'Space', value: 3 },
    { label: 'Gear', value: 4 },
    { label: 'Logistics', value: 2 },
    { label: 'Condition', value: 5 },
  ];
}
