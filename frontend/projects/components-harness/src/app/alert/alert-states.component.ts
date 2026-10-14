import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AlertComponent, ButtonComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** Alerts: warning with title and status role, info, danger with an action, dismissible success and a banner. */
@Component({
  selector: 'st-alert-states',
  imports: [AlertComponent, ButtonComponent, ActivationLogComponent],
  templateUrl: './alert-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertStatesComponent {
  protected readonly log = signal<readonly string[]>([]);
}
