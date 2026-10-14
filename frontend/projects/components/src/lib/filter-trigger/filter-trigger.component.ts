import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/**
 * The DS filters trigger (.filter-trigger): the pill that opens the filters dialog below LG, with the
 * filters icon and, above 0, the active-filter count in a badge that joins its accessible name.
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
}
