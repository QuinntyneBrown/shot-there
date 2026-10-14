import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LightLevel } from '../types/light-level';

const FILLED: Record<LightLevel, number> = { none: 0, low: 1, medium: 2, strong: 3 };

/** The DS light rating (.light-rating): three pips filled by level, then the word that is the visible and accessible value. */
@Component({
  selector: 'st-light-rating',
  templateUrl: './light-rating.component.html',
  styleUrl: './light-rating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'light-rating' },
})
export class LightRatingComponent {
  readonly level = input.required<LightLevel>();
  readonly text = input.required<string>();

  protected readonly pips = computed(() => [0, 1, 2].map((index) => index < FILLED[this.level()]));
}
