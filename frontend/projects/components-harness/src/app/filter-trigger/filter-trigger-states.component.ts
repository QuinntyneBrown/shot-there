import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FilterTriggerComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/**
 * Filter triggers with no count (its click toggles aria-expanded, as the application does while its
 * sheet is open), a count of 2, disabled, and one on a raised sheet surface.
 */
@Component({
  selector: 'st-filter-trigger-states',
  imports: [FilterTriggerComponent, ActivationLogComponent],
  templateUrl: './filter-trigger-states.component.html',
  styleUrl: './filter-trigger-states.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterTriggerStatesComponent {
  protected readonly expanded = signal(false);
  protected readonly sheetExpanded = signal(false);
  protected readonly log = signal<readonly string[]>([]);

  protected toggle(): void {
    this.expanded.set(!this.expanded());
    this.log.update((log) => [...log, 'click: Filters']);
  }
}
