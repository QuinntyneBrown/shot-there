import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RubricScore } from '../types/rubric-score';

/** The DS rubric score list: a row per score with pips, the number, and one spoken sentence per row. The host adds no box. */
@Component({
  selector: 'st-score-list',
  templateUrl: './score-list.component.html',
  styleUrl: './score-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreListComponent {
  readonly label = input.required<string>();
  readonly scores = input.required<readonly RubricScore[]>();
  readonly max = input(5);

  protected readonly pips = computed(() => Array.from({ length: this.max() }, (_, index) => index));

  protected spoken(score: RubricScore): string {
    return $localize`:@@st.score.text:${score.label}:label:: ${score.value}:value: out of ${this.max()}:max:`;
  }
}
