import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS overall score: a large value and its max text ("overall, out of 5"). The host adds no box. */
@Component({
  selector: 'st-score-overall',
  templateUrl: './score-overall.component.html',
  styleUrl: './score-overall.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreOverallComponent {
  readonly value = input.required<string>();
  readonly maxText = input.required<string>();
}
