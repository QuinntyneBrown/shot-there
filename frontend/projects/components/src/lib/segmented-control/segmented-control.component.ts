import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { SegmentedOption } from '../types/segmented-option';

/**
 * The DS segmented control (.segmented): a labelled group of toggle buttons with exactly one pressed.
 * Pressing an option sets `value` and emits `valueChange`; pressing the pressed one does nothing.
 */
@Component({
  selector: 'st-segmented',
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'segmented',
    role: 'group',
    '[attr.aria-label]': 'label()',
  },
})
export class SegmentedControlComponent {
  readonly label = input.required<string>();
  readonly options = input.required<readonly SegmentedOption[]>();
  readonly value = model('');

  protected choose(option: SegmentedOption): void {
    if (option.value !== this.value()) {
      this.value.set(option.value);
    }
  }
}
