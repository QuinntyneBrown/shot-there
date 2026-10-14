import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FilterTriggerComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** Filter triggers with no count (its click toggles aria-expanded), a count of 2, and disabled. */
@Component({
  selector: 'st-filter-trigger-states',
  imports: [FilterTriggerComponent, ActivationLogComponent],
  templateUrl: './filter-trigger-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTriggerStatesComponent {
  protected readonly expanded = signal(false);
  protected readonly log = signal<readonly string[]>([]);

  protected toggle(): void {
    this.expanded.set(!this.expanded());
    this.log.update((log) => [...log, 'click: Filters']);
  }
}
