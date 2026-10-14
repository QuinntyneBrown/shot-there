import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent, ButtonComponent } from '@shot-there/components';

/** Empty states: default with action, error with two actions, compact success, compact without icon. */
@Component({
  selector: 'st-empty-state-states',
  imports: [EmptyStateComponent, ButtonComponent],
  templateUrl: './empty-state-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateStatesComponent {}
