import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** The DS progress bar: a named progressbar with a determinate value (0–100) or indeterminate when null. */
@Component({
  selector: 'st-progress',
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'progress',
    '[class.progress--indeterminate]': 'value() === null',
    '[class.progress--success]': "tone() === 'success'",
    '[class.progress--danger]': "tone() === 'danger'",
    role: 'progressbar',
    '[attr.aria-label]': 'label()',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'clamped()',
    '[style.--value]': 'fill()',
  },
})
export class ProgressComponent {
  readonly value = input<number | null>(null);
  readonly label = input.required<string>();
  readonly tone = input<'neutral' | 'success' | 'danger'>('neutral');

  protected readonly clamped = computed(() => {
    const value = this.value();
    return value === null ? null : Math.min(100, Math.max(0, value));
  });
  protected readonly fill = computed(() => (this.clamped() ?? 0) + '%');
}
