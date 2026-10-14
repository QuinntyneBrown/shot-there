import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/**
 * The DS filters trigger (.filter-trigger): the pill that opens the filters sheet below LG, with the
 * filters icon and, above 0, a bubble showing the count (hidden from assistive technology) beside the
 * hidden library string ", 2 active", so the name reads "Filters, 2 active" (CRD filter D-1).
 */
@Component({
  selector: 'button[st-filter-trigger], a[st-filter-trigger]',
  imports: [IconComponent],
  templateUrl: './filter-trigger.component.html',
  styleUrl: './filter-trigger.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'filter-trigger',
    'aria-haspopup': 'dialog',
  },
})
export class FilterTriggerComponent {
  readonly count = input(0, { transform: numberAttribute });

  protected readonly countText = computed(
    () => $localize`:@@st.filterTrigger.count:, ${this.count()}:count: active`,
  );
}
