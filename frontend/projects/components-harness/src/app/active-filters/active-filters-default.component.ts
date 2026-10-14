import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActiveFiltersComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** Two active filters; removing and clearing log events. */
@Component({
  selector: 'st-active-filters-default',
  imports: [ActiveFiltersComponent, ActivationLogComponent],
  templateUrl: './active-filters-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveFiltersDefaultComponent {
  protected readonly log = signal<readonly string[]>([]);
  protected readonly filters = [{ key: 'hood:junction', label: 'Junction' }, { key: 'cyc', label: 'Cyc wall' }];
}
